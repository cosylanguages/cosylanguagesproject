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
    return data && data[day] ? data[day] : [];
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
    const vocabData = loadResult.data; // Renamed from 'data' to 'vocabData' for clarity
    if (!vocabData) {
        console.error(`No data found in ${file} for language ${language}`);
        return [];
    }

    let combinedVocabularyWords = [];
    let seenVocabItems = new Set();

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

const LANGUAGE_GENDER_SYSTEMS = {
    'COSYitaliano': 2,
    'COSYfrançais': 2,
    'COSYespañol': 2,
    'COSYdeutsch': 3,
    'COSYportuguês': 2,
    'ΚΟΖΥελληνικά': 3,
    'ТАКОЙрусский': 3,
    'COSYbrezhoneg': 2
};

const ARTICLE_CATEGORIES = {
    'COSYfrançais': {
        "le": "masculine",
        "la": "feminine",
        "l'": "both",
        "le/la": "both"
    },
    'COSYdeutsch': {
        "der": "masculine",
        "die": "feminine",
        "das": "neuter"
    },
    'COSYitaliano': {
        "il": "masculine",
        "lo": "masculine",
        "la": "feminine",
        "l'": "both",
        "l": "both",
        "il/la": "both"
    },
    'COSYespañol': {
        "el": "masculine",
        "la": "feminine",
        "el/la": "both"
    },
    'COSYportuguês': {
        "o": "masculine",
        "a": "feminine",
        "o/a": "both"
    },
    'ΚΟΖΥελληνικά': { // Greek
        "ο": "masculine",
        "η": "feminine",
        "το": "neuter",
        "ο/η": "both"
    },
    'ТАКОЙрусский': { // Russian
        "он": "masculine",
        "она": "feminine",
        "оно": "neuter"
    }
};

// Grammar Practice Types
const GRAMMAR_PRACTICE_TYPES = {
    'gender': {
        exercises: ['article-word', 'match-articles-words', 'select-article'],
        name: 'Gender'
    },
    'verbs': {
        exercises: ['type-verb', 'match-verbs-pronouns', 'fill-gaps', 'word-order'],
        name: 'Verbs'
    },
    'possessives': {
        exercises: ['type-possessive', 'match-possessives'],
        name: 'Possessives'
    },
    'plurals': {
        exercises: ['type-plural', 'match-singular-plural'],
        name: 'Plurals'
    },
    'adjectives': {
        exercises: ['type-adjective', 'match-adjectives'],
        name: 'Adjectives'
    }
};

// Initialize grammar practice
function initGrammarPractice() {
    document.getElementById('gender-btn')?.addEventListener('click', () => startGenderPractice());
    document.getElementById('verbs-btn')?.addEventListener('click', () => startVerbsPractice());
    document.getElementById('possessives-btn')?.addEventListener('click', () => startPossessivesPractice());
    document.getElementById('practice-all-grammar-btn')?.addEventListener('click', () => practiceAllGrammar());
}

