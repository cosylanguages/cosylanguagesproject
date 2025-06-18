// Speaking Exercises
let speakingPracticeTimer = null; // Timer for auto-progression

async function showQuestionPractice() {
    // Clear any existing timer for auto-progression
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }

    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};

    if (!language) {
        resultArea.innerHTML = `<p>${t.selectLanguage || 'Please select a language first.'}</p>`;
        return;
    }

    const days = getSelectedDays(); 
    if (!days || days.length === 0) {
        resultArea.innerHTML = `<p>${t.selectDay || 'Please select a day or a range of days first.'}</p>`;
        return;
    }
    // For question practice, typically load questions for the first selected day or a specific day.
    // Adjust if multiple days should be aggregated or selected differently.
    const day = days[0]; 

    const questions = await loadSpeakingQuestions(language, day); 

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${t.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }

    questions.sort(() => 0.5 - Math.random()); // Shuffle questions
    let currentQuestionIndex = 0;
    
    const newExerciseButtonText = t.buttons?.newQuestionSet || t.buttons?.newExerciseSameType || 'New Question Set';

    resultArea.innerHTML = `
        <div class="speaking-exercise-container exercise-container">
            <h3>${t.speakingPracticeTitle || "Speaking Practice: Answer the Question"}</h3>
            <div id="speaking-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 20px; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 20px;">
                <button id="prev-speaking-question-btn" class="btn-secondary btn-small">&lt; ${t.buttons?.previous || 'Previous'}</button>
                <button id="next-speaking-question-btn" class="btn-secondary btn-small">${t.buttons?.next || 'Next'} &gt;</button>
            </div>
            <button id="speaking-record-btn" class="btn-primary btn-emoji" style="font-size: 2.5em; padding: 10px 20px; margin-bottom:15px; line-height: 1;">🎤</button>
            <div id="speaking-transcript" class="transcript-area" style="margin-top: 10px; min-height: 25px; padding: 5px; border: 1px solid #eee; border-radius: 4px;"></div>
            <div id="speaking-feedback" class="feedback-area" style="margin-top: 10px; min-height: 25px; padding: 5px;"></div>
            <button id="btn-new-speaking-question" class="btn-secondary" onclick="window.showQuestionPractice()" aria-label="${newExerciseButtonText}">🔄 ${newExerciseButtonText}</button>
        </div>
    `;
    
    const exerciseContainer = resultArea.querySelector('.speaking-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { // Assign to function property
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            const questionForHint = questions[currentQuestionIndex] || (t.currentQuestion || "the current question");
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintUnderstandQuestion || "Try to understand the question fully. Use relevant vocabulary and aim for a complete sentence. The current question is about"} '${questionForHint}'.`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = function() {
            console.log("CheckAnswer called for Question Practice - specific check logic is part of speech recognition feedback.");
            // Optionally, could provide some generic feedback or trigger re-listening to the question.
            const feedbackEl = document.getElementById('speaking-feedback');
            if(feedbackEl) feedbackEl.textContent = t.selfReflectionPrompt || "Listen to your recording (if available) and self-assess your answer.";
        };
        exerciseContainer.revealAnswer = function() {
            console.log("RevealAnswer called for Question Practice - no direct answer to reveal.");
             const feedbackEl = document.getElementById('speaking-feedback');
            if(feedbackEl) feedbackEl.textContent = t.noDirectAnswerSpeaking || "There's no single 'correct' answer to reveal. Focus on expressing yourself clearly.";
        };
    }

    function displayCurrentQuestion() {
        const questionText = questions[currentQuestionIndex];
        const questionTextElement = document.getElementById('speaking-question-text');
        const prevBtn = document.getElementById('prev-speaking-question-btn');
        const nextBtn = document.getElementById('next-speaking-question-btn');
        const transcriptEl = document.getElementById('speaking-transcript');
        const feedbackEl = document.getElementById('speaking-feedback');

        if (questionTextElement) questionTextElement.textContent = questionText;
        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) nextBtn.disabled = currentQuestionIndex === questions.length - 1;
        
        if (transcriptEl) transcriptEl.textContent = ''; // Clear previous transcript
        if (feedbackEl) feedbackEl.textContent = '';    // Clear previous feedback

        // Reset record button state if it was recording
        const recordButton = document.getElementById('speaking-record-btn');
        if (recordButton && recordButton.classList.contains('recording')) {
            // If speech recognition API is active, stop it
            if (typeof recognition !== 'undefined' && typeof recognition.stop === 'function' && recognition.recognizing) {
                 recognition.stop(); // This should trigger onEndCallback eventually
            } else { // Manual reset if recognition API not active or no 'recognizing' flag
                recordButton.classList.remove('recording');
                recordButton.textContent = '🎤';
            }
        }
    }

    function handleSpeakingRecording() {
        const questionText = questions[currentQuestionIndex];
        const recordButton = document.getElementById('speaking-record-btn');
        const feedbackDiv = document.getElementById('speaking-feedback'); 
        const transcriptDiv = document.getElementById('speaking-transcript'); 

        if (!recordButton || !feedbackDiv || !transcriptDiv) {
            console.error("Required UI elements for recording are missing.");
            return;
        }
        
        // Check if recognition is currently active and try to stop it
        if (typeof recognition !== 'undefined' && recognition.recognizing) {
            recognition.stop(); 
            // UI reset will be handled by onEndCallback
            return;
        }
        
        const langCode = mapLanguageToSpeechCode(language); // Assumes mapLanguageToSpeechCode is globally available

        const onStartCallback = () => {
            recordButton.classList.add('recording');
            recordButton.textContent = t.recordingInProgress || 'Recording...';
            feedbackDiv.textContent = t.feedbackListening || 'Listening...'; 
            transcriptDiv.textContent = ''; // Clear previous transcript
        };

        const onResultCallback = (transcript) => {
            // Transcript is already set by startPronunciationCheck
            checkSpeakingAnswer(questionText, transcript); // Evaluate the transcript
        };

        const onErrorCallback = (event) => {
            // UI reset is handled by onEndCallback
            let errorMsg = t.error || 'Error';
            if (event.error === 'no-speech') errorMsg = t.noSpeechDetected || 'No speech detected. Please try again.';
            else if (event.error === 'audio-capture') errorMsg = t.micProblem || 'Audio capture problem. Is your microphone working?';
            else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') errorMsg = t.micPermissionDenied || 'Microphone permission denied. Please allow microphone access.';
            else if (event.error === 'network') errorMsg = t.networkError || 'Network error during speech recognition.';
            else if (event.error === 'aborted') errorMsg = t.recognitionAborted || 'Speech recognition aborted.';
            else errorMsg = `${t.errorInRecognition || 'Error in recognition'}: ${event.error}`;
            
            if (feedbackDiv) feedbackDiv.textContent = errorMsg;
            // No auto-advance on error, let user retry or get a new question.
        };

        const onEndCallback = () => {
            if (recordButton) {
                recordButton.classList.remove('recording');
                recordButton.textContent = '🎤';
            }
            // If feedback is still "Listening...", clear it or set to a default prompt.
            if (feedbackDiv && feedbackDiv.textContent === (t.feedbackListening || 'Listening...')) {
                 feedbackDiv.textContent = t.clickMicToRecord || 'Click the mic to record your answer.'; 
            }
        };
        
        // Assuming startPronunciationCheck is globally available and adapted for general speaking
        if (typeof startPronunciationCheck === 'function') {
            startPronunciationCheck(
                questionText, // Context for the speech, could be null if not checking against specific text
                langCode,           
                'speaking-transcript', // ID of element to display live transcript
                'speaking-feedback',   // ID of element for feedback messages from recognizer
                onStartCallback,
                onResultCallback, // This callback gets the final transcript
                onErrorCallback,
                onEndCallback
            );
        } else {
            console.error("startPronunciationCheck function is not available.");
            if(feedbackDiv) feedbackDiv.textContent = "Speech recording feature not available.";
        }
    }
    
    function checkSpeakingAnswer(question, transcript) {
        const feedbackDiv = document.getElementById('speaking-feedback');
        if (!feedbackDiv) return;

        let feedbackMsg = '';
        if (!transcript || !transcript.trim()) {
            feedbackMsg = t.noSpeechDetectedShort || 'No speech detected.';
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardIncorrectAnswer) {
                CosyAppInteractive.awardIncorrectAnswer();
            }
        } else {
            // Basic check: length of transcript. More sophisticated checks could be added.
            if (transcript.trim().split(/\s+/).length >= 3) { // Answer has at least 3 words
                feedbackMsg = t.goodAnswerSpeakingShort || 'Good answer!';
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) {
                    CosyAppInteractive.awardCorrectAnswer();
                    CosyAppInteractive.scheduleReview(language, 'speaking-phrase', question, true); // Store question as the item
                }
            } else {
                 feedbackMsg = t.tryAgainSpeakingShort || "Try to give a more detailed answer.";
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardIncorrectAnswer) {
                    CosyAppInteractive.awardIncorrectAnswer();
                }
            }
        }
        feedbackDiv.innerHTML = feedbackMsg; 
        // No auto-advance here, user can try again, get new question, or use global controls.
    }

    document.getElementById('prev-speaking-question-btn')?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayCurrentQuestion();
        }
    });

    document.getElementById('next-speaking-question-btn')?.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayCurrentQuestion();
        }
    });

    document.getElementById('speaking-record-btn')?.addEventListener('click', handleSpeakingRecording);

    displayCurrentQuestion(); 
}


async function showMonologuePractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const newExerciseButtonText = t.buttons?.newMonologueTopic || t.buttons?.newExerciseSameType || 'New Monologue Topic';
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container exercise-container">
            <h3>${t.monologuePracticeTitle || "Monologue Practice"}</h3>
            <p>${t.exerciseNotImplementedMonologue || 'This monologue exercise is not yet implemented.'}</p>
            <p>${t.imagineMonologueHere || 'Imagine you are prompted with a topic and record a monologue here.'}</p>
            {/* Placeholder for monologue topic and recording UI */}
            <button id="btn-new-monologue-practice" class="btn-secondary btn-next-item" onclick="window.showMonologuePractice()" aria-label="${newExerciseButtonText}">🔄 ${newExerciseButtonText}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.speaking-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { // Assign to function property
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMonologueGeneric || 'Organize your thoughts before speaking. Use varied vocabulary and try to speak fluently for a minute or two.'}`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = function() { console.log("CheckAnswer for monologue - self-assessment encouraged."); };
        exerciseContainer.revealAnswer = function() { console.log("RevealAnswer for monologue - no specific answer to reveal."); };
    }
}

