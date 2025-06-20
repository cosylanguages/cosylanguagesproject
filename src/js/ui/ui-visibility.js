// UI Visibility Management

function updateUIVisibilityForDay(selectedDay, selectedLanguage) {
    // Ensure selectedDay is a number; it might be NaN if parsing failed or value was empty.
    const day = Number(selectedDay);

    // Fallback to English if selectedLanguage is not found in translations
    // const currentTranslations = translations[selectedLanguage] || translations.COSYenglish; // Not used directly in this function anymore for main text

    // Main practice category buttons and their option panels
    const grammarBtnMain = document.getElementById('grammar-btn'); 
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
    
    // --- Handle Invalid Day Globally for all sections first ---
    if (isNaN(day) || day <= 0) {
        if (grammarBtnMain) grammarBtnMain.style.display = 'none'; // Hide main grammar button too
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

    // --- Default visibility for main category buttons ---
    const vocabBtnMain = document.getElementById('vocabulary-btn');
    if(vocabBtnMain) vocabBtnMain.style.display = 'inline-block';
    if (grammarBtnMain) grammarBtnMain.style.display = 'inline-block'; // Default to visible
    if (readingBtnEl) readingBtnEl.style.display = 'inline-block';
    if (speakingBtnEl) speakingBtnEl.style.display = 'inline-block';
    if (writingBtnEl) writingBtnEl.style.display = 'inline-block';

    // --- Grammar Section ---
    // Main grammar button visibility is now handled by default visibility rules.
    // Call updateGrammarOptions to populate or clear based on day/language.
    // updateGrammarOptions handles the English Day 1 case internally.
    if (grammarOptionsEl && grammarOptionsContainer) { // Ensure elements exist
        updateGrammarOptions(); 
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
    // (Assuming speakingBtnEl itself is visible based on default rules)
    if (speakingOptionsEl) { 
        [questionPracticeBtn, monologueBtn, rolePlayBtn, practiceAllSpeakingBtn].forEach(btn => {
            if (btn) btn.style.display = ''; 
        });
        if (day === 1) {
            if (monologueBtn) monologueBtn.style.display = 'none';
        }
    }

    // --- Writing Sub-Options Visibility (within writingOptionsEl) ---
    // (Assuming writingBtnEl itself is visible based on default rules)
    if (writingOptionsEl) { 
        [writingQuestionBtn, storytellingBtn, diaryBtn].forEach(btn => {
            if (btn) btn.style.display = '';
        });
        if (day === 1) {
            if (storytellingBtn) storytellingBtn.style.display = 'none';
            if (diaryBtn) diaryBtn.style.display = 'none';
        }
    }
    // console.log(`DEBUG: updateUIVisibilityForDay finished for Day: ${day}, Language: ${selectedLanguage}`);
}


// Update grammar options based on selected day or range
function updateGrammarOptions() {
    const lang = document.getElementById('language').value;
    const t = translations[lang] || translations.COSYenglish; // Fallback for main translation object
    const days = getSelectedDays(); 
    const grammarOptionsContainer = document.querySelector('#grammar-options .grammar-options');
    const grammarOptionsEl = document.getElementById('grammar-options');


    if (!grammarOptionsContainer || !grammarOptionsEl) return;
    grammarOptionsContainer.innerHTML = ''; // Clear previous options

    if (!days || !days.length) { 
        const noDayMsg = document.createElement('p');
        noDayMsg.textContent = (t && t.selectDay) ? t.selectDay : (translations.COSYenglish.selectDay || "Please select a day."); 
        grammarOptionsContainer.appendChild(noDayMsg);
        // grammarOptionsEl.style.display = 'block'; // Ensure panel is visible to show message
        return;
    }
    
    const day = parseInt(days[0]); 

    // Specific condition for English Day 1: No grammar options.
    if (day === 1 && lang === 'COSYenglish') {
        // grammarOptionsEl.style.display = 'none'; // Hide the panel itself
        return; // No options to add
    }
    // grammarOptionsEl.style.display = 'block'; // Ensure panel is visible if we might add options

    let optionsAdded = false; // Flag to check if any button is added

    // Default texts (English or generic) if specific translations are missing
    const genderText = (t && t.gender) ? t.gender : (translations.COSYenglish.gender || 'Gender');
    const verbsText = (t && t.verbs) ? t.verbs : (translations.COSYenglish.verbs || 'Verbs');
    const possessivesText = (t && t.possessives) ? t.possessives : (translations.COSYenglish.possessives || 'Possessives');
    const practiceAllText = (t && t.practiceAll) ? t.practiceAll : (translations.COSYenglish.practiceAll || 'Practice All');

    if (day >= 1) { 
        const genderBtn = document.createElement('button');
        genderBtn.id = 'gender-btn'; 
        genderBtn.textContent = genderText;
        genderBtn.className = 'btn-secondary option-btn'; 
        grammarOptionsContainer.appendChild(genderBtn);
        optionsAdded = true;
    }
    if (day >= 2) {
        const verbBtn = document.createElement('button');
        verbBtn.id = 'verbs-btn'; 
        verbBtn.textContent = verbsText;
        verbBtn.className = 'btn-secondary option-btn';
        grammarOptionsContainer.appendChild(verbBtn);
        optionsAdded = true;
    }
    if (day >= 3) {
        const possBtn = document.createElement('button');
        possBtn.id = 'possessives-btn'; 
        possBtn.textContent = possessivesText;
        possBtn.className = 'btn-secondary option-btn';
        grammarOptionsContainer.appendChild(possBtn);
        optionsAdded = true;
    }
  
    if (optionsAdded){ 
        const practiceAllGrammarBtn = document.createElement('button');
        practiceAllGrammarBtn.id = 'practice-all-grammar-btn'; 
        practiceAllGrammarBtn.textContent = practiceAllText;
        practiceAllGrammarBtn.className = 'btn-secondary option-btn';
        grammarOptionsContainer.appendChild(practiceAllGrammarBtn);
    }

    // if (!optionsAdded && !(day === 1 && lang === 'COSYenglish')) {
    //    // If no options were added (e.g. day 1 for non-English where only Gender might be available but files are missing)
    //    // and it's not the specific English Day 1 case, we might want to show a message.
    //    // For now, an empty panel is the outcome if optionsAdded remains false.
    // }


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
    // const practiceAllVocabBtn = document.getElementById('practice-all-vocab-btn'); // Not managed here
    // const practiceAllGrammarBtn = document.getElementById('practice-all-grammar-btn'); // Not managed here
    // const practiceAllSpeakingBtn = document.getElementById('practice-all-speaking-btn'); // Not managed here
   
    if (practiceAllBtn) practiceAllBtn.style.display = 'inline-block'; 
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
