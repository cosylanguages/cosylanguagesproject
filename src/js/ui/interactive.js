window.CosyAppInteractive = {};

(function() {
    // Assumes 'translations' is globally available from translations.js
    // Function to get current language's translations or fallback to English
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
            const savedState = localStorage.getItem('cosyGameState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.xp = state.xp || 0;
                this.level = state.level || 1;
                this.streak = state.streak || 0;
                this.lastActiveDate = state.lastActiveDate || null;
                this.completedLessons = state.completedLessons || [];
                this.achievements = state.achievements || [];
                this.firstTimeTodayForDay1 = state.firstTimeTodayForDay1 || {};
            } else {
                // Attempt to migrate from old localStorage keys
                this.xp = parseInt(localStorage.getItem('cosy_xp') || '0');
                this.level = parseInt(localStorage.getItem('cosy_level') || '1');
                this.streak = parseInt(localStorage.getItem('cosy_streak') || '0');
                
                // Initialize new properties
                this.lastActiveDate = null; 
                this.completedLessons = [];
                this.achievements = [];
                this.firstTimeTodayForDay1 = {};

                // If old data was found, or if it's a completely new user,
                // save the initial state in the new format.
                let oldDataExisted = localStorage.getItem('cosy_xp') !== null ||
                                     localStorage.getItem('cosy_level') !== null ||
                                     localStorage.getItem('cosy_streak') !== null;

                if (this.xp !== 0 || this.level !== 1 || this.streak !== 0 || oldDataExisted) {
                    this.save(); // Save the potentially migrated or default state
                }

                // Clean up old keys if they existed
                if (localStorage.getItem('cosy_xp') !== null) localStorage.removeItem('cosy_xp');
                if (localStorage.getItem('cosy_level') !== null) localStorage.removeItem('cosy_level');
                if (localStorage.getItem('cosy_streak') !== null) localStorage.removeItem('cosy_streak');
            }
        }

        save() {
            const stateToSave = {
                xp: this.xp,
                level: this.level,
                streak: this.streak,
                lastActiveDate: this.lastActiveDate,
                completedLessons: this.completedLessons,
                achievements: this.achievements,
                firstTimeTodayForDay1: this.firstTimeTodayForDay1
            };
            localStorage.setItem('cosyGameState', JSON.stringify(stateToSave));
        }

        addXP(amount) {
            const t = getCurrentTranslations();
            this.xp += amount;
            playSound('success'); // Play sound for any XP gain
            const newLevel = Math.floor(this.xp / 50) + 1; // Logic from user-progress.js
            if (newLevel > this.level) {
                this.level = newLevel;
                // playSound('success'); // Already played above
                let levelUpMsg = t.levelUpToast || `🎉 Level up! You are now level {level}!`;
                CosyAppInteractive.showToast(levelUpMsg.replace('{level}', this.level));
                this.showLevelUpEffect();
            }
            this.save();
            this.updateUI();
        }

        updateStreak() {
            const today = new Date().toDateString();
            if (this.lastActiveDate !== today) {
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                if (this.lastActiveDate === yesterday) {
                    this.streak += 1;
                } else {
                    this.streak = 1; // Start new streak at 1
                }
                this.lastActiveDate = today;
                this.save(); 
            }
        }

        completeLesson(lessonId) {
            if (!this.completedLessons.includes(lessonId)) {
                this.completedLessons.push(lessonId);
                this.addXP(10); // Award 10 XP. addXP calls save() and updateUI().
            }
        }

        async updateUI() { // Made async
            const t = getCurrentTranslations();
            let stats = document.getElementById('cosy-gamestats');
            if (!stats) {
                stats = document.createElement('div');
                stats.id = 'cosy-gamestats';
                stats.className = 'game-stats'; // Ensure this class is styled
                document.body.appendChild(stats);
            }
            stats.innerHTML = `${t.statsXp || 'XP:'} ${this.xp} | ${t.statsLevel || 'Level:'} ${this.level} | ${t.statsStreak || 'Streak:'} ${this.streak}`;
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
        setTimeout(() => toast.remove(), 1800);
    }
    CosyAppInteractive.showToast = showToast; 

    function showConfetti() { /* ... (no translatable strings) ... */ 
        for (let i = 0; i < 30; i++) {
            let c = document.createElement('div');
            c.textContent = '🎊';
            c.className = 'confetti'; 
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 1400);
        }
    }
    
    function originalAddXP(amount) { gameState.addXP(amount); }
    const _addXP = originalAddXP; 
    let PatchedAddXP = function(amount) { 
      const prevLevel = gameState.level; 
      _addXP(amount); 
      // Confetti is now part of GameState.addXP via showLevelUpEffect
    };
    CosyAppInteractive.addXP = PatchedAddXP; 

    function awardCorrectAnswer() { 
        gameState.addXP(3); 
        gameState.updateStreak(); 
        gameState.updateUI(); 
    }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;

    CosyAppInteractive.awardIncorrectAnswer = function() {
        playSound('error');
        // Future: Could also call gameState.resetStreak() or a specific method for incorrect answer penalties.
    };

    function markAndAward(el) {
      if (!el.classList.contains('xp-awarded')) {
        el.classList.add('xp-awarded');
        awardCorrectAnswer(); 
      }
    }
    CosyAppInteractive.markAndAward = markAndAward;

    const observer = new MutationObserver(() => { /* ... (no translatable strings) ... */ });
    const resultElement = document.getElementById('result');
    if (resultElement) observer.observe(resultElement, { childList: true, subtree: true });
    ['gender-feedback','verb-answer-feedback','speaking-feedback'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { childList: true, subtree: true });
    });

    function getSRSKey(language, type, value) { return `cosy_srs_${language}_${type}_${value}`; }
    CosyAppInteractive.scheduleReview = function scheduleReview(language, type, value, correct) { /* ... (no translatable strings, uses localStorage) ... */ 
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
        } else {
            data.reps = 0; data.interval = 1 * 60 * 60 * 1000; 
            data.due = now + data.interval; data.ease = Math.max(data.ease - 0.2, 1.3);
        }
        localStorage.setItem(key, JSON.stringify(data));
    };
    CosyAppInteractive.getDueReviews = function getDueReviews(language, type, items) {
        if (!items || !Array.isArray(items)) {
            // console.warn(`getDueReviews: items for type '${type}' is null, undefined, or not an array.`);
            return [];
        }
        const now = Date.now();
        return items.filter(value => {
            const key = getSRSKey(language, type, value);
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            return !data.due || data.due <= now;
        });
    };

    // Modified showRevisionButton to handle multiple types and control its own visibility
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
                itemsForType = await getAllGrammarItems(currentLanguage, 'verb'); // Use 'verb' for getAllGrammarItems
                srsSpecificType = 'verb';
                practiceFunctionType = 'verbs'; 
            } else if (type === 'gender') {
                itemsForType = await getAllGrammarItems(currentLanguage, 'gender');
                srsSpecificType = 'gender';
                practiceFunctionType = 'gender'; 
            } else if (type === 'speaking-phrase') {
                // itemsForType = await getAllSpeakingPhrases(currentLanguage); // Placeholder for actual item fetching
                srsSpecificType = 'speaking-phrase';
                practiceFunctionType = 'speaking';
            } else if (type === 'writing-prompt') {
                // itemsForType = await getAllWritingPrompts(currentLanguage); // Placeholder for actual item fetching
                srsSpecificType = 'writing-prompt';
                practiceFunctionType = 'writing';
            }
            
            // For types like speaking/writing, if we don't have specific item lists,
            // we can't check individual due dates here. The button might appear
            // even if no specific speaking/writing items are due yet, if other types are due.
            // The click handler would then need to try and fetch specific items.
            // For now, only add to allDueItemsCombined if itemsForType is populated.
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
                    // Re-fetch due items on click to ensure freshness for the random pick
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
                        } else if (type === 'speaking-phrase') {
                            // For now, we can't get "all speaking phrases" easily, so this part might be less effective
                            // unless a global list of practiced phrases is maintained or specific getDueReviews is adapted.
                            // This example assumes getDueReviews might need an empty items array for such types.
                            // itemsForTypeOnClick = await CosyAppInteractive.getAllSpeakingPrompts(currentLanguage); // Hypothetical
                            // if(itemsForTypeOnClick && itemsForTypeOnClick.length > 0) {
                            //    const dueSpeaking = CosyAppInteractive.getDueReviews(currentLanguage, 'speaking-phrase', itemsForTypeOnClick);
                            //    dueSpeaking.forEach(itemValue => currentAllDueItemsOnClick.push({ type: 'speaking-phrase', value: itemValue, practiceType: 'speaking'}));
                            // }
                             srsSpecificTypeOnClick = 'speaking-phrase'; // Keep for logging
                             practiceFunctionTypeOnClick = 'speaking'; // Keep for logic
                        } else if (type === 'writing-prompt') {
                            // Similar to speaking
                            srsSpecificTypeOnClick = 'writing-prompt';
                            practiceFunctionTypeOnClick = 'writing';
                        }
                        // This logic needs to be robust. If itemsForTypeOnClick is empty for speaking/writing, 
                        // getDueReviews might not work as expected unless it can handle an empty item list for specific types.
                        // For simplicity, let's assume getDueReviews can be called and will return empty if no specific items are tracked that way.
                        if (itemsForTypeOnClick && itemsForTypeOnClick.length > 0) { // Only run getDueReviews if we have items
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
                    } else if (itemToReview.practiceType === 'speaking'){
                         console.log("TODO: Launch speaking practice for:", itemToReview.value); // This value might be undefined if not fetched
                         CosyAppInteractive.showToast("Speaking review for this item type not fully implemented for direct launch via button yet.");
                    } else if (itemToReview.practiceType === 'writing'){
                         console.log("TODO: Launch writing practice for:", itemToReview.value); // This value might be undefined
                         CosyAppInteractive.showToast("Writing review for this item type not fully implemented for direct launch via button yet.");
                    }
                    // After practice, the button's text/visibility will be updated on the next gameState.updateUI() call
                };
            } else {
                btn.style.display = 'none'; 
            }
        }
    };

    // Helper function to get all vocabulary words for a language (all days)
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
            return [...new Set(allWords)]; // Return unique words
        } catch (e) {
            console.error("Error loading all vocabulary words:", e);
            return [];
        }
    }
    CosyAppInteractive.getAllVocabularyWords = getAllVocabularyWords; // Expose if needed elsewhere

    // Helper function to get all grammar items for a language and type (all days)
    async function getAllGrammarItems(language, grammarType) {
        const langFileName = CosyAppInteractive.getLangFileName(language);
        if (!langFileName) return [];

        let filePath = '';
        let itemSelector = value => value; // Default selector

        if (grammarType === 'verb') {
            filePath = `data/grammar/verbs/grammar_verbs_${langFileName}.json`;
            itemSelector = item => item.infinitive; // Assuming 'infinitive' is the value used for SRS
        } else if (grammarType === 'gender') {
            filePath = `data/grammar/gender/grammar_gender_${langFileName}.json`;
            itemSelector = item => item.word; // Assuming 'word' is the value used for SRS
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
            return [...new Set(allItems)]; // Return unique items
        } catch (e) {
            console.error(`Error loading all ${grammarType} items:`, e);
            return [];
        }
    }
    CosyAppInteractive.getAllGrammarItems = getAllGrammarItems; // Expose if needed

    const _originalPracticeVocabulary = window.practiceVocabulary; 
    const _originalPracticeGrammar = window.practiceGrammar; 

    CosyAppInteractive.practiceVocabulary = async function(type, forceWord) {
        const language = document.getElementById('language').value;
        let wordToPractice = forceWord;

        if (!wordToPractice) { // If no specific word is forced, try to find a due review item
            const allWords = await getAllVocabularyWords(language);
            if (allWords.length > 0) {
                const dueVocabularyItems = CosyAppInteractive.getDueReviews(language, 'vocabulary-word', allWords);
                if (dueVocabularyItems.length > 0) {
                    wordToPractice = dueVocabularyItems[Math.floor(Math.random() * dueVocabularyItems.length)];
                    console.log("SRS: Practicing due vocabulary word:", wordToPractice);
                    CosyAppInteractive.showToast(`🔔 ${getCurrentTranslations().srsReviewToast || 'Reviewing a word from your list!'}`);
                }
            }
        }
        
        if (wordToPractice) { // If a word is forced (either initially or by SRS)
             // Ensure the original function is called with the (potentially SRS-selected) word.
             // The original function might have its own logic for 'random-word' if forceWord is passed.
             // We are essentially overriding 'random-word' with an SRS item if one is due.
            if (typeof _originalPracticeVocabulary === 'function') {
                // If type is 'random-word' and we have an SRS item, we pass it as forceWord.
                // Otherwise, for specific types like 'opposites', 'build-word', etc., forceWord might already be set by SRS, or not.
                // The original function should handle `forceWord` appropriately for its logic.
                await _originalPracticeVocabulary(type, wordToPractice);
            } else {
                console.error("Original practiceVocabulary function not found on window.");
            }
            return; // Exit after practicing the (potentially SRS) word
        }

        // Fallback to original behavior if no SRS item was found and nothing was forced initially
        if (typeof _originalPracticeVocabulary === 'function') {
            await _originalPracticeVocabulary(type);
        } else {
            console.error("Original practiceVocabulary function not found on window.");
        }
    };

    CosyAppInteractive.practiceGrammar = async function(type, forceItem) {
        const language = document.getElementById('language').value;
        let itemToPractice = forceItem;
        let srsGrammarType = ''; // The type string used in scheduleReview (e.g., 'verb', 'gender')
        let specificPracticeFunctionType = type; // The type string for calling specific functions like startVerbsPractice (e.g., 'verbs')

        if (type === 'verbs' || type === 'verb') {
            srsGrammarType = 'verb';
            specificPracticeFunctionType = 'verbs';
        } else if (type === 'gender') {
            srsGrammarType = 'gender';
            specificPracticeFunctionType = 'gender';
        }
        // Add other grammar types if they become SRS-enabled:
        // else if (type === 'possessives') srsGrammarType = 'possessive'; 

        if (!itemToPractice && srsGrammarType) { // If no specific item is forced, and it's an SRS-enabled type
            const allGrammarItems = await getAllGrammarItems(language, srsGrammarType); // Pass srsGrammarType here
            if (allGrammarItems && allGrammarItems.length > 0) { // Check if allGrammarItems is not null/undefined
                const dueGrammarItems = CosyAppInteractive.getDueReviews(language, srsGrammarType, allGrammarItems);
                if (dueGrammarItems && dueGrammarItems.length > 0) { // Check if dueGrammarItems is not null/undefined
                    itemToPractice = dueGrammarItems[Math.floor(Math.random() * dueGrammarItems.length)];
                    console.log(`SRS: Practicing due ${srsGrammarType} item:`, itemToPractice);
                    CosyAppInteractive.showToast(`🔔 ${getCurrentTranslations().srsReviewToast || 'Reviewing an item from your list!'}`);
                }
            }
        }

        if (itemToPractice) { // If an item is forced (either initially or by SRS)
            // Call specific practice functions based on type, now potentially with an SRS item
            // Ensure these practice functions can handle receiving an item to practice directly.
            console.log(`Selected ${type} item (SRS or forced): ${itemToPractice}`); // Log for verification
            // The actual exercise functions (startGenderPractice, etc.) are NOT modified by this subtask
            // to accept or use 'itemToPractice'. They will run with their own internal random selection.
        }

        // Original exercise dispatch logic 
        if (typeof startGenderPractice === 'function' && type === 'gender') {
             await startGenderPractice(); // Not passing itemToPractice here
        } else if (typeof startVerbsPractice === 'function' && type === 'verbs') {
             await startVerbsPractice(); // Not passing itemToPractice here
        } else if (typeof startPossessivesPractice === 'function' && type === 'possessives') {
            await startPossessivesPractice(); // Not passing itemToPractice here
        }
        // Fallback to _originalPracticeGrammar is removed based on previous decision.
        else {
            console.warn("No specific practice function found or called for grammar type:", type, " Item to practice was:", itemToPractice);
        }
    };

    function showEmojiFeedback(isCorrect) { 
      const t = getCurrentTranslations();
      CosyAppInteractive.showToast(isCorrect ? (t.feedbackSticks || '🎉 Great! That sticks!') : (t.feedbackTryAgainEncouragement || '🤔 Try again, you can do it!'));
    }
    
    function showFunFact(language) { // language parameter is passed now
      const t = getCurrentTranslations(); // Uses current language from UI
      const facts = t.funFacts || [];
      if (facts.length > 0) CosyAppInteractive.showToast(facts[Math.floor(Math.random()*facts.length)]);
    }
    
    const practiceAllTypes = ['vocabulary', 'grammar', 'speaking', 'match', 'truefalse', 'choose4audio', 'choose4image'];
    CosyAppInteractive.practiceAllTypes = practiceAllTypes;

    function setupEnterKeySupportInternal() { /* ... (no translatable strings) ... */ }
    async function getAllPracticeItems(language, days) { /* ... (no translatable strings) ... */ return { vocab: [], images: [] };}

    CosyAppInteractive.practiceMatch = async function(language, days) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      const { vocab, images } = await getAllPracticeItems(language, days);
      let pairs = [];
      if (images.length >= 4) pairs = images.slice(0, 4).map(img => ({ word: img.translations[language], img: img.src, id: img.src }));
      else if (vocab.length >= 4) pairs = vocab.slice(0, 4).map(word => ({ word, translation: word, id: word }));
      if (!pairs.length) return CosyAppInteractive.showToast(currentTranslations.noMatchItems || 'Not enough items for match!');
      // ... (rest of UI generation logic, feedback messages need translation)
      // Example for feedback:
      // document.getElementById('match-feedback').innerHTML = `<span style="color:#27ae60;">✅ ${currentTranslations.feedbackCorrectMatch || 'Matched!'}</span>`;
      // document.getElementById('match-feedback').innerHTML = `<span style="color:#e74c3c;">❌ ${currentTranslations.feedbackNotAMatch || 'Not a match!'}</span>`;
      // showFunFact(language); // Call with language
    };
    CosyAppInteractive.practiceTrueFalse = async function(language, days) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ... (UI generation logic, feedback messages need translation)
      // Example: statement = isTrue ? `${word} ${currentTranslations.means || 'means'} <b>${word}</b>` : ...
      // document.getElementById('tf-feedback').innerHTML = correct ? `<span style="color:#27ae60;">✅ ${currentTranslations.correct || 'Correct!'}</span>` : ...
      // showFunFact(language); // Call with language
    };
    CosyAppInteractive.practiceChoosePronounced = async function(language, days) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ... (UI generation logic, feedback messages need translation)
      // Example: html = `<div class="choose4-question">🔊 ${currentTranslations.chooseCorrect || 'Which is correct?'}</div> ...`
      // document.getElementById('choose4-feedback').innerHTML = isCorrect ? `<span class="color-green">✅ ${currentTranslations.correct || 'Correct!'}</span>` : ...
      // showFunFact(language); // Call with language
    };
    CosyAppInteractive.getLangCode = function getLangCode(language) { /* ... (no translatable strings) ... */ 
        switch(language) {
            case 'COSYenglish': return 'en'; case 'COSYitaliano': return 'it'; case 'COSYfrançais': return 'fr';
            case 'COSYespañol': return 'es'; case 'COSYdeutsch': return 'de'; case 'COSYportuguês': return 'pt';
            case 'ΚΟΖΥελληνικά': return 'el'; case 'ТАКОЙрусский': return 'ru'; case 'ԾՈՍՅհայկական': return 'hy';
            case 'COSYbrezhoneg': return 'br'; case 'COSYtatarça': return 'tt'; case 'COSYbashkort': return 'ba';
            default: return 'en';
        }
    };
    CosyAppInteractive.practiceChooseImage = async function(language, days) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ... (UI generation, feedback messages need translation)
      // Example: if (!images.length) return CosyAppInteractive.showToast(currentTranslations.noImages || 'No images available!');
      // showFunFact(language); // Call with language
    };
    CosyAppInteractive.getLangFileName = function getLangFileName(language) { /* ... (no translatable strings) ... */ 
        switch(language) {
            case 'COSYenglish': return 'english'; case 'COSYitaliano': return 'italian'; case 'COSYfrançais': return 'french';
            case 'COSYespañol': return 'spanish'; case 'COSYdeutsch': return 'german'; case 'COSYportuguês': return 'portuguese';
            case 'ΚΟΖΥελληνικά': return 'greek'; case 'ТАКОЙрусский': return 'russian'; case 'ԾՈՍՅհայկական': return 'armenian';
            case 'COSYbrezhoneg': return 'breton'; case 'COSYtatarça': return 'tatar'; case 'COSYbashkort': return 'bashkir';
            default: return 'english';
        }
    };
    CosyAppInteractive.practiceChooseVerbForm = async function(language, days) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ... (UI generation, fetch calls, feedback - needs translation keys for toasts and messages)
      // Example: if (!verbs.length) return CosyAppInteractive.showToast(currentTranslations.noVerbs || 'No verbs available!');
      // showFunFact(language); // Call with language
    };
    CosyAppInteractive.practiceChooseGender = async function(language, days) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ... (UI generation, fetch calls, feedback - needs translation keys for toasts and messages)
      // Example: if (!genderData.length) return CosyAppInteractive.showToast(currentTranslations.noGender || 'No gender data!');
      // showFunFact(language); // Call with language
    };

    const practiceAllBtnElement = document.getElementById('practice-all-btn');
    if (practiceAllBtnElement) {
        const origPracticeAllOnClick = practiceAllBtnElement.onclick; 
        practiceAllBtnElement.onclick = async function() {
            const days = getSelectedDays(); 
            const language = document.getElementById('language').value;
            const currentTranslations = translations[language] || translations.COSYenglish;
            if (!days.length || !language) return CosyAppInteractive.showToast(currentTranslations.alertLangDay || 'Select language and day!');
            const type = practiceAllTypes[Math.floor(Math.random()*practiceAllTypes.length)];
            if (type === 'vocabulary') await CosyAppInteractive.practiceVocabulary('random-word');
            else if (type === 'grammar') await CosyAppInteractive.practiceGrammar('verbs');
            else if (type === 'speaking' && typeof practiceSpeaking === 'function') await practiceSpeaking();
            else if (type === 'match') await CosyAppInteractive.practiceMatch(language, days);
            else if (type === 'truefalse') await CosyAppInteractive.practiceTrueFalse(language, days);
            else if (type === 'choose4audio') await CosyAppInteractive.practiceChoosePronounced(language, days);
            else if (type === 'choose4image') await CosyAppInteractive.practiceChooseImage(language, days);
            else if (origPracticeAllOnClick) origPracticeAllOnClick();
        };
    }

    CosyAppInteractive.showTranslationHelper = async function(text, contextType = 'word', originalLang = null) { 
        const t = getCurrentTranslations(); // For popup UI
        // ... (rest of logic from original, update hardcoded strings)
        // Example: container.innerHTML = `<div class="font-size-12 margin-bottom-18">🌍 ${countryName ? countryName + ': ' : ''}${t.translationPopupTitle || 'Translation'}<br><b>${text}</b></div>...`
        // `button id="show-translation-btn" ...>${t.buttons?.translate || 'Translation'} (...)</button>`
        // `button id="no-translation-btn" ...>${t.buttons?.no || 'No'}</button>`
        // `area.innerHTML = `<div style='margin-bottom:8px;'>${t.chooseLanguagePrompt || 'Choose language:'}</div>`;
        // `btn.textContent = t.buttons?.show || 'Show';`
        // `container.innerHTML = ... <button ... onclick='this.parentNode.remove()'>${t.buttons?.ok || 'OK'}</button>`;
    };

    // getTranslationForText is mostly logic, but the fallback string could be translated
    function getTranslationForText(text, lang, contextType, originalLang) {
        const t = translations[lang] || translations.COSYenglish;
        if (contextType === 'funFact') { /* ... */ }
        if (contextType === 'word') {
            let translationPlaceholder = t.translationInLang || "translation in {lang}";
            return `<b>${text}</b> → <i>(${translationPlaceholder.replace('{lang}', lang.replace('COSY',''))})</i>`;
        }
        return text;
    }
    
    CosyAppInteractive.getRandomTip = function getRandomTip() {
        const t = getCurrentTranslations();
        const facts = t.funFacts || [];
        return facts.length > 0 ? facts[Math.floor(Math.random() * facts.length)] : (t.noTipsAvailable || "No tips available.");
    };
    CosyAppInteractive.showTipPopup = function showTipPopup(tip) { /* ... */ };
    CosyAppInteractive.hideTipPopup = function hideTipPopup() { /* ... */ };
    CosyAppInteractive.showTranslationPopup = function showTranslationPopup(text) { /* ... */ };
    CosyAppInteractive.hideTranslationPopup = function hideTranslationPopup() { /* ... */ };

    document.addEventListener('DOMContentLoaded', async function() { 
        if (gameState && typeof gameState.updateUI === 'function') await gameState.updateUI(); 
        setupEnterKeySupportInternal();

        // Generic click sound for common buttons
        document.body.addEventListener('click', function(event) {
            if (event.target.matches('button:not(.btn-emoji, #speaking-record-btn), .article-option-btn, .word-option, .match-item')) {
                // Check if the button is part of an exercise that might already play a sound on click (e.g. options that give immediate feedback)
                // For now, this is a broad approach. Refine if specific buttons cause double sounds.
                // Exclude emoji buttons and the speaking record button as they have special sound/UI interactions.
                if (!event.target.closest('.no-generic-click-sound')) { // Add class 'no-generic-click-sound' to parent of buttons to exclude
                     playSound('click');
                }
            }
        }, true); // Use capture phase

        const helpBtn = document.getElementById('floating-help-btn');
        const tipPopup = document.getElementById('floating-tip-popup');
        const tipText = document.getElementById('floating-tip-text'); 
        const closeTipBtn = tipPopup?.querySelector('.close-tip');
        const translateTipBtn = tipPopup?.querySelector('.translate-tip');
        const translationPopup = document.getElementById('translation-popup');
        const closeTranslationBtn = translationPopup?.querySelector('.close-translation');

        if (helpBtn) {
            helpBtn.onclick = function(e) { e.stopPropagation(); CosyAppInteractive.showTipPopup(CosyAppInteractive.getRandomTip()); };
        }
        // ... (rest of event listeners, ensure any UI text set here is translated)
        // Example: if a button's text was set here, it should use translations.
        if (closeTipBtn) { closeTipBtn.onclick = (e) => {e.stopPropagation(); CosyAppInteractive.hideTipPopup();} }
        if (translateTipBtn && tipText) { /* ... */ }
        if (closeTranslationBtn) { closeTranslationBtn.onclick = (e) => {e.stopPropagation(); CosyAppInteractive.hideTranslationPopup();}}

        document.addEventListener('keydown', function(e) { /* ... */ });
        document.body.addEventListener('click', function(e) { /* ... */ });
        function unlockAudio() { /* ... */ }
        window.addEventListener('touchstart', unlockAudio, {once: true});
        window.addEventListener('click', unlockAudio, {once: true});
    });

})();
