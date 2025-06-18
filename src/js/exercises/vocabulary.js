// Functions moved to utils.js: shuffleArray, showNoDataMessage, addRandomizeButton

// Data loading functions
/**
 * Gets the vocabulary file path for the given language.
 * @param {string} language The selected language.
 * @returns {string} The path to the vocabulary file.
 */
function getVocabularyFile(language) {
  // Language mapping for file names
  const langMap = {
    'COSYenglish': 'english',
    'COSYfrançais': 'french',
    'COSYespañol': 'spanish',
    'COSYitaliano': 'italian',
    'COSYdeutsch': 'german',
    'COSYportuguês': 'portuguese',
    'ΚΟΖΥελληνικά': 'greek',
    'ТАКОЙрусский': 'russian',
    'ԾՈՍՅհայկական': 'armenian',
    'COSYbrezhoneg': 'breton',
    'COSYtatarça': 'tatar',
    'COSYbashkort': 'bashkir'
  };
  const langFile = langMap[language] || 'english'; // Default to English if no mapping
  return `data/vocabulary/words/${langFile}.json`;
}

/**
 * Loads vocabulary for the given language and day(s).
 * @param {string} language The selected language.
 * @param {string|string[]} day The selected day(s).
 * @returns {Promise<string[]>} A promise that resolves to an array of words.
 */
async function loadVocabulary(language, day) {
  const filePath = getVocabularyFile(language);
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    let words = [];
    if (Array.isArray(day)) {
      day.forEach(d => {
        if (data[d]) words = words.concat(data[d]);
      });
    } else {
      if (data[day]) words = data[day];
    }
    return words;
  } catch (e) {
    console.error("Error loading vocabulary:", e);
    return []; // Return empty array on error
  }
}

/**
 * Loads image vocabulary for the given language and day(s).
 * @param {string} language The selected language.
 * @param {string|string[]} day The selected day(s).
 * @returns {Promise<object[]>} A promise that resolves to an array of image objects.
 */
async function loadImageVocabulary(language, day) {
  const filePath = `data/vocabulary/images/images.json`; // Assuming a single file for all image metadata
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    let images = [];
    if (Array.isArray(day)) {
      day.forEach(d => {
        if (data[d]) images = images.concat(data[d]);
      });
    } else {
      if (data[day]) images = data[day];
    }
    // Filter images that have a translation for the current language
    return images.filter(img => img.translations && img.translations[language]);
  } catch (e) {
    console.error("Error loading image vocabulary:", e);
    return [];
  }
}

/**
 * Gets the opposites file path for the given language.
 * @param {string} language The selected language.
 * @returns {string} The path to the opposites file.
 */
function getOppositesFile(language) {
  const langMap = {
    'COSYenglish': 'english',
    'COSYfrançais': 'french',
    'COSYespañol': 'spanish',
    'COSYitaliano': 'italian',
    'COSYdeutsch': 'german',
    'COSYportuguês': 'portuguese',
    'ΚΟΖΥελληνικά': 'greek',
    'ТАКОЙрусский': 'russian',
    'ԾՈՍՅհայկական': 'armenian',
    'COSYbrezhoneg': 'breton',
    'COSYtatarça': 'tatar',
    'COSYbashkort': 'bashkir'
  };
  const langFile = langMap[language] || 'english';
  return `data/vocabulary/opposites/${langFile}.json`;
}

/**
 * Loads opposites for the given language and day(s).
 * @param {string} language The selected language.
 * @param {string|string[]} day The selected day(s).
 * @returns {Promise<object>} A promise that resolves to an object of opposites.
 */
async function loadOpposites(language, day) {
  const filePath = getOppositesFile(language);
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    let opposites = {};
    if (Array.isArray(day)) {
      day.forEach(d => {
        if (data[d]) Object.assign(opposites, data[d]);
      });
    } else {
      if (data[day]) opposites = data[day];
    }
    return opposites;
  } catch (e) {
    console.error("Error loading opposites:", e);
    return {}; // Return empty object on error
  }
}

