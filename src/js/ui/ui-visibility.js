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
    const dailySpeakingBtn = document.getElementById('daily-speaking-btn');
    const questionPracticeBtn = document.getElementById('question-practice-btn'); // For speaking
    const monologueBtn = document.getElementById('monologue-btn');
    const rolePlayBtn = document.getElementById('role-play-btn');
    const practiceAllSpeakingBtn = document.getElementById('practice-all-speaking-btn');

    // Writing sub-option buttons
    const dailyWritingBtn = document.getElementById('daily-writing-btn');
    const writingQuestionBtn = document.getElementById('question-btn'); 
    const storytellingBtn = document.getElementById('storytelling-btn');
    const diaryBtn = document.getElementById('diary-btn');

    // Initial checks for element existence 
    if (!grammarOptionsEl || !grammarOptionsContainer) {
        console.warn("UI Warn: Grammar options elements not found!");
    }
    if (!readingBtnEl || !readingOptionsEl) {
        console.warn("UI Warn: Reading button or options element not found!");
    }
    if (!speakingBtnEl || !speakingOptionsEl) {
        console.warn("UI Warn: Speaking button or options element not found!");
    }
    if (!writingBtnEl || !writingOptionsEl) {
        console.warn("UI Warn: Writing button or options element not found!");
    }
    
    // --- Handle Invalid Day Globally for all sections first ---
    if (isNaN(day) || day <= 0) {
        console.log(`DEBUG: Day is invalid (${selectedDay}). Hiding all day-dependent sections.`);
        if (grammarOptionsEl) grammarOptionsEl.style.display = 'none';
        if (grammarOptionsContainer) grammarOptionsContainer.innerHTML = '';
        
        if (readingBtnEl) readingBtnEl.style.display = 'none';
        if (readingOptionsEl) readingOptionsEl.style.display = 'none';
        
        if (speakingBtnEl) speakingBtnEl.style.display = 'none'; 
        if (speakingOptionsEl) speakingOptionsEl.style.display = 'none';

        if (writingBtnEl) writingBtnEl.style.display = 'none'; 
        if (writingOptionsEl) writingOptionsEl.style.display = 'none';
        return; // Exit early if day is invalid
    }

    // --- Grammar Section Visibility ---
    if (grammarOptionsEl && grammarOptionsContainer) {
        grammarOptionsContainer.innerHTML = ''; // Clear previous options first for any Day 1 scenario or change.
        
        if (day === 1) {
            if (selectedLanguage === 'COSYenglish') {
                grammarOptionsEl.style.display = 'none'; // Hide the entire grammar options section for English Day 1
                console.log("DEBUG: English Day 1, hiding grammar options section.");
            } else {
                grammarOptionsEl.style.display = 'block'; // Ensure container is visible for other languages
                const genderBtn = document.createElement('button');
                genderBtn.textContent = currentTranslations.gender || 'Gender';
                genderBtn.className = 'btn-secondary btn-small grammar-option-btn'; 
                genderBtn.onclick = function() {
                    const allBtns = grammarOptionsContainer.querySelectorAll('.grammar-option-btn');
                    allBtns.forEach(b => b.classList.remove('active-grammar-btn')); // Clear other active states
                    allBtns.forEach(b => { if (b !== genderBtn) b.style.display = 'none'; }); // Hide others
                    genderBtn.classList.add('active-grammar-btn'); // Set current as active
                    
                    if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
                    if (typeof practiceGrammar === 'function') {
                        practiceGrammar('gender');
                    } else {
                        console.error("practiceGrammar function is not defined.");
                    }
                };
                grammarOptionsContainer.appendChild(genderBtn);
                console.log(`DEBUG: Non-English Day 1 (${selectedLanguage}), showing Gender button.`);
            }
        } else if (day > 1) {
            grammarOptionsEl.style.display = 'block'; // Ensure container is visible for Day > 1
            if (typeof updateGrammarOptions === 'function') {
                updateGrammarOptions(); // This function should handle clearing and populating grammarOptionsContainer
                console.log(`DEBUG: Day > 1 (${day}), calling updateGrammarOptions.`);
            } else {
                console.error("UI Error: updateGrammarOptions function is not defined globally.");
                grammarOptionsContainer.innerHTML = '<p class="no-data">Error: Could not load grammar options.</p>';
            }
        }
    } 

    // --- Reading Section Visibility ---
    if (readingBtnEl && readingOptionsEl) {
        if (day === 1) { 
            readingBtnEl.style.display = 'none';
            readingOptionsEl.style.display = 'none'; 
        } else { 
            readingBtnEl.style.display = 'inline-block'; 
        }
    }
    
    // --- Speaking Section Overall & Sub-Options Visibility ---
    if (speakingBtnEl) speakingBtnEl.style.display = 'inline-block'; 

    if (speakingOptionsEl && dailySpeakingBtn && questionPracticeBtn && monologueBtn && rolePlayBtn && practiceAllSpeakingBtn) {
        if (day === 1) {
            dailySpeakingBtn.style.display = 'none';
            questionPracticeBtn.style.display = 'inline-block';
            monologueBtn.style.display = 'none';
            rolePlayBtn.style.display = 'inline-block';
            practiceAllSpeakingBtn.style.display = 'inline-block';
        } else { 
            dailySpeakingBtn.style.display = 'inline-block';
            questionPracticeBtn.style.display = 'inline-block';
            monologueBtn.style.display = 'inline-block';
            rolePlayBtn.style.display = 'inline-block';
            practiceAllSpeakingBtn.style.display = 'inline-block';
        }
    }

    // --- Writing Section Overall & Sub-Options Visibility ---
    if (writingBtnEl) writingBtnEl.style.display = 'inline-block'; 

    if (writingOptionsEl && dailyWritingBtn && writingQuestionBtn && storytellingBtn && diaryBtn) {
        if (day === 1) {
            dailyWritingBtn.style.display = 'none';
            writingQuestionBtn.style.display = 'inline-block';
            storytellingBtn.style.display = 'none';
            diaryBtn.style.display = 'none';
        } else { 
            dailyWritingBtn.style.display = 'inline-block';
            writingQuestionBtn.style.display = 'inline-block';
            storytellingBtn.style.display = 'inline-block';
            diaryBtn.style.display = 'inline-block';
        }
    }

    console.log(`DEBUG: updateUIVisibilityForDay finished for Day: ${day}, Language: ${selectedLanguage}`);
}
