// Event Listeners Setup (Core Logic)

// Placeholder stub for updateGrammarOptions
function updateGrammarOptions() { 
    // console.log("DEBUG: updateGrammarOptions called (stub)");
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
    console.log("[DEBUG] initializeEventListeners: Function called."); // Debug log added

    populateDaysDropdowns();

    if (typeof restoreUserSelection === 'function') {
        console.log("[DEBUG] initializeEventListeners: Calling restoreUserSelection().");
        restoreUserSelection(); 
    } else {
        console.error("[DEBUG] initializeEventListeners: restoreUserSelection IS NOT a function!");
    }

    if (typeof goBackToMainMenu === 'function') {
        console.log("[DEBUG] initializeEventListeners: Calling goBackToMainMenu().");
        goBackToMainMenu(); 
    } else {
        console.error("[DEBUG] initializeEventListeners: goBackToMainMenu IS NOT a function!");
    }

    if (typeof window.updateDaySelectorsVisibility === 'function') { 
        console.log("[DEBUG] initializeEventListeners: Calling updateDaySelectorsVisibility(true).");
        window.updateDaySelectorsVisibility(true); 
    } else {
        console.error("[DEBUG] initializeEventListeners: updateDaySelectorsVisibility IS NOT a function!");
    }
    
    const languageSelectElement = document.getElementById('language');
    const daySelectElement = document.getElementById('day');
    const dayFromSelectElement = document.getElementById('day-from');
    const dayToSelectElement = document.getElementById('day-to');
    const grammarOptionsElement = document.getElementById('grammar-options');

    if (languageSelectElement) {
        languageSelectElement.addEventListener('change', function() {
            console.log("[DEBUG] initializeEventListeners: Language changed to " + this.value);
            const lang = this.value;
            if (lang) { 
                localStorage.setItem('selectedLanguage', lang);
            } else {
                localStorage.removeItem('selectedLanguage');
            }

            let dayToUse = 1; 
            const singleDayValue = daySelectElement ? daySelectElement.value : "";
            if (singleDayValue) {
                dayToUse = parseInt(singleDayValue) || 1;
            } else {
                const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                if (dayFromValue) {
                    dayToUse = parseInt(dayFromValue) || 1;
                }
            }
            if (typeof updateUIVisibilityForDay === 'function') {
                console.log("[DEBUG] initializeEventListeners: Language change - Calling updateUIVisibilityForDay().");
                updateUIVisibilityForDay(dayToUse, lang);
            }
            if (grammarOptionsElement && grammarOptionsElement.style.display === 'block' && typeof updateGrammarOptions === 'function') {
                console.log("[DEBUG] initializeEventListeners: Language change - Calling updateGrammarOptions().");
                updateGrammarOptions();
            }
        });
    }

    const daySelectors = [daySelectElement, dayFromSelectElement, dayToSelectElement];
    daySelectors.forEach(selector => {
        if (selector) {
            selector.addEventListener('change', function() {
                console.log("[DEBUG] initializeEventListeners: Day selector changed.");
                if (typeof window.updateDaySelectorsVisibility === 'function') {
                    console.log("[DEBUG] initializeEventListeners: Day change - Calling updateDaySelectorsVisibility(false).");
                    window.updateDaySelectorsVisibility(false); 
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
                     console.log("[DEBUG] initializeEventListeners: Day change - Calling updateUIVisibilityForDay().");
                    updateUIVisibilityForDay(dayToUseForVisibility, currentLanguage);
                }
                if (grammarOptionsElement && grammarOptionsElement.style.display === 'block' && typeof updateGrammarOptions === 'function') {
                     console.log("[DEBUG] initializeEventListeners: Day change - Calling updateGrammarOptions().");
                    updateGrammarOptions();
                }
            });
        }
    });
    
    if (typeof initButtons === 'function') {
        console.log("[DEBUG] initializeEventListeners: Calling initButtons().");
        initButtons();
    } else {
        console.error("[DEBUG] initializeEventListeners: initButtons IS NOT a function!");
    }
    if (typeof initVocabularyPractice === 'function') {
        console.log("[DEBUG] initializeEventListeners: Calling initVocabularyPractice().");
        initVocabularyPractice();
    } else {
        console.error("[DEBUG] initializeEventListeners: initVocabularyPractice IS NOT a function!");
    }
    if (typeof initGrammarPractice === 'function') {
        console.log("[DEBUG] initializeEventListeners: Calling initGrammarPractice().");
        initGrammarPractice();
    } else {
        console.error("[DEBUG] initializeEventListeners: initGrammarPractice IS NOT a function!");
    }
    // Assuming initSpeakingPractice and initWritingPractice are called from their respective files on DOMContentLoaded.
    // If they also need to be called here, add similar checks.

    const resultArea = document.getElementById('result');
    if (resultArea) {
        resultArea.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                if (event.target.classList.contains('exercise-input')) {
                    const specificSelectors = [
                        '.opposites-exercise',    
                        '.image-exercise',        
                        '.transcribe-word-exercise',
                        '.fill-gap-exercise', // Added for FillGaps
                        '.gender-exercise', // Added for showArticleWord (if input based)
                        '.verb-exercise' // Added for showTypeVerb
                    ].join(', ');

                    const containerWithCheckAnswer = event.target.closest(specificSelectors);

                    if (containerWithCheckAnswer && typeof containerWithCheckAnswer.checkAnswer === 'function') {
                        console.log(`[DEBUG] Enter key: Calling checkAnswer on container for input:`, event.target);
                        containerWithCheckAnswer.checkAnswer();
                    } else {
                        console.warn('[DEBUG] Enter key on exercise-input, but no checkAnswer method found on a suitable parent container:', event.target);
                    }
                }
            }
        });
    }
    
    const initialDayValue = daySelectElement ? daySelectElement.value : ""; 
    const initialDay = initialDayValue && initialDayValue !== "" ? parseInt(initialDayValue) : 1; 
    const initialLang = languageSelectElement ? (languageSelectElement.value || 'COSYenglish') : 'COSYenglish';
    if (typeof updateUIVisibilityForDay === 'function') {
        console.log("[DEBUG] initializeEventListeners: Calling initial updateUIVisibilityForDay().");
        updateUIVisibilityForDay(initialDay, initialLang);
    }

    console.log("[DEBUG] initializeEventListeners: Function completed.");
}

window.addEventListener('DOMContentLoaded', initializeEventListeners);
