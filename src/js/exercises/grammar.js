// Data loading functions
async function loadGenderGrammar(language, day) {
    const fileMap = {
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
    if (!file) return [];
    try {
        const response = await fetch(file);
        if (!response.ok) return [];
        const data = await response.json();
        return data[day] || [];
    } catch (e) {
        return [];
    }
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
    };
    const file = fileMap[language];
    if (!file) return [];
    try {
        const response = await fetch(file);
        if (!response.ok) return [];
        const data = await response.json();
        return data[day] || [];
    } catch (e) {
        return [];
    }
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
    if (!file) return [];
    try {
        const response = await fetch(file);
        if (!response.ok) return [];
        const data = await response.json();
        return data[day] || [];
    } catch (e) {
        return [];
    }
}

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
    // Structure for future exercises
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
    // Gender Button
    document.getElementById('gender-btn')?.addEventListener('click', () => {
        startGenderPractice();
    });

    // Verbs Button
    document.getElementById('verbs-btn')?.addEventListener('click', () => {
        startVerbsPractice();
    });

    // Possessives Button
    document.getElementById('possessives-btn')?.addEventListener('click', () => {
        startPossessivesPractice();
    });

    // Practice All Grammar Button
    document.getElementById('practice-all-grammar-btn')?.addEventListener('click', () => {
        practiceAllGrammar();
    });
}

// Gender practice
async function startGenderPractice() {
    const exercises = GRAMMAR_PRACTICE_TYPES['gender'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'article-word':
            await showArticleWord();
            break;
        case 'match-articles-words':
            await showMatchArticlesWords();
            break;
    }
}

// Article-word exercise (existing)
async function showArticleWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const items = await loadGenderGrammar(language, days);
    if (!items.length) {
        showNoDataMessage();
        return;
    }

    // Get random item and determine variation
    const item = items[Math.floor(Math.random() * items.length)];
    const variations = [
        { type: 'article', question: `Article for "${item.word}"`, answer: item.article },
        { type: 'word', question: `Word for "${item.article}"`, answer: item.word }
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];

    resultArea.innerHTML = `
        <div class="gender-exercise" role="form" aria-label="Gender Exercise">
            <div class="gender-prompt" aria-label="${variation.question}">🧩 ${variation.question}</div>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="Type your answer" placeholder="Type your answer...">
            <button id="check-gender-answer-btn" class="btn-primary" aria-label="Check answer">✅ ${translations[language]?.check || 'Check'}</button>
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="new-gender-exercise" class="btn-secondary" aria-label="New Exercise">🔄 New Exercise</button>
        </div>
    `;

    document.getElementById('check-gender-answer-btn').onclick = function() {
        const userInput = document.getElementById('gender-answer-input').value.trim();
        let feedback = '';
        
        if (!userInput) {
            feedback = '<span style="color:#e67e22;">Please type your answer above.</span>';
        } else if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
            feedback = '<span style="color:#27ae60;">✅ Correct!</span>';
            setTimeout(() => showArticleWord(), 1200);
        } else {
            feedback = `<span style="color:#e74c3c;">❌ Not quite. The correct answer is: <b>${variation.answer}</b></span>`;
        }
        document.getElementById('gender-answer-feedback').innerHTML = feedback;
    };

    document.getElementById('new-gender-exercise').onclick = function() {
        showArticleWord();
    };

    addEnterKeySupport('gender-answer-input', 'check-gender-answer-btn');
}

