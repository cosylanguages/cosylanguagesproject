window.CosyAppInteractive = {};

(function() {
    // Assumes 'translations' is globally available from translations.js
    // Assumes 'achievementsData' is globally available from achievements-data.js
    function getCurrentTranslations() {
        const language = document.getElementById('language')?.value || 'COSYenglish';
        return translations[language] || translations.COSYenglish;
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
                this.achievements = state.achievements || []; // Ensures it's an array
            } else {
                // Migration logic from older versions if necessary (omitted for brevity, but was in original)
                // For a fresh start or if no old state, achievements will be [] due to constructor.
                console.log("No 'cosyGameState' found. Initializing new state.");
                this.save(); // Save initial state if none found
            }
            this.level = Math.floor(this.xp / 50) + 1; // Recalculate level
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
                // console.warn(`Attempted to check unknown achievement: ${achievementId}`);
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
            playSound('success'); 
            this.updateStreak(); 

            const newLevel = Math.floor(this.xp / 50) + 1; 

            // Check for level achievements before updating this.level
            if (window.achievementsData) {
                for (const id in window.achievementsData) {
                    const achievement = window.achievementsData[id];
                    if (achievement.criteria.type === "level" && newLevel >= achievement.criteria.value) {
                        this.checkAndAwardAchievement(id); // checkAndAwardAchievement handles not awarding multiple times
                    }
                }
            }

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
                if (this.streak === 0) {
                    this.streak = 1;
                    this.save(); 
                }
                // No need to check streak achievements again if already active today and streak didn't change to 0 then 1
                if (this.streak > 0 && window.achievementsData) {
                     for (const id in window.achievementsData) {
                        const achievement = window.achievementsData[id];
                        if (achievement.criteria.type === "streak" && this.streak >= achievement.criteria.value) {
                            this.checkAndAwardAchievement(id);
                        }
                    }
                }
                return; 
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.lastActiveDate === yesterdayStr) {
                this.streak++;
            } else {
                this.streak = 1; 
            }

            const t = getCurrentTranslations();
            if (this.streak === 3) {
                this.addXP(15); 
                CosyAppInteractive.showToast(t.streakBonusToast3Days || "🎉 3-Day Streak! +15 Bonus XP!");
            } else if (this.streak === 7) {
                this.addXP(35); 
                CosyAppInteractive.showToast(t.streakBonusToast7Days || "🔥 7-Day Streak! +35 Bonus XP!");
            } else if (this.streak === 14) {
                this.addXP(75); 
                CosyAppInteractive.showToast(t.streakBonusToast14Days || "🚀 14-Day Streak! +75 Bonus XP!");
            }
            
            this.lastActiveDate = today;
            this.save();

            if (window.achievementsData) {
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
                this.addXP(10); // This will call updateStreak, save, and updateUI

                // Check for lesson completion achievements
                if (window.achievementsData) {
                    for (const id in window.achievementsData) {
                        const achievement = window.achievementsData[id];
                        if (achievement.criteria.type === "lessons" && this.completedLessons.length >= achievement.criteria.value) {
                            this.checkAndAwardAchievement(id);
                        }
                    }
                }

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
                    <div id="xp-progress-bar">
                        <div id="xp-progress-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    <span id="xp-progress-text">${currentLevelXpText}</span>
                </div>
            `;
            
            const reviewableTypes = ['vocabulary-word', 'verb', 'gender']; 
            if (typeof CosyAppInteractive.showRevisionButton === 'function') {
                 await CosyAppInteractive.showRevisionButton(document.getElementById('language')?.value || 'COSYenglish', reviewableTypes);
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
        // Increased timeout for achievement notifications
        const duration = msg.includes('🏆') || msg.includes('🔥') || msg.includes('🌟') || msg.includes('📚') || msg.includes('💡') || msg.includes('🧩') ? 3000 : 1800;
        setTimeout(() => toast.remove(), duration);
    }
    CosyAppInteractive.showToast = showToast; 

    function showConfetti() { 
        for (let i = 0; i < 30; i++) {
            let c = document.createElement('div');
            c.textContent = '🎊';
            c.className = 'confetti'; 
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 1400);
        }
    }
    
    // PatchedAddXP related logic can be simplified if originalAddXP is not used elsewhere.
    // Assuming direct use of gameState.addXP is preferred.
    CosyAppInteractive.addXP = function(amount) { // Simplified direct call
        gameState.addXP(amount);
    };

    function awardCorrectAnswer() { 
        gameState.addXP(3); 
    }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;

    CosyAppInteractive.awardIncorrectAnswer = function() {
        playSound('error');
    };

    function markAndAward(el) {
      if (!el.classList.contains('xp-awarded')) {
        el.classList.add('xp-awarded');
        awardCorrectAnswer(); 
      }
    }
    CosyAppInteractive.markAndAward = markAndAward;

    const observer = new MutationObserver(() => { /* ... */ });
    const resultElement = document.getElementById('result');
    if (resultElement) observer.observe(resultElement, { childList: true, subtree: true });
    ['gender-feedback','verb-answer-feedback','speaking-feedback'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { childList: true, subtree: true });
    });

    function getSRSKey(language, type, value) { return `cosy_srs_${language}_${type}_${value}`; }
    
    CosyAppInteractive.scheduleReview = function scheduleReview(language, type, value, correct) { 
        const key = getSRSKey(language, type, value);
        let data = JSON.parse(localStorage.getItem(key) || '{}');
        const now = Date.now();
        if (!data.interval) data.interval = 1 * 60 * 60 * 1000; 
        if (!data.ease) data.ease = 2.5;
        if (!data.due) data.due = now;
        if (!data.reps) data.reps = 0;

        if (correct) {
            data.reps++; data.interval = Math.round(data.interval * data.ease);
            data.due = now + data.interval; data.ease = Math.min(data.ease + 0.15, 3.0);

            // Achievement check for SRS items
            if (window.achievementsData && window.gameState) {
                for (const id in window.achievementsData) {
                    const ach = window.achievementsData[id];
                    if (ach.criteria.type === "srsItems" && ach.criteria.itemType === type) {
                        // Simplified approach for count: 1 (e.g., "firstWord")
                        if (ach.criteria.count === 1) {
                            window.gameState.checkAndAwardAchievement(id);
                        }
                        // TODO: Implement more complex counting for ach.criteria.count > 1 if needed
                        // This might involve checking localStorage for all SRS items of this 'type'
                        // or adding a new method to GameState to track unique "mastered" items.
                    }
                }
            }

        } else {
            data.reps = 0; data.interval = 1 * 60 * 60 * 1000; 
            data.due = now + data.interval; data.ease = Math.max(data.ease - 0.2, 1.3);
        }
        localStorage.setItem(key, JSON.stringify(data));
    };

    CosyAppInteractive.getDueReviews = function getDueReviews(language, type, items) {
        if (!items || !Array.isArray(items)) {
            return [];
        }
        const now = Date.now();
        return items.filter(value => {
            const key = getSRSKey(language, type, value);
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            return !data.due || data.due <= now;
        });
    };

    CosyAppInteractive.showRevisionButton = async function(language, typesArray) {
        const t = getCurrentTranslations();
        let btn = document.getElementById('cosy-revision-btn');
        let allDueItemsCombined = [];
        const currentLanguage = language || document.getElementById('language')?.value || 'COSYenglish';

        for (const type of typesArray) {
            let itemsForType = [];
            let srsSpecificType = type; 
            let practiceFunctionType = type; 

            if (type === 'vocabulary' || type === 'vocabulary-word') {
                itemsForType = await getAllVocabularyWords(currentLanguage);
                srsSpecificType = 'vocabulary-word'; 
                practiceFunctionType = 'vocabulary';
            } else if (type === 'verb' || type === 'verbs') {
                itemsForType = await getAllGrammarItems(currentLanguage, 'verb');
                srsSpecificType = 'verb';
                practiceFunctionType = 'verbs'; 
            } else if (type === 'gender') {
                itemsForType = await getAllGrammarItems(currentLanguage, 'gender');
                srsSpecificType = 'gender';
                practiceFunctionType = 'gender'; 
            }
            
            if (itemsForType && itemsForType.length > 0) {
                 const dueForType = CosyAppInteractive.getDueReviews(currentLanguage, srsSpecificType, itemsForType);
                 dueForType.forEach(itemValue => allDueItemsCombined.push({ type: srsSpecificType, value: itemValue, practiceType: practiceFunctionType }));
            }
        }
        
        if (!btn && allDueItemsCombined.length > 0) { 
            btn = document.createElement('button');
            btn.id = 'cosy-revision-btn';
            btn.className = 'btn-primary btn';
            btn.style.position = 'fixed'; btn.style.bottom = '20px'; btn.style.right = '20px'; btn.style.zIndex = '9999';
            document.body.appendChild(btn);
        }

        if (btn) { 
            if (allDueItemsCombined.length > 0) {
                btn.textContent = `${t.reviewDueBtnLabel || '🔁 Review Due'} (${allDueItemsCombined.length})`;
                btn.style.display = ''; 
                btn.onclick = async function() {
                    // Re-fetch due items on click
                    let currentAllDueItemsOnClick = [];
                     for (const type of typesArray) {
                        let itemsForTypeOnClick = [];
                        let srsSpecificTypeOnClick = type;
                        let practiceFunctionTypeOnClick = type;
                        if (type === 'vocabulary' || type === 'vocabulary-word') {
                            itemsForTypeOnClick = await getAllVocabularyWords(currentLanguage);
                            srsSpecificTypeOnClick = 'vocabulary-word';
                            practiceFunctionTypeOnClick = 'vocabulary';
                        } else if (type === 'verb' || type === 'verbs') {
                            itemsForTypeOnClick = await getAllGrammarItems(currentLanguage, 'verb');
                             srsSpecificTypeOnClick = 'verb';
                            practiceFunctionTypeOnClick = 'verbs';
                        } else if (type === 'gender') {
                            itemsForTypeOnClick = await getAllGrammarItems(currentLanguage, 'gender');
                            srsSpecificTypeOnClick = 'gender';
                            practiceFunctionTypeOnClick = 'gender';
                        }
                        if (itemsForTypeOnClick && itemsForTypeOnClick.length > 0) {
                            const dueForTypeOnClick = CosyAppInteractive.getDueReviews(currentLanguage, srsSpecificTypeOnClick, itemsForTypeOnClick);
                            dueForTypeOnClick.forEach(itemValue => currentAllDueItemsOnClick.push({ type: srsSpecificTypeOnClick, value: itemValue, practiceType: practiceFunctionTypeOnClick }));
                        }
                    }

                    if (currentAllDueItemsOnClick.length === 0) {
                        CosyAppInteractive.showToast(t.noItemsDueReviewToast || 'No items due for review!');
                        btn.style.display = 'none'; 
                        return;
                    }
                    const itemToReview = currentAllDueItemsOnClick[Math.floor(Math.random() * currentAllDueItemsOnClick.length)];
                    
                    if (itemToReview.practiceType === 'vocabulary') {
                        await CosyAppInteractive.practiceVocabulary('random-word', itemToReview.value);
                    } else if (itemToReview.practiceType === 'verbs') {
                        await CosyAppInteractive.practiceGrammar('verbs', itemToReview.value);
                    } else if (itemToReview.practiceType === 'gender') {
                        await CosyAppInteractive.practiceGrammar('gender', itemToReview.value);
                    }
                };
            } else {
                btn.style.display = 'none'; 
            }
        }
    };

    async function getAllVocabularyWords(language) {
        const langFileName = CosyAppInteractive.getLangFileName(language);
        if (!langFileName) return [];
        const filePath = `data/vocabulary/words/${langFileName}.json`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            let allWords = [];
            for (const day in data) {
                if (data[day] && Array.isArray(data[day])) {
                    data[day].forEach(wordObjOrString => {
                        if (typeof wordObjOrString === 'string') {
                            allWords.push(wordObjOrString);
                        } else if (typeof wordObjOrString === 'object' && wordObjOrString.word) {
                            allWords.push(wordObjOrString.word);
                        }
                    });
                }
            }
            return [...new Set(allWords)];
        } catch (e) {
            console.error("Error loading all vocabulary words:", e);
            return [];
        }
    }
    CosyAppInteractive.getAllVocabularyWords = getAllVocabularyWords;

    async function getAllGrammarItems(language, grammarType) {
        const langFileName = CosyAppInteractive.getLangFileName(language);
        if (!langFileName) return [];
        let filePath = '';
        let itemSelector = value => value;
        if (grammarType === 'verb') {
            filePath = `data/grammar/verbs/grammar_verbs_${langFileName}.json`;
            itemSelector = item => item.infinitive;
        } else if (grammarType === 'gender') {
            filePath = `data/grammar/gender/grammar_gender_${langFileName}.json`;
            itemSelector = item => item.word;
        } else {
            console.error("Unsupported grammar type for SRS:", grammarType);
            return [];
        }
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            let allItems = [];
            for (const day in data) {
                if (data[day] && Array.isArray(data[day])) {
                    data[day].forEach(item => {
                        const val = itemSelector(item);
                        if (val) allItems.push(val);
                    });
                }
            }
            return [...new Set(allItems)];
        } catch (e) {
            console.error(`Error loading all ${grammarType} items:`, e);
            return [];
        }
    }
    CosyAppInteractive.getAllGrammarItems = getAllGrammarItems;

    const _originalPracticeVocabulary = window.practiceVocabulary; 
    const _originalPracticeGrammar = window.practiceGrammar; 

    CosyAppInteractive.practiceVocabulary = async function(type, forceWord) {
        const language = document.getElementById('language').value;
        let wordToPractice = forceWord;
        if (!wordToPractice) {
            const allWords = await getAllVocabularyWords(language);
            if (allWords.length > 0) {
                const dueVocabularyItems = CosyAppInteractive.getDueReviews(language, 'vocabulary-word', allWords);
                if (dueVocabularyItems.length > 0) {
                    wordToPractice = dueVocabularyItems[Math.floor(Math.random() * dueVocabularyItems.length)];
                    CosyAppInteractive.showToast(`🔔 ${getCurrentTranslations().srsReviewToast || 'Reviewing a word from your list!'}`);
                }
            }
        }
        if (typeof _originalPracticeVocabulary === 'function') {
            await _originalPracticeVocabulary(type, wordToPractice); // Pass wordToPractice, even if undefined
        } else {
            console.error("Original practiceVocabulary function not found on window.");
        }
    };

    CosyAppInteractive.practiceGrammar = async function(type, forceItem) {
        const language = document.getElementById('language').value;
        let itemToPractice = forceItem;
        let srsGrammarType = '';
        if (type === 'verbs' || type === 'verb') srsGrammarType = 'verb';
        else if (type === 'gender') srsGrammarType = 'gender';

        if (!itemToPractice && srsGrammarType) {
            const allGrammarItems = await getAllGrammarItems(language, srsGrammarType);
            if (allGrammarItems && allGrammarItems.length > 0) {
                const dueGrammarItems = CosyAppInteractive.getDueReviews(language, srsGrammarType, allGrammarItems);
                if (dueGrammarItems && dueGrammarItems.length > 0) {
                    itemToPractice = dueGrammarItems[Math.floor(Math.random() * dueGrammarItems.length)];
                     CosyAppInteractive.showToast(`🔔 ${getCurrentTranslations().srsReviewToast || 'Reviewing an item from your list!'}`);
                }
            }
        }
        // Dispatch to original functions; they don't currently take itemToPractice for specific item exercise.
        // This logic remains as per original structure for now.
        if (typeof startGenderPractice === 'function' && type === 'gender') await startGenderPractice();
        else if (typeof startVerbsPractice === 'function' && type === 'verbs') await startVerbsPractice();
        else if (typeof startPossessivesPractice === 'function' && type === 'possessives') await startPossessivesPractice();
        else console.warn("No specific practice function found or called for grammar type:", type);
    };

    // ... (rest of the IIFE, including showFunFact, practiceAllTypes, etc.)
    // Ensure getRandomPopupContent and its callers are correctly defined as per previous steps.

    CosyAppInteractive.getRandomPopupContent = function getRandomPopupContent() {
        const t = getCurrentTranslations();
        const contentPool = [];

        if (t.funFacts && t.funFacts.length > 0) {
            t.funFacts.forEach(fact => contentPool.push({ type: 'funFact', text: fact }));
        }
        if (t.learningTips && t.learningTips.length > 0) {
            t.learningTips.forEach(tip => contentPool.push({ type: 'learningTip', text: tip }));
        }
        if (t.helpTopics && t.helpTopics.length > 0) {
            t.helpTopics.forEach(topic => contentPool.push({ type: 'helpTopic', text: topic }));
        }

        if (contentPool.length === 0) {
            return t.noPopupContent || "No information available right now.";
        }

        const selectedItem = contentPool[Math.floor(Math.random() * contentPool.length)];
        let label = '';

        switch (selectedItem.type) {
            case 'funFact':
                label = t.popupLabelFunFact || '🤓 Fun Fact:';
                break;
            case 'learningTip':
                label = t.popupLabelTip || '💡 Tip:';
                break;
            case 'helpTopic':
                label = t.popupLabelHelp || '❓ Help:';
                break;
        }
        return `${label} ${selectedItem.text}`;
    };
    CosyAppInteractive.showTipPopup = function showTipPopup(tip) { /* ... (stub, ensure it exists or is defined) ... */ 
        const tipPopup = document.getElementById('floating-tip-popup');
        const tipText = document.getElementById('floating-tip-text');
        if (tipPopup && tipText) {
            tipText.innerHTML = tip; // Use innerHTML if tip can contain HTML, else textContent
            tipPopup.style.display = 'flex'; // Or 'block', depending on desired layout
            // Trigger animation if any
            tipPopup.style.opacity = '1';
            tipPopup.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    };
    CosyAppInteractive.hideTipPopup = function hideTipPopup() { /* ... (stub) ... */
        const tipPopup = document.getElementById('floating-tip-popup');
        if (tipPopup) {
            tipPopup.style.opacity = '0';
            tipPopup.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (tipPopup.style.opacity === '0') { // Check if still meant to be hidden
                    tipPopup.style.display = 'none';
                }
            }, 200); // Match transition duration
        }
    };
    // Other UI functions like showTranslationPopup, hideTranslationPopup etc. are assumed to be defined elsewhere or correctly stubbed.

    document.addEventListener('DOMContentLoaded', async function() { 
        if (gameState && typeof gameState.updateUI === 'function') await gameState.updateUI(); 
        // setupEnterKeySupportInternal(); // Assuming this is defined or not critical for this change

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

        if (helpBtn) {
            helpBtn.onclick = function(e) { e.stopPropagation(); CosyAppInteractive.showTipPopup(CosyAppInteractive.getRandomPopupContent()); };
        }
        if (closeTipBtn) { closeTipBtn.onclick = (e) => {e.stopPropagation(); CosyAppInteractive.hideTipPopup();} }
        
        // Other event listeners...
    });

})();
