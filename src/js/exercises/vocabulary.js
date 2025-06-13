// Functions moved to utils.js: shuffleArray, showNoDataMessage, addRandomizeButton
// Vocabulary Practice Types
const VOCABULARY_PRACTICE_TYPES = {
    'random-word': {
        exercises: ['show-word', 'opposites', 'match-opposites', 'build-word'],
        name: 'Random Word'
    },
    'random-image': {
        exercises: ['identify-image', 'match-image-word'],
        name: 'Random Image'
    },
    'listening': {
        exercises: ['transcribe-word', 'match-sound-word'],
        name: 'Listening'
    }
};

// Initialize vocabulary practice
function initVocabularyPractice() {
    // Daily Word Button
    document.getElementById('daily-word-btn')?.addEventListener('click', () => {
        showDailyWords();
    });

    // Random Word Button
    document.getElementById('random-word-btn')?.addEventListener('click', () => {
        startRandomWordPractice();
    });

    // Random Image Button
    document.getElementById('random-image-btn')?.addEventListener('click', () => {
        startRandomImagePractice();
    });

    // Listening Button
    document.getElementById('listening-btn')?.addEventListener('click', () => {
        startListeningPractice();
    });

    // Practice All Vocabulary Button
    document.getElementById('practice-all-vocab-btn')?.addEventListener('click', () => {
        practiceAllVocabulary();
    });

    // Add event listeners for daily reading, writing, and speaking buttons
    document.getElementById('daily-reading-btn')?.addEventListener('click', showDailyReading);
    document.getElementById('daily-writing-btn')?.addEventListener('click', showDailyWriting);
    document.getElementById('daily-speaking-btn')?.addEventListener('click', showDailySpeaking);
}

