// src/js/language-handler.js

// Function to update all UI elements when language changes
function updateUIForLanguage(language) {
  const t = translations[language] || translations['COSYenglish'];
  // Update all text elements
  document.querySelector('label[for="language"]').textContent = t.chooseLanguage;
  document.querySelector('label[for="day"]').textContent = t.chooseDay;
  document.querySelector('label[for="day-from"]').textContent = t.dayFrom;
  document.querySelector('label[for="day-to"]').textContent = t.dayTo;
  
  // Use ID for "Choose Your Practice" label for robustness
  const choosePracticeLabel = document.getElementById('choose-practice-label');
  if (choosePracticeLabel) {
    choosePracticeLabel.textContent = t.selectPractice;
  }

  // Update main practice buttons
  document.getElementById('vocabulary-btn').textContent = t.vocabulary;
  document.getElementById('grammar-btn').textContent = t.grammar;
  document.getElementById('reading-btn').textContent = t.reading;
  document.getElementById('speaking-btn').textContent = t.speaking;
  document.getElementById('writing-btn').textContent = t.writing;
  document.getElementById('practice-all-btn').textContent = t.practiceAll;

  // Update vocabulary options
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
  document.getElementById('story-btn').textContent = t.story;
  document.getElementById('interesting-fact-btn').textContent = t.interestingFacts;

  // Update speaking options
  document.getElementById('question-practice-btn').textContent = t.question;
  document.getElementById('monologue-btn').textContent = t.monologue;
  document.getElementById('role-play-btn').textContent = t.rolePlay;
  document.getElementById('practice-all-speaking-btn').textContent = t.practiceAll;

  // Update writing options
  document.getElementById('writing-question-btn').textContent = t.question; // Corrected ID
  document.getElementById('storytelling-btn').textContent = t.storytelling;
  document.getElementById('diary-btn').textContent = t.diary;

  // Update ARIA and title attributes for accessibility if available
  if (t.aria && t.aria.practiceAll) {
    document.getElementById('practice-all-btn').setAttribute('aria-label', t.aria.practiceAll);
    document.getElementById('practice-all-btn').title = t.aria.practiceAll;
  }
  // ...repeat for all main and option buttons as needed...

  // Control visibility of the Latinize button
  const latinizeBtn = document.getElementById('toggle-latinization-btn');
  if (latinizeBtn) {
    const visibleLanguages = ['ΚΟΖΥελληνικά', 'ТАКОЙрусский', 'ԾՈՍՅհայկական'];
    if (visibleLanguages.includes(language)) {
      latinizeBtn.style.display = ''; // Or 'inline-block', depending on original styling
    } else {
      latinizeBtn.style.display = 'none';
    }
  }
}

// Initialize language change handler
document.getElementById('language').addEventListener('change', function() {
  const lang = this.value;
  updateUIForLanguage(lang);
  // Refresh latinization after UI text has been updated
  if (typeof window.refreshLatinization === 'function') {
    window.refreshLatinization();
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // restoreUserSelection in index.html now sets the language dropdown to "" if no language is saved.
  // So, we directly use its value.
  const languageSelect = document.getElementById('language');
  const initialLang = languageSelect.value; 

  // updateUIForLanguage should be capable of handling initialLang = "" (Your Language)
  // to set placeholder texts or a neutral UI state.
  // It will use translations[""] or default to COSYenglish if translations[""] is not fully defined.
  updateUIForLanguage(initialLang); 

  // Also refresh latinization on initial load based on the actual initial language
  if (typeof window.refreshLatinization === 'function') {
    window.refreshLatinization();
  }
  // Update the thematic day name display based on the new language
  if (typeof window.updateDaySelectorsVisibility === 'function') {
    window.updateDaySelectorsVisibility(false);
  }
});
