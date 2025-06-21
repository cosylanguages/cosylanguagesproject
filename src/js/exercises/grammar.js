// Function to load possessives grammar data (assuming a similar structure to other grammar data)
async function loadPossessivesGrammar(language, day) {
    // This is a placeholder. Actual implementation will depend on the JSON structure for possessives.
    console.warn(`loadPossessivesGrammar for ${language}, day ${day} - Not fully implemented, returning empty array.`);
    // Example: const filePath = `data/grammar/possessives/possessives_${language}.json`;
    // const data = await loadData(filePath); 
    // return data[day] || [];
    return []; // Placeholder
}


async function startPossessivesPractice() {
    console.log("startPossessivesPractice called.");
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    
    resultArea.innerHTML = `<p>${t.possessivesComingSoon || 'Possessives practice exercises are coming soon!'}</p>`;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
}

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

// Updated to expect a structure like: { pronoun: "I", verb: "to be", form: "am", sentence_template?: "I ___ happy.", full_sentence?: "I am happy." }
// If sentence_template is missing, a generic one will be used.
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

    const dayKeys = Array.isArray(days) ? days : [days];
    dayKeys.forEach(dayKey => {
        if (data[dayKey]) {
            data[dayKey].forEach(rawItem => {
                let item = { ...rawItem }; 

                if (!item.verb) {
                    if (item.answer && ['am', 'is', 'are', 'was', 'were'].includes(item.answer.toLowerCase())) item.verb = 'to be';
                    else if (item.answer && ['have', 'has', 'had'].includes(item.answer.toLowerCase())) item.verb = 'to have';
                    else item.verb = 'to ' + item.answer?.replace(/s$/, '').replace(/ed$/, '').replace(/ing$/, '');
                }

                if (rawItem.prompt && rawItem.answer && !rawItem.pronoun && !rawItem.form) {
                    if (rawItem.prompt.length <= 3 || ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr'].includes(rawItem.prompt.toLowerCase()) ) {
                        item.pronoun = rawItem.prompt;
                        item.form = rawItem.answer;
                    } else { 
                         item.form = rawItem.prompt;
                         item.pronoun = rawItem.answer;
                    }
                }
                
                if (!item.pronoun || !item.verb || !item.form) {
                    return; 
                }
                
                if (!item.full_sentence) {
                    let objectPart = "happy"; 
                    if (item.verb.toLowerCase() === "to have") objectPart = "a cat";
                    else if (item.verb.toLowerCase() !== "to be") objectPart = "well"; 
                    item.full_sentence = `${item.pronoun} ${item.form} ${objectPart}.`;
                }
                if (!item.sentence_template) {
                     item.sentence_template = item.full_sentence.replace(new RegExp(`\\b${item.form}\\b`, 'i'), "___");
                     if (!item.sentence_template.includes("___")) { // Fallback if form is tricky (e.g. part of another word)
                        item.sentence_template = `${item.pronoun} ___ ${item.full_sentence.split(' ').slice(2).join(' ')}`;
                     }
                }

                const stringifiedItemKey = JSON.stringify({pronoun: item.pronoun, verb: item.verb, form: item.form });
                if (!seenItems.has(stringifiedItemKey)) {
                    seenItems.add(stringifiedItemKey);
                    combinedVerbData.push(item); 
                }
            });
        }
    });
    return combinedVerbData;
}


const GRAMMAR_PRACTICE_TYPES = { 
    'gender': {
        exercises: ['showArticleWord', 'showMatchArticlesWords', 'showSelectArticleExercise'],
        name: 'Gender & Articles'
    },
    'verbs': {
        exercises: ['showTypeVerb', 'showMatchVerbsPronouns', 'showFillGaps', 'showWordOrder'],
        name: 'Verbs & Conjugation'
    },
    'possessives': { 
        exercises: [/* 'showPossessiveExercise1', 'showPossessiveExercise2' */], 
        name: 'Possessives'
    }
};

function initGrammarPractice() {
    document.getElementById('gender-btn')?.addEventListener('click', startGenderPractice);
    document.getElementById('verbs-btn')?.addEventListener('click', startVerbsPractice);
    document.getElementById('possessives-btn')?.addEventListener('click', startPossessivesPractice);
    document.getElementById('practice-all-grammar-btn')?.addEventListener('click', practiceAllGrammar);
}

