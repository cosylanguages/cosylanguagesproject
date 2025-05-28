// Sound effects for UI interactions
// Preload audio
const clickSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'); // click
const selectSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'); // select (reuse click)
const successSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'); // success (placeholder)
const errorSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'); // error (placeholder)

// Play sound helpers
function playClick() { clickSound.currentTime = 0; clickSound.play(); }
function playSelect() { selectSound.currentTime = 0; selectSound.play(); }
function playSuccess() { successSound.currentTime = 0; successSound.play(); }
function playError() { errorSound.currentTime = 0; errorSound.play(); }

// Adventure/game-like logic: XP, level, streak
let cosyXP = parseInt(localStorage.getItem('cosy_xp') || '0');
let cosyLevel = parseInt(localStorage.getItem('cosy_level') || '1');
let cosyStreak = parseInt(localStorage.getItem('cosy_streak') || '0');

function addXP(amount) {
  cosyXP += amount;
  if (cosyXP >= cosyLevel * 10) {
    cosyXP = 0;
    cosyLevel++;
    playSuccess();
    showToast('🎉 Level up! You are now level ' + cosyLevel + '!');
    let stats = document.getElementById('cosy-gamestats');
    if (stats) {
      stats.classList.add('levelup');
      setTimeout(() => stats.classList.remove('levelup'), 1200);
    }
  }
  localStorage.setItem('cosy_xp', cosyXP);
  localStorage.setItem('cosy_level', cosyLevel);
  updateGameStats();
}
function addStreak() {
  cosyStreak++;
  localStorage.setItem('cosy_streak', cosyStreak);
  updateGameStats();
}
function resetStreak() {
  cosyStreak = 0;
  localStorage.setItem('cosy_streak', cosyStreak);
  updateGameStats();
}
function updateGameStats() {
  let stats = document.getElementById('cosy-gamestats');
  if (!stats) {
    stats = document.createElement('div');
    stats.id = 'cosy-gamestats';
    stats.style.position = 'fixed';
    stats.style.top = '10px';
    stats.style.right = '10px';
    stats.style.background = 'rgba(0,189,189,0.92)';
    stats.style.color = '#fff';
    stats.style.padding = '10px 18px';
    stats.style.borderRadius = '12px';
    stats.style.fontWeight = 'bold';
    stats.style.zIndex = '9999';
    stats.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
    document.body.appendChild(stats);
  }
  stats.innerHTML = `XP: ${cosyXP} | Level: ${cosyLevel} | Streak: ${cosyStreak}`;
}
function showToast(msg) {
  let toast = document.createElement('div');
  toast.textContent = msg;
  toast.className = 'cosy-toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#00bdbd';
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '10px';
  toast.style.fontWeight = 'bold';
  toast.style.fontSize = '1.1rem';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 1800);
}
window.addEventListener('DOMContentLoaded', updateGameStats);

// Award XP and streaks for correct answers in any activity
function awardCorrectAnswer() {
  addXP(3);
  addStreak();
}

// Utility: call awardCorrectAnswer and mark element
function markAndAward(el) {
  if (!el.classList.contains('xp-awarded')) {
    el.classList.add('xp-awarded');
    awardCorrectAnswer();
  }
}

// Patch correct answer feedback in result area for all activities
const observer = new MutationObserver(() => {
  // Look for correct feedback in all known activities
  // 1. Vocabulary/listening/image: green span
  document.querySelectorAll('.result-area span[style*="#27ae60"]').forEach(markAndAward);
  // 2. Grammar gender: green span in #gender-feedback
  document.querySelectorAll('#gender-feedback span[style*="#27ae60"]').forEach(markAndAward);
  // 3. Grammar verbs: green span in #verb-answer-feedback
  document.querySelectorAll('#verb-answer-feedback span[style*="#27ae60"]').forEach(markAndAward);
  // 4. Speaking: green feedback (if any, future-proof)
  document.querySelectorAll('#speaking-feedback span[style*="#27ae60"]').forEach(markAndAward);
});
observer.observe(document.getElementById('result'), { childList: true, subtree: true });
// Also observe grammar/speaking feedback containers
['gender-feedback','verb-answer-feedback','speaking-feedback'].forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el, { childList: true, subtree: true });
});

