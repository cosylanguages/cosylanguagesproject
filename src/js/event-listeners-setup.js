// Event Listeners Setup (Core Logic)

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
    if (typeof restoreUserSelection === 'function') {
        restoreUserSelection(); 
    } else {
        console.warn("initializeEventListeners: restoreUserSelection is not defined. User selections may not be restored.");
        // Fallback: update UI for default language if restoreUserSelection isn't there
        const languageSelectElementForFallback = document.getElementById('language');
        const initialLangForFallback = languageSelectElementForFallback ? (languageSelectElementForFallback.value || 'COSYenglish') : 'COSYenglish';
        if (typeof updateUIForLanguage === 'function') { // updateUIForLanguage is from language-handler.js
            updateUIForLanguage(initialLangForFallback);
        }
    }

    if (typeof goBackToMainMenu === 'function') { // From ui-visibility.js
        goBackToMainMenu(); 
    } else {
        console.error("initializeEventListeners: goBackToMainMenu is not defined.");
    }

    if (typeof updateDaySelectors === 'function') { // From ui-visibility.js (or index.html if not moved)
        updateDaySelectors(); 
    } else {
        console.error("initializeEventListeners: updateDaySelectors is not defined.");
    }
    
    const languageSelectElement = document.getElementById('language');
    const daySelectElement = document.getElementById('day');
    const dayFromSelectElement = document.getElementById('day-from');
    const dayToSelectElement = document.getElementById('day-to');
    const grammarOptionsElement = document.getElementById('grammar-options');

    if (languageSelectElement) {
        languageSelectElement.addEventListener('change', function() {
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
            if (typeof updateUIVisibilityForDay === 'function') { // from ui-visibility.js
                updateUIVisibilityForDay(dayToUse, lang);
            }

            // Update grammar options if they are visible
            // updateGrammarOptions (from ui-visibility.js or index.html) should internally get current language and day
            if (grammarOptionsElement && grammarOptionsElement.style.display === 'block') {
                if (typeof updateGrammarOptions === 'function') { 
                    updateGrammarOptions();
                }
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
                if (typeof updateDaySelectors === 'function') { // from ui-visibility.js or index.html
                    updateDaySelectors(); 
                }
                
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

                if (typeof updateUIVisibilityForDay === 'function') { // from ui-visibility.js
                    updateUIVisibilityForDay(dayToUseForVisibility, currentLanguage);
                }

                if (grammarOptionsElement && grammarOptionsElement.style.display === 'block') {
                    if (typeof updateGrammarOptions === 'function') { // from ui-visibility.js or index.html
                        updateGrammarOptions();
                    }
                }
            });
        }
    });
    
    // Call other init functions
    if (typeof initButtons === 'function') { // from buttons.js
        initButtons();
    } else {
        console.error("initializeEventListeners: initButtons is not defined.");
    }

    if (typeof initVocabularyPractice === 'function') { // from exercises/vocabulary.js
        initVocabularyPractice();
    } else {
        console.error("initializeEventListeners: initVocabularyPractice is not defined.");
    }

    if (typeof initGrammarPractice === 'function') { // from exercises/grammar.js
        initGrammarPractice();
    } else {
        console.error("initializeEventListeners: initGrammarPractice is not defined.");
    }
    
    // Initial UI visibility update based on the (potentially restored) language and default/restored day
    const initialDayValue = daySelectElement ? daySelectElement.value : ""; 
    const initialDay = initialDayValue && initialDayValue !== "" ? parseInt(initialDayValue) : 1; 
    const initialLang = languageSelectElement ? (languageSelectElement.value || 'COSYenglish') : 'COSYenglish';
    if (typeof updateUIVisibilityForDay === 'function') { // from ui-visibility.js
        updateUIVisibilityForDay(initialDay, initialLang);
    }

    console.log("DEBUG: initializeEventListeners completed.");
}

window.addEventListener('DOMContentLoaded', initializeEventListeners);