async function showRolePlayPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const newExerciseButtonText = t.buttons?.newRolePlayScenario || t.buttons?.newExerciseSameType || 'New Role-Play Scenario';
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container exercise-container">
            <h3>${t.rolePlayPracticeTitle || "Role-Play Practice"}</h3>
            <p>${t.exerciseNotImplementedRolePlay || 'This role-play exercise is not yet implemented.'}</p>
            <p>${t.imagineRolePlayHere || 'Imagine you are given a scenario and interact in a role-play here.'}</p>
            {/* Placeholder for role-play scenario and interaction UI */}
            <button id="btn-new-roleplay-practice" class="btn-secondary btn-next-item" onclick="window.showRolePlayPractice()" aria-label="${newExerciseButtonText}">🔄 ${newExerciseButtonText}</button>
        </div>
    `;
    const exerciseContainer = resultArea.querySelector('.speaking-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { // Assign to function property
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintRolePlayGeneric || 'Understand your role and the situation. Try to use appropriate phrases and react naturally.'}`;
            this.appendChild(hintDisplay);
        };
        exerciseContainer.checkAnswer = function() { console.log("CheckAnswer for role-play - self-assessment encouraged."); };
        exerciseContainer.revealAnswer = function() { console.log("RevealAnswer for role-play - no specific answer to reveal."); };
    }
}