async function startGenderPractice() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    if (!language || !days.length) { 
        alert((window.translations?.[language]?.alertLangDay || window.translations?.COSYenglish?.alertLangDay) || 'Please select language and day(s) first');
        return;
    }
    const genderExercises = GRAMMAR_PRACTICE_TYPES['gender'].exercises;
    const randomExerciseName = genderExercises[Math.floor(Math.random() * genderExercises.length)];
    if (typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Exercise function ${randomExerciseName} not found.`);
        document.getElementById('result').innerHTML = `<p>Error: Could not load exercise.</p>`;
    }
}

async function showArticleWord() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }

    let grammarItem = null; 
    let reviewItemObj = null; 

    if (!grammarItem) { 
        const items = await loadGenderGrammar(language, days);
        if (!items || !items.length) { 
            showNoDataMessage(t.noGenderData || 'No gender data available for this selection.');
            return;
        }
        grammarItem = items[Math.floor(Math.random() * items.length)];
        reviewItemObj = null; 
    }
    
    if (!grammarItem) {
        showNoDataMessage(t.noGenderData || 'Failed to select a gender item.');
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
            <div class="gender-prompt" data-transliterable aria-label="${variation.question}">${variation.question}</div>
            <button id="pronounce-gender-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="gender-answer-input" class="exercise-input" aria-label="${t.aria?.typeYourAnswer || 'Type your answer'}" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}">
            <div id="gender-answer-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.gender-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('gender-answer-feedback');
            const answerInput = document.getElementById('gender-answer-input');
            answerInput.value = variation.answer;
            answerInput.disabled = true;
            feedbackEl.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${variation.answer}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview && grammarItem.word) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-article', grammarItem.word, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedbackEl = document.getElementById('gender-answer-feedback');
            feedbackEl.innerHTML = `<span class="hint-text">${t.hint_firstLetterIs || 'Hint: The first letter is'} "<span data-transliterable>${variation.answer[0]}</span>"</span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = async function() {
            const userInput = document.getElementById('gender-answer-input').value.trim();
            let feedbackText = '';
            let isCorrect = false;
            const currentLanguage = document.getElementById('language').value; 
            const currentT = (window.translations && window.translations[currentLanguage]) || (window.translations && window.translations.COSYenglish) || {};
            
            if (!userInput) {
                feedbackText = `<span style="color:#e67e22;">${currentT.feedbackPleaseType || 'Please type your answer above.'}</span>`;
            } else {
                if (userInput.toLowerCase() === variation.answer.toLowerCase()) {
                    feedbackText = `<span class="correct" aria-label="Correct">✅🎉 ${currentT.correctWellDone || 'Correct! Well done!'}</span>`;
                    if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardCorrectAnswer();
                    isCorrect = true;
                } else {
                    feedbackText = `<span class="incorrect" aria-label="Incorrect">❌🤔 ${currentT.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${variation.answer}</strong></span>`;
                    if (typeof CosyAppInteractive !== 'undefined') CosyAppInteractive.awardIncorrectAnswer();
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

async function showMatchArticlesWords(baseItems = null) { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const NUM_PAIRS_TO_SHOW = 4;

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions missing.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        return;
    }

    let grammarItems = baseItems;
    if (!grammarItems || grammarItems.length < NUM_PAIRS_TO_SHOW) {
        const allGenderData = await loadGenderGrammar(language, days);
        if (!allGenderData || allGenderData.length < NUM_PAIRS_TO_SHOW) {
            showNoDataMessage(t.notEnoughGenderData || `Not enough gender data for this exercise. Need at least ${NUM_PAIRS_TO_SHOW} pairs.`);
            return;
        }
        grammarItems = shuffleArray(allGenderData).slice(0, NUM_PAIRS_TO_SHOW);
    }
    
    if (!grammarItems || grammarItems.length === 0) { // Handles case where slice might return empty
        showNoDataMessage(t.notEnoughGenderData || 'No gender data available to create pairs.');
        return;
    }

    const articlesColumn = shuffleArray(grammarItems.map(item => item.article));
    const wordsColumn = shuffleArray(grammarItems.map(item => item.word));
    
    const correctPairs = {}; // word: article
    grammarItems.forEach(item => {
        correctPairs[item.word] = item.article;
    });

    resultArea.innerHTML = `
        <div class="match-exercise match-articles-words-exercise" role="form" aria-label="${t.aria?.matchArticlesWords || 'Match Articles and Words'}">
            <p class="exercise-prompt" data-transliterable></p>
            <div class="match-container">
                <div class="match-col articles-column" id="match-articles-col">
                    ${articlesColumn.map((article, index) => `<button class="match-item btn-match-item" data-id="article-${index}" data-value="${article}" data-type="article" data-transliterable>${article}</button>`).join('')}
                </div>
                <div class="match-col words-column" id="match-words-col">
                    ${wordsColumn.map((word, index) => `<button class="match-item btn-match-item" data-id="word-${index}" data-value="${word}" data-type="word" data-transliterable>${word}</button>`).join('')}
                </div>
            </div>
            <div id="match-articles-feedback" class="exercise-feedback" aria-live="polite" style="min-height: 25px; margin-top:10px;"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    let selectedArticle = null;
    let selectedWord = null;
    const items = Array.from(resultArea.querySelectorAll('.match-item'));
    const feedbackDiv = document.getElementById('match-articles-feedback');
    let matchedCount = 0;

    items.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.disabled) return;

            this.classList.add('selected');
            this.disabled = true;

            if (this.dataset.type === 'article') {
                if (selectedArticle) { 
                    selectedArticle.classList.remove('selected');
                    selectedArticle.disabled = false;
                }
                selectedArticle = this;
            } else if (this.dataset.type === 'word') {
                if (selectedWord) { 
                    selectedWord.classList.remove('selected');
                    selectedWord.disabled = false;
                }
                selectedWord = this;
            }

            if (selectedArticle && selectedWord) {
                const articleValue = selectedArticle.dataset.value;
                const wordValue = selectedWord.dataset.value;

                if (correctPairs[wordValue] === articleValue) {
                    selectedArticle.classList.add('matched', 'correct');
                    selectedWord.classList.add('matched', 'correct');
                    feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct Match!'}</span>`;
                    matchedCount++;
                    if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                    if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        CosyAppInteractive.scheduleReview(language, 'grammar-article', wordValue, true); 
                    }

                    if (matchedCount === grammarItems.length) {
                        feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
                        setTimeout(() => {
                            if (window.startGenderPractice) window.startGenderPractice();
                        }, 2000);
                    }
                } else {
                    selectedArticle.classList.add('incorrect');
                    selectedWord.classList.add('incorrect');
                    feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrectMatch || 'Incorrect Match. Try again.'}</span>`;
                    if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                     if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        CosyAppInteractive.scheduleReview(language, 'grammar-article', wordValue, false);
                    }

                    const tempArticle = selectedArticle;
                    const tempWord = selectedWord;
                    setTimeout(() => {
                        tempArticle.classList.remove('selected', 'incorrect');
                        tempArticle.disabled = false;
                        tempWord.classList.remove('selected', 'incorrect');
                        tempWord.disabled = false;
                        if (feedbackDiv.innerHTML.includes(t.incorrectMatch)) feedbackDiv.innerHTML = '';
                    }, 1500);
                }
                selectedArticle = null;
                selectedWord = null;
            }
        });
    });
    
    const exerciseContainer = resultArea.querySelector('.match-articles-words-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            items.forEach(item => {
                item.classList.remove('selected', 'incorrect', 'matched', 'correct');
                item.disabled = true;
            });
            feedbackDiv.innerHTML = `<span data-transliterable>${t.answersRevealed || "Answers revealed."}</span><br>`;
            grammarItems.forEach(pair => {
                feedbackDiv.innerHTML += `<b data-transliterable>${pair.article} ${pair.word}</b><br>`;
                const articleEl = items.find(el => el.dataset.type === 'article' && el.dataset.value === pair.article && !el.classList.contains('revealed-correct-pair'));
                const wordEl = items.find(el => el.dataset.type === 'word' && el.dataset.value === pair.word && !el.classList.contains('revealed-correct-pair'));
                
                if (articleEl) { articleEl.classList.add('revealed-correct-pair', 'correct'); }
                if (wordEl) { wordEl.classList.add('revealed-correct-pair', 'correct'); }
                
                if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                     CosyAppInteractive.scheduleReview(language, 'grammar-article', pair.word, false);
                }
            });
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = function() { 
            if (matchedCount === grammarItems.length) {
                 feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
            } else {
                 feedbackDiv.innerHTML = `<span class="neutral">${t.notAllMatchedYet || 'Not all pairs have been matched yet.'} (${matchedCount}/${grammarItems.length} ${t.matched || 'matched'})</span>`;
            }
        };
        exerciseContainer.showHint = function() {
            const unmatchedArticles = items.filter(item => item.dataset.type === 'article' && !item.classList.contains('matched') && !item.disabled && !item.classList.contains('selected'));
            const unmatchedWords = items.filter(item => item.dataset.type === 'word' && !item.classList.contains('matched') && !item.disabled && !item.classList.contains('selected'));

            if (unmatchedArticles.length > 0 && unmatchedWords.length > 0) {
                // Find a correct, unmatched pair to hint
                let hinted = false;
                for (const wordItem of unmatchedWords) {
                    const wordVal = wordItem.dataset.value;
                    const correctArticleVal = correctPairs[wordVal];
                    const articleItem = unmatchedArticles.find(art => art.dataset.value === correctArticleVal);
                    if (articleItem) {
                        articleItem.classList.add('hint-highlight');
                        wordItem.classList.add('hint-highlight');
                        feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_theseItemsMatch || "Hint: These two items form a pair."}</span>`;
                        setTimeout(() => {
                            articleItem.classList.remove('hint-highlight');
                            wordItem.classList.remove('hint-highlight');
                            if (feedbackDiv.innerHTML.includes(t.hint_theseItemsMatch)) feedbackDiv.innerHTML = '';
                        }, 2500);
                        hinted = true;
                        break;
                    }
                }
                if (!hinted) {
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.noSpecificHint || "Try matching one of the remaining items."}</span>`;
                }
            } else {
                feedbackDiv.innerHTML = `<span data-transliterable>${t.noHintAvailable || "No more hints available or all matched."}</span>`;
            }
             if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}


async function showSelectArticleExercise() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const NUM_ARTICLE_OPTIONS = 4; 

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }
    
    let selectedItem = null; 
    let reviewItemObj = null; 

    if (!selectedItem) {
        const allGenderItems = await loadGenderGrammar(language, days);
        if (!allGenderItems || !allGenderItems.length) { 
            showNoDataMessage(t.noGenderData || 'No gender data available for this selection.'); 
            return; 
        }
        selectedItem = allGenderItems[Math.floor(Math.random() * allGenderItems.length)];
        reviewItemObj = null;
    }

    if (!selectedItem) { 
        showNoDataMessage(t.noGenderData || 'Failed to select a gender item.'); 
        return; 
    }

    const correctArticle = selectedItem.article;
    const wordToShow = selectedItem.word;
    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    let allArticlesForLang = [...new Set((await loadGenderGrammar(language, days)).map(item => item.article))];
    let articleOptions = [correctArticle];
    allArticlesForLang = allArticlesForLang.filter(art => art !== correctArticle); // Remove correct article from potential distractors
    shuffleArray(allArticlesForLang); 
    for (let i = 0; i < Math.min(NUM_ARTICLE_OPTIONS - 1, allArticlesForLang.length); i++) {
        articleOptions.push(allArticlesForLang[i]);
    }
    articleOptions = shuffleArray(articleOptions); // Shuffle the final list of options
    
    // Ensure the correct article is present if somehow removed or not enough options initially
    if (!articleOptions.includes(correctArticle)) {
        if (articleOptions.length >= NUM_ARTICLE_OPTIONS) {
            articleOptions[Math.floor(Math.random() * NUM_ARTICLE_OPTIONS)] = correctArticle; // Replace one
        } else {
            articleOptions.push(correctArticle);
        }
        articleOptions = shuffleArray(articleOptions);
    }
     
    if (articleOptions.length === 0 ) { // Should not happen if correctArticle is always added
         resultArea.innerHTML = `<p>${t.notEnoughOptionsError || 'Not enough article options to create this exercise.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    
    resultArea.innerHTML = `
        <div class="select-article-exercise ${isReview ? 'review-item-cue' : ''}" role="form" aria-label="${t.aria?.selectArticleExercise || 'Select the Article Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="exercise-prompt" aria-label="${wordToShow}"><strong data-transliterable>${wordToShow}</strong></div>
            <button id="pronounce-select-article-word" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <div class="article-options-container">
                ${articleOptions.map(article => `
                    <button class="article-option-btn btn-secondary" data-article="${article}" aria-label="${article}" data-transliterable>
                        ${article}
                    </button>
                `).join('')}
            </div>
            <div id="select-article-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    const exerciseContainer = resultArea.querySelector('.select-article-exercise');
    if (exerciseContainer) { 
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('select-article-feedback');
            feedbackEl.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The correct article is:'} <strong data-transliterable>${correctArticle}</strong></span>`;
            document.querySelectorAll('.article-option-btn').forEach(b => {
                b.disabled = true;
                if(b.dataset.article === correctArticle) b.classList.add('correct-revealed');
            });
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview && wordToShow) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-article', wordToShow, false);
            }
        };
        exerciseContainer.showHint = function() {
            const feedbackEl = document.getElementById('select-article-feedback');
            const incorrectButtons = Array.from(document.querySelectorAll('.article-option-btn:not([disabled])'))
                                       .filter(btn => btn.dataset.article.toLowerCase() !== correctArticle.toLowerCase());
            if (incorrectButtons.length > 1) { 
                const btnToRemove = incorrectButtons[0]; 
                btnToRemove.classList.add('hint-removed'); 
                btnToRemove.disabled = true; 
                btnToRemove.style.opacity = "0.5"; 
                 feedbackEl.innerHTML = `<span class="hint-text">${t.hint_oneOptionRemoved || 'Hint: One incorrect option removed.'}</span>`;
            } else {
                 feedbackEl.innerHTML = `<span class="hint-text">${t.noMoreHints || 'No more hints available.'}</span>`;
            }
        };
    }

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
                 if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${correctArticle}</strong></span>`;
                isCorrect = false;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && wordToShow) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-article', wordToShow, isCorrect);
            }
            document.querySelectorAll('.article-option-btn').forEach(b => b.disabled = true); 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
             if(isCorrect){ 
                 setTimeout(() => { startGenderPractice(); }, 1200);
            }
        };
    });
}

async function startVerbsPractice() { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    if (!language || !days.length) { 
         alert((window.translations?.[language]?.alertLangDay || window.translations?.COSYenglish?.alertLangDay) || 'Please select language and day(s) first');
        return;
    }
    const verbExercises = GRAMMAR_PRACTICE_TYPES['verbs'].exercises;
    const randomExerciseName = verbExercises[Math.floor(Math.random() * verbExercises.length)];
    if (typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Exercise function ${randomExerciseName} not found.`);
        document.getElementById('result').innerHTML = `<p>Error: Could not load exercise.</p>`;
    }
}

