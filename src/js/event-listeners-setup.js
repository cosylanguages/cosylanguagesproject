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
            let dayToUse = 1; 
            const singleDayValue = daySelectElement ? daySelectElement.value : "";
            if (singleDayValue) {
                dayToUse = parseInt(singleDayValue);
            } else {
                const dayFromValue = dayFromSelectElement ? dayFromSelectElement.value : "";
                if (dayFromValue) {
                    dayToUse = parseInt(dayFromValue);
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

    // --- Latinize Button Event Listener ---
    const latinizeButton = document.getElementById('toggle-latinization-btn');
    if (latinizeButton) {
        // Set initial text based on global state (which should be true)
        latinizeButton.textContent = window.isLatinizationActive ? 'Latinize: On' : 'Latinize: Off';

        latinizeButton.addEventListener('click', function() {
            window.isLatinizationActive = !window.isLatinizationActive;
            this.textContent = window.isLatinizationActive ? 'Latinize: On' : 'Latinize: Off';
            // If latinization is turned off, hide any existing tooltip
            if (!window.isLatinizationActive) {
                let tooltip = document.getElementById('transliteration-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            }
        });
    }

    // --- Text Selection Event Listener (for transliteration tooltip) ---
    document.addEventListener('mouseup', function(event) {
        if (typeof window.transliterateSelectedText === 'function') {
            const transliterated = window.transliterateSelectedText();
            let tooltip = document.getElementById('transliteration-tooltip');

            if (transliterated && transliterated.trim() !== "") {
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'transliteration-tooltip';
                    // Styles like position, padding, background, color, border, borderRadius, zIndex, fontSize, fontFamily, pointerEvents
                    // are now primarily handled by CSS in main.css.
                    // JS will still manage dynamic properties: display, left, top.
                    document.body.appendChild(tooltip);
                }
                tooltip.textContent = transliterated;
                // Position near mouse, with offset, ensuring it stays within viewport
                let x = event.clientX + 15;
                let y = event.clientY + 15;
                tooltip.style.left = x + 'px';
                tooltip.style.top = y + 'px';
                tooltip.style.display = 'block';
                
                // Check if tooltip is out of bounds and adjust
                const rect = tooltip.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    tooltip.style.left = (window.innerWidth - rect.width - 5) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    tooltip.style.top = (window.innerHeight - rect.height - 5) + 'px';
                }
                if (rect.left < 0) {
                    tooltip.style.left = '5px';
                }
                 if (rect.top < 0) {
                    tooltip.style.top = '5px';
                }

            } else {
                if (tooltip) {
                    tooltip.style.display = 'none'; // Hide if no (or empty) transliteration
                }
            }
        }
    });
    // Also hide tooltip on mousedown, as selection is likely changing
    document.addEventListener('mousedown', function() {
        let tooltip = document.getElementById('transliteration-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    });


    console.log("DEBUG: initializeEventListeners completed with new listeners.");
}

window.addEventListener('DOMContentLoaded', initializeEventListeners);
