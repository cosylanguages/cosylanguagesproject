// Writing Exercises
let writingPracticeTimer = null; // Timer for auto-progression

async function showQuestionWriting() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;

    if (!language) {
        resultArea.innerHTML = `<p>${t.selectLanguage || 'Please select a language first.'}</p>`;
        return;
    }

    const days = getSelectedDays(); 
    if (!days || days.length === 0) {
        resultArea.innerHTML = `<p>${t.selectDay || 'Please select a day or a range of days first.'}</p>`;
        return;
    }
    const day = days[0]; 

    const questions = await loadSpeakingQuestions(language, day); 

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${t.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }

    questions.sort(() => 0.5 - Math.random());
    let currentQuestionIndex = 0;
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>📝 ${t.writingQuestionTitle || 'Question Practice'}</h3>
            <div id="writing-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #007bff; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 15px;">
                <button id="prev-writing-question-btn" class="btn-secondary btn-small">&lt; ${t.buttons?.previous || 'Previous'}</button>
                <button id="next-writing-question-btn" class="btn-secondary btn-small">${t.buttons?.next || 'Next'} &gt;</button>
            </div>
            <textarea id="writing-answer-area" rows="8" spellcheck="true" placeholder="${t.typeYourAnswerPlaceholder || 'Type your answer here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="submit-writing-answer-btn" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.submitAnswer || 'Submit Answer'}</button>
            <div id="writing-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
        </div>
    `;
    
    const exerciseContainer = resultArea.querySelector('.writing-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            const questionForHint = questions[currentQuestionIndex] || "";
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWritingQuestion || "Address all parts of the question. Structure your answer with an introduction, body, and conclusion if applicable. The question is:"} '${questionForHint}'.`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }

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
            feedbackMsg = t.pleaseWriteAnswer || 'Please write an answer before submitting.';
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardIncorrectAnswer) {
                CosyAppInteractive.awardIncorrectAnswer();
            }
        } else {
            const questionWords = (questionText.toLowerCase().match(/\b(\w+)\b/g) || []).filter(w => w.length > 2);
            const answerWords = (writtenAnswer.toLowerCase().match(/\b(\w+)\b/g) || []).filter(w => w.length > 2);
            
            const commonKeywords = answerWords.filter(word => questionWords.includes(word));

            if (commonKeywords.length > 0) {
                feedbackMsg = `${t.goodAnswerWriting || "Good! You've used some keywords from the question"}: ${commonKeywords.slice(0,3).join(', ')}.`;
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) {
                    CosyAppInteractive.awardCorrectAnswer();
                    CosyAppInteractive.scheduleReview(language, 'writing-prompt', questionText, true);
                }
            } else {
                feedbackMsg = t.answerSubmittedWriting || 'Answer submitted. Try to incorporate more elements from the question.';
            }
            
            if (writtenAnswer.length < 20 && commonKeywords.length === 0) {
                 feedbackMsg += ` ${t.tryToElaborate || 'Try to elaborate more in your answer.'}`;
            }
        }
        if (feedbackArea) feedbackArea.innerHTML = `<span class="feedback-message" aria-label="Feedback">📝 ${feedbackMsg}</span>`;

        if (window.writingPracticeTimer) {
            clearTimeout(window.writingPracticeTimer);
        }
        window.writingPracticeTimer = setTimeout(() => {
            startRandomWritingPractice();
        }, 2500); 
    }

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

    const submitButton = document.getElementById('submit-writing-answer-btn');
    submitButton.addEventListener('click', checkWritingAnswer);

    const writingAnswerArea = document.getElementById('writing-answer-area');
    if (writingAnswerArea && submitButton) {
        writingAnswerArea.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault(); 
                submitButton.click();
            }
        });
    }
    
    if (window.writingPracticeTimer) {
        clearTimeout(window.writingPracticeTimer);
    }

    displayCurrentWritingQuestion();
}

async function showStorytellingPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${t.storytellingTitle || 'Storytelling Practice'}</h3>
            <p>${t.exerciseNotImplementedStorytelling || 'This storytelling exercise is not yet implemented.'}</p>
            <p>${t.imagineStorytellingHere || 'Imagine you write a story here and then click continue.'}</p>
            <button id="finish-storytelling-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.writing-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWritingGeneric || 'Plan your writing. Use descriptive language and check your grammar and spelling.'}`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }

    if (window.writingPracticeTimer) {
        clearTimeout(window.writingPracticeTimer);
    }

    document.getElementById('finish-storytelling-btn').addEventListener('click', () => {
        console.log("Storytelling practice conceptually finished.");
        if (window.writingPracticeTimer) {
            clearTimeout(window.writingPracticeTimer);
        }
        window.writingPracticeTimer = setTimeout(() => {
            startRandomWritingPractice();
        }, 1500); 
    });
}

async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${t.diaryTitle || 'Diary Practice'}</h3>
            <p>${t.exerciseNotImplementedDiary || 'This diary entry exercise is not yet implemented.'}</p>
            <p>${t.imagineDiaryHere || 'Imagine you write a diary entry here and then click continue.'}</p>
            <button id="finish-diary-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.writing-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWritingGeneric || 'Plan your writing. Use descriptive language and check your grammar and spelling.'}`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }

    if (window.writingPracticeTimer) {
        clearTimeout(window.writingPracticeTimer);
    }

    document.getElementById('finish-diary-btn').addEventListener('click', () => {
        console.log("Diary practice conceptually finished.");
        if (window.writingPracticeTimer) {
            clearTimeout(window.writingPracticeTimer);
        }
        window.writingPracticeTimer = setTimeout(() => {
            startRandomWritingPractice();
        }, 1500);
    });
}

async function startRandomWritingPractice() {
    if (window.writingPracticeTimer) {
        clearTimeout(window.writingPracticeTimer);
    }
     if (typeof cancelAutoAdvanceTimer === 'function') { 
        cancelAutoAdvanceTimer();
    }

    const exercises = [
        showQuestionWriting,
        showStorytellingPractice,
        showDiaryPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    
    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = '';

    await randomExerciseFunction();
}

function initWritingPractice() {
    const writingButton = document.getElementById('writing-practice-btn'); 
    if (writingButton) {
        writingButton.addEventListener('click', () => {
            startRandomWritingPractice();
        });
    }
}

showQuestionWriting = patchExerciseWithExtraButtons(showQuestionWriting, '.writing-exercise-container', startRandomWritingPractice);
showStorytellingPractice = patchExerciseWithExtraButtons(showStorytellingPractice, '.writing-exercise-container', startRandomWritingPractice);
showDiaryPractice = patchExerciseWithExtraButtons(showDiaryPractice, '.writing-exercise-container', startRandomWritingPractice);

window.showQuestionWriting = showQuestionWriting;
window.showStorytellingPractice = showStorytellingPractice;
window.showDiaryPractice = showDiaryPractice;
window.startRandomWritingPractice = startRandomWritingPractice;
window.initWritingPractice = initWritingPractice;