async function showTypeVerb() {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) { alert(t.alertLangDay || 'Please select language and day(s) first'); return; }

    let itemForExercise = null; 
    let reviewItemObj = null;   

    if (!itemForExercise) {
        const allVerbItems = await loadVerbGrammar(language, days);
        if (!allVerbItems || !allVerbItems.length) { 
            showNoDataMessage(t.noVerbData || 'No verb data available for this selection.'); 
            return; 
        }
        itemForExercise = allVerbItems[Math.floor(Math.random() * allVerbItems.length)];
        reviewItemObj = null;
    }
    
    if (!itemForExercise) { 
        showNoDataMessage(t.noVerbData || 'Failed to select a verb item.'); 
        return; 
    }
    
    const correctAnswer = itemForExercise.form; 

    const currentProficiencyBucket = reviewItemObj ? reviewItemObj.proficiencyBucket : 0;
    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;
    
    const variation = { promptText: `${itemForExercise.pronoun} ( <span data-transliterable>${itemForExercise.verb}</span> )`, answer: itemForExercise.form };

    resultArea.innerHTML = `
        <div class="verb-exercise ${isReview ? 'review-item-cue' : ''}" aria-label="${t.verbExerciseAriaLabel || 'Verb Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <div class="verb-prompt" data-transliterable>${variation.promptText}</div>
            <button id="pronounce-verb-item" class="btn-emoji" title="${t.aria?.pronounce || 'Pronounce'}">🔊</button>
            <input type="text" id="verb-answer-input" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer...'}" class="exercise-input">
            <div id="verb-answer-feedback" class="exercise-feedback"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    const exerciseContainer = resultArea.querySelector('.verb-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            const feedbackEl = document.getElementById('verb-answer-feedback');
            const answerInput = document.getElementById('verb-answer-input');
            answerInput.value = correctAnswer;
            answerInput.disabled = true;
            feedbackEl.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${correctAnswer}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview && itemForExercise.verb) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-verb', itemForExercise.verb, false); // Review the infinitive concept
            }
        };
        exerciseContainer.showHint = function() {
            const feedbackEl = document.getElementById('verb-answer-feedback');
            if (correctAnswer && correctAnswer.length > 0) {
                feedbackEl.innerHTML = `<span class="hint-text">${t.hint_firstLetterIs || 'Hint: The first letter is'} "<span data-transliterable>${correctAnswer[0]}</span>"</span>`;
            } else {
                feedbackEl.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available for this item.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = function() {
            const userAnswer = document.getElementById('verb-answer-input').value.trim();
            const feedbackEl = document.getElementById('verb-answer-feedback');
            const currentLanguage = document.getElementById('language').value;
            let isCorrect = false;
            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedbackEl.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                isCorrect = true;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
            } else {
                feedbackEl.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${correctAnswer}</strong></span>`;
                isCorrect = false;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.scheduleReview && itemForExercise.verb) {
                 CosyAppInteractive.scheduleReview(currentLanguage, 'grammar-verb', itemForExercise.verb, isCorrect); // Review infinitive based on form attempt
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
             if(isCorrect){ 
                 setTimeout(() => { startVerbsPractice(); }, 1200);
            }
        };
    }
    const pronounceButton = document.getElementById('pronounce-verb-item');
    if (pronounceButton && typeof pronounceWord === 'function') {
        const textToPronounce = `${itemForExercise.pronoun} ${itemForExercise.form}`; 
        pronounceWord(textToPronounce, language); 
        pronounceButton.addEventListener('click', () => pronounceWord(textToPronounce, language));
    }
}

