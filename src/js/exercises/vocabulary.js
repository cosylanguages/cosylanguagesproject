console.log('[VocabJS] Script start');
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

console.log('[VocabJS] Before VOCABULARY_PRACTICE_TYPES definition');
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

async function showMatchOpposites(basePairs = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions (shuffleArray, showNoDataMessage) not found. Make sure utils.js is loaded.");
        const resultArea = document.getElementById('result');
        if (resultArea) {
            resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        }
        return;
    }
    
    if (typeof CosyAppInteractive === 'undefined' || 
        typeof CosyAppInteractive.awardCorrectAnswer !== 'function' ||
        typeof CosyAppInteractive.awardIncorrectAnswer !== 'function' ||
        typeof CosyAppInteractive.scheduleReview !== 'function') {
        console.warn("CosyAppInteractive or its methods are not available. Progress tracking will be affected.");
    }

    const oppositesData = await loadOpposites(language, days);
    if (Object.keys(oppositesData).length < 2) { 
        showNoDataMessage(t.notEnoughOpposites || 'Not enough opposites data for this exercise.');
        return;
    }

    let selectedPairs = [];
    if (basePairs && basePairs.length >=2) { 
        selectedPairs = basePairs.filter(p => p.word && p.opposite && oppositesData[p.word] === p.opposite); 
    }
    
    if (selectedPairs.length < 2) { 
        const allWordsWithOpposites = Object.keys(oppositesData);
        if (allWordsWithOpposites.length < 2) {
             showNoDataMessage(t.notEnoughOpposites || 'Not enough opposites data for this exercise.');
             return;
        }
        const numPairsToSelect = Math.min(Math.max(2, allWordsWithOpposites.length), 4); 
        const shuffledWords = shuffleArray(allWordsWithOpposites);
        selectedPairs = []; 
        for (let i = 0; i < shuffledWords.length && selectedPairs.length < numPairsToSelect; i++) {
            const word = shuffledWords[i];
            if (oppositesData[word]) { 
                selectedPairs.push({ word: word, opposite: oppositesData[word] });
            }
        }
    }
    
    if (selectedPairs.length < 2) {
        showNoDataMessage(t.notEnoughOpposites || 'Not enough opposites data for this exercise after selection.');
        return;
    }

    const wordsColumn = shuffleArray(selectedPairs.map(p => p.word));
    const oppositesColumn = shuffleArray(selectedPairs.map(p => p.opposite));

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="match-exercise match-opposites-exercise" role="form" aria-label="${t.matchOppositesExercise || 'Match Opposites Exercise'}">
            <div class="match-container">
                <div class="match-col words-column" id="match-words-col">
                    ${wordsColumn.map((word, index) => `<button class="match-item btn-match-item" data-id="word-${index}" data-value="${word}" data-transliterable>${word}</button>`).join('')}
                </div>
                <div class="match-col opposites-column" id="match-opposites-col">
                    ${oppositesColumn.map((opposite, index) => `<button class="match-item btn-match-item" data-id="opposite-${index}" data-value="${opposite}" data-transliterable>${opposite}</button>`).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite" style="min-height: 25px; margin-top:10px;"></div>
        </div>
    `;

    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    let selectedItem = null;
    const items = Array.from(resultArea.querySelectorAll('.match-item'));
    const feedbackDiv = document.getElementById('match-feedback');

    items.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.disabled) return; 

            if (!selectedItem) {
                selectedItem = this;
                this.classList.add('selected');
                this.disabled = true; 
            } else {
                const selectedIsWord = selectedItem.parentElement.id === 'match-words-col';
                const currentIsOpposite = this.parentElement.id === 'match-opposites-col';
                const selectedIsOpposite = selectedItem.parentElement.id === 'match-opposites-col';
                const currentIsWord = this.parentElement.id === 'match-words-col';

                if (!((selectedIsWord && currentIsOpposite) || (selectedIsOpposite && currentIsWord))) {
                    selectedItem.classList.remove('selected');
                    selectedItem.disabled = false;
                    selectedItem = this;
                    this.classList.add('selected');
                    this.disabled = true;
                    return;
                }

                const word1 = selectedItem.dataset.value;
                const word2 = this.dataset.value;
                let isCorrectPair = false;

                if (oppositesData[word1] === word2 || oppositesData[word2] === word1) {
                    isCorrectPair = true;
                }

                if (isCorrectPair) {
                    selectedItem.classList.add('matched', 'correct');
                    this.classList.add('matched', 'correct');
                    selectedItem.classList.remove('selected'); 
                    this.disabled = true; 
                    feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct Match!'}</span>`;
                    if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                    
                    if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word1, true);
                        CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word2, true);
                    }
                } else {
                    selectedItem.classList.add('incorrect');
                    this.classList.add('incorrect'); 
                    feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrectMatch || 'Incorrect Match. Try again.'}</span>`;
                    if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();

                    if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word1, false);
                        CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word2, false);
                    }
                    
                    const tempSelectedItem = selectedItem;
                    const tempThisItem = this;
                    setTimeout(() => {
                        tempSelectedItem.classList.remove('selected', 'incorrect');
                        tempSelectedItem.disabled = false; 
                        tempThisItem.classList.remove('incorrect'); 
                        if (feedbackDiv.innerHTML.includes(t.incorrectMatch)) feedbackDiv.innerHTML = '';
                    }, 1500);
                }
                selectedItem = null; 

                const allMatched = items.every(i => i.classList.contains('matched'));
                if (allMatched) {
                    feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
                    setTimeout(() => {
                       if (window.practiceAllVocabulary) window.practiceAllVocabulary();
                    }, 2000);
                }
            }
        });
    });
    
    const exerciseContainer = resultArea.querySelector('.match-opposites-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            items.forEach(item => {
                item.classList.remove('selected', 'incorrect', 'matched', 'correct');
                item.disabled = true; 
            });
            feedbackDiv.innerHTML = `<span data-transliterable>${t.answersRevealed || "Answers revealed."}</span><br>`;
            selectedPairs.forEach(pair => {
                feedbackDiv.innerHTML += `<b data-transliterable>${pair.word}</b> ≠ <b data-transliterable>${pair.opposite}</b><br>`;
                const wordEl = items.find(el => el.dataset.value === pair.word);
                const oppEl = items.find(el => el.dataset.value === pair.opposite);
                if(wordEl) wordEl.classList.add('revealed-correct');
                if(oppEl) oppEl.classList.add('revealed-correct');
                
                if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                     CosyAppInteractive.scheduleReview(language, 'vocabulary-word', pair.word, false);
                     CosyAppInteractive.scheduleReview(language, 'vocabulary-word', pair.opposite, false);
                }
            });
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = function() { 
            const allCorrectlyMatched = items.every(i => i.classList.contains('matched') && i.classList.contains('correct'));
            const allAttemptedAndMatched = items.every(i => i.classList.contains('matched'));

            if (allCorrectlyMatched && allAttemptedAndMatched && items.length > 0) {
                 feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
            } else if (!allAttemptedAndMatched) {
                 feedbackDiv.innerHTML = `<span class="neutral">${t.notAllMatchedYet || 'Not all pairs have been matched yet.'}</span>`;
            } else { 
                 feedbackDiv.innerHTML = `<span class="neutral">${t.continueMatching || 'Continue matching the pairs.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
         exerciseContainer.showHint = function() {
            const unmatchedWords = items.filter(item => item.parentElement.id === 'match-words-col' && !item.classList.contains('matched') && !item.disabled);
            if (unmatchedWords.length > 0) {
                const hintWordItem = unmatchedWords[0]; 
                const hintWord = hintWordItem.dataset.value;
                const correctOppositeValue = oppositesData[hintWord];
                const oppositeItem = items.find(item => item.parentElement.id === 'match-opposites-col' && item.dataset.value === correctOppositeValue && !item.classList.contains('matched') && !item.disabled);

                if (hintWordItem && oppositeItem) { 
                    hintWordItem.classList.add('hint-highlight');
                    oppositeItem.classList.add('hint-highlight');
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_matchOppositesPair || "Hint: These two items form a pair."}</span>`;
                    setTimeout(() => {
                        hintWordItem.classList.remove('hint-highlight');
                        oppositeItem.classList.remove('hint-highlight');
                        if (feedbackDiv.innerHTML.includes(t.hint_matchOppositesPair)) feedbackDiv.innerHTML = '';
                    }, 2500);
                } else { 
                    hintWordItem.classList.add('hint-highlight');
                     feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_tryMatchingThis || "Hint: Try matching this word."}</span>`;
                     setTimeout(() => {
                        hintWordItem.classList.remove('hint-highlight');
                        if (feedbackDiv.innerHTML.includes(t.hint_tryMatchingThis)) feedbackDiv.innerHTML = '';
                    }, 2000);
                }
            } else {
                feedbackDiv.innerHTML = `<span data-transliterable>${t.noHintAvailable || "No more hints available or all matched."}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}

async function showMatchImageWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const resultArea = document.getElementById('result');

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions missing.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        return;
    }

    const NUM_PAIRS = 4; // Number of image-word pairs for the game
    const imagesData = await loadImageVocabulary(language, days);

    if (!imagesData || imagesData.length < NUM_PAIRS) {
        showNoDataMessage(t.notEnoughImages || `Not enough images for this exercise. Need at least ${NUM_PAIRS}.`);
        return;
    }

    const selectedImages = shuffleArray(imagesData).slice(0, NUM_PAIRS);
    let gameItems = [];
    selectedImages.forEach((imgData, index) => {
        const word = imgData.translations[language];
        const pairId = `pair-${index}`;
        gameItems.push({ type: 'image', src: imgData.src, id: `img-${index}`, pairId: pairId, alt: word });
        gameItems.push({ type: 'word', text: word, id: `word-${index}`, pairId: pairId });
    });

    gameItems = shuffleArray(gameItems); // Shuffle all items together

    resultArea.innerHTML = `
        <div class="match-image-word-exercise" role="form" aria-label="${t.matchImageWordExercise || 'Match Image with Word Exercise'}">
            <p class="exercise-prompt" data-transliterable></p>
            <div class="match-grid">
                ${gameItems.map(item => {
                    if (item.type === 'image') {
                        return `<div class="match-item image-item" data-pair-id="${item.pairId}" data-item-id="${item.id}" role="button" tabindex="0" aria-label="${item.alt || 'Image item'}">
                                    <img src="${item.src}" alt="${item.alt || 'Match image'}">
                                </div>`;
                    } else {
                        return `<div class="match-item word-item" data-pair-id="${item.pairId}" data-item-id="${item.id}" role="button" tabindex="0" aria-label="${item.text || 'Word item'}" data-transliterable>
                                    ${item.text}
                                </div>`;
                    }
                }).join('')}
            </div>
            <div id="match-image-word-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;

    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    let selectedItems = [];
    let matchedPairs = 0;
    const allMatchElements = Array.from(resultArea.querySelectorAll('.match-grid .match-item'));
    const feedbackDiv = document.getElementById('match-image-word-feedback');

    allMatchElements.forEach(element => {
        element.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.classList.contains('selected') || selectedItems.length >= 2) {
                return;
            }

            this.classList.add('selected');
            selectedItems.push(this);

            if (selectedItems.length === 2) {
                const item1 = selectedItems[0];
                const item2 = selectedItems[1];

                if (item1.dataset.pairId === item2.dataset.pairId) { // Correct match
                    item1.classList.add('matched');
                    item2.classList.add('matched');
                    item1.classList.remove('selected');
                    item2.classList.remove('selected');
                    feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct Match!'}</span>`;
                    matchedPairs++;
                    if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                    
                    // Schedule review for both items in the pair
                    const imageItemData = selectedImages.find(img => img.src === (item1.querySelector('img')?.src || item2.querySelector('img')?.src));
                    if (imageItemData && CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                         CosyAppInteractive.scheduleReview(language, 'vocabulary-image', imageItemData.src, true);
                         CosyAppInteractive.scheduleReview(language, 'vocabulary-word', imageItemData.translations[language], true);
                    }


                    if (matchedPairs === NUM_PAIRS) {
                        feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
                        setTimeout(() => {
                            if (window.startRandomImagePractice) window.startRandomImagePractice();
                        }, 2000);
                    }
                } else { // Incorrect match
                    feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrectMatch || 'Incorrect Match. Try again.'}</span>`;
                    item1.classList.add('incorrect-flash');
                    item2.classList.add('incorrect-flash');
                    if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                    
                    // Schedule review for both items in the pair as incorrect
                    const imageItemData1 = selectedImages.find(img => img.src === item1.querySelector('img')?.src);
                    const imageItemData2 = selectedImages.find(img => img.src === item2.querySelector('img')?.src);
                    const word1 = gameItems.find(gi => gi.id === item1.dataset.itemId);
                    const word2 = gameItems.find(gi => gi.id === item2.dataset.itemId);

                    if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        if(item1.classList.contains('image-item') && imageItemData1) CosyAppInteractive.scheduleReview(language, 'vocabulary-image', imageItemData1.src, false);
                        if(item1.classList.contains('word-item') && word1) CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word1.text, false);
                        if(item2.classList.contains('image-item') && imageItemData2) CosyAppInteractive.scheduleReview(language, 'vocabulary-image', imageItemData2.src, false);
                        if(item2.classList.contains('word-item') && word2) CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word2.text, false);
                    }


                    setTimeout(() => {
                        item1.classList.remove('selected', 'incorrect-flash');
                        item2.classList.remove('selected', 'incorrect-flash');
                        if (feedbackDiv.innerHTML.includes(t.incorrectMatch)) feedbackDiv.innerHTML = '';
                    }, 1500);
                }
                selectedItems = []; // Reset selection
            }
        });
    });

    const exerciseContainer = resultArea.querySelector('.match-image-word-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            allMatchElements.forEach(el => {
                el.classList.remove('selected', 'incorrect-flash');
                el.classList.add('matched'); // Show all as matched
                el.style.opacity = '0.7'; // Dim them slightly
            });
            feedbackDiv.innerHTML = `<span data-transliterable>${t.answersRevealed || "All pairs revealed."}</span>`;
            // Mark all for review as incorrect if revealed
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                selectedImages.forEach(imgData => {
                    CosyAppInteractive.scheduleReview(language, 'vocabulary-image', imgData.src, false);
                    CosyAppInteractive.scheduleReview(language, 'vocabulary-word', imgData.translations[language], false);
                });
            }
        };
        exerciseContainer.showHint = function() {
            const unselectedItems = allMatchElements.filter(el => !el.classList.contains('matched') && !el.classList.contains('selected'));
            if (unselectedItems.length >= 2) {
                const firstHintItem = unselectedItems[0];
                const pairIdToFind = firstHintItem.dataset.pairId;
                const secondHintItem = unselectedItems.find(el => el.dataset.pairId === pairIdToFind && el !== firstHintItem);

                if (secondHintItem) {
                    firstHintItem.classList.add('hint-highlight');
                    secondHintItem.classList.add('hint-highlight');
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_theseItemsMatch || "Hint: These two items form a pair."}</span>`;
                    setTimeout(() => {
                        firstHintItem.classList.remove('hint-highlight');
                        secondHintItem.classList.remove('hint-highlight');
                        if (feedbackDiv.innerHTML.includes(t.hint_theseItemsMatch)) feedbackDiv.innerHTML = '';
                    }, 2500);
                } else { // Should not happen if pairs are consistent
                    firstHintItem.classList.add('hint-highlight');
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_tryThisItem || "Hint: Try matching this item."}</span>`;
                     setTimeout(() => {
                        firstHintItem.classList.remove('hint-highlight');
                         if (feedbackDiv.innerHTML.includes(t.hint_tryThisItem)) feedbackDiv.innerHTML = '';
                    }, 2000);
                }
            } else {
                feedbackDiv.innerHTML = `<span data-transliterable>${t.noMoreHints || "No more hints available."}</span>`;
            }
        };
         exerciseContainer.checkAnswer = function() { /* Not applicable for click-based matching */ };
    }
}

async function showTranscribeWordYesNo(wordToHear = null, wordToDisplay = null, isMatch = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const resultArea = document.getElementById('result');

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function' || typeof pronounceWord !== 'function') {
        console.error("Required utility functions missing.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        return;
    }

    let actualWordHeard = wordToHear;
    let displayedWord = wordToDisplay;
    let questionIsAMatch = isMatch; // True if displayedWord IS actualWordHeard

    let reviewItemObj = null;
    let currentProficiencyBucket = 0;

    if (actualWordHeard === null) { // Generate new exercise if not pre-filled
        const allWords = await loadVocabulary(language, days);
        if (!allWords || allWords.length < 1) { // Need at least one word
            showNoDataMessage(t.noWordsAvailable || 'Not enough words for this exercise.');
            return;
        }

        if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
            const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-word', 1);
            if (reviewItems && reviewItems.length > 0) {
                reviewItemObj = reviewItems[0];
                actualWordHeard = reviewItemObj.itemValue;
                currentProficiencyBucket = reviewItemObj.proficiencyBucket;
            }
        }

        if (!actualWordHeard) {
            actualWordHeard = allWords[Math.floor(Math.random() * allWords.length)];
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
                 currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-word', actualWordHeard);
            }
        }
        
        questionIsAMatch = Math.random() < 0.5; // 50% chance the displayed word matches the sound

        if (questionIsAMatch) {
            displayedWord = actualWordHeard;
        } else {
            let distractors = allWords.filter(w => w.toLowerCase() !== actualWordHeard.toLowerCase());
            if (distractors.length > 0) {
                displayedWord = distractors[Math.floor(Math.random() * distractors.length)];
            } else {
                // If no distractors, force it to be a match
                displayedWord = actualWordHeard;
                questionIsAMatch = true;
            }
        }
    }
    
    if (!actualWordHeard || !displayedWord) {
        showNoDataMessage(t.error_generic || 'Error preparing exercise data.');
        return;
    }

    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    resultArea.innerHTML = `
        <div class="listening-exercise transcribe-word-yes-no-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.transcribeWordYesNoExercise || 'Transcribe Word (Yes/No) Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <p class="exercise-prompt" data-transliterable></p>
            <button id="play-transcribe-yesno-sound" class="btn-emoji large-emoji" aria-label="${t.buttons?.playSound || 'Play Sound'}">🔊</button>
            <div class="displayed-word-yesno" data-transliterable>${displayedWord}</div>
            <div id="transcribe-yesno-feedback" class="exercise-feedback" aria-live="polite" style="min-height:25px; margin-top:10px;"></div>
            <div class="yes-no-buttons">
                <button id="btn-transcribe-yes" class="exercise-button btn-yes-no">✅ ${t.buttons?.yes || 'Yes'}</button>
                <button id="btn-transcribe-no" class="exercise-button btn-yes-no">❌ ${t.buttons?.no || 'No'}</button>
            </div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    pronounceWord(actualWordHeard, language); // Play sound on load
    document.getElementById('play-transcribe-yesno-sound')?.addEventListener('click', () => {
        pronounceWord(actualWordHeard, language);
    });

    const feedbackDiv = document.getElementById('transcribe-yesno-feedback');
    const yesButton = document.getElementById('btn-transcribe-yes');
    const noButton = document.getElementById('btn-transcribe-no');

    function handleAnswer(userSaidYes) {
        yesButton.disabled = true;
        noButton.disabled = true;
        let isUserCorrect = userSaidYes === questionIsAMatch;

        if (isUserCorrect) {
            feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
            if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
        } else {
            const correctAnswerText = questionIsAMatch ? (t.buttons?.yes || 'Yes') : (t.buttons?.no || 'No');
            feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrect || 'Incorrect.'} ${t.correctAnswerWas || 'The correct answer was:'} ${correctAnswerText}. 
            (${t.soundWasFor || 'The sound was for:'} <strong data-transliterable>${actualWordHeard}</strong>)</span>`;
            if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        
        if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
            CosyAppInteractive.scheduleReview(language, 'vocabulary-word', actualWordHeard, isUserCorrect);
            if (displayedWord.toLowerCase() !== actualWordHeard.toLowerCase()) { // also review the distractor if it was shown
                 CosyAppInteractive.scheduleReview(language, 'vocabulary-word', displayedWord, isUserCorrect);
            }
        }

        if (isUserCorrect) {
            setTimeout(() => {
                if (window.startListeningPractice) window.startListeningPractice();
            }, 1500);
        }
    }

    yesButton.addEventListener('click', () => handleAnswer(true));
    noButton.addEventListener('click', () => handleAnswer(false));

    const exerciseContainer = resultArea.querySelector('.transcribe-word-yes-no-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const correctAnswerText = questionIsAMatch ? (t.buttons?.yes || 'Yes') : (t.buttons?.no || 'No');
            feedbackDiv.innerHTML = `<span class="revealed-answer">${t.correctAnswerWas || 'The correct answer was:'} ${correctAnswerText}. 
            (${t.soundWasFor || 'The sound was for:'} <strong data-transliterable>${actualWordHeard}</strong>, ${t.wordShownWas || 'word shown was:'} <strong data-transliterable>${displayedWord}</strong>).</span>`;
            yesButton.disabled = true;
            noButton.disabled = true;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, 'vocabulary-word', actualWordHeard, false);
                 if (displayedWord.toLowerCase() !== actualWordHeard.toLowerCase()) {
                     CosyAppInteractive.scheduleReview(language, 'vocabulary-word', displayedWord, false);
                 }
            }
        };
        exerciseContainer.showHint = function() {
            // Hint could reveal if the first letters match or not, or length, etc.
            // For Yes/No, a direct hint is often too revealing.
            // Example: "Think carefully if the sound matches the visual."
            let hintText = t.hint_transcribeYesNo_general || "Listen closely. Does the sound match the word you see?";
            if (questionIsAMatch) {
                hintText = t.hint_transcribeYesNo_isMatch || "Hint: The sound and the word are indeed the same.";
            } else {
                if (actualWordHeard.charAt(0).toLowerCase() === displayedWord.charAt(0).toLowerCase()) {
                    hintText = t.hint_transcribeYesNo_sameLetter || "Hint: The sound and word start with the same letter, but are they identical?";
                } else {
                    hintText = t.hint_transcribeYesNo_differentLetter || "Hint: The sound and word start with different letters.";
                }
            }
            feedbackDiv.innerHTML = `<span class="hint-text">${hintText}</span>`;
             if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}


async function showMatchSoundWord(baseWord = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const resultArea = document.getElementById('result');
    const NUM_OPTIONS = 4; // Number of word choices

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function' || typeof pronounceWord !== 'function') {
        console.error("Required utility functions (shuffleArray, showNoDataMessage, pronounceWord) not found.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        return;
    }
    
    let correctAnswer = baseWord;
    let reviewItemObj = null;
    let currentProficiencyBucket = 0;

    if (!correctAnswer && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-word', 1); 
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            correctAnswer = reviewItemObj.itemValue;
            currentProficiencyBucket = reviewItemObj.proficiencyBucket;
        }
    }

    if (!correctAnswer) {
        const allWords = await loadVocabulary(language, days);
        if (!allWords || allWords.length === 0) {
            showNoDataMessage(t.noWordsAvailable || 'No words available for this selection.');
            return;
        }
        // Ensure correctAnswer is a string and not an object if loadVocabulary can return mixed types
        let potentialCorrectAnswer = allWords[Math.floor(Math.random() * allWords.length)];
        if (typeof potentialCorrectAnswer === 'object' && potentialCorrectAnswer !== null && potentialCorrectAnswer.word) {
            correctAnswer = potentialCorrectAnswer.word;
        } else if (typeof potentialCorrectAnswer === 'string') {
            correctAnswer = potentialCorrectAnswer;
        } else {
            showNoDataMessage(t.noWordsAvailable || 'No valid words available for this selection.');
            return;
        }

        if (!reviewItemObj && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
            currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-word', correctAnswer);
        }
    }
    
    if (!correctAnswer) { // Final check if correctAnswer is still not set
        showNoDataMessage(t.noWordsAvailable || 'Failed to select a correct word.');
        return;
    }
    
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    const allWordsForDistraction = await loadVocabulary(language, days);
    let distractors = allWordsForDistraction.map(w => (typeof w === 'object' && w !== null && w.word) ? w.word : (typeof w === 'string' ? w : null))
                                          .filter(w => w && w.toLowerCase() !== correctAnswer.toLowerCase());
    distractors = shuffleArray(distractors).slice(0, NUM_OPTIONS - 1);

    const options = shuffleArray([correctAnswer, ...distractors]);
    
    // Ensure there are enough options, even if it means fewer than NUM_OPTIONS
    if (options.length === 0 && correctAnswer) { options.push(correctAnswer); } // At least show the correct answer
    if (options.length === 1 && correctAnswer && allWordsForDistraction.length > 1) { 
        // Try to add at least one more different option if possible
        const otherOptions = allWordsForDistraction.map(w => (typeof w === 'object' && w !== null && w.word) ? w.word : (typeof w === 'string' ? w : null))
                                                 .filter(w => w && w.toLowerCase() !== correctAnswer.toLowerCase());
        if (otherOptions.length > 0) options.push(otherOptions[0]);
    }


    resultArea.innerHTML = `
        <div class="listening-exercise match-sound-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.matchSoundWordTitle || 'Match Sound to the Word:'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <p class="exercise-prompt" data-transliterable></p>
            <button id="play-match-sound" class="btn-emoji large-emoji" aria-label="${t.buttons?.playSound || (t.aria?.pronounce || 'Play Sound')}">🔊</button>
            <div class="word-options-container match-sound-options">
                ${options.map(word => `
                    <button class="word-option-btn btn-secondary" data-word="${word}" aria-label="${word}" data-transliterable>
                        ${word}
                    </button>
                `).join('')}
            </div>
            <div id="match-sound-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;

    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    
    pronounceWord(correctAnswer, language); 
    document.getElementById('play-match-sound')?.addEventListener('click', () => {
        pronounceWord(correctAnswer, language);
    });

    const feedbackDiv = document.getElementById('match-sound-feedback');
    const optionButtons = Array.from(resultArea.querySelectorAll('.word-option-btn'));

    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const userAnswer = this.dataset.word;
            let isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

            optionButtons.forEach(b => b.disabled = true); 

            if (isCorrect) {
                this.classList.add('correct');
                feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
            } else {
                this.classList.add('incorrect');
                feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrect || 'Incorrect.'} ${(t.answerIs || 'The answer is:')} <strong data-transliterable>${correctAnswer}</strong></span>`;
                const correctBtn = optionButtons.find(b => b.dataset.word.toLowerCase() === correctAnswer.toLowerCase());
                if (correctBtn) correctBtn.classList.add('correct-revealed');
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }

            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                CosyAppInteractive.scheduleReview(language, 'vocabulary-word', correctAnswer, isCorrect);
            }
            
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

            if (isCorrect) {
                setTimeout(() => {
                    if (window.startListeningPractice) window.startListeningPractice();
                }, 1500);
            }
        });
    });

    const exerciseContainer = resultArea.querySelector('.match-sound-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            feedbackDiv.innerHTML = `<span class="revealed-answer">${(t.answerIs || 'The answer is:')} <strong data-transliterable>${correctAnswer}</strong></span>`;
            optionButtons.forEach(b => {
                b.disabled = true;
                if (b.dataset.word.toLowerCase() === correctAnswer.toLowerCase()) {
                    b.classList.add('correct-revealed');
                }
            });
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, 'vocabulary-word', correctAnswer, false);
            }
        };
        exerciseContainer.showHint = function() {
            const incorrectButtons = optionButtons.filter(btn => btn.dataset.word.toLowerCase() !== correctAnswer.toLowerCase() && !btn.disabled && !btn.classList.contains('hint-removed'));
            if (incorrectButtons.length > 1) { 
                const btnToRemove = incorrectButtons[0];
                btnToRemove.classList.add('hint-removed');
                btnToRemove.disabled = true; 
                btnToRemove.style.opacity = "0.5";
                feedbackDiv.innerHTML = `<span class="hint-text">${t.hint_oneOptionRemoved || 'Hint: One incorrect option removed.'}</span>`;
            } else {
                feedbackDiv.innerHTML = `<span class="hint-text">${t.noMoreHints || 'No more hints available.'}</span>`;
            }
        };
    }
}

async function showIdentifyImageYesNo(imageInfo = null, displayedNameInfo = null, isCorrectlyNamed = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions missing.");
        return;
    }
    if (typeof CosyAppInteractive === 'undefined') {
        console.warn("CosyAppInteractive is not available.");
    }

    let currentImage;
    let displayedName;
    let actualCorrectName;
    let isQuestionCorrectlyNamed; 
    let itemToReviewType = 'vocabulary-image'; 
    let itemToReviewValue; 

    if (imageInfo && displayedNameInfo && typeof isCorrectlyNamed === 'boolean') {
        currentImage = imageInfo;
        displayedName = displayedNameInfo;
        isQuestionCorrectlyNamed = isCorrectlyNamed;
        actualCorrectName = currentImage.translations[language];
        itemToReviewValue = currentImage.src;
    } else {
        const images = await loadImageVocabulary(language, days);
        if (!images.length) {
            showNoDataMessage(t.noImagesAvailable || 'No images available for this selection.');
            return;
        }
        currentImage = images[Math.floor(Math.random() * images.length)];
        actualCorrectName = currentImage.translations[language];
        itemToReviewValue = currentImage.src;
        isQuestionCorrectlyNamed = Math.random() < 0.5; 

        if (isQuestionCorrectlyNamed) {
            displayedName = actualCorrectName;
        } else {
            const words = await loadVocabulary(language, days);
            let potentialIncorrectNames = words.filter(w => w.toLowerCase() !== actualCorrectName.toLowerCase());
            if (potentialIncorrectNames.length > 0) {
                displayedName = potentialIncorrectNames[Math.floor(Math.random() * potentialIncorrectNames.length)];
            } else {
                // Fallback if no other words are available, or make the question correct
                displayedName = actualCorrectName;
                isQuestionCorrectlyNamed = true; 
            }
        }
    }
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="identify-yes-no-exercise image-exercise" role="form" aria-label="${t.identifyImageYesNoExercise || 'Identify Image (Yes/No) Exercise'}">
            <img src="${currentImage.src}" alt="${currentImage.alt || actualCorrectName}" class="vocabulary-image">
            <p class="exercise-prompt" data-transliterable>${t.isThisA || 'Is this a...'} <strong data-transliterable>${displayedName}</strong>?</p>
            <div id="identify-yn-feedback" class="exercise-feedback" aria-live="polite" style="min-height:25px; margin-top:10px;"></div>
            <div class="yes-no-buttons">
                <button id="btn-identify-yes" class="exercise-button btn-yes-no">✅ ${t.buttons?.yes || 'Yes'}</button>
                <button id="btn-identify-no" class="exercise-button btn-yes-no">❌ ${t.buttons?.no || 'No'}</button>
            </div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    const feedbackDiv = document.getElementById('identify-yn-feedback');
    
    function handleAnswer(userSaidYes) {
        let isUserCorrect = userSaidYes === isQuestionCorrectlyNamed;

        document.getElementById('btn-identify-yes').disabled = true;
        document.getElementById('btn-identify-no').disabled = true;

        if (isUserCorrect) {
            feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
            if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
        } else {
            feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrect || 'Incorrect.'} ${t.correctAnswerWas || 'The correct answer was:'} ${isQuestionCorrectlyNamed ? (t.buttons?.yes || 'Yes') : (t.buttons?.no || 'No')}.</span>`;
            if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
        }
        
        if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
            CosyAppInteractive.scheduleReview(language, itemToReviewType, itemToReviewValue, isUserCorrect);
        }

        if (isUserCorrect) {
            setTimeout(() => {
                if (window.startRandomImagePractice) window.startRandomImagePractice();
            }, 1500);
        }
    }

    document.getElementById('btn-identify-yes').addEventListener('click', () => handleAnswer(true));
    document.getElementById('btn-identify-no').addEventListener('click', () => handleAnswer(false));

    const exerciseContainer = resultArea.querySelector('.identify-yes-no-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() { 
            feedbackDiv.innerHTML = `<span data-transliterable>${t.correctAnswerWas || 'The correct answer was:'} <strong data-transliterable>${isQuestionCorrectlyNamed ? (t.buttons?.yes || 'Yes') : (t.buttons?.no || 'No')}</strong>. 
            (${t.imageIsA || 'The image is a'} <strong data-transliterable>${actualCorrectName}</strong>).</span>`;
            document.getElementById('btn-identify-yes').disabled = true;
            document.getElementById('btn-identify-no').disabled = true;
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, itemToReviewType, itemToReviewValue, false); 
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = function() { /* Not applicable for Yes/No */ };
        exerciseContainer.showHint = function() {
            if (displayedName && actualCorrectName) {
                const firstLetterDisplayed = displayedName.substring(0,1).toLowerCase();
                const firstLetterActual = actualCorrectName.substring(0,1).toLowerCase();
                if (isQuestionCorrectlyNamed) {
                     feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_yesNo_positive || "Hint: The displayed name is indeed correct for the image."}</span>`;
                } else if (firstLetterActual === firstLetterDisplayed) {
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_yesNo_sameLetter || "Hint: The displayed name and the actual image name start with the same letter, but are they the same word?"}</span>`;
                } else {
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_yesNo_firstLetter || "Hint: The actual image's name starts with the letter:"} <strong data-transliterable>${firstLetterActual.toUpperCase()}</strong>.</span>`;
                }
            } else {
                 feedbackDiv.innerHTML = `<span data-transliterable>${t.noHintAvailable || "No hint available for this item."}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}

async function startRandomImagePractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    if (typeof window.cancelAutoAdvanceTimer === 'function') {
        window.cancelAutoAdvanceTimer();
    }
    const language = document.getElementById('language').value;
    const days = getSelectedDays(); 
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const exercises = VOCABULARY_PRACTICE_TYPES['random-image'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    switch(randomExercise) {
        case 'identify-image':
            await window.showIdentifyImage();
            break;
        case 'match-image-word':
            await window.showMatchImageWord();
            break;
        case 'identify-image-yes-no':
            await window.showIdentifyImageYesNo();
            break;
        default:
            console.error("Unknown random image exercise selected:", randomExercise);
            const resultArea = document.getElementById('result');
            if (resultArea) {
                resultArea.innerHTML = '<p>An unexpected error occurred while selecting an image exercise. Please try again.</p>';
            }
            break;
    }
}

async function startListeningPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    if (typeof window.cancelAutoAdvanceTimer === 'function') {
        window.cancelAutoAdvanceTimer();
    }
    const language = document.getElementById('language').value;
    const days = getSelectedDays(); 
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const exercises = VOCABULARY_PRACTICE_TYPES['listening'].exercises;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    switch(randomExercise) {
        case 'transcribe-word':
            await window.showTranscribeWord();
            break;
        case 'match-sound-word':
            await window.showMatchSoundWord();
            break;
        case 'transcribe-word-yes-no':
            await window.showTranscribeWordYesNo();
            break;
        default:
            console.error("Unknown listening exercise selected:", randomExercise);
            const resultArea = document.getElementById('result');
            if (resultArea) {
                resultArea.innerHTML = '<p>An unexpected error occurred while selecting a listening exercise. Please try again.</p>';
            }
            break;
    }
}

