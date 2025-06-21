// Function to load possessives grammar data (assuming a similar structure to other grammar data)
async function loadPossessivesGrammar(language, day) {
    // This is a placeholder. Actual implementation will depend on the JSON structure for possessives.
    console.warn(`loadPossessivesGrammar for ${language}, day ${day} - Not fully implemented, returning empty array.`);
    // Example: const filePath = `data/grammar/possessives/possessives_${language}.json`;
    // const data = await loadData(filePath); 
    // return data[day] || [];
    return []; // Placeholder
}


async function startPossessivesPractice() {
    console.log("startPossessivesPractice called.");
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    
    // This is a conceptual placeholder. 
    // Actual possessives exercises (e.g., showPossessiveExercise) would need to be created.
    // For now, we'll show a "coming soon" message.
    // Later, this would be:
    // const possessivesExercises = GRAMMAR_PRACTICE_TYPES['possessives']?.exercises;
    // if (possessivesExercises && possessivesExercises.length > 0) { ... }
    
    resultArea.innerHTML = `<p>${t.possessivesComingSoon || 'Possessives practice exercises are coming soon!'}</p>`;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    // Example of how it might be patched if it were a real exercise display function:
    // const exerciseContainer = resultArea.firstChild; 
    // if (exerciseContainer) {
    //     patchExerciseWithExtraButtons(() => {}, exerciseContainer, startPossessivesPractice, {});
    // }
}

// Data loading functions
async function loadGenderGrammar(language, day) {
    const fileMap = {
        'COSYenglish': 'data/grammar/gender/grammar_gender_english.json',
        'COSYitaliano': 'data/grammar/gender/grammar_gender_italian.json',
        'COSYfrançais': 'data/grammar/gender/grammar_gender_french.json',
        'COSYespañol': 'data/grammar/gender/grammar_gender_spanish.json',
        'COSYdeutsch': 'data/grammar/gender/grammar_gender_german.json',
        'COSYportuguês': 'data/grammar/gender/grammar_gender_portuguese.json',
        'ΚΟΖΥελληνικά': 'data/grammar/gender/grammar_gender_greek.json',
        'ТАКОЙрусский': 'data/grammar/gender/grammar_gender_russian.json',
        'ԾՈՍՅհայկական': 'data/grammar/gender/grammar_gender_armenian.json',
        'COSYbrezhoneg': 'data/grammar/gender/grammar_gender_breton.json',
        'COSYtatarça': 'data/grammar/gender/grammar_gender_tatar.json',
        'COSYbashkort': 'data/grammar/gender/grammar_gender_bashkir.json'
    };
    const file = fileMap[language];
    if (!file) {
        console.error(`Error loading gender grammar: No file mapped for language ${language}`);
        return []; 
    }
    
    const loadResult = await loadData(file); 
    
    if (loadResult.error) {
        console.error(`Error loading gender grammar for ${language} from ${file}: ${loadResult.errorType} - ${loadResult.error}`);
        return []; 
    }
    
    const data = loadResult.data; 
    let dayData = [];
    if (data) {
        if (Array.isArray(day)) { 
            day.forEach(d => {
                if (data[d]) dayData = dayData.concat(data[d]);
            });
        } else if (data[day]) { 
            dayData = data[day];
        }
    }
    return dayData;
}