// This function is used by patchExerciseWithExtraButtons as the category randomizer
async function practiceAllSpeaking() {
    await startRandomSpeakingPractice();
}

async function startRandomSpeakingPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
        window.speakingPracticeTimer = null;
    }
    // if (typeof cancelAutoAdvanceTimer === 'function') { 
    //     cancelAutoAdvanceTimer();
    // }

    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = ''; 

    const exercises = [
        showQuestionPractice,
        showMonologuePractice,
        showRolePlayPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    await randomExerciseFunction();
}

function initSpeakingPractice() {
    const speakingButton = document.getElementById('speaking-practice-btn'); 
    if (speakingButton) {
        speakingButton.addEventListener('click', () => {
            startRandomSpeakingPractice();
        });
    }
}

// Ensure functions are on window scope for patching and HTML onclicks
window.showQuestionPractice = showQuestionPractice;
window.showMonologuePractice = showMonologuePractice;
window.showRolePlayPractice = showRolePlayPractice;
window.startRandomSpeakingPractice = startRandomSpeakingPractice;
window.practiceAllSpeaking = practiceAllSpeaking; // Make sure category randomizer is on window if used by patcher directly
window.initSpeakingPractice = initSpeakingPractice;

// Patching exercise functions
const speakingOptions = { noReveal: true, noCheck: true }; // Common options for speaking exercises

window.showQuestionPractice = patchExerciseWithExtraButtons(
    window.showQuestionPractice, 
    '.speaking-exercise-container', 
    window.startRandomSpeakingPractice, 
    speakingOptions
);
window.showMonologuePractice = patchExerciseWithExtraButtons(
    window.showMonologuePractice, 
    '.speaking-exercise-container', 
    window.startRandomSpeakingPractice, 
    speakingOptions
);
window.showRolePlayPractice = patchExerciseWithExtraButtons(
    window.showRolePlayPractice, 
    '.speaking-exercise-container', 
    window.startRandomSpeakingPractice, 
    speakingOptions
);

document.addEventListener('DOMContentLoaded', initSpeakingPractice);
