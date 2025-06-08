// BUTTONS

// Vocabulary button click
    vocabularyBtn.addEventListener('click', function() {
        toggleMainPracticeType('vocabulary-btn');
    });
        
// Grammar button click
    grammarBtn.addEventListener('click', function() {
        toggleMainPracticeType('grammar-btn');
        grammarOptions.style.display = 'block';
        updateGrammarOptions();
    });
// Reading button click
    readingBtn.addEventListener('click', function() {
    toggleMainPracticeType('reading-btn');
    });

// Speaking button click
    speakingBtn.addEventListener('click', function() {
        toggleMainPracticeType('speaking-btn');
    });

// Writing button click
    writingBtn.addEventListener('click', function() {
        toggleMainPracticeType('writing-btn');
    });

// OPTION BUTTONS
// Vocabulary options
