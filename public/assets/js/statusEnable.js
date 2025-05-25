
// This script is used to enable/disable a status using AJAX
document.addEventListener('DOMContentLoaded', function () {
    // For is_enabled checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('click', function (event) {
            const form = checkbox.closest('form');
            if (form) {
                const fieldName = form.querySelector('[name="title"]').value;

                // Prompt the user for confirmation
                if (!confirm(`Are you sure you want to ${checkbox.checked ? 'Enable' : 'Disable'} ${fieldName}?`)) {
                    // If the user clicks "Cancel," prevent the checkbox from changing
                    event.preventDefault();
                    return;
                }

                const formData = new FormData(form);
                $.ajax({
                    type: "POST",
                    url: form.action,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        // Handle the success response data here
                        console.log(data);
                    },
                    error: function (error) {
                        console.error('Error:', error);
                    }
                });
            }
        });
    });

    // For is_active button
    const activeButtons = document.querySelectorAll('button[type="submit"]');
    activeButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            const form = button.closest('form');
            const fieldName = form.querySelector('[name="title"]').value;
            console.log(fieldName);

            // Prompt the user for confirmation
            if (!confirm(`Are you sure you want to ${button.textContent.trim()} ${fieldName}?`)) {
                // If the user clicks "Cancel," prevent the form submission
                event.preventDefault();
                return;
            }

            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the success response data here
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});