// Show Daily Words from dictionaries
async function showDailyWords() {
    const language = document.getElementById('language').value;
    const currentTranslations = translations[language] || translations.COSYenglish;
    const container = document.getElementById('result');
    container.innerHTML = `<div class="exercise-header daily-header">${currentTranslations.dailyWord || 'Daily Words'}</div><div class="daily-words-container" id="daily-words-list"><div class="loading-spinner"></div></div>`;
    const list = document.getElementById('daily-words-list');
    try {
        const dailyWords = await fetchDailyWordsFromDictionaries(language); // This function uses static examples
        list.innerHTML = dailyWords.map(level => `
            <div class="daily-word-level ${level.level}">
                <b>${level.word}</b> <span>– ${level.definition}</span>
                <div class="example">${level.example}</div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = `<div class="incorrect">${currentTranslations.couldNotFetchDailyWords || 'Could not fetch daily words. Try again later.'}</div>`;
    }
}

// Fetch daily words from online dictionaries (Cambridge, Oxford, etc.)
async function fetchDailyWordsFromDictionaries(language) {
    // This is a stub. In production, you would use real APIs or web scraping.
    // For demo, we link to dictionary pages and use static examples.
    // You can expand this with real API keys and fetch logic for each dictionary.
    const levels = ['beginner','elementary','intermediate','advanced'];
    const dictUrls = {
        'english': 'https://dictionary.cambridge.org/dictionary/english/',
        'french': 'https://www.larousse.fr/dictionnaires/francais-monolingue/',
        'italian': 'https://dizionari.corriere.it/dizionario_italiano/',
        'spanish': 'https://dle.rae.es/',
        'portuguese': 'https://dicionario.priberam.org/',
        'german': 'https://www.verbformen.de/',
        'greek': 'https://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/search.html?lq=',
        'russian': 'https://gramota.ru/biblioteka/slovari/bolshoj-tolkovyj-slovar/',
        'tatar': 'https://suzlek.antat.ru/',
        'armenian': 'https://bararanonline.com/',
        'bashkir': 'https://ru.wiktionary.org/wiki/'
    };
    // Example static words for demo
    const demoWords = {
        'english': [
            {word:'cat',def:'a small animal kept as a pet',ex:'The cat is sleeping.'},
            {word:'house',def:'a building for people to live in',ex:'They live in a big house.'},
            {word:'discover',def:'to find something for the first time',ex:'She discovered a new planet.'},
            {word:'resilient',def:'able to recover quickly',ex:'She is resilient in difficult times.'}
        ],
        'french': [
            {word:'chat',def:'animal domestique félin',ex:'Le chat dort.'},
            {word:'maison',def:'bâtiment pour habiter',ex:'Ils habitent une grande maison.'},
            {word:'découvrir',def:'trouver pour la première fois',ex:'Elle a découvert une planète.'},
            {word:'résilient',def:'qui résiste aux difficultés',ex:'Elle est très résiliente.'}
        ],
        'italian': [
            {word:'gatto',def:'animale domestico felino',ex:'Il gatto dorme.'},
            {word:'casa',def:'edificio in cui si abita',ex:'Vivono in una grande casa.'},
            {word:'scoprire',def:'trovare per la prima volta',ex:'Ha scoperto un nuovo pianeta.'},
            {word:'resiliente',def:'che resiste alle difficoltà',ex:'Lei è molto resiliente.'}
        ],
        'spanish': [
            {word:'gato',def:'animal doméstico felino',ex:'El gato duerme.'},
            {word:'casa',def:'edificio para vivir',ex:'Viven en una casa grande.'},
            {word:'descubrir',def:'encontrar por primera vez',ex:'Ella descubrió un planeta.'},
            {word:'resiliente',def:'que resiste las dificultades',ex:'Ella es muy resiliente.'}
        ],
        'portuguese': [
            {word:'gato',def:'animal doméstico felino',ex:'O gato está dormindo.'},
            {word:'casa',def:'edifício para morar',ex:'Eles moram em uma casa grande.'},
            {word:'descobrir',def:'encontrar pela primeira vez',ex:'Ela descobriu um planeta.'},
            {word:'resiliente',def:'que resiste às dificuldades',ex:'Ela é muito resiliente.'}
        ],
        'german': [
            {word:'Katze',def:'ein kleines Haustier',ex:'Die Katze schläft.'},
            {word:'Haus',def:'Gebäude zum Wohnen',ex:'Sie wohnen in einem großen Haus.'},
            {word:'entdecken',def:'etwas zum ersten Mal finden',ex:'Sie hat einen neuen Planeten entdeckt.'},
            {word:'resilient',def:'kann sich schnell erholen',ex:'Sie ist sehr resilient.'}
        ],
        'greek': [
            {word:'γάτα',def:'οικόσιτη γάτα',ex:'Η γάτα κοιμάται.'},
            {word:'σπίτι',def:'κτίριο για να ζεις',ex:'Μένουν σε ένα μεγάλο σπίτι.'},
            {word:'ανακαλύπτω',def:'βρίσκω για πρώτη φορά',ex:'Ανακάλυψε έναν νέο πλανήτη.'},
            {word:'ανθεκτικός',def:'που αντέχει στις δυσκολίες',ex:'Είναι πολύ ανθεκτική.'}
        ],
        'russian': [
            {word:'кот',def:'домашнее животное',ex:'Кот спит.'},
            {word:'дом',def:'здание для жилья',ex:'Они живут в большом доме.'},
            {word:'открывать',def:'находить впервые',ex:'Она открыла новую планету.'},
            {word:'устойчивый',def:'способен быстро восстанавливаться',ex:'Она очень устойчива.'}
        ],
        'tatar': [
            {word:'песи',def:'өйдә яши торган хайван',ex:'Песи йоклый.'},
            {word:'өй',def:'яшәү өчен бина',ex:'Алар зур өйдә яшиләр.'},
            {word:'ачу',def:'беренче тапкыр табу',ex:'Ул яңа планета ачты.'},
            {word:'түземле',def:'авырлыкларга чыдый',ex:'Ул бик түземле.'}
        ]
        // Add more languages as needed
    };
    // Map language select value to demoWords key
    const langMap = {
        'COSYenglish': 'english',
        'COSYfrançais': 'french',
        'COSYitaliano': 'italian',
        'COSYespañol': 'spanish',
        'COSYportuguês': 'portuguese',
        'COSYdeutsch': 'german',
        'ΚΟΖΥελληνικά': 'greek',
        'ТАКОЙрусский': 'russian',
        'COSYtatarça': 'tatar'
    };
    const langKey = langMap[language] || 'english';
    const words = demoWords[langKey] || demoWords['english'];
    return levels.map((level, i) => ({
        level,
        word: `<a href='${dictUrls[langKey] || dictUrls['english']}${encodeURIComponent(words[i]?.word||'')}' target='_blank'>${words[i]?.word||'-'}</a>`,
        definition: words[i]?.def||'-',
        example: words[i]?.ex||'-'
    }));
}

// Start random word practice with random exercise type
async function startRandomWordPractice() {
    const exercises = VOCABULARY_PRACTICE_TYPES['random-word'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'show-word':
            await showRandomWord();
            break;
        case 'opposites':
            await showOppositesExercise();
            break;
        case 'match-opposites':
            await showMatchOpposites();
            break;
        case 'build-word':
            await showBuildWord();
            break;
    }
}

// Enhanced show random word
async function showRandomWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = translations[language] || translations.COSYenglish;
    
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    if (!words.length) {
        showNoDataMessage();
        return;
    }

    const word = words[Math.floor(Math.random() * words.length)];
    const resultArea = document.getElementById('result');
    
    resultArea.innerHTML = `
        <div class="word-display-container" role="region" aria-label="${t.randomWordExercise || 'Random Word Exercise'}">
            <div class="word-display" id="displayed-word" aria-label="${t.wordToPracticeLabel || 'Word to practice'}"><b>${word}</b></div>
            <div class="word-actions">
                <button id="pronounce-word" class="btn-emoji" aria-label="${t.pronounceWord || 'Pronounce word'}">🔊</button>
                <button id="next-word" class="btn-emoji" aria-label="${t.nextWord || 'Next word'}">🔄</button>
            </div>
            <div class="word-exercise-options">
                <button class="btn-secondary" id="practice-opposite" aria-label="${t.findOppositeButtonLabel || 'Find Opposite'}">${t.findOppositeButtonLabel || '⇄ Find Opposite'}</button>
                <button class="btn-secondary" id="practice-build" aria-label="${t.buildWordButtonLabel || 'Build Word'}">${t.buildWordButtonLabel || '🔡 Build Word'}</button>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('pronounce-word').addEventListener('click', () => {
        pronounceWord(word, language);
    });

    document.getElementById('next-word').addEventListener('click', () => {
        showRandomWord();
    });

    document.getElementById('practice-opposite').addEventListener('click', async () => {
        await showOppositesExercise(word);
    });

    document.getElementById('practice-build').addEventListener('click', async () => {
        await showBuildWord(word);
    });
}

// Enhanced opposites exercise
async function showOppositesExercise(baseWord = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = translations[language] || translations.COSYenglish;
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const words = await loadVocabulary(language, days);
    const opposites = await loadOpposites(language, days);
    if (!words.length || Object.keys(opposites).length === 0) {
        showNoDataMessage();
        return;
    }
    const word = baseWord || words[Math.floor(Math.random() * words.length)];
    const opposite = opposites[word] || (t.noOppositeFound || 'No opposite found');
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="opposites-exercise" role="form" aria-label="${t.oppositesExercise || 'Opposites Exercise'}">
            <div class="word-pair">
                <div class="word-box" aria-label="${t.wordAriaLabel || 'Word'}">${word}</div>
                <div class="opposite-arrow" aria-label="${t.oppositeArrowLabel || 'Opposite arrow'}"></div>
                <div class="word-box opposite-answer" id="opposite-answer" aria-label="${t.oppositeLabel || 'Opposite'}">?</div>
            </div>
            <input type="text" id="opposite-input" class="exercise-input" aria-label="${t.typeTheOpposite || 'Type the opposite'}" placeholder="${t.typeTheOppositePlaceholder || 'Type the opposite...'}">
            <button id="check-opposite" class="btn-primary" aria-label="${t.checkAnswer || 'Check answer'}">✅ ${t.check || 'Check'}</button>
            <div id="opposite-feedback" class="exercise-feedback" aria-live="polite"></div>
            <div class="exercise-actions">
                <button id="reveal-opposite" class="btn-secondary" aria-label="${t.revealAnswer || 'Reveal Answer'}">👁️ ${t.revealAnswer || 'Reveal Answer'}</button>
                <button id="new-opposite" class="btn-secondary" aria-label="${t.newWord || 'New Word'}">🔄 ${t.newWord || 'New Word'}</button>
            </div>
        </div>
    `;
    addEnterKeySupport('opposite-input', 'check-opposite');
    document.getElementById('check-opposite').addEventListener('click', () => {
        const userAnswer = document.getElementById('opposite-input').value.trim();
        const feedback = document.getElementById('opposite-feedback');
        if (userAnswer.toLowerCase() === opposite.toLowerCase()) {
            feedback.innerHTML = `<span class="correct">${t.correct || '✅ Correct!'}</span>`;
            document.getElementById('opposite-answer').textContent = opposite;
        } else {
            feedback.innerHTML = `<span class="incorrect">${t.feedbackNotQuiteTryAgain || '❌ Try again!'}</span>`;
        }
    });
    document.getElementById('reveal-opposite').addEventListener('click', () => {
        document.getElementById('opposite-answer').textContent = opposite;
        document.getElementById('opposite-feedback').innerHTML = '';
    });
    document.getElementById('new-opposite').addEventListener('click', () => {
        showOppositesExercise();
    });
}

// Match opposites exercise
async function showMatchOpposites() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = translations[language] || translations.COSYenglish;
    
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    const opposites = await loadOpposites(language, days);
    
    if (words.length < 4 || Object.keys(opposites).length < 2) {
        showNoDataMessage();
        return;
    }

    // Select 4 word pairs
    const selectedPairs = [];
    const availableWords = [...words];
    
    while (selectedPairs.length < 4 && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords[randomIndex];
        
        if (opposites[word]) {
            selectedPairs.push({
                word: word,
                opposite: opposites[word]
            });
            availableWords.splice(randomIndex, 1);
        }
    }

    // Shuffle the words and opposites
    const wordsColumn = [...selectedPairs].sort(() => Math.random() - 0.5);
    const oppositesColumn = [...selectedPairs]
        .map(pair => pair.opposite)
        .sort(() => Math.random() - 0.5);

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-exercise" role="region" aria-label="${t.matchOppositesExercise || 'Match Opposites Exercise'}">
            <div class="match-container">
                <div class="match-col" id="words-col" aria-label="${t.wordsColumn || 'Words column'}">
                    ${wordsColumn.map((pair, index) => `
                        <div class="match-item" data-word="${pair.word}" role="button" tabindex="0" aria-label="${t.wordLabel || 'Word'}: ${pair.word}">${pair.word}</div>
                    `).join('')}
                </div>
                <div class="match-col" id="opposites-col" aria-label="${t.oppositesColumn || 'Opposites column'}">
                    ${oppositesColumn.map((opposite, index) => `
                        <div class="match-item" data-opposite="${opposite}" role="button" tabindex="0" aria-label="${t.oppositeLabel || 'Opposite'}: ${opposite}">${opposite} </div>
                    `).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="check-matches" class="btn-primary" aria-label="${t.checkMatches || 'Check Matches'}">✅ ${translations[language]?.check || 'Check'} ${t.matches || 'Matches'}</button>
            <button id="new-match" class="btn-secondary" aria-label="${t.newExercise || 'New Exercise'}">🔄 ${t.newExercise || 'New Exercise'}</button>
        </div>
    `;

    // Add matching functionality
    let selectedWord = null;
    let selectedOpposite = null;

    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedWord = this.getAttribute('data-word');
        });
    });

    document.querySelectorAll('#opposites-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!selectedWord) return;
            
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedOpposite = this.getAttribute('data-opposite');
            
            // Check if this is the correct opposite
            const correctOpposite = opposites[selectedWord];
            const feedback = document.getElementById('match-feedback');
            
            if (selectedOpposite === correctOpposite) {
                feedback.innerHTML = '<span class="correct">✅ Correct match!</span>';
                document.querySelector(`[data-word="${selectedWord}"]`).classList.add('matched');
                this.classList.add('matched');
            } else {
                feedback.innerHTML = '<span class="incorrect">❌ Not a match. Try again!</span>';
            }
            
            selectedWord = null;
            selectedOpposite = null;
        });
    });

    document.getElementById('check-matches').addEventListener('click', () => {
        // Check all matches
        const feedback = document.getElementById('match-feedback');
        feedback.innerHTML = 'Showing all correct matches...';
        
        selectedPairs.forEach(pair => {
            document.querySelector(`[data-word="${pair.word}"]`).classList.add('matched');
            document.querySelector(`[data-opposite="${pair.opposite}"]`).classList.add('matched');
        });

        setTimeout(() => {
            showMatchOpposites();
        }, 2000);
    });

    document.getElementById('new-match').addEventListener('click', () => {
        showMatchOpposites();
    });
}

