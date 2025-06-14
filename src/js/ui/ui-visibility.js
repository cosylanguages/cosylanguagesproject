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
    const questionPracticeBtn = document.getElementById('question-practice-btn'); // For speaking
    const monologueBtn = document.getElementById('monologue-btn');
    const rolePlayBtn = document.getElementById('role-play-btn');
    const practiceAllSpeakingBtn = document.getElementById('practice-all-speaking-btn');

    // Writing sub-option buttons
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

    if (speakingOptionsEl && questionPracticeBtn && monologueBtn && rolePlayBtn && practiceAllSpeakingBtn) {
        if (day === 1) {
            questionPracticeBtn.style.display = 'inline-block';
            monologueBtn.style.display = 'none';
            rolePlayBtn.style.display = 'inline-block';
            practiceAllSpeakingBtn.style.display = 'inline-block';
        } else { 
            questionPracticeBtn.style.display = 'inline-block';
            monologueBtn.style.display = 'inline-block';
            rolePlayBtn.style.display = 'inline-block';
            practiceAllSpeakingBtn.style.display = 'inline-block';
        }
    }

    // --- Writing Section Overall & Sub-Options Visibility ---
    if (writingBtnEl) writingBtnEl.style.display = 'inline-block'; 

    if (writingOptionsEl && writingQuestionBtn && storytellingBtn && diaryBtn) {
        if (day === 1) {
            writingQuestionBtn.style.display = 'inline-block';
            storytellingBtn.style.display = 'none';
            diaryBtn.style.display = 'none';
        } else { 
            writingQuestionBtn.style.display = 'inline-block';
            storytellingBtn.style.display = 'inline-block';
            diaryBtn.style.display = 'inline-block';
        }
    }

    console.log(`DEBUG: updateUIVisibilityForDay finished for Day: ${day}, Language: ${selectedLanguage}`);
}


// Update grammar options based on selected day or range
function updateGrammarOptions() {
    const lang = document.getElementById('language').value;
    const t = translations[lang] || translations['COSYenglish'];
    const days = getSelectedDays(); // Assumes getSelectedDays is available globally or in this scope
    const grammarOptionsContainer = document.querySelector('#grammar-options .grammar-options');

    if (!grammarOptionsContainer) return;
    grammarOptionsContainer.innerHTML = '';

    if (!days.length) {
        const noDayMsg = document.createElement('p');
        noDayMsg.textContent = t.selectDay;
        grammarOptionsContainer.appendChild(noDayMsg);
        return;
    }
    
    const day = parseInt(days[0]);

    function hideOtherGrammarOptionBtns(selectedBtn) {
        const btns = grammarOptionsContainer.querySelectorAll('.grammar-option-btn');
        btns.forEach(btn => {
            if (btn !== selectedBtn) {
                btn.style.display = 'none';
            } else {
                btn.classList.add('active-grammar-btn');
            }
        });
    }

    // Fix: For day 3, ONLY show gender, verbs, possessives (no duplicates)
    if (day === 3) {
        const genderBtn = document.createElement('button');
        genderBtn.textContent = t.gender;
        genderBtn.className = 'btn-secondary btn-small grammar-option-btn';
        genderBtn.onclick = function() {
            hideOtherGrammarOptionBtns(genderBtn);
            if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
            if (typeof practiceGrammar === 'function') practiceGrammar('gender');
        };
        grammarOptionsContainer.appendChild(genderBtn);

        const verbBtn = document.createElement('button');
        verbBtn.textContent = t.verbs;
        verbBtn.className = 'btn-secondary btn-small grammar-option-btn';
        verbBtn.onclick = function() {
            hideOtherGrammarOptionBtns(verbBtn);
            if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
            if (typeof practiceGrammar === 'function') practiceGrammar('verbs');
        };
        grammarOptionsContainer.appendChild(verbBtn);

        const possBtn = document.createElement('button');
        possBtn.textContent = t.possessives;
        possBtn.className = 'btn-secondary btn-small grammar-option-btn';
        possBtn.onclick = function() {
            hideOtherGrammarOptionBtns(possBtn);
            if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
            if (typeof practiceGrammar === 'function') practiceGrammar('possessives');
        };
        grammarOptionsContainer.appendChild(possBtn);
        return;
    }

    if (day >= 1) {
        const genderBtn = document.createElement('button');
        genderBtn.textContent = t.gender;
        genderBtn.className = 'btn-secondary grammar-option-btn'; // Removed btn-small
        genderBtn.onclick = function() {
            hideOtherGrammarOptionBtns(genderBtn);
            if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
            if (typeof practiceGrammar === 'function') practiceGrammar('gender');
        };
        grammarOptionsContainer.appendChild(genderBtn);
    }
    if (day >= 2) {
        const verbBtn = document.createElement('button');
        verbBtn.textContent = t.verbs;
        verbBtn.className = 'btn-secondary grammar-option-btn'; // Removed btn-small
        verbBtn.onclick = function() {
            hideOtherGrammarOptionBtns(verbBtn);
            if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
            if (typeof practiceGrammar === 'function') practiceGrammar('verbs');
        };
        grammarOptionsContainer.appendChild(verbBtn);
    }
    // Removed makeToggleHandler and related past/future tense buttons as they are not in the original index.html
}

// --- Hide/show day and day-from/day-to options depending on selection ---
function updateDaySelectors() {
    const daySelect = document.getElementById('day');
    const dayFromSelect = document.getElementById('day-from');
    const dayToSelect = document.getElementById('day-to');

    if (!daySelect || !dayFromSelect || !dayToSelect) return; // Elements not found

    const day = daySelect.value;
    const dayFrom = dayFromSelect.value;
    const dayTo = dayToSelect.value;

    const dayFromParent = dayFromSelect.parentElement;
    const dayToParent = dayToSelect.parentElement;

    if (!dayFromParent || !dayToParent) return; // Parent elements not found

    if (day) {
        // Hide range selectors
        dayFromParent.style.display = 'none';
        dayToParent.style.display = 'none';
        daySelect.style.display = ''; // Ensure single day selector is visible
    } else if (dayFrom || dayTo) {
        // Hide single day selector
        daySelect.style.display = 'none';
        dayFromParent.style.display = ''; // Ensure range selectors are visible
        dayToParent.style.display = '';
    } else {
        // Show all
        daySelect.style.display = '';
        dayFromParent.style.display = '';
        dayToParent.style.display = '';
    }
}