async function loadVerbGrammar(language, days) { 
    const fileMap = {
        'COSYenglish': 'data/grammar/verbs/grammar_verbs_english.json',
        'COSYitaliano': 'data/grammar/verbs/grammar_verbs_italian.json',
        'COSYfrançais': 'data/grammar/verbs/grammar_verbs_french.json',
        'COSYespañol': 'data/grammar/verbs/grammar_verbs_spanish.json',
        'COSYdeutsch': 'data/grammar/verbs/grammar_verbs_german.json',
        'COSYportuguês': 'data/grammar/verbs/grammar_verbs_portuguese.json',
        'ΚΟΖΥελληνικά': 'data/grammar/verbs/grammar_verbs_greek.json',
        'ТАКОЙрусский': 'data/grammar/verbs/grammar_verbs_russian.json',
        'COSYbrezhoneg': 'data/grammar/verbs/grammar_verbs_breton.json',
        'COSYtatarça': 'data/grammar/verbs/grammar_verbs_tatar.json',
        'COSYbashkort': 'data/grammar/verbs/grammar_verbs_bashkir.json',
        'ԾՈՍՅհայկական': 'data/grammar/verbs/grammar_verbs_armenian.json',
    };
    const file = fileMap[language];
    if (!file) {
        console.error(`Error loading verb grammar: No file mapped for language ${language}`);
        return [];
    }
    const loadResult = await loadData(file); 
    
    if (loadResult.error) {
        console.error(`Error loading verb grammar for ${language} from ${file}: ${loadResult.errorType} - ${loadResult.error}`);
        return [];
    }
    const data = loadResult.data;
    if (!data) {
        console.error(`No data found in ${file} for language ${language}`);
        return [];
    }

    let combinedVerbData = [];
    let seenItems = new Set();

    if (!days || days.length === 0) {
        return [];
    }

    let startDay, endDay;
    const dayNumbers = days.map(d => parseInt(d));

    if (dayNumbers.length === 1) {
        startDay = 1;
        endDay = dayNumbers[0];
    } else {
        startDay = Math.min(...dayNumbers);
        endDay = Math.max(...dayNumbers);
    }

    for (let i = startDay; i <= endDay; i++) {
        const currentDayKey = String(i);
        const dayData = data[currentDayKey] ? data[currentDayKey] : [];
        
        for (const item of dayData) {
            const stringifiedItem = JSON.stringify(item); 
            if (!seenItems.has(stringifiedItem)) {
                seenItems.add(stringifiedItem);
                combinedVerbData.push(item);
            }
        }
    }
    return combinedVerbData;
}


const GRAMMAR_PRACTICE_TYPES = { 
    'gender': {
        exercises: ['showArticleWord', 'showMatchArticlesWords', 'showSelectArticleExercise'],
        name: 'Gender & Articles'
    },
    'verbs': {
        exercises: ['showTypeVerb', 'showMatchVerbsPronouns', 'showFillGaps', 'showWordOrder'],
        name: 'Verbs & Conjugation'
    },
    'possessives': { // Added for completeness, even if exercises are placeholders
        exercises: [/* 'showPossessiveExercise1', 'showPossessiveExercise2' */], // Example, to be defined
        name: 'Possessives'
    }
};

function initGrammarPractice() {
    document.getElementById('gender-btn')?.addEventListener('click', startGenderPractice);
    document.getElementById('verbs-btn')?.addEventListener('click', startVerbsPractice);
    document.getElementById('possessives-btn')?.addEventListener('click', startPossessivesPractice);
    document.getElementById('practice-all-grammar-btn')?.addEventListener('click', practiceAllGrammar);
}

async function startGenderPractice() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    if (!language || !days.length) { 
        alert((window.translations?.[language]?.alertLangDay || window.translations?.COSYenglish?.alertLangDay) || 'Please select language and day(s) first');
        return;
    }
    const genderExercises = GRAMMAR_PRACTICE_TYPES['gender'].exercises;
    const randomExerciseName = genderExercises[Math.floor(Math.random() * genderExercises.length)];
    if (typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Exercise function ${randomExerciseName} not found.`);
        document.getElementById('result').innerHTML = `<p>Error: Could not load exercise.</p>`;
    }
}

async function showArticleWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    let grammarItem = null; 
    let reviewItemObj = null; 

    // SRS Logic (simplified)
    // ... (SRS logic as before)

    if (!grammarItem) { 
        const items = await loadGenderGrammar(language, days);
        if (!items || !items.length) { // Check if items is null or empty
            showNoDataMessage();
            return;
        }
        grammarItem = items[Math.floor(Math.random() * items.length)];
        reviewItemObj = null; 
    }
    
    if (!grammarItem) {
        showNoDataMessage();
        return;
    }
    
    const correctAnswerForVariation = grammarItem.article; // Store correct answer before variation

    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    const variations = [
        { type: 'article', question: `"${grammarItem.word}"`, answer: grammarItem.article }, 
        { type: 'word', question: `"${grammarItem.article}"`, answer: grammarItem.word }    
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];

    resultArea.innerHTML = `
        <div class="gender-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.aria?.genderExercise || 'Gender Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="gender-prompt" data-transliterable aria-label="${variation.question}">${variation.question}</div>
            <button id="pronounce-gender-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="${t.aria?.typeYourAnswer || 'Type your answer'}" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}">
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.gender-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('gender-answer-feedback');
            const answerInput = document.getElementById('gender-answer-input');
            answerInput.value = variation.answer;
            answerInput.disabled = true;
            feedbackEl.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${variation.answer}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview && grammarItem.word) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-article', grammarItem.word, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedbackEl = document.getElementById('gender-answer-feedback');
            feedbackEl.innerHTML = `<span class="hint-text">${t.hint_firstLetterIs || 'Hint: The first letter is'} "<span data-transliterable>${variation.answer[0]}</span>"</span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = async function() {
            const userInput = document.getElementById('gender-answer-input').value.trim();
            let feedbackText = '';
            let isCorrect = false;
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            
            if (!userInput) {
                feedbackText = `<span style="color:#e67e22;">${currentT.feedbackPleaseType || 'Please type your answer above.'}</span>`;
            } else {
                if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
                    feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                    if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardCorrectAnswer();
                    isCorrect = true;
                } else {
                    feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${variation.answer}</strong></span>`;
                    if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardIncorrectAnswer();
                }
            }
            document.getElementById('gender-answer-feedback').innerHTML = feedbackText;

            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && grammarItem.word) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', grammarItem.word, isCorrect);
            }

            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if(isCorrect){ 
                 setTimeout(() => { startGenderPractice(); }, 1200);
            }
        };
    }
    
    const pronounceButton = document.getElementById('pronounce-gender-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const wordToPronounce = variation.type === 'article' ? grammarItem.word : grammarItem.article;
        if (wordToPronounce) pronounceWord(wordToPronounce, language); 
        pronounceButton.addEventListener('click', () => {
            if (wordToPronounce) pronounceWord(wordToPronounce, language);
        });
    }
}

