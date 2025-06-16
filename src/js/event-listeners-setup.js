import AudioFeedback from './audio-feedback.js';
// Event Listeners Setup (Core Logic)

// Placeholder stub for updateGrammarOptions
function updateGrammarOptions() { 
    console.log("DEBUG: updateGrammarOptions called (stub)"); 
}

function populateDaysDropdowns() {
    const daySelect = document.getElementById('day');
    const dayFromSelect = document.getElementById('day-from');
    const dayToSelect = document.getElementById('day-to');

    if (daySelect && dayFromSelect && dayToSelect) {
        for (let i = 1; i <= 30; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Day ${i}`;
            daySelect.appendChild(option.cloneNode(true));
            dayFromSelect.appendChild(option.cloneNode(true));
            dayToSelect.appendChild(option.cloneNode(true));
        }
    }
}

function initializeEventListeners() {
    console.log("DEBUG: initializeEventListeners called");

    populateDaysDropdowns();

    // restoreUserSelection is expected to be global (from index.html)
    restoreUserSelection(); 

    // From ui-visibility.js
    goBackToMainMenu(); 

    // From ui-visibility.js (or index.html if not moved)
    updateDaySelectors(); 
    
    const languageSelectElement = document.getElementById('language');
    const daySelectElement = document.getElementById('day');
    const dayFromSelectElement = document.getElementById('day-from');
    const dayToSelectElement = document.getElementById('day-to');
    const grammarOptionsElement = document.getElementById('grammar-options');

    if (languageSelectElement) {
        languageSelectElement.addEventListener('change', function() {
            AudioFeedback.playSelectSound();
            const lang = this.value;

            // Determine current day for context
            // This logic is for updateUIVisibilityForDay, which needs a specific day.
            let dayToUse = 1; // Default day
            const singleDayValue = daySelectElement ? daySelectElement.value : "";
            if (singleDayValue) {
                dayToUse = parseInt(singleDayValue);
            } else {
                const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                if (dayFromValue) {
                    dayToUse = parseInt(dayFromValue);
                }
            }

            // Call for UI visibility update based on day and language
            // from ui-visibility.js
            updateUIVisibilityForDay(dayToUse, lang);

            // Update grammar options if they are visible
            // updateGrammarOptions (from ui-visibility.js or index.html) should internally get current language and day
            if (grammarOptionsElement && grammarOptionsElement.style.display === 'block') {
                updateGrammarOptions();
            }
            // Note: saveUserSelection, body class update, and the main updateUIForLanguage(lang) call
            // are assumed to be handled by listeners in index.html and language-handler.js
            // that could not be removed or fully consolidated.
        });
    }

    const daySelectors = [daySelectElement, dayFromSelectElement, dayToSelectElement];
    daySelectors.forEach(selector => {
        if (selector) {
            selector.addEventListener('change', function() {
                AudioFeedback.playSelectSound();
                // from ui-visibility.js or index.html
                updateDaySelectors(); 
                
                const currentLanguage = languageSelectElement ? languageSelectElement.value : 'COSYenglish';
                let dayToUseForVisibility = 1;
                const singleDayValue = daySelectElement ? daySelectElement.value : "";

                if (singleDayValue) {
                    dayToUseForVisibility = parseInt(singleDayValue);
                } else {
                    const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                    if (dayFromValue) {
                        dayToUseForVisibility = parseInt(dayFromValue);
                    }
                }

                // from ui-visibility.js
                updateUIVisibilityForDay(dayToUseForVisibility, currentLanguage);

                if (grammarOptionsElement && grammarOptionsElement.style.display === 'block') {
                    // from ui-visibility.js or index.html
                    updateGrammarOptions();
                }
            });
        }
    });
    
    // Call other init functions
    // from buttons.js
    initButtons();

    // from exercises/vocabulary.js
    initVocabularyPractice();

    // from exercises/grammar.js
    initGrammarPractice();
    
    // Initial UI visibility update based on the (potentially restored) language and default/restored day
    const initialDayValue = daySelectElement ? daySelectElement.value : ""; 
    const initialDay = initialDayValue && initialDayValue !== "" ? parseInt(initialDayValue) : 1; 
    const initialLang = languageSelectElement ? (languageSelectElement.value || 'COSYenglish') : 'COSYenglish';
    // from ui-visibility.js
    updateUIVisibilityForDay(initialDay, initialLang);

    console.log("DEBUG: initializeEventListeners completed.");
}

window.addEventListener('DOMContentLoaded', initializeEventListeners);
