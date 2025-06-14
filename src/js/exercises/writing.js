// Writing Exercises

const WRITING_PRACTICE_TYPES = {
    'writing-main': { // Generic category for these top-level writing exercises
        exercises: ['showQuestionWriting', 'showStorytellingPractice', 'showDiaryPractice'],
        name: 'Writing Practice'
    }
};

async function showQuestionWriting() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language) {
        resultArea.innerHTML = `<p>${currentTranslations.selectLanguage || 'Please select a language first.'}</p>`;
        return;
    }
    const days = getSelectedDays();
    if (!days || days.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.selectDay || 'Please select a day or a range of days first.'}</p>`;
        return;
    }
    const day = days[0];
    const questions = await loadSpeakingQuestions(language, day); // Re-using speaking questions for writing

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }
    questions.sort(() => 0.5 - Math.random());
    let currentQuestionIndex = 0;

    function displayCurrentWritingQuestion() {
        const questionText = questions[currentQuestionIndex];
        const questionElem = document.getElementById('writing-question-text');
        const prevBtn = document.getElementById('prev-writing-question-btn');
        const nextBtn = document.getElementById('next-writing-question-btn');
        const answerArea = document.getElementById('writing-answer-area');
        const feedbackArea = document.getElementById('writing-feedback');

        if (questionElem) questionElem.textContent = questionText;
        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) nextBtn.disabled = currentQuestionIndex === questions.length - 1;
        if (answerArea) answerArea.value = '';
        if (feedbackArea) feedbackArea.textContent = '';
    }

    function checkWritingAnswer() {
        const questionText = questions[currentQuestionIndex];
        const writtenAnswer = document.getElementById('writing-answer-area').value;
        const feedbackArea = document.getElementById('writing-feedback');
        let feedbackMsg = '';
        if (!writtenAnswer.trim()) {
            feedbackMsg = currentTranslations.pleaseWriteAnswer || 'Please write an answer before submitting.';
        } else {
            const questionWords = (questionText.toLowerCase().match(/\b(\w+)\b/g) || []).filter(w => w.length > 2);
            const answerWords = (writtenAnswer.toLowerCase().match(/\b(\w+)\b/g) || []).filter(w => w.length > 2);
            const commonKeywords = answerWords.filter(word => questionWords.includes(word));
            if (commonKeywords.length > 0) {
                feedbackMsg = `${currentTranslations.goodAnswerWriting || "Good! You've used some keywords from the question"}: ${commonKeywords.slice(0,3).join(', ')}.`;
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.addXP) {
                    CosyAppInteractive.addXP(5);
                }
            } else {
                feedbackMsg = currentTranslations.answerSubmittedWriting || 'Answer submitted. Try to incorporate more elements from the question.';
            }
            if (writtenAnswer.length < 20 && commonKeywords.length === 0) {
                 feedbackMsg += ` ${currentTranslations.tryToElaborate || 'Try to elaborate more in your answer.'}`;
            }
        }
        if (feedbackArea) feedbackArea.innerHTML = `<span class="correct" aria-label="Correct">✅📝 ${feedbackMsg}</span>`; // Using .correct for observer
    }

    resultArea.innerHTML = `
        <div class="writing-exercise-container exercise-container">
            <h3>📝 ${currentTranslations.writingQuestionTitle || 'Question Practice'}</h3>
            <div id="writing-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #007bff; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 15px;">
                <button id="prev-writing-question-btn" class="btn-secondary btn-small">&lt; ${currentTranslations.buttons?.previous || 'Previous'}</button>
                <button id="next-writing-question-btn" class="btn-secondary btn-small">${currentTranslations.buttons?.next || 'Next'} &gt;</button>
            </div>
            <textarea id="writing-answer-area" rows="8" spellcheck="true" placeholder="${currentTranslations.typeYourAnswerPlaceholder || 'Type your answer here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <div id="writing-feedback" class="feedback-area exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
            <div class="exercise-actions" style="margin-top: 15px;">
                 <button id="submit-writing-answer-btn" class="btn-primary" style="padding: 10px 20px;">${currentTranslations.submitAnswer || 'Submit Answer'}</button>
                 <!-- Randomize button will be appended here -->
            </div>
        </div>
    `;

    const feedbackEl = document.getElementById('writing-feedback');
    if (typeof setupExerciseCompletionFeedbackObserver === 'function') {
        setupExerciseCompletionFeedbackObserver(feedbackEl, 'writing-main', 'showQuestionWriting', WRITING_PRACTICE_TYPES, 120000);
    }
    if (typeof createStandardRandomizeButton === 'function') {
        const randomButton = createStandardRandomizeButton('writing-main', 'showQuestionWriting', WRITING_PRACTICE_TYPES);
        const actionsDiv = resultArea.querySelector('.exercise-actions');
        if (actionsDiv) actionsDiv.appendChild(randomButton);
        else resultArea.querySelector('.writing-exercise-container').appendChild(randomButton); // Fallback
    }

    document.getElementById('prev-writing-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) { currentQuestionIndex--; displayCurrentWritingQuestion(); }
    });
    document.getElementById('next-writing-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) { currentQuestionIndex++; displayCurrentWritingQuestion(); }
    });
    document.getElementById('submit-writing-answer-btn').addEventListener('click', checkWritingAnswer);
    displayCurrentWritingQuestion();
}

async function showStorytellingPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
            <div class="exercise-actions" style="margin-top: 15px;"></div>
        </div>`;
    if (typeof createStandardRandomizeButton === 'function') {
        const randomButton = createStandardRandomizeButton('writing-main', 'showStorytellingPractice', WRITING_PRACTICE_TYPES);
        const actionsDiv = resultArea.querySelector('.exercise-actions');
        if (actionsDiv) actionsDiv.appendChild(randomButton);
        else resultArea.querySelector('.writing-exercise-container').appendChild(randomButton);
    }
}

