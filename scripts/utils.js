// Utility functions for COSYlanguages

// Validate range input: dayFrom <= dayTo
function validDayRange(from, to) {
  if (!from || !to) return false;
  return Number(from) <= Number(to);
}

// Function to get random element from array
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to get the best available voice
function getBestVoice(languageCode, voiceURI) {
  const voices = window.speechSynthesis.getVoices();
  
  if (voiceURI) {
    const exactVoice = voices.find(v => v.voiceURI === voiceURI);
    if (exactVoice) return exactVoice;
  }
  
  const langVoices = voices.filter(v => v.lang === languageCode);
  if (langVoices.length > 0) {
    const localServiceVoice = langVoices.find(v => v.localService);
    if (localServiceVoice) return localServiceVoice;
    return langVoices[0];
  }
  
  return voices[0] || null;
}

// Utility: unlock speech synthesis on first user gesture (for iOS/Android)
function unlockSpeechSynthesis() {
  if (typeof window !== 'undefined' && window.speechSynthesis && !window.__speechUnlocked) {
    try {
      const silent = new window.SpeechSynthesisUtterance('');
      silent.volume = 0;
      window.speechSynthesis.speak(silent);
      window.__speechUnlocked = true;
    } catch (e) {}
  }
}
// Make available globally
if (typeof window !== 'undefined') window.unlockSpeechSynthesis = unlockSpeechSynthesis;

function getGrammarItems(grammarData, language, days, type) {
  let combinedGrammar = [];
  for (const d of days) {
    if (grammarData[language][d]) {
      if (d === 3) {
        // Special handling for day 3 (to have / possessives)
        combinedGrammar.push({ type: 'to_have', items: grammarData[language][d].to_have });
        combinedGrammar.push({ type: 'possessives', items: grammarData[language][d].possessives });
      } else {
        combinedGrammar = combinedGrammar.concat(grammarData[language][d]);
      }
    }
  }
  
  if (type) {
    combinedGrammar = combinedGrammar.find(g => g.type === type);
    return combinedGrammar ? combinedGrammar.items : [];
  }
  
  return combinedGrammar;
}

// Add utility/helper functions from app.js if missing:
// - randomElement
// - getSimilarityScore
// - speakText
// - unlockSpeechSynthesis
// - adventureCorrectAnswer
// - adventureWrongAnswer
// - ensureInputFocusable
// - patchPracticeInputs

// Export these functions for use in app.js
