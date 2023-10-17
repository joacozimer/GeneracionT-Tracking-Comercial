// Get a reference to the date input element
const dateInput = document.getElementById("FormTimeProjectInput");

// Set the current date in the format "YYYY-MM-DD"
const today = new Date().toISOString().split('T')[0];

// Set the minimum attribute of the input field to today
dateInput.setAttribute("min", today);

// Add an event listener to prevent selecting dates before today
dateInput.addEventListener("input", function() {
    if (dateInput.value < today) {
        dateInput.value = today;
    }
});