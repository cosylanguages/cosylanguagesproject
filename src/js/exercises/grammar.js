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

    if (!days || days.length === 0) { 
        return [];
    }

    // Determine the range of days to load (e.g., if days = ["1", "3"], load day 1, 2, and 3)
    // Or, if specific days are meant, adjust logic. Assuming cumulative loading for now.
    const dayNumbers = days.map(d => parseInt(d)).sort((a,b) => a-b);
    const maxDay = dayNumbers[dayNumbers.length -1];


    for (let i = 1; i <= maxDay; i++) { // Load from day 1 up to the max selected day
        const currentDayKey = String(i);
        if (data[currentDayKey]) {
            const dayData = data[currentDayKey];
            for (const item of dayData) {
                const stringifiedItem = JSON.stringify(item); 
                if (!seenItems.has(stringifiedItem)) {
                    seenItems.add(stringifiedItem);
                    combinedVerbData.push(item);
                }
            }
        }
    }
    return combinedVerbData;
}

// ARTICLE_CATEGORIES might be needed for hints or logic in showSelectArticleExercise
const ARTICLE_CATEGORIES = {
    'COSYitaliano': { 'il': 'masculine singular', 'lo': 'masculine singular (s+cons, z, gn, ps, x, y)', 'l\'': 'singular (before vowel)', 'la': 'feminine singular', 'i': 'masculine plural', 'gli': 'masculine plural (s+cons, z, gn, ps, x, y, vowel)', 'le': 'feminine plural' },
    'COSYfrançais': { 'le': 'masculine singular', 'l\'': 'singular (before vowel/h)', 'la': 'feminine singular', 'les': 'plural' },
    'COSYespañol': { 'el': 'masculine singular', 'la': 'feminine singular', 'los': 'masculine plural', 'las': 'feminine plural', 'un': 'masculine singular indefinite', 'una': 'feminine singular indefinite', 'unos': 'masculine plural indefinite', 'unas': 'feminine plural indefinite' },
    'COSYdeutsch': { 'der': 'masculine nominative', 'die': 'feminine/plural nominative', 'das': 'neuter nominative', 'den': 'masculine accusative', 'dem': 'dative masculine/neuter', 'des': 'genitive masculine/neuter', 'einen': 'masculine accusative indefinite', 'eine': 'feminine nominative/accusative indefinite', 'ein': 'neuter nominative/accusative indefinite / masculine nominative indefinite' },
    'COSYportuguês': { 'o': 'masculine singular', 'a': 'feminine singular', 'os': 'masculine plural', 'as': 'feminine plural' },
    'ΚΟΖΥελληνικά': { 'ο': 'masculine singular nominative', 'η': 'feminine singular nominative', 'το': 'neuter singular nominative', 'οι': 'masculine/feminine plural nominative', 'τα': 'neuter plural nominative' },
    // Add other languages as needed
};


const GRAMMAR_PRACTICE_TYPES = { 
    'gender': {
        exercises: ['showArticleWord', 'showMatchArticlesWords', 'showSelectArticleExercise'],
        name: 'Gender & Articles'
    },
    'verbs': {
        exercises: ['showTypeVerb', 'showMatchVerbsPronouns', 'showFillGaps', 'showWordOrder'],
        name: 'Verbs & Conjugation'
    }
    // Possessives can be added back when ready
};

function initGrammarPractice() { 
    document.getElementById('gender-practice-btn')?.addEventListener('click', startGenderPractice);
    document.getElementById('verbs-practice-btn')?.addEventListener('click', startVerbsPractice);
    document.getElementById('practice-all-grammar-btn')?.addEventListener('click', startRandomGrammarPractice); // Changed to general randomizer
}

// General randomizer for all grammar exercises
async function startRandomGrammarPractice() {
    const allCategories = Object.keys(GRAMMAR_PRACTICE_TYPES);
    if (allCategories.length === 0) { showNoDataMessage(); return; }
    const randomCategoryKey = allCategories[Math.floor(Math.random() * allCategories.length)];
    
    if (randomCategoryKey === 'gender') {
        await startGenderPractice();
    } else if (randomCategoryKey === 'verbs') {
        await startVerbsPractice();
    } else {
        console.error("Unknown grammar category selected:", randomCategoryKey);
        // Fallback to a default if necessary
        await startGenderPractice(); 
    }
}


