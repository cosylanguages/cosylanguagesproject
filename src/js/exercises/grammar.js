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
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    let wordForExercise = null;
    let articleForExercise = null;
    let currentWordSet = null; // To store the {word, article} pair for scheduling

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'grammar-article', 1);
        if (reviewItems && reviewItems.length > 0) {
            const reviewWord = reviewItems[0].itemValue; // This is the word string
            // Need to load grammar data to find the article for this review word
            // We assume 'days' is appropriate context; if not, load all grammar data for the language
            const grammarDataForReview = await loadGenderGrammar(language, days); 
            const foundItem = grammarDataForReview.find(item => item.word === reviewWord);

            if (foundItem) {
                wordForExercise = foundItem.word;
                articleForExercise = foundItem.article;
                currentWordSet = { word: wordForExercise, article: articleForExercise }; // Store the pair
                console.log("Using review item for showArticleWord:", currentWordSet);
            } else {
                console.error("Review item word found, but its details (article) not in current grammar load for days:", days, "word:", reviewWord);
                // Fall through to select a new word if article lookup fails
            }
        }
    }

    if (!wordForExercise) { // No review item, or review item lookup failed
        const items = await loadGenderGrammar(language, days);
        if (!items.length) {
            showNoDataMessage();
            return;
        }
        const randomItem = items[Math.floor(Math.random() * items.length)];
        wordForExercise = randomItem.word;
        articleForExercise = randomItem.article;
        currentWordSet = { word: wordForExercise, article: articleForExercise }; // Store the pair
        console.log("Using new item for showArticleWord:", currentWordSet);
    }
    
    // Ensure we have a word and article before proceeding
    if (!wordForExercise || !articleForExercise) {
        console.error("Failed to select a word or article for the exercise.");
        showNoDataMessage();
        return;
    }

    const variations = [
        { type: 'article', question: `"${wordForExercise}"`, answer: articleForExercise }, 
        { type: 'word', question: `"${articleForExercise}"`, answer: wordForExercise }    
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
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.gender-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.checkNounEnding || "Check the noun's ending or typical gender patterns for this language. The word is"} '${wordForExercise}'.`;
            exerciseContainer.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = async function() {
            const userInput = document.getElementById('gender-answer-input').value.trim();
            let feedbackText = '';
            let isCorrect = false;
            const currentLanguage = document.getElementById('language').value; // Ensure we use current language
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            
            if (!userInput) {
                feedbackText = `<span style="color:#e67e22;">${currentT.feedbackPleaseType || 'Please type your answer above.'}</span>`;
            } else {
                 if (variation.type === 'article') { 
                    if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
                        feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                        if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardCorrectAnswer();
                        isCorrect = true;
                    } else {
                        feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${variation.answer}</b></span>`;
                        if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardIncorrectAnswer();
                    }
                } else { // variation.type === 'word'
                    // For "type the word" variation, the primary item being learned is the word-article pair, identified by the word.
                    // We check if the user typed the correct word for the displayed article.
                    if (userInput.toLowerCase() === variation.answer.toLowerCase()) { // variation.answer is wordForExercise
                        feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                         if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardCorrectAnswer();
                        isCorrect = true;
                    } else {
                        // Even if other words might fit the article, for this specific exercise, the target is `wordForExercise`.
                        feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${variation.answer}</b>.</span>`;
                        if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardIncorrectAnswer();
                    }
                }
            }
            document.getElementById('gender-answer-feedback').innerHTML = feedbackText;

            // Schedule review using wordForExercise as the item's value identifier
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && wordForExercise) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', wordForExercise, isCorrect);
            }

            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if(isCorrect){ 
                 setTimeout(() => { startGenderPractice(); }, 1200);
            }
        };
        exerciseContainer.revealAnswer = function() {
            const currentLanguage = document.getElementById('language').value;
            const t_reveal = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            const feedbackEl = document.getElementById('gender-answer-feedback');
            const answerInputEl = document.getElementById('gender-answer-input');
            
            if (variation && variation.answer) {
                if (answerInputEl) answerInputEl.value = variation.answer;
                if (feedbackEl) {
                    feedbackEl.innerHTML = `${t_reveal.correctAnswerIs || "The correct answer is:"} <b>${variation.answer}</b>`;
                    feedbackEl.className = 'exercise-feedback correct'; 
                }
                if (answerInputEl) answerInputEl.disabled = true;
                
                const optionButtons = exerciseContainer.querySelectorAll('.article-option-btn'); 
                optionButtons.forEach(btn => btn.disabled = true);

            } else {
                if (feedbackEl) feedbackEl.innerHTML = t_reveal.errors?.revealNotPossible || "Cannot reveal answer for this item.";
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    
    const pronounceButton = document.getElementById('pronounce-gender-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const wordToPronounce = variation.type === 'article' ? wordForExercise : articleForExercise;
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
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const genderData = await loadGenderGrammar(language, days);
    if (!genderData || genderData.length < 2) { 
        showNoDataMessage(); // This will call refreshLatinization
        return;
    }

    let selectedItems = shuffleArray([...genderData]).slice(0, Math.min(genderData.length, 5)); 
    if (selectedItems.length < 2) {
        showNoDataMessage(); // This will call refreshLatinization
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
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.match-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMatchArticles || "Look for common article-noun pairings. Some articles are only used with specific noun types."}`;
            exerciseContainer.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    
    let selectedArticleEl = null, selectedWordEl = null;
    let matchedPairs = 0;

    document.querySelectorAll('#articles-col .match-item').forEach(item => { /* ... */ }); // Content omitted for brevity
    document.querySelectorAll('#words-col .match-item').forEach(item => { /* ... */ }); // Content omitted for brevity

    function checkMatchAttempt() { // Placeholder for full logic
        if (selectedArticleEl && selectedWordEl) {
            const article = selectedArticleEl.dataset.article;
            const word = selectedWordEl.dataset.word;
            const correctPair = selectedItems.find(item => item.word === word && item.article === article);
            const feedbackEl = document.getElementById('match-feedback');
            const currentLanguage = document.getElementById('language').value;
            let isCorrect = false;

            if (correctPair) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct match!'}</span>`;
                // ... (disable matched items, etc.)
                isCorrect = true;
                matchedPairs++;
                 if (matchedPairs === selectedItems.length) {
                    feedbackEl.innerHTML += `<br><span class="correct">${t.allPairsMatched || 'All pairs matched! Great job!'}</span>`;
                }
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
                // ... (deselect items)
                isCorrect = false;
            }
            // Schedule review for the word involved in the match attempt
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && word) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', word, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
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
    if (!items.length) { showNoDataMessage(); return; } // Calls refresh

    const selectedItem = items[Math.floor(Math.random() * items.length)];
    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;
    
    // ... (article options logic, ensure it's not empty) ...
    let allArticlesForLang = [...new Set(items.map(item => item.article))];
    let articleOptions = [correctArticle];
    allArticlesForLang = allArticlesForLang.filter(art => art !== correctArticle);
    shuffleArray(allArticlesForLang);
    for (let i = 0; i < Math.min(NUM_ARTICLE_OPTIONS - 1, allArticlesForLang.length); i++) {
        articleOptions.push(allArticlesForLang[i]);
    }
    articleOptions = shuffleArray(articleOptions);
    
    if (allArticlesForLang.length < 1 && articleOptions.length < 2 && correctArticle) { // Need at least one distractor if possible
         // If only one article exists for the language, or not enough to make meaningful choice,
        // it might be better to skip or show a message. For now, proceed if at least correctArticle is there.
        if (articleOptions.length < 1 && correctArticle) articleOptions = [correctArticle]; // Ensure at least the correct one if logic failed
        else if (articleOptions.length < 1) {
             resultArea.innerHTML = `<p>${t.notEnoughOptionsError || 'Not enough article options to create this exercise.'}</p>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            return;
        }
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
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.select-article-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }

    // ... (pronounce button logic) ...
    const pronounceButton = document.getElementById('pronounce-select-article-word');
    if (pronounceButton && typeof pronounceWord === 'function') {
        pronounceWord(wordToShow, language); // Auto-pronounce
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
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctArticle}</b></span>`;
                isCorrect = false;
            }
            // Schedule review for the word
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && wordToShow) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', wordToShow, isCorrect);
            }
            document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true); // Disable all options
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            // ...
        };
    });
}