// Match articles with words exercise
async function showMatchArticlesWords() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const genderData = await loadGenderGrammar(language, days);
    if (genderData.length < 4) {
        showNoDataMessage();
        return;
    }

    // Select 4 random items
    const selectedItems = [];
    const usedIndices = new Set();
    
    while (selectedItems.length < 4 && usedIndices.size < genderData.length) {
        const randomIndex = Math.floor(Math.random() * genderData.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedItems.push(genderData[randomIndex]);
        }
    }

    // Create columns
    const articles = selectedItems.map(item => item.article);
    const words = selectedItems.map(item => item.word);
    
    // Shuffle
    const shuffledArticles = shuffleArray([...articles]);
    const shuffledWords = shuffleArray([...words]);

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-exercise" role="region" aria-label="Match Articles and Words">
            <div class="match-container">
                <div class="match-col" id="articles-col" aria-label="Articles column">
                    ${shuffledArticles.map(article => `
                        <div class="match-item" data-article="${article}" role="button" tabindex="0" aria-label="Article: ${article}">${article} 📝</div>
                    `).join('')}
                </div>
                <div class="match-col" id="words-col" aria-label="Words column">
                    ${shuffledWords.map(word => `
                        <div class="match-item" data-word="${word}" role="button" tabindex="0" aria-label="Word: ${word}">${word} 🔤</div>
                    `).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="check-matches" class="btn-primary" aria-label="Check Matches">✅ ${translations[language]?.check || 'Check'} Matches</button>
            <button id="new-match" class="btn-secondary" aria-label="New Exercise">🔄 New Exercise</button>
        </div>
    `;

    // Add matching functionality
    let selectedArticle = null;
    let selectedWord = null;

    document.querySelectorAll('#articles-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedArticle = this.getAttribute('data-article');
            selectedWord = null;
        });
    });

    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!selectedArticle) return;
            
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedWord = this.getAttribute('data-word');
            
            // Check if this is the correct match
            const correctWord = selectedItems.find(item => item.article === selectedArticle).word;
            const feedback = document.getElementById('match-feedback');
            
            if (selectedWord === correctWord) {
                feedback.innerHTML = '<span class="correct">✅ Correct match!</span>';
                document.querySelector(`[data-article="${selectedArticle}"]`).classList.add('matched');
                this.classList.add('matched');
            } else {
                feedback.innerHTML = '<span class="incorrect">❌ Not a match. Try again!</span>';
            }
            
            selectedArticle = null;
            selectedWord = null;
        });
    });

    document.getElementById('check-matches').addEventListener('click', () => {
        // Check all matches
        const feedback = document.getElementById('match-feedback');
        feedback.innerHTML = 'Showing all correct matches...';
        
        selectedItems.forEach(item => {
            document.querySelector(`[data-article="${item.article}"]`).classList.add('matched');
            document.querySelector(`[data-word="${item.word}"]`).classList.add('matched');
        });

        // Auto-advance after a short delay
        setTimeout(() => {
            showMatchArticlesWords();
        }, 3000);
    });

    document.getElementById('new-match').addEventListener('click', () => {
        showMatchArticlesWords();
    });

    addEnterKeySupport('article-input', 'check-article-btn');
}

// Verbs practice
async function startVerbsPractice() {
    const exercises = GRAMMAR_PRACTICE_TYPES['verbs'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'type-verb':
            await showTypeVerb();
            break;
        case 'match-verbs-pronouns':
            await showMatchVerbsPronouns();
            break;
        case 'fill-gaps':
            await showFillGaps();
            break;
        case 'word-order':
            await showWordOrder();
            break;
    }
}

// Type verb exercise (existing)
// In grammar.js, update the showTypeVerb function:
async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const items = await loadVerbGrammar(language, days);
    if (!items.length) {
        showNoDataMessage();
        return;
    }

    // Get a random verb and determine exercise variation
    const item = items[Math.floor(Math.random() * items.length)];
    const variations = [
        { type: 'infinitive', prompt: `Infinitive of "${item.prompt}"` },
        { type: 'conjugated', prompt: `Conjugate "${item.infinitive}" for "${item.prompt}"` }
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    
    const correctAnswer = variation.type === 'infinitive' ? item.infinitive : item.answer;

    resultArea.innerHTML = `
        <div class="verb-exercise">
            <div class="verb-prompt">${variation.prompt}</div>
            <input type="text" id="verb-answer-input" placeholder="Type your answer...">
            <button id="check-verb-answer-btn" class="btn-primary">Check</button>
            <div id="verb-answer-feedback"></div>
            <button id="new-verb-exercise" class="btn-secondary">New Exercise</button>
        </div>
    `;

    document.getElementById('check-verb-answer-btn').onclick = function() {
        const userInput = document.getElementById('verb-answer-input').value.trim();
        let feedback = '';
        
        if (!userInput) {
            feedback = '<span style="color:#e67e22;">Please type your answer above.</span>';
        } else if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback = '<span style="color:#27ae60;">✅ Correct!</span>';
            setTimeout(() => showTypeVerb(), 1200);
        } else {
            feedback = `<span style="color:#e74c3c;">❌ Not quite. The correct answer is: <b>${correctAnswer}</b></span>`;
        }
        document.getElementById('verb-answer-feedback').innerHTML = feedback;
    };

    document.getElementById('new-verb-exercise').onclick = function() {
        showTypeVerb();
    };

    addEnterKeySupport('verb-answer-input', 'check-verb-answer-btn');
}

// Match verbs with pronouns exercise
async function showMatchVerbsPronouns() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const verbData = await loadVerbGrammar(language, days);
    if (verbData.length < 2) {
        showNoDataMessage();
        return;
    }

    // Get pronouns for the language
    const pronouns = getPronounsForLanguage(language);
    if (pronouns.length < 2) {
        showNoDataMessage();
        return;
    }

    // Select 2 verbs and 2 pronouns
    const selectedVerbs = [];
    const selectedPronouns = [];
    const usedVerbIndices = new Set();
    const usedPronounIndices = new Set();
    
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

    // Create columns
    const verbs = selectedVerbs.map(verb => verb.infinitive);
    const pronounsList = [...selectedPronouns];
    
    // Shuffle
    const shuffledVerbs = shuffleArray([...verbs]);
    const shuffledPronouns = shuffleArray([...pronounsList]);

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-exercise">
            <h3>Match each verb with its pronoun</h3>
            <div class="match-container">
                <div class="match-col" id="verbs-col">
                    ${shuffledVerbs.map(verb => `
                        <div class="match-item" data-verb="${verb}">${verb}</div>
                    `).join('')}
                </div>
                <div class="match-col" id="pronouns-col">
                    ${shuffledPronouns.map(pronoun => `
                        <div class="match-item" data-pronoun="${pronoun}">${pronoun}</div>
                    `).join('')}
                </div>
            </div>
            <div id="match-feedback"></div>
            <button id="check-matches" class="btn-primary">Check Matches</button>
            <button id="new-match" class="btn-secondary">New Exercise</button>
        </div>
    `;

    // Add matching functionality
    let selectedVerb = null;
    let selectedPronoun = null;

    document.querySelectorAll('#verbs-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedVerb = this.getAttribute('data-verb');
            selectedPronoun = null;
        });
    });

    document.querySelectorAll('#pronouns-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!selectedVerb) return;
            
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedPronoun = this.getAttribute('data-pronoun');
            
            // Check if this is a possible match (no right/wrong, just compatible)
            const feedback = document.getElementById('match-feedback');
            
            if (isCompatibleVerbPronoun(selectedVerb, selectedPronoun, language)) {
                feedback.innerHTML = '<span class="correct">✅ Good match!</span>';
                document.querySelector(`[data-verb="${selectedVerb}"]`).classList.add('matched');
                this.classList.add('matched');
            } else {
                feedback.innerHTML = '<span class="incorrect">❌ Not compatible. Try again!</span>';
            }
            
            selectedVerb = null;
            selectedPronoun = null;
        });
    });

    document.getElementById('check-matches').addEventListener('click', () => {
        // Just show feedback that all matches are done
        const feedback = document.getElementById('match-feedback');
        feedback.innerHTML = 'All possible matches completed!';

        // Auto-advance after a short delay
        setTimeout(() => {
            showMatchVerbsPronouns();
        }, 3000);
    });

    document.getElementById('new-match').addEventListener('click', () => {
        showMatchVerbsPronouns();
    });
}

