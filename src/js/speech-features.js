// Speech-related functions

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

// Global recognition variable for speech recognition
let recognition;

/**
 * Unlocks audio playback by playing a silent sound.
 * This is often required due to browser restrictions on audio playback without user interaction.
 */
(function unlockAudio() {
  const sound = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
  sound.play().catch(e => console.error("Error unlocking audio:", e));
})();

/**
 * Pronounces a word using the Web Speech API.
 * @param {string} word The word to pronounce.
 * @param {string} language The language of the word.
 */
function pronounceWord(word, language) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Sorry, your browser does not support text to speech!');
  }
}

/**
 * Starts a pronunciation check using the Web Speech API.
 * @param {string} targetWord The word to be pronounced by the user.
 * @param {string} language The language of the word.
 * @param {string} transcriptDivId The ID of the div to display the transcript.
 * @param {string} feedbackDivId The ID of the div to display feedback.
 * @param {function} [onStartCallback] Optional callback when recognition starts.
 * @param {function} [onResultCallback] Optional callback for processing results. Args: transcript (string).
 * @param {function} [onErrorCallback] Optional callback on error. Args: event (object).
 * @param {function} [onEndCallback] Optional callback when recognition ends.
 */
function startPronunciationCheck(
    targetWord,
    language,
    transcriptDivId,
    feedbackDivId,
    onStartCallback,
    onResultCallback,
    onErrorCallback,
    onEndCallback
) {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    if (recognition && recognition.recognizing) {
      recognition.stop(); // Stop any ongoing recognition
    }
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language; // language should be a speech code like 'en-US'
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.recognizing = false; // Custom flag to track state

    const feedbackEl = document.getElementById(feedbackDivId);
    const transcriptEl = document.getElementById(transcriptDivId);

    if (!feedbackEl) {
      console.error("Feedback element not found:", feedbackDivId);
      // Call error callback if provided, even for setup errors
      if (onErrorCallback) onErrorCallback({ error: "feedback-element-not-found" });
      return;
    }

    recognition.onstart = () => {
      recognition.recognizing = true;
      if (feedbackEl) feedbackEl.textContent = 'Listening...'; // Default behavior (add translations)
      if (onStartCallback) onStartCallback();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcriptEl) transcriptEl.textContent = `You said: "${transcript}"`; // Default behavior (add translations)

      if (onResultCallback) {
        onResultCallback(transcript); // Caller handles custom logic
      } else {
        // Default comparison logic if no callback is provided
        const processedSpokenWord = typeof removeAccents === 'function' ? removeAccents(transcript.toLowerCase()) : transcript.toLowerCase();
        const processedTargetWord = typeof removeAccents === 'function' ? removeAccents(targetWord.toLowerCase()) : targetWord.toLowerCase();
        if (processedSpokenWord === processedTargetWord) {
          if (feedbackEl) {
            feedbackEl.textContent = `Correct! You said: "${transcript}"`; // (add translations)
            feedbackEl.style.color = 'green';
          }
        } else {
          if (feedbackEl) {
            feedbackEl.textContent = `Incorrect. You said: "${transcript}". Expected: "${targetWord}"`; // (add translations)
            feedbackEl.style.color = 'red';
          }
        }
      }
    };

    recognition.onerror = (event) => {
      recognition.recognizing = false; // Ensure state is reset
      let defaultErrorMsg = 'Error occurred in recognition: ' + event.error;
      if (event.error === 'no-speech') {
        defaultErrorMsg = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        defaultErrorMsg = 'Audio capture problem. Is your microphone working?';
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        defaultErrorMsg = 'Microphone access denied. Please allow microphone access.';
      }
      if (feedbackEl) feedbackEl.textContent = defaultErrorMsg; // (add translations)
      
      if (onErrorCallback) onErrorCallback(event);
    };

    recognition.onend = () => {
      recognition.recognizing = false;
      // Default: Clear listening message if it's still there and no error/result changed it.
      // if (feedbackEl && feedbackEl.textContent === 'Listening...') {
      //   feedbackEl.textContent = '';
      // }
      if (onEndCallback) onEndCallback();
    };

    try {
      recognition.start();
    } catch (e) {
      recognition.recognizing = false;
      if (feedbackEl) feedbackEl.textContent = 'Error starting recognition: ' + e.message; // (add translations)
      if (onErrorCallback) onErrorCallback({ error: "start-failed", message: e.message });
    }
  } else {
    const mainFeedbackEl = document.getElementById(feedbackDivId);
    if (mainFeedbackEl) {
      mainFeedbackEl.textContent = 'Sorry, your browser does not support speech recognition!'; // (add translations)
    } else {
      alert('Sorry, your browser does not support speech recognition!');
    }
    if (onErrorCallback) onErrorCallback({ error: "no-speech-recognition-support" });
  }
}