// Gender practice
async function startGenderPractice() {
    const exercises = GRAMMAR_PRACTICE_TYPES['gender'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    if (randomExercise === 'article-word') await showArticleWord();
    else if (randomExercise === 'match-articles-words') await showMatchArticlesWords();
    else if (randomExercise === 'select-article') await showSelectArticleExercise();
}

async function showArticleWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language || !days.length) {
        alert(currentTranslations.alertLangDay || 'Please select language and day(s) first');
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
    const wordToPronounce = variation.type === 'article' ? item.word : item.article;


    resultArea.innerHTML = `
        <div class="gender-exercise" role="form" aria-label="${currentTranslations.aria?.genderExercise || 'Gender Exercise'}">
            <div class="gender-prompt" aria-label="${variation.question}">${variation.question}</div>
            <button id="pronounce-gender-item" class="btn-emoji" title="${currentTranslations.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="${currentTranslations.aria?.typeYourAnswer || 'Type your answer'}" placeholder="${currentTranslations.typeYourAnswerPlaceholder || 'Type your answer...'}">
            <button id="check-gender-answer-btn" class="btn-primary" aria-label="${currentTranslations.aria?.checkAnswer || 'Check answer'}">✅ ${currentTranslations.buttons?.check || 'Check'}</button>
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="new-gender-exercise" class="btn-secondary" aria-label="${currentTranslations.aria?.newExercise || 'New Exercise'}">🔄 ${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;

    const pronounceButton = document.getElementById('pronounce-gender-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        if (variation.type === 'article' && item.word) {
             pronounceWord(item.word, language);
        } else if (variation.type === 'word' && item.article) {
             pronounceWord(item.article, language);
        }
        pronounceButton.addEventListener('click', () => {
            if (variation.type === 'article' && item.word) {
                 pronounceWord(item.word, language);
            } else if (variation.type === 'word' && item.article) {
                 pronounceWord(item.article, language);
            }
        });
    }

    document.getElementById('check-gender-answer-btn').onclick = async function() {
        const userInput = document.getElementById('gender-answer-input').value.trim();
        let feedback = '';
        if (!userInput) {
            feedback = `<span style="color:#e67e22;">${currentTranslations.feedbackPleaseType || 'Please type your answer above.'}</span>`;
        } else {
            if (variation.type === 'article') {
                if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
                    feedback = '<span class="correct" aria-label="Correct">✅🎉 Correct! Well done!</span>';
                    CosyAppInteractive.awardCorrectAnswer();
                    setTimeout(() => showArticleWord(), 1200);
                } else {
                    feedback = `<span class="incorrect" aria-label="Incorrect">❌🤔 Not quite. The correct answer is: <b>${variation.answer}</b></span>`;
                }
            } else {
                const targetArticle = item.article;
                const isValidWordForArticle = items.some(i => i.article.toLowerCase() === targetArticle.toLowerCase() && i.word.toLowerCase() === userInput.toLowerCase());
                if (isValidWordForArticle) {
                    feedback = '<span class="correct" aria-label="Correct">✅🎉 Correct! Well done!</span>';
                    CosyAppInteractive.awardCorrectAnswer();
                    setTimeout(() => showArticleWord(), 1200);
                } else {
                    feedback = `<span class="incorrect" aria-label="Incorrect">❌🤔 Not a valid word for "${targetArticle}". The expected example was: <b>${variation.answer}</b>. Other valid words might exist.</span>`;
                }
            }
        }
        document.getElementById('gender-answer-feedback').innerHTML = feedback;
    };
    document.getElementById('new-gender-exercise').onclick = () => showArticleWord();
    addEnterKeySupport('gender-answer-input', 'check-gender-answer-btn');
}

async function showMatchArticlesWords() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language || !days.length) {
        alert(currentTranslations.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const genderData = await loadGenderGrammar(language, days);
    if (!genderData || genderData.length === 0) {
        showNoDataMessage();
        return;
    }

    let selectedItems = [];
    const langGenderSystem = LANGUAGE_GENDER_SYSTEMS[language];
    const langArticleCategories = ARTICLE_CATEGORIES[language];

    const itemsByArticle = {};
    const itemsByCategory = {};

    genderData.forEach(item => {
        if (item.word && item.article) {
            const category = langArticleCategories ? langArticleCategories[item.article] : null;
            if (category) {
                if (!itemsByCategory[category]) itemsByCategory[category] = [];
                itemsByCategory[category].push(item);
            }
            if (!itemsByArticle[item.article]) itemsByArticle[item.article] = [];
            itemsByArticle[item.article].push(item);
        }
    });

    for (const category in itemsByCategory) shuffleArray(itemsByCategory[category]);
    for (const article in itemsByArticle) shuffleArray(itemsByArticle[article]);

    const pickedArticlesSet = new Set();
    const pickedGenderCategoriesForPuzzle = new Set();
    let desiredItemCount = 0; // Will be set per language type

    if (language === 'COSYenglish') {
        const englishArticlesTarget = ['he', 'she', 'it', 'he/she'];
        desiredItemCount = englishArticlesTarget.length;
        for (const articleTarget of englishArticlesTarget) {
            if (selectedItems.length >= desiredItemCount) break;
            if (itemsByArticle[articleTarget] && itemsByArticle[articleTarget].length > 0) {
                const itemToAdd = itemsByArticle[articleTarget].find(i => !pickedArticlesSet.has(i.article)); // Should always be the articleTarget
                if (itemToAdd) { // Should always find if itemsByArticle[articleTarget] is not empty
                    selectedItems.push(itemToAdd);
                    pickedArticlesSet.add(itemToAdd.article);
                    pickedGenderCategoriesForPuzzle.add(itemToAdd.article); // Treat article as category
                }
            }
        }
    } else if (langGenderSystem === 2 && langArticleCategories) { // Spanish, Portuguese, French, Italian
        let baseCategories = ['masculine', 'feminine', 'both'];
        if (language === 'COSYespañol' || language === 'COSYportuguês') {
            desiredItemCount = 3;
        } else if (language === 'COSYfrançais' || language === 'COSYitaliano') {
            desiredItemCount = (Math.random() < 0.5 && Object.keys(langArticleCategories).length >=3) ? 3 : 4;
            if (genderData.filter(i => langArticleCategories[i.article] && i.word).length < desiredItemCount) desiredItemCount = 3; // Fallback if not enough data
        }

        for (const category of baseCategories) {
            if (selectedItems.length >= desiredItemCount && !( (language === 'COSYfrançais' || language === 'COSYitaliano') && selectedItems.length < 4 && desiredItemCount === 4) ) break;
            if (itemsByCategory[category]) {
                const itemFound = itemsByCategory[category].find(item => !pickedArticlesSet.has(item.article));
                if (itemFound) {
                    selectedItems.push(itemFound);
                    pickedArticlesSet.add(itemFound.article);
                    pickedGenderCategoriesForPuzzle.add(category);
                }
            }
        }

        if ((language === 'COSYfrançais' || language === 'COSYitaliano') && selectedItems.length < desiredItemCount && desiredItemCount === 4) {
            const allPossibleArticlesForLang = Object.keys(langArticleCategories);
            shuffleArray(allPossibleArticlesForLang);
            for (const article of allPossibleArticlesForLang) {
                if (selectedItems.length >= desiredItemCount) break;
                if (!pickedArticlesSet.has(article) && itemsByArticle[article] && itemsByArticle[article].length > 0) {
                    selectedItems.push(itemsByArticle[article][0]);
                    pickedArticlesSet.add(article);
                    break;
                }
            }
        }

    } else if (langGenderSystem === 3 && langArticleCategories) { // German, Greek, Russian
        let baseCategories = ['masculine', 'feminine', 'neuter'];
        desiredItemCount = 3;
        if (language === 'ΚΟΖΥελληνικά' && Object.values(langArticleCategories).includes('both')) {
            if (Math.random() < 0.5 || Object.keys(langArticleCategories).length >=4 ) { // Try for 4 if data allows
                 baseCategories.push('both');
                 desiredItemCount = 4;
            }
            if (genderData.filter(i => langArticleCategories[i.article] && i.word).length < desiredItemCount) desiredItemCount = 3; // Fallback
        }

        for (const category of baseCategories) {
            if (selectedItems.length >= desiredItemCount) break;
            if (itemsByCategory[category]) {
                 const itemFound = itemsByCategory[category].find(item => !pickedArticlesSet.has(item.article));
                if (itemFound) {
                    selectedItems.push(itemFound);
                    pickedArticlesSet.add(itemFound.article);
                    pickedGenderCategoriesForPuzzle.add(category);
                }
            }
        }
    } else { // Fallback for languages not covered by specific logic (e.g. no langArticleCategories)
        console.warn(`Using fallback selection for ${language} in showMatchArticlesWords.`);
        desiredItemCount = 3;
        const allItemsShuffled = shuffleArray([...genderData]);
        for (const item of allItemsShuffled) {
            if (selectedItems.length >= desiredItemCount) break;
            if (item.word && item.article && !pickedArticlesSet.has(item.article)) {
                 selectedItems.push(item);
                 pickedArticlesSet.add(item.article);
            }
        }
    }

    if (selectedItems.length > desiredItemCount && desiredItemCount > 0) {
         selectedItems = selectedItems.slice(0, desiredItemCount);
    } else if (selectedItems.length < Math.min(desiredItemCount,2) && desiredItemCount > 1) {
         showNoDataMessage();
         return;
    }
     if (selectedItems.length < 2) {
        showNoDataMessage();
        return;
    }

    shuffleArray(selectedItems);
    const displayArticles = selectedItems.map(item => item.article);
    const displayWords = selectedItems.map(item => item.word);
    const shuffledDisplayArticles = shuffleArray([...displayArticles]);
    const shuffledDisplayWords = shuffleArray([...displayWords]);


    resultArea.innerHTML = `
        <div class="match-exercise" role="region" aria-label="${currentTranslations.aria?.matchArticlesWords || 'Match Articles and Words'}">
            <div class="match-container">
                <div class="match-col" id="articles-col" aria-label="${currentTranslations.aria?.articlesColumn || 'Articles column'}">
                    ${shuffledDisplayArticles.map(article => `<div class="match-item" data-article="${article}" role="button" tabindex="0" aria-label="${currentTranslations.aria?.articleAriaLabel || 'Article:'} ${article}">${article} </div>`).join('')}
                </div>
                <div class="match-col" id="words-col" aria-label="${currentTranslations.aria?.wordsColumn || 'Words column'}">
                    ${shuffledDisplayWords.map(word => `<div class="match-item" data-word="${word}" role="button" tabindex="0" aria-label="${currentTranslations.aria?.wordAriaLabel || 'Word:'} ${word}">${word}</div>`).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="check-matches" class="btn-primary" aria-label="${currentTranslations.aria?.checkMatches || 'Check Matches'}">✅ ${currentTranslations.checkMatchesButtonLabel || `${currentTranslations.buttons?.check || 'Check'} Matches`}</button>
            <button id="new-match" class="btn-secondary" aria-label="${currentTranslations.aria?.newExercise || 'New Exercise'}">🔄 ${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;

    let selectedArticleEl = null, selectedWordEl = null;
    document.querySelectorAll('#articles-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            document.querySelectorAll('#articles-col .match-item').forEach(i => { if (i !== this) i.classList.remove('selected');});
            this.classList.toggle('selected');
            selectedArticleEl = this.classList.contains('selected') ? this : null;
            checkMatchAttempt();
        });
    });
    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            document.querySelectorAll('#words-col .match-item').forEach(i => { if (i !== this) i.classList.remove('selected');});
            this.classList.toggle('selected');
            selectedWordEl = this.classList.contains('selected') ? this : null;
            checkMatchAttempt();
        });
    });

    function checkMatchAttempt() {
        if (selectedArticleEl && selectedWordEl) {
            const articleValue = selectedArticleEl.getAttribute('data-article');
            const wordValue = selectedWordEl.getAttribute('data-word');
            const feedback = document.getElementById('match-feedback');

            const correctPair = selectedItems.find(s => s.article === articleValue && s.word === wordValue);

            if (correctPair) {
                feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectMatch || '✅ Correct match!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                selectedArticleEl.classList.add('matched', 'disabled');
                selectedWordEl.classList.add('matched', 'disabled');
                selectedArticleEl.classList.remove('selected');
                selectedWordEl.classList.remove('selected');

                const allMatched = selectedItems.length === document.querySelectorAll('.match-item.matched').length / 2;
                if (allMatched) {
                    feedback.innerHTML += `<br><span class="correct">${currentTranslations.feedbackAllMatchesCompleted || 'All pairs matched!'}</span>`;
                    setTimeout(() => showMatchArticlesWords(), 2000);
                }
            } else {
                feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotAMatch || '❌ Not a match. Try again!'}</span>`;
                selectedArticleEl.classList.remove('selected');
                selectedWordEl.classList.remove('selected');
            }
            selectedArticleEl = null; selectedWordEl = null;
        }
    }

    document.getElementById('check-matches').addEventListener('click', () => {
        document.getElementById('match-feedback').innerHTML = currentTranslations.feedbackShowingCorrectMatches || 'Showing all correct matches...';
        selectedItems.forEach(item => {
            const articleElToMatch = document.querySelector(`#articles-col .match-item[data-article="${item.article}"]:not(.matched)`);
            const wordElToMatch = document.querySelector(`#words-col .match-item[data-word="${item.word}"]:not(.matched)`);
            if (articleElToMatch) articleElToMatch.classList.add('matched', 'disabled');
            if (wordElToMatch) wordElToMatch.classList.add('matched', 'disabled');
        });
        setTimeout(() => showMatchArticlesWords(), 3000);
    });
    document.getElementById('new-match').addEventListener('click', () => showMatchArticlesWords());
}

