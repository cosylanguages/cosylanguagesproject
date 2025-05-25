// Main app logic for COSYlanguages
// All DOM event handlers and UI logic are here

document.addEventListener('DOMContentLoaded', function() {
  // Get all DOM elements
  const languageSelect = document.getElementById('language-select');
  const daySelect = document.getElementById('day-select');
  const practiceTypeSelect = document.getElementById('practice-type-select');
  const vocabSubmenu = document.getElementById('vocabulary-submenu');
  const grammarSubmenu = document.getElementById('grammar-submenu');
  const showButton = document.getElementById('show-button');
  const resultContainer = document.getElementById('result-container');

  function hideAllSubmenus() {
    vocabSubmenu.classList.remove('active');
    grammarSubmenu.classList.remove('active');
  }

  languageSelect.addEventListener('change', function() {
    // Remove any previous flag class
    document.body.className = document.body.className.replace(/\bflag-[^ ]+/g, '').trim();
    const lang = languageSelect.value;
    if (lang) {
      document.body.classList.add('flag-' + lang);
    }
  });

  // Practice type change handler
  practiceTypeSelect.addEventListener('change', function() {
    vocabSubmenu.style.display = 'none';
    grammarSubmenu.style.display = 'none';
    if (practiceTypeSelect.value === 'vocabulary_practice') {
      vocabSubmenu.style.display = 'flex';
      // Auto-select first submenu button for vocabulary
      const firstBtn = vocabSubmenu.querySelector('.submenu-btn');
      if (firstBtn) {
        vocabSubmenu.querySelectorAll('.submenu-btn').forEach(btn => btn.classList.remove('active'));
        firstBtn.classList.add('active');
      }
    } else if (practiceTypeSelect.value === 'grammar_practice') {
      grammarSubmenu.style.display = 'flex';
      // Auto-select first submenu button for grammar
      const firstBtn = grammarSubmenu.querySelector('.submenu-btn');
      if (firstBtn) {
        grammarSubmenu.querySelectorAll('.submenu-btn').forEach(btn => btn.classList.remove('active'));
        firstBtn.classList.add('active');
      }
    }
    // No submenu for speaking_practice
  });

  // On page load, hide all submenus
  hideAllSubmenus();

  // Language change handler
  languageSelect.addEventListener('change', function() {
    if (practiceTypeSelect.value === 'grammar_practice') {
      updateGenderButtonVisibility();
    }
  });

  function updateGenderButtonVisibility() {
    const genderBtn = document.querySelector('[data-practice="gender"]');
    if (languageSelect.value === 'COSYenglish') {
      genderBtn.style.display = 'none';
    } else {
      genderBtn.style.display = 'block';
    }
    updateVerbButtonVisibility();
    updatePossessivesButtonVisibility();
  }

  function updateVerbButtonVisibility() {
    const verbBtn = document.querySelector('[data-practice="verb"]');
    const day = Number(document.getElementById('day-select').value);
    if (day >= 2) {
      verbBtn.style.display = 'block';
    } else {
      verbBtn.style.display = 'none';
    }
  }

  function updatePossessivesButtonVisibility() {
    const possessivesBtn = document.querySelector('[data-practice="possessives"]');
    const day = Number(document.getElementById('day-select').value);
    if (day === 3) {
      possessivesBtn.style.display = 'block';
    } else {
      possessivesBtn.style.display = 'none';
    }
  }

  // Update verb and possessives buttons when day changes and on page load
  document.getElementById('day-select').addEventListener('change', function() {
    updateVerbButtonVisibility();
    updatePossessivesButtonVisibility();
  });
  updateVerbButtonVisibility();
  updatePossessivesButtonVisibility();

  // Submenu button click handler
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('submenu-btn')) {
      e.preventDefault();
      // Remove 'active' from all submenu buttons in the same submenu
      const parentMenu = e.target.parentElement;
      parentMenu.querySelectorAll('.submenu-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      const practiceType = e.target.getAttribute('data-practice');
      const language = languageSelect.value;
      const day = daySelect.value;
      const dayFrom = document.getElementById('day-from-select')?.value;
      const dayTo = document.getElementById('day-to-select')?.value;
      let days = [];
      if (dayFrom && dayTo) {
        const from = Number(dayFrom);
        const to = Number(dayTo);
        if (from > to) {
          alert('Day from should be less than or equal to Day to');
          return;
        }
        for (let d = from; d <= to; d++) days.push(d);
      } else if (day) {
        days = [Number(day)];
      } else {
        alert('Please select a day or a day range');
        return;
      }
      if (!language) {
        alert('Please select a language');
        return;
      }
      clearResultContainer();
      resultContainer.style.display = 'block';
      switch(practiceType) {
        case 'random_word':
          handleRandomWord(language, days);
          break;
        case 'random_image':
          handleRandomImage(language, days);
          break;
        case 'gender':
          if (language === 'COSYenglish') {
            showMessage('Gender practice is not available for English.');
          } else {
            showGrammarGenderPractice(language, days[0]);
          }
          break;
        case 'verb':
          showGrammarVerbPractice(language, days[0]);
          break;
        case 'possessives':
          showGrammarPossessivesPractice(language, days[0]);
          break;
      }
    }
  });

  // Main Show button click handler
  showButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const language = languageSelect.value;
    const day = daySelect.value;
    const dayFrom = document.getElementById('day-from-select')?.value;
    const dayTo = document.getElementById('day-to-select')?.value;
    const practiceType = practiceTypeSelect.value;

    // Defensive: always clear and show result container
    clearResultContainer();
    resultContainer.style.display = 'block';

    if (!language) {
      showMessage('Please select a language.');
      return;
    }
    // Require either a single day or a valid day range
    let days = [];
    if (dayFrom && dayTo) {
      const from = Number(dayFrom);
      const to = Number(dayTo);
      if (from > to) {
        showMessage('Day from should be less than or equal to Day to.');
        return;
      }
      for (let d = from; d <= to; d++) days.push(d);
    } else if (day) {
      days = [Number(day)];
    } else {
      showMessage('Please select a day or a day range.');
      return;
    }
    if (!practiceType) {
      showMessage('Please select a practice type.');
      return;
    }
    // Remove requirement for submenu button to be active
    if (practiceType === 'speaking_practice') {
      handleRandomSpeaking(language, days);
    } else if (practiceType === 'vocabulary_practice') {
      const activeBtn = document.querySelector('#vocabulary-submenu .submenu-btn.active');
      if (activeBtn) {
        if (activeBtn.getAttribute('data-practice') === 'random_word') {
          handleRandomWord(language, days);
        } else if (activeBtn.getAttribute('data-practice') === 'random_image') {
          handleRandomImage(language, days);
        }
      } else {
        handleRandomWord(language, days);
      }
    } else if (practiceType === 'grammar_practice') {
      const activeBtn = document.querySelector('#grammar-submenu .submenu-btn.active');
      if (!activeBtn) {
        showMessage('Please select a grammar practice type (e.g., Gender) before continuing.');
        return;
      }
      if (activeBtn.getAttribute('data-practice') === 'gender') {
        showGrammarGenderPractice(language, days[0]);
      } else if (activeBtn.getAttribute('data-practice') === 'verb') {
        showGrammarVerbPractice(language, days[0]);
      } else if (activeBtn.getAttribute('data-practice') === 'possessives') {
        showGrammarPossessivesPractice(language, days[0]);
      } else {
        showMessage('Selected grammar practice type is not supported.');
      }
    }
  });

  function clearResultContainer() {
    resultContainer.innerHTML = '';
  }

  // Practice handlers
  function handleRandomWord(language, days) {
    const words = getWordsForDays(vocabData, language, days);
    if (!words.length) return showMessage('No words found');
    resultContainer.innerHTML = '';
    const wordDiv = document.createElement('div');
    wordDiv.className = 'practice-word';
    wordDiv.textContent = randomElement(words);
    wordDiv.style.color = '#fff';
    wordDiv.style.textAlign = 'center';
    resultContainer.appendChild(wordDiv);
    speakText(wordDiv.textContent, language);
  }

  function handleRandomImage(language, days) {
    const images = getImagesForDays(imageData.allLanguages, days);
    if (!images.length) return showMessage('No images found');
    const imgObj = randomElement(images);
    showImagePractice(imgObj, language);
  }

  function showGrammarGenderPractice(language, day) {
    resultContainer.innerHTML = '';
    const words = genderPracticeData[language]?.[day] || [];
    if (!words.length) return showMessage('No gender practice available');
    const word = randomElement(words);
    const questionDiv = document.createElement('div');
    questionDiv.id = 'grammar-question';
    questionDiv.textContent = word.word;
    questionDiv.dataset.answer = word.article;
    questionDiv.style.textAlign = 'center';
    // Automatic pronunciation
    speakText(word.word, language);
    const optionsEl = document.createElement('div');
    optionsEl.id = 'grammar-options';
    optionsEl.className = 'grammar-gender-options';
    getArticlesForLanguage(language).forEach(article => {
      const option = document.createElement('div');
      option.className = 'gender-option';
      option.textContent = article;
      option.addEventListener('click', () => checkGenderAnswer(option, word.article));
      optionsEl.appendChild(option);
    });
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'grammar-feedback';
    questionDiv.onclick = function() {
      feedbackDiv.textContent = `Correct article: ${word.article}`;
    };
    feedbackDiv.textContent = '';
    resultContainer.append(questionDiv, optionsEl, feedbackDiv);
  }

  function showGrammarVerbPractice(language, day) {
    // Clear previous content
    clearResultContainer();
    const container = document.createElement('div');
    container.className = 'image-container'; // visually match image card

    const questionDiv = document.createElement('div');
    questionDiv.className = 'image-question';
    questionDiv.textContent = 'Verb Practice';

    // Get verb data
    const verbData = window.verbPracticeData?.[language]?.[day];
    if (!verbData || verbData.length === 0) {
      container.textContent = 'No verb practice for this language/day.';
      resultContainer.appendChild(container);
      return;
    }
    const item = randomElement(verbData);

    // Prompt
    const promptDiv = document.createElement('div');
    promptDiv.className = 'image-caption';
    promptDiv.style.fontSize = '1.3em';
    promptDiv.style.margin = '12px 0 8px 0';
    promptDiv.textContent = item.prompt;

    // Input row
    const inputCol = document.createElement('div');
    inputCol.className = 'image-input-col';
    inputCol.style.display = 'flex';
    inputCol.style.flexDirection = 'column';
    inputCol.style.alignItems = 'center';
    inputCol.style.justifyContent = 'center';
    inputCol.style.margin = '0 auto';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'practice-input';
    input.placeholder = 'Type your answer';
    input.style.marginBottom = '8px';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn check-emoji-btn';
    checkBtn.textContent = 'Check';

    const feedback = document.createElement('div');
    feedback.className = 'practice-feedback';
    feedback.style.minHeight = '1.5em';

    checkBtn.onclick = function() {
      const user = input.value.trim().toLowerCase();
      const correct = item.answer.toLowerCase();
      if (user === correct) {
        feedback.textContent = '✅ Correct!';
        feedback.style.color = '#0a7c0a';
      } else {
        feedback.textContent = `❌ ${item.prompt} → ${item.answer}`;
        feedback.style.color = '#b80000';
      }
    };

    // Pronounce button
    const pronounceBtn = document.createElement('button');
    pronounceBtn.className = 'btn pronounce-btn';
    pronounceBtn.innerHTML = '<span class="pronounce-icon">🔊</span>';
    pronounceBtn.title = 'Hear pronunciation';
    pronounceBtn.onclick = function() {
      speakText(item.prompt, language);
    };

    inputCol.appendChild(input);
    inputCol.appendChild(checkBtn);
    inputCol.appendChild(pronounceBtn);
    inputCol.appendChild(feedback);

    container.appendChild(questionDiv);
    container.appendChild(promptDiv);
    container.appendChild(inputCol);
    resultContainer.appendChild(container);
  }

  function showGrammarPossessivesPractice(language, day) {
    resultContainer.innerHTML = '';
    if (day !== 3) {
      showMessage('Possessives practice is only available on Day 3.');
      return;
    }
    // Prefer possessivesPracticeData if available, else fallback to grammarData
    let data = (typeof possessivesPracticeData !== 'undefined' && possessivesPracticeData[language]?.[3])
      ? possessivesPracticeData[language][3]
      : (grammarData[language]?.[3]?.possessives || []);
    if (!data || !data.length) return showMessage('No possessives practice available');
    let items = data;
    if (typeof data[0] === 'string') {
      items = data.map(str => ({ prompt: str, answer: str }));
    }
    const item = randomElement(items);
    const prompt = item.prompt || item;
    const answer = item.answer || item;
    const questionDiv = document.createElement('div');
    questionDiv.id = 'grammar-question';
    questionDiv.textContent = prompt;
    const optionsEl = document.createElement('div');
    optionsEl.id = 'grammar-options';
    optionsEl.className = 'grammar-gender-options';
    const showBtn = document.createElement('div');
    showBtn.className = 'gender-option';
    showBtn.textContent = 'Show Answer';
    showBtn.addEventListener('click', () => {
      showBtn.textContent = answer;
      showBtn.classList.add('show-answer');
      feedbackDiv.textContent = '✔';
      feedbackDiv.style.color = '#4CAF50';
    });
    optionsEl.appendChild(showBtn);
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'grammar-feedback';
    feedbackDiv.textContent = '';
    resultContainer.append(questionDiv, optionsEl, feedbackDiv);
  }

  function handleRandomSpeaking(language, days) {
    if (!window.speakingData) {
      showMessage('No speaking exercises found for this language. (speakingData missing)');
      return;
    }
    if (!window.speakingData[language]) {
      showMessage(`No speaking exercises found for this language: ${language}`);
      return;
    }
    // Defensive: flatten and filter phrases
    let phrases = [];
    days.forEach(day => {
      if (window.speakingData[language][day]) {
        phrases = phrases.concat(window.speakingData[language][day]);
      }
    });
    if (!phrases.length) {
      showMessage(`No speaking exercises found for language: ${language}, days: ${days.join(', ')}.\nCheck if data exists in scripts/data/speaking-data.js.`);
      return;
    }
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'block';
    // Pick a random phrase and show as task, with example below
    const phrase = randomElement(phrases);
    const taskDiv = document.createElement('div');
    taskDiv.className = 'speaking-task';
    taskDiv.textContent = phrase;
    taskDiv.style.color = '#222';
    taskDiv.style.background = 'rgba(255,255,255,0.85)';
    taskDiv.style.borderRadius = '10px';
    taskDiv.style.padding = '18px 12px 8px 12px';
    taskDiv.style.margin = '18px auto 0 auto';
    taskDiv.style.maxWidth = '90%';
    taskDiv.style.textAlign = 'center';
    taskDiv.style.fontWeight = 'bold';
    taskDiv.style.fontSize = '1.2rem';

    // Example line (in cursive, different color)
    const exampleDiv = document.createElement('div');
    exampleDiv.className = 'speaking-example';
    exampleDiv.textContent = '(Say your answer aloud)';
    exampleDiv.style.fontStyle = 'italic';
    exampleDiv.style.color = '#0abab5';
    exampleDiv.style.marginTop = '8px';
    exampleDiv.style.fontSize = '1.05rem';

    resultContainer.appendChild(taskDiv);
    resultContainer.appendChild(exampleDiv);
  }

  // Helper functions
  function getWordsForDays(data, language, days) {
    return days.flatMap(day => data[language]?.[day] || []);
  }

  function getImagesForDays(data, days) {
    return days.flatMap(day => data[day] || []);
  }

  function getSpeakingPhrases(data, language, days) {
    return days.flatMap(day => data[language]?.[day] || []);
  }

  function getArticlesForLanguage(language) {
    const articles = {
      'COSYfrançais': ['le', 'la', 'l', 'le/la'],
      'COSYdeutsch': ['der', 'die', 'das'],
      'COSYitaliano': ['il', 'la', 'l', 'lo'],
      'COSYespañol': ['el', 'la'],
      'ΚΟΖΥελληνικά': ['ο', 'η', 'το', 'ο/η'],
      'COSYportuguês': ['o', 'a'],
      'ТАКОЙрусский': ['один', 'одна', 'одно'],
      'ԾՈՍՅհայկական': ['ը', 'ն', 'նա', 'ը/ն'],
      'default': ['the']
    };
    return articles[language] || articles.default;
  }

  function checkGenderAnswer(selectedOption, correctAnswer) {
    const feedbackEl = document.getElementById('grammar-feedback');
    const selectedArticle = selectedOption.textContent;
    
    document.querySelectorAll('.gender-option').forEach(opt => {
      opt.classList.remove('correct', 'incorrect', 'show-answer');
    });
    
    if (selectedArticle === correctAnswer) {
      selectedOption.classList.add('correct');
      feedbackEl.textContent = 'Correct!';
      feedbackEl.style.color = '#4CAF50';
    } else {
      selectedOption.classList.add('incorrect');
      document.querySelectorAll('.gender-option').forEach(opt => {
        if (opt.textContent === correctAnswer) opt.classList.add('show-answer');
      });
      feedbackEl.textContent = 'Incorrect!';
      feedbackEl.style.color = '#F44336';
    }
  }

  function showImagePractice(imgObj, language) {
    const container = document.createElement('div');
    container.className = 'image-container';
    const questions = questionTranslations[language] || questionTranslations.COSYenglish;
    const variants = (typeof questionVariants !== 'undefined' ? questionVariants[language] : undefined) || questionVariants.COSYenglish;
    const day = Number(document.getElementById('day-select')?.value) || 1;
    let qSet;
    if (day === 2) {
      qSet = variants.day2;
    } else if (day >= 3) {
      qSet = variants.day3plus;
    }
    let currentQs = qSet ? [randomElement(qSet[0]), randomElement(qSet[1])] : [questions.what];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'image-question';
    if (qSet) {
      questionDiv.innerHTML = `<span class="q1">${currentQs[0]}</span><br><span class="q2">${currentQs[1]}</span>`;
      // Speak both questions with a pause
      speakText(currentQs[0], language);
      setTimeout(() => speakText(currentQs[1], language), 1200);
    } else {
      questionDiv.textContent = questions.what;
      speakText(questions.what, language);
    }
    const imgElem = document.createElement('img');
    imgElem.src = imgObj.src;
    imgElem.className = 'vocab-image';
    imgElem.alt = imgObj.translations?.[language] || imgObj.alt || 'Image';

    // Caption hidden by default, shown on image click
    const caption = document.createElement('div');
    caption.className = 'image-caption-overlay';
    caption.textContent = imgObj.translations?.[language] || imgObj.alt;
    caption.style.display = 'none';
    imgElem.addEventListener('click', () => {
      caption.style.display = caption.style.display === 'none' ? 'flex' : 'none';
      // Randomize questions on click (if day >= 2)
      if (qSet) {
        currentQs = [randomElement(qSet[0]), randomElement(qSet[1])];
        questionDiv.innerHTML = `<span class="q1">${currentQs[0]}</span><br><span class="q2">${currentQs[1]}</span>`;
        speakText(currentQs[0], language);
        setTimeout(() => speakText(currentQs[1], language), 1200);
      }
    });
    // Center overlay
    caption.style.position = 'absolute';
    caption.style.top = '50%';
    caption.style.left = '50%';
    caption.style.transform = 'translate(-50%, -50%)';
    caption.style.background = 'rgba(255,255,255,0.0)';
    caption.style.color = '#111';
    caption.style.fontWeight = 'bold';
    caption.style.fontSize = '1.5rem';
    caption.style.padding = '0.2em 0.8em';
    caption.style.borderRadius = '10px';
    caption.style.pointerEvents = 'none';
    caption.style.textShadow = '0 1px 8px #fff, 0 0 2px #fff';
    caption.style.justifyContent = 'center';
    caption.style.alignItems = 'center';

    // --- Input/check/pronounce column under the image ---
    const inputCol = document.createElement('div');
    inputCol.className = 'practice-col image-input-col';

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = 'Type the word or phrase...';
    answerInput.className = 'practice-input';
    answerInput.style.margin = '0 auto 10px auto';
    answerInput.style.display = 'block';

    // Row for buttons, centered
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'center';
    btnRow.style.alignItems = 'center';
    btnRow.style.gap = '12px';

    // Check button as emoji
    const checkBtn = document.createElement('button');
    checkBtn.className = 'check-emoji-btn';
    checkBtn.title = 'Check';
    checkBtn.innerHTML = '✅';

    const feedback = document.createElement('span');
    feedback.className = 'practice-feedback';

    checkBtn.onclick = function() {
      const userAns = answerInput.value.trim().toLowerCase();
      const correctAns = (imgObj.translations?.[language] || imgObj.alt || '').trim().toLowerCase();
      if (userAns === correctAns) {
        feedback.textContent = '✔ Correct!';
        feedback.style.color = '#4CAF50';
      } else {
        feedback.textContent = '✘ Incorrect!';
        feedback.style.color = '#F44336';
      }
    };

    // Pronunciation button as emoji
    const speakBtn = document.createElement('button');
    speakBtn.className = 'pronounce-btn';
    speakBtn.title = 'Play pronunciation';
    speakBtn.innerHTML = '<span class="pronounce-icon">🔊</span>';
    speakBtn.onclick = function(e) {
      e.preventDefault();
      speakText(imgObj.translations?.[language] || imgObj.alt, language);
    };

    btnRow.appendChild(checkBtn);
    btnRow.appendChild(speakBtn);

    inputCol.appendChild(answerInput);
    inputCol.appendChild(btnRow);
    inputCol.appendChild(feedback);
    inputCol.style.display = 'flex';
    inputCol.style.flexDirection = 'column';
    inputCol.style.alignItems = 'center';
    inputCol.style.justifyContent = 'center';
    inputCol.style.margin = '0 auto';

    container.appendChild(questionDiv);
    container.appendChild(imgElem);
    container.appendChild(caption);
    container.appendChild(inputCol);
    resultContainer.appendChild(container);
  }

  // Modal for notifications
  if (!document.getElementById('modal-overlay')) {
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modal-overlay';
    modalOverlay.innerHTML = `<div id="modal-message-box"><span id="modal-message-text"></span><br><button id="modal-close-btn">OK</button></div>`;
    document.body.appendChild(modalOverlay);
    document.getElementById('modal-close-btn').onclick = function() {
      document.getElementById('modal-overlay').style.display = 'none';
    };
  }

  function showMessage(msg) {
    const modal = document.getElementById('modal-overlay');
    const msgBox = document.getElementById('modal-message-text');
    if (modal && msgBox) {
      msgBox.textContent = msg;
      modal.style.display = 'flex';
    } else {
      alert(msg);
    }
  }

  // Ensure voiceLanguageMap is available globally
  if (typeof window !== 'undefined' && typeof window.voiceLanguageMap === 'undefined' && typeof voiceLanguageMap !== 'undefined') {
    window.voiceLanguageMap = voiceLanguageMap;
  }

  // Utility functions
  function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let speechUnlocked = false;

  function unlockSpeechSynthesis() {
    if (!speechUnlocked && window.speechSynthesis) {
      // Play a silent utterance to unlock
      const silent = new SpeechSynthesisUtterance('');
      silent.volume = 0;
      window.speechSynthesis.speak(silent);
      speechUnlocked = true;
    }
  }

  // Attach to first user gesture
  window.addEventListener('pointerdown', unlockSpeechSynthesis, { once: true });
  window.addEventListener('keydown', unlockSpeechSynthesis, { once: true });

  function speakText(text, language) {
    if (!window.speechSynthesis) return;
    let voiceLanguageMap = window.voiceLanguageMap || (typeof voiceLanguageMap !== 'undefined' ? voiceLanguageMap : {});
    const voiceSettings = voiceLanguageMap[language] || voiceLanguageMap.COSYenglish || {};
    const utterance = new SpeechSynthesisUtterance(text);

    function setVoiceAndSpeak(utt) {
      let voices = window.speechSynthesis.getVoices();
      let voice = null;
      if (voiceSettings.voiceURI) {
        voice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
      }
      if (!voice && voiceSettings.lang) {
        voice = voices.find(v => v.lang === voiceSettings.lang);
      }
      if (!voice && voiceSettings.lang) {
        const langPrefix = voiceSettings.lang.split('-')[0];
        voice = voices.find(v => v.lang && v.lang.startsWith(langPrefix));
      }
      if (!voice) {
        voice = voices[0];
      }
      if (voice) {
        utt.voice = voice;
        utt.lang = voice.lang;
      } else if (voiceSettings.lang) {
        utt.lang = voiceSettings.lang;
      }
      utt.rate = 0.9;
      utt.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    }

    function waitAndSpeak() {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak(utterance);
      } else {
        window.speechSynthesis.onvoiceschanged = function handler() {
          window.speechSynthesis.onvoiceschanged = null;
          setVoiceAndSpeak(utterance);
        };
        window.speechSynthesis.getVoices();
        setTimeout(function() {
          if (window.speechSynthesis.getVoices().length > 0) {
            window.speechSynthesis.onvoiceschanged = null;
            setVoiceAndSpeak(utterance);
          }
        }, 350);
      }
    }
    waitAndSpeak();
  }
});
