// Functions moved to utils.js: shuffleArray, showNoDataMessage, addRandomizeButton
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
   // Ensure data for the specific day is returned, or an empty array if not present
    let dayData = [];
    if (data) {
        if (Array.isArray(day)) { // If day is an array, concatenate data for all specified days
            day.forEach(d => {
                if (data[d]) dayData = dayData.concat(data[d]);
            });
        } else if (data[day]) { // If day is a single value
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

    if (!days || days.length === 0) { // Handle empty or undefined days array
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

async function loadVocabularyData(language, days) {
    const fileMap = {
        'COSYenglish': 'data/vocabulary/words/english.json',
        'COSYitaliano': 'data/vocabulary/words/italian.json',
        'COSYfrançais': 'data/vocabulary/words/french.json',
        'COSYespañol': 'data/vocabulary/words/spanish.json',
        'COSYdeutsch': 'data/vocabulary/words/german.json',
        'COSYportuguês': 'data/vocabulary/words/portuguese.json',
        'ΚΟΖΥελληνικά': 'data/vocabulary/words/greek.json',
        'ТАКОЙрусский': 'data/vocabulary/words/russian.json',
        'COSYbrezhoneg': 'data/vocabulary/words/breton.json',
        'COSYtatarça': 'data/vocabulary/words/tatar.json',
        'COSYbashkort': 'data/vocabulary/words/bashkir.json',
        'ԾՈՍՅհայկական': 'data/vocabulary/words/armenian.json',
    };
    const file = fileMap[language];
    if (!file) {
        console.error(`Error loading vocabulary: No file mapped for language ${language}`);
        return [];
    }
    const loadResult = await loadData(file);
    if (loadResult.error) {
        console.error(`Error loading vocabulary for ${language} from ${file}: ${loadResult.errorType} - ${loadResult.error}`);
        return [];
    }
    const vocabData = loadResult.data; 
    if (!vocabData) {
        console.error(`No data found in ${file} for language ${language}`);
        return [];
    }

    let combinedVocabularyWords = [];
    let seenVocabItems = new Set(); 

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
        const dayVocab = vocabData[currentDayKey] ? vocabData[currentDayKey] : [];
        for (const wordObj of dayVocab) { 
            const stringifiedWordObj = JSON.stringify(wordObj);
            if (wordObj.word && !seenVocabItems.has(stringifiedWordObj)) {
                seenVocabItems.add(stringifiedWordObj);
                combinedVocabularyWords.push(wordObj.word); 
            }
        }
    }
    return combinedVocabularyWords;
}


async function loadPossessivesGrammar(language, day) {
    const fileMap = {
        'COSYenglish': 'data/grammar/possessives/possessives_english.json',
        'COSYitaliano': 'data/grammar/possessives/possessives_italian.json',
        'COSYfrançais': 'data/grammar/possessives/possessives_french.json',
        'COSYespañol': 'data/grammar/possessives/possessives_spanish.json',
        'COSYdeutsch': 'data/grammar/possessives/possessives_german.json',
        'COSYportuguês': 'data/grammar/possessives/possessives_portuguese.json',
        'ТАКОЙрусский': 'data/grammar/possessives/possessives_russian.json',
        'COSYbrezhoneg': 'data/grammar/possessives/possessives_breton.json',
        'COSYtatarça': 'data/grammar/possessives/possessives_tatar.json',
        'COSYbashkort': 'data/grammar/possessives/possessives_bashkir.json',
        'ԾՈՍՅհայկական': 'data/grammar/possessives/possessives_armenian.json',
        'ΚΟΖΥελληνικά': 'data/grammar/possessives/possessives_greek.json'
    };
    const file = fileMap[language];
    if (!file) {
        console.error(`Error loading possessives grammar: No file mapped for language ${language}`);
        return [];
    }
    const loadResult = await loadData(file); 
    
    if (loadResult.error) {
        console.error(`Error loading possessives grammar for ${language} from ${file}: ${loadResult.errorType} - ${loadResult.error}`);
        return [];
    }
    const data = loadResult.data;
    return data && data[day] ? data[day] : [];
}

const LANGUAGE_GENDER_SYSTEMS = { /* ... existing ... */ };
const ARTICLE_CATEGORIES = { /* ... existing ... */ };

const GRAMMAR_PRACTICE_TYPES = { 
    'gender': {
        exercises: ['showArticleWord', 'showMatchArticlesWords', 'showSelectArticleExercise'],
        name: 'Gender & Articles'
    },
    'verbs': {
        exercises: ['showTypeVerb', 'showMatchVerbsPronouns', 'showFillGaps', 'showWordOrder'],
        name: 'Verbs & Conjugation'
    },
    // 'possessives': {
    //     exercises: ['showTypePossessive', 'showMatchPossessives'],
    //     name: 'Possessives'
    // }
};

function initGrammarPractice() { 
    document.getElementById('gender-practice-btn')?.addEventListener('click', startGenderPractice);
    document.getElementById('verbs-practice-btn')?.addEventListener('click', startVerbsPractice);
    // document.getElementById('possessives-practice-btn')?.addEventListener('click', startPossessivesPractice);
    document.getElementById('practice-all-grammar-btn')?.addEventListener('click', practiceAllGrammar);
}

async function startGenderPractice() { 
    const exercises = GRAMMAR_PRACTICE_TYPES['gender'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    if (typeof window[randomExercise] === 'function') {
        await window[randomExercise]();
    } else {
        console.error(`Function ${randomExercise} not found.`);
    }
}

async function showArticleWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const items = await loadGenderGrammar(language, days);
    if (!items.length) {
        showNoDataMessage();
        return;
    }
    const item = items[Math.floor(Math.random() * items.length)];
    const variations = [
        { type: 'article', question: `"${item.word}"`, answer: item.article }, 
        { type: 'word', question: `"${item.article}"`, answer: item.word }    
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];

    resultArea.innerHTML = `
        <div class="gender-exercise" role="form" aria-label="${t.aria?.genderExercise || 'Gender Exercise'}">
            <div class="gender-prompt" aria-label="${variation.question}">${variation.question}</div>
            <button id="pronounce-gender-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="${t.aria?.typeYourAnswer || 'Type your answer'}" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}">
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;

    const exerciseContainer = resultArea.querySelector('.gender-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.checkNounEnding || "Check the noun's ending or typical gender patterns for this language. The word is"} '${item.word}'.`;
            exerciseContainer.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = async function() {
            const userInput = document.getElementById('gender-answer-input').value.trim();
            let feedbackText = '';
            let isCorrect = false;
            const t = translations[document.getElementById('language').value] || translations.COSYenglish;
            if (!userInput) {
                feedbackText = `<span style="color:#e67e22;">${t.feedbackPleaseType || 'Please type your answer above.'}</span>`;
            } else {
                if (variation.type === 'article') { 
                    if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
                        feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                        CosyAppInteractive.awardCorrectAnswer();
                        CosyAppInteractive.scheduleReview(document.getElementById('language').value, 'gender', item.word, true);
                        isCorrect = true;
                    } else {
                        feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${variation.answer}</b></span>`;
                        CosyAppInteractive.awardIncorrectAnswer();
                    }
                } else { 
                    const targetArticle = item.article; 
                    // Ensure 'items' from the outer scope is used, not re-declared by mistake if it was intended to be from the outer scope
                    const currentItems = await loadGenderGrammar(document.getElementById('language').value, getSelectedDays()); 
                    const isValidWordForArticle = currentItems.some(i => i.article.toLowerCase() === targetArticle.toLowerCase() && i.word.toLowerCase() === userInput.toLowerCase());
                    if (isValidWordForArticle) {
                        feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                        CosyAppInteractive.awardCorrectAnswer();
                        CosyAppInteractive.scheduleReview(document.getElementById('language').value, 'gender', item.word, true);
                        isCorrect = true;
                    } else {
                        feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${t.notValidForArticle || `Not a valid word for "${targetArticle}". The expected example was:`} <b>${variation.answer}</b>. ${t.otherWordsExist || 'Other valid words might exist.'}</span>`;
                        CosyAppInteractive.awardIncorrectAnswer();
                    }
                }
            }
            document.getElementById('gender-answer-feedback').innerHTML = feedbackText;
            if(isCorrect){ 
                 setTimeout(() => { startGenderPractice(); }, 1200);
            }
        };
    }
    
    const pronounceButton = document.getElementById('pronounce-gender-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const wordToPronounce = variation.type === 'article' ? item.word : item.article;
        if (wordToPronounce) pronounceWord(wordToPronounce, language); 
        pronounceButton.addEventListener('click', () => {
            if (wordToPronounce) pronounceWord(wordToPronounce, language);
        });
    }
}