// --- Spaced Repetition System (SRS) ---
// Store review data in localStorage per language/element
function getSRSKey(language, type, value) {
  return `cosy_srs_${language}_${type}_${value}`;
}
// --- SRS for all activity types ---
function scheduleReview(language, type, value, correct) {
  const key = getSRSKey(language, type, value);
  let data = JSON.parse(localStorage.getItem(key) || '{}');
  const now = Date.now();
  if (!data.interval) data.interval = 1 * 60 * 60 * 1000; // 1 hour default
  if (!data.ease) data.ease = 2.5;
  if (!data.due) data.due = now;
  if (!data.reps) data.reps = 0;
  if (correct) {
    data.reps++;
    data.interval = Math.round(data.interval * data.ease);
    data.due = now + data.interval;
    data.ease = Math.min(data.ease + 0.15, 3.0);
  } else {
    data.reps = 0;
    data.interval = 1 * 60 * 60 * 1000; // reset to 1 hour
    data.due = now + data.interval;
    data.ease = Math.max(data.ease - 0.2, 1.3);
  }
  localStorage.setItem(key, JSON.stringify(data));
}
function getDueReviews(language, type, items) {
  const now = Date.now();
  return items.filter(value => {
    const key = getSRSKey(language, type, value);
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return !data.due || data.due <= now;
  });
}
// --- SRS hooks for all activities ---
window.scheduleReview = scheduleReview;

// --- Revision Mode UI ---
function showRevisionButton(type, items, language) {
  let btn = document.getElementById('cosy-revision-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'cosy-revision-btn';
    btn.className = 'btn-primary';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.textContent = '🔁 Review Due';
    document.body.appendChild(btn);
  }
  btn.onclick = async function() {
    const due = getDueReviews(language, type, items);
    if (!due.length) {
      showToast('No items due for review!');
      return;
    }
    // Pick a random due item and trigger practice for it
    if (type === 'vocabulary') {
      await window.practiceVocabulary('random-word', due[Math.floor(Math.random()*due.length)]);
    } else if (type === 'verbs') {
      await window.practiceGrammar('verbs', due[Math.floor(Math.random()*due.length)]);
    } // Extend for other types as needed
  };
}

// --- Patch practice functions to use SRS ---
// Save original functions
window._practiceVocabulary = window.practiceVocabulary;
window._practiceGrammar = window.practiceGrammar;
window.practiceVocabulary = async function(type, forceWord) {
  const language = document.getElementById('language').value;
  // If forceWord is set, use it for review
  if (forceWord) {
    // Simulate the UI for a specific word (vocabulary)
    // You may need to adapt this for your actual UI logic
    // ...existing code for showing the word and answer UI...
    // On correct/incorrect, call scheduleReview(language, 'vocabulary', forceWord, correct)
    // For brevity, not duplicating the full UI code here
    return;
  }
  await window._practiceVocabulary(type);
  // After showing, show revision button if there are due items
  // (Assume you have access to all items for the day)
  // ...fetch items, then...
  // showRevisionButton('vocabulary', items, language);
};
window.practiceGrammar = async function(type, forceItem) {
  const language = document.getElementById('language').value;
  if (forceItem) {
    // Simulate the UI for a specific grammar item
    // On correct/incorrect, call scheduleReview(language, type, forceItem, correct)
    return;
  }
  await window._practiceGrammar(type);
  // After showing, show revision button if there are due items
  // ...fetch items, then...
  // showRevisionButton(type, items, language);
};