async function startGenderPractice() { 
    const exercises = GRAMMAR_PRACTICE_TYPES['gender'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    if (typeof window[randomExercise] === 'function') {
        await window[randomExercise]();
    } else {
        console.error(`Function ${randomExercise} not found.`);
        // Fallback to a default gender exercise if specific one not found
        await showArticleWord();
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
    const items = await loadGenderGrammar(language, days);
    if (!items || !items.length) { // Added check for items being undefined as well
        showNoDataMessage();
        return;
    }
    const item = items[Math.floor(Math.random() * items.length)];
    const variations = [
        { type: 'article', question: `"${item.word}"`, answer: item.article, pronounceText: item.word }, 
        { type: 'word', question: `"${item.article}"`, answer: item.word, pronounceText: item.article }    
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];

    resultArea.innerHTML = `
        <div class="gender-exercise exercise-container" role="form" aria-label="${t.aria?.genderExercise || 'Gender Exercise'}">
            <div class="gender-prompt" aria-label="${variation.question}">${variation.question}</div>
            <button id="pronounce-gender-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="${t.aria?.typeYourAnswer || 'Type your answer'}" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}">
            <button id="check-gender-answer-btn-impl" class="btn-primary" aria-label="${t.aria?.checkAnswer || 'Check answer'}">✅ ${t.buttons?.check || 'Check'}</button>
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="btn-new-article-word" class="btn-secondary" onclick="window.showArticleWord()">🔄 ${t.buttons?.newArticleWord || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;

    const exerciseContainer = resultArea.querySelector('.gender-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.checkNounEnding || "Check the noun's ending or typical gender patterns for this language. The word is"} '${item.word}'.`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = () => document.getElementById('check-gender-answer-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() {
            document.getElementById('gender-answer-input').value = variation.answer;
            document.getElementById('gender-answer-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${variation.answer}</b>`;
        };
    }
    
    const pronounceButton = document.getElementById('pronounce-gender-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        if (variation.pronounceText) pronounceWord(variation.pronounceText, language); 
        pronounceButton.addEventListener('click', () => {
            if (variation.pronounceText) pronounceWord(variation.pronounceText, language);
        });
    }

    document.getElementById('check-gender-answer-btn-impl').onclick = async function() { 
        const userInput = document.getElementById('gender-answer-input').value.trim();
        let feedbackText = '';
        let isCorrect = false;
        if (!userInput) {
            feedbackText = `<span style="color:#e67e22;">${t.feedbackPleaseType || 'Please type your answer above.'}</span>`;
        } else {
            if (variation.type === 'article') { 
                if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
                    feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                    CosyAppInteractive.awardCorrectAnswer();
                    CosyAppInteractive.scheduleReview(language, 'gender', item.word, true);
                    isCorrect = true;
                } else {
                    feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${variation.answer}</b></span>`;
                    CosyAppInteractive.awardIncorrectAnswer();
                }
            } else { 
                const targetArticle = item.article; 
                const isValidWordForArticle = items.some(i => i.article.toLowerCase() === targetArticle.toLowerCase() && i.word.toLowerCase() === userInput.toLowerCase());
                if (isValidWordForArticle) {
                    feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                    CosyAppInteractive.awardCorrectAnswer();
                    CosyAppInteractive.scheduleReview(language, 'gender', item.word, true); // Assuming item.word is the relevant word here
                    isCorrect = true;
                } else {
                    feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${t.notValidForArticle || `Not a valid word for "${targetArticle}". The expected example was:`} <b>${variation.answer}</b>. ${t.otherWordsExist || 'Other valid words might exist.'}</span>`;
                    CosyAppInteractive.awardIncorrectAnswer();
                }
            }
        }
        document.getElementById('gender-answer-feedback').innerHTML = feedbackText;
        if(isCorrect){ 
             // setTimeout(() => { startGenderPractice(); }, 1200); // Auto-advance removed
        }
    };
    addEnterKeySupport('gender-answer-input', 'check-gender-answer-btn-impl');
}

async function showMatchArticlesWords() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const genderData = await loadGenderGrammar(language, days);
    if (!genderData || genderData.length < 2) { 
        showNoDataMessage();
        return;
    }

    let selectedItems = shuffleArray([...genderData]).slice(0, Math.min(genderData.length, 5)); 
    if (selectedItems.length < 2) {
        showNoDataMessage();
        return;
    }
     
    const displayArticles = selectedItems.map(item => item.article);
    const displayWords = selectedItems.map(item => item.word);
    const shuffledDisplayArticles = shuffleArray([...displayArticles]); 
    const shuffledDisplayWords = shuffleArray([...displayWords]);     

    resultArea.innerHTML = `
        <div class="match-articles-words-exercise exercise-container" role="region" aria-label="${t.aria?.matchArticlesWords || 'Match Articles and Words'}">
            <div class="match-container">
                <div class="match-col" id="articles-col" aria-label="${t.aria?.articlesColumn || 'Articles column'}">
                    ${shuffledDisplayArticles.map(article => `<div class="match-item" data-article="${article}" role="button" tabindex="0" aria-label="${t.aria?.articleAriaLabel || 'Article:'} ${article}">${article}</div>`).join('')}
                </div>
                <div class="match-col" id="words-col" aria-label="${t.aria?.wordsColumn || 'Words column'}">
                    ${shuffledDisplayWords.map(word => `<div class="match-item" data-word="${word}" role="button" tabindex="0" aria-label="${t.aria?.wordAriaLabel || 'Word:'} ${word}">${word}</div>`).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="btn-new-match-articles-words" class="btn-secondary" onclick="window.showMatchArticlesWords()">🔄 ${t.buttons?.newMatchArticlesWords || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.match-articles-words-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMatchArticles || "Look for common article-noun pairings. Some articles are only used with specific noun types."}`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('match-feedback');
            feedbackEl.innerHTML = t.showingCorrectMatches || 'Showing all correct matches...';
            selectedItems.forEach(pair => {
                const articleEl = this.querySelector(`.match-item[data-article="${pair.article}"]`);
                const wordEl = this.querySelector(`.match-item[data-word="${pair.word}"]`);
                // This is tricky if articles/words are not unique. Best effort:
                if (articleEl && wordEl && !articleEl.classList.contains('matched') && !wordEl.classList.contains('matched')) {
                     // Find the specific word element that corresponds if there are duplicate words/articles in columns
                    const targetWordEl = Array.from(this.querySelectorAll('#words-col .match-item')).find(el => el.dataset.word === pair.word && !el.classList.contains('matched'));
                    const targetArticleEl = Array.from(this.querySelectorAll('#articles-col .match-item')).find(el => el.dataset.article === pair.article && !el.classList.contains('matched'));
                    if(targetWordEl) targetWordEl.classList.add('revealed-match');
                    if(targetArticleEl) targetArticleEl.classList.add('revealed-match');
                }
            });
        };
    }
    
    let selectedArticleEl = null, selectedWordEl = null;
    let matchedPairs = 0;

    document.querySelectorAll('#articles-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.classList.contains('revealed-match')) return;
            if (selectedArticleEl) selectedArticleEl.classList.remove('selected');
            this.classList.add('selected');
            selectedArticleEl = this;
            checkMatchAttempt();
        });
    });
    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.classList.contains('revealed-match')) return;
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
                    // setTimeout(() => showMatchArticlesWords(), 2000); // Auto-advance removed
                }
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                selectedArticleEl.classList.remove('selected'); // Allow re-selection
                selectedWordEl.classList.remove('selected');
            }
            selectedArticleEl = null; // Reset for next attempt
            selectedWordEl = null;
        }
    }
}

