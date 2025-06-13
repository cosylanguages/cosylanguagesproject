// Event Listeners Setup (Core Logic)

function setupCoreEventListeners() {
    console.log("DEBUG: setupCoreEventListeners called");

    const daySelectElement = document.getElementById('day');
    const dayFromSelectElement = document.getElementById('day-from');
    const dayToSelectElement = document.getElementById('day-to');
    const languageSelectElement = document.getElementById('language');
    const grammarOptionsElement = document.getElementById('grammar-options'); // Used in original listeners

    // This function is intended to be called AFTER the main DOMContentLoaded in index.html
    // has run restoreUserSelection() and goBackToMainMenu().
    
    const initialDayValue = daySelectElement ? daySelectElement.value : ""; 
    const initialDay = initialDayValue && initialDayValue !== "" ? parseInt(initialDayValue) : 1; 
    const initialLang = languageSelectElement ? (languageSelectElement.value || 'COSYenglish') : 'COSYenglish';
    
    if (typeof updateUIVisibilityForDay === 'function') {
        updateUIVisibilityForDay(initialDay, initialLang);
    } else {
        console.error("updateUIVisibilityForDay function is not defined. UI Visibility will not be updated on load from event-listeners-setup.js.");
    }

    // Event listener for single day selection
    if (daySelectElement) {
        daySelectElement.addEventListener('change', function() {
            // The original listener in index.html handles updateDaySelectors and potentially updateGrammarOptions.
            // This adds the call to updateUIVisibilityForDay.
            if (this.value) { 
                const currentLanguage = languageSelectElement ? languageSelectElement.value : 'COSYenglish';
                if (typeof updateUIVisibilityForDay === 'function') {
                    updateUIVisibilityForDay(parseInt(this.value), currentLanguage);
                }
            }
        });
    }

    // Event listener for language selection
    if (languageSelectElement) {
        languageSelectElement.addEventListener('change', function() {
            // The original listener in index.html handles flag, updateUIForLanguage, saveUserSelection.
            // This adds the call to updateUIVisibilityForDay.
            const lang = this.value;
            const currentDayValue = daySelectElement ? daySelectElement.value : "";
            let dayToUse = 1; // Default day

            if (currentDayValue) {
                dayToUse = parseInt(currentDayValue);
            } else {
                const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                if (dayFromValue) {
                    dayToUse = parseInt(dayFromValue);
                }
            }
            if (typeof updateUIVisibilityForDay === 'function') {
                updateUIVisibilityForDay(dayToUse, lang);
            }
        });
    }
    
    // Event listeners for day range selectors
    [dayFromSelectElement, dayToSelectElement].forEach(el => {
        if (el) {
            el.addEventListener('change', function() {
                // The original listeners in index.html handle updateGrammarOptions if grammar is visible.
                // This adds the call to updateUIVisibilityForDay.
                const currentLanguage = languageSelectElement ? languageSelectElement.value : 'COSYenglish';
                let dayToUseForVisibility = 1; // Default

                const singleDayValue = daySelectElement ? daySelectElement.value : "";
                if (singleDayValue) { // If single day is selected, it dictates visibility
                    dayToUseForVisibility = parseInt(singleDayValue);
                } else { // Otherwise, use the 'from' value of the range
                    const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                    if (dayFromValue) {
                        dayToUseForVisibility = parseInt(dayFromValue);
                    }
                }
                if (typeof updateUIVisibilityForDay === 'function') {
                    updateUIVisibilityForDay(dayToUseForVisibility, currentLanguage);
                }
            });
        }
    });
}

// IMPORTANT: This script assumes that by the time setupCoreEventListeners is called,
// the DOM is loaded, and other global functions (like updateDaySelectors, updateGrammarOptions,
// restoreUserSelection, goBackToMainMenu, updateUIForLanguage, saveUserSelection) are available from index.html.
// The function updateUIVisibilityForDay is expected from ui-visibility.js, loaded before this.
// This setupCoreEventListeners function itself needs to be called, typically from index.html's DOMContentLoaded.