async function showMatchArticlesWords() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const genderData = await loadGenderGrammar(language, days);
    if (!genderData || genderData.length < 2) { // Need at least 2 items for a match
        showNoDataMessage();
        return;
    }

    let selectedItems = shuffleArray([...genderData]).slice(0, Math.min(genderData.length, 5)); // Max 5 pairs
    if (selectedItems.length < 2) {
        showNoDataMessage();
        return;
    }
     
    const displayArticles = selectedItems.map(item => item.article);
    const displayWords = selectedItems.map(item => item.word);
    const shuffledDisplayArticles = shuffleArray([...displayArticles]); 
    const shuffledDisplayWords = shuffleArray([...displayWords]);     

    resultArea.innerHTML = `
        <div class="match-exercise" role="region" aria-label="${t.aria?.matchArticlesWords || 'Match Articles and Words'}">
            <div class="match-container">
                <div class="match-col" id="articles-col" aria-label="${t.aria?.articlesColumn || 'Articles column'}">
                    ${shuffledDisplayArticles.map(article => `<div class="match-item" data-article="${article}" role="button" tabindex="0" aria-label="${t.aria?.articleAriaLabel || 'Article:'} ${article}">${article} </div>`).join('')}
                </div>
                <div class="match-col" id="words-col" aria-label="${t.aria?.wordsColumn || 'Words column'}">
                    ${shuffledDisplayWords.map(word => `<div class="match-item" data-word="${word}" role="button" tabindex="0" aria-label="${t.aria?.wordAriaLabel || 'Word:'} ${word}">${word}</div>`).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.match-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMatchArticles || "Look for common article-noun pairings. Some articles are only used with specific noun types."}`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }
    
    let selectedArticleEl = null, selectedWordEl = null;
    let matchedPairs = 0;

    document.querySelectorAll('#articles-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedArticleEl) selectedArticleEl.classList.remove('selected');
            this.classList.add('selected');
            selectedArticleEl = this;
            checkMatchAttempt();
        });
    });
    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedWordEl) selectedWordEl.classList.remove('selected');
            this.classList.add('selected');
            selectedWordEl = this;
            checkMatchAttempt();
        });
    });

    function checkMatchAttempt() {
        if (selectedArticleEl && selectedWordEl) {
            const article = selectedArticleEl.dataset.article;
            const word = selectedWordEl.dataset.word;
            const correctPair = selectedItems.find(item => item.word === word && item.article === article);
            const feedbackEl = document.getElementById('match-feedback');

            if (correctPair) {
                selectedArticleEl.classList.add('matched', 'disabled');
                selectedWordEl.classList.add('matched', 'disabled');
                selectedArticleEl.classList.remove('selected');
                selectedWordEl.classList.remove('selected');
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct match!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(language, 'gender-match', {article, word}, true);
                matchedPairs++;
                if (matchedPairs === selectedItems.length) {
                    feedbackEl.innerHTML += `<br><span class="correct">${t.allPairsMatched || 'All pairs matched! Great job!'}</span>`;
                    setTimeout(() => showMatchArticlesWords(), 2000);
                }
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                selectedArticleEl.classList.remove('selected');
                selectedWordEl.classList.remove('selected');
            }
            selectedArticleEl = null;
            selectedWordEl = null;
        }
    }
}

