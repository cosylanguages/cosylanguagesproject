// Latinization state and button are managed by latinizer.js

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
if (vocabularyOptions) vocabularyOptions.style.display = 'none';
if (grammarOptions) grammarOptions.style.display = 'none';
if (readingOptions) readingOptions.style.display = 'none';
if (speakingOptions) speakingOptions.style.display = 'none';
if (writingOptions) writingOptions.style.display = 'none';

// Show Practice All button on load
const practiceAllBtn = document.getElementById('practice-all-btn');
if (practiceAllBtn) practiceAllBtn.style.display = 'block';


// Show all main practice types
function showAllMainPracticeTypes() {
    ['vocabulary-btn', 'grammar-btn', 'reading-btn', 'speaking-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.display = 'inline-block';
            btn.classList.remove('active-main-btn');
        }
    });
}

function hideOtherMainPracticeTypes(selectedId) {
    ['vocabulary-btn', 'grammar-btn', 'speaking-btn', 'reading-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (id !== selectedId) {
                btn.style.display = 'none';
            } else {
                btn.classList.add('active-main-btn');
            }
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
            if (typeof showAllVocabularyOptions === 'function') showAllVocabularyOptions();
            if (typeof showAllGrammarOptions === 'function') showAllGrammarOptions();
            if (typeof showAllReadingOptions === 'function') showAllReadingOptions();
            if (typeof showAllSpeakingOptions === 'function') showAllSpeakingOptions();
            if (typeof showAllWritingOptions === 'function') showAllWritingOptions();

            if (vocabularyOptions) vocabularyOptions.style.display = 'none';
            if (grammarOptions) grammarOptions.style.display = 'none';
            if (readingOptions) readingOptions.style.display = 'none';
            if (speakingOptions) speakingOptions.style.display = 'none';
            if (writingOptions) writingOptions.style.display = 'none';
            if (practiceAllBtn) practiceAllBtn.style.display = 'block';
            
            const resultDiv = document.getElementById('result');
            if (resultDiv) resultDiv.innerHTML = '';
            
            if (typeof showPracticeAllButtons === 'function') {
                 showPracticeAllButtons();
            }
        }

        // Helper: get selected days (single or range)
        function getSelectedDays() {
            const day = document.getElementById('day').value;
            const dayFrom = document.getElementById('day-from').value;
            const dayTo = document.getElementById('day-to').value;

            if (day) {
                return [day];
            } else if (dayFrom && dayTo && Number(dayFrom) <= Number(dayTo)) {
                const from = Number(dayFrom);
                const to = Number(dayTo);
                const days = [];
                for (let i = from; i <= to; i++) days.push(String(i));
                return days;
            } else {
                return [];
            }
        }

        function restoreMenu() {
            showAllMainPracticeTypes();
            if (typeof showAllVocabularyOptions === 'function') showAllVocabularyOptions();
            if (typeof showAllGrammarOptions === 'function') showAllGrammarOptions();
            if (readingOptions && typeof showAllReadingOptions === 'function') showAllReadingOptions();
            if (speakingOptions && typeof showAllSpeakingOptions === 'function') showAllSpeakingOptions();
            if (writingOptions && typeof showAllWritingOptions === 'function') showAllWritingOptions();


            if (vocabularyOptions) vocabularyOptions.style.display = 'none';
            if (grammarOptions) grammarOptions.style.display = 'none';
            if (readingOptions) readingOptions.style.display = 'none';
            if (speakingOptions) speakingOptions.style.display = 'none';
            if (writingOptions) writingOptions.style.display = 'none';

            if (practiceAllBtn) practiceAllBtn.style.display = 'block';
            const resultDiv = document.getElementById('result');
            if (resultDiv) resultDiv.innerHTML = '';
        }

// Tooltip-Style Hint Display Functions
let hintTooltipElement = null;

function ensureHintTooltipExists() {
    if (!hintTooltipElement || !document.body.contains(hintTooltipElement)) {
        hintTooltipElement = document.createElement('div');
        hintTooltipElement.id = 'hint-tooltip';
        // Basic styles set here, detailed ones in CSS
        hintTooltipElement.style.position = 'absolute';
        hintTooltipElement.style.display = 'none'; // Initially hidden
        hintTooltipElement.style.zIndex = '1050'; // Ensure it's on top
        // CSS will handle background, color, padding, border-radius, box-shadow, font-size, max-width, word-wrap
        document.body.appendChild(hintTooltipElement);
    }
}

function showHintTooltip(buttonElement, hintText) {
    ensureHintTooltipExists();
    hintTooltipElement.textContent = hintText;

    const rect = buttonElement.getBoundingClientRect();
    
    // Temporarily display the tooltip to measure its dimensions
    hintTooltipElement.style.visibility = 'hidden'; // Use visibility to measure without flicker
    hintTooltipElement.style.display = 'block';
    const tooltipHeight = hintTooltipElement.offsetHeight;
    const tooltipWidth = hintTooltipElement.offsetWidth;
    hintTooltipElement.style.display = 'none'; // Hide again
    hintTooltipElement.style.visibility = 'visible';

    let tooltipX, tooltipY;

    // Attempt to position above the button
    tooltipY = rect.top + window.scrollY - tooltipHeight - 10; // 10px offset

    // If not enough space above, try below
    if (tooltipY < window.scrollY) { // Check if it's going off-screen at the top
        tooltipY = rect.bottom + window.scrollY + 10; // 10px offset
    }

    // Center horizontally
    tooltipX = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
    
    // Boundary checks for X
    if (tooltipX < (window.scrollX + 5)) { // 5px margin from left edge
        tooltipX = window.scrollX + 5;
    }
    if (tooltipX + tooltipWidth > (window.innerWidth + window.scrollX - 5)) { // 5px margin from right edge
        tooltipX = window.innerWidth + window.scrollX - tooltipWidth - 5;
    }

    // Boundary checks for Y (simple check for top, bottom boundary would also be good if it often overflows)
     if (tooltipY < window.scrollY + 5) { // Ensure it's not off the top of the viewport if scrolled
        tooltipY = window.scrollY + 5;
     }


    hintTooltipElement.style.left = tooltipX + 'px';
    hintTooltipElement.style.top = tooltipY + 'px';
    hintTooltipElement.style.display = 'block';
}

function hideHintTooltip() {
    if (hintTooltipElement) { // Check if it exists before trying to hide
        hintTooltipElement.style.display = 'none';
    }
}

// Expose functions globally or via an object
window.CosyUI = window.CosyUI || {};
window.CosyUI.showHintTooltip = showHintTooltip;
window.CosyUI.hideHintTooltip = hideHintTooltip;