async function showMatchVerbsPronouns(baseVerb = null) { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const NUM_PAIRS_TO_SHOW = 6; 

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions missing.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred. Utility functions missing.'}</p>`;
        return;
    }

    const allVerbData = await loadVerbGrammar(language, days);
    if (!allVerbData || allVerbData.length === 0) {
        showNoDataMessage(t.noVerbData || 'No verb data available for this selection.');
        return;
    }

    const targetVerbInfinitive = baseVerb || allVerbData[Math.floor(Math.random() * allVerbData.length)].verb;
    const itemsForThisVerb = allVerbData.filter(item => item.verb === targetVerbInfinitive);

    if (!itemsForThisVerb || itemsForThisVerb.length < 2) { 
        showNoDataMessage(t.notEnoughVerbForms || `Not enough forms for the verb "${targetVerbInfinitive}" to create this exercise.`);
        return;
    }
    
    const selectedItems = shuffleArray(itemsForThisVerb).slice(0, NUM_PAIRS_TO_SHOW);
    if (selectedItems.length < 2) { // Check after slicing
         showNoDataMessage(t.notEnoughVerbForms || `Not enough forms for the verb "${targetVerbInfinitive}" to create this exercise (after slice).`);
        return;
    }

    const pronounsColumn = shuffleArray(selectedItems.map(item => item.pronoun));
    const formsColumn = shuffleArray(selectedItems.map(item => item.form));
    
    const correctVerbPairs = {}; 
    selectedItems.forEach(item => {
        correctVerbPairs[item.pronoun] = item.form;
    });

    resultArea.innerHTML = `
        <div class="match-exercise match-verbs-pronouns-exercise" role="form" aria-label="${t.aria?.matchVerbsPronouns || 'Match Verbs and Pronouns'}">
            <p class="exercise-prompt" data-transliterable><strong data-transliterable>${targetVerbInfinitive}</strong></p>
            <div class="match-container">
                <div class="match-col pronouns-column" id="match-pronouns-col">
                    ${pronounsColumn.map((pronoun, index) => `<button class="match-item btn-match-item" data-id="pronoun-${index}" data-value="${pronoun}" data-type="pronoun" data-transliterable>${pronoun}</button>`).join('')}
                </div>
                <div class="match-col verb-forms-column" id="match-forms-col">
                    ${formsColumn.map((form, index) => `<button class="match-item btn-match-item" data-id="form-${index}" data-value="${form}" data-type="form" data-transliterable>${form}</button>`).join('')}
                </div>
            </div>
            <div id="match-verbs-feedback" class="exercise-feedback" aria-live="polite" style="min-height: 25px; margin-top:10px;"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    let selectedPronoun = null;
    let selectedForm = null;
    const items = Array.from(resultArea.querySelectorAll('.match-item'));
    const feedbackDiv = document.getElementById('match-verbs-feedback');
    let matchedCount = 0;

    items.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched') || this.disabled) return;

            this.classList.add('selected');
            this.disabled = true;

            if (this.dataset.type === 'pronoun') {
                if (selectedPronoun) { 
                    selectedPronoun.classList.remove('selected');
                    selectedPronoun.disabled = false;
                }
                selectedPronoun = this;
            } else if (this.dataset.type === 'form') {
                if (selectedForm) { 
                    selectedForm.classList.remove('selected');
                    selectedForm.disabled = false;
                }
                selectedForm = this;
            }

            if (selectedPronoun && selectedForm) {
                const pronounValue = selectedPronoun.dataset.value;
                const formValue = selectedForm.dataset.value;

                if (correctVerbPairs[pronounValue] === formValue) {
                    selectedPronoun.classList.add('matched', 'correct');
                    selectedForm.classList.add('matched', 'correct');
                    feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correctMatch || 'Correct Match!'}</span>`;
                    matchedCount++;
                    if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                    if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        CosyAppInteractive.scheduleReview(language, 'grammar-verb-conjugation', `${targetVerbInfinitive}-${pronounValue}-${formValue}`, true);
                    }

                    if (matchedCount === selectedItems.length) {
                        feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
                        setTimeout(() => {
                            if (window.startVerbsPractice) window.startVerbsPractice();
                        }, 2000);
                    }
                } else {
                    selectedPronoun.classList.add('incorrect');
                    selectedForm.classList.add('incorrect');
                    feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.incorrectMatch || 'Incorrect Match. Try again.'}</span>`;
                    if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
                     if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                        CosyAppInteractive.scheduleReview(language, 'grammar-verb-conjugation', `${targetVerbInfinitive}-${pronounValue}-${formValue}`, false);
                    }

                    const tempPronoun = selectedPronoun;
                    const tempForm = selectedForm;
                    setTimeout(() => {
                        tempPronoun.classList.remove('selected', 'incorrect');
                        tempPronoun.disabled = false;
                        tempForm.classList.remove('selected', 'incorrect');
                        tempForm.disabled = false;
                        if (feedbackDiv.innerHTML.includes(t.incorrectMatch)) feedbackDiv.innerHTML = '';
                    }, 1500);
                }
                selectedPronoun = null;
                selectedForm = null;
            }
        });
    });
    
    const exerciseContainer = resultArea.querySelector('.match-verbs-pronouns-exercise');
    if (exerciseContainer) {
        exerciseContainer.revealAnswer = function() {
            items.forEach(item => {
                item.classList.remove('selected', 'incorrect', 'matched', 'correct');
                item.disabled = true;
            });
            feedbackDiv.innerHTML = `<span data-transliterable>${t.answersRevealed || "Answers revealed."}</span><br>`;
            selectedItems.forEach(pair => {
                feedbackDiv.innerHTML += `<b data-transliterable>${pair.pronoun} ${pair.form}</b> (${t.verbInfinitive || 'Infinitive'}: ${pair.verb})<br>`;
                const pronounEl = items.find(el => el.dataset.type === 'pronoun' && el.dataset.value === pair.pronoun && !el.classList.contains('revealed-correct-pair'));
                const formEl = items.find(el => el.dataset.type === 'form' && el.dataset.value === pair.form && !el.classList.contains('revealed-correct-pair'));
                
                if (pronounEl) { pronounEl.classList.add('revealed-correct-pair', 'correct'); }
                if (formEl) { formEl.classList.add('revealed-correct-pair', 'correct'); }
                
                if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                     CosyAppInteractive.scheduleReview(language, 'grammar-verb-conjugation', `${pair.verb}-${pair.pronoun}-${pair.form}`, false);
                }
            });
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = function() { 
            if (matchedCount === selectedItems.length) {
                 feedbackDiv.innerHTML = `<span class="correct">🎉 ${t.allPairsMatched || 'All pairs matched! Well done!'}</span>`;
            } else {
                 feedbackDiv.innerHTML = `<span class="neutral">${t.notAllMatchedYet || 'Not all pairs have been matched yet.'} (${matchedCount}/${selectedItems.length} ${t.matched || 'matched'})</span>`;
            }
        };
        exerciseContainer.showHint = function() {
            const unmatchedPronouns = items.filter(item => item.dataset.type === 'pronoun' && !item.classList.contains('matched') && !item.disabled && !item.classList.contains('selected'));
            const unmatchedForms = items.filter(item => item.dataset.type === 'form' && !item.classList.contains('matched') && !item.disabled && !item.classList.contains('selected'));

            if (unmatchedPronouns.length > 0 && unmatchedForms.length > 0) {
                let hinted = false;
                for (const pronounItem of unmatchedPronouns) {
                    const pronounVal = pronounItem.dataset.value;
                    const correctFormVal = correctVerbPairs[pronounVal]; // Relies on correctVerbPairs being populated for the current verb
                    const formItem = unmatchedForms.find(form => form.dataset.value === correctFormVal);
                    if (formItem) {
                        pronounItem.classList.add('hint-highlight');
                        formItem.classList.add('hint-highlight');
                        feedbackDiv.innerHTML = `<span data-transliterable>${t.hint_theseItemsMatch || "Hint: These two items form a pair."}</span>`;
                        setTimeout(() => {
                            pronounItem.classList.remove('hint-highlight');
                            formItem.classList.remove('hint-highlight');
                            if (feedbackDiv.innerHTML.includes(t.hint_theseItemsMatch)) feedbackDiv.innerHTML = '';
                        }, 2500);
                        hinted = true;
                        break; 
                    }
                }
                 if (!hinted) {
                    feedbackDiv.innerHTML = `<span data-transliterable>${t.noSpecificHint || "Try matching one of the remaining items."}</span>`;
                }
            } else {
                feedbackDiv.innerHTML = `<span data-transliterable>${t.noHintAvailable || "No more hints available or all matched."}</span>`;
            }
             if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}

async function showFillGaps(baseItem = null) { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
     if (typeof showNoDataMessage !== 'function' || typeof shuffleArray !== 'function') {
        console.error("Required utility functions (showNoDataMessage, shuffleArray) missing.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred.'}</p>`;
        return;
    }

    let itemForExercise = baseItem;
    let reviewItemObj = null; 
    let currentProficiencyBucket = 0;

    if (!itemForExercise) {
        const allVerbItems = await loadVerbGrammar(language, days); 
        const suitableItems = allVerbItems.filter(item => item.pronoun && item.verb && item.form && (item.full_sentence || item.sentence_template)); // Prefer items with sentence data

        if (!suitableItems || suitableItems.length === 0) {
            // Fallback: try to use items even without sentence_template, we'll generate one
            const lessSuitableItems = allVerbItems.filter(item => item.pronoun && item.verb && item.form);
            if (!lessSuitableItems || lessSuitableItems.length === 0) {
                showNoDataMessage(t.noVerbDataForFillGaps || 'Not enough verb data for this exercise.');
                return;
            }
            itemForExercise = lessSuitableItems[Math.floor(Math.random() * lessSuitableItems.length)];
        } else {
            itemForExercise = suitableItems[Math.floor(Math.random() * suitableItems.length)];
        }
        
        if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
             currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'grammar-verb-fill', `${itemForExercise.verb}-${itemForExercise.pronoun}`);
        }
    } else { // If baseItem is provided
        if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
             currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'grammar-verb-fill', `${itemForExercise.verb}-${itemForExercise.pronoun}`);
        }
    }
     
    if (!itemForExercise || !itemForExercise.form) { 
        showNoDataMessage(t.noVerbDataForFillGaps || 'Failed to select an item for the fill gaps exercise.');
        return;
    }

    const correctAnswer = itemForExercise.form;
    let sentenceTemplate = itemForExercise.sentence_template;
    let fullSentenceCorrect = itemForExercise.full_sentence;


    if (!sentenceTemplate && fullSentenceCorrect) {
        sentenceTemplate = fullSentenceCorrect.replace(new RegExp(`\\b${correctAnswer}\\b`, 'i'), "___");
        // If replacement didn't work (e.g. case issues or form is part of a larger word), try a simpler replacement
        if (!sentenceTemplate.includes("___")) {
            sentenceTemplate = fullSentenceCorrect.replace(correctAnswer, "___");
        }
    } else if (!sentenceTemplate && !fullSentenceCorrect) {
        // Fallback sentence generation if no template or full sentence provided in data
        let objectOrAdjective = "something"; 
        if (itemForExercise.verb?.toLowerCase() === "to be") objectOrAdjective = "happy";
        else if (itemForExercise.verb?.toLowerCase() === "to have") objectOrAdjective = "a book";
        
        sentenceTemplate = `${itemForExercise.pronoun} ___ ${objectOrAdjective}. (${itemForExercise.verb || 'verb'})`;
        fullSentenceCorrect = `${itemForExercise.pronoun} ${correctAnswer} ${objectOrAdjective}.`;
    } else if (sentenceTemplate && !fullSentenceCorrect) {
        fullSentenceCorrect = sentenceTemplate.replace("___", correctAnswer);
    }

    // Ensure ___ is present. If not (e.g. original sentence didn't contain the exact form), create a simpler template.
    if (!sentenceTemplate.includes("___")) {
        sentenceTemplate = `${itemForExercise.pronoun} ___ (${itemForExercise.verb}).`;
        fullSentenceCorrect = `${itemForExercise.pronoun} ${correctAnswer} (${itemForExercise.verb}).`;
    }
    
    const sentenceWithBlank = sentenceTemplate.replace("___", `<input type="text" id="fill-gap-input" class="exercise-input" placeholder="${t.typeVerbFormPlaceholder || 'Type verb form...'}" data-transliterable-input>`);
    const isReview = !!reviewItemObj; 
    const MAX_BUCKET_DISPLAY = 5;


    resultArea.innerHTML = `
        <div class="fill-gap-exercise" role="form" aria-label="${t.fillGapTitle || 'Fill in the Gap Exercise'}">
             <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <p class="exercise-prompt" data-transliterable></p>
            <div class="sentence-fill-gap" data-transliterable>${sentenceWithBlank}</div>
            <div id="fill-gap-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    
    const inputField = document.getElementById('fill-gap-input');
    const feedbackDiv = document.getElementById('fill-gap-feedback');

    const exerciseContainer = resultArea.querySelector('.fill-gap-exercise');
    if (exerciseContainer) {
        exerciseContainer.checkAnswer = function() {
            const userAnswer = inputField.value.trim();
            if (!userAnswer) {
                feedbackDiv.innerHTML = `<span class="incorrect">${t.feedbackPleaseType || 'Please type your answer.'}</span>`;
                return;
            }
            let isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
            if (isCorrect) {
                feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                inputField.disabled = true;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                 setTimeout(() => { if (window.startVerbsPractice) window.startVerbsPractice(); }, 1500);
            } else {
                feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectIs || 'Not quite. The correct answer is:'} <strong data-transliterable>${correctAnswer}</strong>.</span>`;
                 if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                CosyAppInteractive.scheduleReview(language, 'grammar-verb-fill', `${itemForExercise.verb}-${itemForExercise.pronoun}`, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };

        exerciseContainer.revealAnswer = function() {
            inputField.value = correctAnswer;
            inputField.disabled = true;
            const revealedSentenceHtml = sentenceTemplate.replace("___", `<strong data-transliterable class="revealed-answer-inline">${correctAnswer}</strong>`);
            feedbackDiv.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The answer is:'} <strong data-transliterable>${correctAnswer}</strong>.</span>
                                     <br><span data-transliterable>${revealedSentenceHtml}</span>`;
            
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-verb-fill', `${itemForExercise.verb}-${itemForExercise.pronoun}`, false);
            }
        };
        exerciseContainer.showHint = function() {
            if (correctAnswer && correctAnswer.length > 0) {
                feedbackDiv.innerHTML = `<span class="hint-text">${t.hint_firstLetterIs || 'Hint: The first letter is'} "<span data-transliterable>${correctAnswer[0]}</span>"</span>`;
            } else {
                feedbackDiv.innerHTML = `<span class="hint-text">${t.noHintAvailable || 'No hint available.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
         if (inputField) {
            inputField.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (exerciseContainer.checkAnswer) exerciseContainer.checkAnswer();
                }
            });
        }
    }
 }