// Enhanced build word exercise
async function showBuildWord(baseWord = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    if (!words.length) {
        showNoDataMessage();
        return;
    }

    const word = baseWord || words[Math.floor(Math.random() * words.length)];
    const shuffledLetters = shuffleArray([...word.toLowerCase()]);
    const t = translations[language] || translations.COSYenglish;
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="build-word-exercise">
            <div class="letter-pool" id="letter-pool">
                ${shuffledLetters.map((letter, index) => `
                    <div class="letter-tile" data-letter="${letter}" draggable="true">${letter}</div>
                `).join('')}
            </div>
            <div class="word-slots" id="word-slots">
                ${Array(word.length).fill().map(() => `
                    <div class="letter-slot"></div>
                `).join('')}
            </div>
            <div id="build-feedback"></div>
            <div class="build-actions">
                <button id="check-build" class="btn-primary">${translations[language]?.buttons?.check || 'Check'}</button>
                <button id="reset-build" class="btn-secondary">${translations[language]?.buttons?.reset || 'Reset'}</button>
                <button id="new-build" class="btn-secondary">${translations[language]?.buttons?.newExercise || 'New Word'}</button>
            </div>
        </div>
    `;

    // Add drag and drop functionality
    const letterTiles = document.querySelectorAll('.letter-tile');
    const letterSlots = document.querySelectorAll('.letter-slot');
    
    letterTiles.forEach(tile => {
        tile.addEventListener('dragstart', dragStart);
    });

    letterSlots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', drop);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
    });

    // Add button functionality
    document.getElementById('check-build').addEventListener('click', () => {
        const builtWord = [...document.querySelectorAll('.letter-slot')]
            .map(slot => slot.textContent)
            .join('');
        
        const feedback = document.getElementById('build-feedback');
        
        if (builtWord.toLowerCase() === word.toLowerCase()) {
            feedback.innerHTML = '<span class="correct">✅ Correct! Well done!</span>';
        } else {
            feedback.innerHTML = '<span class="incorrect">❌ Not quite. Keep trying!</span>';
        }
    });

    document.getElementById('reset-build').addEventListener('click', () => {
        // Return all letters to pool
        const pool = document.getElementById('letter-pool');
        const slots = document.querySelectorAll('.letter-slot');
        
        slots.forEach(slot => {
            if (slot.firstChild) {
                pool.appendChild(slot.firstChild);
            }
        });
        
        document.getElementById('build-feedback').innerHTML = '';
    });

    document.getElementById('new-build').addEventListener('click', () => {
        showBuildWord();
    });
}

// Drag and drop functions for build word exercise
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.letter);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    const draggingElement = document.querySelector('.letter-tile.dragging');
    
    if (e.target.classList.contains('letter-slot')) {
        // If slot already has a letter, swap them
        if (e.target.firstChild) {
            const pool = document.getElementById('letter-pool');
            pool.appendChild(e.target.firstChild);
        }
        
        e.target.appendChild(draggingElement);
    } else if (e.target.classList.contains('letter-tile')) {
        // Swap letters between tiles
        const temp = e.target.textContent;
        e.target.textContent = letter;
        draggingElement.textContent = temp;
    }
    
    draggingElement.classList.remove('dragging');
}

function dragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('letter-slot')) {
        e.target.classList.add('hovered');
    }
}

function dragLeave(e) {
    if (e.target.classList.contains('letter-slot')) {
        e.target.classList.remove('hovered');
    }
}

// Random image practice
async function startRandomImagePractice() {
    const exercises = VOCABULARY_PRACTICE_TYPES['random-image'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'identify-image':
            await showIdentifyImage();
            break;
        case 'match-image-word':
            await showMatchImageWord();
            break;
    }
}

// Identify image exercise
async function showIdentifyImage() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const images = await loadImageVocabulary(language, days);
    if (!images.length) {
        showNoDataMessage();
        return;
    }

    const imageItem = images[Math.floor(Math.random() * images.length)];
    const correctAnswer = imageItem.translations[language];
    const t = translations[language] || translations.COSYenglish;
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="image-exercise">
            <h3>${t.whatIsThis || 'What is this?'}</h3>
            <img src="${imageItem.src}" alt="${imageItem.alt}" class="vocabulary-image">
            <input type="text" id="image-answer" placeholder="${t.typeTheWord || 'Type the word...'}">
            <button id="check-image" class="btn-primary">${translations[language]?.buttons?.check || 'Check'}</button>
            <div id="image-feedback"></div>
            <button id="new-image" class="btn-secondary">${translations[language]?.buttons?.newExercise || 'New Image'}</button>
        </div>
    `;

    addEnterKeySupport('image-answer', 'check-image');

    document.getElementById('check-image').addEventListener('click', () => {
        const userAnswer = document.getElementById('image-answer').value.trim();
        const feedback = document.getElementById('image-feedback');
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback.innerHTML = '<span class="correct">✅ Correct!</span>';
        } else {
            feedback.innerHTML = '<span class="incorrect">❌ Not quite. Try again!</span>';
        }
    });

    document.getElementById('new-image').addEventListener('click', () => {
        showIdentifyImage();
    });
}

