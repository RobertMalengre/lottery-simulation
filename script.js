document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');
    const circles = document.querySelectorAll('.circles .circle');
    const ballsError = document.querySelector('.balls-error');
    const maxSelections = 6;

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelection);
    });

    function updateSelection() {
        const selectedCheckboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]:checked');
        
        if (selectedCheckboxes.length > maxSelections) {
            this.checked = false; // Prevent selecting the 7th checkbox
            ballsError.style.visibility = 'visible';
            return;
        } else {
            ballsError.style.visibility = 'hidden';
        }

        // Reset all circles to the default color
        circles.forEach(circle => circle.style.backgroundColor = '#007bff');

        // Change the background color of the circles based on the selection
        for (let i = 0; i < selectedCheckboxes.length; i++) {
            circles[circles.length - 1 - i].style.backgroundColor = 'white';
        }
    }
});