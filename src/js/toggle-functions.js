// Helper functions to show/hide practice options
function hideOtherMainPracticeTypes(selectedId) {
    ['vocabulary-btn', 'grammar-btn', 'speaking-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        if (id !== selectedId) {
            document.getElementById(id).style.display = 'none';
        } else {
            document.getElementById(id).classList.add('active-main-btn');
        }
    });
}

function showAllMainPracticeTypes() {
    ['vocabulary-btn', 'grammar-btn', 'speaking-btn', 'writing-btn', 'practice-all-btn'].forEach(id => {
        document.getElementById(id).style.display = 'inline-block';
        document.getElementById(id).classList.remove('active-main-btn');
    });
}

// Toggle function for main practice types
function toggleMainPracticeType(selectedId) {
    // Always hide all secondary options first
    vocabularyOptions.style.display = 'none';
    grammarOptions.style.display = 'none';
    speakingOptions.style.display = 'none';
    writingOptions.style.display = 'none';

    const btn = document.getElementById(selectedId);
    const isActive = btn.classList.contains('active-main-btn');
    
    if (isActive) {
        showAllMainPracticeTypes();
        document.getElementById('result').innerHTML = '';
    } else {
        hideOtherMainPracticeTypes(selectedId);
        
        if (selectedId === 'vocabulary-btn') {
            vocabularyOptions.style.display = 'block';
        } else if (selectedId === 'grammar-btn') {
            grammarOptions.style.display = 'block';
            updateGrammarOptions();
        } else if (selectedId === 'speaking-btn') {
            speakingOptions.style.display = 'block';
        } else if (selectedId === 'writing-btn') {
            writingOptions.style.display = 'block';
        }
    }
    }
        // --- Hide other options when one is selected ---
        function hideOtherVocabularyOptions(selectedId) {
            document.querySelectorAll('#vocabulary-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllVocabularyOptions() {
            document.querySelectorAll('#vocabulary-options button').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
        function hideOtherGrammarOptions(selectedId) {
            document.querySelectorAll('#grammar-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllGrammarOptions() {
            document.querySelectorAll('#grammar-options button').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
        function hideOtherSpeakingOptions(selectedId) {
            document.querySelectorAll('#speaking-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllSpeakingOptions() {
            document.querySelectorAll('#speaking-options button').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
        function hideOtherWritingOptions(selectedId) {
            document.querySelectorAll('#writing-options button').forEach(btn => {
                if (btn.id !== selectedId) btn.style.display = 'none';
            });
        }
        function showAllWritingOptions() {
            document.querySelectorAll('#writing-options button').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }