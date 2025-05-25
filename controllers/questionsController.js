// const userimages = path.join('./public/assets/userImages/');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const csv = require('csv-parser');
const os = require('os');
const crypto = require('crypto');
const verifyAdminAccess = (req, res, next) => { next(); };
const Questions = require("../models/questionsModel");
const Admin = require("../models/adminModel");
const Category = require("../models/categoryModel");
const Quiz = require("../models/quizModel");

// Load questions
const loadQuestions = async (req, res) => {
    try {
        const categories = await Category.find({});
        const quizzes = await Quiz.find({});
        res.render('addQuestions',{category : categories, quiz : quizzes});
    } catch (error) {
        console.log(error.message);
    }
}

// Add questions
const addQuestions = async (req, res) => {
    try {
        let loginData = await Admin.find({});
        if (Array.isArray(loginData)) { // Check if loginData is an array
            for (let i in loginData) {
                if (String(loginData[i]._id) === req.session.user_id) {
                    if (loginData[i].is_admin == 1) {
                        let optionData = {};
                        let optionType;
                        if (req.body.question_type == "text_only") {
                            optionType = "text_only";
                            optionData = {
                                a: req.body.a,
                                b: req.body.b,
                                c: req.body.c,
                                d: req.body.d,
                            };
                        } else if (req.body.question_type == "true_false") {
                            optionType = "true_false";
                            optionData = {
                                answer: req.body.answer,
                            };
                        } else if (req.body.question_type == "images") {
                            optionType = "images";
                            optionData = {
                                a: req.body.img_a,
                                b: req.body.img_b,
                                c: req.body.img_c,
                                d: req.body.img_d,
                            };
                        } else if (req.body.question_type == "audio") {
                            optionType = "audio";
                            optionData = {
                                a: req.body.audio_a,
                                b: req.body.audio_b,
                                c: req.body.audio_c,
                                d: req.body.audio_d,
                            };
                        }

                        const QuestionsData = new Questions({
                            categoryId: req.body.categoryId,
                            quizId: req.body.quizId,
                            question_title: req.body.question_title,
                            image: optionType === "images" ? req.files.image[0].filename : undefined,
                            audio: optionType === "audio" ? req.files.audio[0].filename : undefined,
                            question_type: optionType,
                            option: optionData,
                            answer: req.body.answer,
                            description: req.body.description,
                            is_active: req.body.is_active == "on" ? 1 : 0
                        });
                        
                        const saveQuestions = await QuestionsData.save();
                        const categories = await Category.find({});
                        const quizzes = await Quiz.find({});
                        if (saveQuestions) {
                            return res.render('addQuestions', { category: categories, quiz: quizzes, message: "Questions Added Successfully..!!" });
                        } else {
                            return res.render('addQuestions', { message: "Questions Not Added..!!*" });
                        }
                    } else {
                        req.flash('error', 'You have no access to add Questions, You are not super admin !! *');
                        return res.redirect('back');
                    }
                }
            }
        } else {
            req.flash('error', 'Login data is not an array');
            return res.redirect('back');
        }

    } catch (error) {
        console.log(error.message);
        req.flash('error', 'An error occurred while adding questions');
        return res.redirect('back');
    }
}

// Add this new function for importing CSV
const importQuestionsCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // Process and save the data to MongoDB
                for (const row of results) {
                    let option = {};
                    if (row.question_type === "text_only" || row.question_type === "images" || row.question_type === "audio") {
                        option = {
                            a: row.option_a || row.image_a || row.audio_a,
                            b: row.option_b || row.image_b || row.audio_b,
                            c: row.option_c || row.image_c || row.audio_c,
                            d: row.option_d || row.image_d || row.audio_d,
                        };
                    } else if (row.question_type === "true_false") {
                        option = {
                            answer: row.answer,
                        };
                    }

                    // Handle image reference from CSV
                    let imagePath = null;
                    if (row.image) {
                        // Store the image filename or path as provided in the CSV
                        imagePath = row.image; 
                        // Since the source file is from CSV, we don't need to move it
                        // Just save the image reference directly
                    }

                    // Handle audio reference from CSV
                    let audioPath = null;
                    if (row.audio) {
                        // Store the audio filename or path as provided in the CSV
                        audioPath = row.audio;
                        // Since the source file is from CSV, we don't need to move it
                        // Just save the audio reference directly
                    }

                    const question = new Questions({
                        categoryId: req.body.categoryId,
                        quizId: req.body.quizId,
                        question_title: row.question_title,
                        question_type: row.question_type,
                        option: option,
                        answer: row.answer,
                        description: row.description,
                        is_active: 1,
                        image: imagePath || null, // Save the image reference as is
                        audio: audioPath || null  // Added for audio support
                    });
                    await question.save();

                    // Delete CSV file after processing
                        fs.unlink(req.file.path, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log('CSV file deleted successfully');
                            }
                        });
                }
                req.flash('message', 'Questions imported successfully');
                res.redirect('/view-questions');
            });
    } catch (error) {
        console.log(error.message);
        req.flash('error', `An error occurred while importing questions: ${error.message}`);
        res.redirect('/view-questions');
    }
}

// Sample CSV Format
const sampleCSVFormat = async (req, res) => {
    try {
        // Define headers for the CSV
        const headers = [
            "question_type",
            "question_title",
            "option.a",
            "option.b",
            "option.c",
            "option.d",
            "answer",
            "description",
            "image"
        ].join(',');

        // Create sample data rows
        const sampleRows = [
            // Text Only Question
            [
                "text_only",
                "What is the capital of France?",
                "Paris",
                "London",
                "Berlin",
                "Madrid",
                "Paris",
                "Basic geography question",
                ""
            ].join(','),

            // True/False Question
            [
                "true_false",
                "The Earth is flat?",
                "TRUE",
                "FALSE",
                "",
                "",
                "FALSE",
                "Basic science question",
                ""
            ].join(','),

            // Image Question
            [
                "images",
                "Count the number of squares in the given figure",
                "32",
                "30",
                "29",
                "28",
                "32",
                "Count total squares in the image",
                "square_image.jpg"
            ].join(','),

            // Audio Question
            [
                "audio",
                "First Question of Audio",
                "test 1",
                "test 2",
                "test 3",
                "test 4",
                "test 2",
                "Listen to the audio and select correct option",
                "audio1.mp3"
            ].join(',')
        ];

        // Combine headers and rows
        const csvContent = [headers, ...sampleRows].join('\n');

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=questions_format.csv');

        // Send CSV content
        res.send(csvContent);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};

// const importQuestionsCSV = async (req, res) => {
//     try {
//         console.log('Starting CSV import process');

//         if (!req.file) {
//             console.log('No file uploaded');
//             return res.status(400).send('No file uploaded.');
//         }

//         const IMAGE_BASE_PATH = path.join(__dirname, '..', 'public', 'userImages');
//         const DOWNLOADS_FOLDER = path.join(os.homedir(), 'Downloads');

//         console.log(`Image base path: ${IMAGE_BASE_PATH}`);
//         console.log(`Downloads folder: ${DOWNLOADS_FOLDER}`);

//         // Ensure userImages directory exists
//         await fsPromises.mkdir(IMAGE_BASE_PATH, { recursive: true });

//         const results = [];
//         await new Promise((resolve, reject) => {
//             fs.createReadStream(req.file.path)
//                 .pipe(csv())
//                 .on('data', (data) => results.push(data))
//                 .on('end', () => {
//                     console.log(`Parsed ${results.length} rows from CSV`);
//                     resolve();
//                 })
//                 .on('error', (error) => {
//                     console.error('Error parsing CSV:', error);
//                     reject(error);
//                 });
//         });

//         console.log('Starting to process individual rows');

//         for (const row of results) {
//             console.log(`Processing row: ${JSON.stringify(row)}`);

//             let option = {};
//             if (["text_only", "images", "audio"].includes(row.question_type)) {
//                 option = {
//                     a: row.option_a || row.image_a || row.audio_a,
//                     b: row.option_b || row.image_b || row.audio_b,
//                     c: row.option_c || row.image_c || row.audio_c,
//                     d: row.option_d || row.image_d || row.audio_d,
//                 };
//             } else if (row.question_type === "true_false") {
//                 option = {
//                     answer: row.answer,
//                 };
//             }
//             let imagePath = null;
//             if (row.image) {
//                 const sourceImagePath = path.join(DOWNLOADS_FOLDER, row.image);
//                 const destImagePath = path.join(__dirname, '..', 'public', 'assets', 'userImages', row.image); // Store image in public/assets/userImages folder
                
//                 try {
//                     console.log(`Attempting to copy image from ${sourceImagePath} to ${destImagePath}`);
//                     await fsPromises.access(sourceImagePath);
//                     await fsPromises.copyFile(sourceImagePath, destImagePath);
//                     imagePath = `${row.image}`; // Path remains the same as it reflects the correct folder structure
//                     console.log(`Successfully copied image to ${imagePath}`);
//                 } catch (err) {
//                     console.error(`Failed to copy image ${row.image}:`, err);
//                 }
//             }

//             if (row.audio) {
//                 const sourceAudioPath = path.join(DOWNLOADS_FOLDER, row.audio);
//                 const destAudioPath = path.join(__dirname, '..', 'public', 'assets', 'userImages', row.audio); // Store audio in public/assets/userAudios folder
                
//                 try {
//                     console.log(`Attempting to copy audio from ${sourceAudioPath} to ${destAudioPath}`);
//                     await fsPromises.access(sourceAudioPath);
//                     await fsPromises.copyFile(sourceAudioPath, destAudioPath);
//                     console.log(`Successfully copied audio to ${row.audio}`);
//                 } catch (err) {
//                     console.error(`Failed to copy audio ${row.audio}:`, err);
//                 }
//             }

//             try {
//                 const question = new Questions({
//                     categoryId: req.body.categoryId,
//                     quizId: req.body.quizId,
//                     question_title: row.question_title,
//                     question_type: row.question_type,
//                     option: option,
//                     answer: row.answer,
//                     description: row.description,
//                     is_active: row.is_active === 'TRUE' ? 1 : 0,
//                     image: imagePath,
//                     audio: row.audio || null
//                 });
//                 await question.save();
//                 console.log(`Saved question: ${question._id}`);
//             } catch (err) {
//                 console.error('Error saving question:', err);
//             }
//         }

//         console.log('CSV import process completed');
//         req.flash('message', 'Questions imported successfully');
//         res.redirect('/view-questions');
//     } catch (error) {
//         console.error('Error in importQuestionsCSV:', error);
//         req.flash('error', `An error occurred while importing questions: ${error.message}`);
//         res.redirect('/view-questions');
//     } finally {
//         if (req.file && req.file.path) {
//             try {
//                 await fsPromises.unlink(req.file.path);
//                 console.log(`Deleted temporary file: ${req.file.path}`);
//             } catch (unlinkError) {
//                 console.error('Error deleting temporary file:', unlinkError);
//             }
//         }
//     }
// };


// View questions
const viewQuestions = async (req, res) => {
    try {
        await verifyAdminAccess(req, res, async () => {
            let loginData = await Admin.findById({_id: req.session.user_id});
            const QuizData = await Quiz.find();
            const CategoryData = await Category.find();
            const QuestionsData = await Questions.find().populate(['categoryId','quizId']).sort({updatedAt: -1});
            res.render('viewQuestions',{questions:QuestionsData,loginData: loginData,quiz:QuizData,category:CategoryData});
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Edit questions
const editQuestions = async (req, res) => {
    try {

        const id = req.query.id;
        const category = await Category.find();
        const quizzes = await Quiz.find({});
        const editData = await Questions.findById({ _id: id }).populate('categoryId');

        if (editData) {
            res.render('editQuestions', { editdata: editData,category:category,quiz:quizzes});
        }
        else {
            res.render('editQuestions', { message: 'Questions Not Added' });
        }

    } catch (error) {
        console.log(error.message);
    }
}

// Update questions
const UpdateQuestions = async(req,res)=> {
    try {
        let loginData = await Admin.findById({_id:req.session.user_id});
        if (loginData.is_admin == 1) {
            const id = req.body.id;
            let optionData = {};
            let optionType;
            if (req.body.question_type == "text_only") {
                optionType = "text_only";
                optionData = {
                    a: req.body.a,
                    b: req.body.b,
                    c: req.body.c,
                    d: req.body.d,
                };

            } else if (req.body.question_type == "true_false") {
                optionType = "true_false";
                optionData = {
                    answer: req.body.answer,
                };
            } else if (req.body.question_type == "images") {
                optionType ="images";
                optionData = {
                    a: req.body.img_a,
                    b: req.body.img_b,
                    c: req.body.img_c,
                    d: req.body.img_d,
                };
            }
            else if (req.body.question_type == "audio") {
                optionType = "audio";
                optionData = {
                    a: req.body.audio_a,
                    b: req.body.audio_b,
                    c: req.body.audio_c,
                    d: req.body.audio_d,
                };
            }
            if (req.files.image || req.files.audio) {
                const UpdateQuestions = await Questions.findByIdAndUpdate({ _id: id },
                    {
                        $set:
                        {
                            categoryId: req.body.categoryId,
                            quizId: req.body.quizId,
                            question_title: req.body.question_title,
                            image: optionType === "images" ? req.files.image[0].filename : undefined,
                            audio: optionType === "audio" ? req.files.audio[0].filename : undefined,
                            question_type : optionType,
                            option: optionData,
                            answer: req.body.answer,
                            description: req.body.description
                        }
                    });
                const saveQuestions = await UpdateQuestions.save();
                res.redirect('/view-questions');
            }
            else{
                const UpdateQuestions = await Questions.findByIdAndUpdate({ _id: id },
                    {
                        $set:
                        {
                            categoryId: req.body.categoryId,
                            quizId: req.body.quizId,
                            question_title: req.body.question_title,
                            question_type : optionType,
                            option: optionData,
                            answer: req.body.answer,
                            description: req.body.description
                        }
                    });
                const saveQuestions = await UpdateQuestions.save();
                res.redirect('/view-questions');
            }
        }
        else {
            req.flash('error', 'You have no access to edit quiz , You are not super admin !! *');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Delete questions
const deleteQuestions = async(req,res)=> {
    try {
        const id = req.query.id;
        const deleteQuestions = await Questions.deleteOne({_id:id});
        res.redirect('back');
        
    } catch (error) {
        console.log(error.message); 
    }
}

// Active status
const activeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await Questions.findById(id);
        const is_active = req.body.is_active ? req.body.is_active : "false";
        if (!status) {
            return res.sendStatus(404);
        }
        status.is_active = !status.is_active;
        await status.save();
        res.redirect('/view-questions');

    } catch (err) {

        console.error(err);
        res.sendStatus(500);

    }
}

module.exports = {
    loadQuestions,
    addQuestions,
    viewQuestions,
    importQuestionsCSV,
    editQuestions,
    UpdateQuestions,
    deleteQuestions,
    activeStatus,
    sampleCSVFormat
}
