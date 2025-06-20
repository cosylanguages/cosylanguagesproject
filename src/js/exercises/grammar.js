async function startPossessivesPractice() {
    console.warn("Placeholder: startPossessivesPractice called but not implemented.");
    const resultArea = document.getElementById('result');
    if (resultArea) {
        resultArea.innerHTML = '<p>Possessives practice is currently unavailable.</p>';
    }
}

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
    let dayData = [];
    if (data) {
        if (Array.isArray(day)) { 
            day.forEach(d => {
                if (data[d]) dayData = dayData.concat(data[d]);
            });
        } else if (data[day]) { 
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

async function loadVocabularyData(language, days) { /* ... existing ... */ }
async function loadPossessivesGrammar(language, day) { /* ... existing ... */ }

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
};

function initGrammarPractice() { /* ... existing ... */ }
async function startGenderPractice() { /* ... existing ... */ }

async function showArticleWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    let grammarItem = null; // This will hold { word: "...", article: "..." }
    let reviewItemObj = null; // This is from learningItems

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'grammar-article', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            const reviewWord = reviewItemObj.itemValue;
            const grammarDataForReview = await loadGenderGrammar(language, days); 
            const foundItem = grammarDataForReview.find(item => item.word.toLowerCase() === reviewWord.toLowerCase());

            if (foundItem) {
                grammarItem = foundItem;
                console.log("Using review item for showArticleWord:", grammarItem, "Review Data:", reviewItemObj);
            } else {
                console.error("Review item word found, but its details not in current grammar load. Word:", reviewWord);
                reviewItemObj = null; // Fallback to new item
            }
        } else {
             console.log("No review items for grammar-article.");
        }
    }

    if (!grammarItem) { 
        const items = await loadGenderGrammar(language, days);
        if (!items.length) {
            showNoDataMessage();
            return;
        }
        grammarItem = items[Math.floor(Math.random() * items.length)];
        console.log("Using new item for showArticleWord:", grammarItem);
        reviewItemObj = null; // Ensure this is null for new items
    }
    
    if (!grammarItem) {
        console.error("Failed to select a grammar item for the exercise.");
        showNoDataMessage();
        return;
    }

    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    const variations = [
        { type: 'article', question: `"${grammarItem.word}"`, answer: grammarItem.article }, 
        { type: 'word', question: `"${grammarItem.article}"`, answer: grammarItem.word }    
    ];
    const variation = variations[Math.floor(Math.random() * variations.length)];

    resultArea.innerHTML = `
        <div class="gender-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.aria?.genderExercise || 'Gender Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="gender-prompt" aria-label="${variation.question}">${variation.question}</div>
            <button id="pronounce-gender-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="${t.aria?.typeYourAnswer || 'Type your answer'}" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}">
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
            <!-- Action buttons are typically added by patchExerciseWithExtraButtons -->
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.gender-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => { /* ... existing ... */ };
        exerciseContainer.checkAnswer = async function() {
            const userInput = document.getElementById('gender-answer-input').value.trim();
            let feedbackText = '';
            let isCorrect = false;
            const currentLanguage = document.getElementById('language').value; 
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
                } else { 
                    if (userInput.toLowerCase() === variation.answer.toLowerCase()) { 
                        feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                         if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardCorrectAnswer();
                        isCorrect = true;
                    } else {
                        feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <b>${variation.answer}</b>.</span>`;
                        if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardIncorrectAnswer();
                    }
                }
            }
            document.getElementById('gender-answer-feedback').innerHTML = feedbackText;

            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && grammarItem.word) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', grammarItem.word, isCorrect);
            }

            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if(isCorrect){ 
                 setTimeout(() => { startGenderPractice(); }, 1200);
            }
        };
        exerciseContainer.revealAnswer = function() { /* ... existing ... */ };
    }
    
    const pronounceButton = document.getElementById('pronounce-gender-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const wordToPronounce = variation.type === 'article' ? grammarItem.word : grammarItem.article;
        if (wordToPronounce) pronounceWord(wordToPronounce, language); 
        pronounceButton.addEventListener('click', () => {
            if (wordToPronounce) pronounceWord(wordToPronounce, language);
        });
    }
}

async function showMatchArticlesWords() { /* ... existing, no strength bar for matching game ... */ }

