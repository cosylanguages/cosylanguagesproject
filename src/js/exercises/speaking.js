// Speaking Exercises

// Placeholder functions for specific speaking exercises
async function showQuestionPractice() {
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

    const questions = await loadSpeakingQuestions(language, day); 

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }

    questions.sort(() => 0.5 - Math.random());
    let currentQuestionIndex = 0;
    // Local 'recognition' instance is removed. We will use the global 'recognition' from speech-features.js

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
    }

    function handleSpeakingRecording() {
        const questionText = questions[currentQuestionIndex];
        const recordButton = document.getElementById('speaking-record-btn');
        const feedbackDiv = document.getElementById('speaking-feedback'); // For specific messages
        const transcriptDiv = document.getElementById('speaking-transcript'); // For transcript

        if (!recordButton || !feedbackDiv || !transcriptDiv) {
            console.error("Required UI elements for recording are missing.");
            return;
        }
        
        // Use the global 'recognition' object and its 'recognizing' flag
        if (typeof recognition !== 'undefined' && recognition.recognizing) {
            recognition.stop(); 
            // Button state will be handled by onEndCallback
            return;
        }
        
        // Ensure `translations` and `language` are available in this scope for callbacks
        const langCode = mapLanguageToSpeechCode(language);

        const onStartCallback = () => {
            recordButton.classList.add('recording');
            recordButton.textContent = currentTranslations.recordingInProgress || 'Recording...';
            feedbackDiv.textContent = ''; // Clear previous specific feedback
            // Global startPronunciationCheck will set its own "Listening..."
        };

        const onResultCallback = (transcript) => {
            // Global startPronunciationCheck updates transcriptDiv by default.
            // We just need to call our domain-specific checker.
            checkSpeakingAnswer(questionText, transcript);
        };

        const onErrorCallback = (event) => {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';

            let errorMsg = currentTranslations.error || 'Error';
            if (event.error === 'no-speech') {
                errorMsg = currentTranslations.noSpeechDetected || 'No speech detected. Please try again.';
            } else if (event.error === 'audio-capture') {
                errorMsg = currentTranslations.micProblem || 'Audio capture problem. Is your microphone working?';
            } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMsg = currentTranslations.micPermissionDenied || 'Microphone permission denied. Please allow microphone access.';
            } else if (event.error === 'network') {
                errorMsg = currentTranslations.networkError || 'Network error during speech recognition.';
            } else if (event.error === 'aborted') {
                errorMsg = currentTranslations.recognitionAborted || 'Speech recognition aborted.';
            } else {
                errorMsg = `${currentTranslations.errorInRecognition || 'Error in recognition'}: ${event.error}`;
            }
            feedbackDiv.textContent = errorMsg;
        };

        const onEndCallback = () => {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
            // Clear "Listening..." if it was the last message from global and no result/error changed it
            if (feedbackDiv.textContent === (currentTranslations.feedbackListening || 'Listening...')) {
                 feedbackDiv.textContent = ''; 
            }
        };

        // Call the global function from speech-features.js
        // It will handle its own 'recognition' instance.
        startPronunciationCheck(
            questionText,       // targetWord for comparison (can be null if only transcript is needed)
            langCode,           // language code like 'en-US'
            'speaking-transcript', // ID for transcript display
            'speaking-feedback',   // ID for feedback display
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
        if (!transcript || !transcript.trim()) {
            feedbackMsg = currentTranslations.noSpeechDetected || 'No speech detected. Please try again.';
        } else {
            const questionWords = question.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
            const transcriptWords = transcript.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
            
            let commonWordCount = 0;
            if (questionWords.length > 0) {
                commonWordCount = transcriptWords.filter(tWord => questionWords.some(qWord => qWord === tWord || tWord.includes(qWord) || qWord.includes(tWord))).length;
            }

            if (commonWordCount > 0 || transcriptWords.length > 2) { 
                feedbackMsg = currentTranslations.goodAnswerSpeaking || 'Good! Your answer seems relevant.';
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.addXP) {
                    CosyAppInteractive.addXP(3); 
                }
            } else if (transcriptWords.length > 0) {
                 feedbackMsg = currentTranslations.tryAgainSpeakingShort || "Try to give a more detailed answer.";
            } else {
                feedbackMsg = currentTranslations.tryAgainSpeaking || "Try to address the question more directly.";
            }
        }
        // This function now directly sets the feedback, which is fine as it's called by onResultCallback
        feedbackDiv.innerHTML = feedbackMsg; 
    }

    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>🗣️ ${currentTranslations.speakingQuestionTitle || 'Question Practice'}</h3>
            <div id="speaking-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 20px; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 20px;">
                <button id="prev-speaking-question-btn" class="btn-secondary btn-small">&lt; ${currentTranslations.buttons?.previous || 'Previous'}</button>
                <button id="next-speaking-question-btn" class="btn-secondary btn-small">${currentTranslations.buttons?.next || 'Next'} &gt;</button>
            </div>
            <button id="speaking-record-btn" class="btn-primary btn-emoji" style="font-size: 2.5em; padding: 10px 20px; margin-bottom:15px; line-height: 1;">🎤</button>
            <div id="speaking-transcript" class="transcript-area" style="margin-top: 10px; min-height: 25px; padding: 5px; border: 1px solid #eee; border-radius: 4px;"></div>
            <div id="speaking-feedback" class="feedback-area" style="margin-top: 10px; min-height: 25px; padding: 5px;"></div>
        </div>
    `;

    document.getElementById('prev-speaking-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayCurrentQuestion();
        }
    });

    document.getElementById('next-speaking-question-btn').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayCurrentQuestion();
        }
    });

    document.getElementById('speaking-record-btn').addEventListener('click', handleSpeakingRecording);

    displayCurrentQuestion(); 
}


async function showMonologuePractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showRolePlayPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function practiceAllSpeaking() {
    await startRandomSpeakingPractice();
}

async function startRandomSpeakingPractice() {
    const implementedExercises = [showQuestionPractice]; 
    await showQuestionPractice(); 
}

showQuestionPractice = patchExerciseForRandomizeButton(showQuestionPractice, '.speaking-exercise-container', startRandomSpeakingPractice);
showMonologuePractice = patchExerciseForRandomizeButton(showMonologuePractice, '.speaking-exercise-container', startRandomSpeakingPractice);
showRolePlayPractice = patchExerciseForRandomizeButton(showRolePlayPractice, '.speaking-exercise-container', startRandomSpeakingPractice);

// Translations object needs to be globally available or passed around.
// For now, assuming `translations` is global as it was in index.html
// and `getSelectedDays`, `loadSpeakingQuestions` are also available globally.
// `patchExerciseForRandomizeButton` is assumed to be global from another utils file.
