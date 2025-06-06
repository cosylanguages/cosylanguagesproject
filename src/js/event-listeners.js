// Vocabulary button click
vocabularyBtn.addEventListener('click', function() {
    toggleMainPracticeType('vocabulary-btn');
});
// Vocabulary options event listeners
document.getElementById('daily-word-btn').addEventListener('click', function() {
    practiceVocabulary('daily-word');
});
document.getElementById('random-word-btn').addEventListener('click', function() {
    practiceVocabulary('random-word');
});
document.getElementById('random-image-btn').addEventListener('click', function() {
    practiceVocabulary('random-image');
});
document.getElementById('listening-btn').addEventListener('click', function() {
    practiceVocabulary('listening');
});
document.getElementById('practice-all-vocab-btn').addEventListener('click', async function() {
    const days = getSelectedDays();
    if (!days.length) {
        alert('Please select a day or a range of days first');
        return;
    }
    const language = document.getElementById('language').value;
    if (!language) {
        alert('Please select a language first');
        return;
    }
    const vocabModes = ['random-word', 'random-image', 'listening'];
    for (let mode of vocabModes) {
        await practiceVocabulary(mode);
    }
});

// Grammar button click
grammarBtn.addEventListener('click', function() {
    toggleMainPracticeType('grammar-btn');
    grammarOptions.style.display = 'block';
    updateGrammarOptions();
});
// Grammar options event listeners


// Speaking button click
speakingBtn.addEventListener('click', function() {
    toggleMainPracticeType('speaking-btn');
});
// Speaking options event listeners
document.getElementById('daily-speaking-btn').addEventListener('click', function() {
    practiceSpeaking('daily');
});
document.getElementById('question-practice-btn').addEventListener('click', function() {
    practiceSpeaking('question');
});
document.getElementById('monologue-btn').addEventListener('click', function() {
    practiceSpeaking('monologue');
});
document.getElementById('role-play-btn').addEventListener('click', function() {
    practiceSpeaking('role-play');
});
document.getElementById('practice-all-speaking-btn').addEventListener('click', async function() {
    const speakingModes = ['question', 'monologue', 'role-play'];
    for (let mode of speakingModes) {
        await practiceSpeaking(mode);
    }
});

// Writing button click
writingBtn.addEventListener('click', function() {
    toggleMainPracticeType('writing-btn');
});
// Writing options event listeners
document.getElementById('daily-writing-btn').addEventListener('click', function() {
    practiceWriting('daily');
});
document.getElementById('story-btn').addEventListener('click', function() {
    practiceWriting('story');
});
document.getElementById('letter-btn').addEventListener('click', function() {
    practiceWriting('letter');
});