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
        exercises: ['identify-image', 'match-image-word', 'identify-image-yes-no'], 
        name: 'Random Image'
    },
    'listening': {
        exercises: ['transcribe-word', 'match-sound-word', 'transcribe-word-yes-no'],
        name: 'Listening'
    }
};

// Initialize vocabulary practice
function initVocabularyPractice() {
    document.getElementById('random-word-btn')?.addEventListener('click', () => {
        startRandomWordPractice();
    });
    document.getElementById('random-image-btn')?.addEventListener('click', () => {
        startRandomImagePractice();
    });
    document.getElementById('listening-btn')?.addEventListener('click', () => {
        startListeningPractice();
    });
    document.getElementById('practice-all-vocab-btn')?.addEventListener('click', () => {
        practiceAllVocabulary();
    });
}

async function startRandomWordPractice() {
    const exercises = VOCABULARY_PRACTICE_TYPES['random-word'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    switch(randomExercise) {
        case 'show-word':
            await window.showRandomWord();
            break;
        case 'opposites':
            await window.showOppositesExercise();
            break;
        case 'match-opposites':
            await window.showMatchOpposites();
            break;
        case 'build-word':
            await window.showBuildWord();
            break;
    }
}

async function showRandomWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const words = await loadVocabulary(language, days);
    if (!Array.isArray(words) || !words.length) {
        showNoDataMessage(); // This will call refreshLatinization
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
                <button id="btn-new-show-word" class="btn-emoji" onclick="window.showRandomWord()" aria-label="${t.buttons?.newShowWord || t.buttons?.newExerciseSameType || 'New Exercise'}">🔄 ${t.buttons?.newShowWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
            </div>
            <div id="pronunciation-feedback" style="margin-top:10px; text-align:center;"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.word-display-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            let hintText = "";

            if (word && word.length > 0) {
                if (word.length < 3) {
                    hintText = `${t.hintLabel || 'Hint:'} ${t.theWordIs || 'The word is'} '${word}'.`;
                } else {
                    const numLettersToReveal = word.length <= 5 ? 2 : 3;
                    let indices = Array.from(Array(word.length).keys());
                    
                    if (typeof window.shuffleArray === 'function') {
                        indices = window.shuffleArray(indices);
                    } else {
                        // Fallback basic shuffle if window.shuffleArray is not available
                        for (let i = indices.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [indices[i], indices[j]] = [indices[j], indices[i]];
                        }
                    }
                    
                    const selectedIndices = indices.slice(0, numLettersToReveal).sort((a, b) => a - b);
                    
                    let hintParts = [];
                    selectedIndices.forEach(index => {
                        hintParts.push(`${t.letterAtPosition || 'Letter at position'} ${index + 1} ${t.is || 'is'} '${word[index]}'`);
                    });
                    hintText = `${t.hintLabel || 'Hint:'} ${hintParts.join(', ')}.`;
                }
            } else {
                hintText = t.noHintAvailable || 'No hint available for this exercise.';
            }
            hintDisplay.textContent = hintText;
            this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { // Refresh if hint is added
                window.refreshLatinization();
            }
        };
    }

    document.getElementById('pronounce-word')?.addEventListener('click', () => {
        pronounceWord(word, language);
    });
}