async function showMatchArticlesWords() { 
    // This is a matching exercise, hint/reveal might be complex or handled by its own structure.
    // For now, ensure it doesn't break if called.
    console.warn("showMatchArticlesWords - revealAnswer/showHint not explicitly implemented for this complex match type yet via this pattern.");
    // Actual implementation of showMatchArticlesWords...
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<p>Match Articles Words exercise placeholder - To be fully implemented.</p>';
    const exerciseContainer = resultArea.firstChild;
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = () => { alert("Reveal not implemented for this exercise type yet."); };
        exerciseContainer.showHint = () => { alert("Hint not implemented for this exercise type yet."); };
    }
}

async function showSelectArticleExercise() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const NUM_ARTICLE_OPTIONS = 4; 

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    
    let selectedItem = null; 
    let reviewItemObj = null; 

    // SRS Logic (simplified)
    // ... (SRS logic as before)

    if (!selectedItem) {
        const allGenderItems = await loadGenderGrammar(language, days);
        if (!allGenderItems || !allGenderItems.length) { showNoDataMessage(); return; }
        selectedItem = allGenderItems[Math.floor(Math.random() * allGenderItems.length)];
        reviewItemObj = null;
    }

    if (!selectedItem) { showNoDataMessage(); return; }

    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;
    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    let allArticlesForLang = [...new Set((await loadGenderGrammar(language, days)).map(item => item.article))];
    let articleOptions = [correctArticle];
    allArticlesForLang = allArticlesForLang.filter(art => art !== correctArticle);
    shuffleArray(allArticlesForLang); // Ensure shuffleArray is available
    for (let i = 0; i < Math.min(NUM_ARTICLE_OPTIONS - 1, allArticlesForLang.length); i++) {
        articleOptions.push(allArticlesForLang[i]);
    }
    articleOptions = shuffleArray(articleOptions);
    
    if (articleOptions.length < 2 && !articleOptions.includes(correctArticle)) {
        articleOptions.push(correctArticle); 
    }
    if (articleOptions.length < 1) { 
         resultArea.innerHTML = `<p>${t.notEnoughOptionsError || 'Not enough article options to create this exercise.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    
    resultArea.innerHTML = `
        <div class="select-article-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.aria?.selectArticleExercise || 'Select the Article Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="exercise-prompt" aria-label="${wordToShow}"><strong data-transliterable>${wordToShow}</strong></div>
            <button id="pronounce-select-article-word" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <div class="article-options-container">
                ${articleOptions.map(article => `
                    <button class="article-option-btn btn-secondary" data-article="${article}" aria-label="${article}" data-transliterable>
                        ${article}
                    </button>
                `).join('')}
            </div>
            <div id="select-article-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.select-article-exercise');
    if (exerciseContainer) { 
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('select-article-feedback');
            feedbackEl.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The correct article is:'} <strong data-transliterable>${correctArticle}</strong></span>`;
            document.querySelectorAll('.article-option-btn').forEach(b => {
                b.disabled = true;
                if(b.dataset.article === correctArticle) b.classList.add('correct-revealed');
            });
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview && wordToShow) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-article', wordToShow, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedbackEl = document.getElementById('select-article-feedback');
            // Simple hint: remove one incorrect option if more than 2 options exist
            const incorrectButtons = Array.from(document.querySelectorAll('.article-option-btn:not([disabled])'))
                                       .filter(btn => btn.dataset.article.toLowerCase() !== correctArticle.toLowerCase());
            if (incorrectButtons.length > 1) { // Need at least one incorrect to remove, and correct one must remain
                incorrectButtons[0].classList.add('hint-removed');
                incorrectButtons[0].disabled = true; // Visually disable or hide
                 feedbackEl.innerHTML = `<span class="hint-text">${t.hint_oneOptionRemoved || 'Hint: One incorrect option removed.'}</span>`;
            } else {
                 feedbackEl.innerHTML = `<span class="hint-text">${t.noMoreHints || 'No more hints available.'}</span>`;
            }
        };
    }

    const pronounceButton = document.getElementById('pronounce-select-article-word');
    if (pronounceButton && typeof pronounceWord === 'function') {
        pronounceWord(wordToShow, language); 
        pronounceButton.addEventListener('click', () => pronounceWord(wordToShow, language));
    }

    document.querySelectorAll('.article-option-btn').forEach(btn => {
        btn.onclick = function() {
            const userAnswer = this.dataset.article;
            const feedbackEl = document.getElementById('select-article-feedback');
            const currentLanguage = document.getElementById('language').value;
            let isCorrect = false;
            if (userAnswer.toLowerCase() === correctArticle.toLowerCase()) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                isCorrect = true;
                 if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${correctArticle}</strong></span>`;
                isCorrect = false;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && wordToShow) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', wordToShow, isCorrect);
            }
            document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true); 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
             if(isCorrect){ 
                 setTimeout(() => { startGenderPractice(); }, 1200);
            }
        };
    });
}

async function startVerbsPractice() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    if (!language || !days.length) { 
         alert((window.translations?.[language]?.alertLangDay || window.translations?.COSYenglish?.alertLangDay) || 'Please select language and day(s) first');
        return;
    }
    const verbExercises = GRAMMAR_PRACTICE_TYPES['verbs'].exercises;
    const randomExerciseName = verbExercises[Math.floor(Math.random() * verbExercises.length)];
    if (typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Exercise function ${randomExerciseName} not found.`);
        document.getElementById('result').innerHTML = `<p>Error: Could not load exercise.</p>`;
    }
}

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }

    let itemForExercise = null; 
    let reviewItemObj = null;   

    // SRS Logic (simplified)
    // ... (SRS logic as before)

    if (!itemForExercise) {
        const allVerbItems = await loadVerbGrammar(language, days);
        if (!allVerbItems || !allVerbItems.length) { showNoDataMessage(); return; }
        itemForExercise = allVerbItems[Math.floor(Math.random() * allVerbItems.length)];
        reviewItemObj = null;
    }
    
    if (!itemForExercise) { showNoDataMessage(); return; }
    
    const correctAnswer = itemForExercise.form; // Storing correct answer

    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    const variation = { promptText: `${itemForExercise.pronoun} ( <span data-transliterable>${itemForExercise.verb}</span> )`, answer: itemForExercise.form };

    resultArea.innerHTML = `
        <div class="verb-exercise ${isReview ? 'review-item-cue' : ''}" aria-label="${t.verbExerciseAriaLabel || 'Verb Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="verb-prompt" data-transliterable>${variation.promptText}</div>
            <button id="pronounce-verb-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="verb-answer-input" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}" class="exercise-input">
            <div id="verb-answer-feedback" class="exercise-feedback"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.verb-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('verb-answer-feedback');
            const answerInput = document.getElementById('verb-answer-input');
            answerInput.value = correctAnswer;
            answerInput.disabled = true;
            feedbackEl.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${correctAnswer}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview && itemForExercise.verb) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-verb', itemForExercise.verb, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedbackEl = document.getElementById('verb-answer-feedback');
            // Hint: Show first letter of the correct verb form
            if (correctAnswer && correctAnswer.length > 0) {
                feedbackEl.innerHTML = `<span class="hint-text">${t.hint_firstLetterIs || 'Hint: The first letter is'} "<span data-transliterable>${correctAnswer[0]}</span>"</span>`;
            } else {
                feedbackEl.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available for this item.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = function() {
            const userAnswer = document.getElementById('verb-answer-input').value.trim();
            const feedbackEl = document.getElementById('verb-answer-feedback');
            const currentLanguage = document.getElementById('language').value;
            let isCorrect = false;
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                isCorrect = true;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${correctAnswer}</strong></span>`;
                isCorrect = false;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && itemForExercise.verb) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-verb', itemForExercise.verb, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
             if(isCorrect){ 
                 setTimeout(() => { startVerbsPractice(); }, 1200);
            }
        };
    }
    const pronounceButton = document.getElementById('pronounce-verb-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const textToPronounce = `${itemForExercise.pronoun} ${itemForExercise.form}`; 
        pronounceWord(textToPronounce, language); 
        pronounceButton.addEventListener('click', () => pronounceWord(textToPronounce, language));
    }
}

