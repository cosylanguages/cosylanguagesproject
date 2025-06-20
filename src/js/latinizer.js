// src/js/latinizer.js
document.addEventListener('DOMContentLoaded', () => {
    try {
        const latinizeBtn = document.getElementById('toggle-latinization-btn');
        const languageSelect = document.getElementById('language');
        const latinizableLanguages = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական']; // Define once

        if (!latinizeBtn) {
            console.warn('Latinize button not found.');
            return;
        }

        let isLatinized = false;
        localStorage.setItem('latinizeState', 'false');

        function applyTransliterationToPage(shouldLatinize, currentLanguage) {
            try {
                const elementsToTransliterate = document.querySelectorAll('h1, label, button, option, [data-transliterable], .transliterable-text, p, span, div.day-range label');
            
                elementsToTransliterate.forEach((element, index) => {
                    if (element.id === 'toggle-latinization-btn') {
                        return;
                    }

                    const visualClass = 'latinized-text-visual';
                    const isCurrentLangLatinizable = currentLanguage && latinizableLanguages.includes(currentLanguage);

                    if (shouldLatinize && isCurrentLangLatinizable) {
                        const currentElementText = element.textContent.trim();
                        element.dataset.originalText = currentElementText; 
                        
                        if (currentElementText) {
                            const transliteratedText = window.getLatinization(currentElementText, currentLanguage);
                            if (transliteratedText !== currentElementText) { 
                                element.textContent = transliteratedText;
                                element.classList.add(visualClass);
                            } else {
                                element.classList.remove(visualClass); 
                            }
                        }
                    } else { 
                        element.classList.remove(visualClass);
                        if (element.dataset.originalText) {
                            if (isCurrentLangLatinizable) {
                                // Only revert if current lang is latinizable and we are turning it off
                                element.textContent = element.dataset.originalText;
                            }
                            // For non-latinizable languages, textContent is already correct from language-handler.
                            // Clean up dataset.originalText for non-latinizable languages to prevent misuse.
                            if (!isCurrentLangLatinizable) {
                                element.removeAttribute('data-original-text');
                            }
                        }
                    }
                });

                const resultArea = document.getElementById('result');
                if (resultArea) {
                    const resultChildren = resultArea.querySelectorAll('*'); 
                    const resultElements = [resultArea, ...resultChildren]; 
                    resultElements.forEach(element => {
                        const visualClass = 'latinized-text-visual';
                        const isCurrentLangLatinizable = currentLanguage && latinizableLanguages.includes(currentLanguage);
                        let originalTextContent = element.dataset.originalTextContent;

                        if (shouldLatinize && isCurrentLangLatinizable) {
                            let textToTransliterate = "";
                            if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
                                textToTransliterate = element.textContent.trim();
                                element.dataset.originalTextContent = textToTransliterate; // Store current translated text
                            } else if (originalTextContent) { // Should not happen if logic is correct elsewhere
                                textToTransliterate = originalTextContent;
                            }
                            
                            if (textToTransliterate) {
                                const transliterated = window.getLatinization(textToTransliterate, currentLanguage);
                                if (transliterated !== textToTransliterate) {
                                    element.textContent = transliterated;
                                    element.classList.add(visualClass);
                                } else {
                                    element.classList.remove(visualClass);
                                }
                            }
                        } else {
                            element.classList.remove(visualClass);
                            if (originalTextContent) {
                                if (isCurrentLangLatinizable) {
                                    element.textContent = originalTextContent;
                                }
                                if (!isCurrentLangLatinizable) {
                                     element.removeAttribute('data-original-text-content');
                                }
                            }
                        }
                    });
                }

                if (languageSelect) {
                    // const targetLanguageValues = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական']; // Already defined as latinizableLanguages

                    for (let option of languageSelect.options) {
                        const visualClass = 'latinized-text-visual';
                        const optionValue = option.value; 
                        let originalOptionText = option.dataset.originalText;

                        if (!originalOptionText) {
                            originalOptionText = option.textContent.trim();
                            option.dataset.originalText = originalOptionText;
                        }

                        // Determine if this specific option should be transliterated
                        if (shouldLatinize && optionValue === currentLanguage && latinizableLanguages.includes(optionValue)) {
                            const transliteratedOptionText = window.getLatinization(originalOptionText, optionValue);
                            if (transliteratedOptionText !== originalOptionText) {
                                option.textContent = transliteratedOptionText;
                                option.classList.add(visualClass);
                            } else {
                                option.textContent = originalOptionText; 
                                option.classList.remove(visualClass);
                            }
                        } else {
                            // For all other cases (latinization off, or not the current selected lang, or not a latinizable lang)
                            // ensure original text and no visual class.
                            if (originalOptionText) {
                                option.textContent = originalOptionText;
                            }
                            option.classList.remove(visualClass);
                        }
                    }
                }
            } catch (e) {
                console.error('Error in applyTransliterationToPage:', e);
            }
        }

        function updateButtonText() {
            const currentUiLanguage = window.currentLanguage || 'COSYenglish'; 
            const translations = window.translations || {};
            const langTranslations = translations[currentUiLanguage] || translations.COSYenglish || {};

            if (isLatinized) {
                latinizeBtn.textContent = langTranslations.showOriginal || 'Show Original';
            } else {
                latinizeBtn.textContent = langTranslations.showLatin || 'Show Latin';
            }
        }

        function actualApplyTransliteration() {
            try {
                const currentLang = languageSelect ? languageSelect.value : null;
                updateButtonText();

                if (currentLang && latinizableLanguages.includes(currentLang)) {
                    latinizeBtn.style.display = ''; 
                    applyTransliterationToPage(isLatinized, currentLang);
                } else {
                    applyTransliterationToPage(false, currentLang); 
                    latinizeBtn.style.display = 'none';
                }
            } catch (e) {
                console.error('Error in actualApplyTransliteration:', e);
            }
        }

        latinizeBtn.addEventListener('click', () => {
            try {
                isLatinized = !isLatinized;
                localStorage.setItem('latinizeState', isLatinized.toString());
                actualApplyTransliteration();
            } catch (e) {
                console.error('Error in latinizeBtn click listener:', e);
            }
        });
        
        window.refreshLatinization = () => {
            const currentLang = languageSelect ? languageSelect.value : null;

            if (currentLang && !latinizableLanguages.includes(currentLang)) {
                if (isLatinized) { 
                    isLatinized = false;
                    localStorage.setItem('latinizeState', 'false');
                }
            } else {
                isLatinized = localStorage.getItem('latinizeState') === 'true';
            }
            actualApplyTransliteration();
        };
        
        actualApplyTransliteration();

    } catch (e) {
        console.error('Error in DOMContentLoaded latinizer:', e);
    }
});