async function startVerbsPractice() { 
    // ...
}

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const items = await loadVerbGrammar(language, days);
    if (!items.length) { showNoDataMessage(); return; } // Calls refresh
    // ... (variation logic, ensure itemForExercise and correctAnswer are set) ...
    const itemForExercise = items[Math.floor(Math.random() * items.length)];
    const variation = { promptText: `${itemForExercise.pronoun} ( ${itemForExercise.verb} )`, answer: itemForExercise.form }; // Example variation
    const correctAnswer = variation.answer;


    resultArea.innerHTML = `
        <div class="verb-exercise" aria-label="${t.verbExerciseAriaLabel || 'Verb Exercise'}">
            <div class="verb-prompt">${variation.promptText}</div>
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
        exerciseContainer.showHint = () => { /* ... */ 
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
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctAnswer}</b></span>`;
                isCorrect = false;
            }
            // Item value for verbs could be verb infinitive + pronoun, or just infinitive.
            // Let's use infinitive for simplicity in review item key.
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && itemForExercise.verb) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-verb', itemForExercise.verb, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            // ...
        };
    }
    // ... (pronounce button logic) ...
    const pronounceButton = document.getElementById('pronounce-verb-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const textToPronounce = `${itemForExercise.pronoun} ${itemForExercise.form}`; // Pronounce the full correct form with pronoun
        pronounceWord(textToPronounce, language); // Auto-pronounce
        pronounceButton.addEventListener('click', () => pronounceWord(textToPronounce, language));
    }
}

