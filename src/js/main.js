// src/js/main.js

/**
 * Initializes the application.
 * This function is the main entry point for JavaScript execution after the DOM is loaded.
 */
function initializeApp() {
    console.log("DEBUG: Initializing application via main.js");

    // Call the main event listener setup function
    if (typeof initializeEventListeners === 'function') {
        initializeEventListeners();
    } else {
        console.error("Error: initializeEventListeners function not found. Application cannot start properly.");
        // Optionally, display an error message to the user in the UI
        const resultArea = document.getElementById('result');
        if (resultArea) {
            resultArea.innerHTML = '<p style="color: red; font-weight: bold;">Error: Application core components failed to load. Please try refreshing the page.</p>';
        }
    }

    // Other application-wide initializations can be added here in the future.
    // For example, setting up global error handlers, analytics, etc.
}

// Add event listener to start the app once the DOM is fully loaded
window.addEventListener('DOMContentLoaded', initializeApp);
[end of src/js/main.js]