// --- Make practice more memorable/productive ---
// 1. Add emoji feedback for correct/incorrect
function showEmojiFeedback(correct) {
  showToast(correct ? '🎉 Great! That sticks!' : '🤔 Try again, you can do it!');
}
// 2. Add random fun fact or mnemonic
function showFunFact(language) {
  const t = translations[language] || translations['COSYenglish'];
  const facts = t.funFacts || translations['COSYenglish'].funFacts;
  showToast(facts[Math.floor(Math.random()*facts.length)]);
}
// 3. Add confetti for level up
function confetti() {
  // Simple confetti effect
  for (let i=0; i<30; i++) {
    let c = document.createElement('div');
    c.textContent = '🎊';
    c.style.position = 'fixed';
    c.style.left = Math.random()*100+'vw';
    c.style.top = '-40px';
    c.style.fontSize = '2rem';
    c.style.zIndex = '9999';
    c.style.transition = 'top 1.2s cubic-bezier(.23,1.01,.32,1)';
    document.body.appendChild(c);
    setTimeout(()=>{c.style.top = (Math.random()*60+20)+'vh';}, 10);
    setTimeout(()=>{c.remove();}, 1400);
  }
}
// Patch addXP to show confetti on level up
const _addXP = addXP;
addXP = function(amount) {
  const prevLevel = cosyLevel;
  _addXP(amount);
  if (cosyLevel > prevLevel) confetti();
};

// --- PRACTICE ALL: Add new types of practice ---
window.practiceAllTypes = [
  'vocabulary',
  'grammar',
  'speaking',
  'match',
  'truefalse',
  'choose4audio',
  'choose4image',
];

// Helper: get all words/images for current language/day
async function getAllPracticeItems(language, days) {
  // Fetch all words for vocabulary
  let vocab = [];
  for (let day of days) {
    const file = getVocabularyFile(language);
    if (file) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const data = await response.json();
          vocab = vocab.concat(data[day] || []);
        }
      } catch {}
    }
  }
  // Fetch all images for image match
  let images = [];
  try {
    const response = await fetch('vocabulary/images/vocabulary_images.json');
    if (response.ok) {
      const data = await response.json();
      for (let day of days) images = images.concat(data[day] || []);
    }
  } catch {}
  return { vocab, images };
}

// --- Match the words (word <-> translation or word <-> image) ---
async function practiceMatch(language, days) {
  const { vocab, images } = await getAllPracticeItems(language, days);
  let pairs = [];
  if (images.length >= 4) {
    pairs = images.slice(0, 4).map(img => ({ word: img.translations[language], img: img.src, id: img.src }));
  } else if (vocab.length >= 4) {
    pairs = vocab.slice(0, 4).map(word => ({ word, translation: word, id: word }));
  }
  if (!pairs.length) return showToast('Not enough items for match!');
  // Shuffle
  let left = pairs.map(p => ({ ...p }));
  let right = pairs.map(p => ({ ...p }));
  left = left.sort(() => Math.random() - 0.5);
  right = right.sort(() => Math.random() - 0.5);
  // Render UI
  let html = '<div class="match-container">';
  html += '<div class="match-col match-left">';
  left.forEach((p, i) => {
    html += `<div class="match-item match-left-item" draggable="true" data-id="${p.id}" tabindex="0">${p.word}</div>`;
  });
  html += '</div>';
  html += '<div class="match-col match-right">';
  right.forEach((p, i) => {
    if (p.img) {
      html += `<div class="match-item match-right-item" data-id="${p.id}" tabindex="0"><img src="${p.img}" alt="" style="max-width:80px;max-height:80px;border-radius:10px;box-shadow:0 2px 8px #00bdbd33;"></div>`;
    } else {
      html += `<div class="match-item match-right-item" data-id="${p.id}" tabindex="0">${p.word}</div>`;
    }
  });
  html += '</div>';
  html += '</div>';
  html += '<div id="match-feedback" style="margin-top:18px;"></div>';
  document.getElementById('result').innerHTML = html;
  // Drag and drop logic
  let selected = null;
  document.querySelectorAll('.match-left-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.match-left-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      selected = item;
    });
  });
  document.querySelectorAll('.match-right-item').forEach(item => {
    item.addEventListener('click', () => {
      if (selected) {
        const leftId = selected.getAttribute('data-id');
        const rightId = item.getAttribute('data-id');
        if (leftId === rightId) {
          selected.classList.add('matched');
          item.classList.add('matched');
          selected.classList.remove('selected');
          selected = null;
          document.getElementById('match-feedback').innerHTML = '<span style="color:#27ae60;">✅ Matched!</span>';
          awardCorrectAnswer();
          scheduleReview(language, 'match', leftId, true);
          showFunFact(language);
        } else {
          document.getElementById('match-feedback').innerHTML = '<span style="color:#e74c3c;">❌ Not a match!</span>';
          scheduleReview(language, 'match', leftId, false);
          showFunFact(language);
        }
      }
    });
  });
  showFunFact();
}

