// src/js/vocabulary.js

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
}

// Show Daily Words from dictionaries
async function showDailyWords() {
    const language = document.getElementById('language').value;
    if (!language) {
        alert('Please select a language first');
        return;
    }

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const words = await fetchDailyWords(language);
        resultArea.innerHTML = `
            <div class="daily-words-container">
                <div class="daily-word-level beginner">
                    <h3>Beginner</h3>
                    <p><strong>${words.beginner.word}</strong>: ${words.beginner.definition}</p>
                    <p class="example">Example: ${words.beginner.example}</p>
                </div>
                <div class="daily-word-level elementary">
                    <h3>Elementary</h3>
                    <p><strong>${words.elementary.word}</strong>: ${words.elementary.definition}</p>
                    <p class="example">Example: ${words.elementary.example}</p>
                </div>
                <div class="daily-word-level intermediate">
                    <h3>Intermediate</h3>
                    <p><strong>${words.intermediate.word}</strong>: ${words.intermediate.definition}</p>
                    <p class="example">Example: ${words.intermediate.example}</p>
                </div>
                <div class="daily-word-level advanced">
                    <h3>Advanced</h3>
                    <p><strong>${words.advanced.word}</strong>: ${words.advanced.definition}</p>
                    <p class="example">Example: ${words.advanced.example}</p>
                </div>
                <button id="pronounce-daily-words" class="btn-secondary">🔊 Pronounce All</button>
            </div>
        `;

        document.getElementById('pronounce-daily-words').addEventListener('click', () => {
            pronounceDailyWords(words, language);
        });
    } catch (error) {
        resultArea.innerHTML = `<p class="error">Could not load daily words. Please try again later.</p>`;
    }
}

// Fetch daily words from dictionary APIs
async function fetchDailyWords(language) {
    // This would actually call dictionary APIs in production
    // For now, we'll use mock data
    const dictionaries = {
        'COSYenglish': {
            beginner: {
                word: 'hello',
                definition: 'used as a greeting',
                example: 'Hello, how are you?'
            },
            // ... other levels and languages
        },
        // ... other languages
    };

    return dictionaries[language] || dictionaries['COSYenglish'];
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
    
    resultArea.innerHTML = `
        <div class="word-display-container">
            <div class="word-display" id="displayed-word">${word}</div>
            <div class="word-actions">
                <button id="pronounce-word" class="btn-emoji">🔊</button>
                <button id="next-word" class="btn-emoji">🔄</button>
            </div>
            <div class="word-exercise-options">
                <button class="btn-secondary" id="practice-opposite">Find Opposite</button>
                <button class="btn-secondary" id="practice-build">Build Word</button>
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
    
    if (!language || !days.length) {
        alert('Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    const opposites = await loadOpposites(language, days);
    
    if (!words.length || Object.keys(opposites).length === 0) {
        showNoDataMessage();
        return;
    }

    const word = baseWord || words[Math.floor(Math.random() * words.length)];
    const opposite = opposites[word] || 'No opposite found';

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="opposites-exercise">
            <h3>Find the opposite of:</h3>
            <div class="word-pair">
                <div class="word-box">${word}</div>
                <div class="opposite-arrow">⇄</div>
                <div class="word-box opposite-answer" id="opposite-answer">?</div>
            </div>
            <input type="text" id="opposite-input" placeholder="Type the opposite...">
            <button id="check-opposite" class="btn-primary">Check</button>
            <div id="opposite-feedback"></div>
            <div class="exercise-actions">
                <button id="reveal-opposite" class="btn-secondary">Reveal Answer</button>
                <button id="new-opposite" class="btn-secondary">New Word</button>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('check-opposite').addEventListener('click', () => {
        const userAnswer = document.getElementById('opposite-input').value.trim();
        const feedback = document.getElementById('opposite-feedback');
        
        if (userAnswer.toLowerCase() === opposite.toLowerCase()) {
            feedback.innerHTML = '<span class="correct">✅ Correct!</span>';
            document.getElementById('opposite-answer').textContent = opposite;
        } else {
            feedback.innerHTML = '<span class="incorrect">❌ Try again!</span>';
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
        alert('Please select language and day(s) first');
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
        <div class="match-exercise">
            <h3>Match each word with its opposite</h3>
            <div class="match-container">
                <div class="match-col" id="words-col">
                    ${wordsColumn.map((pair, index) => `
                        <div class="match-item" data-word="${pair.word}">${pair.word}</div>
                    `).join('')}
                </div>
                <div class="match-col" id="opposites-col">
                    ${oppositesColumn.map((opposite, index) => `
                        <div class="match-item" data-opposite="${opposite}">${opposite}</div>
                    `).join('')}
                </div>
            </div>
            <div id="match-feedback"></div>
            <button id="check-matches" class="btn-primary">Check Matches</button>
            <button id="new-match" class="btn-secondary">New Exercise</button>
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
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="build-word-exercise">
            <h3>Build the word from these letters:</h3>
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
                <button id="check-build" class="btn-primary">Check</button>
                <button id="reset-build" class="btn-secondary">Reset</button>
                <button id="new-build" class="btn-secondary">New Word</button>
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
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="image-exercise">
            <h3>What is this?</h3>
            <img src="${imageItem.src}" alt="${imageItem.alt}" class="vocabulary-image">
            <input type="text" id="image-answer" placeholder="Type the word...">
            <button id="check-image" class="btn-primary">Check</button>
            <div id="image-feedback"></div>
            <button id="new-image" class="btn-secondary">New Image</button>
        </div>
    `;

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
            <h3>Match each image with its word</h3>
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
            <button id="check-image-matches" class="btn-primary">Check Matches</button>
            <button id="new-image-match" class="btn-secondary">New Exercise</button>
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
    
    resultArea.innerHTML = `
        <div class="listening-exercise">
            <h3>Listen and write what you hear:</h3>
            <button id="play-word" class="btn-emoji">🔊 Play</button>
            <input type="text" id="transcription" placeholder="Type what you hear...">
            <button id="check-transcription" class="btn-primary">Check</button>
            <div id="transcription-feedback"></div>
            <button id="new-transcription" class="btn-secondary">New Word</button>
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
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-sound-exercise">
            <h3>Listen and select the correct word:</h3>
            <button id="play-target-word" class="btn-emoji large">🔊 Play Word</button>
            <div class="word-options">
                ${selectedWords.map(word => `
                    <button class="word-option" data-word="${word}">${word}</button>
                `).join('')}
            </div>
            <div id="sound-match-feedback"></div>
            <button id="new-sound-match" class="btn-secondary">New Exercise</button>
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initVocabularyPractice);