async function showSelectArticleExercise() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;
    const NUM_ARTICLE_OPTIONS = 4;

    if (!language || !days.length) {
        alert(currentTranslations.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const items = await loadGenderGrammar(language, days);
    if (!items.length) {
        showNoDataMessage();
        return;
    }

    const selectedItem = items[Math.floor(Math.random() * items.length)];
    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;

    let allArticlesForLang = [];
    if (ARTICLE_CATEGORIES[language]) {
        allArticlesForLang = Object.keys(ARTICLE_CATEGORIES[language]);
    } else if (language === 'COSYenglish') {
        allArticlesForLang = ['he', 'she', 'it', 'he/she'];
    } else {
        const uniqueArticles = new Set(items.map(i => i.article));
        allArticlesForLang = Array.from(uniqueArticles);
    }

    let distractorArticles = allArticlesForLang.filter(article => article.toLowerCase() !== correctArticle.toLowerCase());
    shuffleArray(distractorArticles);
    distractorArticles = distractorArticles.slice(0, NUM_ARTICLE_OPTIONS - 1);

    if (allArticlesForLang.length < 2) { // Need at least correct + 1 distractor
         resultArea.innerHTML = `<p>${currentTranslations.notEnoughDataForExercise || 'Not enough data for this exercise type.'}</p>`;
         setTimeout(startGenderPractice, 2000);
         return;
    }

    const articleOptions = shuffleArray([correctArticle, ...distractorArticles]);
    while (articleOptions.length > NUM_ARTICLE_OPTIONS || (articleOptions.length < NUM_ARTICLE_OPTIONS && distractorArticles.length < (NUM_ARTICLE_OPTIONS -1) && articleOptions.length === allArticlesForLang.length )) {
        if (articleOptions.length > NUM_ARTICLE_OPTIONS) {
            articleOptions.pop();
        } else {
            break;
        }
    }

    resultArea.innerHTML = `
        <div class="select-article-exercise" role="form" aria-label="${currentTranslations.aria?.selectArticleExercise || 'Select the Article Exercise'}">
            <div class="exercise-prompt" aria-label="${wordToShow}">${wordToShow}</div>
            <button id="pronounce-select-article-word" class="btn-emoji" title="${currentTranslations.aria?.pronounce || 'Pronounce'}">🔊</button>
            <div class="article-options-container">
                ${articleOptions.map(article => `
                    <button class="article-option-btn btn-secondary" data-article="${article}" aria-label="${article}">
                        ${article}
                    </button>
                `).join('')}
            </div>
            <div id="select-article-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="new-select-article-exercise" class="btn-secondary">🔄 ${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;

    const pronounceButton = document.getElementById('pronounce-select-article-word');
     if (pronounceButton && typeof pronounceWord === 'function') {
         pronounceWord(wordToShow, language);
         pronounceButton.addEventListener('click', () => pronounceWord(wordToShow, language));
     }

    document.querySelectorAll('.article-option-btn').forEach(btn => {
        btn.onclick = function() {
            const selectedArticleByUser = this.getAttribute('data-article');
            let feedback = '';
            if (selectedArticleByUser.toLowerCase() === correctArticle.toLowerCase()) {
                feedback = '<span class="correct" aria-label="Correct">✅🎉 Correct! Well done!</span>';
                CosyAppInteractive.awardCorrectAnswer();
                document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true);
                this.classList.add('correct-selection');
                setTimeout(() => showSelectArticleExercise(), 1500);
            } else {
                feedback = `<span class="incorrect" aria-label="Incorrect">❌🤔 Not quite. The correct article is: <b>${correctArticle}</b></span>`;
                this.classList.add('incorrect-selection');
                this.disabled = true;
            }
            document.getElementById('select-article-feedback').innerHTML = feedback;
        };
    });

    document.getElementById('new-select-article-exercise').onclick = () => showSelectArticleExercise();
}


// Verbs practice
async function startVerbsPractice() {
    const exercises = GRAMMAR_PRACTICE_TYPES['verbs'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    if (randomExercise === 'type-verb') await showTypeVerb();
    else if (randomExercise === 'match-verbs-pronouns') await showMatchVerbsPronouns();
    else if (randomExercise === 'fill-gaps') await showFillGaps();
    else if (randomExercise === 'word-order') await showWordOrder();
}

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language || !days.length) {
        alert(currentTranslations.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const items = await loadVerbGrammar(language, days);
    if (!items.length) { showNoDataMessage(); return; }
    const item = items[Math.floor(Math.random() * items.length)];
    const variations = [
        { type: 'infinitive', promptText: `${currentTranslations.infinitiveOf || "Infinitive of"} "${item.prompt}"`, pronounceText: item.prompt },
        { type: 'conjugated', promptText: `${currentTranslations.conjugateFor || "Conjugate"} "${item.infinitive}" ${currentTranslations.forPronoun || "for"} "${item.prompt}"`, pronounceText: item.infinitive }
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const correctAnswer = variation.type === 'infinitive' ? item.infinitive : item.answer;
    const wordToPronounceVerb = variation.pronounceText;


    resultArea.innerHTML = `
        <div class="verb-exercise" aria-label="${currentTranslations.verbExerciseAriaLabel || 'Verb Exercise'}">
            <div class="verb-prompt">${variation.promptText}</div>
            <button id="pronounce-verb-item" class="btn-emoji" title="${currentTranslations.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="verb-answer-input" placeholder="${currentTranslations.typeYourAnswerPlaceholder || 'Type your answer...'}" class="exercise-input">
            <button id="check-verb-answer-btn" class="btn-primary">${currentTranslations.buttons?.check || 'Check'}</button>
            <div id="verb-answer-feedback" class="exercise-feedback"></div>
            <button id="new-verb-exercise" class="btn-secondary">${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;

    const pronounceVerbButton = document.getElementById('pronounce-verb-item');
    if (pronounceVerbButton && typeof pronounceWord === 'function') {
        pronounceWord(wordToPronounceVerb, language); // Initial pronunciation
        pronounceVerbButton.addEventListener('click', () => pronounceWord(wordToPronounceVerb, language));
    }

    document.getElementById('check-verb-answer-btn').onclick = function() {
        const userInput = document.getElementById('verb-answer-input').value.trim();
        let feedback = '';
        if (!userInput) feedback = `<span style="color:#e67e22;">${currentTranslations.feedbackPleaseType || 'Please type your answer above.'}</span>`;
        else if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback = '<span class="correct" aria-label="Correct">✅🎉 Correct! Well done!</span>';
            CosyAppInteractive.awardCorrectAnswer();
            setTimeout(() => showTypeVerb(), 1200);
        } else feedback = `<span class="incorrect" aria-label="Incorrect">❌🤔 Not quite. The correct answer is: <b>${correctAnswer}</b></span>`;
        document.getElementById('verb-answer-feedback').innerHTML = feedback;
    };
    document.getElementById('new-verb-exercise').onclick = () => showTypeVerb();
    addEnterKeySupport('verb-answer-input', 'check-verb-answer-btn');
}

async function showMatchVerbsPronouns() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language || !days.length) { alert(currentTranslations.alertLangDay || 'Please select language and day(s) first'); return; }

    const selectedItems = await loadVerbGrammar(language, days);
    if (!selectedItems || selectedItems.length < 1) {
        showNoDataMessage();
        console.log("No items loaded from loadVerbGrammar or not enough items.");
        return;
    }

    const suitableItems = selectedItems.filter(item => typeof item.prompt !== 'undefined' && typeof item.answer !== 'undefined');
    if (suitableItems.length < 2) {
        showNoDataMessage();
        console.log("Not enough suitable items (prompt/answer pairs) for match exercise. Need at least 2.");
        return;
    }

    const itemsForGame = shuffleArray(suitableItems).slice(0, Math.min(suitableItems.length, 5));

    const prompts = itemsForGame.map(item => item.prompt);
    const answersToMatch = itemsForGame.map(item => item.answer);

    const shuffledPrompts = shuffleArray([...prompts]);
    const shuffledAnswers = shuffleArray([...answersToMatch]);

    resultArea.innerHTML = `
        <div class="match-exercise">
            <div class="match-container">
                <div class="match-col" id="prompts-col">${shuffledPrompts.map(p => `<div class="match-item" data-prompt="${p}" role="button" tabindex="0">${p}</div>`).join('')}</div>
                <div class="match-col" id="answers-col">${shuffledAnswers.map(a => `<div class="match-item" data-answer="${a}" role="button" tabindex="0">${a}</div>`).join('')}</div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="check-matches" class="btn-primary">${currentTranslations.buttons?.check || 'Check'} Matches</button>
            <button id="new-match" class="btn-secondary">${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;

    let selectedPromptEl = null, selectedAnswerEl = null;

    document.querySelectorAll('#prompts-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedPromptEl && selectedPromptEl !== this) selectedPromptEl.classList.remove('selected');
            this.classList.toggle('selected');
            selectedPromptEl = this.classList.contains('selected') ? this : null;
            checkMatchAttempt();
        });
    });

    document.querySelectorAll('#answers-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedAnswerEl && selectedAnswerEl !== this) selectedAnswerEl.classList.remove('selected');
            this.classList.toggle('selected');
            selectedAnswerEl = this.classList.contains('selected') ? this : null;
            checkMatchAttempt();
        });
    });

    function checkMatchAttempt() {
        if (selectedPromptEl && selectedAnswerEl) {
            const promptValue = selectedPromptEl.getAttribute('data-prompt');
            const answerValue = selectedAnswerEl.getAttribute('data-answer');
            const feedback = document.getElementById('match-feedback');

            const isCorrectPair = itemsForGame.some(item => item.prompt === promptValue && item.answer === answerValue);

            if (isCorrectPair) {
                feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackGoodMatch || '✅ Good match!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                selectedPromptEl.classList.add('matched', 'disabled');
                selectedAnswerEl.classList.add('matched', 'disabled');
                selectedPromptEl.classList.remove('selected');
                selectedAnswerEl.classList.remove('selected');

                const allMatched = itemsForGame.length === document.querySelectorAll('.match-item.matched').length / 2;
                if (allMatched) {
                    feedback.innerHTML += `<br><span class="correct">${currentTranslations.feedbackAllMatchesCompleted || 'All pairs matched!'}</span>`;
                    setTimeout(() => showMatchVerbsPronouns(), 2000);
                }
            } else {
                feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotCompatible || '❌ Not compatible. Try again!'}</span>`;
                selectedPromptEl.classList.remove('selected');
                selectedAnswerEl.classList.remove('selected');
            }
            selectedPromptEl = null;
            selectedAnswerEl = null;
        }
    }

    document.getElementById('check-matches').addEventListener('click', () => {
        document.getElementById('match-feedback').innerHTML = currentTranslations.feedbackShowingCorrectMatches || 'Revealing correct matches...';
        itemsForGame.forEach(item => {
            const promptEl = document.querySelector(`#prompts-col .match-item[data-prompt="${item.prompt}"]`);
            const answerEl = document.querySelector(`#answers-col .match-item[data-answer="${item.answer}"]`);
            if (promptEl && !promptEl.classList.contains('matched')) {
                promptEl.classList.add('matched-reveal', 'disabled');
            }
            if (answerEl && !answerEl.classList.contains('matched')) {
                answerEl.classList.add('matched-reveal', 'disabled');
            }
        });
        setTimeout(() => showMatchVerbsPronouns(), 3000);
    });
    document.getElementById('new-match').addEventListener('click', () => showMatchVerbsPronouns());
}

