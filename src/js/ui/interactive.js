window.CosyAppInteractive = {};

(function() {
    // // Latinization toggle state - CONFLICTING LOGIC - REMOVED/COMMENTED
    // let isLatinizationEnabled = localStorage.getItem('latinizationEnabled') === 'false' ? false : true;

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
            reviewsDueLabel: 'Reviews Due: ', // Added this line
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
            // Removed initial save() from load() to prevent premature UI update before full load in some cases.
            // this.save(); 
        }
        save() {
            this.learningItems = this.learningItems || {};
            const stateToSave = { xp: this.xp, level: this.level, streak: this.streak, lastActiveDate: this.lastActiveDate, completedLessons: this.completedLessons, achievements: this.achievements, currentSessionExerciseCount: this.currentSessionExerciseCount, learningItems: this.learningItems };
            localStorage.setItem('cosyGameState', JSON.stringify(stateToSave));
            this.updateUI(); // Update UI whenever state is saved.
        }
        showAchievementNotification(achievementId) { /* ... existing ... */ }
        checkAndAwardAchievement(achievementId) { /* ... existing ... */ }
        addXP(amount) { /* ... existing ... */ }

        reduceXP(amount) {
            if (amount <= 0) return; // Only reduce by positive amounts
            this.xp = Math.max(0, this.xp - amount); // Ensure XP doesn't go below 0
            const newLevel = Math.floor(this.xp / 50) + 1;
            if (newLevel < this.level) {
                this.level = newLevel;
            } else if (newLevel > this.level) {
                this.level = newLevel;
            }
            this.save();
            // this.updateUI(); // updateUI is called by save()
            console.log(`Reduced XP by ${amount}. New XP: ${this.xp}`);
        }

        updateStreak() { /* ... existing ... */ }
        completeLesson(lessonId) { /* ... existing ... */ }
        
        async updateUI() {
            // Update XP, Level, Streak (existing logic)
            const xpValueElement = document.getElementById('xp-value');
            if (xpValueElement) xpValueElement.textContent = this.xp;
            const levelValueElement = document.getElementById('level-value');
            if (levelValueElement) levelValueElement.textContent = this.level;
            const streakValueElement = document.getElementById('streak-value');
            if (streakValueElement) streakValueElement.textContent = this.streak;

            // Reviews Due Counter Logic
            const currentLanguage = document.getElementById('language')?.value;
            let totalReviewsDue = 0;

            if (currentLanguage && typeof CosyAppInteractive.getDueReviewItems === 'function') {
                const itemTypesForReviewCount = [
                    'vocabulary-word', 
                    'grammar-article',
                    'vocabulary-image', // Assuming itemValue for these is the image src or a word associated with image
                    'grammar-verb' // Assuming itemValue is verb infinitive
                    // Add other itemTypes as they are defined in scheduleReview calls elsewhere
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
                reviewCounterContainer.style.marginTop = '5px'; // Basic styling for visibility

                const label = document.createElement('span');
                const t = getCurrentTranslations(); 
                label.textContent = t.reviewsDueLabel || 'Reviews Due: ';
                label.id = 'reviews-due-counter-label'; // Assign an ID to the label too

                const valueSpan = document.createElement('span');
                valueSpan.id = 'reviews-due-count-value';
                valueSpan.textContent = '0'; // Initial value

                reviewCounterContainer.appendChild(label);
                reviewCounterContainer.appendChild(valueSpan);

                const xpStatsElement = document.getElementById('xp-stats'); 
                if (xpStatsElement) {
                    xpStatsElement.appendChild(reviewCounterContainer);
                } else {
                    // Fallback: if xp-stats is not found, maybe append to another known stats container or body
                    const statsContainer = document.querySelector('.stats-container'); // Generic stats container
                    if (statsContainer) {
                        statsContainer.appendChild(reviewCounterContainer);
                    } else {
                         document.body.appendChild(reviewCounterContainer); // Last resort, less ideal
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
    // gameState.updateUI(); // Initial UI update after gameState is created and potentially loaded.
                           // updateUI is called by save(), which is called by load(). So this might be redundant here.

    function showToast(msg) { /* ... existing ... */ }
    CosyAppInteractive.showToast = showToast;
    CosyAppInteractive.addXP = function(amount) { gameState.addXP(amount); };
    CosyAppInteractive.reduceXP = function(amount) { if (gameState) gameState.reduceXP(amount); };

    function awardCorrectAnswer() { 
        if (typeof playSound === 'function') playSound('success'); 
    }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;
    CosyAppInteractive.awardIncorrectAnswer = function() { 
        if (typeof playSound === 'function') playSound('error'); 
    };
    function markAndAward(el) { /* ... existing ... */ }
    CosyAppInteractive.markAndAward = markAndAward;

    CosyAppInteractive.scheduleReview = function(language, itemType, itemValue, isCorrect) {
        if (!gameState || !gameState.learningItems) {
            console.error("GameState or learningItems not initialized.");
            return;
        }

        const id = `${itemType}_${language}_${itemValue}`.toLowerCase().replace(/\s+/g, '_');
        let item = gameState.learningItems[id];

        const now = new Date();

        if (!item) {
            item = {
                id: id,
                itemValue: itemValue, // This is the string identifier, e.g. word, image_src, verb_infinitive
                itemType: itemType,
                language: language,
                proficiencyBucket: 0,
                lastReviewedDate: now.toISOString(),
                nextReviewDate: now.toISOString(), // Review immediately for new items
                correctInARow: 0,
                totalCorrect: 0,
                totalIncorrect: 0
                // itemData: itemFullData // If we decide to store full objects, this would be the place
            };
        }

        item.lastReviewedDate = now.toISOString();

        const MAX_PROFICIENCY_BUCKET = 5; 
        const reviewIntervalsDays = [1, 3, 7, 14, 30, 60]; 

        if (isCorrect) {
            item.correctInARow++;
            item.totalCorrect++;
            if (item.proficiencyBucket < MAX_PROFICIENCY_BUCKET) {
                item.proficiencyBucket++;
            }
            const daysToAdd = reviewIntervalsDays[Math.min(item.proficiencyBucket, reviewIntervalsDays.length - 1)];
            let nextReview = new Date(now);
            nextReview.setDate(now.getDate() + daysToAdd);
            item.nextReviewDate = nextReview.toISOString();
        } else { // isCorrect is false or null (for initial scheduling if that path was taken)
            item.correctInARow = 0;
            if (isCorrect === false) { // Only increment totalIncorrect if explicitly false (not null)
                 item.totalIncorrect++;
            }
            if (item.proficiencyBucket > 0) {
                item.proficiencyBucket--;
            }
            let nextReview = new Date(now);
            nextReview.setDate(now.getDate() + 1); 
            item.nextReviewDate = nextReview.toISOString();
        }

        gameState.learningItems[id] = item;
        gameState.save();
    };

    CosyAppInteractive.getDueReviewItems = function(language, itemType, maxItems = 1) {
        if (!gameState || !gameState.learningItems) {
            console.warn("GameState or learningItems not initialized. Cannot fetch review items.");
            return [];
        }
        const now = new Date().toISOString();
        const dueItems = [];
        for (const id in gameState.learningItems) {
            if (gameState.learningItems.hasOwnProperty(id)) {
                const item = gameState.learningItems[id];
                if (item.language === language && 
                    item.itemType === itemType &&
                    item.nextReviewDate <= now) {
                    dueItems.push(item);
                }
            }
        }
        dueItems.sort((a, b) => {
            if (a.proficiencyBucket !== b.proficiencyBucket) {
                return a.proficiencyBucket - b.proficiencyBucket;
            }
            return new Date(a.nextReviewDate) - new Date(b.nextReviewDate);
        });
        return dueItems.slice(0, maxItems);
    };

    // --- Transliteration Popup Logic ---
    let transliterationPopup = null; 
    function ensureTransliterationPopupExists() { /* ... existing ... */ }
    function showTransliterationPopup(transliteratedText, event) { /* ... existing ... */ }
    CosyAppInteractive.showTransliterationPopup = showTransliterationPopup;
    function hideTransliterationPopup() { /* ... existing ... */ }
    CosyAppInteractive.hideTransliterationPopup = hideTransliterationPopup;
    // --- End Transliteration Popup Logic ---

    document.addEventListener('DOMContentLoaded', async function() { 
        if (gameState && typeof gameState.updateUI === 'function') {
            // gameState.load(); // Ensure state is loaded before first UI update
            await gameState.updateUI(); // updateUI is now async due to potential element creation
        }
        
        // Language selector change listener
        const languageSelector = document.getElementById('language');
        if (languageSelector) {
            languageSelector.addEventListener('change', () => {
                if (gameState && typeof gameState.updateUI === 'function') {
                    gameState.updateUI();
                }
            });
        }

        document.body.addEventListener('click', function(event) {
            if (event.target.matches('button:not(.btn-emoji, #speaking-record-btn), .article-option-btn, .word-option, .match-item')) {
                if (!event.target.closest('.no-generic-click-sound')) {
                    if (typeof playSound === 'function') playSound('click'); 
                }
            }
        }, true);
        
        document.addEventListener('click', function(event) {
            if (transliterationPopup && transliterationPopup.style.display !== 'none') {
                if (!transliterationPopup.contains(event.target) && event.target.id !== 'toggle-latinization-btn' && !event.target.closest('#toggle-latinization-btn')) {
                    hideTransliterationPopup();
                }
            }
        }, false); 

        const resultContent = document.getElementById('result');
        if (resultContent) {
            const targetLanguages = ["ΚΟΖΥελληνικά", "ТАКОЙрусский", "ԾՈՍՅհայկական"];
            resultContent.addEventListener('click', function(event) { /* ... existing ... */ });
            resultContent.addEventListener('mouseup', function(event) { /* ... existing ... */ });
        }
    });
})();
