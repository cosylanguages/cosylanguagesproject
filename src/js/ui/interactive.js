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
            const t = getCurrentTranslations();
            this.xp += amount;
            if (this.xp >= this.level * 10) {
                this.xp = 0;
                this.level++;
                playSound('success');
                let levelUpMsg = t.levelUpToast || `🎉 Level up! You are now level {level}!`;
                CosyAppInteractive.showToast(levelUpMsg.replace('{level}', this.level));
                this.showLevelUpEffect();
            }
            this.save();
            this.updateUI();
        }

        addStreak() { this.streak++; this.save(); this.updateUI(); }
        resetStreak() { this.streak = 0; this.save(); this.updateUI(); }

        updateUI() {
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

    function awardCorrectAnswer() { gameState.addXP(3); gameState.addStreak(); }
    CosyAppInteractive.awardCorrectAnswer = awardCorrectAnswer;

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
    CosyAppInteractive.getDueReviews = function getDueReviews(language, type, items) { /* ... (no translatable strings) ... */ 
        const now = Date.now();
        return items.filter(value => {
            const key = getSRSKey(language, type, value);
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            return !data.due || data.due <= now;
        });
    };

    function showRevisionButton(type, items, language) {
      const t = getCurrentTranslations();
      let btn = document.getElementById('cosy-revision-btn');
      if (!btn) {
        btn = document.createElement('button');
        btn.id = 'cosy-revision-btn';
        btn.className = 'btn-primary btn'; // Added .btn for base styling
        btn.style.position = 'fixed'; btn.style.bottom = '20px'; btn.style.right = '20px'; btn.style.zIndex = '9999';
        document.body.appendChild(btn);
      }
      btn.textContent = t.reviewDueBtnLabel || '🔁 Review Due';
      btn.onclick = async function() {
        const due = CosyAppInteractive.getDueReviews(language, type, items); 
        if (!due.length) {
          CosyAppInteractive.showToast(t.noItemsDueReviewToast || 'No items due for review!'); 
          return;
        }
        const itemToReview = due[Math.floor(Math.random()*due.length)];
        if (type === 'vocabulary') await CosyAppInteractive.practiceVocabulary('random-word', itemToReview);
        else if (type === 'verbs') await CosyAppInteractive.practiceGrammar('verbs', itemToReview);
      };
    }
    CosyAppInteractive.showRevisionButton = showRevisionButton;

    const _originalPracticeVocabulary = window.practiceVocabulary; 
    const _originalPracticeGrammar = window.practiceGrammar; 

    CosyAppInteractive.practiceVocabulary = async function(type, forceWord) { /* ... (TODOs and console logs are fine) ... */ 
        const language = document.getElementById('language').value;
        if (forceWord) {
            console.log(`TODO SRS Review: practiceVocabulary for ${type}, word: ${forceWord}, lang: ${language}`);
            return; 
        }
        if (typeof _originalPracticeVocabulary === 'function') await _originalPracticeVocabulary(type);
        else console.error("Original practiceVocabulary function not found on window.");
    };
    CosyAppInteractive.practiceGrammar = async function(type, forceItem) {  /* ... (TODOs and console logs are fine) ... */ 
        const language = document.getElementById('language').value;
        if (forceItem) {
            console.log(`TODO SRS Review: practiceGrammar for ${type}, item: ${forceItem}, lang: ${language}`);
            return;
        }
        if (typeof startGenderPractice === 'function' && type === 'gender') await startGenderPractice();
        else if (typeof startVerbsPractice === 'function' && type === 'verbs') await startVerbsPractice();
        else if (typeof startPossessivesPractice === 'function' && type === 'possessives') await startPossessivesPractice();
        else if (typeof _originalPracticeGrammar === 'function') await _originalPracticeGrammar(type);
        else console.error("Original practiceGrammar or specific start function not found.");
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

    document.addEventListener('DOMContentLoaded', function() {
        if (gameState && typeof gameState.updateUI === 'function') gameState.updateUI();
        setupEnterKeySupportInternal(); 

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
