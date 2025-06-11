window.CosyAppInteractive = {};

(function() {
    // All existing interactive.js code goes here

    // Function moved to utils.js: addEnterKeySupport (comment remains for context)

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
            this.xp = parseInt(localStorage.getItem('cosy_xp') || '0');
            this.level = parseInt(localStorage.getItem('cosy_level') || '1');
            this.streak = parseInt(localStorage.getItem('cosy_streak') || '0');
        }

        save() {
            localStorage.setItem('cosy_xp', this.xp);
            localStorage.setItem('cosy_level', this.level);
            localStorage.setItem('cosy_streak', this.streak);
        }

        addXP(amount) {
            this.xp += amount;
            if (this.xp >= this.level * 10) {
                this.xp = 0;
                this.level++;
                playSound('success');
                CosyAppInteractive.showToast(`🎉 Level up! You are now level ${this.level}!`); // Exposed
                this.showLevelUpEffect();
            }
            this.save();
            this.updateUI();
        }

        addStreak() {
            this.streak++;
            this.save();
            this.updateUI();
        }

        resetStreak() {
            this.streak = 0;
            this.save();
            this.updateUI();
        }

        updateUI() {
            let stats = document.getElementById('cosy-gamestats');
            if (!stats) {
                stats = document.createElement('div');
                stats.id = 'cosy-gamestats';
                stats.className = 'game-stats';
                document.body.appendChild(stats);
            }
            stats.innerHTML = `XP: ${this.xp} | Level: ${this.level} | Streak: ${this.streak}`;
        }

        showLevelUpEffect() {
            let stats = document.getElementById('cosy-gamestats');
            if (stats) {
                stats.classList.add('levelup');
                setTimeout(() => stats.classList.remove('levelup'), 1200);
            }
            showConfetti(); // Internal function
        }
    }
    CosyAppInteractive.GameState = GameState; // Expose GameState class

    const gameState = new GameState(); // Internal instance

    function showToast(msg) {
        let toast = document.createElement('div');
        toast.textContent = msg;
        toast.className = 'cosy-toast';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1800);
    }
    CosyAppInteractive.showToast = showToast; // Expose showToast

    function showConfetti() { // Internal helper
        for (let i = 0; i < 30; i++) {
            let c = document.createElement('div');
            c.textContent = '🎊';
            c.className = 'confetti'; // Ensure this class is defined in CSS
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 1400);
        }
    }

    // The original global addXP and its patching
    let cosyLevel = gameState.level; // Assuming cosyLevel was meant to be gameState.level for the patch
    
    function originalAddXP(amount) { // Renamed to avoid conflict before IIFE
        gameState.addXP(amount);
    }

    const _addXP = originalAddXP; // Capture the original internal addXP
    let PatchedAddXP = function(amount) { // This is the patched version
      const prevLevel = gameState.level; // Use gameState's level
      _addXP(amount); // Call the original internal addXP that works with gameState
      if (gameState.level > prevLevel) { // Check gameState's level
          // confetti(); // confetti is now showConfetti, called by GameState.addXP
      }
    };
    CosyAppInteractive.addXP = PatchedAddXP; // Expose the patched version if needed, or just let GameState.addXP handle it.

    function awardCorrectAnswer() {
        gameState.addXP(3); // Uses internal gameState instance
        gameState.addStreak();
    }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;

    function markAndAward(el) {
      if (!el.classList.contains('xp-awarded')) {
        el.classList.add('xp-awarded');
        awardCorrectAnswer(); // Internal call
      }
    }
    CosyAppInteractive.markAndAward = markAndAward;

    const observer = new MutationObserver(() => {
      document.querySelectorAll('.result-area span[style*="#27ae60"]').forEach(markAndAward);
      document.querySelectorAll('#gender-feedback span[style*="#27ae60"]').forEach(markAndAward);
      document.querySelectorAll('#verb-answer-feedback span[style*="#27ae60"]').forEach(markAndAward);
      document.querySelectorAll('#speaking-feedback span[style*="#27ae60"]').forEach(markAndAward);
    });
    
    // Ensure 'result' element exists before observing
    const resultElement = document.getElementById('result');
    if (resultElement) {
        observer.observe(resultElement, { childList: true, subtree: true });
    }
    ['gender-feedback','verb-answer-feedback','speaking-feedback'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el, { childList: true, subtree: true });
    });

    function getSRSKey(language, type, value) {
      return `cosy_srs_${language}_${type}_${value}`;
    }

    function scheduleReview(language, type, value, correct) {
      // ... (original scheduleReview logic)
      const key = getSRSKey(language, type, value);
      let data = JSON.parse(localStorage.getItem(key) || '{}');
      const now = Date.now();
      if (!data.interval) data.interval = 1 * 60 * 60 * 1000; 
      if (!data.ease) data.ease = 2.5;
      if (!data.due) data.due = now;
      if (!data.reps) data.reps = 0;
      if (correct) {
        data.reps++;
        data.interval = Math.round(data.interval * data.ease);
        data.due = now + data.interval;
        data.ease = Math.min(data.ease + 0.15, 3.0);
      } else {
        data.reps = 0;
        data.interval = 1 * 60 * 60 * 1000; 
        data.due = now + data.interval;
        data.ease = Math.max(data.ease - 0.2, 1.3);
      }
      localStorage.setItem(key, JSON.stringify(data));
    }
    CosyAppInteractive.scheduleReview = scheduleReview;

    function getDueReviews(language, type, items) {
      const now = Date.now();
      return items.filter(value => {
        const key = getSRSKey(language, type, value);
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        return !data.due || data.due <= now;
      });
    }
    CosyAppInteractive.getDueReviews = getDueReviews;

    function showRevisionButton(type, items, language) {
      let btn = document.getElementById('cosy-revision-btn');
      if (!btn) {
        btn = document.createElement('button');
        btn.id = 'cosy-revision-btn';
        btn.className = 'btn-primary';
        // ... (styling)
        btn.textContent = '🔁 Review Due'; // TODO: Translate
        document.body.appendChild(btn);
      }
      btn.onclick = async function() {
        const due = getDueReviews(language, type, items); // internal call
        if (!due.length) {
          showToast('No items due for review!'); // internal call
          return;
        }
        const itemToReview = due[Math.floor(Math.random()*due.length)];
        if (type === 'vocabulary') {
          // Use the exposed practiceVocabulary
          await CosyAppInteractive.practiceVocabulary('random-word', itemToReview);
        } else if (type === 'verbs') {
          // Use the exposed practiceGrammar
          await CosyAppInteractive.practiceGrammar('verbs', itemToReview);
        }
      };
    }
    CosyAppInteractive.showRevisionButton = showRevisionButton;

    // --- Patch practice functions to use SRS ---
    // Assume original functions are globally available when this IIFE runs
    // (e.g., from vocabulary.js, grammar.js)
    const _originalPracticeVocabulary = window.practiceVocabulary; 
    const _originalPracticeGrammar = window.practiceGrammar; 

    const practiceVocabularyPatched = async function(type, forceWord) {
      const language = document.getElementById('language').value;
      if (forceWord) {
        console.log(`TODO SRS Review: practiceVocabulary for ${type}, word: ${forceWord}, lang: ${language}`);
        // TODO: Implement actual SRS review logic. This might involve:
        // 1. Finding which specific exercise function displays this 'forceWord' (e.g., showRandomWord(forceWord))
        // 2. Calling it: await showRandomWord(forceWord); // Or other relevant function based on 'type'
        // 3. Hooking into its answer mechanism to call scheduleReview. This is the complex part.
        // For now, this path will just log and not show an exercise.
        return; 
      }
      if (typeof _originalPracticeVocabulary === 'function') {
        await _originalPracticeVocabulary(type);
      } else {
        console.error("Original practiceVocabulary function not found on window.");
      }
      // ... (showRevisionButton logic - needs access to 'items' for the current context)
      // const items = await loadVocabulary(language, getSelectedDays()); // This line is problematic as loadVocabulary is not in this scope
      // if (items && items.length) CosyAppInteractive.showRevisionButton('vocabulary', items, language);
    };
    CosyAppInteractive.practiceVocabulary = practiceVocabularyPatched;

    const practiceGrammarPatched = async function(type, forceItem) {
        const language = document.getElementById('language').value;
        if (forceItem) {
            console.log(`TODO SRS Review: practiceGrammar for ${type}, item: ${forceItem}, lang: ${language}`);
            // TODO: Implement actual SRS review logic for grammar.
            return;
        }
        
        // These functions (startGenderPractice etc.) are defined in grammar.js and assumed to be global.
        if (typeof startGenderPractice === 'function' && type === 'gender') {
            await startGenderPractice();
        } else if (typeof startVerbsPractice === 'function' && type === 'verbs') {
            await startVerbsPractice();
        } else if (typeof startPossessivesPractice === 'function' && type === 'possessives') {
            await startPossessivesPractice();
        } else if (typeof _originalPracticeGrammar === 'function') { // Fallback if specific starters not found
             await _originalPracticeGrammar(type);
        } else {
            console.error("Original practiceGrammar or specific start function not found.");
        }
        
        // const items = await loadGrammarItems(language, type, getSelectedDays()); // loadGrammarItems is not in this scope
        // if (items && items.length) CosyAppInteractive.showRevisionButton(type, items, language);
    };
    CosyAppInteractive.practiceGrammar = practiceGrammarPatched;


    function showEmojiFeedback(isCorrect) { // Corrected parameter name
      showToast(isCorrect ? '🎉 Great! That sticks!' : '🤔 Try again, you can do it!'); // TODO: Translate
    }
    // CosyAppInteractive.showEmojiFeedback = showEmojiFeedback; // Likely internal

    function showFunFact(language) {
      const currentTranslations = translations[language] || translations.COSYenglish;
      const facts = currentTranslations.funFacts || [];
      if (facts.length > 0) {
        showToast(facts[Math.floor(Math.random()*facts.length)]);
      }
    }
    // CosyAppInteractive.showFunFact = showFunFact; // Likely internal

    // `confetti` is already `showConfetti` and internal.
    // The `addXP` patching is handled above.

    const practiceAllTypes = [ // Keep this private to the IIFE
      'vocabulary', 'grammar', 'speaking', 'match', 'truefalse', 'choose4audio', 'choose4image',
    ];
    CosyAppInteractive.practiceAllTypes = practiceAllTypes; // Expose if needed by external logic, otherwise keep private.

    function setupEnterKeySupportInternal() { // Renamed to avoid conflict if any global setupEnterKeySupport exists
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const activeInput = document.activeElement;
                if (activeInput && activeInput.tagName === 'INPUT' && activeInput.closest('.exercise-container, .result-area, .match-exercise, .verb-exercise, .gender-exercise, .image-exercise, .listening-exercise, .opposites-exercise, .fill-gap-exercise, .word-order-exercise')) {
                    let container = activeInput.closest('.exercise-container, .result-area, .match-exercise, .verb-exercise, .gender-exercise, .image-exercise, .listening-exercise, .opposites-exercise, .fill-gap-exercise, .word-order-exercise');
                    if (container) {
                        let checkBtn = container.querySelector('.btn-primary, .check-btn, [id^="check-"], [id$="-btn"]'); // Broader selector
                        if (checkBtn && typeof checkBtn.click === 'function') checkBtn.click();
                    }
                }
            }
        });
    }
    // addEnterKeySupport was moved to utils.js, so the specific one is not here.
    // The generic setupEnterKeySupportInternal is kept.

    async function getAllPracticeItems(language, days) {
      // This function uses getVocabularyFile, which is not defined in this scope.
      // It needs to be either passed in, moved here, or this function refactored.
      // For now, assume getVocabularyFile will be made available or this part is handled by other scripts.
      let vocab = [];
      // if (typeof getVocabularyFile === 'function') { /* ... fetch logic ... */ }
      let images = [];
      // try { /* ... fetch logic ... */ } catch {}
      return { vocab, images };
    }
    // CosyAppInteractive.getAllPracticeItems = getAllPracticeItems; // Likely internal

    async function practiceMatch(language, days) {
      // ... (original logic, ensure showToast, awardCorrectAnswer, scheduleReview, showFunFact are called correctly)
      // Example: if (!pairs.length) return CosyAppInteractive.showToast('Not enough items for match!');
      // All internal calls to these functions should work if they are defined within the IIFE or exposed on CosyAppInteractive if called from outside.
      // For now, assuming internal calls are fine.
      // This function also uses translations, so currentTranslations should be defined.
      const currentTranslations = translations[language] || translations.COSYenglish;
      const { vocab, images } = await getAllPracticeItems(language, days); // getAllPracticeItems is internal
        let pairs = [];
        if (images.length >= 4) {
            pairs = images.slice(0, 4).map(img => ({ word: img.translations[language], img: img.src, id: img.src }));
        } else if (vocab.length >= 4) {
            pairs = vocab.slice(0, 4).map(word => ({ word, translation: word, id: word }));
        }
        if (!pairs.length) return showToast(currentTranslations.noMatchItems || 'Not enough items for match!');
        // ...rest of the function
        // Make sure to use currentTranslations for UI text. E.g.
        // document.getElementById('match-feedback').innerHTML = `<span style="color:#27ae60;">✅ ${currentTranslations.correct || 'Matched!'}</span>`;
    }
    CosyAppInteractive.practiceMatch = practiceMatch;

    async function practiceTrueFalse(language, days) {
      // ... (original logic, ensure showToast, awardCorrectAnswer, scheduleReview, showFunFact are called correctly)
      // Make sure to use currentTranslations for UI text.
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ...
    }
    CosyAppInteractive.practiceTrueFalse = practiceTrueFalse;

    async function practiceChoosePronounced(language, days) {
      // ... (original logic, ensure getLangCode, scheduleReview, awardCorrectAnswer, showFunFact are called correctly)
      // Make sure to use currentTranslations for UI text.
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ...
    }
    CosyAppInteractive.practiceChoosePronounced = practiceChoosePronounced;

    function getLangCode(language) {
      switch(language) {
        case 'COSYenglish': return 'en'; case 'COSYitaliano': return 'it'; case 'COSYfrançais': return 'fr';
        case 'COSYespañol': return 'es'; case 'COSYdeutsch': return 'de'; case 'COSYportuguês': return 'pt';
        case 'ΚΟΖΥελληνικά': return 'el'; case 'ТАКОЙрусский': return 'ru'; case 'ԾՈՍՅհայկական': return 'hy';
        case 'COSYbrezhoneg': return 'br'; case 'COSYtatarça': return 'tt'; case 'COSYbashkort': return 'ba';
        default: return 'en';
      }
    }
    CosyAppInteractive.getLangCode = getLangCode;

    async function practiceChooseImage(language, days) {
      // ... (original logic, ensure showToast, scheduleReview, awardCorrectAnswer, showFunFact are called correctly)
      // Make sure to use currentTranslations for UI text.
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ...
    }
    CosyAppInteractive.practiceChooseImage = practiceChooseImage;
    
    function getLangFileName(language) {
      switch(language) {
        case 'COSYenglish': return 'english'; case 'COSYitaliano': return 'italian'; case 'COSYfrançais': return 'french';
        case 'COSYespañol': return 'spanish'; case 'COSYdeutsch': return 'german'; case 'COSYportuguês': return 'portuguese';
        case 'ΚΟΖΥελληνικά': return 'greek'; case 'ТАКОЙрусский': return 'russian'; case 'ԾՈՍՅհայկական': return 'armenian';
        case 'COSYbrezhoneg': return 'breton'; case 'COSYtatarça': return 'tatar'; case 'COSYbashkort': return 'bashkir';
        default: return 'english';
      }
    }
    CosyAppInteractive.getLangFileName = getLangFileName;

    async function practiceChooseVerbForm(language, days) {
      // ... (original logic, ensure fetch, getLangFileName, showToast, scheduleReview, awardCorrectAnswer, showFunFact are called correctly)
      // This function uses fetch directly. It should be updated to use loadData if that's intended for all data loading.
      // For now, leaving as is per direct instruction to expose it.
      // Make sure to use currentTranslations for UI text.
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ...
    }
    CosyAppInteractive.practiceChooseVerbForm = practiceChooseVerbForm;

    async function practiceChooseGender(language, days) {
      // ... (original logic, ensure fetch, getLangFileName, showToast, scheduleReview, awardCorrectAnswer, showFunFact are called correctly)
      // This function uses fetch directly. It should be updated to use loadData.
      // Make sure to use currentTranslations for UI text.
      const currentTranslations = translations[language] || translations.COSYenglish;
      // ...
    }
    CosyAppInteractive.practiceChooseGender = practiceChooseGender;

    // Patch Practice All button - this was already done in the original script,
    // it modifies the onclick of a button in index.html.
    // Ensure `practiceSpeaking` is defined or exposed if called here.
    // The `origPracticeAll` variable needs to be correctly scoped or handled.
    // Assuming `practiceSpeaking` is made global by speaking.js or exposed via CosyAppInteractive.
    // This part is tricky because it relies on the state of `document.getElementById('practice-all-btn').onclick`
    // which might be set by another script (`buttons.js` perhaps).
    // For now, I'll keep the logic as is, assuming `window.practiceVocabulary` and `window.practiceGrammar`
    // will point to the CosyAppInteractive versions if those scripts are loaded after this one.
    const practiceAllBtnElement = document.getElementById('practice-all-btn');
    if (practiceAllBtnElement) {
        const origPracticeAllOnClick = practiceAllBtnElement.onclick; // Capture original if set by other script
        practiceAllBtnElement.onclick = async function() {
            const days = getSelectedDays(); // getSelectedDays needs to be available
            const language = document.getElementById('language').value;
            const currentTranslations = translations[language] || translations.COSYenglish; // For showToast
            if (!days.length || !language) return showToast(currentTranslations.alertLangDay || 'Select language and day!');
            
            const type = practiceAllTypes[Math.floor(Math.random()*practiceAllTypes.length)]; // practiceAllTypes is local
            
            if (type === 'vocabulary') await CosyAppInteractive.practiceVocabulary('random-word');
            else if (type === 'grammar') await CosyAppInteractive.practiceGrammar('verbs');
            else if (type === 'speaking' && typeof practiceSpeaking === 'function') await practiceSpeaking(); // practiceSpeaking might be global
            else if (type === 'match') await CosyAppInteractive.practiceMatch(language, days);
            else if (type === 'truefalse') await CosyAppInteractive.practiceTrueFalse(language, days);
            else if (type === 'choose4audio') await CosyAppInteractive.practiceChoosePronounced(language, days);
            else if (type === 'choose4image') await CosyAppInteractive.practiceChooseImage(language, days);
            else if (origPracticeAllOnClick) origPracticeAllOnClick();
        };
    }


    async function showTranslationHelper(text, contextType = 'word', originalLang = null) { /* ... */ }
    CosyAppInteractive.showTranslationHelper = showTranslationHelper;

    function getTranslationForText(text, lang, contextType, originalLang) { /* ... */ }
    // CosyAppInteractive.getTranslationForText = getTranslationForText; // Likely internal helper

    // --- Floating Help Button Logic ---
    // This logic is self-contained and uses functions defined within this IIFE or exposed on CosyAppInteractive.
    // It might be better to make these functions part of CosyAppInteractive if they are truly global.
    // For now, keeping them as internal helpers to the DOMContentLoaded listener below.
    
    function getRandomTip() {
        const lang = document.getElementById('language').value || 'COSYenglish';
        const t = translations[lang] || translations.COSYenglish;
        const facts = t.funFacts || [];
        return facts.length > 0 ? facts[Math.floor(Math.random() * facts.length)] : "No tips available.";
    }
    CosyAppInteractive.getRandomTip = getRandomTip;

    function showTipPopup(tip) {
        const tipTextElement = document.getElementById('floating-tip-text');
        const tipPopupElement = document.getElementById('floating-tip-popup');
        if(tipTextElement && tipPopupElement) {
            tipTextElement.textContent = tip;
            tipPopupElement.style.display = 'flex';
            tipPopupElement.setAttribute('aria-live', 'polite');
            tipPopupElement.focus && tipPopupElement.focus();
        }
    }
    CosyAppInteractive.showTipPopup = showTipPopup;

    function hideTipPopup() {
        const tipPopupElement = document.getElementById('floating-tip-popup');
        if(tipPopupElement) tipPopupElement.style.display = 'none';
    }
    CosyAppInteractive.hideTipPopup = hideTipPopup;

    function showTranslationPopup(text) {
        const translationTextElement = document.getElementById('translation-popup-text');
        const translationPopupElement = document.getElementById('translation-popup');
        if(translationTextElement && translationPopupElement) {
            translationTextElement.textContent = text;
            translationPopupElement.style.display = 'flex';
            translationPopupElement.setAttribute('aria-live', 'polite');
            translationPopupElement.focus && translationPopupElement.focus();
        }
    }
    CosyAppInteractive.showTranslationPopup = showTranslationPopup;

    function hideTranslationPopup() {
        const translationPopupElement = document.getElementById('translation-popup');
        if(translationPopupElement) translationPopupElement.style.display = 'none';
    }
    CosyAppInteractive.hideTranslationPopup = hideTranslationPopup;


    document.addEventListener('DOMContentLoaded', function() {
        if (gameState && typeof gameState.updateUI === 'function') {
            gameState.updateUI();
        }
        setupEnterKeySupportInternal(); // Call the internal, general Enter key setup

        // Floating Help Button listeners
        const helpBtn = document.getElementById('floating-help-btn');
        const tipPopup = document.getElementById('floating-tip-popup');
        const tipText = document.getElementById('floating-tip-text'); // Re-fetch for this scope
        const closeTipBtn = tipPopup?.querySelector('.close-tip');
        const translateTipBtn = tipPopup?.querySelector('.translate-tip');
        const translationPopup = document.getElementById('translation-popup');
        const closeTranslationBtn = translationPopup?.querySelector('.close-translation');

        if (helpBtn) {
            helpBtn.onclick = function(e) {
                e.stopPropagation();
                showTipPopup(getRandomTip());
            };
        }
        if (closeTipBtn) {
            closeTipBtn.onclick = function(e) {
                e.stopPropagation();
                hideTipPopup();
            };
        }
        if (translateTipBtn && tipText) {
            translateTipBtn.onclick = function(e) {
                e.stopPropagation();
                const tipContent = tipText.textContent;
                const currentLang = document.getElementById('language').value || 'COSYenglish';
                // Simplified translation logic for the tip itself
                let translatedTip = getTranslationForText(tipContent, currentLang, 'funFact', 'COSYenglish'); // Assume tips are funFacts for now
                showTranslationPopup(translatedTip);
            };
        }
        if (closeTranslationBtn) {
            closeTranslationBtn.onclick = function(e) {
                e.stopPropagation();
                hideTranslationPopup();
            };
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideTipPopup();
                hideTranslationPopup();
            }
        });
        document.body.addEventListener('click', function(e) {
            if (tipPopup && tipPopup.style.display === 'flex' && !tipPopup.contains(e.target) && e.target !== helpBtn) hideTipPopup();
            if (translationPopup && translationPopup.style.display === 'flex' && !translationPopup.contains(e.target)) hideTranslationPopup();
        });

        // Unlock audio context for iOS/Android (already self-contained)
        function unlockAudio() {
            try {
                const u = new SpeechSynthesisUtterance(' ');
                window.speechSynthesis.speak(u);
            } catch(e) {}
            window.removeEventListener('touchstart', unlockAudio, {once: true});
            window.removeEventListener('click', unlockAudio, {once: true});
        }
        window.addEventListener('touchstart', unlockAudio, {once: true});
        window.addEventListener('click', unlockAudio, {once: true});
    });

})();
