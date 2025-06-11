// src/js/language-handler.js

// Function to update all UI elements when language changes
function updateUIForLanguage(language) {
  const t = translations[language] || translations['COSYenglish'];
  // Update all text elements
  document.querySelector('label[for="language"]').textContent = t.chooseLanguage;
  document.querySelector('label[for="day"]').textContent = t.chooseDay;
  document.querySelector('label[for="day-from"]').textContent = t.dayFrom;
  document.querySelector('label[for="day-to"]').textContent = t.dayTo;
  document.querySelectorAll('.menu-section label')[1].textContent = t.selectPractice;

  // Update main practice buttons
  document.getElementById('vocabulary-btn').textContent = t.vocabulary;
  document.getElementById('grammar-btn').textContent = t.grammar;
  document.getElementById('reading-btn').textContent = t.reading;
  document.getElementById('speaking-btn').textContent = t.speaking;
  document.getElementById('writing-btn').textContent = t.writing;
  document.getElementById('practice-all-btn').textContent = t.practiceAll;

  // Update vocabulary options
  document.getElementById('daily-word-btn').textContent = t.dailyWord;
  document.getElementById('random-word-btn').textContent = t.randomWord;
  document.getElementById('random-image-btn').textContent = t.randomImage;
  document.getElementById('listening-btn').textContent = t.listening;
  document.getElementById('practice-all-vocab-btn').textContent = t.practiceAll;

  // Update grammar options
  document.getElementById('gender-btn').textContent = t.gender;
  document.getElementById('verbs-btn').textContent = t.verbs;
  document.getElementById('possessives-btn').textContent = t.possessives;
  document.getElementById('practice-all-grammar-btn').textContent = t.practiceAll;

  // Update reading options
  document.getElementById('daily-reading-btn').textContent = t.dailyReading;
  document.getElementById('story-btn').textContent = t.story;
  document.getElementById('interesting-fact-btn').textContent = t.interestingFacts;

  // Update speaking options
  document.getElementById('daily-speaking-btn').textContent = t.dailySpeaking;
  document.getElementById('question-practice-btn').textContent = t.question;
  document.getElementById('monologue-btn').textContent = t.monologue;
  document.getElementById('role-play-btn').textContent = t.rolePlay;
  document.getElementById('practice-all-speaking-btn').textContent = t.practiceAll;

  // Update writing options
  document.getElementById('daily-writing-btn').textContent = t.dailyWriting;
  document.getElementById('question-btn').textContent = t.question;
  document.getElementById('storytelling-btn').textContent = t.storytelling;
  document.getElementById('diary-btn').textContent = t.diary;

  // Update ARIA and title attributes for accessibility if available
  if (t.aria && t.aria.practiceAll) {
    document.getElementById('practice-all-btn').setAttribute('aria-label', t.aria.practiceAll);
    document.getElementById('practice-all-btn').title = t.aria.practiceAll;
  }
  // ...repeat for all main and option buttons as needed...
}

// Initialize language change handler
document.getElementById('language').addEventListener('change', function() {
  const lang = this.value;
  updateUIForLanguage(lang);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const lang = document.getElementById('language').value || 'COSYenglish';
  updateUIForLanguage(lang);
});