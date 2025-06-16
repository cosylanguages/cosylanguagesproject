import UserProgress from '../user-progress.js';
import AudioFeedback from '../audio-feedback.js';

// Writing Exercises

// Placeholder functions for specific writing exercises

export async function showQuestionWriting() {
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
    const questions = await loadSpeakingQuestions(language, day); // From utils.js or global

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
        let isCorrect = false; // For UserProgress

        if (!writtenAnswer.trim()) {
            feedbackMsg = currentTranslations.pleaseWriteAnswer || 'Please write an answer before submitting.';
            isCorrect = false;
        } else {
            const questionWords = (questionText.toLowerCase().match(/\b(\w+)\b/g) || []).filter(w => w.length > 2);
            const answerWords = (writtenAnswer.toLowerCase().match(/\b(\w+)\b/g) || []).filter(w => w.length > 2);
            
            const commonKeywords = answerWords.filter(word => questionWords.includes(word));

            if (commonKeywords.length > 0) {
                feedbackMsg = `${currentTranslations.goodAnswerWriting || "Good! You've used some keywords from the question"}: ${commonKeywords.slice(0,3).join(', ')}.`;
                isCorrect = true; // Consider it a "correct" attempt for XP
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.addXP) { // Old XP system
                    CosyAppInteractive.addXP(5); 
                }
            } else {
                feedbackMsg = currentTranslations.answerSubmittedWriting || 'Answer submitted. Try to incorporate more elements from the question.';
                isCorrect = false; // Or a partial correct, but for simplicity, false if no keywords
            }
            
            if (writtenAnswer.length < 20 && commonKeywords.length === 0) {
                 feedbackMsg += ` ${currentTranslations.tryToElaborate || 'Try to elaborate more in your answer.'}`;
            }
        }

        UserProgress.recordAnswer(isCorrect, questionText, 'writing_question');
        if(isCorrect) AudioFeedback.playSuccessSound(); else AudioFeedback.playErrorSound();
        
        if (feedbackArea) feedbackArea.innerHTML = `<span class="${isCorrect ? 'correct' : 'feedback-message'}" aria-label="Feedback">📝 ${feedbackMsg}</span>`;
    }

    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>📝 ${currentTranslations.writingQuestionTitle || 'Question Practice'}</h3>
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
    displayCurrentWritingQuestion();
}

export async function showStorytellingPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

export async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

// Main function to start a random writing exercise
async function startRandomWritingPractice() {
    await showQuestionWriting(); 
}

// Patch the exercise functions to add the randomize button
showQuestionWriting = patchExerciseForRandomizeButton(showQuestionWriting, '.writing-exercise-container', startRandomWritingPractice);
showStorytellingPractice = patchExerciseForRandomizeButton(showStorytellingPractice, '.writing-exercise-container', startRandomWritingPractice);
showDiaryPractice = patchExerciseForRandomizeButton(showDiaryPractice, '.writing-exercise-container', startRandomWritingPractice);

// Global dependencies: getSelectedDays, loadSpeakingQuestions, translations, patchExerciseForRandomizeButton
// These are assumed to be available in the global scope or loaded before this script.
