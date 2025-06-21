window.CosyAppInteractive = {};

(function() {
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
            reviewsDueLabel: 'Reviews Due: ',
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
            this.learningItems = {};
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
                this.learningItems = state.learningItems || {};
            } else { console.log("No 'cosyGameState' found. Initializing new state."); }
            this.level = Math.floor(this.xp / 50) + 1;
        }
        save() {
            this.learningItems = this.learningItems || {};
            const stateToSave = { xp: this.xp, level: this.level, streak: this.streak, lastActiveDate: this.lastActiveDate, completedLessons: this.completedLessons, achievements: this.achievements, currentSessionExerciseCount: this.currentSessionExerciseCount, learningItems: this.learningItems };
            localStorage.setItem('cosyGameState', JSON.stringify(stateToSave));
            this.updateUI(); 
        }
        showAchievementNotification(achievementId) { /* ... existing ... */ }
        checkAndAwardAchievement(achievementId) { /* ... existing ... */ }
        addXP(amount) { /* ... existing ... */ }
        reduceXP(amount) { /* ... existing ... */ }
        updateStreak() { /* ... existing ... */ }
        completeLesson(lessonId) { /* ... existing ... */ }
        
        async updateUI() {
            const xpValueElement = document.getElementById('xp-value');
            if (xpValueElement) xpValueElement.textContent = this.xp;
            const levelValueElement = document.getElementById('level-value');
            if (levelValueElement) levelValueElement.textContent = this.level;
            const streakValueElement = document.getElementById('streak-value');
            if (streakValueElement) streakValueElement.textContent = this.streak;

            const currentLanguage = document.getElementById('language')?.value;
            let totalReviewsDue = 0;

            if (currentLanguage && typeof CosyAppInteractive.getDueReviewItems === 'function') {
                const itemTypesForReviewCount = [
                    'vocabulary-word', 'grammar-article',
                    'vocabulary-image', 'grammar-verb' 
                ];
                for (const itemType of itemTypesForReviewCount) {
                    const dueForType = CosyAppInteractive.getDueReviewItems(currentLanguage, itemType, Infinity);
                    if (dueForType && Array.isArray(dueForType)) {
                        totalReviewsDue += dueForType.length;
                    }
                }
            }

            let reviewCounterContainer = document.getElementById('review-counter-container');
            if (!reviewCounterContainer) {
                reviewCounterContainer = document.createElement('div');
                reviewCounterContainer.id = 'review-counter-container';
                reviewCounterContainer.style.marginTop = '5px'; 
                const label = document.createElement('span');
                const t = getCurrentTranslations(); 
                label.textContent = t.reviewsDueLabel || 'Reviews Due: ';
                label.id = 'reviews-due-counter-label'; 
                const valueSpan = document.createElement('span');
                valueSpan.id = 'reviews-due-count-value';
                valueSpan.textContent = '0'; 
                reviewCounterContainer.appendChild(label);
                reviewCounterContainer.appendChild(valueSpan);
                const xpStatsElement = document.getElementById('xp-stats'); 
                if (xpStatsElement) {
                    xpStatsElement.appendChild(reviewCounterContainer);
                } else {
                    const statsContainer = document.querySelector('.stats-container'); 
                    if (statsContainer) {
                        statsContainer.appendChild(reviewCounterContainer);
                    } else {
                         document.body.appendChild(reviewCounterContainer); 
                    }
                }
            }
            const reviewValueElement = document.getElementById('reviews-due-count-value');
            if (reviewValueElement) {
                reviewValueElement.textContent = totalReviewsDue;
            }
        }
        showLevelUpEffect() { /* ... existing ... */ }
    }
    CosyAppInteractive.GameState = GameState; 
    const gameState = new GameState();

    function showToast(msg) { /* ... existing ... */ }
    CosyAppInteractive.showToast = showToast;
    CosyAppInteractive.addXP = function(amount) { gameState.addXP(amount); };
    CosyAppInteractive.reduceXP = function(amount) { if (gameState) gameState.reduceXP(amount); };
    function awardCorrectAnswer() { /* ... existing ... */ }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;
    CosyAppInteractive.awardIncorrectAnswer = function() { /* ... existing ... */ };
    function markAndAward(el) { /* ... existing ... */ }
    CosyAppInteractive.markAndAward = markAndAward;
    CosyAppInteractive.scheduleReview = function(language, itemType, itemValue, isCorrect) { /* ... existing ... */ }; // This already calls save() which calls updateUI()
    CosyAppInteractive.getDueReviewItems = function(language, itemType, maxItems = 1) { /* ... existing ... */ };
    CosyAppInteractive.getItemProficiency = function(language, itemType, itemValue) {
        const key = `${language}_${itemType}_${itemValue}`;
        if (gameState.learningItems && gameState.learningItems[key]) {
            return gameState.learningItems[key].proficiencyBucket;
        }
        return 0; // Default for items not yet in learningItems
    };
    
    // --- Language Tree Integration REMOVED ---

    let transliterationPopup = null; 
    function ensureTransliterationPopupExists() { /* ... existing ... */ }
    function showTransliterationPopup(transliteratedText, event) { /* ... existing ... */ }
    CosyAppInteractive.showTransliterationPopup = showTransliterationPopup;
    function hideTransliterationPopup() { /* ... existing ... */ }
    CosyAppInteractive.hideTransliterationPopup = hideTransliterationPopup;

    document.addEventListener('DOMContentLoaded', async function() { 
        // Determine and set initial language
        let initialLanguageCode = localStorage.getItem('selectedLanguage');
        const languageDropdown = document.getElementById('language'); 

        if (languageDropdown) {
            let langIsValidInDropdown = false;
            if (initialLanguageCode) {
                for (let i = 0; i < languageDropdown.options.length; i++) {
                    if (languageDropdown.options[i].value === initialLanguageCode) {
                        langIsValidInDropdown = true;
                        break;
                    }
                }
            }

            if (initialLanguageCode && langIsValidInDropdown) {
                languageDropdown.value = initialLanguageCode;
            } else if (languageDropdown.options.length > 0) {
                // Fallback to the first non-placeholder option if available and initialLanguageCode is invalid or null
                let firstValidOption = "";
                for (let i = 0; i < languageDropdown.options.length; i++) {
                    if (languageDropdown.options[i].value) { // Check for non-empty value
                        firstValidOption = languageDropdown.options[i].value;
                        break;
                    }
                }
                initialLanguageCode = firstValidOption || 'COSYenglish'; // Default if no valid option found
                languageDropdown.value = initialLanguageCode;
                localStorage.setItem('selectedLanguage', initialLanguageCode);
            } else {
                // No dropdown options, absolute fallback
                initialLanguageCode = 'COSYenglish';
                localStorage.setItem('selectedLanguage', initialLanguageCode);
            }
        } else {
            // Dropdown not found, use localStorage or absolute fallback
            if (!initialLanguageCode) initialLanguageCode = 'COSYenglish';
            localStorage.setItem('selectedLanguage', initialLanguageCode);
        }
        
        // Initialize UI elements that depend on the initial language
        if (gameState && typeof gameState.updateUI === 'function') {
            await gameState.updateUI(); 
        }
        if (typeof window.updateActiveDayName === 'function') { // If this function exists from another script
            window.updateActiveDayName();
        }
        
        // Standard language selector listener
        if (languageDropdown) {
            languageDropdown.addEventListener('change', function() {
                localStorage.setItem('selectedLanguage', this.value);
                
                const resultArea = document.getElementById('result');
                if (resultArea) resultArea.innerHTML = '';
                
                // const feedbackArea = document.getElementById('feedback'); // Example if a general feedback area exists
                // if (feedbackArea) feedbackArea.innerHTML = '';

                if (typeof window.updateActiveDayName === 'function') {
                    window.updateActiveDayName();
                }
                if (gameState && typeof gameState.updateUI === 'function') {
                    gameState.updateUI();
                }
                // Potentially trigger other language-specific data loading or UI updates here
                // e.g., if functions from language-handler.js were relevant.
            });
        }

        document.body.addEventListener('click', function(event) { /* ... existing ... */ });
        document.addEventListener('click', function(event) { /* ... existing ... */ }); 
        const resultContent = document.getElementById('result');
        if (resultContent) { /* ... existing ... */ }
    });
})();