async function practiceAllVocabulary() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    if (typeof window.cancelAutoAdvanceTimer === 'function') {
        window.cancelAutoAdvanceTimer();
    }
    const language = document.getElementById('language').value;
    const days = getSelectedDays(); 
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    const practiceTypes = Object.keys(VOCABULARY_PRACTICE_TYPES);
    if (!practiceTypes.length) {
        console.error("No practice types defined in VOCABULARY_PRACTICE_TYPES.");
        const resultArea = document.getElementById('result');
        if (resultArea) {
            resultArea.innerHTML = '<p>No vocabulary practice types are currently available. Please check the configuration.</p>';
        }
        return;
    }
    const randomPracticeType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
    switch(randomPracticeType) {
        case 'random-word':
            await window.startRandomWordPractice();
            break;
        case 'random-image':
            await window.startRandomImagePractice();
            break;
        case 'listening':
            await window.startListeningPractice();
            break;
        default:
            console.error("Unknown practice type selected:", randomPracticeType);
            const resultArea = document.getElementById('result');
            if (resultArea) {
                resultArea.innerHTML = '<p>An unexpected error occurred while selecting a practice type. Please try again.</p>';
            }
            break;
    }
}

console.log('[VocabJS] Before initVocabularyPractice definition');
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

console.log('[VocabJS] After initVocabularyPractice definition');
async function startRandomWordPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    if (typeof window.cancelAutoAdvanceTimer === 'function') {
        window.cancelAutoAdvanceTimer();
    }
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

    let word = null;
    let reviewItemObj = null; 
    let currentProficiencyBucket = 0;

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-word', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            word = reviewItemObj.itemValue;
            currentProficiencyBucket = reviewItemObj.proficiencyBucket;
        }
    }

    if (!word) { 
        const words = await loadVocabulary(language, days);
        if (!Array.isArray(words) || !words.length) {
            showNoDataMessage(); 
            return;
        }
        word = words[Math.floor(Math.random() * words.length)];
        if (!reviewItemObj && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
            currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-word', word);
        }
    }
    
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5; 

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="word-display-container ${isReview ? 'review-item-cue' : ''}" role="region" aria-label="${t.randomWordExercise || 'Random Word Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="word-display" id="displayed-word" aria-label="${t.wordToPracticeLabel || 'Word to practice'}"><b data-transliterable>${word}</b></div>
            <div class="word-actions">
                <button id="pronounce-word" class="btn-emoji" aria-label="${t.pronounceWord || 'Pronounce word'}">🔊</button>
                <button id="say-word-mc" class="btn-emoji" title="Say it (Microphone Check)">🎤</button> 
            </div>
            <div id="word-transcript" class="transcript-area" style="margin-top: 10px; min-height: 25px; padding: 5px; border: 1px solid #eee; border-radius: 4px;"></div>
            <div id="pronunciation-feedback" style="margin-top:10px; text-align:center; min-height: 25px;"></div>
        </div>
    `;

    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    document.getElementById('pronounce-word')?.addEventListener('click', () => {
        pronounceWord(word, language);
    });

    const recordButton = document.getElementById('say-word-mc');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (typeof recognition !== 'undefined' && recognition.recognizing) {
                recognition.stop();
                return;
            }
            const langCode = mapLanguageToSpeechCode(language);
            const onStartCallback = () => { /* ... */ };
            const onResultCallback = (transcript) => {
                const feedbackEl = document.getElementById('pronunciation-feedback');
                let isCorrect = (typeof normalizeString === 'function' ? normalizeString(transcript.toLowerCase()) : transcript.toLowerCase()) === (typeof normalizeString === 'function' ? normalizeString(word.toLowerCase()) : word.toLowerCase());
                if (isCorrect) {
                    feedbackEl.innerHTML = `<span class="correct">✅ ${t.correct || 'Correct!'}</span>`;
                    if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                } else {
                    feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.tryAgain || 'Try again!'} "${transcript}"</span>`;
                    if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                }
                if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                    CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word, isCorrect);
                }
                if (isCorrect) {
                    setTimeout(() => {
                        window.practiceAllVocabulary();
                    }, 1500);
                }
            };
            const onErrorCallback = (event) => { /* ... */ };
            const onEndCallback = () => { /* ... */ };
            startPronunciationCheck(word, langCode, 'word-transcript', 'pronunciation-feedback', onStartCallback, onResultCallback, onErrorCallback, onEndCallback);
        });
    }
}

