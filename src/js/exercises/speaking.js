// Speaking Exercises
let speakingPracticeTimer = null; // Timer for auto-progression

async function showQuestionPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;

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

    const questions = await loadSpeakingQuestions(language, day); 

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${t.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        return;
    }

    questions.sort(() => 0.5 - Math.random());
    let currentQuestionIndex = 0;
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <div id="speaking-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 20px; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 20px;">
                <button id="prev-speaking-question-btn" class="exercise-button">&lt; ${t.buttons?.previous || 'Previous'}</button>
                <button id="next-speaking-question-btn" class="exercise-button">${t.buttons?.next || 'Next'} &gt;</button>
            </div>
            <button id="speaking-record-btn" class="btn-primary btn-emoji" style="font-size: 2.5em; padding: 10px 20px; margin-bottom:15px; line-height: 1;">🎤</button>
            <div id="speaking-transcript" class="transcript-area" style="margin-top: 10px; min-height: 25px; padding: 5px; border: 1px solid #eee; border-radius: 4px;"></div>
            <div id="speaking-feedback" class="feedback-area" style="margin-top: 10px; min-height: 25px; padding: 5px;"></div>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons after this function completes.
    
    const exerciseContainer = resultArea.querySelector('.speaking-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            const questionForHint = questions[currentQuestionIndex] || (t.currentQuestion || "the current question");
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintUnderstandQuestion || "Try to understand the question fully. Use relevant vocabulary and aim for a complete sentence. The current question is about"} '${questionForHint}'.`;
            exerciseContainer.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
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
        
        if (transcriptEl) transcriptEl.textContent = '';
        if (feedbackEl) feedbackEl.textContent = '';
        const recordButton = document.getElementById('speaking-record-btn');
        if (recordButton && recordButton.classList.contains('recording')) {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
        }
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
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
        
        if (typeof recognition !== 'undefined' && recognition.recognizing) {
            recognition.stop(); 
            return;
        }
        
        const langCode = mapLanguageToSpeechCode(language);

        const onStartCallback = () => {
            recordButton.classList.add('recording');
            recordButton.textContent = t.recordingInProgress || 'Recording...'; // This button's text is part of main UI, refreshLatinization will handle it.
            feedbackDiv.textContent = ''; 
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };

        const onResultCallback = (transcript) => {
            // Transcript itself is user input, should not be transliterated.
            // checkSpeakingAnswer will update feedbackDiv, which will then be refreshed.
            checkSpeakingAnswer(questionText, transcript); 
        };

        const onErrorCallback = (event) => {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';

            let errorMsg = t.error || 'Error';
            if (event.error === 'no-speech') {
                errorMsg = t.noSpeechDetected || 'No speech detected. Please try again.';
            } else if (event.error === 'audio-capture') {
                errorMsg = t.micProblem || 'Audio capture problem. Is your microphone working?';
            } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMsg = t.micPermissionDenied || 'Microphone permission denied. Please allow microphone access.';
            } else if (event.error === 'network') {
                errorMsg = t.networkError || 'Network error during speech recognition.';
            } else if (event.error === 'aborted') {
                errorMsg = t.recognitionAborted || 'Speech recognition aborted.';
            } else {
                errorMsg = `${t.errorInRecognition || 'Error in recognition'}: ${event.error}`;
            }
            feedbackDiv.textContent = errorMsg;
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
            if (window.speakingPracticeTimer) { clearTimeout(window.speakingPracticeTimer); }
            window.speakingPracticeTimer = setTimeout(() => { startRandomSpeakingPractice(); }, 3000);
        };

        const onEndCallback = () => {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤'; // Handled by refreshLatinization
            if (feedbackDiv.textContent === (t.feedbackListening || 'Listening...')) {
                 feedbackDiv.textContent = ''; 
            }
            // No specific text change here that needs immediate refresh beyond what checkSpeakingAnswer or onErrorCallback would do.
        };
        
        startPronunciationCheck(
            questionText,       
            langCode,           
            'speaking-transcript', 
            'speaking-feedback',   
            onStartCallback,
            onResultCallback,
            onErrorCallback,
            onEndCallback
        );
    }
    
    function checkSpeakingAnswer(question, transcript) {
        const feedbackDiv = document.getElementById('speaking-feedback');
        if (!feedbackDiv) return;

        let feedbackMsg = '';
        // ... (feedback logic) ...
        if (!transcript || !transcript.trim()) {
            feedbackMsg = t.noSpeechDetected || 'No speech detected. Please try again.';
        } else {
            // ... (more feedback logic) ...
            if (commonWordCount > 0 || transcriptWords.length > 2) { 
                feedbackMsg = t.goodAnswerSpeaking || 'Good! Your answer seems relevant.';
            } else if (transcriptWords.length > 0) {
                 feedbackMsg = t.tryAgainSpeakingShort || "Try to give a more detailed answer.";
            } else {
                feedbackMsg = t.tryAgainSpeaking || "Try to address the question more directly.";
            }
        }
        feedbackDiv.innerHTML = feedbackMsg; 
        if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }

        if (window.speakingPracticeTimer) {
            clearTimeout(window.speakingPracticeTimer);
        }
        window.speakingPracticeTimer = setTimeout(() => {
            startRandomSpeakingPractice();
        }, 3000); 
    }

    document.getElementById('prev-speaking-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayCurrentQuestion(); // Calls refreshLatinization
        }
    });

    document.getElementById('next-speaking-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayCurrentQuestion(); // Calls refreshLatinization
        }
    });

    document.getElementById('speaking-record-btn').addEventListener('click', handleSpeakingRecording);

    displayCurrentQuestion(); // Calls refreshLatinization
}


async function showMonologuePractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <p>${t.exerciseNotImplementedMonologue || 'This monologue exercise is not yet implemented.'}</p>
            <p>${t.imagineMonologueHere || 'Imagine you record a monologue here and then click continue.'}</p>
            <button id="finish-monologue-btn" class="exercise-button">${buttonText}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.speaking-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintMonologueGeneric || 'Organize your thoughts before speaking. Use varied vocabulary and try to speak fluently.'}`;
            exerciseContainer.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }

    document.getElementById('finish-monologue-btn').addEventListener('click', () => {
        console.log("Monologue practice conceptually finished.");
        if (window.speakingPracticeTimer) {
            clearTimeout(window.speakingPracticeTimer);
        }
        window.speakingPracticeTimer = setTimeout(() => {
            startRandomSpeakingPractice();
        }, 1500); 
    });
}

