window.CosyAppInteractive = {};

(function() {
    // Latinization toggle state
    let isLatinizationEnabled = localStorage.getItem('latinizationEnabled') === 'false' ? false : true;

    // Fallback tip translations - defined directly in this file
    const tipTranslations = {
        "Try to think in the language you are learning.": {
            "COSYfrançais": "Essayez de penser dans la langue que vous apprenez.",
            "COSYespañol": "Intenta pensar en el idioma que estás aprendiendo."
        },
        "Label items in your house with their names in the new language.": {
            "COSYfrançais": "Étiquetez les objets de votre maison avec leurs noms dans la nouvelle langue.",
            "COSYespañol": "Etiqueta los objetos de tu casa con sus nombres en el nuevo idioma."
        },
        "Practice a little bit every day, consistency is key!": {
            "COSYfrançais": "Pratiquez un peu chaque jour, la régularité est la clé !",
            "COSYespañol": "Practica un poco cada día, ¡la constancia es la clave!"
        },
        "Don't be afraid to make mistakes, they are part of learning.": {
            "COSYfrançais": "N'ayez pas peur de faire des erreurs, elles font partie de l'apprentissage.",
            "COSYespañol": "No tengas miedo de cometer errores, son parte del aprendizaje."
        },
        "Immerse yourself: listen to music or watch shows in the language.": {
            "COSYfrançais": "Immergez-vous : écoutez de la musique ou regardez des émissions dans la langue.",
            "COSYespañol": "Sumérgete: escucha música o mira programas en el idioma."
        },
        "Start with small, manageable learning goals each day!": {
            "COSYfrançais": "Commencez avec des objectifs d'apprentissage petits et gérables chaque jour !",
            "COSYespañol": "¡Comienza con metas de aprendizaje pequeñas y manejables cada día!"
        },
        "Consistent daily practice is more effective than long, infrequent sessions.": {
            "COSYfrançais": "Une pratique quotidienne constante est plus efficace que de longues sessions peu fréquentes.",
            "COSYespañol": "La práctica diaria constante es más efectiva que las sesiones largas y poco frecuentes."
        },
        "Stuck? Try a different exercise type or review a previous lesson.": {
            "COSYfrançais": "Bloqué ? Essayez un autre type d'exercice ou révisez une leçon précédente.",
            "COSYespañol": "¿Atascado? Prueba un tipo de ejercicio diferente o repasa una lección anterior."
        },
        "Use the translate button on this popup for a hint if the content is in the learning language.": {
            "COSYfrançais": "Utilisez le bouton de traduction sur cette popup pour un indice si le contenu est dans la langue d'apprentissage.",
            "COSYespañol": "Usa el botón de traducir en esta ventana emergente para obtener una pista si el contenido está en el idioma de aprendizaje."
        },
        "Check your progress regularly to stay motivated.": {
            "COSYfrançais": "Vérifiez régulièrement vos progrès pour rester motivé.",
            "COSYespañol": "Revisa tu progreso regularmente para mantenerte motivado."
        },
        "Use the main buttons to choose a practice category.": {
            "COSYfrançais": "Utilisez les boutons principaux pour choisir une catégorie de pratique.",
            "COSYespañol": "Usa los botones principales para elegir una categoría de práctica."
        }
    };

    function getCurrentTranslations() {
        const language = document.getElementById('language')?.value || 'COSYenglish';
        if (window.translations && window.translations[language]) {
            return window.translations[language];
        }
        if (window.translations && window.translations.COSYenglish) {
            return window.translations.COSYenglish;
        }
        console.warn("Main translations not found, using default fallback strings for UI.");
        return {
            statsXp: 'XP:', statsLevel: 'Level:', statsStreak: 'Streak:',
            levelUpToast: '🎉 Level up! You are now level {level}!',
            sessionCompleteToast: `Great focus! Session of {exercisesPerSessionGoal} exercises complete! +5 Bonus XP!`,
            streakBonusToast3Days: "🎉 3-Day Streak! +15 Bonus XP!",
            streakBonusToast7Days: "🔥 7-Day Streak! +35 Bonus XP!",
            streakBonusToast14Days: "🚀 14-Day Streak! +75 Bonus XP!",
            buttons: { translate: 'Translate 🌍', showOriginal: 'Show Original 🇬🇧', translationNotAvailable: 'Translation not available' }
        };
    }
    
    class GameState { 
        constructor() {
            this.xp = 0; this.level = 1; this.streak = 0; this.lastActiveDate = null;
            this.completedLessons = []; this.achievements = [];
            this.currentSessionExerciseCount = 0; this.exercisesPerSessionGoal = 5;
            this.load();
        }
        load() {
            const savedState = localStorage.getItem('cosyGameState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.xp = state.xp || 0; this.level = state.level || 1; this.streak = state.streak || 0;
                this.lastActiveDate = state.lastActiveDate || null;
                this.completedLessons = state.completedLessons || []; this.achievements = state.achievements || [];
                this.currentSessionExerciseCount = state.currentSessionExerciseCount || 0;
            } else { console.log("No 'cosyGameState' found. Initializing new state."); }
            this.level = Math.floor(this.xp / 50) + 1;
            this.save();
        }
        save() {
            const stateToSave = { xp: this.xp, level: this.level, streak: this.streak, lastActiveDate: this.lastActiveDate, completedLessons: this.completedLessons, achievements: this.achievements, currentSessionExerciseCount: this.currentSessionExerciseCount };
            localStorage.setItem('cosyGameState', JSON.stringify(stateToSave));
        }
        showAchievementNotification(achievementId) { /* ... existing ... */ }
        checkAndAwardAchievement(achievementId) { /* ... existing ... */ }
        addXP(amount) { /* ... existing ... */ }
        updateStreak() { /* ... existing ... */ }
        completeLesson(lessonId) { /* ... existing ... */ }
        async updateUI() { /* ... existing ... */ }
        showLevelUpEffect() { /* ... existing ... */ }
    }
    CosyAppInteractive.GameState = GameState; 
    const gameState = new GameState();
    function showToast(msg) { /* ... existing ... */ }
    CosyAppInteractive.showToast = showToast;
    CosyAppInteractive.addXP = function(amount) { gameState.addXP(amount); };
    function awardCorrectAnswer() { 
        if (typeof playSound === 'function') playSound('success'); 
    }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;
    CosyAppInteractive.awardIncorrectAnswer = function() { 
        if (typeof playSound === 'function') playSound('error'); 
    };
    function markAndAward(el) { /* ... existing ... */ }
    CosyAppInteractive.markAndAward = markAndAward;

    CosyAppInteractive.getRandomPopupContent = function getRandomPopupContent() {
        const currentLang = document.getElementById('language')?.value || 'COSYenglish';
        const t = (window.translations && window.translations[currentLang]) ? window.translations[currentLang] : (window.translations ? window.translations.COSYenglish : {});
        const tEnglish = window.translations ? window.translations.COSYenglish : {};
        let allTips = [];
        if (tEnglish.learningTips && Array.isArray(tEnglish.learningTips)) {
            allTips = allTips.concat(tEnglish.learningTips.map(tip => (typeof tip === 'string' ? { id: tip, text: tip } : tip)));
        }
        if (tEnglish.helpTopics && Array.isArray(tEnglish.helpTopics)) {
            allTips = allTips.concat(tEnglish.helpTopics.map(tip => (typeof tip === 'string' ? { id: tip, text: tip } : tip)));
        }
        if (allTips.length === 0) return { text: "No tips available right now.", id: "no_tips_fallback" };
        const randomIndex = Math.floor(Math.random() * allTips.length);
        const randomTip = allTips[randomIndex];
        return { text: randomTip.text, id: randomTip.id };
    };

    CosyAppInteractive.showTipPopup = function showTipPopup(tipContent) {
        const popup = document.getElementById('floating-tip-popup');
        const tipTextElement = document.getElementById('floating-tip-text');
        const translateBtn = popup?.querySelector('.translate-tip');
        const t = getCurrentTranslations(); 
        if (popup && tipTextElement) {
            if (tipContent && typeof tipContent.text === 'string' && typeof tipContent.id === 'string') {
                tipTextElement.textContent = tipContent.text;
                popup.dataset.tipId = tipContent.id; 
                popup.dataset.originalLang = 'COSYenglish'; 
                popup.dataset.isTranslated = 'false';
            } else {
                tipTextElement.textContent = "Sorry, couldn't load a tip!";
                popup.dataset.tipId = "error_tip_load";
                popup.dataset.originalLang = 'COSYenglish';
                popup.dataset.isTranslated = 'false';
            }
            if (translateBtn) {
                translateBtn.textContent = t.buttons?.translate || 'Translate 🌍';
            }
            popup.style.display = 'flex'; 
        } else {
            console.error("Tip popup elements not found!");
        }
    };

    CosyAppInteractive.hideTipPopup = function hideTipPopup() {
        const popup = document.getElementById('floating-tip-popup');
        if (popup) {
            popup.style.display = 'none';
        }
    };

    // --- Transliteration Popup Logic ---
    let transliterationPopup = null; 

    function ensureTransliterationPopupExists() {
        if (transliterationPopup && document.body.contains(transliterationPopup)) return; 
        transliterationPopup = document.createElement('div');
        transliterationPopup.id = 'dynamic-transliteration-popup-container'; 
        transliterationPopup.style.display = 'none';
        transliterationPopup.style.position = 'fixed';
        transliterationPopup.style.backgroundColor = '#f9f9f9';
        transliterationPopup.style.border = '1px solid #ccc';
        transliterationPopup.style.padding = '10px';
        transliterationPopup.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        transliterationPopup.style.zIndex = '1002'; 
        transliterationPopup.style.borderRadius = '5px';
        transliterationPopup.style.maxWidth = '300px';
        transliterationPopup.style.fontFamily = 'Arial, sans-serif';
        transliterationPopup.style.fontSize = '14px'; 
        const textElement = document.createElement('div');
        textElement.id = 'dynamic-transliteration-popup-text'; 
        textElement.style.marginBottom = '8px';
        textElement.style.fontSize = '0.9em'; 
        textElement.style.wordWrap = 'break-word'; 
        transliterationPopup.appendChild(textElement);
        const closeButton = document.createElement('button');
        closeButton.id = 'dynamic-close-transliteration-popup-btn'; 
        closeButton.title = 'Close';
        closeButton.textContent = '✖';
        closeButton.style.background = '#eee';
        closeButton.style.border = '1px solid #ccc';
        closeButton.style.padding = '3px 8px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.float = 'right'; 
        closeButton.style.fontSize = '12px'; 
        closeButton.style.lineHeight = '1'; 
        const clearer = document.createElement('div'); 
        clearer.style.clear = 'both';
        transliterationPopup.appendChild(closeButton);
        transliterationPopup.appendChild(clearer); 
        closeButton.onclick = function(event) {
            event.stopPropagation(); 
            hideTransliterationPopup();
        };
        document.body.appendChild(transliterationPopup);
    }

    function showTransliterationPopup(transliteratedText, event) {
        if (!isLatinizationEnabled) return; // Check toggle state
        ensureTransliterationPopupExists();
        const textElement = transliterationPopup.querySelector('#dynamic-transliteration-popup-text');
        if (textElement) textElement.textContent = transliteratedText;
        let x = event.pageX + 15; 
        let y = event.pageY + 15;
        transliterationPopup.style.left = x + 'px';
        transliterationPopup.style.top = y + 'px';
        transliterationPopup.style.display = 'block';
        const popupRect = transliterationPopup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        if (popupRect.right > viewportWidth) transliterationPopup.style.left = (viewportWidth - popupRect.width - 10) + 'px'; 
        if (popupRect.bottom > viewportHeight) transliterationPopup.style.top = (viewportHeight - popupRect.height - 10) + 'px';
        if (popupRect.left < 0) transliterationPopup.style.left = '10px';
        if (popupRect.top < 0) transliterationPopup.style.top = '10px';
    }
    CosyAppInteractive.showTransliterationPopup = showTransliterationPopup;

    function hideTransliterationPopup() {
        if (transliterationPopup) transliterationPopup.style.display = 'none';
    }
    CosyAppInteractive.hideTransliterationPopup = hideTransliterationPopup;
    // --- End Transliteration Popup Logic ---

    document.addEventListener('DOMContentLoaded', async function() { 
        if (gameState && typeof gameState.updateUI === 'function') await gameState.updateUI(); 
        
        document.body.addEventListener('click', function(event) {
            if (event.target.matches('button:not(.btn-emoji, #speaking-record-btn), .article-option-btn, .word-option, .match-item')) {
                if (!event.target.closest('.no-generic-click-sound')) {
                    if (typeof playSound === 'function') playSound('click'); 
                }
            }
        }, true);

        const helpBtn = document.getElementById('floating-help-btn');
        const tipPopup = document.getElementById('floating-tip-popup');
        const closeTipBtn = tipPopup?.querySelector('.close-tip');
        const translateTipBtn = tipPopup?.querySelector('.translate-tip');

        if (helpBtn) { 
            helpBtn.onclick = function(e) { 
                e.stopPropagation(); 
                const tipContent = CosyAppInteractive.getRandomPopupContent();
                CosyAppInteractive.showTipPopup(tipContent); 
            }; 
        }
        if (closeTipBtn) { 
            closeTipBtn.onclick = function(e) {
                e.stopPropagation(); 
                CosyAppInteractive.hideTipPopup();
            };
        }

        if (translateTipBtn && tipPopup) {
            translateTipBtn.onclick = function(e) {
                e.stopPropagation();
                const tipTextElement = document.getElementById('floating-tip-text');
                const originalTipId = tipPopup.dataset.tipId; 
                const currentAppLang = document.getElementById('language')?.value || 'COSYenglish';
                const isTranslated = tipPopup.dataset.isTranslated === 'true';
                const tGlobal = getCurrentTranslations(); 
                if (!tipTextElement || !originalTipId) return;
                if (isTranslated) {
                    tipTextElement.textContent = originalTipId; 
                    translateTipBtn.textContent = tGlobal.buttons?.translate || 'Translate 🌍';
                    tipPopup.dataset.isTranslated = 'false';
                } else {
                    if (currentAppLang === 'COSYenglish') {
                        tipTextElement.textContent = originalTipId + " (Already in English)";
                        translateTipBtn.textContent = tGlobal.buttons?.showOriginal || 'Show Original 🇬🇧'; 
                        tipPopup.dataset.isTranslated = 'true'; 
                        return;
                    }
                    const translatedText = tipTranslations[originalTipId]?.[currentAppLang];
                    if (translatedText) {
                        tipTextElement.textContent = translatedText;
                        translateTipBtn.textContent = tGlobal.buttons?.showOriginal || 'Show Original 🇬🇧';
                        tipPopup.dataset.isTranslated = 'true';
                    } else {
                        tipTextElement.textContent = (window.translations?.[currentAppLang]?.buttons?.translationNotAvailable) || (tGlobal.buttons?.translationNotAvailable) || "Translation not available for this tip.";
                    }
                }
            };
        }

        // Latinization Toggle Button Setup
        const toggleLatinizationBtn = document.getElementById('toggle-latinization-btn');
        if (toggleLatinizationBtn) {
            toggleLatinizationBtn.textContent = isLatinizationEnabled ? 'Latinize: On' : 'Latinize: Off';
            // Set visual style based on state
            toggleLatinizationBtn.style.backgroundColor = isLatinizationEnabled ? '#e0ffe0' : '#ffe0e0'; // Greenish for On, reddish for Off

            toggleLatinizationBtn.addEventListener('click', function() {
                isLatinizationEnabled = !isLatinizationEnabled;
                localStorage.setItem('latinizationEnabled', isLatinizationEnabled);
                this.textContent = isLatinizationEnabled ? 'Latinize: On' : 'Latinize: Off';
                this.style.backgroundColor = isLatinizationEnabled ? '#e0ffe0' : '#ffe0e0';
                if (!isLatinizationEnabled && transliterationPopup && transliterationPopup.style.display !== 'none') {
                    hideTransliterationPopup(); // Hide if it's currently shown and we disable latinization
                }
            });
        }

        // Global click listener to hide transliteration popup if click is outside
        document.addEventListener('click', function(event) {
            if (transliterationPopup && transliterationPopup.style.display !== 'none') {
                if (!transliterationPopup.contains(event.target) && event.target.id !== 'toggle-latinization-btn' && !event.target.closest('#toggle-latinization-btn')) {
                    // If the click is outside the popup, and also not on the toggle button itself
                    // (to prevent immediate hiding when toggle button is clicked if popup was open)
                    hideTransliterationPopup();
                }
            }
        }, false); 

        // Event listeners for transliteration on the result area
        const resultContent = document.getElementById('result');
        if (resultContent) {
            const targetLanguages = ["ΚΟΖΥελληνικά", "ТАКОЙрусский", "ԾՈՍՅհայկական"];

            resultContent.addEventListener('click', function(event) {
                if (!isLatinizationEnabled) return; // Check toggle state

                const currentLang = document.getElementById('language')?.value;
                if (!targetLanguages.includes(currentLang)) return;
                let textToTransliterate = null;
                if (event.target && event.target.textContent) {
                    const targetText = event.target.textContent.trim();
                    if (targetText.length > 0 && targetText.length < 30) {
                        if (event.target.childNodes.length === 1 && event.target.childNodes[0].nodeType === Node.TEXT_NODE || event.target.tagName === 'SPAN') {
                            textToTransliterate = targetText;
                        } else if (event.target.classList.contains('word') || event.target.classList.contains('sentence-part')) { 
                            textToTransliterate = targetText;
                        } else if (!event.target.querySelector('div, p, button')) { 
                             textToTransliterate = targetText;
                        }
                    }
                }
                if (textToTransliterate && textToTransliterate.length > 1) { 
                    if (typeof window.getLatinization === 'function' && typeof CosyAppInteractive.showTransliterationPopup === 'function') {
                        const latinizedText = window.getLatinization(textToTransliterate, currentLang);
                        if (latinizedText && latinizedText !== textToTransliterate) {
                            CosyAppInteractive.showTransliterationPopup(latinizedText, event);
                        }
                    }
                }
            });

            resultContent.addEventListener('mouseup', function(event) {
                if (!isLatinizationEnabled) return; // Check toggle state

                const currentLang = document.getElementById('language')?.value;
                if (!targetLanguages.includes(currentLang)) return;
                const selectedText = window.getSelection().toString().trim();
                if (selectedText && selectedText.length > 0) { 
                     if (typeof window.getLatinization === 'function' && typeof CosyAppInteractive.showTransliterationPopup === 'function') {
                        const latinizedText = window.getLatinization(selectedText, currentLang);
                        if (latinizedText && latinizedText !== selectedText) {
                            CosyAppInteractive.showTransliterationPopup(latinizedText, event);
                        }
                    }
                }
            });
        }
    });

})();
