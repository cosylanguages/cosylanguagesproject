// Writing Exercises
let writingPracticeTimer = null; // Timer for auto-progression

const storyEmojiPool = [
    '😀', '😂', '😊', '😍', '🤔', '😲', '😱', '🔥', '🎉', '🎈', 
    '⭐', '❤️', '💔', '👍', '👎', '🙌', '🙏', '💀', '👻', '👽', 
    '🤖', '👑', '💎', '💰', '📚', '✏️', '🌍', '🌙', '☀️', '🌳', 
    '🍎', '🍌', '🍕', '🚗', '✈️', '🏠', '⏰', '🔑', '🎁', '✉️'
];

// Data loading functions
async function loadWritingPrompts(language, day) {
    // Simplified: Assuming prompts are in English or don't vary by language for now for this file structure
    const langFileKey = 'en'; 
    const filePath = `data/writing/story_prompts_${langFileKey}.json`;
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error(`Error loading writing prompts: ${response.status}`);
            return { what_happens_next: [], what_happened_before: [] };
        }
        const data = await response.json();
        if (data && data[day]) { // Assuming day is a single day string like "1"
            return {
                what_happens_next: data[day].what_happens_next || [],
                what_happened_before: data[day].what_happened_before || []
            };
        }
         // If specific day not found, or data structure is different, return empty arrays
        if (data && Array.isArray(data.what_happens_next) && Array.isArray(data.what_happened_before)) {
            // Fallback for a flat structure if day-specific is not found
            return data;
        }
        return { what_happens_next: [], what_happened_before: [] };
    } catch (error) {
        console.error('Error fetching or parsing writing prompts:', error);
        return { what_happens_next: [], what_happened_before: [] };
    }
}

async function showQuestionWriting() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language) {
        resultArea.innerHTML = `<p>${t.selectLanguage || 'Please select a language first.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return;
    }
    const days = getSelectedDays(); 
    if (!days || days.length === 0) {
        resultArea.innerHTML = `<p>${t.selectDay || 'Please select a day or a range of days first.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return;
    }
    const day = days[0]; 
    const questions = await loadSpeakingQuestions(language, day); // Re-use speaking questions for writing prompts

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${t.noQuestionsAvailable || 'No writing prompts available for this selection.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return;
    }
    questions.sort(() => 0.5 - Math.random());
    let currentQuestionIndex = 0;
    const newExerciseButtonText = t.buttons?.newWritingQuestion || t.buttons?.newExerciseSameType || 'New Question';
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container question-writing-exercise exercise-container">
            <h3>${t.writingQuestionTitle || "Answer the Question"}</h3>
            <div id="writing-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #007bff; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 15px;">
                <button id="prev-writing-question-btn" class="btn-secondary btn-small">&lt; ${t.buttons?.previous || 'Previous'}</button>
                <button id="next-writing-question-btn" class="btn-secondary btn-small">${t.buttons?.next || 'Next'} &gt;</button>
            </div>
            <textarea id="writing-answer-area" rows="8" spellcheck="true" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="submit-writing-answer-btn-impl" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.submitAnswer || 'Submit Answer'}</button>
            <div id="writing-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <button id="btn-new-writing-question" class="btn-secondary" onclick="window.showQuestionWriting()" aria-label="${newExerciseButtonText}">🔄 ${newExerciseButtonText}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons after this function completes.

    const exerciseContainer = resultArea.querySelector('.question-writing-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            const questionForHint = questions[currentQuestionIndex] || "";
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWritingQuestion || "Address all parts of the question. Structure your answer with an introduction, body, and conclusion if applicable. The question is:"} '${questionForHint}'.`;
            this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => document.getElementById('submit-writing-answer-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() { 
            const feedbackArea = document.getElementById('writing-feedback');
            if(feedbackArea) feedbackArea.innerHTML = t.noDirectRevealWriting || "For writing, review your text against the prompt and try to improve it. Model answers are not provided for this exercise.";
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }

    function displayCurrentWritingQuestion() { 
        const questionTextElement = document.getElementById('writing-question-text');
        if (questionTextElement) questionTextElement.textContent = questions[currentQuestionIndex];
        const prevBtn = document.getElementById('prev-writing-question-btn');
        const nextBtn = document.getElementById('next-writing-question-btn');
        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) nextBtn.disabled = currentQuestionIndex === questions.length - 1;
        const answerArea = document.getElementById('writing-answer-area');
        if(answerArea) answerArea.value = '';
        const feedbackArea = document.getElementById('writing-feedback');
        if(feedbackArea) feedbackArea.innerHTML = '';
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    }
    document.getElementById('prev-writing-question-btn')?.addEventListener('click', () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; displayCurrentWritingQuestion(); } });
    document.getElementById('next-writing-question-btn')?.addEventListener('click', () => { if (currentQuestionIndex < questions.length - 1) { currentQuestionIndex++; displayCurrentWritingQuestion(); } });
    
    const submitButton = document.getElementById('submit-writing-answer-btn-impl');
    if(submitButton) submitButton.addEventListener('click', checkWritingAnswer);

    const writingAnswerArea = document.getElementById('writing-answer-area');
    if (writingAnswerArea && submitButton) { writingAnswerArea.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'Enter') { event.preventDefault(); submitButton.click(); } }); }
    
    if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer); 
    displayCurrentWritingQuestion(); 

    function checkWritingAnswer() { 
        const questionText = questions[currentQuestionIndex];
        const writtenAnswer = document.getElementById('writing-answer-area').value;
        const feedbackArea = document.getElementById('writing-feedback');
        let feedbackMsg = '';

        if (!writtenAnswer.trim()) {
            feedbackMsg = t.pleaseWriteAnswer || 'Please write an answer before submitting.';
            // ...
        } else {
            feedbackMsg = t.answerSubmittedWriting || 'Answer submitted. Remember to check for grammar and clarity.';
            // ...
        }
        if (feedbackArea) feedbackArea.innerHTML = `<span class="feedback-message" aria-label="Feedback">📝 ${feedbackMsg}</span>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    }
}