async function showSelectArticleExercise() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;
    const NUM_ARTICLE_OPTIONS = 4; 

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const items = await loadGenderGrammar(language, days);
    if (!items.length) { showNoDataMessage(); return; }

    const selectedItem = items[Math.floor(Math.random() * items.length)];
    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;
    
    let allArticlesForLang = [];
    if (ARTICLE_CATEGORIES[language]) { allArticlesForLang = Object.keys(ARTICLE_CATEGORIES[language]); } 
    else if (language === 'COSYenglish') { allArticlesForLang = ['he', 'she', 'it', 'he/she'];} 
    else { const uniqueArticles = new Set(items.map(i => i.article)); allArticlesForLang = Array.from(uniqueArticles); }

    let articleOptions = [correctArticle];
    let distractorArticles = shuffleArray(allArticlesForLang.filter(a => a.toLowerCase() !== correctArticle.toLowerCase()));
    
    for(let i=0; articleOptions.length < NUM_ARTICLE_OPTIONS && i < distractorArticles.length; i++){
        articleOptions.push(distractorArticles[i]);
    }
    articleOptions = shuffleArray(articleOptions);
    
    if (allArticlesForLang.length < 2 && articleOptions.length < 2) { 
        resultArea.innerHTML = `<p>${t.notEnoughOptionsError || 'Not enough article options to create this exercise.'}</p>`;
        return; 
    }
    
    resultArea.innerHTML = `
        <div class="select-article-exercise" role="form" aria-label="${t.aria?.selectArticleExercise || 'Select the Article Exercise'}">
            <div class="exercise-prompt" aria-label="${wordToShow}"><strong>${wordToShow}</strong></div>
            <button id="pronounce-select-article-word" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <div class="article-options-container">
                ${articleOptions.map(article => `
                    <button class="article-option-btn btn-secondary" data-article="${article}" aria-label="${article}">
                        ${article}
                    </button>
                `).join('')}
            </div>
            <div id="select-article-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.select-article-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintSelectArticle || "Consider the gender and number of the noun"} '${selectedItem.word}'. ${t.articleOptionsAre || "The correct article is one of:"} ${articleOptions.join(', ')}.`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }

    const pronounceButton = document.getElementById('pronounce-select-article-word');
     if (pronounceButton && typeof pronounceWord === 'function') {
        pronounceWord(wordToShow, language); // Auto-pronounce
        pronounceButton.addEventListener('click', () => pronounceWord(wordToShow, language));
     }

    document.querySelectorAll('.article-option-btn').forEach(btn => {
        btn.onclick = function() {
            const userAnswer = this.dataset.article;
            const feedbackEl = document.getElementById('select-article-feedback');
            document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true); // Disable all buttons

            if (userAnswer.toLowerCase() === correctArticle.toLowerCase()) {
                this.classList.add('correct-selection');
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(language, 'gender-select', {word: wordToShow, article: correctArticle}, true);
            } else {
                this.classList.add('incorrect-selection');
                // Highlight the correct answer
                const correctBtn = document.querySelector(`.article-option-btn[data-article="${correctArticle}"]`);
                if(correctBtn) correctBtn.classList.add('correct-selection');
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctArticle}</b></span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                CosyAppInteractive.scheduleReview(language, 'gender-select', {word: wordToShow, article: correctArticle}, false);
            }
            setTimeout(() => showSelectArticleExercise(), 1500);
        };
    });
}