// --- True or False ---
async function practiceTrueFalse(language, days) {
  const { vocab } = await getAllPracticeItems(language, days);
  const t = translations[language] || translations['COSYenglish'];
  let word = vocab[Math.floor(Math.random()*vocab.length)];
  let isTrue = Math.random() > 0.5;
  let fake = vocab[Math.floor(Math.random()*vocab.length)];
  let statement = isTrue ? `${word} ${t['means'] ? t['means'] : 'means'} <b>${word}</b>` : `${word} ${t['means'] ? t['means'] : 'means'} <b>${fake}</b>`;
  let html = `<div class="tf-container">
    <div class="tf-statement" style="font-size:1.2em;margin-bottom:18px;">${statement}</div>
    <div class="tf-btns" style="display:flex;gap:22px;justify-content:center;margin-bottom:12px;">
      <button id="true-btn" class="btn-secondary" style="min-width:90px;font-size:1.1em;">✅ ${t['true'] ? t['true'] : 'True'}</button>
      <button id="false-btn" class="btn-secondary" style="min-width:90px;font-size:1.1em;">❌ ${t['false'] ? t['false'] : 'False'}</button>
    </div>
    <div id="tf-feedback" style="margin-top:10px;"></div>
  </div>`;
  document.getElementById('result').innerHTML = html;
  const nextExercise = () => setTimeout(() => practiceTrueFalse(language, days), 1200);
  document.getElementById('true-btn').onclick = () => {
    let correct = isTrue;
    document.getElementById('tf-feedback').innerHTML = correct ? `<span style=\"color:#27ae60;\">✅ ${t['correct'] ? t['correct'] : 'Correct!'}</span>` : `<span style=\"color:#e74c3c;\">❌ ${t['wrong'] ? t['wrong'] : 'Wrong!'}</span>`;
    scheduleReview(language, 'truefalse', word, correct);
    if (correct) awardCorrectAnswer();
    showFunFact(language);
    nextExercise();
  };
  document.getElementById('false-btn').onclick = () => {
    let correct = !isTrue;
    document.getElementById('tf-feedback').innerHTML = correct ? `<span style=\"color:#27ae60;\">✅ ${t['correct'] ? t['correct'] : 'Correct!'}</span>` : `<span style=\"color:#e74c3c;\">❌ ${t['wrong'] ? t['wrong'] : 'Wrong!'}</span>`;
    scheduleReview(language, 'truefalse', word, correct);
    if (correct) awardCorrectAnswer();
    showFunFact(language);
    nextExercise();
  };
}

