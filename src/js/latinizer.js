// src/js/latinizer.js
document.addEventListener('DOMContentLoaded', () => {
    try {
        const latinizeBtn = document.getElementById('toggle-latinization-btn');
        const languageSelect = document.getElementById('language');

        if (!latinizeBtn) {
            console.warn('Latinize button not found.');
            return;
        }

        // Load persisted state
        let isLatinized = localStorage.getItem('latinizeState') === 'true';

        function applyTransliterationToPage(shouldLatinize, currentLanguage) {
            try {
                const elementsToTransliterate = document.querySelectorAll('h1, label, button, option, [data-transliterable], .transliterable-text, p, span, div.day-range label');
            
                elementsToTransliterate.forEach((element, index) => {
                    if (element.id === 'toggle-latinization-btn') {
                        return;
                    }

                    let originalText = element.dataset.originalText;
                    const visualClass = 'latinized-text-visual';

                    if (shouldLatinize) {
                        if (!originalText) {
                            originalText = element.textContent.trim();
                            element.dataset.originalText = originalText;
                        }
                        if (originalText) {
                            const transliteratedText = window.getLatinization(originalText, currentLanguage);
                            if (transliteratedText !== originalText) { 
                                element.textContent = transliteratedText;
                                element.classList.add(visualClass);
                            }
                        }
                    } else {
                        if (originalText) { 
                            element.textContent = originalText;
                            element.classList.remove(visualClass);
                        }
                    }
                });

                const resultArea = document.getElementById('result');
                if (resultArea) {
                    const resultChildren = resultArea.querySelectorAll('*'); 
                    const resultElements = [resultArea, ...resultChildren]; 
                    resultElements.forEach(element => {
                        let originalTextContent = element.dataset.originalTextContent;
                        const visualClass = 'latinized-text-visual';
                        if (shouldLatinize) {
                            if (!originalTextContent) {
                                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
                                   originalTextContent = element.textContent.trim();
                                   element.dataset.originalTextContent = originalTextContent;
                                }
                            }
                            if (originalTextContent) {
                                const transliterated = window.getLatinization(originalTextContent, currentLanguage);
                                if (transliterated !== originalTextContent) {
                                    element.textContent = transliterated;
                                    element.classList.add(visualClass);
                                }
                            } else if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && element.textContent.trim()) {
                                const text = element.textContent.trim();
                                element.dataset.originalTextContent = text; 
                                const transliterated = window.getLatinization(text, currentLanguage);
                                 if (transliterated !== text) {
                                    element.textContent = transliterated;
                                    element.classList.add(visualClass);
                                }
                            }
                        } else {
                            if (originalTextContent) {
                                element.textContent = originalTextContent;
                                element.classList.remove(visualClass);
                            }
                        }
                    });
                }

                if (languageSelect) {
                    const targetLanguageValues = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական'];
                    for (let option of languageSelect.options) {
                        const visualClass = 'latinized-text-visual';
                        if (targetLanguageValues.includes(option.value)) {
                            if (shouldLatinize) {
                                if (!option.dataset.originalText) {
                                    option.dataset.originalText = option.textContent;
                                }
                                option.textContent = window.getLatinization(option.dataset.originalText, option.value);
                                option.classList.add(visualClass);
                            } else {
                                if (option.dataset.originalText) {
                                    option.textContent = option.dataset.originalText;
                                    option.classList.remove(visualClass);
                                }
                            }
                        } else {
                            if (option.dataset.originalText) {
                                 option.textContent = option.dataset.originalText;
                                 option.classList.remove(visualClass);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Error in applyTransliterationToPage:', e);
            }
        }

        function updateButtonText() {
            const currentUiLanguage = window.currentLanguage || 'COSYenglish'; // Assuming currentLanguage is globally available
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
                const visibleLanguages = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական'];
                
                updateButtonText();

                if (visibleLanguages.includes(currentLang)) {
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
                localStorage.setItem('latinizeState', isLatinized);
                actualApplyTransliteration();
            } catch (e) {
                console.error('Error in latinizeBtn click listener:', e);
            }
        });

        // The language change event is now handled by language-handler.js,
        // which calls window.refreshLatinization after updating UI text.
        // So, the direct 'change' listener on languageSelect here is redundant.
        
        window.refreshLatinization = () => {
            // Ensure isLatinized is correctly read from localStorage before applying
            isLatinized = localStorage.getItem('latinizeState') === 'true';
            actualApplyTransliteration();
        };

        // Initial application of latinization state
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            actualApplyTransliteration();
        } else {
            window.addEventListener('load', actualApplyTransliteration);
        }

    } catch (e) {
        console.error('Error in DOMContentLoaded latinizer:', e);
    }
});