async function showOppositesExercise(baseWord = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const words = await loadVocabulary(language, days); 
    const oppositesData = await loadOpposites(language, days); 

    if (!words.length && !baseWord) { 
        showNoDataMessage(); // This will call refreshLatinization
        return;
    }
    
    const word = baseWord || words[Math.floor(Math.random() * words.length)];
    const opposite = oppositesData[word] || (t.noOppositeFound || 'No opposite found');
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="opposites-exercise" role="form" aria-label="${t.oppositesExercise || 'Opposites Exercise'}">
            <div class="word-pair">
                <div class="word-box" aria-label="${t.wordAriaLabel || 'Word'}">${word}</div>
                <div class="opposite-arrow" aria-label="${t.oppositeArrowLabel || 'Opposite arrow'}">≠</div>
                <div class="word-box opposite-answer" id="opposite-answer-display" aria-label="${t.oppositeLabel || 'Opposite'}">?</div>
            </div>
            <input type="text" id="opposite-input" class="exercise-input" aria-label="${t.typeTheOpposite || 'Type the opposite'}" placeholder="${t.typeTheOppositePlaceholder || 'Type the opposite...'}">
            <div id="opposite-feedback" class="exercise-feedback" aria-live="polite"></div>
            <div class="exercise-actions">
                <button id="btn-new-opposite-exercise" class="exercise-button" onclick="window.showOppositesExercise()" aria-label="${t.buttons?.newOppositeExercise || t.buttons?.newExerciseSameType || 'New Exercise'}">🔄 ${t.buttons?.newOppositeExercise || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
            </div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.opposites-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            if (opposite && opposite !== (t.noOppositeFound || 'No opposite found') && opposite.length > 0) {
                let hintText = `${t.hintLabel || 'Hint:'} ${t.oppositeStartsWith || 'The opposite starts with'} '${opposite[0]}'`;
                 if (opposite.length > 1) {
                    hintText += ` ${t.oppositeEndsWith || 'and ends with'} '${opposite[opposite.length - 1]}'`;
                }
                hintText += '.';
                hintDisplay.textContent = hintText;
            } else {
                hintDisplay.textContent = t.noSpecificHint || 'No specific hint for this one.';
            }
            this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { // Refresh if hint is added
                window.refreshLatinization();
            }
        };
        exerciseContainer.revealAnswer = () => document.getElementById('reveal-opposite-impl')?.click();
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('opposite-input').value.trim();
            const feedback = document.getElementById('opposite-feedback');
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            if (userAnswer.toLowerCase() === opposite.toLowerCase()) {
                feedback.innerHTML = `<span class="correct" aria-label="Correct">✅👏 ${currentT.correct || 'Correct!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', word, true);
                if (opposite !== (currentT.noOppositeFound || 'No opposite found')) { 
                    CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', opposite, true);
                }
                document.getElementById('opposite-answer-display').textContent = opposite;
            } else {
                feedback.innerHTML = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.feedbackNotQuiteTryAgain || 'Try again!'}</span>`;
                 CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof window.refreshLatinization === 'function') { // Refresh after feedback
                window.refreshLatinization();
            }
        };
    }
    
    document.getElementById('reveal-opposite-impl')?.addEventListener('click', () => {
        document.getElementById('opposite-answer-display').textContent = opposite;
        document.getElementById('opposite-feedback').innerHTML = '';
        if (typeof window.refreshLatinization === 'function') { // Refresh after reveal
            window.refreshLatinization();
        }
    });
}