async function showMatchVerbsPronouns() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbItems = await loadVerbGrammar(language, days); 
    if (!verbItems || verbItems.length < 2) { showNoDataMessage(); return; } // Calls refresh

    // ... (item selection logic, ensure itemsForGame, shuffledPrompts, shuffledAnswers are set) ...
    const itemsForGame = shuffleArray(verbItems).slice(0, Math.min(verbItems.length, 5));
    if (itemsForGame.length < 2) { showNoDataMessage(); return; }
    const prompts = itemsForGame.map(item => `${item.pronoun} (${item.verb})`);
    const answers = itemsForGame.map(item => item.form);
    const shuffledPrompts = shuffleArray([...prompts]);
    const shuffledAnswers = shuffleArray([...answers]);


    resultArea.innerHTML = `
        <div class="match-exercise">
            <div class="match-container">
                <div class="match-col" id="prompts-col">${shuffledPrompts.map(p => `<div class="match-item" data-prompt="${p}" role="button" tabindex="0">${p}</div>`).join('')}</div>
                <div class="match-col" id="answers-col">${shuffledAnswers.map(a => `<div class="match-item" data-answer="${a}" role="button" tabindex="0">${a}</div>`).join('')}</div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.match-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    
    // ... (event listeners) ...
    let selectedPromptEl = null, selectedAnswerEl = null, matchedPairsCount = 0;
    // Simplified event listeners
    document.querySelectorAll('#prompts-col .match-item').forEach(item => item.addEventListener('click', function() {
        if(this.classList.contains('matched')) return;
        if(selectedPromptEl) selectedPromptEl.classList.remove('selected');
        this.classList.add('selected');
        selectedPromptEl = this;
        if(selectedAnswerEl) checkVerbPronounMatchAttempt();
    }));
     document.querySelectorAll('#answers-col .match-item').forEach(item => item.addEventListener('click', function() {
        if(this.classList.contains('matched')) return;
        if(selectedAnswerEl) selectedAnswerEl.classList.remove('selected');
        this.classList.add('selected');
        selectedAnswerEl = this;
        if(selectedPromptEl) checkVerbPronounMatchAttempt();
    }));


    function checkVerbPronounMatchAttempt() {
        if (selectedPromptEl && selectedAnswerEl) {
            const promptText = selectedPromptEl.dataset.prompt; // e.g., "I (be)"
            const answerText = selectedAnswerEl.dataset.answer; // e.g., "am"
            const feedbackEl = document.getElementById('match-feedback');
            const currentLanguage = document.getElementById('language').value;

            const correctItem = itemsForGame.find(item => `${item.pronoun} (${item.verb})` === promptText && item.form === answerText);
            let isCorrect = false;

            if (correctItem) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct match!'}</span>`;
                selectedPromptEl.classList.add('matched', 'disabled');
                selectedAnswerEl.classList.add('matched', 'disabled');
                matchedPairsCount++;
                isCorrect = true;
                if (matchedPairsCount === itemsForGame.length) {
                    feedbackEl.innerHTML += `<br><span class="correct">${t.allPairsMatched || 'All pairs matched! Great job!'}</span>`;
                }
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
                selectedPromptEl.classList.remove('selected');
                selectedAnswerEl.classList.remove('selected');
                isCorrect = false;
            }
            
            // Schedule review for the verb infinitive from the prompt
            const verbInfinitive = promptText.substring(promptText.indexOf('(') + 1, promptText.indexOf(')'));
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && verbInfinitive) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-verb', verbInfinitive, isCorrect);
            }
            
            selectedPromptEl = null;
            selectedAnswerEl = null;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
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
    if (!verbData.length) { showNoDataMessage(); return; } // Calls refresh
    
    // ... (suitable item logic, ensure suitableItem, sentence, correctAnswer are set) ...
    const suitableItem = verbData.find(item => item.sentence && item.sentence.includes('___') && item.form); // Simplified
    if (!suitableItem) { showNoDataMessage(); return; }
    const sentence = suitableItem.sentence;
    const correctAnswer = suitableItem.form;


    resultArea.innerHTML = `
        <div class="fill-gap-exercise">
            <div class="sentence-with-gap">${sentence.replace('___', '<input type="text" id="gap-answer" class="exercise-input" placeholder="'+ (t.typeYourAnswerPlaceholder || 'Type your answer...') +'">')}</div>
            <div id="gap-feedback" class="exercise-feedback"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.fill-gap-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('gap-answer').value.trim();
            const feedbackEl = document.getElementById('gap-feedback');
            const currentLanguage = document.getElementById('language').value;
            let isCorrect = false;
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                isCorrect = true;
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${correctAnswer}</b></span>`;
                isCorrect = false;
            }
            // Use verb infinitive for review item key
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && suitableItem.verb) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-verb', suitableItem.verb, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}