// Fill gaps exercise
async function showFillGaps() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const verbData = await loadVerbGrammar(language, days);
    if (!verbData.length) {
        showNoDataMessage();
        return;
    }

    // Select a random verb
    const verbItem = verbData[Math.floor(Math.random() * verbData.length)];
    
    // Determine exercise type (positive, negative, question)
    const exerciseTypes = ['positive', 'negative', 'question'];
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    
    // Create sentence with gap
    let sentence = '';
    let gapType = '';
    let correctAnswer = '';
    
    switch(exerciseType) {
        case 'positive':
            // Example: "I ___ (eat) apples every day"
            const pronoun = getRandomPronounForLanguage(language);
            const conjugatedVerb = conjugateVerb(verbItem.infinitive, pronoun, language);
            sentence = `${pronoun} ___ (${verbItem.infinitive}) ${getRandomObject(language)}`;
            gapType = 'verb';
            correctAnswer = conjugatedVerb;
            break;
        case 'negative':
            // Example: "I ___ (not eat) apples every day"
            const pronoun2 = getRandomPronounForLanguage(language);
            const negativeElement = getNegativeElement(pronoun2, language);
            sentence = `${pronoun2} ___ (${negativeElement} ${verbItem.infinitive}) ${getRandomObject(language)}`;
            gapType = 'negative';
            correctAnswer = negativeElement;
            break;
        case 'question':
            // Example: "___ you eat apples every day?"
            const pronoun3 = getRandomPronounForLanguage(language);
            const questionElement = getQuestionElement(pronoun3, language);
            sentence = `___ ${pronoun3} ${verbItem.infinitive} ${getRandomObject(language)}?`;
            gapType = 'question';
            correctAnswer = questionElement;
            break;
    }

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="fill-gap-exercise">
            <h3>Fill in the gap:</h3>
            <div class="sentence-with-gap">${sentence}</div>
            <input type="text" id="gap-answer" placeholder="Type your answer...">
            <button id="check-gap" class="btn-primary">Check</button>
            <div id="gap-feedback"></div>
            <button id="new-gap" class="btn-secondary">New Exercise</button>
        </div>
    `;

    document.getElementById('check-gap').addEventListener('click', () => {
        const userAnswer = document.getElementById('gap-answer').value.trim();
        const feedback = document.getElementById('gap-feedback');
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback.innerHTML = '<span class="correct">✅ Correct! Well done!</span>';
        } else {
            feedback.innerHTML = `<span class="incorrect">❌ Not quite. The correct answer is: ${correctAnswer}</span>`;
        }
    });

    document.getElementById('new-gap').addEventListener('click', () => {
        showFillGaps();
    });

    addEnterKeySupport('gap-answer', 'check-gap');
}

// Word order exercise
async function showWordOrder() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const verbData = await loadVerbGrammar(language, days);
    if (!verbData.length) {
        showNoDataMessage();
        return;
    }

    // Select a random verb
    const verbItem = verbData[Math.floor(Math.random() * verbData.length)];
    
    // Determine exercise type (positive, negative, question)
    const exerciseTypes = ['positive', 'negative', 'question'];
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    
    // Create sentence parts
    let sentenceParts = [];
    
    switch(exerciseType) {
        case 'positive':
            const pronoun = getRandomPronounForLanguage(language);
            const conjugatedVerb = conjugateVerb(verbItem.infinitive, pronoun, language);
            const object = getRandomObject(language);
            const timeExpression = getRandomTimeExpression(language);
            
            sentenceParts = [
                pronoun,
                conjugatedVerb,
                object,
                timeExpression
            ];
            break;
        case 'negative':
            const pronoun2 = getRandomPronounForLanguage(language);
            const negativeElement = getNegativeElement(pronoun2, language);
            const conjugatedVerb2 = conjugateVerb(verbItem.infinitive, pronoun2, language);
            const object2 = getRandomObject(language);
            const timeExpression2 = getRandomTimeExpression(language);
            
            sentenceParts = [
                pronoun2,
                negativeElement,
                conjugatedVerb2,
                object2,
                timeExpression2
            ];
            break;
        case 'question':
            const pronoun3 = getRandomPronounForLanguage(language);
            const questionElement = getQuestionElement(pronoun3, language);
            const conjugatedVerb3 = conjugateVerb(verbItem.infinitive, pronoun3, language);
            const object3 = getRandomObject(language);
            const timeExpression3 = getRandomTimeExpression(language);
            
            sentenceParts = [
                questionElement,
                pronoun3,
                conjugatedVerb3,
                object3,
                timeExpression3
            ];
            break;
    }

    // Shuffle the parts
    const shuffledParts = shuffleArray([...sentenceParts]);

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="word-order-exercise">
            <h3>Put the words in the correct order:</h3>
            <div class="word-pool" id="word-pool">
                ${shuffledParts.map((part, index) => `
                    <div class="word-tile" data-word="${part}" draggable="true">${part}</div>
                `).join('')}
            </div>
            <div class="sentence-slots" id="sentence-slots">
                ${Array(sentenceParts.length).fill().map(() => `
                    <div class="word-slot"></div>
                `).join('')}
            </div>
            <div id="order-feedback"></div>
            <div class="order-actions">
                <button id="check-order" class="btn-primary">Check</button>
                <button id="reset-order" class="btn-secondary">Reset</button>
                <button id="new-order" class="btn-secondary">New Exercise</button>
            </div>
        </div>
    `;

    // Add drag and drop functionality (similar to vocabulary build-word exercise)
    const wordTiles = document.querySelectorAll('.word-tile');
    const wordSlots = document.querySelectorAll('.word-slot');
    
    wordTiles.forEach(tile => {
        tile.addEventListener('dragstart', dragStart);
    });

    wordSlots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', drop);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
    });

    // Add button functionality
    document.getElementById('check-order').addEventListener('click', () => {
        const builtSentence = [...document.querySelectorAll('.word-slot')]
            .map(slot => slot.textContent)
            .join(' ');
        
        const correctSentence = sentenceParts.join(' ');
        const feedback = document.getElementById('order-feedback');
        
        if (builtSentence === correctSentence) {
            feedback.innerHTML = '<span class="correct">✅ Correct! Well done!</span>';
        } else {
            feedback.innerHTML = `<span class="incorrect">❌ Not quite. The correct order is: ${correctSentence}</span>`;
        }

        // Auto-advance after a short delay if correct
        if (builtSentence === correctSentence) {
            setTimeout(() => {
                showWordOrder();
            }, 3000);
        }
    });

    document.getElementById('reset-order').addEventListener('click', () => {
        // Return all words to pool
        const pool = document.getElementById('word-pool');
        const slots = document.querySelectorAll('.word-slot');
        
        slots.forEach(slot => {
            if (slot.firstChild) {
                pool.appendChild(slot.firstChild);
            }
        });
        
        document.getElementById('order-feedback').innerHTML = '';
    });

    document.getElementById('new-order').addEventListener('click', () => {
        showWordOrder();
    });

    addEnterKeySupport('gap-answer', 'check-gap');
}

