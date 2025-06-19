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
                const elementsToTransliterate = document.querySelectorAll('h1, label, button, [data-transliterable]');
            
                elementsToTransliterate.forEach((element, index) => {
                    if (element.id === 'toggle-latinization-btn') {
                        return;
                    }

                    let originalText = element.dataset.originalText;

                    if (shouldLatinize) {
                        if (!originalText) {
                            originalText = element.textContent.trim();
                            element.dataset.originalText = originalText;
                        }
                        if (originalText) {
                            const transliteratedText = window.getLatinization(originalText, currentLanguage);
                            if (transliteratedText !== originalText) { 
                                element.textContent = transliteratedText;
                            }
                        }
                    } else {
                        if (originalText) { 
                            element.textContent = originalText;
                        }
                    }
                });

                const resultArea = document.getElementById('result');
                if (resultArea) {
                    const resultChildren = resultArea.querySelectorAll('*'); 
                    const resultElements = [resultArea, ...resultChildren]; 
                    resultElements.forEach(element => {
                        let originalTextContent = element.dataset.originalTextContent;
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
                                }
                            } else if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && element.textContent.trim()) {
                                const text = element.textContent.trim();
                                element.dataset.originalTextContent = text; 
                                const transliterated = window.getLatinization(text, currentLanguage);
                                 if (transliterated !== text) {
                                    element.textContent = transliterated;
                                }
                            }
                        } else {
                            if (originalTextContent) {
                                element.textContent = originalTextContent;
                            }
                        }
                    });
                }

                if (languageSelect) {
                    const targetLanguageValues = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական'];
                    for (let option of languageSelect.options) {
                        if (targetLanguageValues.includes(option.value)) {
                            if (shouldLatinize) {
                                if (!option.dataset.originalText) {
                                    option.dataset.originalText = option.textContent;
                                }
                                option.textContent = window.getLatinization(option.dataset.originalText, option.value);
                            } else {
                                if (option.dataset.originalText) {
                                    option.textContent = option.dataset.originalText;
                                }
                            }
                        } else {
                            if (option.dataset.originalText) {
                                 option.textContent = option.dataset.originalText;
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Error in applyTransliterationToPage:', e);
            }
        }

        function updateButtonText() {
            if (isLatinized) {
                latinizeBtn.textContent = 'Show Original'; 
            } else {
                latinizeBtn.textContent = 'Show Latin'; 
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

        if (languageSelect) {
            languageSelect.addEventListener('change', () => {
                try {
                    isLatinized = localStorage.getItem('latinizeState') === 'true'; 
                    actualApplyTransliteration(); 
                } catch (e) {
                    console.error('Error in languageSelect change listener (latinizer):', e);
                }
            });
        }
        
        window.refreshLatinization = () => {
            isLatinized = localStorage.getItem('latinizeState') === 'true';
            actualApplyTransliteration();
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            actualApplyTransliteration();
        } else {
            window.addEventListener('load', actualApplyTransliteration);
        }
    } catch (e) {
        console.error('Error in DOMContentLoaded latinizer:', e);
    }
});
