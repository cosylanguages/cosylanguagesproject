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

async function loadVerbGrammar(language, day) {
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
    return data && data[day] ? data[day] : [];
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
        exercises: ['article-word', 'match-articles-words'],
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
        { type: 'article', question: `${currentTranslations.articleFor || "Article for"} "${item.word}"`, answer: item.article },
        { type: 'word', question: `${currentTranslations.wordFor || "Word for"} "${item.article}"`, answer: item.word }
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
        // Initial pronunciation based on what is being asked (word or article)
        if (variation.type === 'article' && item.word) {
             pronounceWord(item.word, language);
        } else if (variation.type === 'word' && item.article) {
             pronounceWord(item.article, language); // If asking for the word, pronounce the article as a hint
        }
        pronounceButton.addEventListener('click', () => {
            if (variation.type === 'article' && item.word) {
                 pronounceWord(item.word, language);
            } else if (variation.type === 'word' && item.article) {
                 pronounceWord(item.article, language);
            }
        });
    }

    document.getElementById('check-gender-answer-btn').onclick = function() {
        const userInput = document.getElementById('gender-answer-input').value.trim();
        let feedback = '';
        if (!userInput) feedback = `<span style="color:#e67e22;">${currentTranslations.feedbackPleaseType || 'Please type your answer above.'}</span>`;
        else if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
            feedback = '<span class="correct" aria-label="Correct">✅🎉 Correct! Well done!</span>';
            setTimeout(() => showArticleWord(), 1200);
        } else feedback = `<span class="incorrect" aria-label="Incorrect">❌🤔 Not quite. The correct answer is: <b>${variation.answer}</b></span>`;
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
    const DESIRED_ITEM_COUNT = 4;

    if (!language || !days.length) {
        alert(currentTranslations.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const genderData = await loadGenderGrammar(language, days);
    if (!genderData || genderData.length === 0) { // Ensure genderData is not null and not empty
        showNoDataMessage();
        return;
    }
    
    let selectedItems = [];
    const langGenderSystem = LANGUAGE_GENDER_SYSTEMS[language];
    const langArticleCategories = ARTICLE_CATEGORIES[language];

    // Fallback or intelligent selection
    if (!langGenderSystem || !langArticleCategories || genderData.length < DESIRED_ITEM_COUNT) {
        // Fallback to original random selection if system/categories undefined or not enough data for full strategy
        const usedIndices = new Set();
        const availableGenderData = [...genderData]; // Create a mutable copy for random selection
        shuffleArray(availableGenderData); // Shuffle for randomness

        while (selectedItems.length < DESIRED_ITEM_COUNT && availableGenderData.length > 0) {
            const item = availableGenderData.pop(); // Take a random item
            if (!usedIndices.has(item)) { // Ensure item uniqueness, though pop from shuffled unique list is inherently unique
                selectedItems.push(item);
                usedIndices.add(item); // Keep track if items could somehow be duplicated in source
            }
        }
    } else {
        // New intelligent selection logic
        let targetCategories = [];
        if (langGenderSystem === 2) {
            targetCategories = ['masculine', 'feminine', 'both'];
        } else if (langGenderSystem === 3) {
            targetCategories = ['masculine', 'feminine', 'neuter'];
            if (langArticleCategories && Object.values(langArticleCategories).includes('both')) {
                 if (Object.keys(langArticleCategories).some(article => langArticleCategories[article] === 'both')) {
                    targetCategories.push('both');
                }
            }
        }

        const itemsByCategory = {};
        genderData.forEach(item => {
            const category = langArticleCategories[item.article];
            if (category) {
                if (!itemsByCategory[category]) {
                    itemsByCategory[category] = [];
                }
                // Ensure item has word and article before adding
                if (item.word && item.article) { 
                    itemsByCategory[category].push(item);
                }
            }
        });
        
        // Shuffle items within each category for randomness
        for (const category in itemsByCategory) {
            shuffleArray(itemsByCategory[category]);
        }

        const pickedItemsSet = new Set(); 

        for (const category of targetCategories) {
            if (selectedItems.length >= DESIRED_ITEM_COUNT) break; // Stop if we already have enough
            if (itemsByCategory[category]) {
                for (const item of itemsByCategory[category]) { // Iterate through shuffled items of the category
                    if (!pickedItemsSet.has(item)) {
                        selectedItems.push(item);
                        pickedItemsSet.add(item);
                        break; // Got one for this category
                    }
                }
            }
        }
        
        // Fill remaining slots if not enough items were picked by category strategy
        if (selectedItems.length < DESIRED_ITEM_COUNT) {
            const allItemsShuffled = shuffleArray([...genderData]); // Get a shuffled list of all items
            for (const item of allItemsShuffled) {
                if (selectedItems.length >= DESIRED_ITEM_COUNT) break;
                if (!pickedItemsSet.has(item) && item.word && item.article) { // Check item.word and item.article
                    selectedItems.push(item);
                    pickedItemsSet.add(item);
                }
            }
        }
        // Ensure we don't have more than DESIRED_ITEM_COUNT.
        if (selectedItems.length > DESIRED_ITEM_COUNT) {
            shuffleArray(selectedItems); 
            selectedItems = selectedItems.slice(0, DESIRED_ITEM_COUNT);
        }
    }

    if (selectedItems.length < 2) { // Minimum 2 items to make a matching exercise
        showNoDataMessage();
        return;
    }

    const articles = selectedItems.map(item => item.article);
    const words = selectedItems.map(item => item.word);
    const shuffledArticles = shuffleArray([...articles]);
    const shuffledWords = shuffleArray([...words]);

    resultArea.innerHTML = `
        <div class="match-exercise" role="region" aria-label="${currentTranslations.aria?.matchArticlesWords || 'Match Articles and Words'}">
            <div class="match-container">
                <div class="match-col" id="articles-col" aria-label="${currentTranslations.aria?.articlesColumn || 'Articles column'}">
                    ${shuffledArticles.map(article => `<div class="match-item" data-article="${article}" role="button" tabindex="0" aria-label="${currentTranslations.aria?.articleAriaLabel || 'Article:'} ${article}">${article} </div>`).join('')}
                </div>
                <div class="match-col" id="words-col" aria-label="${currentTranslations.aria?.wordsColumn || 'Words column'}">
                    ${shuffledWords.map(word => `<div class="match-item" data-word="${word}" role="button" tabindex="0" aria-label="${currentTranslations.aria?.wordAriaLabel || 'Word:'} ${word}">${word}</div>`).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="check-matches" class="btn-primary" aria-label="${currentTranslations.aria?.checkMatches || 'Check Matches'}">✅ ${currentTranslations.checkMatchesButtonLabel || `${currentTranslations.buttons?.check || 'Check'} Matches`}</button>
            <button id="new-match" class="btn-secondary" aria-label="${currentTranslations.aria?.newExercise || 'New Exercise'}">🔄 ${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;
    let selectedArticle = null, selectedWordElement = null; 
    document.querySelectorAll('#articles-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('#articles-col .match-item').forEach(i => i.classList.remove('selected')); 
            this.classList.add('selected');
            selectedArticle = this.getAttribute('data-article');
            if (selectedWordElement) {
                const currentWord = selectedWordElement.getAttribute('data-word');
                const correctWordForItem = selectedItems.find(s => s.article === selectedArticle)?.word;
                const feedback = document.getElementById('match-feedback');
                if (correctWordForItem === currentWord) {
                    feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectMatch || '✅ Correct match!'}</span>`;
                    document.querySelector(`[data-article="${selectedArticle}"]`).classList.add('matched', 'disabled');
                    selectedWordElement.classList.add('matched', 'disabled');
                    selectedArticle = null; selectedWordElement = null; 
                } else {
                    feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotAMatch || '❌ Not a match. Try again!'}</span>`;
                    this.classList.remove('selected'); 
                    selectedWordElement.classList.remove('selected');
                    selectedArticle = null; selectedWordElement = null;
                }
            }
        });
    });
    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('#words-col .match-item').forEach(i => i.classList.remove('selected')); 
            this.classList.add('selected');
            selectedWordElement = this; 
            if (selectedArticle) {
                const currentWord = this.getAttribute('data-word');
                const correctWordForItem = selectedItems.find(s => s.article === selectedArticle)?.word;
                const feedback = document.getElementById('match-feedback');
                if (correctWordForItem === currentWord) {
                    feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectMatch || '✅ Correct match!'}</span>`;
                    document.querySelector(`[data-article="${selectedArticle}"]`).classList.add('matched', 'disabled');
                    this.classList.add('matched', 'disabled');
                    selectedArticle = null; selectedWordElement = null; 
                } else {
                    feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotAMatch || '❌ Not a match. Try again!'}</span>`;
                    document.querySelector(`[data-article="${selectedArticle}"]`).classList.remove('selected');
                    this.classList.remove('selected');
                    selectedArticle = null; selectedWordElement = null;
                }
            }
        });
    });
    document.getElementById('check-matches').addEventListener('click', () => {
        document.getElementById('match-feedback').innerHTML = currentTranslations.feedbackShowingCorrectMatches || 'Showing all correct matches...';
        selectedItems.forEach(item => {
            // Ensure item and item.article/word are defined before trying to select
            if (item && item.article) {
                const articleEl = document.querySelector(`[data-article="${item.article}"]`);
                if (articleEl) articleEl.classList.add('matched', 'disabled');
            }
            if (item && item.word) {
                const wordEl = document.querySelector(`[data-word="${item.word}"]`);
                if (wordEl) wordEl.classList.add('matched', 'disabled');
            }
        });
        setTimeout(() => showMatchArticlesWords(), 3000);
    });
    document.getElementById('new-match').addEventListener('click', () => showMatchArticlesWords());
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
    const verbData = await loadVerbGrammar(language, days);
    if (verbData.length < 2) { showNoDataMessage(); return; }
    const pronouns = getPronounsForLanguage(language);
    if (pronouns.length < 2) { showNoDataMessage(); return; }

    let selectedVerbs = [], selectedPronouns = [];
    const usedVerbIndices = new Set(), usedPronounIndices = new Set();
    while (selectedVerbs.length < 2 && usedVerbIndices.size < verbData.length) { 
        const randomIndex = Math.floor(Math.random() * verbData.length);
        if (!usedVerbIndices.has(randomIndex)) {
            usedVerbIndices.add(randomIndex);
            selectedVerbs.push(verbData[randomIndex]);
        }
    }
    while (selectedPronouns.length < 2 && usedPronounIndices.size < pronouns.length) { 
        const randomIndex = Math.floor(Math.random() * pronouns.length);
        if (!usedPronounIndices.has(randomIndex)) {
            usedPronounIndices.add(randomIndex);
            selectedPronouns.push(pronouns[randomIndex]);
        }
     }
    if(selectedVerbs.length < 2 || selectedPronouns.length < 2) { showNoDataMessage(); return; }


    const verbs = selectedVerbs.map(v => v.infinitive); 
    const pronounsList = [...selectedPronouns];
    const shuffledVerbs = shuffleArray(verbs);
    const shuffledPronouns = shuffleArray(pronounsList);

    resultArea.innerHTML = `
        <div class="match-exercise">
            <h3>📚 ${currentTranslations.matchVerbPronounTitle || 'Match each verb with its pronoun'}</h3>
            <div class="match-container">
                <div class="match-col" id="verbs-col">${shuffledVerbs.map(v => `<div class="match-item" data-verb="${v}">${v}</div>`).join('')}</div>
                <div class="match-col" id="pronouns-col">${shuffledPronouns.map(p => `<div class="match-item" data-pronoun="${p}">${p}</div>`).join('')}</div>
            </div>
            <div id="match-feedback" class="exercise-feedback"></div>
            <button id="check-matches" class="btn-primary">${currentTranslations.buttons?.check || 'Check'} Matches</button>
            <button id="new-match" class="btn-secondary">${currentTranslations.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;
    let localSelectedVerb = null, localSelectedPronoun = null;
    document.querySelectorAll('#verbs-col .match-item').forEach(item => {item.addEventListener('click', function() {
        document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected')); this.classList.add('selected');
        localSelectedVerb = this.getAttribute('data-verb'); localSelectedPronoun = null;
    });});
    document.querySelectorAll('#pronouns-col .match-item').forEach(item => {item.addEventListener('click', function() {
        if (!localSelectedVerb) return;
        document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected')); this.classList.add('selected');
        localSelectedPronoun = this.getAttribute('data-pronoun');
        const feedback = document.getElementById('match-feedback');
        if (isCompatibleVerbPronoun(localSelectedVerb, localSelectedPronoun, language)) {
            feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackGoodMatch || '✅ Good match!'}</span>`;
            document.querySelector(`[data-verb="${localSelectedVerb}"]`).classList.add('matched', 'disabled'); this.classList.add('matched', 'disabled');
        } else {
            feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotCompatible || '❌ Not compatible. Try again!'}</span>`;
        }
        localSelectedVerb = null; localSelectedPronoun = null;
    });});
    document.getElementById('check-matches').addEventListener('click', () => {
        document.getElementById('match-feedback').innerHTML = currentTranslations.feedbackAllMatchesCompleted || 'All possible matches completed!';
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
            sentence = `${pronoun} ___ (${verbItem.infinitive}) ${getRandomObject(language)}`;
            correctAnswer = conjugatedVerb;
            break;
        case 'negative':
            const pronoun2 = getRandomPronounForLanguage(language);
            const negativeElement = getNegativeElement(pronoun2, language); // This might return "ne ... pas"
            sentence = `${pronoun2} ___ (${negativeElement.replace('...', verbItem.infinitive)}) ${getRandomObject(language)}`;
            if (negativeElement.includes("...")) { // For languages like French "ne ... pas"
                 correctAnswer = conjugateVerb(verbItem.infinitive, pronoun2, language) + " " + negativeElement.split("...")[1].trim(); // e.g. mange pas
                 sentence = `${pronoun2} ${negativeElement.split("...")[0].trim()} ___ (${verbItem.infinitive}) ${negativeElement.split("...")[1].trim()} ${getRandomObject(language)}`;
            } else {
                 sentence = `${pronoun2} ___ (${negativeElement} ${verbItem.infinitive}) ${getRandomObject(language)}`;
                 correctAnswer = negativeElement + " " + conjugateVerb(verbItem.infinitive, pronoun2, language); // e.g. don't eat
            }
            break;
        case 'question':
            const pronoun3 = getRandomPronounForLanguage(language);
            const questionElement = getQuestionElement(pronoun3, language); // e.g. Est-ce que
            sentence = `${questionElement} ${pronoun3} ___ (${verbItem.infinitive}) ${getRandomObject(language)}?`;
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
    const gapAnswerInput = document.getElementById('gap-answer'); // Get the input after it's in the DOM
    document.getElementById('check-gap').addEventListener('click', () => {
        const userAnswer = gapAnswerInput.value.trim();
        const feedback = document.getElementById('gap-feedback');
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
             feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectWellDone || '✅ Correct! Well done!'}</span>`;
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
    if (!verbData.length) { showNoDataMessage(); return; }
    const verbItem = verbData[Math.floor(Math.random() * verbData.length)];
    const exerciseTypes = ['positive', 'negative', 'question'];
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    let sentenceParts = [];
    // ... (switch case for exerciseType as in original, ensure all parts are collected)
     switch(exerciseType) {
        case 'positive':
            const pronoun = getRandomPronounForLanguage(language);
            sentenceParts = [pronoun, conjugateVerb(verbItem.infinitive, pronoun, language), getRandomObject(language), getRandomTimeExpression(language)].filter(p => p);
            break;
        case 'negative':
            const pronoun2 = getRandomPronounForLanguage(language);
            const negPart = getNegativeElement(pronoun2, language);
            if (negPart.includes("...")) { // French style "ne ... pas"
                sentenceParts = [pronoun2, negPart.split("...")[0].trim(), conjugateVerb(verbItem.infinitive, pronoun2, language), negPart.split("...")[1].trim(), getRandomObject(language), getRandomTimeExpression(language)].filter(p => p);
            } else { // English style "don't eat"
                 sentenceParts = [pronoun2, negPart, verbItem.infinitive, getRandomObject(language), getRandomTimeExpression(language)].filter(p => p);
            }
            break;
        case 'question':
            const pronoun3 = getRandomPronounForLanguage(language);
            sentenceParts = [getQuestionElement(pronoun3, language), pronoun3, conjugateVerb(verbItem.infinitive, pronoun3, language), getRandomObject(language), getRandomTimeExpression(language)+"?"].filter(p => p);
            break;
    }
    sentenceParts = sentenceParts.filter(p => p && p.trim() !== ''); // Ensure no empty parts


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
    // Drag and drop logic as in original
    const wordTiles = document.querySelectorAll('.word-tile'); /* ... */
    const wordSlots = document.querySelectorAll('.word-slot'); /* ... */
    wordTiles.forEach(tile => tile.addEventListener('dragstart', dragStart));
    wordSlots.forEach(slot => { slot.addEventListener('dragover', dragOver); slot.addEventListener('drop', drop); slot.addEventListener('dragenter', dragEnter); slot.addEventListener('dragleave', dragLeave); });

    document.getElementById('check-order').addEventListener('click', () => {
        const builtSentence = [...document.querySelectorAll('.word-slot')].map(slot => slot.textContent).join(' ').trim();
        const correctSentence = sentenceParts.join(' ').trim();
        const feedback = document.getElementById('order-feedback');
        if (builtSentence === correctSentence) {
            feedback.innerHTML = `<span class="correct">${currentTranslations.feedbackCorrectWellDone || '✅ Correct! Well done!'}</span>`;
            setTimeout(() => showWordOrder(), 3000);
        } else {
            feedback.innerHTML = `<span class="incorrect">${currentTranslations.feedbackNotQuiteCorrectOrder || '❌ Not quite. The correct order is: '}<b>${correctSentence}</b></span>`;
        }
    });
    document.getElementById('reset-order').addEventListener('click', () => { 
        document.getElementById('word-pool').innerHTML = shuffledParts.map(part => `<div class="word-tile" data-word="${part}" draggable="true">${part}</div>`).join('');
        document.querySelectorAll('.word-slot').forEach(slot => slot.innerHTML = '');
        document.getElementById('order-feedback').innerHTML = '';
        // Re-attach drag listeners to new tiles
        document.querySelectorAll('.word-tile').forEach(tile => tile.addEventListener('dragstart', dragStart));
    });
    document.getElementById('new-order').addEventListener('click', () => showWordOrder());
}

function getPronounsForLanguage(language) { /* ... as original ... */ 
    switch(language) {
        case 'COSYenglish': return ['I', 'you', 'he', 'she', 'it', 'we', 'they'];
        case 'COSYfrançais': return ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
        default: return ['I', 'you', 'he', 'she', 'it', 'we', 'they'];
    }
}
function getRandomPronounForLanguage(language) { const p = getPronounsForLanguage(language); return p[Math.floor(Math.random() * p.length)]; }
function conjugateVerb(verb, pronoun, language) { /* ... as original ... */ 
    switch(language) {
        case 'COSYenglish': if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') return verb; else return verb + 's';
        case 'COSYfrançais':
            if (pronoun === 'je') return verb.replace(/er$/, 'e'); if (pronoun === 'tu') return verb.replace(/er$/, 'es');
            if (pronoun === 'il' || pronoun === 'elle' || pronoun === 'on') return verb.replace(/er$/, 'e');
            if (pronoun === 'nous') return verb.replace(/er$/, 'ons'); if (pronoun === 'vous') return verb.replace(/er$/, 'ez');
            if (pronoun === 'ils' || pronoun === 'elles') return verb.replace(/er$/, 'ent'); return verb;
        default: return verb;
    }
}
function getNegativeElement(pronoun, language) { /* ... as original ... */ 
    switch(language) {
        case 'COSYenglish': if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') return "don't"; else return "doesn't";
        case 'COSYfrançais': return "ne ... pas";
        default: return "not";
    }
}
function getQuestionElement(pronoun, language) { /* ... as original ... */
    switch(language) {
        case 'COSYenglish': if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') return "Do"; else return "Does";
        case 'COSYfrançais': return "Est-ce que";
        default: return "Do";
    }
 }
function getRandomObject(language) { /* ... as original, ensure no hardcoded UI text ... */ 
    const objects = {'COSYenglish': ['apples', 'books', 'the car'], 'COSYfrançais': ['des pommes', 'des livres', 'la voiture']};
    const langObjects = objects[language] || objects['COSYenglish']; return langObjects[Math.floor(Math.random() * langObjects.length)];
}
function getRandomTimeExpression(language) { /* ... as original, ensure no hardcoded UI text ... */ 
    const times = {'COSYenglish': ['every day', 'now', 'often'], 'COSYfrançais': ['tous les jours', 'maintenant', 'souvent']};
    const langTimes = times[language] || times['COSYenglish']; return langTimes[Math.floor(Math.random() * langTimes.length)];
}
function isCompatibleVerbPronoun(verb, pronoun, language) { return true; }

async function startPossessivesPractice() { /* ... as original, check HTML generation if any ... */ }
async function showTypePossessive() { /* Placeholder - Add translations if HTML is generated */ }
async function showMatchPossessives() { /* Placeholder - Add translations if HTML is generated */ }

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
            continueBtn.addEventListener('click', resolve, { once: true }); // Ensure listener is removed
            const resultArea = document.getElementById('result');
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'continue-prompt';
            feedbackDiv.innerHTML = `<p>${currentTranslations.continuePromptText || 'Press continue for next exercise'}</p>`;
            feedbackDiv.appendChild(continueBtn);
            // Clear previous prompt before adding new one
            const existingPrompt = resultArea.querySelector('.continue-prompt');
            if(existingPrompt) existingPrompt.remove();
            resultArea.appendChild(feedbackDiv);
        });
    }
}

// Helper: Add randomize button to exercise containers
function addRandomizeButton(containerId, randomizeFn) {
    const container = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
    if (!container) return;
    // Remove any existing randomize button to avoid duplicates
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

// Patching grammar exercise functions for the randomize button
showArticleWord = patchExerciseForRandomizeButton(showArticleWord, '.gender-exercise', startGenderPractice);
showMatchArticlesWords = patchExerciseForRandomizeButton(showMatchArticlesWords, '.match-exercise', startGenderPractice);
showTypeVerb = patchExerciseForRandomizeButton(showTypeVerb, '.verb-exercise', startVerbsPractice);
showMatchVerbsPronouns = patchExerciseForRandomizeButton(showMatchVerbsPronouns, '.match-exercise', startVerbsPractice);
showFillGaps = patchExerciseForRandomizeButton(showFillGaps, '.fill-gap-exercise', startVerbsPractice);
showWordOrder = patchExerciseForRandomizeButton(showWordOrder, '.word-order-exercise', startVerbsPractice);

// Patching for possessives exercises (currently placeholders)
// When showTypePossessive is implemented, ensure its main container has class "possessive-exercise"
// showTypePossessive = patchExerciseForRandomizeButton(showTypePossessive, '.possessive-exercise', startPossessivesPractice);
// When showMatchPossessives is implemented, ensure its main container has class "match-exercise" (or a specific one)
// showMatchPossessives = patchExerciseForRandomizeButton(showMatchPossessives, '.match-exercise', startPossessivesPractice);

document.addEventListener('DOMContentLoaded', initGrammarPractice);