async function showWordOrder() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbData = await loadVerbGrammar(language, days);
    if (!verbData || verbData.length === 0) { showNoDataMessage(); return; } // Calls refresh
    
    // ... (sentence parts logic, ensure sentenceParts, shuffledParts, foundSuitableSentence are set) ...
    let sentenceParts = [], shuffledParts = [], foundSuitableSentence = false;
    const suitableItem = verbData.find(item => item.sentence && !item.sentence.includes('___') && item.sentence.split(' ').length > 2);
    if (suitableItem) {
        sentenceParts = suitableItem.sentence.split(' ');
        shuffledParts = shuffleArray([...sentenceParts]);
        foundSuitableSentence = true;
    }
    if (!foundSuitableSentence) { showNoDataMessage(); return; }
    
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
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.word-order-exercise');
    const sentenceSlots = document.getElementById('sentence-slots'); 

    if (exerciseContainer) {
        exerciseContainer.showHint = () => { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const feedbackEl = document.getElementById('order-feedback');
            const orderedWords = Array.from(sentenceSlots.querySelectorAll('.word-tile')).map(tile => tile.dataset.word);
            const currentLanguage = document.getElementById('language').value;
            let isCorrect = false;

            if (orderedWords.join(' ') === sentenceParts.join(' ')) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                isCorrect = true;
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteTryAgain || 'Not quite. Try again!'}</span>`;
                isCorrect = false;
            }
            // Use the main verb of the sentence or the whole sentence as itemValue for review.
            // For simplicity, let's assume `suitableItem.verb` exists and is the main verb.
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && suitableItem.verb) {
                CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-sentence-structure', suitableItem.verb, isCorrect); // itemType could be more specific
            } else if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview) { // Fallback if verb isn't clearly defined
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-sentence-structure', sentenceParts.join(' ').substring(0, 30), isCorrect); // Use part of sentence as key
            }

            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }

    // ... (event listeners for word pool and slots) ...
    document.getElementById('word-pool').addEventListener('click', /* simplified */ function(e) { /* ... */ });
    sentenceSlots.addEventListener('click', /* simplified */ function(e) { /* ... */ });
    
    document.getElementById('reset-order').addEventListener('click', () => {
        // ... (reset logic) ...
        document.getElementById('order-feedback').innerHTML = '';
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    });
}

// ... (other functions like getPronounsForLanguage, etc.) ...

async function practiceAllGrammar() { 
    const allGrammarExercises = Object.values(GRAMMAR_PRACTICE_TYPES).flatMap(type => type.exercises);
    if (allGrammarExercises.length === 0) {
        showNoDataMessage(); // Calls refreshLatinization
        return;
    }
    const randomExerciseName = allGrammarExercises[Math.floor(Math.random() * allGrammarExercises.length)];
    if (typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName](); // The called function will handle its own refreshLatinization
    } else {
        console.error(`Function ${randomExerciseName} not found for Practice All Grammar.`);
        // Potentially show an error message in resultArea and refresh
        const resultArea = document.getElementById('result');
        if (resultArea) {
            const t_all = (window.translations && window.translations[document.getElementById('language').value]) || (window.translations && window.translations.COSYenglish) || {};
            resultArea.innerHTML = `<p class="error-message">${t_all.errorGeneric || "An error occurred."}</p>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        }
    }
}