async function showOriginalStorytellingPlaceholder() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const newExerciseButtonText = t.buttons?.newOriginalStory || t.buttons?.newExerciseSameType || 'New Story Prompt';
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container original-storytelling-exercise exercise-container">
            <h3>${t.originalStorytellingTitle || "Original Storytelling"}</h3>
            <p>${t.exerciseNotImplementedStorytelling || 'This is a freeform storytelling exercise.'}</p>
            <p>${t.imagineStorytellingHere || 'Write any story you like. Be creative!'}</p>
            <textarea id="original-storytelling-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourStoryPlaceholder || 'Type your story here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-original-storytelling-btn-impl" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="original-storytelling-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <button id="btn-new-original-story" class="btn-secondary" onclick="window.showOriginalStorytellingPlaceholder()" aria-label="${newExerciseButtonText}">🔄 ${newExerciseButtonText}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.original-storytelling-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWritingGeneric || 'Think about a beginning, middle, and end. Use interesting vocabulary!'}`;
            const textarea = this.querySelector('#original-storytelling-answer-area');
            if (textarea) textarea.parentNode.insertBefore(hintDisplay, textarea);
            else this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => document.getElementById('finish-original-storytelling-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() { 
             document.getElementById('original-storytelling-feedback').innerHTML = t.noDirectRevealWriting;
             if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('finish-original-storytelling-btn-impl').addEventListener('click', () => {
        const feedbackArea = document.getElementById('original-storytelling-feedback');
        const storyText = document.getElementById('original-storytelling-answer-area').value;
        if (storyText.trim().length < 10) {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.storySubmitted || 'Great! Story submitted.'}</span>`;
             // ...
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    });
}

async function showStoryEmojisPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const newExerciseButtonText = t.buttons?.newEmojiStory || t.buttons?.newExerciseSameType || 'New Emoji Story';

    // ... (emoji selection logic) ...

    resultArea.innerHTML = `
        <div class="writing-exercise-container story-emojis-exercise exercise-container">
            <div class="story-emojis-display" style="font-size: 2.5em; margin-bottom: 20px; text-align: center;">${selectedEmojis.join(' ')}</div>
            <textarea id="story-emojis-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourStoryPlaceholder || 'Type your story here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-story-emojis-btn-impl" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="story-emojis-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <button id="btn-new-emoji-story" class="btn-secondary" onclick="window.showStoryEmojisPractice()" aria-label="${newExerciseButtonText}">🔄 ${newExerciseButtonText}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.story-emojis-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() {
            // ...
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => document.getElementById('finish-story-emojis-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() { 
            document.getElementById('story-emojis-feedback').innerHTML = t.noDirectRevealWriting;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('finish-story-emojis-btn-impl').addEventListener('click', () => {
        const feedbackArea = document.getElementById('story-emojis-feedback');
        // ...
        if (storyText.trim().length < 10) {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.storySubmitted || 'Great! Story submitted.'}</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    });
}


async function showWhatHappensNextPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const days = getSelectedDays();
    if (!language || !days || days.length === 0) { 
        resultArea.innerHTML = `<p>${t.selectLangDay || 'Please select language and day(s).'}</p>`; 
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    const day = days[0]; 
    const promptsData = await loadWritingPrompts(language, day);
    if (!promptsData.what_happens_next || promptsData.what_happens_next.length === 0) { 
        resultArea.innerHTML = `<p>${t.noWhatHappensNextPromptsAvailable || 'No "What Happens Next" prompts available for this selection.'}</p>`; 
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    const prompt = promptsData.what_happens_next[Math.floor(Math.random() * promptsData.what_happens_next.length)];
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container what-happens-next-exercise exercise-container">
            <h3>${t.whatHappensNextTitle || "What Happens Next?"}</h3>
            <p class="writing-prompt">${prompt}</p>
            <textarea id="what-happens-next-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourContinuationPlaceholder || 'Type your continuation here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-what-happens-next-btn-impl" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="what-happens-next-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <button id="btn-new-whn-practice" class="btn-secondary" onclick="window.showWhatHappensNextPractice()" aria-label="${t.buttons?.newWhatHappensNext || t.buttons?.newExerciseSameType || 'New Prompt'}">🔄 ${t.buttons?.newWhatHappensNext || t.buttons?.newExerciseSameType || 'New Prompt'}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.what-happens-next-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => document.getElementById('finish-what-happens-next-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() { 
            document.getElementById('what-happens-next-feedback').innerHTML = t.noDirectRevealWriting;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('finish-what-happens-next-btn-impl').addEventListener('click', () => {
        const feedbackArea = document.getElementById('what-happens-next-feedback');
        // ...
        if (answerText.trim().length < 10) {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.continuationSubmitted || 'Great! Continuation submitted.'}</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    });
}

async function showWhatHappenedBeforePractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const days = getSelectedDays();
    if (!language || !days || days.length === 0) { 
        resultArea.innerHTML = `<p>${t.selectLangDay || 'Please select language and day(s).'}</p>`; 
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    const day = days[0];
    const promptsData = await loadWritingPrompts(language, day);
    if (!promptsData.what_happened_before || promptsData.what_happened_before.length === 0) { 
        resultArea.innerHTML = `<p>${t.noWhatHappenedBeforePromptsAvailable || 'No "What Happened Before" prompts available for this selection.'}</p>`; 
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return; 
    }
    const prompt = promptsData.what_happened_before[Math.floor(Math.random() * promptsData.what_happened_before.length)];
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container what-happened-before-exercise exercise-container">
            <h3>${t.whatHappenedBeforeTitle || "What Happened Before?"}</h3>
            <p class="writing-prompt">${prompt}</p>
            <textarea id="what-happened-before-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourPrequelPlaceholder || 'Type what led to this...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-what-happened-before-btn-impl" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="what-happened-before-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <button id="btn-new-whb-practice" class="btn-secondary" onclick="window.showWhatHappenedBeforePractice()" aria-label="${t.buttons?.newWhatHappenedBefore || t.buttons?.newExerciseSameType || 'New Prompt'}">🔄 ${t.buttons?.newWhatHappenedBefore || t.buttons?.newExerciseSameType || 'New Prompt'}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.what-happened-before-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => document.getElementById('finish-what-happened-before-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() { 
             document.getElementById('what-happened-before-feedback').innerHTML = t.noDirectRevealWriting;
             if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('finish-what-happened-before-btn-impl').addEventListener('click', () => {
        const feedbackArea = document.getElementById('what-happened-before-feedback');
        // ...
         if (answerText.trim().length < 10) {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.prequelSubmitted || 'Great! Prequel submitted.'}</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    });
}

// Router for storytelling sub-types
async function showStorytellingPractice() {
    const storytellingTypes = [
        showOriginalStorytellingPlaceholder,
        showStoryEmojisPractice,
        showWhatHappensNextPractice,
        showWhatHappenedBeforePractice
    ];
    const selectedStorytellingFunction = storytellingTypes[Math.floor(Math.random() * storytellingTypes.length)];
    await selectedStorytellingFunction(); // These functions call refreshLatinization via patch or directly
}


async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container diary-writing-exercise exercise-container">
            <p>${t.exerciseNotImplementedDiary || 'This diary entry exercise is not yet implemented.'}</p>
            <p>${t.imagineDiaryHere || 'Imagine you write a diary entry here about your day or a specific event.'}</p>
            <textarea id="diary-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourDiaryPlaceholder || 'Type your diary entry here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-diary-btn-impl" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="diary-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <button id="btn-new-diary-practice" class="btn-secondary" onclick="window.showDiaryPractice()" aria-label="${t.buttons?.newDiaryEntry || t.buttons?.newExerciseSameType || 'New Diary Entry'}">🔄 ${t.buttons?.newDiaryEntry || t.buttons?.newExerciseSameType || 'New Diary Entry'}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.diary-writing-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { /* ... */ 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
        exerciseContainer.checkAnswer = () => document.getElementById('finish-diary-btn-impl')?.click();
        exerciseContainer.revealAnswer = function() { 
             document.getElementById('diary-feedback').innerHTML = t.noDirectRevealWriting;
             if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }
    document.getElementById('finish-diary-btn-impl').addEventListener('click', () => {
        const feedbackArea = document.getElementById('diary-feedback');
        // ...
        if (storyText.trim().length < 10) {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your diary.'}</span>`;
        } else {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.diaryEntrySubmitted || 'Diary entry submitted.'}</span>`;
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
    });
}

async function startRandomWritingPractice() {
    if (window.writingPracticeTimer) {
        clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = null;
    }

    const exercises = [
        showQuestionWriting,
        showStorytellingPractice, 
        showDiaryPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    
    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = '';
    await randomExerciseFunction(); // These functions call refreshLatinization via patch or directly
}

function initWritingPractice() {
    const writingButton = document.getElementById('writing-practice-btn'); 
    if (writingButton) {
        writingButton.addEventListener('click', () => {
            startRandomWritingPractice();
        });
    }
}

// Ensure functions are on window for patching and onclicks
window.showQuestionWriting = showQuestionWriting;
window.showStorytellingPractice = showStorytellingPractice; 
window.showOriginalStorytellingPlaceholder = showOriginalStorytellingPlaceholder; 
window.showDiaryPractice = showDiaryPractice;
window.showStoryEmojisPractice = showStoryEmojisPractice; 
window.showWhatHappensNextPractice = showWhatHappensNextPractice; 
window.showWhatHappenedBeforePractice = showWhatHappenedBeforePractice; 
window.startRandomWritingPractice = startRandomWritingPractice;
window.initWritingPractice = initWritingPractice;

// Patching exercise functions
const writingOptionsNoCheck = { noReveal: true, noCheck: true };
const writingOptionsWithCheck = { noReveal: true }; 

window.showQuestionWriting = patchExerciseWithExtraButtons(window.showQuestionWriting, '.question-writing-exercise', window.startRandomWritingPractice, writingOptionsWithCheck);
window.showOriginalStorytellingPlaceholder = patchExerciseWithExtraButtons(window.showOriginalStorytellingPlaceholder, '.original-storytelling-exercise', window.startRandomWritingPractice, writingOptionsNoCheck);
window.showDiaryPractice = patchExerciseWithExtraButtons(window.showDiaryPractice, '.diary-writing-exercise', window.startRandomWritingPractice, writingOptionsNoCheck);
window.showStoryEmojisPractice = patchExerciseWithExtraButtons(window.showStoryEmojisPractice, '.story-emojis-exercise', window.startRandomWritingPractice, writingOptionsNoCheck);
window.showWhatHappensNextPractice = patchExerciseWithExtraButtons(window.showWhatHappensNextPractice, '.what-happens-next-exercise', window.startRandomWritingPractice, writingOptionsNoCheck);
window.showWhatHappenedBeforePractice = patchExerciseWithExtraButtons(window.showWhatHappenedBeforePractice, '.what-happened-before-exercise', window.startRandomWritingPractice, writingOptionsNoCheck);

document.addEventListener('DOMContentLoaded', initWritingPractice);