async function showSelectArticleExercise() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const NUM_ARTICLE_OPTIONS = 4; 

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const items = await loadGenderGrammar(language, days);
    if (!items || !items.length) { showNoDataMessage(); return; }

    const selectedItem = items[Math.floor(Math.random() * items.length)];
    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;
    
    let allArticlesForLang = [];
    if (ARTICLE_CATEGORIES && ARTICLE_CATEGORIES[language]) { allArticlesForLang = Object.keys(ARTICLE_CATEGORIES[language]); } 
    else if (language === 'COSYenglish') { allArticlesForLang = ['a', 'an', 'the'];} // Simplified for English example
    else { const uniqueArticles = new Set(items.map(i => i.article)); allArticlesForLang = Array.from(uniqueArticles); }

    let articleOptions = [correctArticle];
    let distractorArticles = shuffleArray(allArticlesForLang.filter(a => a && a.toLowerCase() !== correctArticle.toLowerCase()));
    
    for(let i=0; articleOptions.length < NUM_ARTICLE_OPTIONS && i < distractorArticles.length; i++){
        if (distractorArticles[i]) articleOptions.push(distractorArticles[i]);
    }
    articleOptions = shuffleArray(articleOptions.filter(a => a)); // Ensure no undefined options and shuffle
    
    if (articleOptions.length < 2) { 
        resultArea.innerHTML = `<p>${t.notEnoughOptionsError || 'Not enough article options to create this exercise for'} "${wordToShow}".</p> <button onclick="startGenderPractice()">Try another</button>`;
        return; 
    }
    
    resultArea.innerHTML = `
        <div class="select-article-exercise exercise-container" role="form" aria-label="${t.aria?.selectArticleExercise || 'Select the Article Exercise'}">
            <div class="exercise-prompt" aria-label="${wordToShow}">${t.selectCorrectArticleFor || "Select the correct article for:"} <strong>${wordToShow}</strong></div>
            <button id="pronounce-select-article-word" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <div class="article-options-container">
                ${articleOptions.map(article => `
                    <button class="article-option-btn btn-secondary" data-article="${article}" aria-label="${article}">
                        ${article}
                    </button>
                `).join('')}
            </div>
            <div id="select-article-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="btn-new-select-article" class="btn-secondary" onclick="window.showSelectArticleExercise()">🔄 ${t.buttons?.newSelectArticle || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.select-article-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintSelectArticle || "Consider the gender and number of the noun"} '${selectedItem.word}'. ${t.articleOptionsAre || "The correct article is one of:"} ${articleOptions.join(', ')}.`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.revealAnswer = function() {
            const correctBtn = this.querySelector(`.article-option-btn[data-article="${correctArticle}"]`);
            if(correctBtn) correctBtn.classList.add('revealed-correct');
            document.getElementById('select-article-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${correctArticle}</b>`;
        };
    }

    const pronounceButton = document.getElementById('pronounce-select-article-word');
     if (pronounceButton && typeof pronounceWord === 'function') {
        if(wordToShow) pronounceWord(wordToShow, language); 
        pronounceButton.addEventListener('click', () => { if(wordToShow) pronounceWord(wordToShow, language) });
     }

    document.querySelectorAll('.article-option-btn').forEach(btn => {
        btn.onclick = function() {
            const userAnswer = this.dataset.article;
            const feedbackEl = document.getElementById('select-article-feedback');
            document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true); 

            if (userAnswer.toLowerCase() === correctArticle.toLowerCase()) {
                this.classList.add('correct-selection');
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(language, 'gender-select', {word: wordToShow, article: correctArticle}, true);
            } else {
                this.classList.add('incorrect-selection');
                const correctBtn = document.querySelector(`.article-option-btn[data-article="${correctArticle}"]`);
                if(correctBtn) correctBtn.classList.add('correct-selection'); // Highlight correct one
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctArticle}</b></span>`;
                CosyAppInteractive.awardIncorrectAnswer();
                CosyAppInteractive.scheduleReview(language, 'gender-select', {word: wordToShow, article: correctArticle}, false);
            }
            // setTimeout(() => showSelectArticleExercise(), 1500); // Auto-advance removed
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
        await showTypeVerb(); // Fallback
    }
}

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const items = await loadVerbGrammar(language, days);
    if (!items || !items.length) { showNoDataMessage(); return; }
    const item = items[Math.floor(Math.random() * items.length)];
    
    const variations = [
        { type: 'infinitive', promptText: item.prompt, pronounceText: item.prompt, answer: item.infinitive }, 
        { type: 'conjugated', promptText: `${item.infinitive} (${item.prompt})`, pronounceText: item.infinitive, answer: item.answer } 
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const correctAnswer = variation.answer;

    resultArea.innerHTML = `
        <div class="verb-exercise exercise-container" aria-label="${t.verbExerciseAriaLabel || 'Verb Exercise'}">
            <div class="verb-prompt">${variation.promptText}</div>
            <button id="pronounce-verb-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="verb-answer-input" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}" class="exercise-input">
            <button id="check-verb-answer-btn-impl" class="btn-primary">${t.buttons?.check || 'Check'}</button>
            <div id="verb-answer-feedback" class="exercise-feedback"></div>
            <button id="btn-new-type-verb" class="btn-secondary" onclick="window.showTypeVerb()">🔄 ${t.buttons?.newTypeVerb || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.verb-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintVerbConjugation || "Focus on the tense and the subject/pronoun. The infinitive is"} '${item.infinitive}' ${t.andPromptIs || "and prompt is related to"} '${item.prompt}'.`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = () => document.getElementById('check-verb-answer-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() {
            document.getElementById('verb-answer-input').value = correctAnswer;
            document.getElementById('verb-answer-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${correctAnswer}</b>`;
        };
    }

    const pronounceVerbButton = document.getElementById('pronounce-verb-item');
    if (pronounceVerbButton && typeof pronounceWord === 'function') {
         if(variation.pronounceText) pronounceWord(variation.pronounceText, language);
         pronounceVerbButton.addEventListener('click', () => {
            if(variation.pronounceText) pronounceWord(variation.pronounceText, language);
        });
    }

    document.getElementById('check-verb-answer-btn-impl').onclick = function() {
        const userAnswer = document.getElementById('verb-answer-input').value.trim();
        const feedbackEl = document.getElementById('verb-answer-feedback');
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
            CosyAppInteractive.awardCorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'verb-conjugation', {infinitive: item.infinitive, prompt: item.prompt, answer: correctAnswer}, true);
        } else {
            feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctAnswer}</b></span>`;
            CosyAppInteractive.awardIncorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'verb-conjugation', {infinitive: item.infinitive, prompt: item.prompt, answer: correctAnswer}, false);
        }
        // setTimeout(() => showTypeVerb(), 1200); // Auto-advance removed
    };
    addEnterKeySupport('verb-answer-input', 'check-verb-answer-btn-impl');
}

async function showMatchVerbsPronouns() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbItems = await loadVerbGrammar(language, days); 
    if (!verbItems || verbItems.length < 2) { showNoDataMessage(); return; }

    const suitableItems = verbItems.filter(item => typeof item.prompt !== 'undefined' && typeof item.answer !== 'undefined' && item.prompt.trim() !== '' && item.answer.trim() !== '');
    if (suitableItems.length < 2) { showNoDataMessage(); return; }

    const itemsForGame = shuffleArray(suitableItems).slice(0, Math.min(suitableItems.length, 5));
    const prompts = itemsForGame.map(item => item.prompt); 
    const answersToMatch = itemsForGame.map(item => item.answer); 
    
    const shuffledPrompts = shuffleArray([...prompts]);
    const shuffledAnswers = shuffleArray([...answersToMatch]);

    resultArea.innerHTML = `
        <div class="match-verbs-pronouns-exercise exercise-container">
            <div class="match-container">
                <div class="match-col" id="prompts-col">${shuffledPrompts.map(p => `<div class="match-item" data-prompt="${p}" role="button" tabindex="0">${p}</div>`).join('')}</div>
                <div class="match-col" id="answers-col">${shuffledAnswers.map(a => `<div class="match-item" data-answer="${a}" role="button" tabindex="0">${a}</div>`).join('')}</div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="btn-new-match-verbs-pronouns" class="btn-secondary" onclick="window.showMatchVerbsPronouns()">🔄 ${t.buttons?.newMatchVerbsPronouns || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.match-verbs-pronouns-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMatchPronouns || "Match pronouns/subjects to their correct verb conjugations."}`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.revealAnswer = function() {
             const feedbackEl = document.getElementById('match-feedback');
            feedbackEl.innerHTML = t.showingCorrectMatches || 'Showing all correct matches...';
            itemsForGame.forEach(pair => {
                const promptEl = this.querySelector(`.match-item[data-prompt="${pair.prompt}"]`);
                const answerEl = this.querySelector(`.match-item[data-answer="${pair.answer}"]`);
                if (promptEl && answerEl && !promptEl.classList.contains('matched') && !answerEl.classList.contains('matched')) {
                    promptEl.classList.add('revealed-match');
                    answerEl.classList.add('revealed-match');
                }
            });
        };
    }
    
    let selectedPromptEl = null, selectedAnswerEl = null;
    let matchedPairsCount = 0;

    document.querySelectorAll('#prompts-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')|| this.classList.contains('revealed-match')) return;
            if (selectedPromptEl) selectedPromptEl.classList.remove('selected');
            this.classList.add('selected');
            selectedPromptEl = this;
            checkVerbPronounMatchAttempt();
        });
    });
    document.querySelectorAll('#answers-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.classList.contains('revealed-match')) return;
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
                    // setTimeout(() => showMatchVerbsPronouns(), 2000); // Auto-advance removed
                }
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
            }
            selectedPromptEl.classList.remove('selected'); 
            selectedAnswerEl.classList.remove('selected');
            selectedPromptEl = null; 
            selectedAnswerEl = null;
        }
    }
}

async function showFillGaps() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbData = await loadVerbGrammar(language, days);
    if (!verbData || !verbData.length) { showNoDataMessage(); return; }
    
    let verbItem = null;
    let sentence = "";
    let correctAnswer = "";
    // Find a suitable item
    for (let i = 0; i < verbData.length; i++) {
        const tempItem = verbData[Math.floor(Math.random() * verbData.length)];
        if (tempItem.example && tempItem.example.sentence && tempItem.example.sentence.includes("___") && tempItem.example.correct_form) {
            verbItem = tempItem;
            sentence = verbItem.example.sentence;
            correctAnswer = verbItem.example.correct_form;
            break;
        }
    }

    if (!verbItem) {
        showNoDataMessage(); 
        return;
    }
    
    resultArea.innerHTML = `
        <div class="fill-gap-exercise exercise-container">
            <div class="sentence-with-gap">${sentence.replace('___', '<input type="text" id="gap-answer" class="exercise-input" placeholder="'+ (t.typeYourAnswerPlaceholder || 'Type your answer...') +'">')}</div>
            <button id="check-gap-impl" class="btn-primary">${t.buttons?.check || 'Check'}</button>
            <div id="gap-feedback" class="exercise-feedback"></div>
            <button id="btn-new-fill-gaps" class="btn-secondary" onclick="window.showFillGaps()">🔄 ${t.buttons?.newFillGaps || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.fill-gap-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            const infinitive = verbItem.infinitive || (t.relatedVerb || "related verb");
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintFillGap || "Identify the subject and tense required for the verb. The base verb is related to items like"} '${infinitive}'.`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = () => document.getElementById('check-gap-impl')?.click();
        exerciseContainer.revealAnswer = function() {
            document.getElementById('gap-answer').value = correctAnswer;
            document.getElementById('gap-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${correctAnswer}</b>`;
        };
    }
    
    const gapAnswerInput = document.getElementById('gap-answer'); 
    document.getElementById('check-gap-impl').addEventListener('click', () => {
        const userAnswer = gapAnswerInput.value.trim();
        const feedbackEl = document.getElementById('gap-feedback');
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
            CosyAppInteractive.awardCorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'fill-gap', {sentence, correctAnswer}, true);
        } else {
            feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctAnswer}</b></span>`;
            CosyAppInteractive.awardIncorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'fill-gap', {sentence, correctAnswer}, false);
        }
        // setTimeout(() => showFillGaps(), 1500); // Auto-advance removed
    });
    if(gapAnswerInput) addEnterKeySupport('gap-answer', 'check-gap-impl');
}

async function showWordOrder() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

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
        <div class="word-order-exercise exercise-container">
            <div class="word-pool clickable" id="word-order-pool">${shuffledParts.map(part => `<div class="word-tile" data-word="${part}">${part}</div>`).join('')}</div>
            <div class="sentence-slots clickable" id="word-order-slots">${Array(sentenceParts.length).fill('<div class="word-slot"></div>').join('')}</div>
            <div id="order-feedback" class="exercise-feedback"></div>
            <div class="order-actions">
                <button id="check-order-impl" class="btn-primary">${t.buttons?.check || 'Check'}</button>
                <button id="reset-order" class="btn-secondary">${t.buttons?.reset || 'Reset'}</button>
            </div>
            <button id="btn-new-word-order" class="btn-secondary" onclick="window.showWordOrder()">🔄 ${t.buttons?.newWordOrder || t.buttons?.newExerciseSameType || 'New Similar Exercise'}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.word-order-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWordOrder || "Typical sentence structure is Subject-Verb-Object. Questions or negative sentences might alter this."}`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = () => document.getElementById('check-order-impl')?.click();
        exerciseContainer.revealAnswer = function() {
            const slots = this.querySelectorAll('#word-order-slots .word-slot');
            slots.forEach((slot, index) => {
                slot.innerHTML = `<div class="word-tile revealed">${sentenceParts[index]}</div>`;
            });
            document.getElementById('order-feedback').innerHTML = `${t.correctOrderIs || "The correct order is:"} <b>${sentenceParts.join(" ")}</b>`;
        };
    }

    const wordPool = document.getElementById('word-order-pool');
    const sentenceSlotsContainer = document.getElementById('word-order-slots');

    wordPool.querySelectorAll('.word-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const firstEmptySlot = sentenceSlotsContainer.querySelector('.word-slot:empty');
            if (firstEmptySlot) {
                firstEmptySlot.appendChild(tile);
            }
        });
    });

    sentenceSlotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('word-tile')) {
            wordPool.appendChild(e.target); 
        } else if (e.target.classList.contains('word-slot') && e.target.firstChild) {
             wordPool.appendChild(e.target.firstChild);
        }
    });
    
    document.getElementById('check-order-impl').addEventListener('click', () => {
        const orderedWords = Array.from(sentenceSlotsContainer.querySelectorAll('.word-tile')).map(tile => tile.dataset.word);
        const feedbackEl = document.getElementById('order-feedback');
        if (orderedWords.join(' ') === sentenceParts.join(' ')) {
            feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
            CosyAppInteractive.awardCorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'word-order', {parts: sentenceParts, sentence: originalSentence}, true);
            // setTimeout(() => showWordOrder(), 1500); // Auto-advance removed
        } else {
            feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteTryAgain || 'Not quite. Try again!'}</span> (${t.yourOrder || "Your order:"} ${orderedWords.join(' ')})`;
            CosyAppInteractive.awardIncorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'word-order', {parts: sentenceParts, sentence: originalSentence}, false);
        }
    });

    document.getElementById('reset-order').addEventListener('click', () => {
        sentenceSlotsContainer.querySelectorAll('.word-tile').forEach(tile => {
            wordPool.appendChild(tile);
        });
        const tilesInPool = Array.from(wordPool.querySelectorAll('.word-tile'));
        tilesInPool.sort(() => Math.random() - 0.5).forEach(tile => wordPool.appendChild(tile)); // Re-shuffle pool
        document.getElementById('order-feedback').innerHTML = '';
    });
}

// Placeholder for functions that might be defined elsewhere or are not part of this refactor pass
// function getPronounsForLanguage(language) { /* ... */ }
// function getRandomPronounForLanguage(language) { /* ... */ }
// function conjugateVerb(verb, pronoun, language) { /* ... */ }
// function getNegativeElement(pronoun, language) { /* ... */ }
// function getQuestionElement(pronoun, language) { /* ... */ }
// async function getRandomObject(language, days) { /* ... */ }
// function getRandomTimeExpression(language) { /* ... */ }
// async function startPossessivesPractice() { } // If possessives were to be added back
// async function showTypePossessive() { }
// async function showMatchPossessives() { }

// This function is used by patchExerciseWithExtraButtons as the category randomizer
async function practiceAllGrammar() { 
    await startRandomGrammarPractice();
}

// Make functions available on window object for onclick attributes and patching
window.startGenderPractice = startGenderPractice;
window.showArticleWord = showArticleWord;
window.showMatchArticlesWords = showMatchArticlesWords;
window.showSelectArticleExercise = showSelectArticleExercise;
window.startVerbsPractice = startVerbsPractice;
window.showTypeVerb = showTypeVerb;
window.showMatchVerbsPronouns = showMatchVerbsPronouns;
window.showFillGaps = showFillGaps;
window.showWordOrder = showWordOrder;
window.startRandomGrammarPractice = startRandomGrammarPractice; // Ensure this is on window for patcher
window.practiceAllGrammar = practiceAllGrammar;


// Patching exercise functions
window.showArticleWord = patchExerciseWithExtraButtons(window.showArticleWord, '.gender-exercise', window.startGenderPractice, {});
window.showMatchArticlesWords = patchExerciseWithExtraButtons(window.showMatchArticlesWords, '.match-articles-words-exercise', window.startGenderPractice, { noCheck: true });
window.showSelectArticleExercise = patchExerciseWithExtraButtons(window.showSelectArticleExercise, '.select-article-exercise', window.startGenderPractice, { noCheck: true });
window.showTypeVerb = patchExerciseWithExtraButtons(window.showTypeVerb, '.verb-exercise', window.startVerbsPractice, {});
window.showMatchVerbsPronouns = patchExerciseWithExtraButtons(window.showMatchVerbsPronouns, '.match-verbs-pronouns-exercise', window.startVerbsPractice, { noCheck: true });
window.showFillGaps = patchExerciseWithExtraButtons(window.showFillGaps, '.fill-gap-exercise', window.startVerbsPractice, {});
window.showWordOrder = patchExerciseWithExtraButtons(window.showWordOrder, '.word-order-exercise', window.startVerbsPractice, {});

document.addEventListener('DOMContentLoaded', initGrammarPractice);
