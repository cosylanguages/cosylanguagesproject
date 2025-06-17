window.CosyAppInteractive = {};

(function() {
    // Assumes 'translations' is globally available from translations.js
    // Assumes 'achievementsData' is globally available from achievements-data.js
    function getCurrentTranslations() {
        const language = document.getElementById('language')?.value || 'COSYenglish';
        return window.translations[language] || window.translations.COSYenglish;
    }

    const SOUNDS = {
        click: new Audio('assets/sounds/click.mp3'),
        select: new Audio('assets/sounds/select.mp3'),
        success: new Audio('assets/sounds/success.mp3'),
        error: new Audio('assets/sounds/error.mp3')
    };

    function playSound(type) {
        SOUNDS[type].currentTime = 0;
        SOUNDS[type].play().catch(e => console.log("Audio play failed:", e));
    }

    class GameState {
        constructor() {
            this.xp = 0;
            this.level = 1;
            this.streak = 0;
            this.lastActiveDate = null; // YYYY-MM-DD
            this.completedLessons = [];
            this.achievements = [];
            this.currentSessionExerciseCount = 0; // Added for session tracking
            this.exercisesPerSessionGoal = 5;     // Added for session tracking
            this.load();
        }

        load() {
            const savedState = localStorage.getItem('cosyGameState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.xp = state.xp || 0;
                this.level = state.level || 1; 
                this.streak = state.streak || 0;
                this.lastActiveDate = state.lastActiveDate || null;
                this.completedLessons = state.completedLessons || [];
                this.achievements = state.achievements || [];
                this.currentSessionExerciseCount = state.currentSessionExerciseCount || 0; // Load session count
                // exercisesPerSessionGoal is fixed for now, so no need to load it unless it becomes configurable
            } else {
                console.log("No 'cosyGameState' found. Initializing new state.");
                // currentSessionExerciseCount is already 0 from constructor
            }
            this.level = Math.floor(this.xp / 50) + 1; // Recalculate level
            this.save(); // Save initial or loaded state (especially if new fields were added)
            this.updateUI();
        }

        save() {
            const stateToSave = {
                xp: this.xp,
                level: this.level,
                streak: this.streak,
                lastActiveDate: this.lastActiveDate,
                completedLessons: this.completedLessons,
                achievements: this.achievements,
                currentSessionExerciseCount: this.currentSessionExerciseCount, // Save session count
            };
            localStorage.setItem('cosyGameState', JSON.stringify(stateToSave));
        }

        showAchievementNotification(achievementId) {
            const t = getCurrentTranslations();
            if (!window.achievementsData) {
                console.error("achievementsData not found on window.");
                return;
            }
            const achievement = window.achievementsData[achievementId];
            if (achievement) {
                const name = t[achievement.nameKey] || achievementId;
                const desc = t[achievement.descriptionKey] || '';
                CosyAppInteractive.showToast(`${achievement.icon || '🏆'} ${name} - ${desc}`);
            } else {
                console.warn(`Achievement with ID ${achievementId} not found in achievementsData.`);
            }
        }

        checkAndAwardAchievement(achievementId) {
            if (!window.achievementsData || !window.achievementsData[achievementId]) {
                return; 
            }
            if (this.achievements.includes(achievementId)) {
                return; 
            }
            this.achievements.push(achievementId);
            this.save();
            this.showAchievementNotification(achievementId);
        }

        addXP(amount) {
            const t = getCurrentTranslations();
            this.xp += amount;
            // playSound('success'); // Sound is played by awardCorrectAnswer or other specific event
            this.updateStreak(); 

            const newLevel = Math.floor(this.xp / 50) + 1; 

            if (window.achievementsData) {
                for (const id in window.achievementsData) {
                    const achievement = window.achievementsData[id];
                    if (achievement.criteria.type === "level" && newLevel >= achievement.criteria.value) {
                        this.checkAndAwardAchievement(id); 
                    }
                }
            }

            if (newLevel > this.level) {
                this.level = newLevel;
                let levelUpMsg = t.levelUpToast || `🎉 Level up! You are now level {level}!`;
                CosyAppInteractive.showToast(levelUpMsg.replace('{level}', this.level));
                this.showLevelUpEffect();
            }
            this.save(); 
            this.updateUI();
        }

        updateStreak() {
            const today = new Date().toISOString().split('T')[0]; 
            if (this.lastActiveDate === today) {
                if (this.streak === 0) this.streak = 1; // Started today
                // Check streak achievements if streak is positive
                if (this.streak > 0 && window.achievementsData) {
                     for (const id in window.achievementsData) {
                        const achievement = window.achievementsData[id];
                        if (achievement.criteria.type === "streak" && this.streak >= achievement.criteria.value) {
                            this.checkAndAwardAchievement(id);
                        }
                    }
                }
                // No save here, will be saved by addXP or when session count changes
                return; 
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.lastActiveDate === yesterdayStr) {
                this.streak++;
            } else {
                this.streak = 1; // Reset if not yesterday or today
            }
            
            const t = getCurrentTranslations();
            if (this.streak === 3) { // Example: Bonus XP can be given directly or via addXP
                CosyAppInteractive.showToast(t.streakBonusToast3Days || "🎉 3-Day Streak! +15 Bonus XP!");
                this.xp += 15; // Direct XP to avoid double streak update if addXP calls updateStreak
            } else if (this.streak === 7) {
                CosyAppInteractive.showToast(t.streakBonusToast7Days || "🔥 7-Day Streak! +35 Bonus XP!");
                this.xp += 35; 
            } else if (this.streak === 14) {
                CosyAppInteractive.showToast(t.streakBonusToast14Days || "🚀 14-Day Streak! +75 Bonus XP!");
                this.xp += 75;
            }
            
            this.lastActiveDate = today;
            // Save will be called by addXP or session logic
            if (window.achievementsData) { // Check streak achievements after update
                for (const id in window.achievementsData) {
                    const achievement = window.achievementsData[id];
                    if (achievement.criteria.type === "streak" && this.streak >= achievement.criteria.value) {
                        this.checkAndAwardAchievement(id);
                    }
                }
            }
        }

        completeLesson(lessonId) {
            if (!this.completedLessons.includes(lessonId)) {
                this.completedLessons.push(lessonId);
                console.log(`Lesson ${lessonId} completed.`);
                this.addXP(10); 

                if (window.achievementsData) {
                    for (const id in window.achievementsData) {
                        const achievement = window.achievementsData[id];
                        if (achievement.criteria.type === "lessons" && this.completedLessons.length >= achievement.criteria.value) {
                            this.checkAndAwardAchievement(id);
                        }
                    }
                }
            }
        }

        async updateUI() { 
            const t = getCurrentTranslations();
            let stats = document.getElementById('cosy-gamestats');
            if (!stats) {
                stats = document.createElement('div');
                stats.id = 'cosy-gamestats';
                stats.className = 'game-stats'; 
                document.body.prepend(stats); 
            }
            const xpPerLevel = 50;
            const currentLevelXp = this.xp % xpPerLevel;
            const progressPercent = (this.xp % xpPerLevel) / xpPerLevel * 100;
            const currentLevelXpText = `${currentLevelXp}/${xpPerLevel}`;
            stats.innerHTML = `
                <span id="gamestats-text">${t.statsXp || 'XP:'} ${this.xp} | ${t.statsLevel || 'Level:'} ${this.level} | ${t.statsStreak || 'Streak:'} ${this.streak}</span>
                <div id="xp-progress-container">
                    <div id="xp-progress-bar"><div id="xp-progress-fill" style="width: ${progressPercent}%;"></div></div>
                    <span id="xp-progress-text">${currentLevelXpText}</span>
                </div>`;
            if (typeof CosyAppInteractive.showRevisionButton === 'function') {
                 await CosyAppInteractive.showRevisionButton(document.getElementById('language')?.value || 'COSYenglish', ['vocabulary-word', 'verb', 'gender']);
            }
        }

        showLevelUpEffect() {
            let stats = document.getElementById('cosy-gamestats');
            if (stats) {
                stats.classList.add('levelup');
                setTimeout(() => stats.classList.remove('levelup'), 1200);
            }
            showConfetti(); 
        }
    }
    CosyAppInteractive.GameState = GameState; 
    const gameState = new GameState(); 

    function showToast(msg) {
        let toast = document.createElement('div');
        toast.textContent = msg;
        toast.className = 'cosy-toast';
        document.body.appendChild(toast);
        const duration = msg.includes('🏆') || msg.includes('🔥') || msg.includes('🌟') || msg.includes('📚') || msg.includes('💡') || msg.includes('🧩') ? 3000 : 1800;
        setTimeout(() => toast.remove(), duration);
    }
    CosyAppInteractive.showToast = showToast; 

    function showConfetti() { /* ... (implementation as before) ... */ }
    
    CosyAppInteractive.addXP = function(amount) {
        gameState.addXP(amount); // This will call internal save and UI update
    };

    // MODIFIED awardCorrectAnswer function
    function awardCorrectAnswer() {
        playSound('success'); 
        gameState.addXP(1); // Award 1 XP for the correct answer itself (this calls save and UI update)

        gameState.currentSessionExerciseCount = (gameState.currentSessionExerciseCount || 0) + 1;
        // gameState.save(); // Save after incrementing count - addXP already saves, this might be redundant unless addXP's save is too early

        if (gameState.currentSessionExerciseCount >= gameState.exercisesPerSessionGoal) {
            const t = getCurrentTranslations(); 
            gameState.addXP(5); // Session bonus XP (this calls save and UI update)
            CosyAppInteractive.showToast(t.sessionCompleteToast || `Great focus! Session of ${gameState.exercisesPerSessionGoal} exercises complete! +5 Bonus XP!`);
            gameState.currentSessionExerciseCount = 0; // Reset for next session
            gameState.save(); // Explicitly save after reset and bonus
        } else {
            gameState.save(); // Save if no bonus, just to persist currentSessionExerciseCount
        }
        // gameState.updateUI(); // addXP already calls updateUI
    }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;

    CosyAppInteractive.awardIncorrectAnswer = function() {
        playSound('error');
        // No XP change, but could reset session count if desired (not in current req)
        // gameState.currentSessionExerciseCount = 0; 
        // gameState.save();
    };

    function markAndAward(el) {
      if (!el.classList.contains('xp-awarded')) {
        el.classList.add('xp-awarded');
        CosyAppInteractive.awardCorrectAnswer(); // Use the new centralized function
      }
    }
    CosyAppInteractive.markAndAward = markAndAward;

    // Observer for dynamically added feedback elements (remains as is)
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.correct') || node.querySelector('.correct')) {
                            // Check if the element itself or a child has .correct
                            const targetEl = node.matches('.correct') ? node : node.querySelector('.correct');
                            // Ensure feedback is directly in result or a known feedback area to avoid double-awarding
                            if (targetEl && (targetEl.closest('#result') || targetEl.id.includes('-feedback'))) {
                                markAndAward(targetEl);
                            }
                        }
                    }
                });
            }
        });
    });
    const resultElement = document.getElementById('result');
    if (resultElement) observer.observe(resultElement, { childList: true, subtree: true });
    ['gender-feedback','verb-answer-feedback','speaking-feedback', 'opposite-feedback', 'match-feedback', 'build-feedback', 'image-feedback', 'transcription-feedback', 'sound-match-feedback', 'order-feedback', 'gap-feedback', 'select-article-feedback'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { childList: true, subtree: true });
    });


    function getSRSKey(language, type, value) { return `cosy_srs_${language}_${type}_${value}`; }
    
    CosyAppInteractive.scheduleReview = function scheduleReview(language, type, value, correct) { /* ... (implementation as before) ... */ };
    CosyAppInteractive.getDueReviews = function getDueReviews(language, type, items) { /* ... (implementation as before) ... */ };
    CosyAppInteractive.showRevisionButton = async function(language, typesArray) { /* ... (implementation as before) ... */ };
    CosyAppInteractive.getAllVocabularyWords = async function getAllVocabularyWords(language) { /* ... (implementation as before) ... */ };
    CosyAppInteractive.getAllGrammarItems = async function getAllGrammarItems(language, grammarType) { /* ... (implementation as before) ... */ };
    
    // Store original practice functions before potentially overwriting them
    const _originalPracticeVocabulary = window.practiceVocabulary; 
    const _originalPracticeGrammar = window.practiceGrammar; 

    CosyAppInteractive.practiceVocabulary = async function(type, forceWord) { /* ... (implementation as before) ... */ };
    CosyAppInteractive.practiceGrammar = async function(type, forceItem) { /* ... (implementation as before) ... */ };
    
    CosyAppInteractive.getRandomPopupContent = function getRandomPopupContent() { /* ... (implementation as before) ... */ };
    CosyAppInteractive.showTipPopup = function showTipPopup(tip) { /* ... (implementation as before) ... */ };
    CosyAppInteractive.hideTipPopup = function hideTipPopup() { /* ... (implementation as before) ... */ };

    document.addEventListener('DOMContentLoaded', async function() { 
        if (gameState && typeof gameState.updateUI === 'function') await gameState.updateUI(); 
        document.body.addEventListener('click', function(event) {
            if (event.target.matches('button:not(.btn-emoji, #speaking-record-btn), .article-option-btn, .word-option, .match-item')) {
                if (!event.target.closest('.no-generic-click-sound')) {
                     playSound('click');
                }
            }
        }, true);
        const helpBtn = document.getElementById('floating-help-btn');
        const tipPopup = document.getElementById('floating-tip-popup');
        const closeTipBtn = tipPopup?.querySelector('.close-tip');
        if (helpBtn) { helpBtn.onclick = function(e) { e.stopPropagation(); CosyAppInteractive.showTipPopup(CosyAppInteractive.getRandomPopupContent()); }; }
        if (closeTipBtn) { closeTipBtn.onclick = (e) => {e.stopPropagation(); CosyAppInteractive.hideTipPopup();} }
    });

})();
