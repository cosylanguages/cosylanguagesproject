// Reading Exercises
let readingPracticeTimer = null; // Timer for auto-progression

// Placeholder functions for specific reading exercises
async function showStoryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    
    resultArea.innerHTML = `
        <div class="reading-exercise-container">
            <h3>${currentTranslations.storyTime || 'Story Time'}</h3>
            <p>${currentTranslations.exerciseNotImplementedStory || 'This story exercise is not yet implemented.'}</p>
            <p>${currentTranslations.imagineStoryHere || 'Imagine you read a story here and then click continue.'}</p>
            <button id="finish-reading-story-btn" class="btn-primary">${currentTranslations.buttons?.continue || 'Continue'}</button>
        </div>
    `;

    // Clear previous timer before setting a new one or attaching event listener
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
    }

    document.getElementById('finish-reading-story-btn').addEventListener('click', () => {
        console.log("Story practice conceptually finished.");
        // Clear timer again in case button is clicked before timeout
        if (window.readingPracticeTimer) {
            clearTimeout(window.readingPracticeTimer);
        }
        // Proceed to the next random reading exercise (auto-progression)
        window.readingPracticeTimer = setTimeout(() => {
            startRandomReadingPractice();
        }, 1000); // Short delay
    });
}

async function showInterestingFactPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const currentTranslations = translations[language] || translations.COSYenglish;
    
    resultArea.innerHTML = `
        <div class="reading-exercise-container">
            <h3>${currentTranslations.interestingFact || 'Interesting Fact'}</h3>
            <p>${currentTranslations.exerciseNotImplementedFact || 'This interesting fact exercise is not yet implemented.'}</p>
            <p>${currentTranslations.imagineFactHere || 'Imagine you read an interesting fact here and then click continue.'}</p>
            <button id="finish-reading-fact-btn" class="btn-primary">${currentTranslations.buttons?.continue || 'Continue'}</button>
        </div>
    `;
    
    // Clear previous timer
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
    }

    document.getElementById('finish-reading-fact-btn').addEventListener('click', () => {
        console.log("Interesting fact practice conceptually finished.");
        if (window.readingPracticeTimer) {
            clearTimeout(window.readingPracticeTimer);
        }
        window.readingPracticeTimer = setTimeout(() => {
            startRandomReadingPractice();
        }, 1000);
    });
}

// Main function to start a random reading exercise
async function startRandomReadingPractice() {
    // Clear any existing timer when starting a new random practice explicitly
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
    }
    if (typeof cancelAutoAdvanceTimer === 'function') { // If using the more generic timer from utils.js
        cancelAutoAdvanceTimer();
    }


    const exercises = [
        showStoryPractice,
        showInterestingFactPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    
    // Ensure the result area is cleared before loading new exercise
    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = ''; // Clear previous content

    await randomExerciseFunction();
}

// Initialize Reading Practice (example: button to start)
function initReadingPractice() {
    const readingButton = document.getElementById('reading-practice-btn'); // Assuming a button with this ID exists
    if (readingButton) {
        readingButton.addEventListener('click', () => {
            startRandomReadingPractice();
        });
    }
}

// Patch the exercise functions to add the randomize button (🎲)
// This button also calls startRandomReadingPractice, so the timer clearing in startRandomReadingPractice is important.
showStoryPractice = patchExerciseForRandomizeButton(showStoryPractice, '.reading-exercise-container', startRandomReadingPractice);
showInterestingFactPractice = patchExerciseForRandomizeButton(showInterestingFactPractice, '.reading-exercise-container', startRandomReadingPractice);

// Call init function if applicable, e.g. on DOMContentLoaded
// document.addEventListener('DOMContentLoaded', initReadingPractice);
// Assuming initReadingPractice might be called from a main script or similar.
// For now, ensure functions are available.
window.showStoryPractice = showStoryPractice;
window.showInterestingFactPractice = showInterestingFactPractice;
window.startRandomReadingPractice = startRandomReadingPractice;
window.initReadingPractice = initReadingPractice;