async function startVerbsPractice() { 
    const exercises = GRAMMAR_PRACTICE_TYPES['verbs'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    if (typeof window[randomExercise] === 'function') {
        await window[randomExercise]();
    } else {
        console.error(`Function ${randomExercise} not found.`);
    }
}

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const items = await loadVerbGrammar(language, days);
    if (!items.length) { showNoDataMessage(); return; }
    const item = items[Math.floor(Math.random() * items.length)];
    
    const variations = [
        { type: 'infinitive', promptText: `${t.infinitiveOf || "Infinitive of"} "${item.prompt}"`, pronounceText: item.prompt, answer: item.infinitive },
        { type: 'conjugated', promptText: `${t.conjugateFor || "Conjugate"} "${item.infinitive}" ${t.forPronoun || "for"} "${item.prompt}"`, pronounceText: item.infinitive, answer: item.answer }
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const correctAnswer = variation.answer;

    resultArea.innerHTML = `
        <div class="verb-exercise" aria-label="${t.verbExerciseAriaLabel || 'Verb Exercise'}">
            <h2 class="practice-type-title">${t.practiceTitleShowTypeVerb || 'Verb Conjugation'}</h2>
            <div class="verb-prompt">${variation.promptText}</div>
            <button id="pronounce-verb-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="verb-answer-input" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}" class="exercise-input">
            <div id="verb-answer-feedback" class="exercise-feedback"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.verb-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintVerbConjugation || "Focus on the tense and the subject/pronoun. The infinitive is"} '${item.infinitive}' ${t.andPromptIs || "and prompt is related to"} '${item.prompt}'.`;
            exerciseContainer.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = function() {
            const userAnswer = document.getElementById('verb-answer-input').value.trim();
            const feedbackEl = document.getElementById('verb-answer-feedback');
            const currentLanguage = document.getElementById('language').value; // Ensure language is fresh
            const t = translations[currentLanguage] || translations.COSYenglish; 
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'verb-conjugation', {infinitive: item.infinitive, prompt: item.prompt, answer: correctAnswer}, true);
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctAnswer}</b></span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'verb-conjugation', {infinitive: item.infinitive, prompt: item.prompt, answer: correctAnswer}, false);
            }
            setTimeout(() => { showTypeVerb(); }, 1200);
        };
    }

    const pronounceVerbButton = document.getElementById('pronounce-verb-item');
    if (pronounceVerbButton && typeof pronounceWord === 'function') {
         if(variation.pronounceText) pronounceWord(variation.pronounceText, language);
         pronounceVerbButton.addEventListener('click', () => {
            if(variation.pronounceText) pronounceWord(variation.pronounceText, language);
        });
    }
}