async function showRolePlayPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <p>${t.exerciseNotImplementedRolePlay || 'This role-play exercise is not yet implemented.'}</p>
            <p>${t.imagineRolePlayHere || 'Imagine you participate in a role-play here and then click continue.'}</p>
            <button id="finish-roleplay-btn" class="exercise-button">${buttonText}</button>
        </div>
    `;
    // refreshLatinization will be called by patchExerciseWithExtraButtons

    const exerciseContainer = resultArea.querySelector('.speaking-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintRolePlayGeneric || 'Organize your thoughts before speaking. Use varied vocabulary and try to speak fluently.'}`;
            exerciseContainer.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') { window.refreshLatinization(); }
        };
    }

    document.getElementById('finish-roleplay-btn').addEventListener('click', () => {
        console.log("Role-play practice conceptually finished.");
        if (window.speakingPracticeTimer) {
            clearTimeout(window.speakingPracticeTimer);
        }
        window.speakingPracticeTimer = setTimeout(() => {
            startRandomSpeakingPractice();
        }, 1500);
    });
}

async function practiceAllSpeaking() {
    await startRandomSpeakingPractice(); // This will call a specific exercise function which then calls refresh.
}

async function startRandomSpeakingPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
    if (typeof cancelAutoAdvanceTimer === 'function') { 
        cancelAutoAdvanceTimer();
    }

    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = ''; // Clear previous content

    const exercises = [
        showQuestionPractice,
        showMonologuePractice,
        showRolePlayPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    await randomExerciseFunction(); // The individual functions are patched or call refresh internally.
}

function initSpeakingPractice() {
    const speakingButton = document.getElementById('speaking-practice-btn'); 
    if (speakingButton) {
        speakingButton.addEventListener('click', () => {
            startRandomSpeakingPractice();
        });
    }
}

showQuestionPractice = patchExerciseWithExtraButtons(showQuestionPractice, '.speaking-exercise-container', startRandomSpeakingPractice, { noCheck: true, noReveal: true, newExercise: { fn: window.startRandomSpeakingPractice, textKey: 'newExercise' } });
showMonologuePractice = patchExerciseWithExtraButtons(showMonologuePractice, '.speaking-exercise-container', startRandomSpeakingPractice, { noCheck: true, noReveal: true, newExercise: { fn: window.startRandomSpeakingPractice, textKey: 'newExercise' } });
showRolePlayPractice = patchExerciseWithExtraButtons(showRolePlayPractice, '.speaking-exercise-container', startRandomSpeakingPractice, { noCheck: true, noReveal: true, newExercise: { fn: window.startRandomSpeakingPractice, textKey: 'newExercise' } });

window.showQuestionPractice = showQuestionPractice;
window.showMonologuePractice = showMonologuePractice;
window.showRolePlayPractice = showRolePlayPractice;
window.startRandomSpeakingPractice = startRandomSpeakingPractice;
window.initSpeakingPractice = initSpeakingPractice;

// Note:DOMContentLoaded listener was removed as init functions are called directly by event-listeners-setup.js or similar.
// If this file is loaded standalone and needs to self-initialize, uncomment:
// document.addEventListener('DOMContentLoaded', initSpeakingPractice);
