// UI Visibility Management

const thematicDayNames = {
    1: "Basic words", 
    2: "Who are you?", 
    3: "My family", 
    4: "Numbers", 
    5: "Is it good or bad?"
    // Add more day names if provided by the user later
};

function updateUIVisibilityForDay(selectedDay, selectedLanguage) {
    // Ensure selectedDay is a number; it might be NaN if parsing failed or value was empty.
    const day = Number(selectedDay);

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
        if (grammarBtnMain) grammarBtnMain.style.display = 'none'; 
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
    if (grammarBtnMain) grammarBtnMain.style.display = 'inline-block'; 
    if (readingBtnEl) readingBtnEl.style.display = 'inline-block';
    if (speakingBtnEl) speakingBtnEl.style.display = 'inline-block';
    if (writingBtnEl) writingBtnEl.style.display = 'inline-block';

    // --- Grammar Section ---
    if (grammarOptionsEl && grammarOptionsContainer) { 
        updateGrammarOptions(); 
    }
    
    // --- Speaking Sub-Options Visibility ---
    if (speakingOptionsEl) { 
        // Ensure all speaking sub-options are visible by default when the panel is shown.
        // Specific exercise functions will handle "no data" for Day 1 if applicable.
        [questionPracticeBtn, monologueBtn, rolePlayBtn, practiceAllSpeakingBtn].forEach(btn => {
            if (btn) btn.style.display = ''; 
        });
        // Removed: Day 1 specific hiding for monologueBtn
    }

    // --- Writing Sub-Options Visibility ---
    if (writingOptionsEl) { 
        // Ensure all writing sub-options are visible by default when the panel is shown.
        [writingQuestionBtn, storytellingBtn, diaryBtn].forEach(btn => {
            if (btn) btn.style.display = '';
        });
        // Removed: Day 1 specific hiding for storytellingBtn and diaryBtn
    }
}


// Update grammar options based on selected day or range
function updateGrammarOptions() {
    const lang = document.getElementById('language').value;
    const t = translations[lang] || translations.COSYenglish; 
    const days = getSelectedDays(); 
    const grammarOptionsContainer = document.querySelector('#grammar-options .grammar-options');
    const grammarOptionsEl = document.getElementById('grammar-options');

    if (!grammarOptionsContainer || !grammarOptionsEl) return;
    grammarOptionsContainer.innerHTML = ''; 

    if (!days || !days.length) { 
        const noDayMsg = document.createElement('p');
        noDayMsg.textContent = (t && t.selectDay) ? t.selectDay : (translations.COSYenglish.selectDay || "Please select a day."); 
        grammarOptionsContainer.appendChild(noDayMsg);
        return;
    }
    
    const day = parseInt(days[0]); 

    if (day === 1 && lang === 'COSYenglish') {
        return; 
    }

    let optionsAdded = false; 

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
    if (practiceAllBtn) practiceAllBtn.style.display = 'inline-block'; 
}
window.showPracticeAllButtons = showPracticeAllButtons;


// New function to handle visibility of day selectors and thematic name display
function updateDaySelectorsVisibility(isInitialLoad = false) {
    const daySelect = document.getElementById('day');
    const dayFromSelect = document.getElementById('day-from');
    const dayToSelect = document.getElementById('day-to');
    const dayLabel = document.querySelector('label[for="day"]');
    const dayRangeContainer = document.querySelector('.day-range'); 
    const thematicNameDisplay = document.getElementById('selected-day-name-display');

    if (!daySelect || !dayFromSelect || !dayToSelect || !dayLabel || !dayRangeContainer || !thematicNameDisplay) {
        // console.warn("Day selector UI elements not all found for visibility update."); // Keep console.warn for essential debug
        return;
    }

    const singleDayValue = daySelect.value;
    const dayFromValue = dayFromSelect.value; 
    // const dayToValue = dayToSelect.value; // Not strictly needed for this logic branch

    if (isInitialLoad) {
        dayLabel.style.display = '';
        daySelect.style.display = '';
        dayRangeContainer.style.display = 'flex'; // Or 'block' or '' depending on desired default
        thematicNameDisplay.style.display = 'none';
    } else {
        const singleDayValue = daySelect.value;
        const dayFromValue = dayFromSelect.value;

        if (singleDayValue) { 
            dayLabel.style.display = '';
            daySelect.style.display = '';
            dayRangeContainer.style.display = 'none'; 
            
            const dayNumber = parseInt(singleDayValue);
            const name = thematicDayNames[dayNumber] || null; 
            if (name) {
                thematicNameDisplay.textContent = name;
                thematicNameDisplay.style.display = 'block';
            } else {
                thematicNameDisplay.style.display = 'none';
            }
        } else if (dayFromValue) { 
            dayLabel.style.display = 'none';
            daySelect.style.display = 'none';
            dayRangeContainer.style.display = 'flex'; 
            thematicNameDisplay.style.display = 'none';
        } else { 
            // This state (no single day, no dayFrom) should ideally mean "show all options to select either single or range start"
            // which is the same as isInitialLoad state.
            dayLabel.style.display = '';
            daySelect.style.display = '';
            dayRangeContainer.style.display = 'flex';
            thematicNameDisplay.style.display = 'none';
        }
    }
}
// Expose the new function globally
window.updateDaySelectorsVisibility = updateDaySelectorsVisibility;

// Keep the old updateDaySelectors function if it's still called by very old code,
// but ensure it calls the new one or is phased out.
// For now, we assume event-listeners-setup.js will be updated to call the new function.
// If updateDaySelectors was global and might be called elsewhere, alias it:
// window.updateDaySelectors = updateDaySelectorsVisibility;
// However, the plan is to update event-listeners-setup.js, so direct replacement is better.


