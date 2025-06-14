// Reading Exercises

// Placeholder functions for specific reading exercises

async function showStoryPractice() { // Assuming 'story-btn' maps to this
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="reading-exercise-container">
            <h3>${currentTranslations.story || 'Story'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showInterestingFactPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="reading-exercise-container">
            <h3>${currentTranslations.interestingFact || 'Interesting Fact'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

// Main function to start a random reading exercise
async function startRandomReadingPractice() {
    const exercises = [
        showStoryPractice,
        showInterestingFactPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    await randomExerciseFunction();
}

// Patch the exercise functions to add the randomize button
showStoryPractice = patchExerciseForRandomizeButton(showStoryPractice, '.reading-exercise-container', startRandomReadingPractice);
showInterestingFactPractice = patchExerciseForRandomizeButton(showInterestingFactPractice, '.reading-exercise-container', startRandomReadingPractice);
