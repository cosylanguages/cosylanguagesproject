// UI Visibility Management

function updateUIVisibilityForDay(selectedDay, selectedLanguage) {
    // Ensure selectedDay is a number; it might be NaN if parsing failed or value was empty.
    const day = Number(selectedDay);

    // Fallback to English if selectedLanguage is not found in translations
    const currentTranslations = translations[selectedLanguage] || translations.COSYenglish;

    // Main practice category buttons and their option panels
    const grammarOptionsEl = document.getElementById('grammar-options');
    const grammarOptionsContainer = document.querySelector('#grammar-options .grammar-options'); 
    
    const readingBtnEl = document.getElementById('reading-btn');
    const readingOptionsEl = document.getElementById('reading-options');
    
    const speakingBtnEl = document.getElementById('speaking-btn'); 
    const speakingOptionsEl = document.getElementById('speaking-options');
    
    const writingBtnEl = document.getElementById('writing-btn');   
    const writingOptionsEl = document.getElementById('writing-options');

    // Speaking sub-option buttons
    const questionPracticeBtn = document.getElementById('question-practice-btn'); 
    const monologueBtn = document.getElementById('monologue-btn');
    const rolePlayBtn = document.getElementById('role-play-btn');
    const practiceAllSpeakingBtn = document.getElementById('practice-all-speaking-btn');

    // Writing sub-option buttons
    const writingQuestionBtn = document.getElementById('writing-question-btn'); 
    const storytellingBtn = document.getElementById('storytelling-btn');
    const diaryBtn = document.getElementById('diary-btn');

    // Initial checks for element existence (optional, for debugging)
    // ... console.warn if elements not found ...
    
    // --- Handle Invalid Day Globally for all sections first ---
    if (isNaN(day) || day <= 0) {
        if (grammarOptionsEl) grammarOptionsEl.style.display = 'none';
        if (grammarOptionsContainer) grammarOptionsContainer.innerHTML = '';
        if (readingBtnEl) readingBtnEl.style.display = 'none';
        if (readingOptionsEl) readingOptionsEl.style.display = 'none';
        if (speakingBtnEl) speakingBtnEl.style.display = 'none'; 
        if (speakingOptionsEl) speakingOptionsEl.style.display = 'none';
        if (writingBtnEl) writingBtnEl.style.display = 'none'; 
        if (writingOptionsEl) writingOptionsEl.style.display = 'none';
        return; 
    }

    // --- Default visibility for main category buttons (can be overridden below) ---
    // Vocabulary button is always visible if day is valid.
    // Assuming grammarBtnEl, readingBtnEl etc. are defined or checked before use.
    const grammarBtnMain = document.getElementById('grammar-btn'); // Defined here for safety
    const vocabBtnMain = document.getElementById('vocabulary-btn'); // For completeness

    if(vocabBtnMain) vocabBtnMain.style.display = 'inline-block';
    if (grammarBtnMain) grammarBtnMain.style.display = 'inline-block';
    if (readingBtnEl) readingBtnEl.style.display = 'inline-block';
    if (speakingBtnEl) speakingBtnEl.style.display = 'inline-block';
    if (writingBtnEl) writingBtnEl.style.display = 'inline-block';


    // --- Grammar Section Visibility ---
    if (grammarOptionsEl && grammarOptionsContainer) {
        grammarOptionsContainer.innerHTML = ''; 
        if (day === 1 && selectedLanguage === 'COSYenglish') {
             if(grammarBtnMain) grammarBtnMain.style.display = 'none';
             if(grammarOptionsEl) grammarOptionsEl.style.display = 'none'; // Also hide the panel
        } else if (day === 1 && selectedLanguage !== 'COSYenglish') {
            if(grammarBtnMain) grammarBtnMain.style.display = 'inline-block';
            updateGrammarOptions(); 
        } else if (day > 1) {
            if(grammarBtnMain) grammarBtnMain.style.display = 'inline-block';
            updateGrammarOptions();
        }
    } 

    // --- Reading Section Visibility (Main button) ---
    if (readingBtnEl) { 
        if (day === 1) { 
            readingBtnEl.style.display = 'none'; 
        } else { 
            readingBtnEl.style.display = 'inline-block'; 
        }
    }
    
    // --- Speaking Sub-Options Visibility (within speakingOptionsEl) ---
    if (speakingOptionsEl) { 
        [questionPracticeBtn, monologueBtn, rolePlayBtn, practiceAllSpeakingBtn].forEach(btn => {
            if (btn) btn.style.display = ''; 
        });
        if (day === 1) {
            if (monologueBtn) monologueBtn.style.display = 'none';
        }
    }

    // --- Writing Sub-Options Visibility (within writingOptionsEl) ---
    if (writingOptionsEl) { 
        [writingQuestionBtn, storytellingBtn, diaryBtn].forEach(btn => {
            if (btn) btn.style.display = '';
        });
        if (day === 1) {
            if (storytellingBtn) storytellingBtn.style.display = 'none';
            if (diaryBtn) diaryBtn.style.display = 'none';
        }
    }
    console.log(`DEBUG: updateUIVisibilityForDay finished for Day: ${day}, Language: ${selectedLanguage}`);
}


