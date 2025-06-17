// Speaking Exercises
let speakingPracticeTimer = null; // Timer for auto-progression

async function showQuestionPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
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
         // Reset record button text if it was changed
        const recordButton = document.getElementById('speaking-record-btn');
        if (recordButton && recordButton.classList.contains('recording')) {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
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
        
        if (typeof recognition !== 'undefined' && recognition.recognizing) {
            recognition.stop(); 
            return;
        }
        
        const langCode = mapLanguageToSpeechCode(language);

        const onStartCallback = () => {
            recordButton.classList.add('recording');
            recordButton.textContent = currentTranslations.recordingInProgress || 'Recording...';
            feedbackDiv.textContent = ''; 
        };

        const onResultCallback = (transcript) => {
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
             // Auto-progress even on error to prevent getting stuck
            if (window.speakingPracticeTimer) { clearTimeout(window.speakingPracticeTimer); }
            window.speakingPracticeTimer = setTimeout(() => { startRandomSpeakingPractice(); }, 3000);
        };

        const onEndCallback = () => {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
            if (feedbackDiv.textContent === (currentTranslations.feedbackListening || 'Listening...')) {
                 feedbackDiv.textContent = ''; 
            }
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
        if (!transcript || !transcript.trim()) {
            feedbackMsg = currentTranslations.noSpeechDetected || 'No speech detected. Please try again.';
            if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardIncorrectAnswer) {
                CosyAppInteractive.awardIncorrectAnswer();
            }
        } else {
            const questionWords = question.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
            const transcriptWords = transcript.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
            
            let commonWordCount = 0;
            if (questionWords.length > 0) {
                commonWordCount = transcriptWords.filter(tWord => questionWords.some(qWord => qWord === tWord || tWord.includes(qWord) || qWord.includes(tWord))).length;
            }

            if (commonWordCount > 0 || transcriptWords.length > 2) { 
                feedbackMsg = currentTranslations.goodAnswerSpeaking || 'Good! Your answer seems relevant.';
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardCorrectAnswer) {
                    CosyAppInteractive.awardCorrectAnswer();
                    CosyAppInteractive.scheduleReview(language, 'speaking-phrase', question, true);
                }
            } else if (transcriptWords.length > 0) {
                 feedbackMsg = currentTranslations.tryAgainSpeakingShort || "Try to give a more detailed answer.";
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardIncorrectAnswer) {
                    CosyAppInteractive.awardIncorrectAnswer();
                }
            } else {
                feedbackMsg = currentTranslations.tryAgainSpeaking || "Try to address the question more directly.";
                if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.awardIncorrectAnswer) {
                    CosyAppInteractive.awardIncorrectAnswer();
                }
            }
        }
        feedbackDiv.innerHTML = feedbackMsg; 

        // Auto-progression
        if (window.speakingPracticeTimer) {
            clearTimeout(window.speakingPracticeTimer);
        }
        window.speakingPracticeTimer = setTimeout(() => {
            startRandomSpeakingPractice();
        }, 3000); // 3-second delay
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
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    const buttonText = currentTranslations.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>${currentTranslations.monologuePracticeTitle || 'Monologue Practice'}</h3>
            <p>${currentTranslations.exerciseNotImplementedMonologue || 'This monologue exercise is not yet implemented.'}</p>
            <p>${currentTranslations.imagineMonologueHere || 'Imagine you record a monologue here and then click continue.'}</p>
            <button id="finish-monologue-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;

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
    const currentTranslations = translations[language] || translations.COSYenglish;
    const buttonText = currentTranslations.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>${currentTranslations.rolePlayPracticeTitle || 'Role-Play Practice'}</h3>
            <p>${currentTranslations.exerciseNotImplementedRolePlay || 'This role-play exercise is not yet implemented.'}</p>
            <p>${currentTranslations.imagineRolePlayHere || 'Imagine you participate in a role-play here and then click continue.'}</p>
            <button id="finish-roleplay-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;

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
    // This function can simply start the random practice.
    // The progression will be handled by individual exercises.
    await startRandomSpeakingPractice();
}

async function startRandomSpeakingPractice() {
    if (window.speakingPracticeTimer) {
        clearTimeout(window.speakingPracticeTimer);
    }
    if (typeof cancelAutoAdvanceTimer === 'function') { 
        cancelAutoAdvanceTimer();
    }

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


showQuestionPractice = patchExerciseForRandomizeButton(showQuestionPractice, '.speaking-exercise-container', startRandomSpeakingPractice);
showMonologuePractice = patchExerciseForRandomizeButton(showMonologuePractice, '.speaking-exercise-container', startRandomSpeakingPractice);
showRolePlayPractice = patchExerciseForRandomizeButton(showRolePlayPractice, '.speaking-exercise-container', startRandomSpeakingPractice);

window.showQuestionPractice = showQuestionPractice;
window.showMonologuePractice = showMonologuePractice;
window.showRolePlayPractice = showRolePlayPractice;
window.startRandomSpeakingPractice = startRandomSpeakingPractice;
window.initSpeakingPractice = initSpeakingPractice;

// document.addEventListener('DOMContentLoaded', initSpeakingPractice); // Assuming called from main script.


