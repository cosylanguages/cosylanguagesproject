// Writing Exercises

// Placeholder functions for specific writing exercises
async function showDailyWriting() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.dailyWriting || 'Daily Writing'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showQuestionWriting() { // Assuming 'question-btn' maps to this
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.writingQuestion || 'Writing Question'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showStorytellingPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.storytelling || 'Storytelling'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

async function showDiaryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="writing-exercise-container">
            <h3>${currentTranslations.diary || 'Diary'}</h3>
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
        </div>`;
}

// Main function to start a random writing exercise
async function startRandomWritingPractice() {
    const exercises = [
        showDailyWriting,
        showQuestionWriting,
        showStorytellingPractice,
        showDiaryPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    await randomExerciseFunction();
}

// Patch the exercise functions to add the randomize button
showDailyWriting = patchExerciseForRandomizeButton(showDailyWriting, '.writing-exercise-container', startRandomWritingPractice);
showQuestionWriting = patchExerciseForRandomizeButton(showQuestionWriting, '.writing-exercise-container', startRandomWritingPractice);
showStorytellingPractice = patchExerciseForRandomizeButton(showStorytellingPractice, '.writing-exercise-container', startRandomWritingPractice);
showDiaryPractice = patchExerciseForRandomizeButton(showDiaryPractice, '.writing-exercise-container', startRandomWritingPractice);
