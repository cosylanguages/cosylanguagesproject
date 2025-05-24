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

// Function to speak text with selected voice and language
function speakText(text, language) {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const voiceSettings = voiceLanguageMap[language] || voiceLanguageMap.COSYenglish;
  const voice = getBestVoice(voiceSettings.lang, voiceSettings.voiceURI);
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
  }

  window.speechSynthesis.speak(utterance);
}

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

// Practice handlers
function handleRandomWord(language, days, container) {
  let combinedWords = [];
  for (const d of days) {
    if (vocabData[language][d]) combinedWords = combinedWords.concat(vocabData[language][d]);
  }
  if (combinedWords.length === 0) {
    container.textContent = "No words found for this selection.";
    return;
  }
  const word = randomElement(combinedWords);
  container.textContent = word;
  speakText(word, language);
}

function handleRandomGrammar(language, days, container) {
  let combinedGrammar = [];
  for (const d of days) {
    if (grammarData[language][d]) {
      if (d === 3) {
        const optionsDiv = document.createElement("div");
        optionsDiv.className = "grammar-options";
        
        const questions = questionTranslations[language] || questionTranslations.COSYenglish;
        optionsDiv.innerHTML = `<p>${questions.choose}</p>`;
        
        const options = grammarOptionsText[language] || grammarOptionsText.COSYenglish;
        
        const toHaveOption = document.createElement("div");
        toHaveOption.className = "grammar-option";
        toHaveOption.textContent = options.to_have;
        toHaveOption.addEventListener("click", () => {
          const grammar = randomElement(grammarData[language][d].to_have);
          container.innerHTML = "";
          container.appendChild(document.createTextNode(grammar));
          speakText(grammar, language);
        });
        
        const possessivesOption = document.createElement("div");
        possessivesOption.className = "grammar-option";
        possessivesOption.textContent = options.possessives;
        possessivesOption.addEventListener("click", () => {
          const grammar = randomElement(grammarData[language][d].possessives);
          container.innerHTML = "";
          container.appendChild(document.createTextNode(grammar));
          speakText(grammar, language);
        });
        
        optionsDiv.appendChild(toHaveOption);
        optionsDiv.appendChild(possessivesOption);
        container.appendChild(optionsDiv);
        return;
      } else {
        combinedGrammar = combinedGrammar.concat(grammarData[language][d]);
      }
    }
  }
  
  if (combinedGrammar.length === 0) {
    container.textContent = "No grammar data found for this selection.";
    return;
  }
  
  const grammar = randomElement(combinedGrammar);
  container.textContent = grammar;
  speakText(grammar, language);
}

function handleRandomSpeaking(language, days, container) {
  let combinedSpeaking = [];
  for (const d of days) {
    if (speakingData[language][d]) combinedSpeaking = combinedSpeaking.concat(speakingData[language][d]);
  }
  if (combinedSpeaking.length === 0) {
    container.textContent = "No speaking data found for this selection.";
    return;
  }
  const phrase = randomElement(combinedSpeaking);
  container.textContent = phrase;
  speakText(phrase, language);
}

function handleRandomImage(language, days, container) {
  let combinedImages = [];
  for (const d of days) {
    if (imageData.allLanguages[d]) {
      combinedImages = combinedImages.concat(imageData.allLanguages[d]);
    }
  }
  if (combinedImages.length === 0) {
    container.textContent = "No images found for this selection.";
    return;
  }
  const imgObj = randomElement(combinedImages);
  
  const containerDiv = document.createElement("div");
  containerDiv.className = "image-container";
  
  const questions = questionTranslations[language] || questionTranslations.COSYenglish;
  
  const questionDiv = document.createElement("div");
  questionDiv.className = "image-question";
  
  if (days.includes(1)) {
    questionDiv.textContent = questions.what;
  } else {
    questionDiv.innerHTML = `${questions.who}<br>${questions.what}`;
  }
  
  const imgElem = document.createElement("img");
  imgElem.src = imgObj.src;
  imgElem.className = "vocab-image";
  
  const altText = imgObj.translations?.[language] || imgObj.alt || "Image";
  imgElem.alt = altText;
  
  const caption = document.createElement("div");
  caption.className = "image-caption";
  caption.textContent = altText;
  
  imgElem.addEventListener("click", () => {
    caption.style.display = caption.style.display === "none" ? "block" : "none";
  });
  
  caption.style.display = "none";
  
  containerDiv.appendChild(questionDiv);
  containerDiv.appendChild(imgElem);
  containerDiv.appendChild(caption);
  
  container.appendChild(containerDiv);
}