async function showOppositesExercise(baseWord = null) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    let word = baseWord;
    let reviewItemObj = null;
    let currentProficiencyBucket = 0;
    let actualOpposite = ''; 

    if (!word && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-word', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            const tempOppositesData = await loadOpposites(language, days); 
            if (tempOppositesData[reviewItemObj.itemValue]) {
                word = reviewItemObj.itemValue;
                currentProficiencyBucket = reviewItemObj.proficiencyBucket;
            } else {
                reviewItemObj = null; 
            }
        }
    }
    
    const oppositesData = await loadOpposites(language, days); 
    if (!word) { 
        const words = await loadVocabulary(language, days);
        const potentialWords = words.filter(w => oppositesData[w]); 
        if (!potentialWords.length) {
            showNoDataMessage(); return;
        }
        word = potentialWords[Math.floor(Math.random() * potentialWords.length)];
        if (!reviewItemObj && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
            currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-word', word);
        }
    }
    
    if (!word || !oppositesData[word]) { 
        showNoDataMessage(); return;
    }
    actualOpposite = oppositesData[word] || (t.noOppositeFound || 'No opposite found');

    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="opposites-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.oppositesExercise || 'Opposites Exercise'}">
            <div class="item-strength" aria-label="Item strength for ${word}: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength (<span data-transliterable>${word}</span>): ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="word-pair">
                <div class="word-box" aria-label="${t.wordAriaLabel || 'Word'}" data-transliterable>${word}</div>
                <div class="opposite-arrow" aria-label="${t.oppositeArrowLabel || 'Opposite arrow'}">≠</div>
                <div class="word-box opposite-answer" id="opposite-answer-display" aria-label="${t.oppositeLabel || 'Opposite'}" data-transliterable>?</div>
            </div>
            <input type="text" id="opposite-input" class="exercise-input" aria-label="${t.typeTheOpposite || 'Type the opposite'}" placeholder="${t.typeTheOppositePlaceholder || 'Type the opposite...'}">
            <div id="opposite-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.opposites-exercise');

    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedback = document.getElementById('opposite-feedback');
            const oppositeAnswerDisplay = document.getElementById('opposite-answer-display');
            const oppositeInput = document.getElementById('opposite-input');
            
            oppositeAnswerDisplay.textContent = actualOpposite;
            oppositeAnswerDisplay.classList.add('revealed');
            if (oppositeInput) oppositeInput.value = actualOpposite;

            feedback.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${actualOpposite}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word, false);
                 if (actualOpposite !== (t.noOppositeFound || 'No opposite found')) {
                    CosyAppInteractive.scheduleReview(language, 'vocabulary-word', actualOpposite, false);
                 }
            }
        };
        exerciseContainer.showHint = function() {
            const feedback = document.getElementById('opposite-feedback');
            if (actualOpposite && actualOpposite !== (t.noOppositeFound || 'No opposite found') && actualOpposite.length > 0) {
                feedback.innerHTML = `<span class="hint-text">${t.hint_firstLetter || 'Hint: The first letter is'} "<span data-transliterable>${actualOpposite[0]}</span>"</span>`;
            } else {
                feedback.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available for this item.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('opposite-input').value.trim();
            const feedback = document.getElementById('opposite-feedback');
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            let isWordCorrect = false; 
            if (userAnswer.toLowerCase() === actualOpposite.toLowerCase()) {
                feedback.innerHTML = `<span class="correct" aria-label="Correct">✅👏 ${currentT.correct || 'Correct!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                isWordCorrect = true; 
                if (actualOpposite !== (currentT.noOppositeFound || 'No opposite found')) { 
                    if (CosyAppInteractive && CosyAppInteractive.scheduleReview) CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', actualOpposite, true); 
                }
                document.getElementById('opposite-answer-display').textContent = actualOpposite;
                if (isWordCorrect) {
                    setTimeout(() => {
                        window.practiceAllVocabulary();
                    }, 1500);
                }
            } else {
                feedback.innerHTML = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.feedbackNotQuiteTryAgain || 'Try again!'}</span>`;
                 if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                 isWordCorrect = false;
            }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', word, isWordCorrect);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
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

    let word = baseWord; 
    let reviewItemObj = null;
    let currentProficiencyBucket = 0;

    if (!word && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-word', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            word = reviewItemObj.itemValue;
            currentProficiencyBucket = reviewItemObj.proficiencyBucket;
        }
    }

    if (!word) {
        const words = await loadVocabulary(language, days);
        if (!words.length) { 
            showNoDataMessage(); return;
        }
        word = words[Math.floor(Math.random() * words.length)];
        if (!reviewItemObj && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
            currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-word', word);
        }
    }
    
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    const shuffledLetters = shuffleArray([...word.toLowerCase()]);
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="build-word-exercise ${isReview ? 'review-item-cue' : ''}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="word-to-build-label" style="text-align:center; margin-bottom:10px; font-style:italic;" data-transliterable></div>
            <div class="letter-pool" id="letter-pool">
                ${shuffledLetters.map((letter) => `
                    <div class="letter-tile" data-letter="${letter}" draggable="true" data-transliterable>${letter}</div>
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
            </div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.build-word-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedback = document.getElementById('build-feedback');
            const wordSlots = document.getElementById('word-slots');
            const letterPool = document.getElementById('letter-pool');
            
            wordSlots.innerHTML = '';
            if (letterPool) letterPool.innerHTML = `<p style="text-align:center;font-style:italic;" data-transliterable>${t.answerRevealed || 'Answer revealed'}</p>`;

            word.split('').forEach(letter => {
                const slot = document.createElement('div');
                slot.className = 'letter-slot';
                const tile = document.createElement('div');
                tile.className = 'letter-tile revealed'; 
                tile.textContent = letter;
                tile.setAttribute('data-transliterable', '');
                slot.appendChild(tile);
                wordSlots.appendChild(slot);
            });

            feedback.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${word}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedback = document.getElementById('build-feedback');
            const firstLetter = word.length > 0 ? word[0] : '';
            if (firstLetter) {
                 feedback.innerHTML = `<span class="hint-text">${t.hint_firstLetter || 'Hint: The first letter is'} "<span data-transliterable>${firstLetter}</span>"</span>`;
            } else {
                 feedback.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available for this item.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const builtWordArr = Array.from(document.querySelectorAll('.word-slots .letter-tile')).map(tile => tile.dataset.letter);
            const builtWord = builtWordArr.join('');
            const feedback = document.getElementById('build-feedback');
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            let isCorrect = false;
            if (builtWord.toLowerCase() === word.toLowerCase()) {
                feedback.innerHTML = `<span class="correct">✅ ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                isCorrect = true;
                if (isCorrect) {
                    setTimeout(() => {
                        window.practiceAllVocabulary();
                    }, 1500);
                }
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${currentT.notQuiteTryAgain || 'Not quite. Keep trying!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                isCorrect = false;
            }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', word, isCorrect);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        
        const resetBtn = document.getElementById('reset-build');
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.word-slots .letter-slot').forEach(slot => slot.innerHTML = '');
                const letterPool = document.getElementById('letter-pool');
                if (letterPool) {
                    letterPool.innerHTML = shuffledLetters.map((letter) => `
                        <div class="letter-tile" data-letter="${letter}" draggable="true" data-transliterable>${letter}</div>
                    `).join('');
                }
                const feedbackDiv = document.getElementById('build-feedback');
                if (feedbackDiv) feedbackDiv.innerHTML = '';
                if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            });
        }
    }
}


