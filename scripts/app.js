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
    const word = randomElement(words);
    const wordDiv = document.createElement('div');
    wordDiv.className = 'practice-word';
    wordDiv.textContent = word;
    wordDiv.style.color = '#fff';
    wordDiv.style.textAlign = 'center';
    resultContainer.appendChild(wordDiv);
    speakText(word, language);

    // Pronunciation practice UI
    const speakPracticeDiv = document.createElement('div');
    speakPracticeDiv.style.marginTop = '18px';
    speakPracticeDiv.style.display = 'flex';
    speakPracticeDiv.style.justifyContent = 'center';
    speakPracticeDiv.style.alignItems = 'center';
    const micBtn = document.createElement('button');
    micBtn.textContent = '🎤Speak';
    micBtn.className = 'btn speak-btn';
    micBtn.style.margin = '0 auto';
    const feedback = document.createElement('div');
    feedback.className = 'practice-feedback';
    feedback.style.marginTop = '10px';
    feedback.style.marginLeft = '12px';
    speakPracticeDiv.appendChild(micBtn);
    speakPracticeDiv.appendChild(feedback);
    resultContainer.appendChild(speakPracticeDiv);

    let recognition;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = (window.voiceLanguageMap?.[language]?.lang) || 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
    }

    micBtn.onclick = function() {
      if (!recognition) {
        feedback.textContent = 'Speech recognition is not supported in this browser.';
        feedback.style.color = '#F44336';
        return;
      }
      feedback.textContent = 'Listening...';
      feedback.style.color = '#0abab5';
      recognition.start();
      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        const target = word.trim().toLowerCase();
        // Accept answer if transcript contains the word or is very similar
        if (transcript === target || transcript.includes(target) || target.includes(transcript) || getSimilarityScore(transcript, target) > 0.8) {
          feedback.textContent = `✔ Pronunciation correct! You said: "${transcript}"`;
          feedback.style.color = '#4CAF50';
          adventureCorrectAnswer(Number(document.getElementById('day-select')?.value) || 1);
        } else {
          feedback.textContent = `✘ You said: "${transcript}". Try again!`;
          feedback.style.color = '#F44336';
          adventureWrongAnswer();
        }
      };
      recognition.onerror = function() {
        feedback.textContent = 'Could not recognize speech. Try again.';
        feedback.style.color = '#F44336';
      };
    };

    // Center the pronounce button
    const pronounceBtn = document.createElement('button');
    pronounceBtn.className = 'pronounce-btn';
    pronounceBtn.title = 'Play pronunciation';
    pronounceBtn.innerHTML = '<span class="pronounce-icon">🔊</span>';
    pronounceBtn.style.display = 'block';
    pronounceBtn.style.margin = '18px auto 0 auto';
    pronounceBtn.onclick = function(e) {
      e.preventDefault();
      speakText(word, language);
    };
    resultContainer.appendChild(pronounceBtn);
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
    container.className = 'image-container';

    // Get verb data
    const verbData = window.verbPracticeData?.[language]?.[day];
    if (!verbData || verbData.length === 0) {
      resultContainer.textContent = 'No verb data found for this selection.';
      return;
    }
    const item = randomElement(verbData);

    // Prompt (random word)
    const promptDiv = document.createElement('div');
    promptDiv.className = 'image-question';
    promptDiv.textContent = item.prompt;
    container.appendChild(promptDiv);

    // Input row
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'practice-input';
    input.placeholder = 'Type your answer';
    container.appendChild(input);

    // Button row (Check + Show Answer + Pronounce)
    const btnRow = document.createElement('div');
    btnRow.className = 'practice-btn-row';

    // Check button
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn check-emoji-btn';
    checkBtn.title = 'Check your answer';
    checkBtn.innerHTML = '✅';

    // Show answer button
    const showAnswerBtn = document.createElement('button');
    showAnswerBtn.className = 'btn show-answer-btn';
    showAnswerBtn.title = 'Show correct answer';
    showAnswerBtn.innerHTML = '💡';

    // Pronounce button
    const pronounceBtn = document.createElement('button');
    pronounceBtn.className = 'btn pronounce-btn';
    pronounceBtn.innerHTML = '<span class="pronounce-icon">🔊</span>';
    pronounceBtn.onclick = function() {
      speakText(item.answer, language);
    };

    btnRow.appendChild(checkBtn);
    btnRow.appendChild(showAnswerBtn);
    btnRow.appendChild(pronounceBtn);
    container.appendChild(btnRow);

    // Feedback
    const feedback = document.createElement('div');
    feedback.className = 'practice-feedback';
    container.appendChild(feedback);

    checkBtn.onclick = function() {
      if (input.value.trim().toLowerCase() === item.answer.trim().toLowerCase()) {
        feedback.textContent = 'Correct!';
        feedback.style.color = '#0abab5';
        adventureCorrectAnswer(day);
      } else {
        feedback.textContent = 'Try again!';
        feedback.style.color = '#d9534f';
        adventureWrongAnswer();
      }
    };

    showAnswerBtn.onclick = function() {
      feedback.textContent = `Answer: ${item.answer}`;
      feedback.style.color = '#333';
    };

    pronounceBtn.onclick = function() {
      speakText(item.answer, language);
    };

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

    // Pronunciation practice UI for speaking: always award XP/streak, just transcribe
    const speakPracticeDiv = document.createElement('div');
    speakPracticeDiv.style.marginTop = '18px';
    speakPracticeDiv.style.display = 'flex';
    speakPracticeDiv.style.justifyContent = 'center';
    speakPracticeDiv.style.alignItems = 'center';
    const micBtn = document.createElement('button');
    micBtn.textContent = '🎤Speak';
    micBtn.className = 'btn speak-btn';
    micBtn.style.margin = '0 auto';
    const feedback = document.createElement('div');
    feedback.className = 'practice-feedback';
    feedback.style.marginTop = '10px';
    feedback.style.marginLeft = '12px';
    speakPracticeDiv.appendChild(micBtn);
    speakPracticeDiv.appendChild(feedback);

    resultContainer.appendChild(taskDiv);
    resultContainer.appendChild(exampleDiv);
    resultContainer.appendChild(speakPracticeDiv);

    // --- Speech recognition logic for speaking practice ---
    let recognition;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = (window.voiceLanguageMap?.[language]?.lang) || 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
    }

    micBtn.onclick = function() {
      if (!recognition) {
        feedback.textContent = 'Speech recognition is not supported in this browser.';
        feedback.style.color = '#F44336';
        return;
      }
      feedback.textContent = 'Listening...';
      feedback.style.color = '#0abab5';
      recognition.start();
      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        feedback.textContent = `You said: "${transcript}"`;
        feedback.style.color = '#4CAF50';
        // Always award XP/streak for speaking
        adventureCorrectAnswer(Number(document.getElementById('day-select')?.value) || 1);
      };
      recognition.onerror = function() {
        feedback.textContent = 'Could not recognize speech. Try again.';
        feedback.style.color = '#F44336';
      };
    };
  }

  // --- Adventure-like features ---
  const DAYS = 7;
  let userXP = 0;
  let userStreak = 0;
  let unlockedDay = 1;

  function saveAdventureProgress() {
    localStorage.setItem('cosy_xp', userXP);
    localStorage.setItem('cosy_streak', userStreak);
    localStorage.setItem('cosy_unlocked_day', unlockedDay);
  }
  function loadAdventureProgress() {
    userXP = parseInt(localStorage.getItem('cosy_xp') || '0');
    userStreak = parseInt(localStorage.getItem('cosy_streak') || '0');
    unlockedDay = parseInt(localStorage.getItem('cosy_unlocked_day') || '1');
  }
  // Load progress on startup
  loadAdventureProgress();

  // Update progress bar and XP/streak on page load
  updateProgressMap();

  function updateProgressMap() {
    const map = document.getElementById('progress-map');
    map.innerHTML = '';
    // Use a compact dot for each day
    for (let i = 1; i <= DAYS; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.setAttribute('data-day', `Day ${i}`);
      if (i < unlockedDay) {
        dot.classList.add('completed');
      } else if (i === unlockedDay) {
        dot.classList.add('active');
      } else {
        dot.classList.add('locked');
      }
      map.appendChild(dot);
    }
    document.getElementById('xp-display').textContent = `XP: ${userXP}`;
    document.getElementById('streak-display').textContent = `Streak: ${userStreak}`;
  }

  // --- Gamification & Story Elements ---
  // Save/load adventure progress to localStorage (XP, streak, unlockedDay)
  function saveAdventureProgress() {
    localStorage.setItem('cosy_xp', userXP);
    localStorage.setItem('cosy_streak', userStreak);
    localStorage.setItem('cosy_unlocked_day', unlockedDay);
  }
  function loadAdventureProgress() {
    userXP = parseInt(localStorage.getItem('cosy_xp') || '0');
    userStreak = parseInt(localStorage.getItem('cosy_streak') || '0');
    unlockedDay = parseInt(localStorage.getItem('cosy_unlocked_day') || '1');
  }
  // Load progress on startup
  loadAdventureProgress();

  // Update progress map on page load
  updateProgressMap();

  // Add a reset progress button
  if (!document.getElementById('reset-progress-btn')) {
    const btn = document.createElement('button');
    btn.id = 'reset-progress-btn';
    btn.textContent = 'Reset Adventure Progress';
    btn.style.position = 'absolute';
    btn.style.top = '50px';
    btn.style.right = '10px';
    btn.style.zIndex = '1000';
    btn.style.background = '#fff';
    btn.style.padding = '8px 16px';
    btn.style.borderRadius = '6px';
    btn.style.fontWeight = 'bold';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    btn.style.color = '#222';
    btn.onclick = function() {
      if (confirm('Are you sure you want to reset your adventure progress?')) {
        userXP = 0; userStreak = 0; unlockedDay = 1;
        saveAdventureProgress();
        updateProgressMap();
      }
    };
    document.body.appendChild(btn);
  }

  // Save progress after every change
  function addXP(amount) {
    userXP += amount;
    saveAdventureProgress();
    updateProgressMap();
  }

  function incrementStreak() {
    userStreak += 1;
    saveAdventureProgress();
    updateProgressMap();
  }

  function resetStreak() {
    userStreak = 0;
    saveAdventureProgress();
    updateProgressMap();
  }

  function unlockNextDay(currentDay) {
    if (currentDay >= unlockedDay && currentDay < DAYS) {
      unlockedDay = currentDay + 1;
      saveAdventureProgress();
      updateProgressMap();
    }
  }

  // --- Story & Gamification ---
  // Show a story intro modal on first visit
  if (!localStorage.getItem('cosy_story_intro_shown')) {
    setTimeout(() => {
      showMessage('Welcome, adventurer! Embark on your COSYlanguages journey. Unlock new days, earn XP, and discover language treasures!');
      localStorage.setItem('cosy_story_intro_shown', '1');
    }, 800);
  }

  // Show a reward modal when a new day is unlocked
  function showDayUnlocked(day) {
    showMessage(`🎉 Congratulations! You unlocked Day ${day}! Keep going to discover more language adventures!`);
  }
  // Patch unlockNextDay to show reward
  const _unlockNextDay = unlockNextDay;
  unlockNextDay = function(currentDay) {
    const prevUnlocked = unlockedDay;
    _unlockNextDay(currentDay);
    if (unlockedDay > prevUnlocked) {
      showDayUnlocked(unlockedDay);
    }
  };

  // Show a streak reward modal
  function showStreakReward(streak) {
    if (streak > 0 && streak % 5 === 0) {
      showMessage(`🔥 Streak bonus! ${streak} days in a row! +20 XP!`);
      addXP(20);
    }
  }
  // Patch incrementStreak to show streak reward
  const _incrementStreak = incrementStreak;
  incrementStreak = function() {
    _incrementStreak();
    showStreakReward(userStreak);
  };

  document.addEventListener('DOMContentLoaded', updateProgressMap);

  // Restrict day selection to unlocked days
  // Restrict day selection to unlocked days (adventure mode)
  (function() {
    var ds = document.getElementById('day-select');
    if (ds) {
      ds.addEventListener('mousedown', function() {
        for (let i = 0; i < ds.options.length; i++) {
          const opt = ds.options[i];
          if (opt.value && parseInt(opt.value) > unlockedDay) {
            opt.disabled = true;
            opt.style.color = '#aaa';
          } else {
            opt.disabled = false;
            opt.style.color = '';
          }
        }
      });
    }
  })();

  // --- UI Translation Logic (inserted at end of DOMContentLoaded) ---
  const navIds = [
    { id: 'nav-home', key: 'nav_home', emoji: '🏠' },
    { id: 'nav-practice', key: 'nav_practice', emoji: '📝' },
    { id: 'nav-progress', key: 'nav_progress', emoji: '📈' },
    { id: 'nav-help', key: 'nav_help', emoji: '❓' }
  ];
  const labelMap = [
    { sel: 'label[for="language-select"]', key: 'choose_language' },
    { sel: 'label[for="day-select"]', key: 'choose_day' },
    { sel: 'label[for="day-from-select"]', key: 'day_from' },
    { sel: 'label[for="day-to-select"]', key: 'day_to' },
    { sel: '#show-button', key: 'show_practice' },
    { sel: '#vocabulary-submenu [data-practice="random_word"]', key: 'random_word' },
    { sel: '#vocabulary-submenu [data-practice="random_image"]', key: 'random_image' },
    { sel: '#grammar-submenu [data-practice="gender"]', key: 'gender' },
    { sel: '#grammar-submenu [data-practice="verb"]', key: 'verb' },
    { sel: '#grammar-submenu [data-practice="possessives"]', key: 'possessives' },
    { sel: '#xp-display', key: 'xp', prefix: 'XP: ' },
    { sel: '#streak-display', key: 'streak', prefix: 'Streak: ' },
    { sel: '#install-app-btn', key: 'install_app' }
  ];
  let showEnglish = false;
  function translateUI(lang) {
    const uiT = (window.uiTranslations && window.uiTranslations[lang]) || window.uiTranslations.COSYenglish;
    // Nav
    navIds.forEach(({id, key, emoji}) => {
      const btn = document.getElementById(id);
      if (btn) {
        const label = btn.querySelector('.nav-label');
        if (label) label.textContent = uiT[key] || window.uiTranslations.COSYenglish[key];
        btn.title = emoji + ' ' + (uiT[key] || window.uiTranslations.COSYenglish[key]);
        if (showEnglish && lang !== 'COSYenglish') btn.setAttribute('data-tooltip', window.uiTranslations.COSYenglish[key]);
        else btn.removeAttribute('data-tooltip');
      }
    });
    // Labels/buttons
    labelMap.forEach(({sel, key, prefix}) => {
      const el = document.querySelector(sel);
      if (el) {
        // Remove translation for XP and Streak
        if (sel === '#xp-display') {
          el.textContent = 'XP:';
          return;
        }
        if (sel === '#streak-display') {
          el.textContent = 'Streak:';
          return;
        }
        let txt = uiT[key] || window.uiTranslations.COSYenglish[key];
        if (prefix) txt = (uiT[key] ? prefix : window.uiTranslations.COSYenglish[key] ? prefix : '') + txt;
        el.textContent = txt;
        if (showEnglish && lang !== 'COSYenglish') el.setAttribute('data-tooltip', window.uiTranslations.COSYenglish[key]);
        else el.removeAttribute('data-tooltip');
      }
    });
    // Help popup
    const helpBtn = document.getElementById('nav-help');
    if (helpBtn) helpBtn.title = (uiT.help_popup || window.uiTranslations.COSYenglish.help_popup);

    // --- Dynamic select options translation ---
    // Language select: keep as is (language names)
    // Day select
    const daySelect = document.getElementById('day-select');
    if (daySelect) {
      for (let i = 1; i <= 7; i++) {
        const opt = daySelect.querySelector(`option[value="${i}"]`);
        if (opt) opt.textContent = (uiT['choose_day'] ? uiT['choose_day'].replace(/\D+/g, '') + ' ' + i : 'Day ' + i);
      }
      const firstOpt = daySelect.querySelector('option[value=""]');
      if (firstOpt) firstOpt.textContent = '--' + (uiT['choose_day'] || 'Select Day') + '--';
    }
    // Day from/to selects
    const dayFrom = document.getElementById('day-from-select');
    const dayTo = document.getElementById('day-to-select');
    [dayFrom, dayTo].forEach((sel, idx) => {
      if (sel) {
        const labelKey = idx === 0 ? 'day_from' : 'day_to';
        for (let i = 1; i <= 7; i++) {
          const opt = sel.querySelector(`option[value="${i}"]`);
          if (opt) opt.textContent = i;
        }
        const firstOpt = sel.querySelector('option[value=""]');
        if (firstOpt) firstOpt.textContent = (idx === 0 ? (uiT['day_from'] || 'From') : (uiT['day_to'] || 'To'));
      }
    });
    // Practice type select
    const practiceTypeSelect = document.getElementById('practice-type-select');
    if (practiceTypeSelect) {
      const opts = practiceTypeSelect.querySelectorAll('option');
      opts[0].textContent = '--' + (uiT['show_practice'] || 'Select Practice') + '--';
      opts[1].textContent = uiT['random_word'] ? uiT['random_word'] + ' Practice' : 'Vocabulary Practice';
      opts[2].textContent = uiT['gender'] ? uiT['gender'] + ' Practice' : 'Grammar Practice';
      opts[3].textContent = uiT['show_practice'] ? uiT['show_practice'] : 'Speaking Practice';
    }
    // Submenu buttons (already handled above)
  }
  // Tooltip logic
  function showTooltip(e) {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;
    let tooltip = document.getElementById('ui-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'ui-tooltip';
      tooltip.className = 'ui-tooltip';
      document.body.appendChild(tooltip);
    }
    tooltip.textContent = target.getAttribute('data-tooltip');
    const rect = target.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
    tooltip.style.top = (rect.bottom + 6 + window.scrollY) + 'px';
    tooltip.classList.add('visible');
  }
  function hideTooltip() {
    const tooltip = document.getElementById('ui-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
  }
  document.body.addEventListener('mouseover', showTooltip);
  document.body.addEventListener('mouseout', hideTooltip);
  document.body.addEventListener('focusin', showTooltip);
  document.body.addEventListener('focusout', hideTooltip);
  // Show English button
  const showEnglishBtn = document.getElementById('show-english-btn');
  if (showEnglishBtn) {
    showEnglishBtn.onclick = function() {
      showEnglish = !showEnglish;
      showEnglishBtn.classList.toggle('active', showEnglish);
      translateUI(languageSelect.value || 'COSYenglish');
      // Add English tooltips to all controls
      document.querySelectorAll('[data-tooltip]').forEach(el => {
        if (showEnglish && languageSelect.value !== 'COSYenglish') {
          const key = el.getAttribute('data-tooltip-key');
          if (key && window.uiTranslations.COSYenglish[key]) {
            el.setAttribute('data-tooltip', window.uiTranslations.COSYenglish[key]);
          }
        }
      });
    };
  }
  // Language select triggers translation
  languageSelect.addEventListener('change', function() {
    translateUI(languageSelect.value || 'COSYenglish');
  });
  // Initial translation
  translateUI(languageSelect.value || 'COSYenglish');
  // Nav button handlers (for demo, scroll to sections or show popups)
  document.getElementById('nav-home')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  document.getElementById('nav-practice')?.addEventListener('click',()=>document.querySelector('.controls-container')?.scrollIntoView({behavior:'smooth'}));
  document.getElementById('nav-progress')?.addEventListener('click',()=>document.getElementById('adventure-progress')?.scrollIntoView({behavior:'smooth'}));
  document.getElementById('nav-help')?.addEventListener('click',()=>{
    showMessage((window.uiTranslations[languageSelect.value]?.help_popup)||window.uiTranslations.COSYenglish.help_popup);
  });

  // --- Visual hints/demonstrations for practice types and controls ---
  // Add tooltips to submenu buttons and controls for accessibility
  function addPracticeTypeHints() {
    // Vocabulary submenu
    document.querySelectorAll('#vocabulary-submenu .submenu-btn').forEach(btn => {
      if (btn.getAttribute('data-practice') === 'random_word') {
        btn.setAttribute('data-tooltip', '🔤 ' + (window.uiTranslations[languageSelect.value]?.random_word || 'Random Word'));
      } else if (btn.getAttribute('data-practice') === 'random_image') {
        btn.setAttribute('data-tooltip', '🖼️ ' + (window.uiTranslations[languageSelect.value]?.random_image || 'Random Image'));
      }
    });
    // Grammar submenu
    document.querySelectorAll('#grammar-submenu .submenu-btn').forEach(btn => {
      if (btn.getAttribute('data-practice') === 'gender') {
        btn.setAttribute('data-tooltip', '♀♂ ' + (window.uiTranslations[languageSelect.value]?.gender || 'Gender'));
      } else if (btn.getAttribute('data-practice') === 'verb') {
        btn.setAttribute('data-tooltip', '🔄 ' + (window.uiTranslations[languageSelect.value]?.verb || 'Verb'));
      } else if (btn.getAttribute('data-practice') === 'possessives') {
        btn.setAttribute('data-tooltip', '👪 ' + (window.uiTranslations[languageSelect.value]?.possessives || 'Possessives'));
      } else if (btn.getAttribute('data-practice') === 'speaking') {
        btn.setAttribute('data-tooltip', '🗣️ ' + (window.uiTranslations[languageSelect.value]?.speaking || 'Speaking'));
      }
    });
    // Practice type select
    const practiceTypeSelect = document.getElementById('practice-type-select');
    if (practiceTypeSelect) {
      practiceTypeSelect.setAttribute('data-tooltip', '📝 ' + (window.uiTranslations[languageSelect.value]?.show_practice || 'Choose a practice type'));
    }
    // Show button
    const showBtn = document.getElementById('show-button');
    if (showBtn) {
      showBtn.setAttribute('data-tooltip', '▶️ ' + (window.uiTranslations[languageSelect.value]?.show_practice || 'Show Practice'));
    }
  }
  // Call after translation
  function updateUIHints() {
    addPracticeTypeHints();
  }
  // Patch translateUI to also update hints
  const origTranslateUI = translateUI;
  translateUI = function(lang) {
    origTranslateUI(lang);
    updateUIHints();
  };

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
      adventureCorrectAnswer(Number(document.getElementById('day-select')?.value) || 1);
    } else {
      selectedOption.classList.add('incorrect');
      document.querySelectorAll('.gender-option').forEach(opt => {
        if (opt.textContent === correctAnswer) opt.classList.add('show-answer');
      });
      feedbackEl.textContent = 'Incorrect!';
      feedbackEl.style.color = '#F44336';
      adventureWrongAnswer();
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
      speakText(currentQs[0], language);
      setTimeout(() => speakText(currentQs[1], language), 1200);
    } else {
      questionDiv.textContent = currentQs[0];
      speakText(currentQs[0], language);
    }
    container.appendChild(questionDiv);

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
      if (qSet) {
        currentQs = [randomElement(qSet[0]), randomElement(qSet[1])];
        questionDiv.innerHTML = `<span class=\"q1\">${currentQs[0]}</span><br><span class=\"q2\">${currentQs[1]}</span>`;
        speakText(currentQs[0], language);
        setTimeout(() => speakText(currentQs[1], language), 1200);
      }
    });

    // --- Input/check/pronounce column under the image ---
    const inputCol = document.createElement('div');
    inputCol.className = 'practice-col image-input-col';

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = 'Type the word or phrase...';
    answerInput.className = 'practice-input';

    // Row for buttons, centered
    const btnRow = document.createElement('div');
    btnRow.className = 'practice-btn-row';

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
        adventureCorrectAnswer(Number(document.getElementById('day-select')?.value) || 1);
      } else {
        feedback.textContent = '✘ Incorrect!';
        feedback.style.color = '#F44336';
        adventureWrongAnswer();
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

  // PWA Install App button logic
  let deferredPrompt;
  const installBtn = document.getElementById('install-app-btn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  });
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });
  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
  });

  // Utility functions
  function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Use the global unlockSpeechSynthesis utility from utils.js
  if (typeof window.unlockSpeechSynthesis === 'function') {
    window.addEventListener('pointerdown', window.unlockSpeechSynthesis, { once: true });
    window.addEventListener('keydown', window.unlockSpeechSynthesis, { once: true });
  }

  // Ensure speakText is available globally for utils.js and other modules
  window.speakText = speakText;

  function speakText(text, language) {
    if (!window.speechSynthesis) {
      showMessage('Speech synthesis is not supported on this device/browser.');
      return;
    }
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
      if (!voice && voices.length > 0) {
        voice = voices[0]; // fallback to any available voice
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

  // Example: Award XP and unlock next day after correct answer
  function adventureCorrectAnswer(currentDay) {
    addXP(10);
    incrementStreak();
    unlockNextDay(currentDay);
    // Animated feedback
    const rc = document.getElementById('result-container');
    if (rc) {
      rc.style.animation = 'adventure-correct 0.5s';
      setTimeout(() => { rc.style.animation = ''; }, 500);
    }
  }

  // Example: Reset streak and show feedback on wrong answer
  function adventureWrongAnswer() {
    resetStreak();
    const rc = document.getElementById('result-container');
    if (rc) {
      rc.style.animation = 'adventure-wrong 0.5s';
      setTimeout(() => { rc.style.animation = ''; }, 500);
    }
  }

  // Utility: ensure input fields are always enabled and focusable
  function ensureInputFocusable(input) {
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    input.tabIndex = 0;
    input.style.pointerEvents = 'auto';
    input.style.zIndex = 2;
  }

  // Patch all input fields after they are created
  function patchPracticeInputs() {
    document.querySelectorAll('.practice-input').forEach(ensureInputFocusable);
  }

  // Patch after rendering practice content
  const origShowPractice = window.showPractice;
  window.showPractice = function(...args) {
    origShowPractice.apply(this, args);
    patchPracticeInputs();
  };

  // Also patch after submenu or random word/speaking
  function patchAfterRender() {
    setTimeout(patchPracticeInputs, 100);
  }

  // Patch after DOM updates
  ['click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, patchAfterRender, true);
  });

  // Microphone button: support touchstart for mobile
  function addMicBtnTouchSupport(btn, handler) {
    btn.addEventListener('click', handler);
    btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      handler();
    });
  }

  // When creating mic/pronounce buttons, use addMicBtnTouchSupport
  // Example:
  // addMicBtnTouchSupport(micBtn, () => { ... });
});