// Match image with word exercise
async function showMatchImageWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const images = await loadImageVocabulary(language, days);
    const words = await loadVocabulary(language, days);
    
    if (images.length < 4 || words.length < 4) {
        showNoDataMessage();
        return;
    }

    // Select 4 random images and their words
    const selectedItems = [];
    const usedIndices = new Set();
    
    while (selectedItems.length < 4 && usedIndices.size < images.length) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            const imageItem = images[randomIndex];
            selectedItems.push({
                type: 'image',
                src: imageItem.src,
                alt: imageItem.alt,
                answer: imageItem.translations[language]
            });
        }
    }

    // Add 4 random words (some might be correct matches)
    const wordIndices = new Set();
    while (selectedItems.length < 8 && wordIndices.size < words.length) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (!wordIndices.has(randomIndex)) {
            wordIndices.add(randomIndex);
            selectedItems.push({
                type: 'word',
                text: words[randomIndex]
            });
        }
    }

    // Shuffle the items
    const shuffledItems = shuffleArray(selectedItems);

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-image-word-exercise">
            <h3>${t.matchEachImageWithWord || 'Match each image with its word'}</h3>
            <div class="match-grid">
                ${shuffledItems.map(item => `
                    ${item.type === 'image' ? `
                        <div class="match-item image-item" data-answer="${item.answer}">
                            <img src="${item.src}" alt="${item.alt}">
                        </div>
                    ` : `
                        <div class="match-item word-item" data-word="${item.text}">
                            ${item.text}
                        </div>
                    `}
                `).join('')}
            </div>
            <div id="match-image-feedback"></div>
            <button id="check-image-matches" class="btn-primary">${translations[language]?.buttons?.check || 'Check'} Matches</button>
            <button id="new-image-match" class="btn-secondary" aria-label="${t.newExercise || 'New Exercise'}">🔄 ${t.newExercise || 'New Exercise'}</button>
        </div>
    `;

    // Add matching functionality
    let selectedImage = null;
    let selectedWord = null;

    document.querySelectorAll('.image-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedImage = this.getAttribute('data-answer');
            selectedWord = null;
        });
    });

    document.querySelectorAll('.word-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!selectedImage) return;
            
            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedWord = this.getAttribute('data-word');
            
            // Check if this is the correct match
            const feedback = document.getElementById('match-image-feedback');
            
            if (selectedWord === selectedImage) {
                feedback.innerHTML = '<span class="correct">✅ Correct match!</span>';
                document.querySelector(`[data-answer="${selectedImage}"]`).classList.add('matched');
                this.classList.add('matched');
            } else {
                feedback.innerHTML = '<span class="incorrect">❌ Not a match. Try again!</span>';
            }
            
            selectedImage = null;
            selectedWord = null;
        });
    });

    document.getElementById('check-image-matches').addEventListener('click', () => {
        // Check all matches
        const feedback = document.getElementById('match-image-feedback');
        feedback.innerHTML = 'Showing all correct matches...';
        
        selectedItems.filter(item => item.type === 'image').forEach(imageItem => {
            document.querySelector(`[data-answer="${imageItem.answer}"]`).classList.add('matched');
            document.querySelector(`[data-word="${imageItem.answer}"]`)?.classList.add('matched');
        });

        setTimeout(() => {
            showMatchImageWord();
        }, 2000);
    });

    document.getElementById('new-image-match').addEventListener('click', () => {
        showMatchImageWord();
    });
}

// Listening practice
async function startListeningPractice() {
    const exercises = VOCABULARY_PRACTICE_TYPES['listening'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'transcribe-word':
            await showTranscribeWord();
            break;
        case 'match-sound-word':
            await showMatchSoundWord();
            break;
    }
}

// Transcribe word exercise
async function showTranscribeWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    if (!words.length) {
        showNoDataMessage();
        return;
    }

    const word = words[Math.floor(Math.random() * words.length)];
    const resultArea = document.getElementById('result');
    const t = translations[language] || translations.COSYenglish;
    
    resultArea.innerHTML = `
        <div class="listening-exercise">
            <button id="play-word" class="btn-emoji">🔊</button>
            <input type="text" id="transcription" placeholder="${t.typeWhatYouHear || 'Type what you hear...'}">
            <button id="check-transcription" class="btn-primary">${translations[language]?.buttons?.check || 'Check'}</button>
            <div id="transcription-feedback"></div>
            <button id="new-transcription" class="btn-secondary">${translations[language]?.buttons?.newExercise || 'New Word'}</button>
        </div>
    `;

    document.getElementById('play-word').addEventListener('click', () => {
        pronounceWord(word, language);
    });

    document.getElementById('check-transcription').addEventListener('click', () => {
        const userAnswer = document.getElementById('transcription').value.trim();
        const feedback = document.getElementById('transcription-feedback');
        
        if (userAnswer.toLowerCase() === word.toLowerCase()) {
            feedback.innerHTML = '<span class="correct">✅ Correct! Well done!</span>';
        } else {
            feedback.innerHTML = '<span class="incorrect">❌ Not quite. Try again!</span>';
        }
    });

    document.getElementById('new-transcription').addEventListener('click', () => {
        showTranscribeWord();
    });
}

// Match sound with word exercise
async function showMatchSoundWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    if (words.length < 4) {
        showNoDataMessage();
        return;
    }

    // Select 4 random words
    const selectedWords = [];
    const usedIndices = new Set();
    
    while (selectedWords.length < 4 && usedIndices.size < words.length) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedWords.push(words[randomIndex]);
        }
    }

    // The word to play
    const wordToPlay = selectedWords[Math.floor(Math.random() * selectedWords.length)];
    const t = translations[language] || translations.COSYenglish;
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-sound-exercise">
            <button id="play-target-word" class="btn-emoji large">🔊</button>
            <div class="word-options">
                ${selectedWords.map(word => `
                    <button class="word-option" data-word="${word}">${word}</button>
                `).join('')}
            </div>
            <div id="sound-match-feedback"></div>
            <button id="new-sound-match" class="btn-secondary">${translations[language]?.buttons?.newExercise || 'New Exercise'}</button>
        </div>
    `;

    document.getElementById('play-target-word').addEventListener('click', () => {
        pronounceWord(wordToPlay, language);
    });

    document.querySelectorAll('.word-option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedWord = this.getAttribute('data-word');
            const feedback = document.getElementById('sound-match-feedback');
            
            if (selectedWord === wordToPlay) {
                feedback.innerHTML = '<span class="correct">✅ Correct! Well done!</span>';
                this.classList.add('correct');
            } else {
                feedback.innerHTML = '<span class="incorrect">❌ Not correct. Try again!</span>';
                this.classList.add('incorrect');
            }
        });
    });

    document.getElementById('new-sound-match').addEventListener('click', () => {
        showMatchSoundWord();
    });
}

