// Practice type buttons
const vocabularyBtn = document.getElementById('vocabulary-btn');
const grammarBtn = document.getElementById('grammar-btn');
const readingBtn = document.getElementById('reading-btn');
const speakingBtn = document.getElementById('speaking-btn');
const writingBtn = document.getElementById('writing-btn');

const vocabularyOptions = document.getElementById('vocabulary-options');
const grammarOptions = document.getElementById('grammar-options');
const readingOptions = document.getElementById('reading-options');
const speakingOptions = document.getElementById('speaking-options');
const writingOptions = document.getElementById('writing-options');

// Hide all options initially
vocabularyOptions.style.display = 'none';
grammarOptions.style.display = 'none';
readingOptions.style.display = 'none';
speakingOptions.style.display = 'none';
writingOptions.style.display = 'none';

// Show Practice All button on load
const practiceAllBtn = document.getElementById('practice-all-btn');
practiceAllBtn.style.display = 'block';

// The following block (main button click handlers) has been removed:
// Add click handlers to main menu buttons to show/hide options
/* vocabularyBtn.addEventListener('click', function() {
    if (vocabularyOptions.style.display === 'block') {
        goBackToMainMenu(); // Hide options, show main menu
    } else {
        vocabularyOptions.style.display = 'block';
        grammarOptions.style.display = 'none';
        readingOptions.style.display = 'none';
        speakingOptions.style.display = 'none';
        writingOptions.style.display = 'none';
        practiceAllBtn.style.display = 'none';
        hideOtherMainPracticeTypes('vocabulary-btn'); // Hide other main buttons
    }
});
grammarBtn.addEventListener('click', function() {
    if (grammarOptions.style.display === 'block') {
        goBackToMainMenu();
    } else {
        vocabularyOptions.style.display = 'none';
        grammarOptions.style.display = 'block';
        readingOptions.style.display = 'none';
        speakingOptions.style.display = 'none';
        writingOptions.style.display = 'none';
        practiceAllBtn.style.display = 'none';
        hideOtherMainPracticeTypes('grammar-btn');
    }
});
readingBtn.addEventListener('click', function() {
    if (readingOptions.style.display === 'block') {
        goBackToMainMenu();
    } else {
        vocabularyOptions.style.display = 'none';
        grammarOptions.style.display = 'none';
        readingOptions.style.display = 'block';
        speakingOptions.style.display = 'none';
        writingOptions.style.display = 'none';
        practiceAllBtn.style.display = 'none';
        hideOtherMainPracticeTypes('reading-btn');
    }
});
speakingBtn.addEventListener('click', function() {
    if (speakingOptions.style.display === 'block') {
        goBackToMainMenu();
    } else {
        vocabularyOptions.style.display = 'none';
        grammarOptions.style.display = 'none';
        readingOptions.style.display = 'none';
        speakingOptions.style.display = 'block';
        writingOptions.style.display = 'none';
        practiceAllBtn.style.display = 'none';
        hideOtherMainPracticeTypes('speaking-btn');
    }
});
writingBtn.addEventListener('click', function() {
    if (writingOptions.style.display === 'block') {
        goBackToMainMenu();
    } else {
        vocabularyOptions.style.display = 'none';
        grammarOptions.style.display = 'none';
        readingOptions.style.display = 'none';
        speakingOptions.style.display = 'none';
        writingOptions.style.display = 'block';
        practiceAllBtn.style.display = 'none';
        hideOtherMainPracticeTypes('writing-btn');
    }
});
practiceAllBtn.addEventListener('click', function() {
    vocabularyOptions.style.display = 'none';
    grammarOptions.style.display = 'none';
    readingOptions.style.display = 'none';
    speakingOptions.style.display = 'none';
    writingOptions.style.display = 'none';
    practiceAllBtn.style.display = 'block';
}); */

// Show all main practice types
function showAllMainPracticeTypes() {
    ['vocabulary-btn', 'grammar-btn', 'reading-btn', 'speaking-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        document.getElementById(id).style.display = 'inline-block';
        document.getElementById(id).classList.remove('active-main-btn');
    });
}