async function showWordOrder(baseItem = null) { 
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language || !days.length) {
        alert(t.alertLangDay || 'Please select language and day(s) first');
        return;
    }
    if (typeof shuffleArray !== 'function' || typeof showNoDataMessage !== 'function') {
        console.error("Required utility functions missing.");
        resultArea.innerHTML = `<p>${t.error_generic || 'A critical error occurred.'}</p>`;
        return;
    }

    let itemForExercise = baseItem;
    let reviewItemObj = null; 
    let currentProficiencyBucket = 0;
    let correctSentence = "";
    let sentenceWords = [];

    if (!itemForExercise) {
        const allVerbItems = await loadVerbGrammar(language, days);
        const suitableItems = allVerbItems.filter(item => item.full_sentence && item.pronoun && item.verb && item.form);

        if (!suitableItems || suitableItems.length === 0) {
            const lessSuitableItems = allVerbItems.filter(item => item.pronoun && item.verb && item.form);
            if (!lessSuitableItems || lessSuitableItems.length === 0) {
                showNoDataMessage(t.noVerbDataForWordOrder || 'Not enough verb data for word order exercise.');
                return;
            }
            itemForExercise = lessSuitableItems[Math.floor(Math.random() * lessSuitableItems.length)];
            // Fallback: construct a very simple sentence if 'full_sentence' is missing
            let objectPart = "well";
            if (itemForExercise.verb.toLowerCase() === "to be") objectPart = "happy";
            else if (itemForExercise.verb.toLowerCase() === "to have") objectPart = "a book";
            correctSentence = `${itemForExercise.pronoun} ${itemForExercise.form} ${objectPart}.`;
        } else {
            itemForExercise = suitableItems[Math.floor(Math.random() * suitableItems.length)];
            correctSentence = itemForExercise.full_sentence;
        }
        
        if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
             currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'grammar-word-order', itemForExercise.full_sentence || `${itemForExercise.verb}-${itemForExercise.pronoun}`);
        }
    } else { // baseItem provided
        correctSentence = itemForExercise.full_sentence;
         if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.getItemProficiency) {
             currentProficiencyBucket = CosyAppInteractive.getItemProficiency(language, 'grammar-word-order', itemForExercise.full_sentence || `${itemForExercise.verb}-${itemForExercise.pronoun}`);
        }
    }

    if (!correctSentence) {
        showNoDataMessage(t.noVerbDataForWordOrder || 'Failed to prepare sentence for word order exercise.');
        return;
    }

    sentenceWords = correctSentence.replace(/\.$/, '').split(' '); // Remove trailing period for cleaner tiles
    const shuffledWordTiles = shuffleArray([...sentenceWords]);
    let constructedSentence = [];

    const isReview = !!reviewItemObj;
    const MAX_BUCKET_DISPLAY = 5;

    resultArea.innerHTML = `
        <div class="word-order-exercise" role="form" aria-label="${t.wordOrderTitle || 'Word Order Exercise'}">
            <div class="item-strength" aria-label="Item strength: ${currentProficiencyBucket} out of ${MAX_BUCKET_DISPLAY}">Strength: ${'●'.repeat(currentProficiencyBucket)}${'○'.repeat(MAX_BUCKET_DISPLAY - currentProficiencyBucket)}</div>
            <p class="exercise-prompt" data-transliterable></p>
            <div id="word-slots-wo" class="word-slots target-area" aria-label="Your constructed sentence"></div>
            <div id="word-pool-wo" class="letter-pool source-area" aria-label="Available words">
                ${shuffledWordTiles.map((word, index) => `<button class="letter-tile word-tile" data-word="${word}" data-index="${index}" data-transliterable>${word}</button>`).join('')}
            </div>
            <div class="word-order-actions">
                <button id="undo-word-wo" class="exercise-button">↩️ ${t.buttons?.undo || 'Undo'}</button>
                <button id="reset-words-wo" class="exercise-button">🔄 ${t.buttons?.reset || 'Reset'}</button>
            </div>
            <div id="word-order-feedback" class="exercise-feedback" aria-live="polite"></div>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

    const wordPoolDiv = document.getElementById('word-pool-wo');
    const wordSlotsDiv = document.getElementById('word-slots-wo');
    const feedbackDiv = document.getElementById('word-order-feedback');
    const undoButton = document.getElementById('undo-word-wo');
    const resetButton = document.getElementById('reset-words-wo');

    function updateSlotsUI() {
        wordSlotsDiv.innerHTML = constructedSentence.map(word => `<span class="letter-tile word-tile selected-word-tile" data-transliterable>${word}</span>`).join('');
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    }

    function resetWordPool() {
        wordPoolDiv.innerHTML = shuffledWordTiles.map((word, index) => `<button class="letter-tile word-tile" data-word="${word}" data-index="${index}" data-transliterable>${word}</button>`).join('');
        addTileListeners();
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    }
    
    function addTileListeners() {
        resultArea.querySelectorAll('#word-pool-wo .word-tile').forEach(tile => {
            tile.onclick = function() {
                constructedSentence.push(this.dataset.word);
                this.disabled = true;
                this.classList.add('used-tile');
                updateSlotsUI();
            };
        });
    }
    addTileListeners();

    undoButton.onclick = () => {
        if (constructedSentence.length > 0) {
            const lastWord = constructedSentence.pop();
            updateSlotsUI();
            // Re-enable the corresponding button in the pool
            const poolButtons = Array.from(wordPoolDiv.querySelectorAll('.word-tile.used-tile'));
            // Find the first disabled button that matches the lastWord to re-enable (in case of duplicate words)
            const buttonToReEnable = poolButtons.find(btn => btn.dataset.word === lastWord && btn.disabled);
            if (buttonToReEnable) {
                buttonToReEnable.disabled = false;
                buttonToReEnable.classList.remove('used-tile');
            }
        }
    };

    resetButton.onclick = () => {
        constructedSentence = [];
        updateSlotsUI();
        resetWordPool();
        feedbackDiv.innerHTML = '';
    };
    
    const exerciseContainer = resultArea.querySelector('.word-order-exercise');
    if (exerciseContainer) {
        exerciseContainer.checkAnswer = function() {
            const userAnswerSentence = constructedSentence.join(' ').trim();
            // Normalize by removing trailing punctuation for comparison if present in correctSentence
            const normalizedCorrectSentence = correctSentence.replace(/\.$/, '').trim();
            let isCorrect = userAnswerSentence.toLowerCase() === normalizedCorrectSentence.toLowerCase();

            if (isCorrect) {
                feedbackDiv.innerHTML = `<span class="correct">✅ ${t.correctWellDone || 'Correct! Well done!'}</span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
                setTimeout(() => { if (window.startVerbsPractice) window.startVerbsPractice(); }, 1500);
            } else {
                feedbackDiv.innerHTML = `<span class="incorrect">❌ ${t.notQuiteCorrectOrder || 'Not quite. The correct order is:'} <strong data-transliterable>${normalizedCorrectSentence}</strong></span>`;
                if (CosyAppInteractive && CosyAppInteractive.awardIncorrectAnswer) CosyAppInteractive.awardIncorrectAnswer();
            }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-word-order', correctSentence, isCorrect);
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.revealAnswer = function() {
            constructedSentence = [...sentenceWords]; // Use the original, correctly ordered words
            updateSlotsUI();
            wordPoolDiv.innerHTML = ''; // Clear the pool
            feedbackDiv.innerHTML = `<span class="revealed-answer">${t.answerIs || 'The correct order is:'} <strong data-transliterable>${correctSentence}</strong></span>`;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (CosyAppInteractive && CosyAppInteractive.scheduleReview) {
                 CosyAppInteractive.scheduleReview(language, 'grammar-word-order', correctSentence, false);
            }
        };
        exerciseContainer.showHint = function() {
            if (constructedSentence.length < sentenceWords.length) {
                const nextCorrectWord = sentenceWords[constructedSentence.length];
                let hintMsg = `${t.hint_nextWordIs || 'Hint: The next word is'} "<span data-transliterable>${nextCorrectWord}</span>"`;
                
                // If the current sequence is wrong, hint the first word
                let currentIsCorrectSoFar = true;
                for(let i=0; i < constructedSentence.length; i++){
                    if(constructedSentence[i].toLowerCase() !== sentenceWords[i].toLowerCase()){
                        currentIsCorrectSoFar = false;
                        break;
                    }
                }
                if(!currentIsCorrectSoFar && sentenceWords.length > 0){
                     hintMsg = `${t.hint_firstWordIs || 'Hint: The first word is'} "<span data-transliterable>${sentenceWords[0]}</span>"`;
                }

                feedbackDiv.innerHTML = `<span class="hint-text">${hintMsg}</span>`;
            } else {
                feedbackDiv.innerHTML = `<span class="hint-text">${t.noMoreHints || 'No more hints available or sentence complete.'}</span>`;
            }
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
}