async function showMatchVerbsPronouns() { 
    console.warn("showMatchVerbsPronouns - revealAnswer/showHint not explicitly implemented for this complex match type yet via this pattern.");
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<p>Match Verbs & Pronouns exercise placeholder - To be fully implemented.</p>';
    const exerciseContainer = resultArea.firstChild;
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = () => { alert("Reveal not implemented for this exercise type yet."); };
        exerciseContainer.showHint = () => { alert("Hint not implemented for this exercise type yet."); };
    }
}
async function showFillGaps() { 
    console.warn("showFillGaps - revealAnswer/showHint not explicitly implemented for this complex match type yet via this pattern.");
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<p>Fill the Gaps (Verbs) exercise placeholder - To be fully implemented.</p>';
    const exerciseContainer = resultArea.firstChild;
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = () => { alert("Reveal not implemented for this exercise type yet."); };
        exerciseContainer.showHint = () => { alert("Hint not implemented for this exercise type yet."); };
    }
 }
async function showWordOrder() { 
    console.warn("showWordOrder - revealAnswer/showHint not explicitly implemented for this complex match type yet via this pattern.");
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<p>Word Order (Verbs) exercise placeholder - To be fully implemented.</p>';
    const exerciseContainer = resultArea.firstChild;
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = () => { alert("Reveal not implemented for this exercise type yet."); };
        exerciseContainer.showHint = () => { alert("Hint not implemented for this exercise type yet."); };
    }
}