// Update grammar options based on selected day or range
function updateGrammarOptions() {
    const lang = document.getElementById('language').value;
    const t = translations[lang] || translations['COSYenglish'];
    const days = getSelectedDays(); 
    const grammarOptionsContainer = document.querySelector('#grammar-options .grammar-options');

    if (!grammarOptionsContainer) return;
    grammarOptionsContainer.innerHTML = ''; 

    if (!days || !days.length) { 
        const noDayMsg = document.createElement('p');
        noDayMsg.textContent = t.selectDay || "Please select a day."; 
        grammarOptionsContainer.appendChild(noDayMsg);
        return;
    }
    
    const day = parseInt(days[0]); 

    if (day === 1 && lang === 'COSYenglish') {
        return;
    }
    
    let optionsAdded = false; // Flag to check if any button is added

    if (day >= 1) { 
        const genderBtn = document.createElement('button');
        genderBtn.id = 'gender-btn'; // Use static ID for setupOptionToggle
        genderBtn.textContent = t.gender || 'Gender';
        genderBtn.className = 'btn-secondary option-btn'; 
        grammarOptionsContainer.appendChild(genderBtn);
        optionsAdded = true;
    }
    if (day >= 2) {
        const verbBtn = document.createElement('button');
        verbBtn.id = 'verbs-btn'; // Use static ID
        verbBtn.textContent = t.verbs || 'Verbs';
        verbBtn.className = 'btn-secondary option-btn';
        grammarOptionsContainer.appendChild(verbBtn);
        optionsAdded = true;
    }
    if (day >= 3) {
        const possBtn = document.createElement('button');
        possBtn.id = 'possessives-btn'; // Use static ID
        possBtn.textContent = t.possessives || 'Possessives';
        possBtn.className = 'btn-secondary option-btn';
        grammarOptionsContainer.appendChild(possBtn);
        optionsAdded = true;
    }
  
    if (optionsAdded){ // Only add "Practice All" if there are other options
        const practiceAllGrammarBtn = document.createElement('button');
        practiceAllGrammarBtn.id = 'practice-all-grammar-btn'; // Use static ID
        practiceAllGrammarBtn.textContent = t.practiceAll || 'Practice All';
        practiceAllGrammarBtn.className = 'btn-secondary option-btn';
        grammarOptionsContainer.appendChild(practiceAllGrammarBtn);
    }

    if (typeof setupOptionToggle === 'function' && grammarOptionsContainer.children.length > 0) {
        const buttonIds = Array.from(grammarOptionsContainer.children).map(btn => btn.id).filter(id => id);
        const practiceFns = buttonIds.map(id => {
            if (id === 'gender-btn') return () => practiceGrammar('gender');
            if (id === 'verbs-btn') return () => practiceGrammar('verbs');
            if (id === 'possessives-btn') return () => practiceGrammar('possessives');
            if (id === 'practice-all-grammar-btn') return practiceAllGrammar;
            return () => {}; 
        });
        setupOptionToggle('grammar-options', buttonIds, practiceFns);
    }
}

function showPracticeAllButtons() {
    const practiceAllBtn = document.getElementById('practice-all-btn');
    const practiceAllVocabBtn = document.getElementById('practice-all-vocab-btn');
    const practiceAllGrammarBtn = document.getElementById('practice-all-grammar-btn');
    const practiceAllSpeakingBtn = document.getElementById('practice-all-speaking-btn');
    // Assuming there isn't a specific "practice-all-reading-btn" or "practice-all-writing-btn"
    // based on common patterns, but they could be added if they exist.

    if (practiceAllBtn) practiceAllBtn.style.display = 'inline-block'; // Main practice all
    
    // These are sub-option "Practice All" buttons, their visibility is typically
    // controlled when their respective main category (e.g., vocabulary-options) is visible.
    // However, goBackToMainMenu implies resetting to a state where these *could* be shown
    // if their parent category was the last one open, or if they are meant to be shown alongside
    // the main practiceAllBtn. For now, ensure they are visible if their parent panel would be.
    // This might need refinement based on exact UI flow desired when coming "back to main menu".
    // A simpler approach for goBackToMainMenu is that it just shows *all main categories* and the *main* practice-all-btn.
    // The sub-practice-all buttons would appear when a category like "Vocabulary" is selected.
    // The current goBackToMainMenu already makes the main practiceAllBtn visible.
    // Let's assume this function is primarily for the main #practice-all-btn.
    // If the others need to be shown, their parent containers also need to be visible.
}
window.showPracticeAllButtons = showPracticeAllButtons;


// --- Hide/show day and day-from/day-to options depending on selection ---
function updateDaySelectors() {
    const daySelect = document.getElementById('day');
    const dayFromSelect = document.getElementById('day-from');
    const dayToSelect = document.getElementById('day-to');

    if (!daySelect || !dayFromSelect || !dayToSelect) return; 

    const day = daySelect.value;
    const dayFrom = dayFromSelect.value;
    const dayTo = dayToSelect.value;

    const dayFromParent = dayFromSelect.parentElement;
    const dayToParent = dayToSelect.parentElement;

    if (!dayFromParent || !dayToParent) return; 

    if (day) {
        dayFromParent.style.display = 'none';
        dayToParent.style.display = 'none';
        daySelect.style.display = ''; 
    } else if (dayFrom || dayTo) {
        daySelect.style.display = 'none';
        dayFromParent.style.display = ''; 
        dayToParent.style.display = '';
    } else {
        daySelect.style.display = '';
        dayFromParent.style.display = '';
        dayToParent.style.display = '';
    }
}