// --- Choose from 4 options ---
// (This exercise is now deprecated and not used in practiceAll or menu)
// function practiceChoose4(language, days) { ... }
// --- Choose the Pronounced Word (Audio) ---
async function practiceChoosePronounced(language, days) {
  const t = translations[language] || translations['COSYenglish'];
  const { vocab } = await getAllPracticeItems(language, days);
  let correct = vocab[Math.floor(Math.random()*vocab.length)];
  let options = [correct];
  while (options.length < 4) {
    let w = vocab[Math.floor(Math.random()*vocab.length)];
    if (!options.includes(w)) options.push(w);
  }
  options = options.sort(() => Math.random() - 0.5);
  let html = `<div class="choose4-container">
    <div class="choose4-question" style="font-size:1.2em;margin-bottom:18px;">🔊 ${t['chooseCorrect'] ? t['chooseCorrect'] : 'Which is correct?'}</div>
    <button id="pronounce-btn" class="btn-secondary" style="margin-bottom:14px;">🔊 ${t['listen'] ? t['listen'] : 'Listen'}</button>
    <div class="choose4-options">`;
  options.forEach(opt => {
    html += `<button class="choose4-btn btn-secondary">${opt}</button>`;
  });
  html += '</div><div id="choose4-feedback" style="margin-top:10px;"></div></div>';
  document.getElementById('result').innerHTML = html;
  // Speech synthesis
  function pronounce(word) {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = getLangCode(language);
      window.speechSynthesis.speak(utter);
    }
  }
  document.getElementById('pronounce-btn').onclick = () => pronounce(correct);
  // Auto-pronounce on load
  pronounce(correct);
  const nextExercise = () => setTimeout(() => practiceChoosePronounced(language, days), 1200);
  document.querySelectorAll('.choose4-btn').forEach(btn => {
    btn.onclick = () => {
      let isCorrect = btn.textContent === correct;
      btn.classList.add(isCorrect ? 'correct' : 'incorrect');
      document.getElementById('choose4-feedback').innerHTML = isCorrect ? `<span style=\"color:#27ae60;\">✅ ${t['correct'] ? t['correct'] : 'Correct!'}</span>` : `<span style=\"color:#e74c3c;\">❌ ${t['wrong'] ? t['wrong'] : 'Wrong!'} ${t['correct'] ? t['correct'] : 'Correct:'} ${correct}</span>`;
      scheduleReview(language, 'choose4audio', correct, isCorrect);
      if (isCorrect) awardCorrectAnswer();
      showFunFact(language);
      setTimeout(() => {
        document.querySelectorAll('.choose4-btn').forEach(b => b.disabled = true);
        nextExercise();
      }, 400);
    };
  });
}

// Helper: get language code for speech synthesis
function getLangCode(language) {
  switch(language) {
    case 'COSYenglish': return 'en';
    case 'COSYitaliano': return 'it';
    case 'COSYfrançais': return 'fr';
    case 'COSYespañol': return 'es';
    case 'COSYdeutsch': return 'de';
    case 'COSYportuguês': return 'pt';
    case 'ΚΟΖΥελληνικά': return 'el';
    case 'ТАКОЙрусский': return 'ru';
    case 'ԾՈՍՅհայկական': return 'hy';
    case 'COSYbrezhoneg': return 'br';
    case 'COSYtatarça': return 'tt';
    case 'COSYbashkort': return 'ba';
    default: return 'en';
  }
}

// --- Choose the Word for the Image ---
async function practiceChooseImage(language, days) {
  const t = translations[language] || translations['COSYenglish'];
  const { images } = await getAllPracticeItems(language, days);
  if (!images.length) return showToast(t['noImages'] || 'No images available!');
  let correct = images[Math.floor(Math.random()*images.length)];
  let options = [correct.translations[language]];
  while (options.length < 4) {
    let w = images[Math.floor(Math.random()*images.length)].translations[language];
    if (!options.includes(w)) options.push(w);
  }
  options = options.sort(() => Math.random() - 0.5);
  let html = `<div class="choose4-container">
    <div class="choose4-question" style="font-size:1.2em;margin-bottom:18px;">🖼️ ${t['chooseCorrect'] ? t['chooseCorrect'] : 'Which is correct?'}</div>
    <img src="${correct.src}" alt="" class="vocabulary-image" style="margin-bottom:18px;max-width:120px;max-height:120px;"/>
    <div class="choose4-options">`;
  options.forEach(opt => {
    html += `<button class="choose4-btn btn-secondary">${opt}</button>`;
  });
  html += '</div><div id="choose4-feedback" style="margin-top:10px;"></div></div>';
  document.getElementById('result').innerHTML = html;
  const nextExercise = () => setTimeout(() => practiceChooseImage(language, days), 1200);
  document.querySelectorAll('.choose4-btn').forEach(btn => {
    btn.onclick = () => {
      let isCorrect = btn.textContent === correct.translations[language];
      btn.classList.add(isCorrect ? 'correct' : 'incorrect');
      document.getElementById('choose4-feedback').innerHTML = isCorrect ? `<span style=\"color:#27ae60;\">✅ ${t['correct'] ? t['correct'] : 'Correct!'}</span>` : `<span style=\"color:#e74c3c;\">❌ ${t['wrong'] ? t['wrong'] : 'Wrong!'} ${t['correct'] ? t['correct'] : 'Correct:'} ${correct.translations[language]}</span>`;
      scheduleReview(language, 'choose4image', correct.src, isCorrect);
      if (isCorrect) awardCorrectAnswer();
      showFunFact(language);
      setTimeout(() => {
        document.querySelectorAll('.choose4-btn').forEach(b => b.disabled = true);
        nextExercise();
      }, 400);
    };
  });
}