function hideOtherMainPracticeTypes(selectedId) {
    ['vocabulary-btn', 'grammar-btn', 'speaking-btn', 'reading-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
         if (id !== selectedId) {
            document.getElementById(id).style.display = 'none';
        } else {
            document.getElementById(id).classList.add('active-main-btn');
        }
    });
}
        // --- Hide other options when one is selected ---
        function hideOtherVocabularyOptions(selectedId) {
            document.querySelectorAll('#vocabulary-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllVocabularyOptions() {
            document.querySelectorAll('#vocabulary-options button').forEach(btn => {
                btn.style.display = '';
            });
        }
        function hideOtherGrammarOptions(selectedId) {
            document.querySelectorAll('#grammar-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllGrammarOptions() {
            document.querySelectorAll('#grammar-options button').forEach(btn => {
                btn.style.display = '';
            });
        }
        function hideOtherReadingOptions(selectedId) {
            document.querySelectorAll('#reading-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllReadingOptions() {
            document.querySelectorAll('#reading-options button').forEach(btn => {
                btn.style.display = '';
            });
        }
        function hideOtherSpeakingOptions(selectedId) {
            document.querySelectorAll('#speaking-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllSpeakingOptions() {
            document.querySelectorAll('#speaking-options button').forEach(btn => {
                btn.style.display = '';
            });
        }
        function hideOtherWritingOptions(selectedId) {
            document.querySelectorAll('#writing-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllWritingOptions() {
            document.querySelectorAll('#writing-options button').forEach(btn => {
                btn.style.display = '';
            });
        }

        // Helper: go back to main menu
        function goBackToMainMenu() {
            showAllMainPracticeTypes();
            showAllVocabularyOptions && showAllVocabularyOptions();
            showAllGrammarOptions && showAllGrammarOptions();
            showAllReadingOptions && showAllReadingOptions();
            showAllSpeakingOptions && showAllSpeakingOptions();
            showAllWritingOptions && showAllWritingOptions();
            if (vocabularyOptions) vocabularyOptions.style.display = 'none';
            if (grammarOptions) grammarOptions.style.display = 'none';
            if (readingOptions) readingOptions.style.display = 'none';
            if (speakingOptions) speakingOptions.style.display = 'none';
            if (writingOptions) writingOptions.style.display = 'none';
            if (practiceAllBtn) practiceAllBtn.style.display = 'block';
            if (document.getElementById('result')) document.getElementById('result').innerHTML = '';
            showPracticeAllButtons();
        }

        // Change background flag on language select
        const languageSelect = document.getElementById('language');
        languageSelect.addEventListener('change', function() {
            const lang = languageSelect.value;
            // Remove any previous flag class
            document.body.className = document.body.className
                .split(' ') // split classes
                .filter(c => !c.startsWith('flag-')) // remove flag- classes
                .join(' ');
            if (lang) {
                document.body.classList.add('flag-' + lang);
            }
        });
    
        // On page load, set UI to default language
        updateUIForLanguage(document.getElementById('language').value || 'COSYenglish');

        // Helper: get selected days (single or range)
        function getSelectedDays() {
            const day = document.getElementById('day').value;
            const dayFrom = document.getElementById('day-from').value;
            const dayTo = document.getElementById('day-to').value;
            console.log("DEBUG_SIM: getSelectedDays - day:", day, "dayFrom:", dayFrom, "dayTo:", dayTo);

            if (day) {
                console.log("DEBUG_SIM: getSelectedDays - returning array:", [day]);
                return [day];
            } else if (dayFrom && dayTo && Number(dayFrom) <= Number(dayTo)) {
                const from = Number(dayFrom);
                const to = Number(dayTo);
                const days = [];
                for (let i = from; i <= to; i++) days.push(String(i));
                console.log("DEBUG_SIM: getSelectedDays - returning array:", days);
                return days;
            } else {
                console.log("DEBUG_SIM: getSelectedDays - returning empty array");
                return [];
            }
        }

        // Restore all main practice type buttons when returning to menu
        function restoreMenu() {
            showAllMainPracticeTypes();
            showAllVocabularyOptions();
            showAllGrammarOptions();
            showAllReadingOptions();
            showAllSpeakingOptions();
            vocabularyOptions.style.display = 'none';
            grammarOptions.style.display = 'none';
            readingOptions.style.display = 'none';
            speakingOptions.style.display = 'none';
            practiceAllBtn.style.display = 'block';
            // Optionally clear result area
            document.getElementById('result').innerHTML = '';
        }

daySelect.addEventListener('change', updateDaySelectors);
dayFromSelect.addEventListener('change', updateDaySelectors);
dayToSelect.addEventListener('change', updateDaySelectors);

// After progress stats rendering (wherever progress stats are shown):
const statsContainer = document.getElementById('progress-stats-container');
if (statsContainer && !document.getElementById('reset-progress-btn')) {
  const resetBtn = document.createElement('button');
  resetBtn.id = 'reset-progress-btn';
  resetBtn.className = 'btn-secondary margin-top-18 margin-bottom-8 font-size-11 text-center';
  resetBtn.textContent = (translations[lang]||translations['COSYenglish']).resetProgress || 'Reset Progress';
  resetBtn.onclick = function() {
    if (confirm((translations[lang]||translations['COSYenglish']).resetConfirm || 'Are you sure you want to reset your progress?')) {
      localStorage.clear();
      location.reload();
    }
  };
  statsContainer.appendChild(resetBtn);
}