// Vocabulary Practice Types
const VOCABULARY_PRACTICE_TYPES = {
    'random-word': {
        exercises: ['show-word', 'opposites', 'match-opposites', 'build-word'],
        name: 'Random Word'
    },
    'random-image': {
        exercises: ['identify-image', 'match-image-word', 'match-pictures-words'],
        name: 'Random Image'
    },
    'listening': {
        exercises: ['transcribe-word', 'match-sound-word'],
        name: 'Listening'
    }
};

// Initialize vocabulary practice
function initVocabularyPractice() {

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
    if (!Array.isArray(words) || !words.length) {
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
                <button id="say-word-mc" class="btn-emoji" title="Say it (Microphone Check)">🎤</button> 
                <button id="next-word" class="btn-emoji" aria-label="${t.buttons?.newWord || t.nextWord || 'New Word'}">🔄 ${t.buttons?.newWord || 'New Word'}</button>
            </div>
            <div id="pronunciation-feedback" style="margin-top:10px; text-align:center;"></div>
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
                <div class="opposite-arrow" aria-label="${t.oppositeArrowLabel || 'Opposite arrow'}">≠</div>
                <div class="word-box opposite-answer" id="opposite-answer" aria-label="${t.oppositeLabel || 'Opposite'}">?</div>
            </div>
            <input type="text" id="opposite-input" class="exercise-input" aria-label="${t.typeTheOpposite || 'Type the opposite'}" placeholder="${t.typeTheOppositePlaceholder || 'Type the opposite...'}">
            <button id="check-opposite" class="btn-primary" aria-label="${t.checkAnswer || 'Check answer'}">✅ ${t.check || 'Check'}</button>
            <div id="opposite-feedback" class="exercise-feedback" aria-live="polite"></div>
            <div class="exercise-actions">
                <button id="reveal-opposite" class="btn-secondary" aria-label="${t.revealAnswer || 'Reveal Answer'}">👁️ ${t.revealAnswer || 'Reveal Answer'}</button>
                <button id="new-opposite" class="btn-secondary" aria-label="${t.buttons?.newWord || t.newWord || 'New Word'}">🔄 ${t.buttons?.newWord || 'New Word'}</button>
            </div>
        </div>
    `;
    addEnterKeySupport('opposite-input', 'check-opposite');
    document.getElementById('check-opposite').addEventListener('click', () => {
        const userAnswer = document.getElementById('opposite-input').value.trim();
        const feedback = document.getElementById('opposite-feedback');
        if (userAnswer.toLowerCase() === opposite.toLowerCase()) {
            feedback.innerHTML = `<span class="correct" aria-label="Correct">✅👏 ${t.correct || 'Correct!'}</span>`;
            CosyAppInteractive.awardCorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word, true);
            if (opposite !== (t.noOppositeFound || 'No opposite found')) { // Only schedule if a real opposite exists
                CosyAppInteractive.scheduleReview(language, 'vocabulary-word', opposite, true);
            }
            document.getElementById('opposite-answer').textContent = opposite;
        } else {
            feedback.innerHTML = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${t.feedbackNotQuiteTryAgain || 'Try again!'}</span>`;
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
                <button id="new-build" class="btn-secondary">🔄 ${t.buttons?.newWord || 'New Word'}</button>
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
            <h3>🖼️ ${t.whatIsThis || 'What is this?'}</h3>
            <img src="${imageItem.src}" alt="${imageItem.alt}" class="vocabulary-image">
            <input type="text" id="image-answer" placeholder="${t.typeTheWord || 'Type the word...'}">
            <button id="check-image" class="btn-primary">${translations[language]?.buttons?.check || 'Check'}</button>
            <div id="image-feedback"></div>
            <button id="new-image" class="btn-secondary">🔄 ${t.buttons?.newWord || 'New Word'}</button>
        </div>
    `;

    addEnterKeySupport('image-answer', 'check-image');

    document.getElementById('check-image').addEventListener('click', () => {
        const userAnswer = document.getElementById('image-answer').value.trim();
        const feedback = document.getElementById('image-feedback');
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedback.innerHTML = '<span class="correct" aria-label="Correct">✅👏 Correct!</span>';
        } else {
            feedback.innerHTML = '<span class="incorrect" aria-label="Incorrect">❌🤔 Not quite. Try again!</span>';
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
            <h3>🖼️ ${t.matchEachImageWithWord || 'Match each image with its word'}</h3>
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
            <button id="new-transcription" class="btn-secondary">🔄 ${t.buttons?.newWord || 'New Word'}</button>
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
            feedback.innerHTML = `<span class="incorrect" aria-label="Incorrect">❌🤔 Not quite. Try again!</span> The correct answer is: <b class="correct-answer-display">${correctAnswer}</b>`;
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

    // Get all exercise types
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

// Patch all main vocabulary exercise renderers for randomize button and unified container
showRandomWord = patchExerciseForRandomizeButton(showRandomWord, '.word-display-container', startRandomWordPractice);
showOppositesExercise = patchExerciseForRandomizeButton(showOppositesExercise, '.opposites-exercise', startRandomWordPractice);
showMatchOpposites = patchExerciseForRandomizeButton(showMatchOpposites, '.match-exercise', startRandomWordPractice);
showBuildWord = patchExerciseForRandomizeButton(showBuildWord, '.build-word-exercise', startRandomWordPractice);
showIdentifyImage = patchExerciseForRandomizeButton(showIdentifyImage, '.image-exercise', startRandomImagePractice);
showMatchImageWord = patchExerciseForRandomizeButton(showMatchImageWord, '.match-image-word-exercise', startRandomImagePractice);
showTranscribeWord = patchExerciseForRandomizeButton(showTranscribeWord, '.listening-exercise', startListeningPractice);
showMatchSoundWord = patchExerciseForRandomizeButton(showMatchSoundWord, '.match-sound-exercise', startListeningPractice);

// --- PATCH: Always include required pairs for day 1 in match opposites and match image-word ---
const REQUIRED_DAY1_OPPOSITES = [
    { base: 'hello', opposite: 'goodbye' },
    { base: 'yes', opposite: 'no' },
    { base: 'thank you', opposite: "you're welcome" }
];

// Helper to get translations for required pairs in current language
async function getRequiredDay1Pairs(language) {
    const words = await loadVocabulary(language, '1');
    const opposites = await loadOpposites(language, '1'); // Language-specific opposites
    let pairs = [];

    for (const req of REQUIRED_DAY1_OPPOSITES) {
        let baseWord = words.find(w => w.toLowerCase() === req.base.toLowerCase());
        let oppWord = null;

        if (baseWord) { // Only proceed if baseWord is found in the target language
            // Try to find the direct opposite in the target language's opposites map
            if (opposites[baseWord]) {
                oppWord = opposites[baseWord];
            } else {
                // If not in map, try to find the English opposite word in the target language's general word list
                // This assumes the English 'req.opposite' might exist as a standalone word.
                oppWord = words.find(w => w.toLowerCase() === req.opposite.toLowerCase());
            }
        }
        
        // If both baseWord and oppWord were successfully found (i.e., translated/existed in target language)
        if (baseWord && oppWord) {
            // Ensure this pair is actually an opposite in the target language's data, if possible.
            // This check is a bit redundant if opposites[baseWord] was used, but good for the alternative path.
            // For Day 1 required pairs, trust the structure even if not explicitly in opposites.json for the target lang
            // (e.g. "thank you" / "you're welcome" might not be formal opposites but are a pair)
             pairs.push({
                word: baseWord,
                opposite: oppWord
            });
        }
        // If baseWord or oppWord is not found in the target language, this pair is skipped (no English fallback).
    }
    return pairs;
}

// PATCH showMatchOpposites
const _origShowMatchOpposites = showMatchOpposites;
showMatchOpposites = async function() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    // If day 1 is selected (alone or in range), always include required pairs
    if (days && days.includes('1')) {
        const t = translations[language] || translations.COSYenglish;
        const words = await loadVocabulary(language, days);
        const opposites = await loadOpposites(language, days);
        let selectedPairs = await getRequiredDay1Pairs(language);
        // Add additional random pairs if needed
        const availableWords = [...words];
        // Remove required words from availableWords
        selectedPairs.forEach(pair => {
            const idx = availableWords.indexOf(pair.word);
            if (idx !== -1) availableWords.splice(idx, 1);
        });
        while (selectedPairs.length < 4 && availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            const word = availableWords[randomIndex];
            if (opposites[word]) {
                selectedPairs.push({ word, opposite: opposites[word] });
                availableWords.splice(randomIndex, 1);
            }
        }
        // Shuffle columns
        const wordsColumn = [...selectedPairs].sort(() => Math.random() - 0.5);
        const oppositesColumn = [...selectedPairs].map(pair => pair.opposite).sort(() => Math.random() - 0.5);
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
        // ...existing code for event listeners...
        let selectedWord = null;
        let selectedOpposite = null;
        let selectedWordEl = null; // To store the element itself
        let selectedOppositeEl = null; // To store the element itself

        document.querySelectorAll('#words-col .match-item').forEach(item => {
            item.addEventListener('click', function() {
                if (this.classList.contains('matched')) return;

                // Toggle mechanism
                if (selectedWordEl === this) {
                    this.classList.remove('selected');
                    selectedWordEl = null;
                    selectedWord = null;
                    // playSound('deselect'); // Optional: consider a different sound
                    return;
                }
                playSound('select');
                // Deselect previously selected item in this column
                if (selectedWordEl) {
                    selectedWordEl.classList.remove('selected');
                }
                
                this.classList.add('selected');
                selectedWordEl = this;
                selectedWord = this.getAttribute('data-word');
                
                // If an opposite is already selected, attempt to match
                if (selectedOppositeEl) {
                    checkOppositesMatchAttemptPatched();
                }
            });
        });

        document.querySelectorAll('#opposites-col .match-item').forEach(item => {
            item.addEventListener('click', function() {
                if (this.classList.contains('matched')) return;

                // Toggle mechanism
                if (selectedOppositeEl === this) {
                    this.classList.remove('selected');
                    selectedOppositeEl = null;
                    selectedOpposite = null;
                    // playSound('deselect'); // Optional: consider a different sound
                    return;
                }
                playSound('select');
                if (!selectedWordEl) { // Nothing selected in the first column yet
                    CosyAppInteractive.showToast(t.selectWordFirstToast || "Please select a word from the first column first.");
                    return;
                }

                // Deselect previously selected item in this column
                if (selectedOppositeEl) {
                    selectedOppositeEl.classList.remove('selected');
                }

                this.classList.add('selected');
                selectedOppositeEl = this;
                selectedOpposite = this.getAttribute('data-opposite');
                
                checkOppositesMatchAttemptPatched();
            });
        });

        function checkOppositesMatchAttemptPatched() {
            if (selectedWordEl && selectedOppositeEl) {
                const wordValue = selectedWord; // Already stored
                const oppositeValue = selectedOpposite; // Already stored
                const correctOppositePair = selectedPairs.find(p => p.word === wordValue);
                const feedback = document.getElementById('match-feedback');

                if (correctOppositePair && oppositeValue === correctOppositePair.opposite) {
                    feedback.innerHTML = '<span class="correct">✅ Correct match!</span>';
                    CosyAppInteractive.awardCorrectAnswer();
                    if (wordValue && oppositeValue) { 
                        CosyAppInteractive.scheduleReview(language, 'vocabulary-word', wordValue, true);
                        CosyAppInteractive.scheduleReview(language, 'vocabulary-word', oppositeValue, true);
                    }
                    selectedWordEl.classList.add('matched', 'disabled');
                    selectedOppositeEl.classList.add('matched', 'disabled');
                    selectedWordEl.classList.remove('selected');
                    selectedOppositeEl.classList.remove('selected');
                    
                    const allMatched = selectedPairs.length === document.querySelectorAll('.match-item.matched').length / 2;
                    if (allMatched) {
                        feedback.innerHTML += `<br><span class="correct">${t.feedbackAllMatchesCompleted || 'All pairs matched!'}</span>`;
                        setTimeout(() => showMatchOpposites(), 2000);
                    }
                } else {
                    feedback.innerHTML = '<span class="incorrect">❌ Not a match. Try again!</span>';
                    CosyAppInteractive.awardIncorrectAnswer();
                    selectedWordEl.classList.remove('selected');
                    selectedOppositeEl.classList.remove('selected');
                }
                selectedWord = null;
                selectedOpposite = null;
                selectedWordEl = null;
                selectedOppositeEl = null;
            }
        }
        document.getElementById('check-matches').addEventListener('click', () => {
            const feedback = document.getElementById('match-feedback');
            feedback.innerHTML = 'Showing all correct matches...';
            selectedPairs.forEach(pair => {
                document.querySelector(`[data-word="${pair.word}"]`).classList.add('matched');
                document.querySelector(`[data-opposite="${pair.opposite}"]`).classList.add('matched');
            });
            // Removed setTimeout for immediate UI update
        });
        document.getElementById('new-match').addEventListener('click', () => {
            showMatchOpposites();
        });
        return;
    }
    // ...existing code...
    await _origShowMatchOpposites.apply(this, arguments);
};

// PATCH showMatchImageWord
const _origShowMatchImageWord = showMatchImageWord;
showMatchImageWord = async function() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    if (days && days.includes('1')) {
        const t = translations[language] || translations.COSYenglish;
        const images = await loadImageVocabulary(language, days);
        const words = await loadVocabulary(language, days);
        // Find required image-word pairs for day 1
        let requiredPairs = [];
        for (const req of REQUIRED_DAY1_OPPOSITES) {
            // Find image for base word
            const imageItem = images.find(img => img.translations && img.translations[language] && img.translations[language].toLowerCase() === req.base.toLowerCase());
            if (imageItem) {
                requiredPairs.push({
                    type: 'image',
                    src: imageItem.src,
                    alt: imageItem.alt,
                    answer: imageItem.translations[language]
                });
            }
        }
        // Add 4 random images if needed
        const usedIndices = new Set();
        images.forEach((img, idx) => {
            if (requiredPairs.find(p => p.answer === img.translations[language])) usedIndices.add(idx);
        });
        while (requiredPairs.length < 4 && usedIndices.size < images.length) {
            const randomIndex = Math.floor(Math.random() * images.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                const imageItem = images[randomIndex];
                requiredPairs.push({
                    type: 'image',
                    src: imageItem.src,
                    alt: imageItem.alt,
                    answer: imageItem.translations[language]
                });
            }
        }
        // Add 4 random words (some might be correct matches)
        const selectedItems = [...requiredPairs];
        const wordIndices = new Set();
        requiredPairs.forEach(pair => {
            const idx = words.indexOf(pair.answer);
            if (idx !== -1) wordIndices.add(idx);
        });
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
                <h3>🖼️ ${t.matchEachImageWithWord || 'Match each image with its word'}</h3>
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
        // ...existing code for event listeners...
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
            const feedback = document.getElementById('match-image-feedback');
            feedback.innerHTML = 'Showing all correct matches...';
            requiredPairs.forEach(imageItem => {
                document.querySelector(`[data-answer="${imageItem.answer}"]`).classList.add('matched');
                document.querySelector(`[data-word="${imageItem.answer}"]`)?.classList.add('matched');
            });
            // Removed setTimeout for immediate UI update
        });
        document.getElementById('new-image-match').addEventListener('click', () => {
            showMatchImageWord();
        });
        return;
    }
    // ...existing code...
    await _origShowMatchImageWord.apply(this, arguments);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initVocabularyPractice);