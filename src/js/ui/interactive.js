window.CosyAppInteractive = {};

(function() {
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

    const SOUNDS = { /* ... existing sound definitions ... */ };
    function playSound(type) { /* ... existing playSound ... */ }

    class GameState { /* ... existing GameState class ... */
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
    // function showConfetti() { /* ... implementation ... */ } // Assuming this exists or is not critical for tips
    CosyAppInteractive.addXP = function(amount) { gameState.addXP(amount); };
    function awardCorrectAnswer() { /* ... existing ... */ }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;
    CosyAppInteractive.awardIncorrectAnswer = function() { /* ... existing ... */ };
    function markAndAward(el) { /* ... existing ... */ }
    CosyAppInteractive.markAndAward = markAndAward;
    // const observer = new MutationObserver(...) // Assuming this is correctly set up elsewhere or re-added if needed

    CosyAppInteractive.getRandomPopupContent = function getRandomPopupContent() {
        const currentLang = document.getElementById('language')?.value || 'COSYenglish';
        const t = (window.translations && window.translations[currentLang]) ? window.translations[currentLang] : (window.translations ? window.translations.COSYenglish : {});
        const tEnglish = window.translations ? window.translations.COSYenglish : {};

        let allTips = [];
        // Use English tips as the base for IDs/keys
        if (tEnglish.learningTips && Array.isArray(tEnglish.learningTips)) {
            allTips = allTips.concat(tEnglish.learningTips.map(tip => (typeof tip === 'string' ? { id: tip, text: tip } : tip)));
        }
        if (tEnglish.helpTopics && Array.isArray(tEnglish.helpTopics)) {
            allTips = allTips.concat(tEnglish.helpTopics.map(tip => (typeof tip === 'string' ? { id: tip, text: tip } : tip)));
        }

        if (allTips.length === 0) {
            return { text: "No tips available right now.", id: "no_tips_fallback" };
        }
        const randomIndex = Math.floor(Math.random() * allTips.length);
        const randomTip = allTips[randomIndex];

        // The 'text' shown initially should be the English text, as its 'id' is the English text.
        return { text: randomTip.text, id: randomTip.id }; // id is the English text
    };

    CosyAppInteractive.showTipPopup = function showTipPopup(tipContent) {
        const popup = document.getElementById('floating-tip-popup');
        const tipTextElement = document.getElementById('floating-tip-text');
        const translateBtn = popup?.querySelector('.translate-tip');
        const t = getCurrentTranslations(); // For button text

        if (popup && tipTextElement) {
            if (tipContent && typeof tipContent.text === 'string' && typeof tipContent.id === 'string') {
                tipTextElement.textContent = tipContent.text;
                popup.dataset.tipId = tipContent.id; // Store English text as ID
                popup.dataset.originalLang = 'COSYenglish'; // Original is English
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
            popup.style.display = 'flex'; // Or 'block', depending on CSS
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

    document.addEventListener('DOMContentLoaded', async function() {
        if (gameState && typeof gameState.updateUI === 'function') await gameState.updateUI();

        document.body.addEventListener('click', function(event) {
            if (event.target.matches('button:not(.btn-emoji, #speaking-record-btn), .article-option-btn, .word-option, .match-item')) {
                if (!event.target.closest('.no-generic-click-sound')) {
                     // playSound('click'); // playSound might not be defined if SOUNDS is stubbed
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
                const originalTipId = tipPopup.dataset.tipId; // This is the English text
                const currentAppLang = document.getElementById('language')?.value || 'COSYenglish';
                const isTranslated = tipPopup.dataset.isTranslated === 'true';
                const tGlobal = getCurrentTranslations(); // For button text fallbacks

                if (!tipTextElement || !originalTipId) return;

                if (isTranslated) {
                    // Revert to original English text
                    tipTextElement.textContent = originalTipId; // originalTipId is the English text
                    translateTipBtn.textContent = tGlobal.buttons?.translate || 'Translate 🌍';
                    tipPopup.dataset.isTranslated = 'false';
                } else {
                    // Translate to current app language (if not English)
                    if (currentAppLang === 'COSYenglish') {
                        tipTextElement.textContent = originalTipId + " (Already in English)";
                        translateTipBtn.textContent = tGlobal.buttons?.showOriginal || 'Show Original 🇬🇧'; // Or disable
                        tipPopup.dataset.isTranslated = 'true'; // Mark as "translated" to allow reverting
                        return;
                    }

                    const translatedText = tipTranslations[originalTipId]?.[currentAppLang];

                    if (translatedText) {
                        tipTextElement.textContent = translatedText;
                        translateTipBtn.textContent = tGlobal.buttons?.showOriginal || 'Show Original 🇬🇧';
                        tipPopup.dataset.isTranslated = 'true';
                    } else {
                        tipTextElement.textContent = (window.translations?.[currentAppLang]?.buttons?.translationNotAvailable) || (tGlobal.buttons?.translationNotAvailable) || "Translation not available for this tip.";
                        // Keep button as "Translate" or disable, as there's nothing to revert from if translation failed
                        // To allow reverting to English even if translation failed:
                        // translateTipBtn.textContent = tGlobal.buttons?.showOriginal || 'Show Original 🇬🇧';
                        // tipPopup.dataset.isTranslated = 'true'; // Consider it "translated" to allow revert
                    }
                }
            };
        }
    });

})();
