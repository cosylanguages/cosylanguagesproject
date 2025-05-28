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