async function showMatchVerbsPronouns() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;
    
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbItems = await loadVerbGrammar(language, days); 
    if (!verbItems || verbItems.length < 2) { showNoDataMessage(); return; }

    const suitableItems = verbItems.filter(item => typeof item.prompt !== 'undefined' && typeof item.answer !== 'undefined' && item.prompt.trim() !== '' && item.answer.trim() !== '');
    if (suitableItems.length < 2) { showNoDataMessage(); return; }

    const itemsForGame = shuffleArray(suitableItems).slice(0, Math.min(suitableItems.length, 5));
    const prompts = itemsForGame.map(item => item.prompt); // These are usually pronouns or subjects
    const answersToMatch = itemsForGame.map(item => item.answer); // These are the conjugated verbs
    
    const shuffledPrompts = shuffleArray([...prompts]);
    const shuffledAnswers = shuffleArray([...answersToMatch]);

    resultArea.innerHTML = `
        <div class="match-exercise">
            <div class="match-container">
                <div class="match-col" id="prompts-col">${shuffledPrompts.map(p => `<div class="match-item" data-prompt="${p}" role="button" tabindex="0">${p}</div>`).join('')}</div>
                <div class="match-col" id="answers-col">${shuffledAnswers.map(a => `<div class="match-item" data-answer="${a}" role="button" tabindex="0">${a}</div>`).join('')}</div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.match-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMatchPronouns || "Match pronouns to their correct verb conjugations. Pay attention to singular vs. plural and person (1st, 2nd, 3rd)."}`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }
    
    let selectedPromptEl = null, selectedAnswerEl = null;
    let matchedPairsCount = 0;

    document.querySelectorAll('#prompts-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedPromptEl) selectedPromptEl.classList.remove('selected');
            this.classList.add('selected');
            selectedPromptEl = this;
            checkVerbPronounMatchAttempt();
        });
    });
    document.querySelectorAll('#answers-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedAnswerEl) selectedAnswerEl.classList.remove('selected');
            this.classList.add('selected');
            selectedAnswerEl = this;
            checkVerbPronounMatchAttempt();
        });
    });

    function checkVerbPronounMatchAttempt() {
        if (selectedPromptEl && selectedAnswerEl) {
            const promptText = selectedPromptEl.dataset.prompt;
            const answerText = selectedAnswerEl.dataset.answer;
            const correctItem = itemsForGame.find(it => it.prompt === promptText && it.answer === answerText);
            const feedbackEl = document.getElementById('match-feedback');

            if (correctItem) {
                selectedPromptEl.classList.add('matched', 'disabled');
                selectedAnswerEl.classList.add('matched', 'disabled');
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct match!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(language, 'verb-pronoun-match', {prompt: promptText, answer: answerText}, true);
                matchedPairsCount++;
                if (matchedPairsCount === itemsForGame.length) {
                    feedbackEl.innerHTML += `<br><span class="correct">${t.allPairsMatched || 'All pairs matched! Great job!'}</span>`;
                    setTimeout(() => showMatchVerbsPronouns(), 2000);
                }
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                selectedPromptEl.classList.remove('selected'); // Allow re-selection
                selectedAnswerEl.classList.remove('selected');
            }
            selectedPromptEl = null; // Reset for next attempt
            selectedAnswerEl = null;
        }
    }
}

