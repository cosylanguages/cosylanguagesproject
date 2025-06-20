// Event Listeners Setup (Core Logic)

// Placeholder stub for updateGrammarOptions
function updateGrammarOptions() { 
    // console.log("DEBUG: updateGrammarOptions called (stub)");  // Debug log removed
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
    // console.log("DEBUG: initializeEventListeners called"); // Debug log removed

    populateDaysDropdowns();

    // restoreUserSelection is expected to be global (from index.html)
    if (typeof restoreUserSelection === 'function') {
        restoreUserSelection(); 
    }

    // From ui-visibility.js
    if (typeof goBackToMainMenu === 'function') {
        goBackToMainMenu(); 
    }

    // From ui-visibility.js (or index.html if not moved)
    if (typeof updateDaySelectors === 'function') {
        updateDaySelectors(); 
    }
    
    const languageSelectElement = document.getElementById('language');
    const daySelectElement = document.getElementById('day');
    const dayFromSelectElement = document.getElementById('day-from');
    const dayToSelectElement = document.getElementById('day-to');
    const grammarOptionsElement = document.getElementById('grammar-options');

    if (languageSelectElement) {
        languageSelectElement.addEventListener('change', function() {
            const lang = this.value;

            // Save or remove language and day selections from localStorage
            if (lang) { // Only save if a real language is selected
                localStorage.setItem('selectedLanguage', lang);
                // Persist day selections as well
                if (daySelectElement) localStorage.setItem('selectedDay', daySelectElement.value);
                if (dayFromSelectElement) localStorage.setItem('selectedDayFrom', dayFromSelectElement.value);
                if (dayToSelectElement) localStorage.setItem('selectedDayTo', dayToSelectElement.value);
            } else {
                // If "Your Language" is chosen, clear the saved language
                localStorage.removeItem('selectedLanguage');
                // Optionally clear day selections
                localStorage.removeItem('selectedDay');
                localStorage.removeItem('selectedDayFrom');
                localStorage.removeItem('selectedDayTo');
            }

            // Call updateUIForLanguage from language-handler.js
            // This is already called by the listener in language-handler.js, so ensure no conflict or redundancy.
            // For clarity and consolidation, it's better if language-handler.js's own listener calls updateUIForLanguage and refreshLatinization.
            // This event-listeners-setup.js listener should primarily focus on OTHER UI changes tied to language if any,
            // or this entire block could be refactored/removed if language-handler.js handles all necessary UI updates.
            // For now, assuming language-handler.js handles the main text translations and latinizer refresh.

            // UI visibility updates specific to event-listeners-setup.js
            let dayToUse = 1; 
            const singleDayValue = daySelectElement ? daySelectElement.value : "";
            if (singleDayValue) {
                dayToUse = parseInt(singleDayValue) || 1; // Ensure fallback if NaN
            } else {
                const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                if (dayFromValue) {
                    dayToUse = parseInt(dayFromValue) || 1; // Ensure fallback if NaN
                }
            }
            if (typeof updateUIVisibilityForDay === 'function') {
                updateUIVisibilityForDay(dayToUse, lang);
            }
            if (grammarOptionsElement && grammarOptionsElement.style.display === 'block' && typeof updateGrammarOptions === 'function') {
                updateGrammarOptions();
            }
        });
    }

    const daySelectors = [daySelectElement, dayFromSelectElement, dayToSelectElement];
    daySelectors.forEach(selector => {
        if (selector) {
            selector.addEventListener('change', function() {
                if (typeof updateDaySelectors === 'function') {
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
                if (typeof updateUIVisibilityForDay === 'function') {
                    updateUIVisibilityForDay(dayToUseForVisibility, currentLanguage);
                }
                if (grammarOptionsElement && grammarOptionsElement.style.display === 'block' && typeof updateGrammarOptions === 'function') {
                    updateGrammarOptions();
                }
            });
        }
    });
    
    // Call other init functions
    if (typeof initButtons === 'function') {
        initButtons();
    }
    if (typeof initVocabularyPractice === 'function') {
        initVocabularyPractice();
    }
    if (typeof initGrammarPractice === 'function') {
        initGrammarPractice();
    }
    
    // Initial UI visibility update
    const initialDayValue = daySelectElement ? daySelectElement.value : ""; 
    const initialDay = initialDayValue && initialDayValue !== "" ? parseInt(initialDayValue) : 1; 
    const initialLang = languageSelectElement ? (languageSelectElement.value || 'COSYenglish') : 'COSYenglish';
    if (typeof updateUIVisibilityForDay === 'function') {
        updateUIVisibilityForDay(initialDay, initialLang);
    }

    // Latinization button functionality is now handled by src/js/latinizer.js
    // Text selection transliteration tooltip functionality is being removed.

    // console.log("DEBUG: initializeEventListeners completed."); // Debug log removed
}

window.addEventListener('DOMContentLoaded', initializeEventListeners);
