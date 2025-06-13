// Speaking Exercises

// Helper to map COSYlanguage to speech recognition lang codes
function mapLanguageToSpeechCode(lang) {
    switch(lang) {
        case 'COSYenglish': return 'en-US'; // Or en-GB based on preference/availability
        case 'COSYfrançais': return 'fr-FR';
        case 'COSYespañol': return 'es-ES';
        case 'COSYitaliano': return 'it-IT';
        case 'COSYdeutsch': return 'de-DE';
        case 'COSYportuguês': return 'pt-PT';
        case 'ΚΟΖΥελληνικά': return 'el-GR';
        case 'ТАКОЙрусский': return 'ru-RU';
        case 'COSYbrezhoneg': return 'fr-FR'; // Breton uses French as a fallback
        case 'ԾՈՍՅհայկական': return 'hy-AM';
        case 'COSYtatarça': return 'ru-RU'; // Tatar uses Russian as a fallback
        case 'COSYbashkort': return 'ru-RU'; // Bashkir uses Russian as a fallback
        default: return 'en-US'; // Default
    }
}

// Placeholder functions for specific speaking exercises
async function showDailySpeaking() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>${currentTranslations.dailySpeaking || 'Daily Speaking'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showQuestionPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;

    if (!language) {
        resultArea.innerHTML = `<p>${currentTranslations.selectLanguage || 'Please select a language first.'}</p>`;
        return;
    }

    // Get day - assuming getSelectedDays() is global
    const days = getSelectedDays(); // This function is in index.html's script tag
    if (!days || days.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.selectDay || 'Please select a day or a range of days first.'}</p>`;
        return;
    }
    const day = days[0]; // Use the first day in the range

    const questions = await loadSpeakingQuestions(language, day); // From utils.js

    if (!questions || questions.length === 0) {
        resultArea.innerHTML = `<p>${currentTranslations.noQuestionsAvailable || 'No questions available for this selection.'}</p>`;
        return;
    }

    // Shuffle the questions array in place
    questions.sort(() => 0.5 - Math.random());

    let currentQuestionIndex = 0;
    let recognition; // Speech recognition instance

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
        const feedbackDiv = document.getElementById('speaking-feedback');

        if (!recordButton || !feedbackDiv) return;

        if (recognition && recordButton.classList.contains('recording')) { // Stop recording
            try {
                recognition.stop();
            } catch (e) {
                console.warn("Recognition stop error:", e.message);
            }
            // UI update will be handled in onend
            return;
        }
        
        recordButton.classList.add('recording');
        recordButton.textContent = currentTranslations.recordingInProgress || 'Recording...';
        feedbackDiv.textContent = ''; // Clear previous feedback

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            feedbackDiv.textContent = currentTranslations.speechRecognitionNotSupported || 'Speech recognition is not supported in this browser.';
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
            return;
        }

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognitionAPI();
        recognition.lang = mapLanguageToSpeechCode(language);
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            feedbackDiv.textContent = currentTranslations.feedbackListening || 'Listening...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const transcriptDiv = document.getElementById('speaking-transcript');
            if (transcriptDiv) {
                transcriptDiv.textContent = `${currentTranslations.youSaid || 'You said'}: ${transcript}`;
            }
            checkSpeakingAnswer(questionText, transcript);
        };

        recognition.onerror = (event) => {
            let errorMsg = `${currentTranslations.error || 'Error'}: ${event.error}`; // This generic 'error' key was added
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                 errorMsg += ` - ${currentTranslations.micPermissionDenied || 'Microphone permission denied. Please allow microphone access in your browser settings.'}`;
            } else if (event.error === 'no-speech') {
                errorMsg += ` - ${currentTranslations.noSpeechDetected || 'No speech detected. Please try again.'}`;
            }
            feedbackDiv.textContent = errorMsg;
        };

        recognition.onend = () => {
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
            // Clear "Listening..." if it was the last message and no result/error changed it
            if (feedbackDiv.textContent === (currentTranslations.feedbackListening || 'Listening...')) {
                 feedbackDiv.textContent = ''; 
            }
        };
        
        try {
            recognition.start();
        } catch (e) {
            feedbackDiv.textContent = `${currentTranslations.errorStartingRecognition || 'Error starting recognition'}: ${e.message}`;
            recordButton.classList.remove('recording');
            recordButton.textContent = '🎤';
        }
    }
    
    function checkSpeakingAnswer(question, transcript) {
        const feedbackDiv = document.getElementById('speaking-feedback');
        if (!feedbackDiv) return;

        let feedbackMsg = '';
        if (!transcript || !transcript.trim()) {
            // This case should ideally be caught by 'no-speech' error, but as a fallback:
            feedbackMsg = currentTranslations.noSpeechDetected || 'No speech detected. Please try again.';
        } else {
            const questionWords = question.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
            const transcriptWords = transcript.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
            
            let commonWordCount = 0;
            if (questionWords.length > 0) {
                // Count words from transcript that are present in the question words
                commonWordCount = transcriptWords.filter(tWord => questionWords.some(qWord => qWord === tWord || tWord.includes(qWord) || qWord.includes(tWord))).length;
            }


            if (commonWordCount > 0 || transcriptWords.length > 2) { // Be a bit lenient if question is very short
                feedbackMsg = currentTranslations.goodAnswerSpeaking || 'Good! Your answer seems relevant.';
                 if (typeof CosyAppInteractive !== 'undefined' && CosyAppInteractive.addXP) {
                    CosyAppInteractive.addXP(3); // Award XP for speaking
                }
            } else if (transcriptWords.length > 0) {
                 feedbackMsg = currentTranslations.tryAgainSpeakingShort || "Try to give a more detailed answer.";
            }
             else {
                feedbackMsg = currentTranslations.tryAgainSpeaking || "Try to address the question more directly.";
            }
        }
        feedbackDiv.textContent = feedbackMsg;
    }

    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>${currentTranslations.speakingQuestionTitle || 'Question Practice'}</h3>
            <div id="speaking-question-text" class="exercise-question" style="font-size: 1.2em; margin-bottom: 20px; min-height: 40px;"></div>
            <div class="navigation-buttons" style="margin-bottom: 20px;">
                <button id="prev-speaking-question-btn" class="btn-secondary btn-small">&lt; ${currentTranslations.buttons.previous || 'Previous'}</button>
                <button id="next-speaking-question-btn" class="btn-secondary btn-small">${currentTranslations.buttons.next || 'Next'} &gt;</button>
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

    displayCurrentQuestion(); // Display the first question
}


async function showMonologuePractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>${currentTranslations.monologue || 'Monologue'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showRolePlayPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="speaking-exercise-container">
            <h3>${currentTranslations.rolePlay || 'Role Play'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function practiceAllSpeaking() {
    // This could be a simple alias to startRandomSpeakingPractice or a more complex sequence
    await startRandomSpeakingPractice();
}

// Main function to start a random speaking exercise (can be called by Practice All or Randomize button)
async function startRandomSpeakingPractice() {
    // For now, let's assume Question Practice is the primary one to randomize into if available
    // Or select from a list of implemented ones
    const implementedExercises = [showQuestionPractice]; // Add others as they get implemented
    
    // For now, let's always pick showQuestionPractice if it's in the list
    // In the future, this could be random:
    // const randomExerciseFunction = implementedExercises[Math.floor(Math.random() * implementedExercises.length)];
    // await randomExerciseFunction();

    await showQuestionPractice(); // Directly call the main implemented function
}

// Patch the exercise functions to add the randomize button
// The randomize button will call startRandomSpeakingPractice, which now defaults to showQuestionPractice
showDailySpeaking = patchExerciseForRandomizeButton(showDailySpeaking, '.speaking-exercise-container', startRandomSpeakingPractice);
showQuestionPractice = patchExerciseForRandomizeButton(showQuestionPractice, '.speaking-exercise-container', startRandomSpeakingPractice);
showMonologuePractice = patchExerciseForRandomizeButton(showMonologuePractice, '.speaking-exercise-container', startRandomSpeakingPractice);
showRolePlayPractice = patchExerciseForRandomizeButton(showRolePlayPractice, '.speaking-exercise-container', startRandomSpeakingPractice);
// practiceAllSpeaking is not a display function itself but calls startRandomSpeakingPractice, so it doesn't need patching.

// Ensure the main button for "Question" in speaking options calls showQuestionPractice
// This is typically handled in buttons.js or index.html event setup.
// Example: document.getElementById('question-practice-btn').addEventListener('click', showQuestionPractice);
// This file should only define the functions, not attach to main menu buttons.
// Attachment is done in buttons.js or similar.
