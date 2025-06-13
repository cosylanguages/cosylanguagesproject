// Writing Exercises

// Placeholder functions for specific writing exercises
async function showDailyWriting() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.dailyWriting || 'Daily Writing'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showQuestionWriting() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language) {
        resultArea.innerHTML = `<p>${currentTranslations.selectLanguage || 'Please select a language first.'}</p>`;
        return;
    }

    const days = getSelectedDays(); // Assuming getSelectedDays() is global (from index.html script)
    if (!days || days.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.selectDay || 'Please select a day or a range of days first.'}</p>`;
        return;
    }
    const day = days[0]; // Use the first day in the range

    // Using loadSpeakingQuestions as it fetches questions suitable for this purpose too.
    const questions = await loadSpeakingQuestions(language, day); // From utils.js

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }

    // Shuffle the questions array in place
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
                    CosyAppInteractive.addXP(5); // Award XP for writing
                }
            } else {
                feedbackMsg = currentTranslations.answerSubmittedWriting || 'Answer submitted. Try to incorporate more elements from the question.';
            }
            
            if (writtenAnswer.length < 20 && commonKeywords.length === 0) {
                 feedbackMsg += ` ${currentTranslations.tryToElaborate || 'Try to elaborate more in your answer.'}`;
            }
        }
        if (feedbackArea) feedbackArea.textContent = feedbackMsg;
    }

    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.writingQuestionTitle || 'Question Practice'}</h3>
            <div id="writing-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #007bff; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 15px;">
                <button id="prev-writing-question-btn" class="btn-secondary btn-small">&lt; ${currentTranslations.buttons.previous || 'Previous'}</button>
                <button id="next-writing-question-btn" class="btn-secondary btn-small">${currentTranslations.buttons.next || 'Next'} &gt;</button>
            </div>
            <textarea id="writing-answer-area" rows="8" spellcheck="true" placeholder="${currentTranslations.typeYourAnswerPlaceholder || 'Type your answer here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="submit-writing-answer-btn" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${currentTranslations.submitAnswer || 'Submit Answer'}</button>
            <div id="writing-feedback" class="feedback-area" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
        </div>
    `;

    document.getElementById('prev-writing-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayCurrentWritingQuestion();
        }
    });

    document.getElementById('next-writing-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayCurrentWritingQuestion();
        }
    });

    document.getElementById('submit-writing-answer-btn').addEventListener('click', checkWritingAnswer);
    // Add Enter key support for textarea (optional, often Shift+Enter for new line, Enter to submit)
    // For simplicity, not adding Enter key for submission on textarea to allow new lines easily.

    displayCurrentWritingQuestion();
}

async function showStorytellingPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.storytelling || 'Storytelling'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.diary || 'Diary'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

// Main function to start a random writing exercise
async function startRandomWritingPractice() {
    // For now, let's assume Question Writing is the primary one to randomize into
    // const exercises = [
    //     showDailyWriting,
    //     showQuestionWriting,
    //     showStorytellingPractice,
    //     showDiaryPractice
    // ];
    // const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    // await randomExerciseFunction();
    await showQuestionWriting(); // Default to the main implemented one for now
}

// Patch the exercise functions to add the randomize button
showDailyWriting = patchExerciseForRandomizeButton(showDailyWriting, '.writing-exercise-container', startRandomWritingPractice);
showQuestionWriting = patchExerciseForRandomizeButton(showQuestionWriting, '.writing-exercise-container', startRandomWritingPractice);
showStorytellingPractice = patchExerciseForRandomizeButton(showStorytellingPractice, '.writing-exercise-container', startRandomWritingPractice);
showDiaryPractice = patchExerciseForRandomizeButton(showDiaryPractice, '.writing-exercise-container', startRandomWritingPractice);

// As with speaking.js, button event listeners for main menu items (e.g. 'question-btn' under Writing)
// are expected to be in buttons.js or index.html.
