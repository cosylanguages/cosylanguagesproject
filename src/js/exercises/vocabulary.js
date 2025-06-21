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

    // Ensure utils.js functions are available
    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions (shuffleArray, showNoDataMessage) not found. Make sure utils.js is loaded.");
        const resultArea = document.getElementById('result');
        if (resultArea) {
            resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        }
        return;
    }
    
    // Ensure CosyAppInteractive is available for progress tracking
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
            <p class="exercise-prompt" data-transliterable>${t.matchOppositesPrompt || 'Match the words with their opposites:'}</p>
            <div class="matching-area">
                <div class="column words-column" id="match-words-col">
                    ${wordsColumn.map((word, index) => `<button class="match-item btn-match-item" data-id="word-${index}" data-value="${word}" data-transliterable>${word}</button>`).join('')}
                </div>
                <div class="column opposites-column" id="match-opposites-col">
                    ${oppositesColumn.map((opposite, index) => `<button class="match-item btn-match-item" data-id="opposite-${index}" data-value="${opposite}" data-transliterable>${opposite}</button>`).join('')}
                </div>
            </div>
            <div id="match-feedback" class="exercise-feedback" aria-live="polite" style="min-height: 25px; margin-top:10px;"></div>
            <button id="btn-new-match-opposites" class="exercise-button" onclick="window.showMatchOpposites()">🔄 ${t.buttons?.newMatchOpposites || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
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
    console.warn("Placeholder: Match Image with Word exercise (showMatchImageWord) called but not implemented.");
    const resultArea = document.getElementById('result');
    if (resultArea) {
        resultArea.innerHTML = '<p>The "Match Image with Word" exercise is currently unavailable. Please try another exercise.</p>';
        const exerciseContainer = resultArea.firstChild; 
        if (exerciseContainer && typeof exerciseContainer === 'object' && exerciseContainer.innerHTML) { 
             exerciseContainer.revealAnswer = function() {
                const lang = document.getElementById('language')?.value || 'COSYenglish';
                const trans = (window.translations && window.translations[lang]) || (window.translations && window.translations.COSYenglish) || {};
                alert(trans.exerciseNotFullyImplemented || "This exercise is not fully implemented yet, so reveal is unavailable.");
            };
            exerciseContainer.showHint = function() {
                const lang = document.getElementById('language')?.value || 'COSYenglish';
                const trans = (window.translations && window.translations[lang]) || (window.translations && window.translations.COSYenglish) || {};
                alert(trans.hintNotImplemented || "Hint not available for this exercise yet.");
            };
        }
    }
}

async function showTranscribeWordYesNo() {
    console.warn("Placeholder: Transcribe Word (Yes/No) listening exercise (showTranscribeWordYesNo) called but not implemented.");
    const resultArea = document.getElementById('result');
    if (resultArea) {
        resultArea.innerHTML = '<p>The "Transcribe Word (Yes/No)" listening exercise is currently unavailable. Please try another exercise.</p>';
        const exerciseContainer = resultArea.firstChild;
        if (exerciseContainer && typeof exerciseContainer === 'object' && exerciseContainer.innerHTML) {
             exerciseContainer.revealAnswer = function() {
                const lang = document.getElementById('language')?.value || 'COSYenglish';
                const trans = (window.translations && window.translations[lang]) || (window.translations && window.translations.COSYenglish) || {};
                alert(trans.exerciseNotFullyImplemented || "This exercise is not fully implemented yet, so reveal is unavailable.");
            };
            exerciseContainer.showHint = function() {
                const lang = document.getElementById('language')?.value || 'COSYenglish';
                const trans = (window.translations && window.translations[lang]) || (window.translations && window.translations.COSYenglish) || {};
                alert(trans.hintNotImplemented || "Hint not available for this exercise yet.");
            };
        }
    }
}