async function showFillGaps() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language || !days.length) { alert(currentTranslations.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbData = await loadVerbGrammar(language, days);
    if (!verbData.length) { showNoDataMessage(); return; }
    const verbItem = verbData[Math.floor(Math.random() * verbData.length)];
    const exerciseTypes = ['positive', 'negative', 'question'];
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    let sentence = '', correctAnswer = '';

    switch(exerciseType) {
        case 'positive':
            const pronoun = getRandomPronounForLanguage(language);
            const conjugatedVerb = conjugateVerb(verbItem.infinitive, pronoun, language);
            sentence = `${pronoun} ___ (${verbItem.infinitive}) ${await getRandomObject(language, days)}`;
            correctAnswer = conjugatedVerb;
            break;
        case 'negative':
            const pronoun2 = getRandomPronounForLanguage(language);
            const negativeElement = getNegativeElement(pronoun2, language);
            sentence = `${pronoun2} ___ (${negativeElement.replace('...', verbItem.infinitive)}) ${await getRandomObject(language, days)}`;
            if (negativeElement.includes("...")) {
                 correctAnswer = conjugateVerb(verbItem.infinitive, pronoun2, language) + " " + negativeElement.split("...")[1].trim();
                 sentence = `${pronoun2} ${negativeElement.split("...")[0].trim()} ___ (${verbItem.infinitive}) ${negativeElement.split("...")[1].trim()} ${await getRandomObject(language, days)}`;
            } else {
                 sentence = `${pronoun2} ___ (${negativeElement} ${verbItem.infinitive}) ${await getRandomObject(language, days)}`;
                 correctAnswer = negativeElement + " " + conjugateVerb(verbItem.infinitive, pronoun2, language);
            }
            break;
        case 'question':
            const pronoun3 = getRandomPronounForLanguage(language);
            const questionElement = getQuestionElement(pronoun3, language);
            sentence = `${questionElement} ${pronoun3} ___ (${verbItem.infinitive}) ${await getRandomObject(language, days)}?`;
            correctAnswer = conjugateVerb(verbItem.infinitive, pronoun3, language);
            break;
    }

    resultArea.innerHTML = `
        <div class="fill-gap-exercise">
            <h3>${currentTranslations.fillGapTitle || 'Fill in the gap:'}</h3>
            <div class="sentence-with-gap">${sentence.replace('___', '<input type="text" id="gap-answer" class="exercise-input" placeholder="'+ (currentTranslations.typeYourAnswerPlaceholder || 'Type your answer...') +'">')}</div>
            <button id="check-gap" class="btn-primary">${currentTranslations.buttons?.check || 'Check'}</button>
            <div id="gap-feedback" class="exercise-feedback"></div>
            <button id="new-gap" class="btn-secondary">${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;
    const gapAnswerInput = document.getElementById('gap-answer');
    document.getElementById('check-gap').addEventListener('click', () => {
        const userAnswer = gapAnswerInput.value.trim();
        const feedback = document.getElementById('gap-feedback');
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
             feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectWellDone || '✅ Correct! Well done!'}</span>`;
             CosyAppInteractive.awardCorrectAnswer();
             setTimeout(() => showFillGaps(), 1200);
        } else {
            feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotQuite || '❌ Not quite. The correct answer is: '}<b>${correctAnswer}</b></span>`;
        }
    });
    document.getElementById('new-gap').addEventListener('click', () => showFillGaps());
    if(gapAnswerInput) addEnterKeySupport('gap-answer', 'check-gap');
}

async function showWordOrder() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language || !days.length) { alert(currentTranslations.alertLangDay || 'Please select language and day(s) first'); return; }
    const verbData = await loadVerbGrammar(language, days);
    if (!verbData || verbData.length === 0) { showNoDataMessage(); return; }

    const verbItem = verbData[Math.floor(Math.random() * verbData.length)];
    if (!verbItem) { showNoDataMessage(); console.error("Selected verbItem is undefined."); return; }

    const exerciseTypes = ['positive', 'negative', 'question'];
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    let sentenceParts = [];
    const randomObject = await getRandomObject(language, days);
    const randomTime = getRandomTimeExpression(language);

    const isToBeForm = verbItem.prompt && verbItem.answer && !verbItem.infinitive;

    switch(exerciseType) {
        case 'positive':
            if (isToBeForm) {
                sentenceParts = [verbItem.prompt, verbItem.answer, randomObject, randomTime].filter(p => p);
            } else {
                const pronoun = getRandomPronounForLanguage(language);
                sentenceParts = [pronoun, conjugateVerb(verbItem.infinitive, pronoun, language), randomObject, randomTime].filter(p => p);
            }
            break;
        case 'negative':
            if (isToBeForm) {
                let notWord = "not";
                if (language === 'COSYfrançais' && verbItem.prompt) {
                     sentenceParts = [verbItem.prompt, "ne", verbItem.answer, "pas", randomObject, randomTime].filter(p => p);
                } else {
                    sentenceParts = [verbItem.prompt, verbItem.answer, notWord, randomObject, randomTime].filter(p => p);
                }

            } else {
                const pronoun2 = getRandomPronounForLanguage(language);
                const negPart = getNegativeElement(pronoun2, language);
                if (negPart.includes("...")) {
                    sentenceParts = [pronoun2, negPart.split("...")[0].trim(), conjugateVerb(verbItem.infinitive, pronoun2, language), negPart.split("...")[1].trim(), randomObject, randomTime].filter(p => p);
                } else {
                     sentenceParts = [pronoun2, negPart, conjugateVerb(verbItem.infinitive, pronoun2, language), randomObject, randomTime].filter(p => p); // Corrected to use conjugated verb
                }
            }
            break;
        case 'question':
            if (isToBeForm) {
                sentenceParts = [verbItem.answer, verbItem.prompt, randomObject, randomTime + "?"].filter(p => p);
            } else {
                const pronoun3 = getRandomPronounForLanguage(language);
                sentenceParts = [getQuestionElement(pronoun3, language), pronoun3, conjugateVerb(verbItem.infinitive, pronoun3, language), randomObject, randomTime+"?"].filter(p => p);
            }
            break;
    }
    sentenceParts = sentenceParts.filter(p => p && String(p).trim() !== '');


    const shuffledParts = shuffleArray([...sentenceParts]);
    resultArea.innerHTML = `
        <div class="word-order-exercise">
            <h3>${currentTranslations.wordOrderTitle || 'Put the words in the correct order:'}</h3>
            <div class="word-pool" id="word-pool">${shuffledParts.map(part => `<div class="word-tile" data-word="${part}" draggable="true">${part}</div>`).join('')}</div>
            <div class="sentence-slots" id="sentence-slots">${Array(sentenceParts.length).fill('<div class="word-slot"></div>').join('')}</div>
            <div id="order-feedback" class="exercise-feedback"></div>
            <div class="order-actions">
                <button id="check-order" class="btn-primary">${currentTranslations.buttons?.check || 'Check'}</button>
                <button id="reset-order" class="btn-secondary">${currentTranslations.buttons?.reset || 'Reset'}</button>
                <button id="new-order" class="btn-secondary">${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
            </div>
        </div>
    `;
    const wordTiles = document.querySelectorAll('.word-tile');
    const wordSlots = document.querySelectorAll('.word-slot');
    wordTiles.forEach(tile => tile.addEventListener('dragstart', dragStart));
    wordSlots.forEach(slot => { slot.addEventListener('dragover', dragOver); slot.addEventListener('drop', drop); slot.addEventListener('dragenter', dragEnter); slot.addEventListener('dragleave', dragLeave); });

    document.getElementById('check-order').addEventListener('click', () => {
        const builtSentence = [...document.querySelectorAll('.word-slot')].map(slot => slot.textContent).join(' ').trim();
        const correctSentence = sentenceParts.join(' ').trim();
        const feedback = document.getElementById('order-feedback');
        if (builtSentence === correctSentence) {
            feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectWellDone || '✅ Correct! Well done!'}</span>`;
            CosyAppInteractive.awardCorrectAnswer();
            setTimeout(() => showWordOrder(), 3000);
        } else {
            feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotQuiteCorrectOrder || '❌ Not quite. The correct order is: '}<b>${correctSentence}</b></span>`;
        }
    });
    document.getElementById('reset-order').addEventListener('click', () => {
        document.getElementById('word-pool').innerHTML = shuffledParts.map(part => `<div class="word-tile" data-word="${part}" draggable="true">${part}</div>`).join('');
        document.querySelectorAll('.word-slot').forEach(slot => slot.innerHTML = '');
        document.getElementById('order-feedback').innerHTML = '';
        document.querySelectorAll('.word-tile').forEach(tile => tile.addEventListener('dragstart', dragStart));
    });
    document.getElementById('new-order').addEventListener('click', () => showWordOrder());
}

function getPronounsForLanguage(language) {
    switch(language) {
        case 'COSYenglish': return ['I', 'you', 'he', 'she', 'it', 'we', 'they'];
        case 'COSYfrançais': return ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
        default: return ['I', 'you', 'he', 'she', 'it', 'we', 'they']; // Fallback
    }
}
function getRandomPronounForLanguage(language) { const p = getPronounsForLanguage(language); return p[Math.floor(Math.random() * p.length)]; }

function conjugateVerb(verb, pronoun, language) {
    switch(language) {
        case 'COSYenglish':
            if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') return verb;
            else return verb + 's';
        case 'COSYfrançais':
            if (pronoun === 'je') return verb.replace(/er$/, 'e');
            if (pronoun === 'tu') return verb.replace(/er$/, 'es');
            if (pronoun === 'il' || pronoun === 'elle' || pronoun === 'on') return verb.replace(/er$/, 'e');
            if (pronoun === 'nous') return verb.replace(/er$/, 'ons');
            if (pronoun === 'vous') return verb.replace(/er$/, 'ez');
            if (pronoun === 'ils' || pronoun === 'elles') return verb.replace(/er$/, 'ent');
            return verb;
        default: return verb;
    }
}

function getNegativeElement(pronoun, language) {
    switch(language) {
        case 'COSYenglish':
            if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') return "don't";
            else return "doesn't";
        case 'COSYfrançais': return "ne ... pas";
        default: return "not";
    }
}

function getQuestionElement(pronoun, language) {
    switch(language) {
        case 'COSYenglish':
            if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') return "Do";
            else return "Does";
        case 'COSYfrançais': return "Est-ce que";
        default: return "Do";
    }
 }

async function getRandomObject(language, days) {
    const vocabulary = await loadVocabularyData(language, days);
    if (!vocabulary || vocabulary.length === 0) {
        const fallbackObjects = {'COSYenglish': ['an apple', 'a book', 'the house'], 'COSYfrançais': ['une pomme', 'un livre', 'la maison']};
        const langFallback = fallbackObjects[language] || fallbackObjects['COSYenglish'];
        return langFallback[Math.floor(Math.random() * langFallback.length)];
    }
    return vocabulary[Math.floor(Math.random() * vocabulary.length)];
}

function getRandomTimeExpression(language) {
    const times = {'COSYenglish': ['every day', 'now', 'often', 'sometimes'], 'COSYfrançais': ['tous les jours', 'maintenant', 'souvent', 'parfois']};
    const langTimes = times[language] || times['COSYenglish']; return langTimes[Math.floor(Math.random() * langTimes.length)];
}
// function isCompatibleVerbPronoun(verb, pronoun, language) { return true; } // This function is no longer needed

async function startPossessivesPractice() { }
async function showTypePossessive() { }
async function showMatchPossessives() { }

async function practiceAllGrammar() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const currentTranslations = translations[language] || translations.COSYenglish;
    if (!language || !days.length) { alert(currentTranslations.alertLangDay || 'Please select language and day(s) first'); return; }

    const availableTypes = [];
    const day = parseInt(days[0]);
    if (day >= 1 && language !== 'COSYenglish') availableTypes.push('gender');
    if (day >= 2) availableTypes.push('verbs');
    if (day >= 3) availableTypes.push('possessives');
    if (availableTypes.length === 0) { showNoDataMessage(); return; }
    const shuffledTypes = shuffleArray(availableTypes);

    for (const type of shuffledTypes) {
        if (type === 'gender') await startGenderPractice();
        else if (type === 'verbs') await startVerbsPractice();
        else if (type === 'possessives') await startPossessivesPractice();

        await new Promise(resolve => {
            const continueBtn = document.createElement('button');
            continueBtn.className = 'btn-primary';
            continueBtn.textContent = currentTranslations.buttons?.continue || 'Continue';
            continueBtn.addEventListener('click', resolve, { once: true });
            const resultArea = document.getElementById('result');
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'continue-prompt';
            feedbackDiv.innerHTML = `<p>${currentTranslations.continuePromptText || 'Press continue for next exercise'}</p>`;
            feedbackDiv.appendChild(continueBtn);
            const existingPrompt = resultArea.querySelector('.continue-prompt');
            if(existingPrompt) existingPrompt.remove();
            resultArea.appendChild(feedbackDiv);
        });
    }
}

function addRandomizeButton(containerId, randomizeFn) {
    const container = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
    if (!container) return;
    const existingBtn = container.querySelector('.btn-randomize');
    if (existingBtn) existingBtn.remove();
    let btn = document.createElement('button');
    btn.className = 'btn-randomize';
    const language = document.getElementById('language')?.value || 'COSYenglish';
    btn.setAttribute('aria-label', (translations[language]?.buttons?.randomize || 'Randomize exercise'));
    btn.title = translations[language]?.buttons?.randomize || 'Randomize exercise';
    btn.innerHTML = translations[language]?.buttons?.randomize || '🎲';
    btn.style.marginLeft = '10px';
    btn.onclick = randomizeFn;
    btn.style.float = 'right';
    btn.style.fontSize = '1.5rem';
    btn.style.background = 'linear-gradient(90deg,#ffe082,#1de9b6)';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.width = '44px';
    btn.style.height = '44px';
    btn.style.boxShadow = '0 2px 8px #ccc';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'transform 0.2s';
    btn.onmouseover = () => btn.style.transform = 'scale(1.15)';
    btn.onmouseout = () => btn.style.transform = '';
    container.prepend(btn);
}

showArticleWord = patchExerciseForRandomizeButton(showArticleWord, '.gender-exercise', startGenderPractice);
showMatchArticlesWords = patchExerciseForRandomizeButton(showMatchArticlesWords, '.match-exercise', startGenderPractice);
showSelectArticleExercise = patchExerciseForRandomizeButton(showSelectArticleExercise, '.select-article-exercise', startGenderPractice);
showTypeVerb = patchExerciseForRandomizeButton(showTypeVerb, '.verb-exercise', startVerbsPractice);
showMatchVerbsPronouns = patchExerciseForRandomizeButton(showMatchVerbsPronouns, '.match-exercise', startVerbsPractice);
showFillGaps = patchExerciseForRandomizeButton(showFillGaps, '.fill-gap-exercise', startVerbsPractice);
showWordOrder = patchExerciseForRandomizeButton(showWordOrder, '.word-order-exercise', startVerbsPractice);

document.addEventListener('DOMContentLoaded', initGrammarPractice);