async function showSelectArticleExercise() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const NUM_ARTICLE_OPTIONS = 4; 

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    
    let selectedItem = null; // This is the { word: "...", article: "..." } object
    let reviewItemObj = null; // This is from learningItems { itemValue: "word", proficiencyBucket: N }

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'grammar-article', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            const reviewWord = reviewItemObj.itemValue;
            const allGenderItems = await loadGenderGrammar(language, days);
            selectedItem = allGenderItems.find(gi => gi.word.toLowerCase() === reviewWord.toLowerCase());
            if (selectedItem) {
                console.log("Using review item for showSelectArticleExercise:", selectedItem, "Review Data:", reviewItemObj);
            } else {
                console.error("Review item word found, but details not in current load. Word:", reviewWord);
                reviewItemObj = null; // Fallback
            }
        } else {
            console.log("No review items for grammar-article in showSelectArticleExercise.");
        }
    }

    if (!selectedItem) {
        const allGenderItems = await loadGenderGrammar(language, days);
        if (!allGenderItems.length) { showNoDataMessage(); return; }
        selectedItem = allGenderItems[Math.floor(Math.random() * allGenderItems.length)];
        console.log("Using new item for showSelectArticleExercise:", selectedItem);
        reviewItemObj = null;
    }

    if (!selectedItem) { showNoDataMessage(); return; }

    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;
    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    let allArticlesForLang = [...new Set((await loadGenderGrammar(language, days)).map(item => item.article))];
    let articleOptions = [correctArticle];
    allArticlesForLang = allArticlesForLang.filter(art => art !== correctArticle);
    shuffleArray(allArticlesForLang);
    for (let i = 0; i < Math.min(NUM_ARTICLE_OPTIONS - 1, allArticlesForLang.length); i++) {
        articleOptions.push(allArticlesForLang[i]);
    }
    articleOptions = shuffleArray(articleOptions);
    
    if (articleOptions.length < 2 && !articleOptions.includes(correctArticle)) {
        articleOptions.push(correctArticle); // Ensure correct one is an option
    }
    if (articleOptions.length < 1) { // Should not happen if selectedItem is valid
         resultArea.innerHTML = `<p>${t.notEnoughOptionsError || 'Not enough article options to create this exercise.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    
    resultArea.innerHTML = `
        <div class="select-article-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.aria?.selectArticleExercise || 'Select the Article Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
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
            <!-- Action buttons are typically added by patchExerciseWithExtraButtons -->
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.select-article-exercise');
    if (exerciseContainer) { exerciseContainer.showHint = () => { /* ... */ }; }

    const pronounceButton = document.getElementById('pronounce-select-article-word');
    if (pronounceButton && typeof pronounceWord === 'function') {
        pronounceWord(wordToShow, language); 
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
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && wordToShow) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', wordToShow, isCorrect);
            }
            document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true); 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    });
}