// Helper functions for verbs
function getPronounsForLanguage(language) {
    // Return pronouns for the language
    switch(language) {
        case 'COSYenglish':
            return ['I', 'you', 'he', 'she', 'it', 'we', 'they'];
        case 'COSYfrançais':
            return ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
        // Add other languages...
        default:
            return ['I', 'you', 'he', 'she', 'it', 'we', 'they'];
    }
}

function getRandomPronounForLanguage(language) {
    const pronouns = getPronounsForLanguage(language);
    return pronouns[Math.floor(Math.random() * pronouns.length)];
}

function conjugateVerb(verb, pronoun, language) {
    // Very basic conjugation - should be expanded per language
    switch(language) {
        case 'COSYenglish':
            if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') {
                return verb;
            } else { // he, she, it
                return verb + 's';
            }
        case 'COSYfrançais':
            // Basic French conjugation
            if (pronoun === 'je') return verb.replace(/er$/, 'e');
            if (pronoun === 'tu') return verb.replace(/er$/, 'es');
            if (pronoun === 'il' || pronoun === 'elle' || pronoun === 'on') return verb.replace(/er$/, 'e');
            if (pronoun === 'nous') return verb.replace(/er$/, 'ons');
            if (pronoun === 'vous') return verb.replace(/er$/, 'ez');
            if (pronoun === 'ils' || pronoun === 'elles') return verb.replace(/er$/, 'ent');
            return verb;
        // Add other languages...
        default:
            return verb;
    }
}