// Practice all vocabulary exercises
async function practiceAllVocabulary() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    // Get all exercise types except daily word
    const allExercises = [
        'random-word', 'random-image', 'listening'
    ];

    // Shuffle exercises
    const shuffledExercises = shuffleArray(allExercises);
    
    // Execute each exercise in sequence
    for (const exercise of shuffledExercises) {
        switch(exercise) {
            case 'random-word':
                await startRandomWordPractice();
                break;
            case 'random-image':
                await startRandomImagePractice();
                break;
            case 'listening':
                await startListeningPractice();
                break;
        }
        
        // Wait for user to click continue or add a timer
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

// --- Daily Reading Feature ---
async function showDailyReading() {
    const language = document.getElementById('language').value;
    const container = document.getElementById('result');
    container.innerHTML = `<div class="exercise-header daily-header">Daily Reading</div><div class="daily-reading-container" id="daily-reading-list"><div class="loading-spinner"></div></div>`;
    const list = document.getElementById('daily-reading-list');
    try {
        const readings = await fetchDailyReadings(language);
        list.innerHTML = readings.map(level => `
            <div class="daily-level-label">${level.levelLabel}</div>
            <div class="daily-reading-text">${level.text}</div>
        `).join('');
    } catch (e) {
        list.innerHTML = `<div class="incorrect">Could not fetch daily readings. Try again later.</div>`;
    }
}

// Fetch daily readings related to daily words
async function fetchDailyReadings(language) {
    // For demo, generate short texts related to demo words
    const dailyWords = await fetchDailyWordsFromDictionaries(language);
    const levels = ['Beginner','Elementary','Intermediate','Advanced'];
    return levels.map((level, i) => ({
        levelLabel: level,
        text: `This is a short reading for the word <b>${dailyWords[i].word.replace(/<[^>]+>/g,'')}</b>.` // Replace with real fetch/generation logic
    }));
}

// --- Daily Writing Feature ---
async function showDailyWriting() {
    const language = document.getElementById('language').value;
    const container = document.getElementById('result');
    container.innerHTML = `<div class="exercise-header daily-header">Daily Writing</div><div class="daily-writing-container" id="daily-writing-list"><div class="loading-spinner"></div></div>`;
    const list = document.getElementById('daily-writing-list');
    try {
        const prompts = await fetchDailyWritingPrompts(language);
        list.innerHTML = prompts.map(level => `
            <div class="daily-level-label">${level.levelLabel}</div>
            <div class="daily-writing-prompt">${level.prompt}</div>
        `).join('');
    } catch (e) {
        list.innerHTML = `<div class="incorrect">Could not fetch daily writing prompts. Try again later.</div>`;
    }
}

// Fetch/generate daily writing prompts related to daily words
async function fetchDailyWritingPrompts(language) {
    const dailyWords = await fetchDailyWordsFromDictionaries(language);
    const levels = ['Beginner','Elementary','Intermediate','Advanced'];
    return levels.map((level, i) => ({
        levelLabel: level,
        prompt: `Write a sentence or short story using the word <b>${dailyWords[i].word.replace(/<[^>]+>/g,'')}</b>.` // Replace with real prompt logic
    }));
}

// --- Daily Speaking Feature ---
async function showDailySpeaking() {
    const language = document.getElementById('language').value;
    const container = document.getElementById('result');
    container.innerHTML = `<div class="exercise-header daily-header">Daily Speaking</div><div class="daily-speaking-container" id="daily-speaking-list"><div class="loading-spinner"></div></div>`;
    const list = document.getElementById('daily-speaking-list');
    try {
        const prompts = await fetchDailySpeakingPrompts(language);
        list.innerHTML = prompts.map(level => `
            <div class="daily-level-label">${level.levelLabel}</div>
            <div class="daily-speaking-prompt">${level.prompt}</div>
        `).join('');
    } catch (e) {
        list.innerHTML = `<div class="incorrect">Could not fetch daily speaking prompts. Try again later.</div>`;
    }
}

// Fetch/generate daily speaking prompts related to daily words
async function fetchDailySpeakingPrompts(language) {
    const dailyWords = await fetchDailyWordsFromDictionaries(language);
    const levels = ['Beginner','Elementary','Intermediate','Advanced'];
    return levels.map((level, i) => ({
        levelLabel: level,
        prompt: `Say something about <b>${dailyWords[i].word.replace(/<[^>]+>/g,'')}</b> or use it in a sentence.` // Replace with real prompt logic
    }));
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

// Patch all main exercise renderers to add the randomize button
const _showRandomWord = showRandomWord;
showRandomWord = async function() {
    await _showRandomWord.apply(this, arguments);
    addRandomizeButton('word-display-container', startRandomWordPractice);
};
const _showOppositesExercise = showOppositesExercise;
showOppositesExercise = async function() {
    await _showOppositesExercise.apply(this, arguments);
    addRandomizeButton('opposites-exercise', startRandomWordPractice);
};
const _showMatchOpposites = showMatchOpposites;
showMatchOpposites = async function() {
    await _showMatchOpposites.apply(this, arguments);
    addRandomizeButton('match-exercise', startRandomWordPractice);
};
const _showBuildWord = showBuildWord;
showBuildWord = async function() {
    await _showBuildWord.apply(this, arguments);
    addRandomizeButton('build-word-exercise', startRandomWordPractice);
};
const _showIdentifyImage = showIdentifyImage;
showIdentifyImage = async function() {
    await _showIdentifyImage.apply(this, arguments);
    addRandomizeButton('image-exercise', startRandomImagePractice);
};
const _showMatchImageWord = showMatchImageWord;
showMatchImageWord = async function() {
    await _showMatchImageWord.apply(this, arguments);
    addRandomizeButton('match-image-word-exercise', startRandomImagePractice);
};
const _showTranscribeWord = showTranscribeWord;
showTranscribeWord = async function() {
    await _showTranscribeWord.apply(this, arguments);
    addRandomizeButton('listening-exercise', startListeningPractice);
};
const _showMatchSoundWord = showMatchSoundWord;
showMatchSoundWord = async function() {
    await _showMatchSoundWord.apply(this, arguments);
    addRandomizeButton('match-sound-exercise', startListeningPractice);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initVocabularyPractice);