async function startVerbsPractice() { /* ... existing ... */ }

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }

    let itemForExercise = null; // Full verb item: { verb: "be", pronoun: "I", form: "am", sentence: "I ___ good." }
    let reviewItemObj = null;   // From learningItems { itemValue: "be", proficiencyBucket: N } (itemValue is verb infinitive)

    if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getDueReviewItems) {
        const reviewItems = CosyAppInteractive.getDueReviewItems(language, 'grammar-verb', 1);
        if (reviewItems && reviewItems.length > 0) {
            reviewItemObj = reviewItems[0];
            const reviewVerbInfinitive = reviewItemObj.itemValue;
            const allVerbItems = await loadVerbGrammar(language, days);
            // Find a suitable item for this verb infinitive. Might need to pick a random pronoun or tense.
            const suitableVerbItems = allVerbItems.filter(vi => vi.verb.toLowerCase() === reviewVerbInfinitive.toLowerCase());
            if (suitableVerbItems.length > 0) {
                itemForExercise = suitableVerbItems[Math.floor(Math.random() * suitableVerbItems.length)];
                console.log("Using review item for showTypeVerb:", itemForExercise, "Review Data:", reviewItemObj);
            } else {
                console.error("Review verb infinitive found, but no matching items in current load. Verb:", reviewVerbInfinitive);
                reviewItemObj = null; // Fallback
            }
        } else {
            console.log("No review items for grammar-verb.");
        }
    }

    if (!itemForExercise) {
        const allVerbItems = await loadVerbGrammar(language, days);
        if (!allVerbItems.length) { showNoDataMessage(); return; }
        itemForExercise = allVerbItems[Math.floor(Math.random() * allVerbItems.length)];
        console.log("Using new item for showTypeVerb:", itemForExercise);
        reviewItemObj = null;
    }
    
    if (!itemForExercise) { showNoDataMessage(); return; }

    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    const variation = { promptText: `${itemForExercise.pronoun} ( ${itemForExercise.verb} )`, answer: itemForExercise.form };
    const correctAnswer = variation.answer;

    resultArea.innerHTML = `
        <div class="verb-exercise ${isReview ? 'review-item-cue' : ''}" aria-label="${t.verbExerciseAriaLabel || 'Verb Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="verb-prompt">${variation.promptText}</div>
            <button id="pronounce-verb-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="verb-answer-input" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}" class="exercise-input">
            <div id="verb-answer-feedback" class="exercise-feedback"></div>
            <!-- Action buttons are typically added by patchExerciseWithExtraButtons -->
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.verb-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => { /* ... */ };
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
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && itemForExercise.verb) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-verb', itemForExercise.verb, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.revealAnswer = function() { /* ... */ };
    }
    const pronounceButton = document.getElementById('pronounce-verb-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const textToPronounce = `${itemForExercise.pronoun} ${itemForExercise.form}`; 
        pronounceWord(textToPronounce, language); 
        pronounceButton.addEventListener('click', () => pronounceWord(textToPronounce, language));
    }
}

async function showMatchVerbsPronouns() { /* ... existing, no strength bar for matching game ... */ }
async function showFillGaps() { /* ... existing, could add strength if based on a single reviewable verb ... */ }
async function showWordOrder() { /* ... existing, complex to assign strength to a whole sentence structure ... */ }
async function practiceAllGrammar() { /* ... existing ... */ }

// Global Assignments for functions to be accessible via window object
window.initGrammarPractice = initGrammarPractice;
window.startGenderPractice = startGenderPractice;
window.startVerbsPractice = startVerbsPractice;
window.startPossessivesPractice = startPossessivesPractice; // Newly added placeholder
window.practiceAllGrammar = practiceAllGrammar;

window.showArticleWord = showArticleWord;
window.showMatchArticlesWords = showMatchArticlesWords;
window.showSelectArticleExercise = showSelectArticleExercise;
window.showTypeVerb = showTypeVerb;
window.showMatchVerbsPronouns = showMatchVerbsPronouns;
window.showFillGaps = showFillGaps;
window.showWordOrder = showWordOrder;

// Patching exercise functions
// Ensure the first argument is the local function name, and callbacks use window.functionName if they are global
window.showArticleWord = patchExerciseWithExtraButtons(showArticleWord, '.gender-exercise', window.startGenderPractice, { newExercise: { fn: window.startGenderPractice, textKey: 'newExercise' } });
window.showMatchArticlesWords = patchExerciseWithExtraButtons(showMatchArticlesWords, '.match-exercise', window.startGenderPractice, { noCheck: true, newExercise: { fn: window.startGenderPractice, textKey: 'newExercise' } });
window.showSelectArticleExercise = patchExerciseWithExtraButtons(showSelectArticleExercise, '.select-article-exercise', window.startGenderPractice, { noCheck: true, newExercise: { fn: window.startGenderPractice, textKey: 'newExercise' } });
window.showTypeVerb = patchExerciseWithExtraButtons(showTypeVerb, '.verb-exercise', window.startVerbsPractice, { newExercise: { fn: window.startVerbsPractice, textKey: 'newExercise' } });
window.showMatchVerbsPronouns = patchExerciseWithExtraButtons(showMatchVerbsPronouns, '.match-exercise', window.startVerbsPractice, { noCheck: true, newExercise: { fn: window.startVerbsPractice, textKey: 'newExercise' } });
window.showFillGaps = patchExerciseWithExtraButtons(showFillGaps, '.fill-gap-exercise', window.startVerbsPractice, { newExercise: { fn: window.startVerbsPractice, textKey: 'newExercise' } });
window.showWordOrder = patchExerciseWithExtraButtons(showWordOrder, '.word-order-exercise', window.startVerbsPractice, { newExercise: { fn: window.startVerbsPractice, textKey: 'newExercise' } });

document.addEventListener('DOMContentLoaded', initGrammarPractice);