async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
            <div class="exercise-actions" style="margin-top: 15px;"></div>
        </div>`;
    if (typeof createStandardRandomizeButton === 'function') {
        const randomButton = createStandardRandomizeButton('writing-main', 'showDiaryPractice', WRITING_PRACTICE_TYPES);
        const actionsDiv = resultArea.querySelector('.exercise-actions');
        if (actionsDiv) actionsDiv.appendChild(randomButton);
        else resultArea.querySelector('.writing-exercise-container').appendChild(randomButton);
    }
}

async function practiceAllWriting() { // Main entry for "Practice All Writing"
    await startRandomWritingPractice();
}

async function startRandomWritingPractice() {
    const category = WRITING_PRACTICE_TYPES['writing-main'];
    if (!category || !category.exercises || category.exercises.length === 0) {
        console.error("Writing exercises not defined or empty in WRITING_PRACTICE_TYPES.");
        return;
    }
    // Prioritize implemented exercises
    const implementedExercises = category.exercises.filter(name => name === 'showQuestionWriting');
    let randomExerciseName;
    if (implementedExercises.length > 0) {
        randomExerciseName = implementedExercises[Math.floor(Math.random() * implementedExercises.length)];
    } else { // Fallback to any exercise if no specific implemented ones are found (e.g. if list changes)
        randomExerciseName = category.exercises[Math.floor(Math.random() * category.exercises.length)];
    }

    if (window[randomExerciseName] && typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Exercise function ${randomExerciseName} not found.`);
        const resultArea = document.getElementById('result');
        if (resultArea) {
            const lang = document.getElementById('language')?.value || 'COSYenglish';
            const currentTranslations = translations[lang] || translations.COSYenglish;
            resultArea.innerHTML = `<p>${currentTranslations.exerciseLoadingError || 'Error loading exercise. Please try again.'}</p>`;
        }
    }
}

// patchExerciseForRandomizeButton calls removed.