function getNegativeElement(pronoun, language) {
    switch(language) {
        case 'COSYenglish':
            if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') {
                return "don't";
            } else { // he, she, it
                return "doesn't";
            }
        case 'COSYfrançais':
            return "ne ... pas";
        // Add other languages...
        default:
            return "not";
    }
}

function getQuestionElement(pronoun, language) {
    switch(language) {
        case 'COSYenglish':
            if (pronoun === 'I' || pronoun === 'you' || pronoun === 'we' || pronoun === 'they') {
                return "Do";
            } else { // he, she, it
                return "Does";
            }
        case 'COSYfrançais':
            return "Est-ce que";
        // Add other languages...
        default:
            return "Do";
    }
}

function getRandomObject(language) {
    const objects = {
        'COSYenglish': ['apples', 'books', 'the car', 'a house', 'the dog', 'a cat'],
        'COSYfrançais': ['des pommes', 'des livres', 'la voiture', 'une maison', 'le chien', 'un chat'],
        // Add other languages...
    };
    
    const langObjects = objects[language] || objects['COSYenglish'];
    return langObjects[Math.floor(Math.random() * langObjects.length)];
}

function getRandomTimeExpression(language) {
    const times = {
        'COSYenglish': ['every day', 'now', 'often', 'sometimes', 'usually'],
        'COSYfrançais': ['tous les jours', 'maintenant', 'souvent', 'parfois', 'd habitude'],
        // Add other languages...
    };
    
    const langTimes = times[language] || times['COSYenglish'];
    return langTimes[Math.floor(Math.random() * langTimes.length)];
}

