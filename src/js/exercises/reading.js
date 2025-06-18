// Reading Exercises
let readingPracticeTimer = null; // Timer for auto-progression

// Placeholder functions for specific reading exercises
async function showStoryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="reading-exercise-container">
            <p>${t.exerciseNotImplementedStory || 'This story exercise is not yet implemented.'}</p>
            <p>${t.imagineStoryHere || 'Imagine you read a story here and then click continue.'}</p>
            <button id="finish-reading-story-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;

    const exerciseContainer = resultArea.querySelector('.reading-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintReadingGeneric || 'Focus on understanding the main idea and any new vocabulary. Take your time!'}`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }

    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
    }

    document.getElementById('finish-reading-story-btn').addEventListener('click', () => {
        console.log("Story practice conceptually finished.");
        if (window.readingPracticeTimer) {
            clearTimeout(window.readingPracticeTimer);
        }
        window.readingPracticeTimer = setTimeout(() => {
            startRandomReadingPractice();
        }, 1000); 
    });
}

async function showInterestingFactPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = translations[language] || translations.COSYenglish;
    const buttonText = t.buttons?.continue || 'Continue';
    
    resultArea.innerHTML = `
        <div class="reading-exercise-container">
            <p>${t.exerciseNotImplementedFact || 'This interesting fact exercise is not yet implemented.'}</p>
            <p>${t.imagineFactHere || 'Imagine you read an interesting fact here and then click continue.'}</p>
            <button id="finish-reading-fact-btn" class="btn-secondary btn-next-item" aria-label="${buttonText}">🔄 ${buttonText}</button>
        </div>
    `;
    
    const exerciseContainer = resultArea.querySelector('.reading-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = () => {
            const existingHint = exerciseContainer.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintReadingGeneric || 'Focus on understanding the main idea and any new vocabulary. Take your time!'}`;
            exerciseContainer.appendChild(hintDisplay);
        };
    }
    
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
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
    }
    if (typeof cancelAutoAdvanceTimer === 'function') { 
        cancelAutoAdvanceTimer();
    }

    const exercises = [
        showStoryPractice,
        showInterestingFactPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    
    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = ''; 

    await randomExerciseFunction();
}

function initReadingPractice() {
    const readingButton = document.getElementById('reading-practice-btn'); 
    if (readingButton) {
        readingButton.addEventListener('click', () => {
            startRandomReadingPractice();
        });
    }
}

showStoryPractice = patchExerciseWithExtraButtons(showStoryPractice, '.reading-exercise-container', startRandomReadingPractice);
showInterestingFactPractice = patchExerciseWithExtraButtons(showInterestingFactPractice, '.reading-exercise-container', startRandomReadingPractice);

window.showStoryPractice = showStoryPractice;
window.showInterestingFactPractice = showInterestingFactPractice;
window.startRandomReadingPractice = startRandomReadingPractice;
window.initReadingPractice = initReadingPractice;
