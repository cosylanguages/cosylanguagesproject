// Main app logic for COSYlanguages
// All DOM event handlers and UI logic are here

import { randomElement, getSimilarityScore, speakText, unlockSpeechSynthesis, adventureCorrectAnswer, adventureWrongAnswer, ensureInputFocusable, patchPracticeInputs } from './utils.js';
// Import translation-related functions and data
import { uiTranslations, translateUI } from './data/translations.js';

console.log('[app.js] window.genderPracticeData at startup:', window.genderPracticeData);

document.addEventListener('DOMContentLoaded', function() {
  // Get all DOM elements
  const languageSelect = document.getElementById('language-select');
  const daySelect = document.getElementById('day-select');
  const practiceTypeSelect = document.getElementById('practice-type-select');
  const resultContainer = document.getElementById('result-container');

  // --- Practice Type Submenu (new unified submenu) ---
  // Remove old vocabSubmenu and grammarSubmenu logic, and create a new unified submenu
  const practiceTypeSubmenu = document.createElement('div');
  practiceTypeSubmenu.id = 'practice-type-submenu';
  practiceTypeSubmenu.className = 'practice-type-submenu';
  practiceTypeSubmenu.style.display = 'flex';
  practiceTypeSubmenu.style.justifyContent = 'center';
  practiceTypeSubmenu.style.gap = '16px';
  practiceTypeSubmenu.style.margin = '18px 0 0 0';
  // Add submenu buttons for each practice type
  const submenuTypes = [
    { key: 'vocabulary_practice', dataPractice: 'vocabulary_practice' },
    { key: 'grammar_practice', dataPractice: 'grammar_practice' },
    { key: 'speaking_practice', dataPractice: 'speaking_practice' }
  ];
  submenuTypes.forEach(({key, dataPractice}) => {
    const btn = document.createElement('button');
    btn.className = 'submenu-btn';
    btn.setAttribute('data-practice', dataPractice);
    btn.textContent = (window.uiTranslations?.[languageSelect.value]?.[key] || window.uiTranslations?.COSYenglish?.[key] || key);
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Remove 'active' from all submenu buttons
      practiceTypeSubmenu.querySelectorAll('.submenu-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Set the main select to match the submenu
      practiceTypeSelect.value = dataPractice;
      practiceTypeSelect.dispatchEvent(new Event('change'));
    });
    practiceTypeSubmenu.appendChild(btn);
  });
  // Insert the new submenu after the practiceTypeSelect
  practiceTypeSelect.parentElement.insertBefore(practiceTypeSubmenu, practiceTypeSelect.nextSibling);

  function hideAllSubmenus() {
    //vocabSubmenu.classList.remove('active');
    //grammarSubmenu.classList.remove('active');
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
    //vocabSubmenu.style.display = 'none';
    //grammarSubmenu.style.display = 'none';
    if (practiceTypeSelect.value === 'vocabulary_practice') {
      //vocabSubmenu.style.display = 'flex';
      // Auto-select first submenu button for vocabulary
      const firstBtn = vocabSubmenu.querySelector('.submenu-btn');
      if (firstBtn) {
        vocabSubmenu.querySelectorAll('.submenu-btn').forEach(btn => btn.classList.remove('active'));
        firstBtn.classList.add('active');
      }
    } else if (practiceTypeSelect.value === 'grammar_practice') {
      //grammarSubmenu.style.display = 'flex';
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
      if (practiceType === 'gender') {
        showGrammarGenderPractice(language, day || 1);
      } else if (practiceType === 'verb') {
        showGrammarVerbPractice(language, day || 1);
      } else if (practiceType === 'possessives') {
        showGrammarPossessivesPractice(language, day || 3);
      } else if (practiceType === 'random_word') {
        handleRandomWord(language, [day || 1]);
      } else if (practiceType === 'random_image') {
        handleRandomImage(language, [day || 1]);
      }
    }
  });

  // Remove Show Practice button logic
  // Instead, trigger practice automatically on selection
  function autoTriggerPractice() {
    const language = languageSelect.value;
    const day = daySelect.value;
    const dayFrom = document.getElementById('day-from-select')?.value;
    const dayTo = document.getElementById('day-to-select')?.value;
    const practiceType = practiceTypeSelect.value;
    // Defensive: always clear and show result container
    clearResultContainer();
    resultContainer.style.display = 'block';
    if (!language) return;
    let days = [];
    if (dayFrom && dayTo) {
      const from = Number(dayFrom);
      const to = Number(dayTo);
      if (from > to) return;
      for (let d = from; d <= to; d++) days.push(d);
    } else if (day) {
      days = [Number(day)];
    } else {
      return;
    }
    if (!practiceType) return;
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
      if (!activeBtn) return;
      if (activeBtn.getAttribute('data-practice') === 'gender') {
        showGrammarGenderPractice(language, days[0]);
      } else if (activeBtn.getAttribute('data-practice') === 'verb') {
        showGrammarVerbPractice(language, days[0]);
      } else if (activeBtn.getAttribute('data-practice') === 'possessives') {
        showGrammarPossessivesPractice(language, days[0]);
      }
    }
  }
  // Auto-translate UI on language select
  languageSelect.addEventListener('change', function() {
    translateUI(languageSelect.value || 'COSYenglish');
    autoTriggerPractice();
  });
  // Auto-update on day select
  daySelect.addEventListener('change', function() {
    autoTriggerPractice();
  });
  // Auto-update on practice type select
  practiceTypeSelect.addEventListener('change', function() {
    autoTriggerPractice();
  });
  // Auto-update on submenu button click
  document.querySelectorAll('.submenu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      autoTriggerPractice();
    });
  });

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

  // --- UI Translation Logic (imported from translations.js) ---
  // Translation logic is now handled in translations.js
  // See translations.js for details on uiTranslations, translateUI, labelMap, navIds, etc.
  // Example usage:
  // translateUI(languageSelect.value || 'COSYenglish');

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
      'COSYespañol': ['el', 'la', 'el/la'],
      'ΚΟΖΥελληνικά': ['ο', 'η', 'το', 'ο/η'],
      'COSYportuguês': ['o', 'a'],
      'ТАКОЙрусский': ['один', 'одна', 'одно'],
      'ԾՈՍՅհայկական': ['ը', 'ն', 'նա', 'ը/ն'],
      'COSYenglish': ['he', 'she', 'it', 'he/she'],
      'default': ['the']
    };
    return articles[language] || articles.default;
  }

  function checkGenderAnswer(selectedBtn, correctAnswer) {
    const feedbackEl = document.querySelector('.gender-feedback');
    const allOptions = document.querySelectorAll('.gender-option');
    allOptions.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
        opt.style.background = '#fffbe6';
        opt.style.color = '#8d6c00';
        opt.style.borderColor = '#ffe082';
    });
    if (selectedBtn.textContent === correctAnswer) {
        selectedBtn.classList.add('correct');
        selectedBtn.style.background = '#c8f7c5';
        selectedBtn.style.color = '#1a6e1a';
        selectedBtn.style.borderColor = '#4CAF50';
        feedbackEl.textContent = 'Correct!';
        feedbackEl.style.color = '#4CAF50';
        // Play correct sound
        const correctSound = document.getElementById('sound-correct');
        if (correctSound) { correctSound.currentTime = 0; correctSound.play(); }
        adventureCorrectAnswer(Number(document.getElementById('day-select')?.value) || 1);
        // Auto-advance to another random word after a short delay
        setTimeout(() => {
            const language = document.getElementById('language-select')?.value;
            const day = Number(document.getElementById('day-select')?.value) || 1;
            showGrammarGenderPractice(language, day);
        }, 900);
    } else {
        selectedBtn.classList.add('incorrect');
        selectedBtn.style.background = '#ffd6d6';
        selectedBtn.style.color = '#b71c1c';
        selectedBtn.style.borderColor = '#F44336';
        // Highlight correct answer
        allOptions.forEach(opt => {
            if (opt.textContent === correctAnswer) {
                opt.classList.add('correct');
                opt.style.background = '#c8f7c5';
                opt.style.color = '#1a6e1a';
                opt.style.borderColor = '#4CAF50';
            }
        });
        feedbackEl.textContent = 'Incorrect!';
        feedbackEl.style.color = '#F44336';
        // Play wrong sound
        const wrongSound = document.getElementById('sound-wrong');
        if (wrongSound) { wrongSound.currentTime = 0; wrongSound.play(); }
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

  // --- Install App on Logo Click ---
  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.style.cursor = 'pointer';
    logoImg.title = 'Install this app';
    logoImg.addEventListener('click', handlePWAInstallAttempt);
  }

  // Utility functions
  // Remove the duplicate randomElement function from here. Use the one from utils.js instead.

  // Use the global unlockSpeechSynthesis utility from utils.js
  if (typeof window.unlockSpeechSynthesis === 'function') {
    window.addEventListener('pointerdown', window.unlockSpeechSynthesis, { once: true });
    window.addEventListener('keydown', window.unlockSpeechSynthesis, { once: true });
  }

  // Ensure speakText is available globally for utils.js and other modules
  window.speakText = speakText;

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

  // On page load, restore language selection from localStorage if available
  const savedLanguage = localStorage.getItem('cosy_selected_language');
  if (savedLanguage && languageSelect) {
    languageSelect.value = savedLanguage;
    // Trigger change event to update UI (flag, translation, etc.)
    languageSelect.dispatchEvent(new Event('change'));
  }

  // Save language selection to localStorage whenever it changes
  languageSelect.addEventListener('change', function() {
    localStorage.setItem('cosy_selected_language', languageSelect.value);
  });
});