async function showFillGaps() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbData = await loadVerbGrammar(language, days);
    if (!verbData.length) { showNoDataMessage(); return; }
    
    let suitableItem = verbData.find(vi => vi.example && vi.example.sentence && vi.example.sentence.includes("___") && vi.example.correct_form);
    if (!suitableItem) {
        // Try to find at least one item that *could* be suitable if we manufacture the blank
        suitableItem = verbData.find(vi => vi.example && vi.example.sentence && vi.example.correct_form);
        if (suitableItem && suitableItem.example.sentence.includes(suitableItem.example.correct_form)) {
            suitableItem.example.sentence = suitableItem.example.sentence.replace(suitableItem.example.correct_form, "___");
        } else {
            // If still no suitable item, show message and return
            console.warn("No suitable verb item found for fill-gaps after attempting to create a blank.");
            showNoDataMessage();
            return;
        }
    }
    
    const sentence = suitableItem.example.sentence;
    const correctAnswer = suitableItem.example.correct_form;
    const verbItem = suitableItem; // For hint access

    resultArea.innerHTML = `
        <div class="fill-gap-exercise">
            <div class="sentence-with-gap">${sentence.replace('___', '<input type="text" id="gap-answer" class="exercise-input" placeholder="'+ (t.typeYourAnswerPlaceholder || 'Type your answer...') +'">')}</div>
            <div id="gap-feedback" class="exercise-feedback"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.fill-gap-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            const infinitive = verbItem.infinitive || (t.relatedVerb || "related verb");
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintFillGap || "Identify the subject and tense required for the verb. The base verb is related to items like"} '${infinitive}'.`;
            exerciseContainer.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('gap-answer').value.trim();
            const feedbackEl = document.getElementById('gap-feedback');
            const currentLanguage = document.getElementById('language').value;
            const t = translations[currentLanguage] || translations.COSYenglish;
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'fill-gap', {sentence, correctAnswer}, true);
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctAnswer}</b></span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'fill-gap', {sentence, correctAnswer}, false);
            }
            setTimeout(() => { showFillGaps(); }, 1500); 
        };
    }
}

