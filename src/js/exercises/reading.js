// Reading Exercises
let readingPracticeTimer = null; // Timer for auto-progression

// Placeholder functions for specific reading exercises
async function showStoryPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const newExerciseButtonText = t.buttons?.newStoryExercise || t.buttons?.newExerciseSameType || 'New Story';
    
    resultArea.innerHTML = `
        <div class="reading-exercise-container exercise-container">
            <p>${t.exerciseNotImplementedStory || 'This story exercise is not yet implemented.'}</p>
            <p>${t.imagineStoryHere || 'Imagine you read a story here.'}</p>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }

    const exerciseContainer = resultArea.querySelector('.reading-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { // Assign to function property
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintReadingGeneric || 'Focus on understanding the main idea and any new vocabulary. Take your time!'}`;
            this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') {
                window.refreshLatinization();
            }
        };
        // For passive reading, checkAnswer and revealAnswer might not be applicable
        exerciseContainer.checkAnswer = function() {
            console.log("CheckAnswer called for story practice - no specific check defined.");
        };
        exerciseContainer.revealAnswer = function() {
            console.log("RevealAnswer called for story practice - no specific reveal defined.");
             const feedbackArea = this.querySelector('#reading-feedback') || document.createElement('div');
             if(!feedbackArea.id) feedbackArea.id = 'reading-feedback';
             feedbackArea.className = 'exercise-feedback';
             feedbackArea.innerHTML = t.noSpecificRevealReading || "This is a reading exercise. Try to read and understand the text.";
             if(!feedbackArea.parentElement) this.appendChild(feedbackArea);
             if (typeof window.refreshLatinization === 'function') {
                window.refreshLatinization();
            }
        };
    }

    // Clear any existing timer for auto-progression if it was used previously
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
        window.readingPracticeTimer = null;
    }
}

async function showInterestingFactPractice() {
    const resultArea = document.getElementById('result');
    const language = document.getElementById('language')?.value || 'COSYenglish';
    const t = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || {};
    const newExerciseButtonText = t.buttons?.newFactExercise || t.buttons?.newExerciseSameType || 'New Fact';
    
    resultArea.innerHTML = `
        <div class="reading-exercise-container exercise-container">
            <p>${t.exerciseNotImplementedFact || 'This interesting fact exercise is not yet implemented.'}</p>
            <p>${t.imagineFactHere || 'Imagine you read an interesting fact here.'}</p>
        </div>
    `;
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
    
    const exerciseContainer = resultArea.querySelector('.reading-exercise-container');
    if (exerciseContainer) {
        exerciseContainer.showHint = function() { // Assign to function property
            const existingHint = this.querySelector('.hint-display');
            if (existingHint) existingHint.remove();
            const hintDisplay = document.createElement('div');
            hintDisplay.className = 'hint-display exercise-hint';
            hintDisplay.textContent = `${t.hintLabel || 'Hint:'} ${t.hintReadingFact || 'Try to learn something new from this fact!'}`;
            this.appendChild(hintDisplay);
            if (typeof window.refreshLatinization === 'function') {
                window.refreshLatinization();
            }
        };
        // For passive reading, checkAnswer and revealAnswer might not be applicable
        exerciseContainer.checkAnswer = function() {
            console.log("CheckAnswer called for fact practice - no specific check defined.");
        };
        exerciseContainer.revealAnswer = function() {
            console.log("RevealAnswer called for fact practice - no specific reveal defined.");
            const feedbackArea = this.querySelector('#reading-feedback') || document.createElement('div');
            if(!feedbackArea.id) feedbackArea.id = 'reading-feedback';
            feedbackArea.className = 'exercise-feedback';
            feedbackArea.innerHTML = t.noSpecificRevealReadingFact || "This is an interesting fact. Read it carefully to learn!";
            if(!feedbackArea.parentElement) this.appendChild(feedbackArea);
            if (typeof window.refreshLatinization === 'function') {
                window.refreshLatinization();
            }
        };
    }
    
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
        window.readingPracticeTimer = null;
    }
}

// Main function to start a random reading exercise
async function startRandomReadingPractice() {
    if (window.readingPracticeTimer) {
        clearTimeout(window.readingPracticeTimer);
        window.readingPracticeTimer = null;
    }

    const exercises = [
        showStoryPractice,
        showInterestingFactPractice
    ];
    const randomExerciseFunction = exercises[Math.floor(Math.random() * exercises.length)];
    
    const resultArea = document.getElementById('result');
    if(resultArea) resultArea.innerHTML = ''; // Clear previous content

    await randomExerciseFunction(); // Call the selected exercise function
                                    // refreshLatinization is called within the specific exercise functions
}

function initReadingPractice() {
    const readingButton = document.getElementById('reading-practice-btn'); 
    if (readingButton) {
        readingButton.addEventListener('click', () => {
            startRandomReadingPractice();
        });
    }
}

// Ensure functions are on window scope for patching and HTML onclicks
window.showStoryPractice = showStoryPractice;
window.showInterestingFactPractice = showInterestingFactPractice;
window.startRandomReadingPractice = startRandomReadingPractice;
window.initReadingPractice = initReadingPractice;

// Patching exercise functions
window.showStoryPractice = patchExerciseWithExtraButtons(
    window.showStoryPractice, 
    '.reading-exercise-container', 
    window.startRandomReadingPractice, 
    { noCheck: true, noReveal: true, newExercise: { fn: window.startRandomReadingPractice, textKey: 'newExercise' } } 
); // patchExerciseWithExtraButtons calls refreshLatinization at its end
window.showInterestingFactPractice = patchExerciseWithExtraButtons(
    window.showInterestingFactPractice, 
    '.reading-exercise-container', 
    window.startRandomReadingPractice, 
    { noCheck: true, noReveal: true, newExercise: { fn: window.startRandomReadingPractice, textKey: 'newExercise' } } 
); // patchExerciseWithExtraButtons calls refreshLatinization at its end

document.addEventListener('DOMContentLoaded', initReadingPractice);
