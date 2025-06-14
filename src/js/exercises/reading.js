// Reading Exercises

const READING_PRACTICE_TYPES = {
    'reading-main': { // Using a generic category name as these are top-level reading exercises
        exercises: ['showStoryPractice', 'showInterestingFactPractice'],
        name: 'Reading Practice' // Display name for the category
    }
};

// Placeholder functions for specific reading exercises
async function showStoryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="reading-exercise-container exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
            <div class="exercise-actions" style="margin-top: 15px;"></div>
        </div>`;

    if (typeof createStandardRandomizeButton === 'function') {
        const randomButton = createStandardRandomizeButton('reading-main', 'showStoryPractice', READING_PRACTICE_TYPES);
        const actionsDiv = resultArea.querySelector('.exercise-actions');
        if (actionsDiv) {
            actionsDiv.appendChild(randomButton);
        } else { // Fallback if the actions div isn't found
            resultArea.querySelector('.reading-exercise-container').appendChild(randomButton);
        }
    }
    // No feedback observer for placeholders.
}

async function showInterestingFactPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    resultArea.innerHTML = `
        <div class="reading-exercise-container exercise-container">
            <p>${currentTranslations.exerciseNotImplemented || 'This exercise is not yet implemented.'}</p>
            <div class="exercise-actions" style="margin-top: 15px;"></div>
        </div>`;

    if (typeof createStandardRandomizeButton === 'function') {
        const randomButton = createStandardRandomizeButton('reading-main', 'showInterestingFactPractice', READING_PRACTICE_TYPES);
        const actionsDiv = resultArea.querySelector('.exercise-actions');
        if (actionsDiv) {
            actionsDiv.appendChild(randomButton);
        } else { // Fallback
            resultArea.querySelector('.reading-exercise-container').appendChild(randomButton);
        }
    }
    // No feedback observer for placeholders.
}

// Main function to start a random reading exercise
async function startRandomReadingPractice() {
    const category = READING_PRACTICE_TYPES['reading-main'];
    if (!category || !category.exercises || category.exercises.length === 0) {
        console.error("Reading exercises not defined or empty in READING_PRACTICE_TYPES.");
        const resultArea = document.getElementById('result');
        if (resultArea) {
            const lang = document.getElementById('language')?.value || 'COSYenglish';
            const currentTranslations = translations[lang] || translations.COSYenglish;
            resultArea.innerHTML = `<p>${currentTranslations.exerciseLoadingError || 'Error loading exercise. Please try again.'}</p>`;
        }
        return;
    }
    const randomExerciseName = category.exercises[Math.floor(Math.random() * category.exercises.length)];
    if (window[randomExerciseName] && typeof window[randomExerciseName] === 'function') {
        await window[randomExerciseName]();
    } else {
        console.error(`Exercise function ${randomExerciseName} not found.`);
        // Fallback or error message
        const resultArea = document.getElementById('result');
        if (resultArea) {
            const lang = document.getElementById('language')?.value || 'COSYenglish';
            const currentTranslations = translations[lang] || translations.COSYenglish;
            resultArea.innerHTML = `<p>${currentTranslations.exerciseLoadingError || 'Error loading exercise. Please try again.'}</p>`;
        }
    }
}

// patchExerciseForRandomizeButton calls are removed.
// Old calls were:
// showStoryPractice = patchExerciseForRandomizeButton(showStoryPractice, '.reading-exercise-container', startRandomReadingPractice);
// showInterestingFactPractice = patchExerciseForRandomizeButton(showInterestingFactPractice, '.reading-exercise-container', startRandomReadingPractice);