async function practiceAllGrammar() { 
    const practiceTypes = ['gender', 'verbs']; // Add 'possessives' once it's implemented
    const randomType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
    if (randomType === 'gender') {
        await startGenderPractice();
    } else if (randomType === 'verbs') {
        await startVerbsPractice();
    }
    // else if (randomType === 'possessives') { await startPossessivesPractice(); }
}

window.initGrammarPractice = initGrammarPractice;
window.startGenderPractice = startGenderPractice;
window.startVerbsPractice = startVerbsPractice;
window.startPossessivesPractice = startPossessivesPractice; 
window.practiceAllGrammar = practiceAllGrammar;

window.showArticleWord = showArticleWord;
window.showMatchArticlesWords = showMatchArticlesWords;
window.showSelectArticleExercise = showSelectArticleExercise;
window.showTypeVerb = showTypeVerb;
window.showMatchVerbsPronouns = showMatchVerbsPronouns;
window.showFillGaps = showFillGaps;
window.showWordOrder = showWordOrder;

window.showArticleWord = patchExerciseWithExtraButtons(showArticleWord, '.gender-exercise', window.startGenderPractice, {});
window.showMatchArticlesWords = patchExerciseWithExtraButtons(showMatchArticlesWords, '.match-exercise', window.startGenderPractice, { noCheck: true });
window.showSelectArticleExercise = patchExerciseWithExtraButtons(showSelectArticleExercise, '.select-article-exercise', window.startGenderPractice, { noCheck: true });
window.showTypeVerb = patchExerciseWithExtraButtons(showTypeVerb, '.verb-exercise', window.startVerbsPractice, {});
window.showMatchVerbsPronouns = patchExerciseWithExtraButtons(showMatchVerbsPronouns, '.match-exercise', window.startVerbsPractice, { noCheck: true });
window.showFillGaps = patchExerciseWithExtraButtons(showFillGaps, '.fill-gap-exercise', window.startVerbsPractice, {});
window.showWordOrder = patchExerciseWithExtraButtons(showWordOrder, '.word-order-exercise', window.startVerbsPractice, {});

document.addEventListener('DOMContentLoaded', initGrammarPractice);
