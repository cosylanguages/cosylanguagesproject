// Initialize all buttons
function initButtons() {
    // Main practice type buttons
    document.getElementById('vocabulary-btn')?.addEventListener('click', function() {
        toggleMainPracticeType('vocabulary-btn');
        document.getElementById('vocabulary-options').style.display = 'block';
        document.getElementById('grammar-options').style.display = 'none';
        document.getElementById('reading-options').style.display = 'none';
        document.getElementById('speaking-options').style.display = 'none';
        document.getElementById('writing-options').style.display = 'none';
    });

    // ... other main buttons ...

    // Vocabulary options buttons
    document.getElementById('daily-word-btn')?.addEventListener('click', function() {
        document.querySelectorAll('#vocabulary-options button').forEach(btn => {
            btn.classList.remove('active-vocab-btn');
        });
        this.classList.add('active-vocab-btn');
        showDailyWords();
    });

    document.getElementById('random-word-btn')?.addEventListener('click', function() {
        document.querySelectorAll('#vocabulary-options button').forEach(btn => {
            btn.classList.remove('active-vocab-btn');
        });
        this.classList.add('active-vocab-btn');
        startRandomWordPractice();
    });

    document.getElementById('random-image-btn')?.addEventListener('click', function() {
        document.querySelectorAll('#vocabulary-options button').forEach(btn => {
            btn.classList.remove('active-vocab-btn');
        });
        this.classList.add('active-vocab-btn');
        startRandomImagePractice();
    });

    document.getElementById('listening-btn')?.addEventListener('click', function() {
        document.querySelectorAll('#vocabulary-options button').forEach(btn => {
            btn.classList.remove('active-vocab-btn');
        });
        this.classList.add('active-vocab-btn');
        startListeningPractice();
    });

    document.getElementById('practice-all-vocab-btn')?.addEventListener('click', function() {
        document.querySelectorAll('#vocabulary-options button').forEach(btn => {
            btn.classList.remove('active-vocab-btn');
        });
        this.classList.add('active-vocab-btn');
        practiceAllVocabulary();
    });
}

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

// Show all main practice types
function showAllMainPracticeTypes() {
    ['vocabulary-btn', 'grammar-btn', 'reading-btn', 'speaking-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        document.getElementById(id).style.display = 'inline-block';
        document.getElementById(id).classList.remove('active-main-btn');
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initButtons);