// --- Choose the Correct Verb Form ---
async function practiceChooseVerbForm(language, days) {
  const t = translations[language] || translations['COSYenglish'];
  // Fetch verbs for the language
  let verbs = [];
  try {
    const file = `grammar/verbs/grammar_verbs_${getLangFileName(language)}.json`;
    const response = await fetch(file);
    if (response.ok) {
      verbs = await response.json();
    }
  } catch {}
  if (!verbs.length) return showToast(t['noVerbs'] || 'No verbs available!');
  // Pick a random verb and form
  let verb = verbs[Math.floor(Math.random()*verbs.length)];
  let forms = verb.forms || [];
  if (!forms.length) return showToast(t['noVerbForms'] || 'No verb forms!');
  let correct = forms[Math.floor(Math.random()*forms.length)];
  let options = [correct];
  while (options.length < 4) {
    let f = forms[Math.floor(Math.random()*forms.length)];
    if (!options.includes(f)) options.push(f);
  }
  options = options.sort(() => Math.random() - 0.5);
  let html = `<div class="choose4-container">
    <div class="choose4-question" style="font-size:1.2em;margin-bottom:18px;">⚡ ${t['chooseVerbForm'] || 'Choose the correct verb form:'} <b>${verb.infinitive}</b></div>
    <div class="choose4-options">`;
  options.forEach(opt => {
    html += `<button class="choose4-btn btn-secondary">${opt}</button>`;
  });
  html += '</div><div id="choose4-feedback" style="margin-top:10px;"></div></div>';
  document.getElementById('result').innerHTML = html;
  const nextExercise = () => setTimeout(() => practiceChooseVerbForm(language, days), 1200);
  document.querySelectorAll('.choose4-btn').forEach(btn => {
    btn.onclick = () => {
      let isCorrect = btn.textContent === correct;
      btn.classList.add(isCorrect ? 'correct' : 'incorrect');
      document.getElementById('choose4-feedback').innerHTML = isCorrect ? `<span style=\"color:#27ae60;\">✅ ${t['correct'] ? t['correct'] : 'Correct!'}</span>` : `<span style=\"color:#e74c3c;\">❌ ${t['wrong'] ? t['wrong'] : 'Wrong!'} ${t['correct'] ? t['correct'] : 'Correct:'} ${correct}</span>`;
      scheduleReview(language, 'choose4verb', verb.infinitive + ':' + correct, isCorrect);
      if (isCorrect) awardCorrectAnswer();
      showFunFact(language);
      setTimeout(() => {
        document.querySelectorAll('.choose4-btn').forEach(b => b.disabled = true);
        nextExercise();
      }, 400);
    };
  });
}