async function showMatchSoundWord() {
    console.warn("Placeholder: Match Sound with Word listening exercise (showMatchSoundWord) called but not implemented.");
    const resultArea = document.getElementById('result');
    if (resultArea) {
        resultArea.innerHTML = '<p>The "Match Sound with Word" listening exercise is currently unavailable. Please try another exercise.</p>';
        const exerciseContainer = resultArea.firstChild;
        if (exerciseContainer && typeof exerciseContainer === 'object' && exerciseContainer.innerHTML) {
             exerciseContainer.revealAnswer = function() {
                const lang = document.getElementById('language')?.value || 'COSYenglish';
                const trans = (window.translations && window.translations[lang]) || (window.translations && window.translations.COSYenglish) || {};
                alert(trans.exerciseNotFullyImplemented || "This exercise is not fully implemented yet, so reveal is unavailable.");
            };
            exerciseContainer.showHint = function() {
                const lang = document.getElementById('language')?.value || 'COSYenglish';
                const trans = (window.translations && window.translations[lang]) || (window.translations && window.translations.COSYenglish) || {};
                alert(trans.hintNotImplemented || "Hint not available for this exercise yet.");
            };
        }
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
            <button id="btn-new-identify-image-yes-no" class="exercise-button" style="margin-top: 15px;" onclick="window.showIdentifyImageYesNo()">🔄 ${t.buttons?.newIdentifyImageYesNo || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
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
        exerciseContainer.checkAnswer = function() { /* Not applicable */ };
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
            console.log("Using review item for showRandomWord:", reviewItemObj);
        } else {
            console.log("No review item, selecting new word for showRandomWord.");
        }
    }

    if (!word) { 
        const words = await loadVocabulary(language, days);
        if (!Array.isArray(words) || !words.length) {
            showNoDataMessage(); 
            return;
        }
        word = words[Math.floor(Math.random() * words.length)];
        console.log("Using new item for showRandomWord:", word);
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
                <button id="btn-new-show-word" class="btn-emoji" onclick="window.showRandomWord()" aria-label="${t.buttons?.newShowWord || t.buttons?.newExerciseSameType || 'New Exercise'}">🔄 ${t.buttons?.newShowWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
            </div>
            <div id="word-transcript" class="transcript-area" style="margin-top: 10px; min-height: 25px; padding: 5px; border: 1px solid #eee; border-radius: 4px;"></div>
            <div id="pronunciation-feedback" style="margin-top:10px; text-align:center; min-height: 25px;"></div>
        </div>
    `;

    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.word-display-container');
    if (exerciseContainer) {
        // showRandomWord has noHint: true in patchExerciseWithExtraButtons, so no showHint needed here.
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
    let actualOpposite = ''; // Define actualOpposite here

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
            <div class="exercise-actions">
                <button id="btn-new-opposite-exercise" class="exercise-button" onclick="window.showOppositesExercise()">🔄 ${t.buttons?.newOppositeExercise || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
            </div>
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

    let word = baseWord; // Use this to store the target word
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
            <div class="word-to-build-label" style="text-align:center; margin-bottom:10px; font-style:italic;" data-transliterable>${isReview ? `Word: ${word}`}</div>
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
                <button id="btn-new-build-word" class="exercise-button" onclick="window.showBuildWord()">🔄 ${t.buttons?.newBuildWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
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
    }
}


async function showIdentifyImage() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }

    let imageItem = null;
    let reviewItemObj = null; 
    let correctAnswer = null; // Stores the correct name for the image
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
            <button id="btn-new-identify-image" class="exercise-button" onclick="window.showIdentifyImage()">🔄 ${t.buttons?.newIdentifyImage || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
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

    let word = null; // This will store the word to be transcribed
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
            <button id="btn-new-transcribe-word" class="exercise-button" onclick="window.showTranscribeWord()">🔄 ${t.buttons?.newTranscribeWord || t.buttons?.newExerciseSameType || 'New Exercise'}</button>
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
                // Show the first letter as a hint
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
window.showRandomWord = patchExerciseWithExtraButtons(showRandomWord, '.word-display-container', window.startRandomWordPractice, { noCheck: true, noReveal: true, noHint: true, deferRandomizeClick: true });
window.showOppositesExercise = patchExerciseWithExtraButtons(showOppositesExercise, '.opposites-exercise', window.startRandomWordPractice, {});
window.showMatchOpposites = patchExerciseWithExtraButtons(showMatchOpposites, '.match-exercise', window.startRandomWordPractice, {}); 
window.showBuildWord = patchExerciseWithExtraButtons(showBuildWord, '.build-word-exercise', window.startRandomWordPractice, {});
window.showIdentifyImage = patchExerciseWithExtraButtons(showIdentifyImage, '.image-exercise', window.startRandomImagePractice, {});
window.showMatchImageWord = patchExerciseWithExtraButtons(showMatchImageWord, '.match-image-word-exercise', window.startRandomImagePractice, { noCheck: true }); 
window.showIdentifyImageYesNo = patchExerciseWithExtraButtons(showIdentifyImageYesNo, '.identify-yes-no-exercise', window.startRandomImagePractice, { noCheck: true, noReveal: true }); 
window.showTranscribeWord = patchExerciseWithExtraButtons(showTranscribeWord, '.transcribe-word-exercise', window.startListeningPractice, {});
window.showMatchSoundWord = patchExerciseWithExtraButtons(showMatchSoundWord, '.match-sound-exercise', window.startListeningPractice, { noCheck: true }); 
window.showTranscribeWordYesNo = patchExerciseWithExtraButtons(showTranscribeWordYesNo, '.transcribe-word-yes-no-exercise', window.startListeningPractice, { noCheck: true, noReveal: true }); 
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
