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
    const langFileKey = 'en';
    const filePath = `data/writing/story_prompts_${langFileKey}.json`;
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error(`Error loading writing prompts: ${response.status}`);
            return { what_happens_next: [], what_happened_before: [] };
        }
        const data = await response.json();
        if (data && data[day]) {
            return {
                what_happens_next: data[day].what_happens_next || [],
                what_happened_before: data[day].what_happened_before || []
            };
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
    const questions = await loadSpeakingQuestions(language, day); // Assumed to be globally available

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${t.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }
    questions.sort(() => 0.5 - Math.random());
    let currentQuestionIndex = 0;

    resultArea.innerHTML = `
        <div class="writing-exercise-container question-writing-exercise">
            <h2 class="practice-type-title">${t.practiceTitleShowQuestionWriting || 'Writing Question Practice'}</h2>
            <h3>${t.writingQuestionTitle || 'Question Practice'}</h3>
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
    const exerciseContainer = resultArea.querySelector('.question-writing-exercise');
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
        if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = setTimeout(() => { startRandomWritingPractice(); }, 2500);
    }

    document.getElementById('prev-writing-question-btn').addEventListener('click', () => { if (currentQuestionIndex > 0) { currentQuestionIndex--; displayCurrentWritingQuestion(); } });
    document.getElementById('next-writing-question-btn').addEventListener('click', () => { if (currentQuestionIndex < questions.length - 1) { currentQuestionIndex++; displayCurrentWritingQuestion(); } });
    const submitButton = document.getElementById('submit-writing-answer-btn');
    submitButton.addEventListener('click', checkWritingAnswer);
    const writingAnswerArea = document.getElementById('writing-answer-area');
    if (writingAnswerArea && submitButton) { writingAnswerArea.addEventListener('keydown', function(event) { if (event.ctrlKey && event.key === 'Enter') { event.preventDefault(); submitButton.click(); } }); }
    if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
    displayCurrentWritingQuestion();
}

async function showOriginalStorytellingPlaceholder() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;

    resultArea.innerHTML = `
        <div class="writing-exercise-container original-storytelling-exercise">
            <h2 class="practice-type-title">${t.practiceTitleShowStorytellingPractice || 'Storytelling Practice'}</h2>
            <h3>${t.storytellingTitle || 'Storytelling Practice'}</h3>
            <p>${t.exerciseNotImplementedStorytelling || 'This is a freeform storytelling exercise.'}</p>
            <p>${t.imagineStorytellingHere || 'Write any story you like. Be creative!'}</p>
            <textarea id="original-storytelling-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourStoryPlaceholder || 'Type your story here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-original-storytelling-btn" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="original-storytelling-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.original-storytelling-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintWritingGeneric || 'Think about a beginning, middle, and end. Use interesting vocabulary!'}`;
            const textarea = exerciseContainer.querySelector('#original-storytelling-answer-area');
            if (textarea) textarea.parentNode.insertBefore(hintDisplay, textarea);
            else exerciseContainer.appendChild(hintDisplay);
        };
    }
    document.getElementById('finish-original-storytelling-btn').addEventListener('click', () => {
        const feedbackArea = document.getElementById('original-storytelling-feedback');
        const storyText = document.getElementById('original-storytelling-answer-area').value;
        if (storyText.trim().length < 10) {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.storySubmitted || 'Great! Story submitted.'}</span>`;
             if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
        }
        if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = setTimeout(() => { startRandomWritingPractice(); }, 2000);
    });
}

async function showStorytellingPractice() {
    const storytellingTypes = [
        showOriginalStorytellingPlaceholder,
        showStoryEmojisPractice,
        showWhatHappensNextPractice,
        showWhatHappenedBeforePractice
    ];
    const selectedStorytellingFunction = storytellingTypes[Math.floor(Math.random() * storytellingTypes.length)];
    await selectedStorytellingFunction();
}

async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';

    resultArea.innerHTML = `
        <div class="writing-exercise-container diary-writing-exercise">
            <h2 class="practice-type-title">${t.practiceTitleShowDiaryPractice || 'Diary Practice'}</h2>
            <h3>${t.diaryTitle || 'Diary Practice'}</h3>
            <p>${t.exerciseNotImplementedDiary || 'This diary entry exercise is not yet implemented.'}</p>
            <p>${t.imagineDiaryHere || 'Imagine you write a diary entry here and then click continue.'}</p>
            <button id="finish-diary-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.diary-writing-exercise');
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
    if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
    document.getElementById('finish-diary-btn').addEventListener('click', () => {
        console.log("Diary practice conceptually finished.");
        if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = setTimeout(() => { startRandomWritingPractice(); }, 1500);
    });
}

async function showStoryEmojisPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const selectedEmojis = [];
    const emojiPoolCopy = [...storyEmojiPool];
    for (let i = 0; i < 4; i++) {
        if (emojiPoolCopy.length === 0) break;
        const randomIndex = Math.floor(Math.random() * emojiPoolCopy.length);
        selectedEmojis.push(emojiPoolCopy.splice(randomIndex, 1)[0]);
    }
    if (selectedEmojis.length < 4 && storyEmojiPool.length >=4) {
       while(selectedEmojis.length < 4 && storyEmojiPool.length > 0) { selectedEmojis.push(storyEmojiPool[Math.floor(Math.random() * storyEmojiPool.length)]); }
    }
    if (selectedEmojis.length === 0 && storyEmojiPool.length > 0) {
       selectedEmojis.push(storyEmojiPool[0] || '❓'); selectedEmojis.push(storyEmojiPool[1] || '❓'); selectedEmojis.push(storyEmojiPool[2] || '❓'); selectedEmojis.push(storyEmojiPool[3] || '❓');
    }
    resultArea.innerHTML = `
        <div class="writing-exercise-container story-emojis-exercise">
            <h2 class="practice-type-title">${t.practiceTitleStoryEmojis || 'Story Emojis'}</h2>
            <h3>${t.storyEmojisTitle || 'Write a Story Based on These Emojis:'}</h3>
            <div class="story-emojis-display" style="font-size: 2.5em; margin-bottom: 20px; text-align: center;">${selectedEmojis.join(' ')}</div>
            <textarea id="story-emojis-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourStoryPlaceholder || 'Type your story here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-story-emojis-btn" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="story-emojis-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.story-emojis-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = t.hintStoryEmojis || 'Hint: Try to connect all emojis in your story. Think about characters, actions, and settings they might represent.';
            const textarea = exerciseContainer.querySelector('#story-emojis-answer-area');
            if (textarea) textarea.parentNode.insertBefore(hintDisplay, textarea); else exerciseContainer.appendChild(hintDisplay);
        };
    }
    document.getElementById('finish-story-emojis-btn').addEventListener('click', () => {
        const feedbackArea = document.getElementById('story-emojis-feedback');
        const storyText = document.getElementById('story-emojis-answer-area').value;
        if (storyText.trim().length < 10) {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
             feedbackArea.innerHTML = `<span class="feedback-message">${t.storySubmitted || 'Great! Story submitted.'}</span>`;
             if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
        }
        if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = setTimeout(() => { startRandomWritingPractice(); }, 2000);
    });
}

async function showWhatHappensNextPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const days = getSelectedDays();
    if (!language || !days || days.length === 0) { resultArea.innerHTML = `<p>${t.selectLangDay || 'Please select language and day(s).'}</p>`; return; }
    const day = days[0];
    const promptsData = await loadWritingPrompts(language, day);
    if (!promptsData.what_happens_next || promptsData.what_happens_next.length === 0) { resultArea.innerHTML = `<p>${t.noWhatHappensNextPromptsAvailable || 'No "What Happens Next" prompts available for this selection.'}</p>`; return; }
    const prompt = promptsData.what_happens_next[Math.floor(Math.random() * promptsData.what_happens_next.length)];
    resultArea.innerHTML = `
        <div class="writing-exercise-container what-happens-next-exercise">
            <h2 class="practice-type-title">${t.practiceTitleWhatHappensNext || 'What Happens Next?'}</h2>
            <h3>${t.whatHappensNextTitle || 'What Happens Next?'}</h3>
            <p class="writing-prompt">${prompt}</p>
            <textarea id="what-happens-next-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourContinuationPlaceholder || 'Type your continuation here...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-what-happens-next-btn" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="what-happens-next-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.what-happens-next-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = t.hintWhatHappensNext || 'Hint: Be creative! Think about the characters and the situation. What is a logical or surprising continuation?';
            const textarea = exerciseContainer.querySelector('#what-happens-next-answer-area');
            if (textarea) textarea.parentNode.insertBefore(hintDisplay, textarea); else exerciseContainer.appendChild(hintDisplay);
        };
    }
    document.getElementById('finish-what-happens-next-btn').addEventListener('click', () => {
        const feedbackArea = document.getElementById('what-happens-next-feedback');
        const answerText = document.getElementById('what-happens-next-answer-area').value;
        if (answerText.trim().length < 10) {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.continuationSubmitted || 'Great! Continuation submitted.'}</span>`;
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
        }
        if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = setTimeout(() => { startRandomWritingPractice(); }, 2000);
    });
}

async function showWhatHappenedBeforePractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const days = getSelectedDays();
    if (!language || !days || days.length === 0) { resultArea.innerHTML = `<p>${t.selectLangDay || 'Please select language and day(s).'}</p>`; return; }
    const day = days[0];
    const promptsData = await loadWritingPrompts(language, day);
    if (!promptsData.what_happened_before || promptsData.what_happened_before.length === 0) { resultArea.innerHTML = `<p>${t.noWhatHappenedBeforePromptsAvailable || 'No "What Happened Before" prompts available for this selection.'}</p>`; return; }
    const prompt = promptsData.what_happened_before[Math.floor(Math.random() * promptsData.what_happened_before.length)];
    resultArea.innerHTML = `
        <div class="writing-exercise-container what-happened-before-exercise">
            <h2 class="practice-type-title">${t.practiceTitleWhatHappenedBefore || 'What Happened Before?'}</h2>
            <h3>${t.whatHappenedBeforeTitle || 'What Happened Before?'}</h3>
            <p class="writing-prompt">${prompt}</p>
            <textarea id="what-happened-before-answer-area" rows="10" spellcheck="true" placeholder="${t.typeYourPrequelPlaceholder || 'Type what led to this...'}" style="width: 95%; max-width: 95%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;"></textarea>
            <button id="finish-what-happened-before-btn" class="btn-primary" style="padding: 10px 20px; margin-bottom:10px;">${t.buttons?.done || 'Done'}</button>
            <div id="what-happened-before-feedback" class="exercise-feedback" style="margin-top: 10px; min-height: 20px; padding: 8px; border-radius: 4px;"></div>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.what-happened-before-exercise');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = t.hintWhatHappenedBefore || 'Hint: Think about the cause and effect. What events could have led to this situation?';
            const textarea = exerciseContainer.querySelector('#what-happened-before-answer-area');
            if (textarea) textarea.parentNode.insertBefore(hintDisplay, textarea); else exerciseContainer.appendChild(hintDisplay);
        };
    }
    document.getElementById('finish-what-happened-before-btn').addEventListener('click', () => {
        const feedbackArea = document.getElementById('what-happened-before-feedback');
        const answerText = document.getElementById('what-happened-before-answer-area').value;
         if (answerText.trim().length < 10) {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.pleaseWriteMore || 'Please write a bit more for your story.'}</span>`;
        } else {
            feedbackArea.innerHTML = `<span class="feedback-message">${t.prequelSubmitted || 'Great! Prequel submitted.'}</span>`;
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) CosyAppInteractive.awardCorrectAnswer();
        }
        if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
        window.writingPracticeTimer = setTimeout(() => { startRandomWritingPractice(); }, 2000);
    });
}

async function startRandomWritingPractice() {
    if (window.writingPracticeTimer) clearTimeout(window.writingPracticeTimer);
    if (typeof cancelAutoAdvanceTimer === 'function') cancelAutoAdvanceTimer();

    const exercises = [
        showQuestionWriting,
        showStorytellingPractice,
        showDiaryPractice,
        // showStoryEmojisPractice, // StorytellingPractice will now randomly pick this
        // showWhatHappensNextPractice, // StorytellingPractice will now randomly pick this
        // showWhatHappenedBeforePractice // StorytellingPractice will now randomly pick this
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

showQuestionWriting = patchExerciseWithExtraButtons(showQuestionWriting, '.question-writing-exercise', startRandomWritingPractice);
showOriginalStorytellingPlaceholder = patchExerciseWithExtraButtons(showOriginalStorytellingPlaceholder, '.original-storytelling-exercise', startRandomWritingPractice);
showDiaryPractice = patchExerciseWithExtraButtons(showDiaryPractice, '.diary-writing-exercise', startRandomWritingPractice);
showStoryEmojisPractice = patchExerciseWithExtraButtons(showStoryEmojisPractice, '.story-emojis-exercise', startRandomWritingPractice);
showWhatHappensNextPractice = patchExerciseWithExtraButtons(showWhatHappensNextPractice, '.what-happens-next-exercise', startRandomWritingPractice);
showWhatHappenedBeforePractice = patchExerciseWithExtraButtons(showWhatHappenedBeforePractice, '.what-happened-before-exercise', startRandomWritingPractice);
// showStorytellingPractice itself is a router, its direct patching might be less critical if sub-functions handle hints.

window.showQuestionWriting = showQuestionWriting;
window.showStorytellingPractice = showStorytellingPractice; // This is now the router
window.showOriginalStorytellingPlaceholder = showOriginalStorytellingPlaceholder; // Specific type
window.showDiaryPractice = showDiaryPractice;
window.showStoryEmojisPractice = showStoryEmojisPractice; // Specific type
window.showWhatHappensNextPractice = showWhatHappensNextPractice; // Specific type
window.showWhatHappenedBeforePractice = showWhatHappenedBeforePractice; // Specific type
window.startRandomWritingPractice = startRandomWritingPractice;
window.initWritingPractice = initWritingPractice;