// Helper: get language file name for verbs/gender
function getLangFileName(language) {
  switch(language) {
    case 'COSYenglish': return 'english';
    case 'COSYitaliano': return 'italian';
    case 'COSYfrançais': return 'french';
    case 'COSYespañol': return 'spanish';
    case 'COSYdeutsch': return 'german';
    case 'COSYportuguês': return 'portuguese';
    case 'ΚΟΖΥελληνικά': return 'greek';
    case 'ТАКОЙрусский': return 'russian';
    case 'ԾՈՍՅհայկական': return 'armenian';
    case 'COSYbrezhoneg': return 'breton';
    case 'COSYtatarça': return 'tatar';
    case 'COSYbashkort': return 'bashkir';
    default: return 'english';
  }
}

// --- Choose the Word for the Article (Gender) ---
async function practiceChooseGender(language, days) {
  const t = translations[language] || translations['COSYenglish'];
  // Fetch gender data for the language
  let genderData = [];
  try {
    const file = `grammar/gender/grammar_gender_${getLangFileName(language)}.json`;
    const response = await fetch(file);
    if (response.ok) {
      genderData = await response.json();
    }
  } catch {}
  if (!genderData.length) return showToast(t['noGender'] || 'No gender data!');
  // Pick a random article and its correct word
  let item = genderData[Math.floor(Math.random()*genderData.length)];
  let correct = item.word;
  let options = [correct];
  while (options.length < 4) {
    let w = genderData[Math.floor(Math.random()*genderData.length)].word;
    if (!options.includes(w)) options.push(w);
  }
  options = options.sort(() => Math.random() - 0.5);
  let html = `<div class="choose4-container">
    <div class="choose4-question" style="font-size:1.2em;margin-bottom:18px;">⚖️ ${t['chooseGender'] || 'Choose the word for the article:'} <b>${item.article}</b></div>
    <div class="choose4-options">`;
  options.forEach(opt => {
    html += `<button class="choose4-btn btn-secondary">${opt}</button>`;
  });
  html += '</div><div id="choose4-feedback" style="margin-top:10px;"></div></div>';
  document.getElementById('result').innerHTML = html;
  const nextExercise = () => setTimeout(() => practiceChooseGender(language, days), 1200);
  document.querySelectorAll('.choose4-btn').forEach(btn => {
    btn.onclick = () => {
      let isCorrect = btn.textContent === correct;
      btn.classList.add(isCorrect ? 'correct' : 'incorrect');
      document.getElementById('choose4-feedback').innerHTML = isCorrect ? `<span style=\"color:#27ae60;\">✅ ${t['correct'] ? t['correct'] : 'Correct!'}</span>` : `<span style=\"color:#e74c3c;\">❌ ${t['wrong'] ? t['wrong'] : 'Wrong!'} ${t['correct'] ? t['correct'] : 'Correct:'} ${correct}</span>`;
      scheduleReview(language, 'choose4gender', item.article + ':' + correct, isCorrect);
      if (isCorrect) awardCorrectAnswer();
      showFunFact(language);
      setTimeout(() => {
        document.querySelectorAll('.choose4-btn').forEach(b => b.disabled = true);
        nextExercise();
      }, 400);
    };
  });
}

// --- Patch Practice All button ---
const origPracticeAll = document.getElementById('practice-all-btn').onclick;
document.getElementById('practice-all-btn').onclick = async function() {
  const days = getSelectedDays();
  const language = document.getElementById('language').value;
  if (!days.length || !language) return showToast('Select language and day!');
  // Randomly pick a type from expanded list
  const type = window.practiceAllTypes[Math.floor(Math.random()*window.practiceAllTypes.length)];
  if (type === 'vocabulary') await window.practiceVocabulary('random-word');
  else if (type === 'grammar') await window.practiceGrammar('verbs');
  else if (type === 'speaking') await practiceSpeaking();
  else if (type === 'match') await practiceMatch(language, days);
  else if (type === 'truefalse') await practiceTrueFalse(language, days);
  else if (type === 'choose4audio') await practiceChoosePronounced(language, days);
  else if (type === 'choose4image') await practiceChooseImage(language, days);
  else if (origPracticeAll) origPracticeAll();
};
