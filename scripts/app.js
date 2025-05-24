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

  // Update verb button when day changes and on page load
  document.getElementById('day-select').addEventListener('change', updateVerbButtonVisibility);
  updateVerbButtonVisibility();

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
    // Dynamically create gender practice UI
    resultContainer.innerHTML = '';
    const words = genderPracticeData[language]?.[day] || [];
    if (!words.length) return showMessage('No gender practice available');
    const word = randomElement(words);
    const questionDiv = document.createElement('div');
    questionDiv.id = 'grammar-question';
    questionDiv.textContent = word.word;
    questionDiv.dataset.answer = word.article;
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
    resultContainer.innerHTML = '';
    if (!day || day < 2) {
      showMessage('Verb practice is only available from Day 2.');
      return;
    }
    const data = verbPracticeData[language]?.[day];
    if (!data || !data.length) return showMessage('No verb practice available');
    // If data is array of strings, convert to prompt/answer pairs for demo
    let items = data;
    if (typeof data[0] === 'string') {
      // For demo: show the string as prompt, answer is the same
      items = data.map(str => ({ prompt: str, answer: str }));
    }
    const item = randomElement(items);
    const questionDiv = document.createElement('div');
    questionDiv.id = 'grammar-question';
    questionDiv.textContent = item.prompt;
    const optionsEl = document.createElement('div');
    optionsEl.id = 'grammar-options';
    optionsEl.className = 'grammar-gender-options';
    // For verbs, just show a single button to reveal the answer (like image practice)
    const showBtn = document.createElement('div');
    showBtn.className = 'gender-option';
    showBtn.textContent = 'Show Answer';
    showBtn.addEventListener('click', () => {
      showBtn.textContent = item.answer;
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
    // Defensive: check if speakingData and language exist
    if (!speakingData) {
      showMessage('No speaking exercises found for this language. (speakingData missing)');
      return;
    }
    if (!speakingData[language]) {
      showMessage(`No speaking exercises found for this language: ${language}`);
      return;
    }
    const phrases = getSpeakingPhrases(speakingData, language, days);
    if (!phrases.length) {
      showMessage(`No speaking exercises found for language: ${language}, days: ${days.join(', ')}.\nCheck if data exists in scripts/data/speaking-data.js.`);
      return;
    }
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'block';
    const phraseDiv = document.createElement('div');
    phraseDiv.className = 'practice-speaking';
    phraseDiv.textContent = randomElement(phrases);
    phraseDiv.style.color = '#fff';
    resultContainer.appendChild(phraseDiv);
    speakText(phraseDiv.textContent, language);
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
    const questionDiv = document.createElement('div');
    questionDiv.className = 'image-question';
    questionDiv.textContent = questions.what;

    const imgElem = document.createElement('img');
    imgElem.src = imgObj.src;
    imgElem.className = 'vocab-image';
    imgElem.alt = imgObj.translations?.[language] || imgObj.alt || 'Image';

    // Caption hidden by default, shown on image click
    const caption = document.createElement('div');
    caption.className = 'image-caption';
    caption.textContent = imgObj.translations?.[language] || imgObj.alt;
    caption.style.display = 'none';
    imgElem.addEventListener('click', () => {
      caption.style.display = caption.style.display === 'none' ? 'block' : 'none';
    });

    // --- Input and check button for writing practice (vertical layout) ---
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'image-word-input';
    input.placeholder = questions.type_word || 'Type the word...';
    input.style.margin = '18px 0 0 0';
    input.style.display = 'block';
    input.style.textAlign = 'center';
    const checkBtn = document.createElement('button');
    checkBtn.textContent = questions.check_word || 'Check';
    checkBtn.className = 'image-word-check-btn';
    checkBtn.style.margin = '14px 0 0 0';
    checkBtn.style.display = 'block';
    checkBtn.style.width = '100%';
    const feedback = document.createElement('div');
    feedback.className = 'image-word-feedback';
    feedback.style.marginTop = '16px';
    function playImageSound(type) {
      let src = '';
      if (type === 'success') src = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae4c2.mp3';
      if (type === 'fail') src = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae4c2.mp3';
      if (src) {
        const audio = new Audio(src);
        audio.volume = 0.25;
        audio.play();
      }
    }
    function checkAnswer() {
      const correct = (imgObj.translations?.[language] || imgObj.alt || '').trim().toLowerCase();
      const user = input.value.trim().toLowerCase();
      if (!user) {
        feedback.textContent = questions.enter_word || 'Please type your answer.';
        feedback.style.color = '#F44336';
        playImageSound('fail');
        return;
      }
      if (user === correct) {
        feedback.textContent = questions.correct_word || 'Correct!';
        feedback.style.color = '#4CAF50';
        playImageSound('success');
      } else {
        feedback.textContent = (questions.incorrect_word || 'Incorrect!') + ` (${correct})`;
        feedback.style.color = '#F44336';
        playImageSound('fail');
      }
    }
    checkBtn.onclick = checkAnswer;
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') checkAnswer();
    });
    // Structure: image, caption overlay (hidden by default), input, check, feedback
    container.append(questionDiv, imgElem, caption, input, checkBtn, feedback);
    resultContainer.appendChild(container);
  }

  // Helper to show a message in the result container
  function showMessage(msg) {
    resultContainer.innerHTML = `<div class="message">${msg}</div>`;
    resultContainer.style.display = 'block';
  }

  // Utility functions
  function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function speakText(text, language) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceSettings = voiceLanguageMap[language] || voiceLanguageMap.COSYenglish;
    // Wait for voices to be loaded
    let voices = window.speechSynthesis.getVoices();
    // Try to find the best match: exact voiceURI, then exact lang, then fallback
    let voice = null;
    if (voiceSettings.voiceURI) {
      voice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
    }
    if (!voice && voiceSettings.lang) {
      // Try to match language exactly (including region)
      voice = voices.find(v => v.lang === voiceSettings.lang);
    }
    if (!voice && voiceSettings.lang) {
      // Try to match language only (ignore region)
      const langPrefix = voiceSettings.lang.split('-')[0];
      voice = voices.find(v => v.lang && v.lang.startsWith(langPrefix));
    }
    if (!voice) {
      // Fallback to first available voice
      voice = voices[0];
    }
    utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }
});