async function showWordOrder() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbData = await loadVerbGrammar(language, days);
    if (!verbData || verbData.length === 0) { showNoDataMessage(); return; } 
    
    let sentenceParts = [];
    let originalSentence = "";
    let foundSuitableSentence = false;

    for(let i=0; i < verbData.length && !foundSuitableSentence; i++){
        const verbItem = verbData[Math.floor(Math.random() * verbData.length)];
        if (verbItem && verbItem.example && verbItem.example.sentence_parts && verbItem.example.sentence_parts.length > 1) {
            sentenceParts = verbItem.example.sentence_parts.filter(p => p && String(p).trim() !== '');
            originalSentence = verbItem.example.sentence || sentenceParts.join(" "); 
            if(sentenceParts.length > 1) foundSuitableSentence = true;
        }
    }

    if (!foundSuitableSentence) {
        showNoDataMessage(); 
        return;
    }
    
    const shuffledParts = shuffleArray([...sentenceParts]);

    resultArea.innerHTML = `
        <div class="word-order-exercise">
            <div class="word-pool clickable" id="word-pool">${shuffledParts.map(part => `<div class="word-tile" data-word="${part}">${part}</div>`).join('')}</div>
            <div class="sentence-slots clickable" id="sentence-slots">${Array(sentenceParts.length).fill('<div class="word-slot"></div>').join('')}</div>
            <div id="order-feedback" class="exercise-feedback"></div>
            <div class="order-actions">
                <button id="reset-order" class="btn-secondary">${t.buttons?.reset || 'Reset'}</button>
            </div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.word-order-exercise');
    const sentenceSlots = document.getElementById('sentence-slots'); // Define here to ensure it's in scope for checkAnswer

    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWordOrder || "Typical sentence structure is Subject-Verb-Object. Questions or negative sentences might alter this."}`;
            exerciseContainer.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = () => {
            const orderedWords = Array.from(sentenceSlots.querySelectorAll('.word-tile')).map(tile => tile.dataset.word);
            const feedbackEl = document.getElementById('order-feedback');
            const currentLanguage = document.getElementById('language').value;
            const t = translations[currentLanguage] || translations.COSYenglish;
            if (orderedWords.join(' ') === sentenceParts.join(' ')) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'word-order', {parts: sentenceParts, sentence: originalSentence}, true);
                 setTimeout(() => { showWordOrder(); }, 1500); 
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteTryAgain || 'Not quite. Try again!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'word-order', {parts: sentenceParts, sentence: originalSentence}, false);
            }
        };
    }

    const wordPool = document.getElementById('word-pool');

    document.querySelectorAll('#word-pool .word-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const firstEmptySlot = sentenceSlots.querySelector('.word-slot:empty');
            if (firstEmptySlot) {
                firstEmptySlot.appendChild(tile);
            }
        });
    });

    sentenceSlots.addEventListener('click', (e) => {
        if (e.target.classList.contains('word-tile')) {
            wordPool.appendChild(e.target); 
        }
    });
    
    document.getElementById('reset-order').addEventListener('click', () => {
        sentenceSlots.querySelectorAll('.word-tile').forEach(tile => {
            wordPool.appendChild(tile);
        });
        const tilesInPool = Array.from(wordPool.querySelectorAll('.word-tile'));
        tilesInPool.sort(() => Math.random() - 0.5).forEach(tile => wordPool.appendChild(tile));
        document.getElementById('order-feedback').innerHTML = '';
    });
}

function getPronounsForLanguage(language) { /* ... */ }
function getRandomPronounForLanguage(language) { /* ... */ }
function conjugateVerb(verb, pronoun, language) { /* ... */ }
function getNegativeElement(pronoun, language) { /* ... */ }
function getQuestionElement(pronoun, language) { /* ... */ }
async function getRandomObject(language, days) { /* ... */ }
function getRandomTimeExpression(language) { /* ... */ }
async function startPossessivesPractice() { }
async function showTypePossessive() { }
async function showMatchPossessives() { }

async function practiceAllGrammar() { 
    const allGrammarExercises = Object.values(GRAMMAR_PRACTICE_TYPES).flatMap(type => type.exercises);
    if (allGrammarExercises.length === 0) {
        showNoDataMessage();
        return;
    }
    const randomExerciseName = allGrammarExercises[Math.floor(Math.random() * allGrammarExercises.length)];
    if (typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Function ${randomExerciseName} not found for Practice All Grammar.`);
    }
}

showArticleWord = patchExerciseWithExtraButtons(showArticleWord, '.gender-exercise', startGenderPractice);
showMatchArticlesWords = patchExerciseWithExtraButtons(showMatchArticlesWords, '.match-exercise', startGenderPractice);
showSelectArticleExercise = patchExerciseWithExtraButtons(showSelectArticleExercise, '.select-article-exercise', startGenderPractice);
showTypeVerb = patchExerciseWithExtraButtons(showTypeVerb, '.verb-exercise', startVerbsPractice);
showMatchVerbsPronouns = patchExerciseWithExtraButtons(showMatchVerbsPronouns, '.match-exercise', startVerbsPractice);
showFillGaps = patchExerciseWithExtraButtons(showFillGaps, '.fill-gap-exercise', startVerbsPractice);
showWordOrder = patchExerciseWithExtraButtons(showWordOrder, '.word-order-exercise', startVerbsPractice);

document.addEventListener('DOMContentLoaded', initGrammarPractice);