showArticleWord = patchExerciseWithExtraButtons(showArticleWord, '.gender-exercise', startGenderPractice, { newExercise: { fn: startGenderPractice, textKey: 'newExercise' } })
showMatchArticlesWords = patchExerciseWithExtraButtons(showMatchArticlesWords, '.match-exercise', startGenderPractice, { noCheck: true, newExercise: { fn: startGenderPractice, textKey: 'newExercise' } })
showSelectArticleExercise = patchExerciseWithExtraButtons(showSelectArticleExercise, '.select-article-exercise', startGenderPractice, { noCheck: true, newExercise: { fn: startGenderPractice, textKey: 'newExercise' } })
showTypeVerb = patchExerciseWithExtraButtons(showTypeVerb, '.verb-exercise', startVerbsPractice, { newExercise: { fn: startVerbsPractice, textKey: 'newExercise' } })
showMatchVerbsPronouns = patchExerciseWithExtraButtons(showMatchVerbsPronouns, '.match-exercise', startVerbsPractice, { noCheck: true, newExercise: { fn: startVerbsPractice, textKey: 'newExercise' } })
showFillGaps = patchExerciseWithExtraButtons(showFillGaps, '.fill-gap-exercise', startVerbsPractice, { newExercise: { fn: startVerbsPractice, textKey: 'newExercise' } })
showWordOrder = patchExerciseWithExtraButtons(showWordOrder, '.word-order-exercise', startVerbsPractice, { newExercise: { fn: startVerbsPractice, textKey: 'newExercise' } })

document.addEventListener('DOMContentLoaded', initGrammarPractice);