async function showMatchOpposites() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    const opposites = await loadOpposites(language, days);
    
    if (words.length < 4 || Object.keys(opposites).length < 2) {
        showNoDataMessage(); // This will call refreshLatinization
        return;
    }

    let selectedPairs = [];
    const availableWords = shuffleArray([...words]);
    
    for (const currentWord of availableWords) {
        if (opposites[currentWord]) {
            selectedPairs.push({ word: currentWord, opposite: opposites[currentWord] });
            if (selectedPairs.length >= 4) break;
        }
    }
    
    if (selectedPairs.length < 2) { 
        showNoDataMessage();  // This will call refreshLatinization
        return;
    }
    selectedPairs = selectedPairs.slice(0,4);

    const wordsColumn = shuffleArray([...selectedPairs]); 
    const oppositesColumn = shuffleArray(selectedPairs.map(pair => pair.opposite)); 

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
                    ${oppositesColumn.map((oppositeString, index) => `
                        <div class="match-item" data-opposite="${oppositeString}" role="button" tabindex="0" aria-label="${t.oppositeLabel || 'Opposite'}: ${oppositeString}">${oppositeString}</div>
                    `).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite"></div>
            <button id="btn-new-match-opposites" class="exercise-button" onclick="window.showMatchOpposites()" aria-label="${t.buttons?.newMatchOpposites || t.buttons?.newExerciseSameType || 'New Exercise'}">🔄 ${t.buttons?.newMatchOpposites || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.match-exercise');
    let revealedPair = null; 

    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            if (selectedPairs.length > 0) {
                revealedPair = selectedPairs[Math.floor(Math.random() * selectedPairs.length)];
                hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.onePairIs || 'One pair is:'} "${revealedPair.word}" ≠ "${revealedPair.opposite}".`;
                document.querySelector(`[data-word="${revealedPair.word}"]`)?.classList.add('hint-highlight');
                document.querySelector(`[data-opposite="${revealedPair.opposite}"]`)?.classList.add('hint-highlight');
            } else {
                hintDisplay.textContent = t.noHintAvailable || 'No hint available.';
            }
            this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { // Refresh if hint is added
                window.refreshLatinization();
            }
        };

        exerciseContainer.checkAnswer = function() { // This is used as revealAnswer too
            const feedback = document.getElementById('match-feedback');
            feedback.innerHTML = t.showingCorrectMatches || 'Showing all correct matches...';
            selectedPairs.forEach(pair => {
                const wordEl = document.querySelector(`[data-word="${pair.word}"]`);
                const oppEl = document.querySelector(`[data-opposite="${pair.opposite}"]`);
                if (wordEl && !wordEl.classList.contains('matched')) wordEl.classList.add('correct-match-on-check');
                if (oppEl && !oppEl.classList.contains('matched')) oppEl.classList.add('correct-match-on-check');
            });
            if (typeof window.refreshLatinization === 'function') { // Refresh after reveal
                window.refreshLatinization();
            }
        };
        exerciseContainer.revealAnswer = exerciseContainer.checkAnswer;
    }
    
    let selectedWordElement = null;
    let selectedOppositeElement = null;

    document.querySelectorAll('#words-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedWordElement) selectedWordElement.classList.remove('selected');
            this.classList.add('selected');
            selectedWordElement = this;
            if (selectedOppositeElement) checkMatchAttempt();
        });
    });

    document.querySelectorAll('#opposites-col .match-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            if (selectedOppositeElement) selectedOppositeElement.classList.remove('selected');
            this.classList.add('selected');
            selectedOppositeElement = this;
            if (selectedWordElement) checkMatchAttempt();
        });
    });

    function checkMatchAttempt() {
        const word = selectedWordElement.getAttribute('data-word');
        const opposite = selectedOppositeElement.getAttribute('data-opposite');
        const feedback = document.getElementById('match-feedback');
        
        const correctPair = selectedPairs.find(p => p.word === word);

        if (correctPair && correctPair.opposite === opposite) {
            feedback.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct match!'}</span>`;
            selectedWordElement.classList.add('matched', 'disabled');
            selectedOppositeElement.classList.add('matched', 'disabled');
            selectedWordElement.classList.remove('selected', 'hint-highlight');
            selectedOppositeElement.classList.remove('selected', 'hint-highlight');
            CosyAppInteractive.awardCorrectAnswer();
            CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word, true);
            CosyAppInteractive.scheduleReview(language, 'vocabulary-word', opposite, true);
        } else {
            feedback.innerHTML = `<span class="incorrect">❌ ${t.notAMatch || 'Not a match. Try again!'}</span>`;
            selectedWordElement.classList.remove('selected');
            selectedOppositeElement.classList.remove('selected');
            CosyAppInteractive.awardIncorrectAnswer();
        }
        
        selectedWordElement = null; 
        selectedOppositeElement = null;
        if (document.querySelectorAll('.match-item.matched').length === selectedPairs.length * 2) {
            feedback.innerHTML += `<br><span class="correct">${t.allPairsMatched || 'All pairs matched! Great job!'}</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { // Refresh after feedback
            window.refreshLatinization();
        }
    }
}

async function showBuildWord(baseWord = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    const words = await loadVocabulary(language, days);
    if (!words.length && !baseWord) { 
        showNoDataMessage(); // This will call refreshLatinization
        return;
    }

    const word = baseWord || words[Math.floor(Math.random() * words.length)];
    const shuffledLetters = shuffleArray([...word.toLowerCase()]);
    
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
            <div id="build-feedback" class="exercise-feedback"></div>
            <div class="build-actions">
                <button id="reset-build" class="exercise-button">🔄 ${t.buttons?.reset || 'Reset'}</button>
                <button id="btn-new-build-word" class="exercise-button" onclick="window.showBuildWord()">🔄 ${t.buttons?.newBuildWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
            </div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.build-word-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            // ... (hint logic) ...
            // Assuming hint logic doesn't add new transliterable text or if it does, it would need its own refresh call.
            // For simplicity, not adding refresh inside hint for now unless it becomes an issue.
        };
        exerciseContainer.revealAnswer = function() {
            const slots = this.querySelectorAll('.letter-slot');
            const feedback = this.querySelector('#build-feedback');
            slots.forEach((slot, index) => {
                slot.innerHTML = `<div class="letter-tile revealed">${word[index]}</div>`;
            });
            if(feedback) feedback.innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${word}</b>`;
            if (typeof window.refreshLatinization === 'function') { // Refresh after reveal
                window.refreshLatinization();
            }
        };
        exerciseContainer.checkAnswer = () => {
            const builtWordArr = Array.from(document.querySelectorAll('.word-slots .letter-tile')).map(tile => tile.dataset.letter);
            const builtWord = builtWordArr.join('');
            const feedback = document.getElementById('build-feedback');
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            if (builtWord.toLowerCase() === word.toLowerCase()) {
                feedback.innerHTML = `<span class="correct">✅ ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', word, true);
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${currentT.notQuiteTryAgain || 'Not quite. Keep trying!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof window.refreshLatinization === 'function') { // Refresh after feedback
                window.refreshLatinization();
            }
        };
    }

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
        slot.addEventListener('click', function() {
            if (this.firstChild) {
                document.getElementById('letter-pool').appendChild(this.firstChild);
            }
        });
    });
    document.getElementById('letter-pool').addEventListener('click', function(e) {
        if (e.target.classList.contains('letter-tile')) {
            const firstEmptySlot = Array.from(letterSlots).find(slot => !slot.firstChild);
            if (firstEmptySlot) {
                firstEmptySlot.appendChild(e.target);
            }
        }
    });

    document.getElementById('reset-build')?.addEventListener('click', () => {
        const pool = document.getElementById('letter-pool');
        const slots = document.querySelectorAll('.letter-slot');
        
        slots.forEach(slot => {
            if (slot.firstChild) {
                pool.appendChild(slot.firstChild); 
            }
        });
        const tilesInPool = Array.from(pool.querySelectorAll('.letter-tile'));
        tilesInPool.sort(() => Math.random() - 0.5).forEach(tile => pool.appendChild(tile));
        document.getElementById('build-feedback').innerHTML = '';
        if (typeof window.refreshLatinization === 'function') { // Refresh after reset
            window.refreshLatinization();
        }
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.letter); 
    e.dataTransfer.setData('text/id', e.target.id || Math.random().toString(36).substr(2, 9)); 
    if(!e.target.id) e.target.id = e.dataTransfer.getData('text/id'); 
    e.target.classList.add('dragging');
}
function dragOver(e) { e.preventDefault(); }
function drop(e) {
    e.preventDefault();
    const draggingElementId = e.dataTransfer.getData('text/id');
    const draggingElement = document.getElementById(draggingElementId);
    
    if (!draggingElement) return;

    if (e.target.classList.contains('letter-slot') && !e.target.firstChild) { 
        e.target.appendChild(draggingElement);
    } else if (e.target.classList.contains('letter-pool')) { 
        e.target.appendChild(draggingElement);
    } else if (e.target.classList.contains('letter-tile') && e.target.parentElement.classList.contains('letter-pool')) {
        e.target.parentElement.appendChild(draggingElement);
    }
    else if (e.target.classList.contains('letter-tile') && e.target.parentElement.classList.contains('letter-slot')) {
        document.getElementById('letter-pool').appendChild(draggingElement); 
    }
    draggingElement.classList.remove('dragging');
    e.target.classList.remove('hovered');
}
function dragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('letter-slot') && !e.target.firstChild) {
        e.target.classList.add('hovered');
    }
}
function dragLeave(e) {
    if (e.target.classList.contains('letter-slot')) {
        e.target.classList.remove('hovered');
    }
}

async function startRandomImagePractice() {
    const exercises = VOCABULARY_PRACTICE_TYPES['random-image'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    switch(randomExercise) {
        case 'identify-image': await window.showIdentifyImage(); break;
        case 'match-image-word': await window.showMatchImageWord(); break;
        case 'identify-image-yes-no': await window.showIdentifyImageYesNo(); break;
        default: await window.showIdentifyImage(); 
    }
}

async function showIdentifyImage() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const images = await loadImageVocabulary(language, days);
    if (!images.length) { showNoDataMessage(); return; } // showNoDataMessage calls refresh

    const imageItem = images[Math.floor(Math.random() * images.length)];
    const correctAnswer = imageItem.translations[language];
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="image-exercise">
            <img src="${imageItem.src}" alt="${imageItem.alt || correctAnswer}" class="vocabulary-image">
            <input type="text" id="image-answer-input" class="exercise-input" placeholder="${t.typeTheWord || 'Type the word...'}">
            <div id="image-feedback" class="exercise-feedback"></div>
            <button id="btn-new-identify-image" class="exercise-button" onclick="window.showIdentifyImage()">🔄 ${t.buttons?.newIdentifyImage || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.image-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            // ... (hint logic) ...
        };
        exerciseContainer.revealAnswer = function() {
            document.getElementById('image-answer-input').value = correctAnswer;
            document.getElementById('image-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${correctAnswer}</b>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('image-answer-input').value.trim();
            const feedback = document.getElementById('image-feedback');
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedback.innerHTML = `<span class="correct">✅ ${currentT.correct || 'Correct!'}</span>`;
                CosyAppInteractive.awardCorrectAnswer();
                CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-image', imageItem.src, true, correctAnswer);
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${currentT.tryAgain || 'Try again!'}</span>`;
                CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}

async function showMatchImageWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    
    const images = await loadImageVocabulary(language, days);
    if (images.length < 1) { showNoDataMessage(); return; } 

    const allWordsForLang = await loadVocabulary(language, days); 
    
    const numPairsToMatch = Math.min(images.length, 4); 
    const selectedImageItems = shuffleArray(images).slice(0, numPairsToMatch);
    
    if (selectedImageItems.length < 1) { showNoDataMessage(); return; }

    const correctWordsForSelectedImages = selectedImageItems.map(img => img.translations[language]);
    let wordPool = [...correctWordsForSelectedImages];
    
    if (wordPool.length < 4 && allWordsForLang.length > wordPool.length) {
        let distractorPool = allWordsForLang.filter(w => !wordPool.includes(w));
        distractorPool = shuffleArray(distractorPool);
        while(wordPool.length < 4 && distractorPool.length > 0) {
            wordPool.push(distractorPool.pop());
        }
    }
    wordPool = shuffleArray(wordPool);

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-image-word-exercise">
            <div class="match-grid image-column">
                ${selectedImageItems.map(item => `<div class="match-item image-item" data-answer="${item.translations[language]}"><img src="${item.src}" alt="${item.alt || item.translations[language]}"></div>`).join('')}
            </div>
            <div class="match-grid word-column">
                 ${wordPool.map(word => `<div class="match-item word-item" data-word="${word}">${word}</div>`).join('')}
            </div>
            <div id="match-image-feedback" class="exercise-feedback"></div>
            <button id="btn-new-match-image-word" class="exercise-button" onclick="window.showMatchImageWord()" aria-label="${t.buttons?.newMatchImageWord || t.buttons?.newExerciseSameType || 'New Exercise'}">🔄 ${t.buttons?.newMatchImageWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.match-image-word-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { /* ... */ };
        exerciseContainer.revealAnswer = function() {
            selectedImageItems.forEach(item => {
                const imgEl = this.querySelector(`.image-item[data-answer="${item.translations[language]}"]`);
                const wordEl = this.querySelector(`.word-item[data-word="${item.translations[language]}"]`);
                if (imgEl && wordEl) {
                    imgEl.classList.add('revealed-match');
                    wordEl.classList.add('revealed-match');
                }
            });
            document.getElementById('match-image-feedback').innerHTML = t.allMatchesRevealed || "All matches revealed.";
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    let selectedImageElement = null;
    let selectedWordElement = null;
    const feedback = document.getElementById('match-image-feedback');

    document.querySelectorAll('.image-item').forEach(item => { /* ... */ });
    document.querySelectorAll('.word-item').forEach(item => { /* ... */ });

    function checkMatchImageWordAttempt() {
        const imageAnswer = selectedImageElement.dataset.answer;
        const wordAnswer = selectedWordElement.dataset.word;
        if (imageAnswer === wordAnswer) {
            feedback.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
            // ...
        } else {
            feedback.innerHTML = `<span class="incorrect">❌ ${t.tryAgain || 'Try again!'}</span>`;
            // ...
        }
        // ...
        if (document.querySelectorAll('.image-item.matched').length === selectedImageItems.length) {
            feedback.innerHTML += `<br><span class="correct">${t.allPairsMatched || 'All pairs matched! Great job!'}</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    }
}

async function showIdentifyImageYesNo() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    
    const images = await loadImageVocabulary(language, days);
    if (!Array.isArray(images) || !images.length) { showNoDataMessage(); return; }
    
    const allWordsForLang = await loadVocabulary(language, days);
    if (!Array.isArray(allWordsForLang)) { showNoDataMessage(); return; } 

    const imageItem = images[Math.floor(Math.random() * images.length)];
    const correctAnswer = imageItem.translations[language];
    let displayedWord, isMatch;
    // ... (logic for displayedWord and isMatch) ...
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="image-exercise identify-yes-no-exercise" role="region" aria-label="${t.identifyImageYesNoExerciseLabel || 'Image Yes/No Exercise'}">
            <img src="${imageItem.src}" alt="${imageItem.alt || t.vocabularyImageAlt || 'Vocabulary image'}" class="vocabulary-image" aria-label="${t.imageAltLabel || 'Image of'} ${correctAnswer}">
            <div class="displayed-word-yes-no" aria-label="${t.displayedWordLabel || 'Displayed word'}">${displayedWord}</div>
            <div class="yes-no-buttons button-group">
                <button id="yes-btn" class="btn-primary" aria-label="${t.yesButtonLabel || 'Yes'}">${t.yesButton || 'Yes'}</button>
                <button id="no-btn" class="btn-primary" aria-label="${t.noButtonLabel || 'No'}">${t.noButton || 'No'}</button>
            </div>
            <div id="yes-no-feedback" class="exercise-feedback" aria-live="assertive"></div>
            <button id="btn-new-identify-image-yes-no" class="exercise-button" onclick="window.showIdentifyImageYesNo()">🔄 ${t.buttons?.newIdentifyImageYesNo || t.buttons?.next || 'Next'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    // ... (event listeners and feedback logic) ...
    const handleAnswer = (userChoseYes) => {
        // ...
        if ((userChoseYes && isMatch) || (!userChoseYes && !isMatch)) {
            feedbackArea.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
        } else {
            feedbackArea.innerHTML = `<span class="incorrect">❌ ${t.incorrect || 'Incorrect.'} ${t.correctAnswerWas || 'The correct answer was'} ${isMatch ? t.yes : t.no}.</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    }; 
    // ...
}

async function startListeningPractice() {
    const exercises = VOCABULARY_PRACTICE_TYPES['listening'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    switch(randomExercise) {
        case 'transcribe-word': await window.showTranscribeWord(); break;
        case 'match-sound-word': await window.showMatchSoundWord(); break;
        case 'transcribe-word-yes-no': await window.showTranscribeWordYesNo(); break;
        default: await window.showTranscribeWord(); 
    }
}

async function showTranscribeWordYesNo() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const words = await loadVocabulary(language, days);
    if (!Array.isArray(words) || !words.length) { showNoDataMessage(); return; }
    
    const correctWord = words[Math.floor(Math.random() * words.length)];
    let displayedWord, isMatch;
    // ... (logic for displayedWord and isMatch) ...
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="listening-exercise transcribe-word-yes-no-exercise" role="region" aria-label="${t.transcribeWordYesNoExerciseLabel || 'Sound Yes/No Exercise'}">
            <button id="play-yes-no-sound" class="btn-emoji large-emoji" aria-label="${t.playSoundButtonLabel || 'Play Sound'}">🔊</button>
            <div class="displayed-word-yes-no" aria-label="${t.displayedWordLabel || 'Displayed word'}">${displayedWord}</div>
            <div class="yes-no-buttons button-group">
                <button id="yes-btn-listening" class="btn-primary" aria-label="${t.yesButtonLabel || 'Yes'}">${t.yesButton || 'Yes'}</button>
                <button id="no-btn-listening" class="btn-primary" aria-label="${t.noButtonLabel || 'No'}">${t.noButton || 'No'}</button>
            </div>
            <div id="yes-no-feedback-listening" class="exercise-feedback" aria-live="assertive"></div>
            <button id="btn-new-transcribe-word-yes-no" class="exercise-button" onclick="window.showTranscribeWordYesNo()">🔄 ${t.buttons?.newTranscribeWordYesNo || t.buttons?.next || 'Next'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    // ... (event listeners and feedback logic) ...
    const handleAnswer = (userChoseYes) => {
        // ...
        if ((userChoseYes && isMatch) || (!userChoseYes && !isMatch)) {
             feedbackArea.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
        } else {
            feedbackArea.innerHTML = `<span class="incorrect">❌ ${t.incorrect || 'Incorrect.'} ${t.correctAnswerWas || 'The correct answer was'} ${isMatch ? t.yes : t.no}.</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    };
    // ...
}

async function showTranscribeWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) { alert(t.alertLangDay ||'Please select language and day(s) first'); return; }
    const words = await loadVocabulary(language, days);
    if (!words.length) { showNoDataMessage(); return; }
    const word = words[Math.floor(Math.random() * words.length)];
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="listening-exercise transcribe-word-exercise">
            <button id="play-word-sound" class="btn-emoji large-emoji" aria-label="${t.playSoundButtonLabel || 'Play Sound'}">🔊</button>
            <input type="text" id="transcription-input" class="exercise-input" placeholder="${t.typeHerePlaceholder || 'Type here...'}">
            <div id="transcription-feedback" class="exercise-feedback"></div>
            <button id="btn-new-transcribe-word" class="exercise-button" onclick="window.showTranscribeWord()">🔄 ${t.buttons?.newTranscribeWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.transcribe-word-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { /* ... */ };
        exerciseContainer.revealAnswer = function() {
            document.getElementById('transcription-input').value = word;
            document.getElementById('transcription-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${word}</b>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('transcription-input').value.trim();
            const feedback = document.getElementById('transcription-feedback');
            // ...
            if (userAnswer.toLowerCase() === word.toLowerCase()) {
                feedback.innerHTML = `<span class="correct">✅ ${currentT.correct || 'Correct!'}</span>`;
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${currentT.tryAgain || 'Try again!'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('play-word-sound')?.addEventListener('click', () => pronounceWord(word, language));
}

async function showMatchSoundWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    const words = await loadVocabulary(language, days);
    if (words.length < 2) { showNoDataMessage(); return; } 
    
    const numOptions = Math.min(words.length, 4); 
    const selectedWordsWithOptions = shuffleArray([...words]).slice(0, numOptions);
    
    if (selectedWordsWithOptions.length < 1) { showNoDataMessage(); return; } 
    const wordToPlay = selectedWordsWithOptions[Math.floor(Math.random() * selectedWordsWithOptions.length)];
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-sound-exercise">
            <button id="play-target-word-sound" class="btn-emoji large-emoji" aria-label="${t.playSoundButtonLabel || 'Play Sound'}">🔊</button>
            <div class="word-options">
                ${selectedWordsWithOptions.map(optionWord => `<button class="word-option btn" data-word="${optionWord}">${optionWord}</button>`).join('')}
            </div>
            <div id="sound-match-feedback" class="exercise-feedback"></div>
            <button id="btn-new-match-sound-word" class="exercise-button" onclick="window.showMatchSoundWord()">🔄 ${t.buttons?.newMatchSoundWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.match-sound-exercise');
     if (exerciseContainer) {
        exerciseContainer.showHint = function() { /* ... */ };
        exerciseContainer.revealAnswer = function() {
            this.querySelectorAll('.word-option').forEach(option => {
                if (option.dataset.word === wordToPlay) {
                    option.classList.add('revealed-correct');
                }
            });
            document.getElementById('sound-match-feedback').innerHTML = `${t.correctAnswerIs || "The correct answer is:"} <b>${wordToPlay}</b>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('play-target-word-sound')?.addEventListener('click', () => pronounceWord(wordToPlay, language));
    document.querySelectorAll('.word-option').forEach(option => { 
        option.addEventListener('click', function() {
            const chosenWord = this.dataset.word;
            const feedback = document.getElementById('sound-match-feedback');
            // ...
            if (chosenWord === wordToPlay) {
                feedback.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${t.incorrect || 'Incorrect.'} ${t.correctAnswerWas || 'The correct answer was'} "${wordToPlay}".</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        }); 
    });
}

async function practiceAllVocabulary() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    
    const allExerciseFunctions = [];
    // ... (populating allExerciseFunctions) ...

    const shuffledExercises = shuffleArray(allExerciseFunctions);
    
    for (const exerciseFn of shuffledExercises) {
        try {
            await exerciseFn(); // This will call refreshLatinization internally
        } catch (error) {
            console.error(`Error running exercise ${exerciseFn.name}:`, error);
            const resultArea = document.getElementById('result');
            if(resultArea) resultArea.innerHTML = `<p class="error-message">${t.errorRunningExercise || "An error occurred while running the exercise. Please try another."}</p>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        }
        
        await new Promise(resolve => {
            const resultArea = document.getElementById('result');
            // ... (continue prompt logic) ...
            resultArea.appendChild(promptContainer);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); } // After adding continue prompt
            continueBtn.onclick = () => { 
                promptContainer.remove();
                resolve();
            };
        });
    }
     const resultArea = document.getElementById('result');
     if(resultArea) {
        resultArea.innerHTML += `<p>${t.allExercisesComplete || 'All vocabulary exercises for selected days complete!'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
     }
}

window.initVocabularyPractice = initVocabularyPractice;
window.startRandomWordPractice = startRandomWordPractice;
window.startRandomImagePractice = startRandomImagePractice;
window.startListeningPractice = startListeningPractice;
window.practiceAllVocabulary = practiceAllVocabulary;

window.showRandomWord = showRandomWord;
window.showOppositesExercise = showOppositesExercise;
window.showMatchOpposites = showMatchOpposites;
window.showBuildWord = showBuildWord;
window.showIdentifyImage = showIdentifyImage;
window.showMatchImageWord = showMatchImageWord;
window.showIdentifyImageYesNo = showIdentifyImageYesNo;
window.showTranscribeWord = showTranscribeWord;
window.showMatchSoundWord = showMatchSoundWord;
window.showTranscribeWordYesNo = showTranscribeWordYesNo;

window.showRandomWord = patchExerciseWithExtraButtons(window.showRandomWord, '.word-display-container', window.startRandomWordPractice, { noCheck: true, noReveal: true });
window.showOppositesExercise = patchExerciseWithExtraButtons(window.showOppositesExercise, '.opposites-exercise', window.startRandomWordPractice, {});
window.showMatchOpposites = patchExerciseWithExtraButtons(window.showMatchOpposites, '.match-exercise', window.startRandomWordPractice, {});
window.showBuildWord = patchExerciseWithExtraButtons(window.showBuildWord, '.build-word-exercise', window.startRandomWordPractice, {});
window.showIdentifyImage = patchExerciseWithExtraButtons(window.showIdentifyImage, '.image-exercise', window.startRandomImagePractice, {});
window.showMatchImageWord = patchExerciseWithExtraButtons(window.showMatchImageWord, '.match-image-word-exercise', window.startRandomImagePractice, { noCheck: true }); 
window.showIdentifyImageYesNo = patchExerciseWithExtraButtons(window.showIdentifyImageYesNo, '.identify-yes-no-exercise', window.startRandomImagePractice, { noCheck: true, noReveal: true }); 
window.showTranscribeWord = patchExerciseWithExtraButtons(window.showTranscribeWord, '.transcribe-word-exercise', window.startListeningPractice, {});
window.showMatchSoundWord = patchExerciseWithExtraButtons(window.showMatchSoundWord, '.match-sound-exercise', window.startListeningPractice, { noCheck: true }); 
window.showTranscribeWordYesNo = patchExerciseWithExtraButtons(window.showTranscribeWordYesNo, '.transcribe-word-yes-no-exercise', window.startListeningPractice, { noCheck: true, noReveal: true }); 

async function getRequiredDay1Pairs(language) {
    const words = await loadVocabulary(language, '1');
    const opposites = await loadOpposites(language, '1'); 
    let pairs = [];
    const requiredPairsData = typeof REQUIRED_DAY1_OPPOSITES !== 'undefined' ? REQUIRED_DAY1_OPPOSITES : [];

    for (const req of requiredPairsData) {
        let baseWord = words.find(w => w.toLowerCase() === req.base.toLowerCase());
        let oppWord = null;
        if (baseWord) { 
            if (opposites[baseWord]) {
                oppWord = opposites[baseWord];
            } else {
                oppWord = words.find(w => w.toLowerCase() === req.opposite.toLowerCase());
            }
        }
        if (baseWord && oppWord) {
             pairs.push({ word: baseWord, opposite: oppWord });
        }
    }
    return pairs;
}

document.addEventListener('DOMContentLoaded', window.initVocabularyPractice);