async function showIdentifyImage() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }

    let imageItem = null;
    let reviewItemObj = null; 
    let correctAnswer = null; 
    let currentProficiencyBucket = 0;

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-image', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            const allImages = await loadImageVocabulary(language, days); 
            imageItem = allImages.find(img => img.src === reviewItemObj.itemValue);
            if (imageItem) {
                correctAnswer = imageItem.translations[language];
                currentProficiencyBucket = reviewItemObj.proficiencyBucket;
            } else {
                reviewItemObj = null; 
            }
        }
    }

    if (!imageItem) { 
        const allImages = await loadImageVocabulary(language, days);
        if (!allImages.length) { showNoDataMessage(); return; }
        imageItem = allImages[Math.floor(Math.random() * allImages.length)];
        correctAnswer = imageItem.translations[language];
        reviewItemObj = null; 
        if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
            currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-image', imageItem.src);
        }
    }

    if (!imageItem || !correctAnswer) {
        showNoDataMessage(); return;
    }

    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="image-exercise ${isReview ? 'review-item-cue' : ''}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <img src="${imageItem.src}" alt="${imageItem.alt || correctAnswer}" class="vocabulary-image">
            <input type="text" id="image-answer-input" class="exercise-input" placeholder="${t.typeTheWord || 'Type the word...'}">
            <div id="image-feedback" class="exercise-feedback"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.image-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedback = document.getElementById('image-feedback');
            const answerInput = document.getElementById('image-answer-input');
            if (answerInput) {
                answerInput.value = correctAnswer; 
                answerInput.disabled = true;
            }
            feedback.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${correctAnswer}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                CosyAppInteractive.scheduleReview(language, 'vocabulary-image', imageItem.src, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedback = document.getElementById('image-feedback');
            if (correctAnswer && correctAnswer.length > 0) {
                feedback.innerHTML = `<span class="hint-text">${t.hint_firstLetter || 'Hint: The first letter is'} "<span data-transliterable>${correctAnswer[0]}</span>"</span>`;
            } else {
                feedback.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available for this item.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('image-answer-input').value.trim();
            const feedback = document.getElementById('image-feedback');
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            let isCorrect = false;
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedback.innerHTML = `<span class="correct">✅ ${currentT.correct || 'Correct!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                isCorrect = true;
                if (isCorrect) {
                    setTimeout(() => {
                        window.practiceAllVocabulary();
                    }, 1500);
                }
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${currentT.tryAgain || 'Try again!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                isCorrect = false;
            }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-image', imageItem.src, isCorrect);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}


async function showTranscribeWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    if (!language || !days.length) { alert(t.alertLangDay ||'Please select language and day(s) first'); return; }

    let word = null; 
    let reviewItemObj = null;
    let currentProficiencyBucket = 0;

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'vocabulary-word', 1); 
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            word = reviewItemObj.itemValue;
            currentProficiencyBucket = reviewItemObj.proficiencyBucket;
        }
    }

    if (!word) {
        const words = await loadVocabulary(language, days);
        if (!words.length) { showNoDataMessage(); return; }
        word = words[Math.floor(Math.random() * words.length)];
        if (!reviewItemObj && typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
            currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'vocabulary-word', word);
        }
    }

    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = `
        <div class="listening-exercise transcribe-word-exercise ${isReview ? 'review-item-cue' : ''}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <button id="play-word-sound" class="btn-emoji large-emoji" aria-label="${t.playSoundButtonLabel || 'Play Sound'}">🔊</button>
            <input type="text" id="transcription-input" class="exercise-input" placeholder="${t.typeHerePlaceholder || 'Type here...'}">
            <div id="transcription-feedback" class="exercise-feedback"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.transcribe-word-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedback = document.getElementById('transcription-feedback');
            const transcriptionInput = document.getElementById('transcription-input');
            if (transcriptionInput) {
                transcriptionInput.value = word; 
                transcriptionInput.disabled = true;
            }
            feedback.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${word}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                CosyAppInteractive.scheduleReview(language, 'vocabulary-word', word, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedback = document.getElementById('transcription-feedback');
            if (word && word.length > 0) {
                feedback.innerHTML = `<span class="hint-text">${t.hint_firstLetter || 'Hint: The first letter is'} "<span data-transliterable>${word[0]}</span>"</span>`;
            } else {
                feedback.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available for this item.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => {
            const userAnswer = document.getElementById('transcription-input').value.trim();
            const feedback = document.getElementById('transcription-feedback');
            const currentLanguage = document.getElementById('language').value;
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            let isCorrect = false;
            if (userAnswer.toLowerCase() === word.toLowerCase()) {
                feedback.innerHTML = `<span class="correct">✅ ${currentT.correct || 'Correct!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                isCorrect = true;
                if (isCorrect) {
                    setTimeout(() => {
                        window.practiceAllVocabulary();
                    }, 1500);
                }
            } else {
                feedback.innerHTML = `<span class="incorrect">❌ ${currentT.tryAgain || 'Try again!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                isCorrect = false;
            }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) CosyAppInteractive.scheduleReview(currentLanguage, 'vocabulary-word', word, isCorrect);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('play-word-sound')?.addEventListener('click', () => pronounceWord(word, language));
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

console.log('[VocabJS] After all function definitions, before global assignments for show... functions');
console.log('[VocabJS] After global assignments for show... functions, before patching calls');

window.showRandomWord = patchExerciseWithExtraButtons(showRandomWord, '.word-display-container', window.startRandomWordPractice, { 
    noCheck: true, noReveal: true, noHint: true, deferRandomizeClick: true,
    specificNextExerciseFn: window.showRandomWord,
    specificNextExerciseLabelKey: 'buttons.newShowWord',
    specificNextExerciseAlternateLabel: 'New Word'
});
window.showOppositesExercise = patchExerciseWithExtraButtons(showOppositesExercise, '.opposites-exercise', window.startRandomWordPractice, {
    specificNextExerciseFn: window.showOppositesExercise,
    specificNextExerciseLabelKey: 'buttons.newOppositeExercise',
    specificNextExerciseAlternateLabel: 'New Opposites'
});
window.showMatchOpposites = patchExerciseWithExtraButtons(showMatchOpposites, '.match-opposites-exercise', window.startRandomWordPractice, { 
    specificNextExerciseFn: window.showMatchOpposites,
    specificNextExerciseLabelKey: 'buttons.newMatchOpposites',
    specificNextExerciseAlternateLabel: 'New Match Game'
}); 
window.showBuildWord = patchExerciseWithExtraButtons(showBuildWord, '.build-word-exercise', window.startRandomWordPractice, {
    specificNextExerciseFn: window.showBuildWord,
    specificNextExerciseLabelKey: 'buttons.newBuildWord',
    specificNextExerciseAlternateLabel: 'New Build Word'
});
window.showIdentifyImage = patchExerciseWithExtraButtons(showIdentifyImage, '.image-exercise', window.startRandomImagePractice, {
    specificNextExerciseFn: window.showIdentifyImage,
    specificNextExerciseLabelKey: 'buttons.newIdentifyImage',
    specificNextExerciseAlternateLabel: 'New Image ID'
});
window.showMatchImageWord = patchExerciseWithExtraButtons(showMatchImageWord, '.match-image-word-exercise', window.startRandomImagePractice, { 
    noCheck: true, // Check is implicit in matching logic
    specificNextExerciseFn: window.showMatchImageWord,
    specificNextExerciseLabelKey: 'buttons.newMatchImage',
    specificNextExerciseAlternateLabel: 'New Image Match'
}); 
window.showIdentifyImageYesNo = patchExerciseWithExtraButtons(showIdentifyImageYesNo, '.identify-yes-no-exercise', window.startRandomImagePractice, { 
    noCheck: true, /* Check is implicit in button selection */
    specificNextExerciseFn: window.showIdentifyImageYesNo,
    specificNextExerciseLabelKey: 'buttons.newIdentifyImageYesNo',
    specificNextExerciseAlternateLabel: 'New Image Y/N'
}); 
window.showTranscribeWord = patchExerciseWithExtraButtons(showTranscribeWord, '.transcribe-word-exercise', window.startListeningPractice, {
    specificNextExerciseFn: window.showTranscribeWord,
    specificNextExerciseLabelKey: 'buttons.newTranscribeWord',
    specificNextExerciseAlternateLabel: 'New Transcription'
});
window.showMatchSoundWord = patchExerciseWithExtraButtons(showMatchSoundWord, '.match-sound-exercise', window.startListeningPractice, { 
    noCheck: true, // Check is implicit via button click
    specificNextExerciseFn: window.showMatchSoundWord,
    specificNextExerciseLabelKey: 'buttons.newMatchSound',
    specificNextExerciseAlternateLabel: 'New Sound Match'
}); 
window.showTranscribeWordYesNo = patchExerciseWithExtraButtons(showTranscribeWordYesNo, '.transcribe-word-yes-no-exercise', window.startListeningPractice, { 
    noCheck: true, // Check is implicit via button click
    specificNextExerciseFn: window.showTranscribeWordYesNo,
    specificNextExerciseLabelKey: 'buttons.newTranscribeWordYesNo',
    specificNextExerciseAlternateLabel: 'New Transcribe Y/N'
}); 
console.log('[VocabJS] After patching calls');

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

console.log('[VocabJS] Before DOMContentLoaded listener');
document.addEventListener('DOMContentLoaded', window.initVocabularyPractice);
console.log('[VocabJS] Script end');