async function practiceAllGrammar() { 
    const practiceTypes = ['gender', 'verbs']; 
    const randomType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
    if (randomType === 'gender') {
        await startGenderPractice();
    } else if (randomType === 'verbs') {
        await startVerbsPractice();
    }
}

window.initGrammarPractice = initGrammarPractice;
window.startGenderPractice = startGenderPractice;
window.startVerbsPractice = startVerbsPractice;
window.startPossessivesPractice = startPossessivesPractice; 
window.practiceAllGrammar = practiceAllGrammar;

window.showArticleWord = showArticleWord;
window.showMatchArticlesWords = showMatchArticlesWords;
window.showSelectArticleExercise = showSelectArticleExercise;
window.showTypeVerb = showTypeVerb;
window.showMatchVerbsPronouns = showMatchVerbsPronouns;
window.showFillGaps = showFillGaps;
window.showWordOrder = showWordOrder;

window.showArticleWord = patchExerciseWithExtraButtons(showArticleWord, '.gender-exercise', window.startGenderPractice, {
    specificNextExerciseFn: window.showArticleWord,
    specificNextExerciseLabelKey: 'buttons.newArticleWord',
    specificNextExerciseAlternateLabel: 'New Article/Word'
});
window.showMatchArticlesWords = patchExerciseWithExtraButtons(showMatchArticlesWords, '.match-articles-words-exercise', window.startGenderPractice, { 
    noCheck: true, 
    specificNextExerciseFn: window.showMatchArticlesWords,
    specificNextExerciseLabelKey: 'buttons.newMatchArticles',
    specificNextExerciseAlternateLabel: 'New Article Match'
});
window.showSelectArticleExercise = patchExerciseWithExtraButtons(showSelectArticleExercise, '.select-article-exercise', window.startGenderPractice, { 
    noCheck: true, 
    specificNextExerciseFn: window.showSelectArticleExercise,
    specificNextExerciseLabelKey: 'buttons.newSelectArticle',
    specificNextExerciseAlternateLabel: 'New Select Article'
});
window.showTypeVerb = patchExerciseWithExtraButtons(showTypeVerb, '.verb-exercise', window.startVerbsPractice, {
    specificNextExerciseFn: window.showTypeVerb,
    specificNextExerciseLabelKey: 'buttons.newTypeVerb',
    specificNextExerciseAlternateLabel: 'New Type Verb'
});
window.showMatchVerbsPronouns = patchExerciseWithExtraButtons(showMatchVerbsPronouns, '.match-verbs-pronouns-exercise', window.startVerbsPractice, { 
    noCheck: true, 
    specificNextExerciseFn: window.showMatchVerbsPronouns,
    specificNextExerciseLabelKey: 'buttons.newMatchVerbs',
    specificNextExerciseAlternateLabel: 'New Verb Match'
});
window.showFillGaps = patchExerciseWithExtraButtons(showFillGaps, '.fill-gap-exercise', window.startVerbsPractice, {
    specificNextExerciseFn: window.showFillGaps,
    specificNextExerciseLabelKey: 'buttons.newFillGaps',
    specificNextExerciseAlternateLabel: 'New Fill Gaps'
});
window.showWordOrder = patchExerciseWithExtraButtons(showWordOrder, '.word-order-exercise', window.startVerbsPractice, {
    specificNextExerciseFn: window.showWordOrder,
    specificNextExerciseLabelKey: 'buttons.newWordOrder',
    specificNextExerciseAlternateLabel: 'New Word Order'
});

document.addEventListener('DOMContentLoaded', initGrammarPractice);
