// Initialize all buttons
function initButtons() {
    // Helper to hide all options
    function hideAllOptions() {
        document.getElementById('vocabulary-options').style.display = 'none';
        document.getElementById('grammar-options').style.display = 'none';
        document.getElementById('reading-options').style.display = 'none';
        document.getElementById('speaking-options').style.display = 'none';
        document.getElementById('writing-options').style.display = 'none';
    }
    // Main practice type buttons
    ['vocabulary','grammar','reading','speaking','writing'].forEach(type => {
        const btn = document.getElementById(`${type}-btn`);
        btn?.addEventListener('click', function() {
            const isActive = btn.classList.contains('active-main-btn');
            if (isActive) {
                // If already active, reset to main menu
                btn.classList.remove('active-main-btn');
                hideAllOptions();
                showAllMainPracticeTypes();
            } else {
                // Hide all main buttons except this one
                hideOtherMainPracticeTypes(`${type}-btn`);
                hideAllOptions();
                document.getElementById(`${type}-options`).style.display = 'block';
            }
        });
    });
}

// Helper: Toggle option buttons for a group
function setupOptionToggle(groupId, btnIds, startExerciseFns) {
    btnIds.forEach((btnId, idx) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', function() {
            const group = document.getElementById(groupId);
            const isActive = btn.classList.contains('active-option-btn');
            const allBtns = group.querySelectorAll('button');
            if (isActive) {
                // Restore all options
                allBtns.forEach(b => {
                    b.style.display = '';
                    b.classList.remove('active-option-btn');
                });
            } else {
                // Hide all except this
                allBtns.forEach(b => {
                    if (b !== btn) b.style.display = 'none';
                    b.classList.remove('active-option-btn');
                });
                btn.classList.add('active-option-btn');
                // Start the exercise
                if (typeof startExerciseFns[idx] === 'function') startExerciseFns[idx]();
            }
        });
    });
}

// Setup for all option groups
setupOptionToggle('vocabulary-options', [
    'daily-word-btn', 'random-word-btn', 'random-image-btn', 'listening-btn', 'practice-all-vocab-btn'
], [
    showDailyWords, startRandomWordPractice, startRandomImagePractice, startListeningPractice, practiceAllVocabulary
]);
setupOptionToggle('grammar-options', [
    'gender-btn', 'verbs-btn', 'possessives-btn', 'practice-all-grammar-btn'
], [
    startGenderPractice, startVerbsPractice, startPossessivesPractice, practiceAllGrammar
]);
setupOptionToggle('reading-options', [
    'daily-reading-btn', 'story-btn', 'interesting-fact-btn'
], [
    function() { /* TODO: implement reading exercises */ },
    function() { /* TODO: implement story exercise */ },
    function() { /* TODO: implement interesting facts */ }
]);
setupOptionToggle('speaking-options', [
    'daily-speaking-btn', 'question-practice-btn', 'monologue-btn', 'role-play-btn', 'practice-all-speaking-btn'
], [
    function() { /* TODO: implement speaking exercises */ },
    function() { /* TODO: implement question practice */ },
    function() { /* TODO: implement monologue */ },
    function() { /* TODO: implement role play */ },
    function() { /* TODO: implement practice all speaking */ }
]);
setupOptionToggle('writing-options', [
    'daily-writing-btn', 'question-btn', 'storytelling-btn', 'diary-btn'
], [
    function() { /* TODO: implement writing exercises */ },
    function() { /* TODO: implement writing question */ },
    function() { /* TODO: implement storytelling */ },
    function() { /* TODO: implement diary */ }
]);

// Toggle main practice type
function toggleMainPracticeType(selectedId) {
    const btn = document.getElementById(selectedId);
    const isActive = btn.classList.contains('active-main-btn');
    
    // Hide all other main buttons
    ['vocabulary-btn', 'grammar-btn', 'reading-btn', 'speaking-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        if (id !== selectedId) {
            document.getElementById(id).style.display = 'none';
        }
    });
    
    if (isActive) {
        // If already active, show all buttons
        showAllMainPracticeTypes();
    } else {
        // If not active, show only this button
        btn.classList.add('active-main-btn');
        document.getElementById('practice-all-btn').style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initButtons);