function isCompatibleVerbPronoun(verb, pronoun, language) {
    // Very basic check - should be expanded
    return true;
}

// Possessives practice
async function startPossessivesPractice() {
    const exercises = GRAMMAR_PRACTICE_TYPES['possessives'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'type-possessive':
            await showTypePossessive();
            break;
        case 'match-possessives':
            await showMatchPossessives();
            break;
    }
}

// Type possessive exercise
async function showTypePossessive() {
    // Similar to type verb exercise
}

// Match possessives exercise
async function showMatchPossessives() {
    // Similar to match articles/words exercise
}

// Practice all grammar exercises
async function practiceAllGrammar() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    // Get all available grammar types for the selected day
    const availableTypes = [];
    const day = parseInt(days[0]);
    
    if (day >= 1 && language !== 'COSYenglish') {
        availableTypes.push('gender');
    }
    if (day >= 2) {
        availableTypes.push('verbs');
    }
    if (day >= 3) {
        availableTypes.push('possessives');
    }
    // Add other types as needed

    if (availableTypes.length === 0) {
        showNoDataMessage();
        return;
    }

    // Shuffle exercises
    const shuffledTypes = shuffleArray(availableTypes);
    
    // Execute each exercise in sequence
    for (const type of shuffledTypes) {
        switch(type) {
            case 'gender':
                await startGenderPractice();
                break;
            case 'verbs':
                await startVerbsPractice();
                break;
            case 'possessives':
                await startPossessivesPractice();
                break;
        }
        
        // Wait for user to click continue
        await new Promise(resolve => {
            const continueBtn = document.createElement('button');
            continueBtn.className = 'btn-primary';
            continueBtn.textContent = 'Continue';
            continueBtn.addEventListener('click', resolve);
            
            const resultArea = document.getElementById('result');
            const feedback = document.createElement('div');
            feedback.className = 'continue-prompt';
            feedback.innerHTML = '<p>Press continue for next exercise</p>';
            feedback.appendChild(continueBtn);
            
            resultArea.appendChild(feedback);
        });
    }
}

// Helper functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showNoDataMessage() {
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<p class="no-data">No data available for selected day/language.</p>';
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

// Patch all main grammar exercise renderers to add the randomize button
const _showArticleWord = showArticleWord;
showArticleWord = async function() {
    await _showArticleWord.apply(this, arguments);
    addRandomizeButton('gender-exercise', startGenderPractice);
};
const _showMatchArticlesWords = showMatchArticlesWords;
showMatchArticlesWords = async function() {
    await _showMatchArticlesWords.apply(this, arguments);
    addRandomizeButton('match-exercise', startGenderPractice);
};
const _showTypeVerb = showTypeVerb;
showTypeVerb = async function() {
    await _showTypeVerb.apply(this, arguments);
    addRandomizeButton('verb-exercise', startVerbsPractice);
};
const _showMatchVerbsPronouns = showMatchVerbsPronouns;
showMatchVerbsPronouns = async function() {
    await _showMatchVerbsPronouns.apply(this, arguments);
    addRandomizeButton('match-exercise', startVerbsPractice);
};
const _showFillGaps = showFillGaps;
showFillGaps = async function() {
    await _showFillGaps.apply(this, arguments);
    addRandomizeButton('fill-gap-exercise', startVerbsPractice);
};
const _showWordOrder = showWordOrder;
showWordOrder = async function() {
    await _showWordOrder.apply(this, arguments);
    addRandomizeButton('word-order-exercise', startVerbsPractice);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGrammarPractice);

