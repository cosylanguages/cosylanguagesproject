// Utility functions

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function showNoDataMessage() {
    const resultArea = document.getElementById('result');
    resultArea.innerHTML = '<p class="no-data">No data available for selected day/language.</p>';
}

function clearResultArea() {
    const resultArea = document.getElementById('result');
    if (resultArea) resultArea.innerHTML = '';
}

// Helper: Add randomize button to exercise containers
// This function is now part of patchExerciseWithExtraButtons, 
// but keeping a simplified version if it's used elsewhere directly,
// or it can be removed if patchExerciseWithExtraButtons is the sole user.
// For now, let's assume it might be used directly elsewhere.
function addRandomizeButton(containerIdOrElement, randomizeFn) { 
    console.log(`addRandomizeButton called for: ${containerIdOrElement}`);
    let container = containerIdOrElement;
    if (typeof containerIdOrElement === 'string') {
        container = document.querySelector(containerIdOrElement);
    }
    
    if (!container) {
        console.error(`[addRandomizeButton] Critical: Container NOT FOUND for selector/element: ${containerIdOrElement}. Button will not be added.`);
        return;
    }
    const existingBtn = container.querySelector('.btn-randomize'); // This is the old class, ensure new buttons use new IDs
    if (existingBtn) existingBtn.remove();
    
    let btn = document.createElement('button');
    btn.className = 'btn-randomize randomizer-button'; 
    const language = document.getElementById('language')?.value || 'COSYenglish'; 
    // Assuming 'translations' is globally available.
    // Fallback to COSYenglish if the specific language isn't found or if translations isn't defined.
    const currentTranslations = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || { buttons: {}, aria: {} };


    btn.setAttribute('aria-label', currentTranslations.aria?.randomizeCategory || 'Randomize exercise'); // Updated key
    btn.title = currentTranslations.aria?.randomizeCategory || 'Randomize exercise'; // Updated key
    btn.innerHTML = currentTranslations.buttons?.randomizeCategory || '<span aria-label="Randomize">🎲</span>'; // Updated key
    btn.onclick = randomizeFn;

    container.prepend(btn);
}

// More specific helper for exercises with known button IDs
function addEnterKeySupport(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input && button) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
    }
}

async function loadData(filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            try {
                const data = await response.json();
                return { data: data, error: null, errorType: null };
            } catch (jsonError) {
                console.error(`Error parsing JSON from ${filePath}:`, jsonError);
                return { data: [], error: 'Invalid JSON format', errorType: 'jsonError' };
            }
        } else {
            if (response.status === 404) {
                console.error(`Error loading data from ${filePath}: ${response.status} (File not found)`);
                return { data: [], error: 'File not found', errorType: 'fileNotFound' };
            } else {
                console.error(`Error loading data from ${filePath}: ${response.status}`);
                return { data: [], error: 'Failed to load data', errorType: 'httpError' };
            }
        }
    } catch (error) {
        console.error(`Network error or other exception while loading data from ${filePath}:`, error);
        return { data: [], error: 'Network error or other issue', errorType: 'networkError' };
    }
}

// Placeholder translations (to be added to translations.js)
// window.translations.COSYenglish.buttons.check = 'Check';
// window.translations.COSYenglish.aria.check = 'Check answer';
// window.translations.COSYenglish.buttons.reveal = 'Reveal Answer';
// window.translations.COSYenglish.aria.reveal = 'Reveal answer';
// window.translations.COSYenglish.buttons.randomizeCategory = 'New Random Exercise';
// window.translations.COSYenglish.aria.randomizeCategory = 'Start a new random exercise in this category';
// window.translations.COSYenglish.buttons.hint = 'Hint';
// window.translations.COSYenglish.aria.hint = 'Show a hint';
// window.translations.COSYenglish.noHintAvailable = 'No hint available for this exercise.';
// window.translations.COSYenglish.errors = {
//    revealNotImplemented: 'RevealAnswer function not found on container.',
//    checkNotImplemented: 'CheckAnswer function not found on container and no fallback button found.'
// };

function patchExerciseWithExtraButtons(originalExerciseFn, containerSelectorOrElement, randomizeFn, options = {}) {
    return async function() {
        // Call the original exercise function, ensuring 'this' and 'arguments' are passed correctly
        await originalExerciseFn.apply(this, arguments);
        
        let container;
        if (typeof containerSelectorOrElement === 'string') {
            container = document.querySelector(containerSelectorOrElement);
        } else {
            container = containerSelectorOrElement; // It's already an element
        }

        if (!container) {
            console.error(`[patchExerciseWithExtraButtons] Container NOT FOUND for selector/element: ${containerSelectorOrElement}. Buttons will not be added.`);
            return;
        }

        // Language and translations for buttons
        const language = document.getElementById('language')?.value || 'COSYenglish';
        
        // Ensure window.translations and the specific language translation exist, with defaults for buttons and aria
        window.translations = window.translations || {};
        window.translations.COSYenglish = window.translations.COSYenglish || { buttons: {}, aria: {}, errors: {} }; 
        const t = window.translations[language] || window.translations.COSYenglish;

        // Ensure t.buttons, t.aria, and t.errors exist to prevent errors if translations are not fully loaded
        t.buttons = t.buttons || {};
        t.aria = t.aria || {};
        t.errors = t.errors || {}; // Ensure errors object exists

        // Remove existing buttons to prevent duplication
        const btnIdsToRemove = ['btn-randomize-category', 'btn-hint', 'btn-check-exercise', 'btn-reveal-answer'];
        btnIdsToRemove.forEach(id => {
            const existingBtn = container.querySelector(`#${id}`);
            if (existingBtn) existingBtn.remove();
        });
        // Clean up old buttons by class if they exist (less specific, so done after ID removal)
        const oldClassBtns = container.querySelectorAll('.btn-randomize, .btn-hint'); 
        oldClassBtns.forEach(btn => {
            if (!btn.id || !btnIdsToRemove.includes(btn.id)) {
                 btn.remove();
            }
        });

        // Button creation logic - buttons are prepended, so add them in reverse order of appearance

        // "👁️ Reveal Answer" button
        if (!options.noReveal) {
            let revealBtn = document.createElement('button');
            revealBtn.id = 'btn-reveal-answer';
            revealBtn.className = 'exercise-button'; 
            revealBtn.innerHTML = `👁️ ${t.buttons.reveal || 'Reveal Answer'}`;
            revealBtn.title = t.aria?.reveal || 'Reveal answer';
            revealBtn.setAttribute('aria-label', t.aria?.reveal || 'Reveal answer');
            revealBtn.onclick = () => {
                console.log('Reveal answer button clicked.');
                if (typeof container.revealAnswer === 'function') {
                    container.revealAnswer();
                } else {
                    alert(t.errors.revealNotImplemented || 'RevealAnswer function not found on container.');
                }
            };
            container.prepend(revealBtn);
        }

        // "✅ Check" button
        if (!options.noCheck) {
            let checkBtn = document.createElement('button');
            checkBtn.id = 'btn-check-exercise';
            checkBtn.className = 'exercise-button';
            checkBtn.innerHTML = `✅ ${t.buttons.check || 'Check'}`;
            checkBtn.title = t.aria?.check || 'Check answer';
            checkBtn.setAttribute('aria-label', t.aria?.check || 'Check answer');
            checkBtn.onclick = () => {
                console.log('Check button clicked.');
                if (typeof container.checkAnswer === 'function') {
                    container.checkAnswer();
                } else {
                    const specificCheckButton = container.querySelector('#check-button') || container.querySelector('.check-button');
                    if (specificCheckButton && typeof specificCheckButton.click === 'function') {
                        specificCheckButton.click();
                    } else {
                        alert(t.errors.checkNotImplemented || 'CheckAnswer function not found on container and no fallback button found.');
                    }
                }
            };
            container.prepend(checkBtn);
        }
        
        // "💡 Hint" button - Always added unless an option like `noHint` is introduced in the future.
        let hintBtn = document.createElement('button');
        hintBtn.id = 'btn-hint';
        hintBtn.className = 'exercise-button';
        hintBtn.innerHTML = `💡 ${t.buttons.hint || 'Hint'}`;
        hintBtn.title = t.aria?.hint || 'Show a hint';
        hintBtn.setAttribute('aria-label', t.aria?.hint || 'Show a hint');
        hintBtn.onclick = () => {
            if (typeof container.showHint === 'function') {
                container.showHint();
            } else {
                alert(t.noHintAvailable || 'No hint available for this exercise.');
            }
        };
        container.prepend(hintBtn);

        // "🎲 Randomize (Category)" button - Always added.
        let randomizeBtn = document.createElement('button');
        randomizeBtn.id = 'btn-randomize-category';
        randomizeBtn.className = 'exercise-button randomizer-button'; 
        randomizeBtn.innerHTML = `🎲 ${t.buttons.randomizeCategory || 'New Random Exercise'}`;
        randomizeBtn.title = t.aria?.randomizeCategory || 'Start a new random exercise in this category';
        randomizeBtn.setAttribute('aria-label', t.aria?.randomizeCategory || 'Start a new random exercise in this category');
        randomizeBtn.onclick = randomizeFn; 
        container.prepend(randomizeBtn);
    }
}


async function loadSpeakingQuestions(language, day) {
    let langFileKey;
    // Determine langFileKey using a switch or map
    switch(language) {
        case 'COSYenglish': langFileKey = 'english'; break;
        case 'COSYfrançais': langFileKey = 'french'; break;
        case 'COSYespañol': langFileKey = 'spanish'; break;
        case 'COSYitaliano': langFileKey = 'italian'; break;
        case 'COSYdeutsch': langFileKey = 'german'; break;
        case 'COSYportuguês': langFileKey = 'portuguese'; break;
        case 'ΚΟΖΥελληνικά': langFileKey = 'greek'; break;
        case 'ТАКОЙрусский': langFileKey = 'russian'; break;
        case 'ԾՈՍՅհայկական': langFileKey = 'armenian'; break;
        case 'COSYbrezhoneg': langFileKey = 'breton'; break;
        case 'COSYtatarça': langFileKey = 'tatar'; break;
        case 'COSYbashkort': langFileKey = 'bashkir'; break;
        default:
            console.warn(`Unsupported language for speaking questions: ${language}. No questions will be loaded.`);
            return []; // Return empty array if language is not mapped
    }

    const filePath = `data/speaking/question/question_${langFileKey}.json`;

    const result = await loadData(filePath); // loadData remains unchanged

    if (result.error) {
        // Error already logged by loadData, but we can add context for which mapping was used
        console.error(`Error encountered in loadSpeakingQuestions for ${language} (mapped to ${langFileKey}), day ${day} from ${filePath}: ${result.errorType} - ${result.error}`);
        return [];
    }

    const data = result.data;
    // Ensure data is not null and day exists
    if (data && data[day]) {
        return data[day];
    } else {
        // console.warn(`No speaking questions found for ${language} (mapped to ${langFileKey}), day ${day}`);
        return [];
    }
}


// Content from uiFeatures.js starts here

const activeExerciseTimers = {
    autoAdvance: null
};

function cancelAutoAdvanceTimer() {
    if (activeExerciseTimers.autoAdvance) {
        clearTimeout(activeExerciseTimers.autoAdvance);
        activeExerciseTimers.autoAdvance = null;
    }
}

async function startRandomExerciseInCategory(categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject) {
    if (!allPracticeTypesObject || !allPracticeTypesObject[categoryName] || !allPracticeTypesObject[categoryName].exercises) {
        console.error(`Error: Category "${categoryName}" or its exercises not found in practice types object.`);
        return;
    }

    const exercisesInCat = allPracticeTypesObject[categoryName].exercises;
    if (!exercisesInCat || exercisesInCat.length === 0) {
        console.error(`Error: No exercises listed for category "${categoryName}".`);
        return;
    }

    let availableExercises = exercisesInCat.filter(name => name !== currentExerciseFunctionNameAsString);

    let targetFunctionName;
    if (availableExercises.length > 0) {
        targetFunctionName = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    } else if (exercisesInCat.length > 0) { // If filtering left no options, but there were options
        console.warn(`No other exercises available in "${categoryName}" besides "${currentExerciseFunctionNameAsString}". Picking from original list.`);
        targetFunctionName = exercisesInCat[Math.floor(Math.random() * exercisesInCat.length)];
    } else { // Should not happen if initial checks pass
        console.error(`Error: Could not determine a target exercise for category "${categoryName}".`);
        return;
    }
    
    if (targetFunctionName) {
        if (typeof window[targetFunctionName] === 'function') {
            try {
                // Assuming exercise functions might be async and we should wait for them
                await window[targetFunctionName]();
            } catch (error) {
                console.error(`Error executing exercise function "${targetFunctionName}":`, error);
            }
        } else {
            console.error(`Error: Target exercise function "${targetFunctionName}" not found or not a function.`);
        }
    } else {
        console.error(`Error: No target function name determined for category "${categoryName}".`);
    }
}

function startAutoAdvanceTimer(categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject, durationMs = 3000) { // Default duration 3s
    cancelAutoAdvanceTimer(); // Clear any existing timer
    activeExerciseTimers.autoAdvance = setTimeout(async () => { // Make sure the async nature of startRandomExerciseInCategory is handled
        await startRandomExerciseInCategory(categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject);
    }, durationMs);
}

function setupExerciseCompletionFeedbackObserver(feedbackElement, categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject, timerDurationMs = 3000) {
    if (!feedbackElement) {
        // console.warn("setupExerciseCompletionFeedbackObserver: feedbackElement is null.");
        return;
    }

    const observer = new MutationObserver((mutationsList, obs) => {
        let completionDetected = false;
        for (const mutation of mutationsList) {
            // Check for added nodes or character data changes that indicate feedback
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added node contains typical feedback classes or text
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) { // Check if it's an element
                        if (node.classList.contains('correct') || node.classList.contains('incorrect') || (node.textContent && node.textContent.trim() !== '')) {
                            completionDetected = true;
                            break;
                        }
                    } else if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim() !== '') {
                        completionDetected = true;
                        break;
                    }
                }
            } else if (mutation.type === 'characterData') {
                 if (mutation.target.textContent && mutation.target.textContent.trim() !== '') {
                    completionDetected = true;
                 }
            }
            if (completionDetected) break;
        }

        if (completionDetected) {
            // console.log("Completion feedback detected, starting auto-advance timer.");
            startAutoAdvanceTimer(categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject, timerDurationMs);
            obs.disconnect(); // Stop observing once completion is detected and timer is set
        }
    });

    observer.observe(feedbackElement, { childList: true, characterData: true, subtree: true });
    // console.log("Feedback observer set up for:", feedbackElement);
}

function createStandardRandomizeButton(categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject) {
    const btn = document.createElement('button');
    btn.className = 'btn-randomize randomizer-button'; // Standardized class
    
    // Attempt to get translations, similar to addRandomizeButton in utils.js
    // This assumes `translations` is a global variable and `document.getElementById('language').value` is accessible
    let label = '🎲'; // Default
    let title = 'Randomize exercise'; // Default
    try {
        const language = document.getElementById('language')?.value || 'COSYenglish';
        const currentTranslations = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || { buttons: {}, aria: {} };
        label = currentTranslations.buttons?.randomizeCategory || '<span aria-label="Randomize">🎲</span>'; // Updated key
        title = currentTranslations.aria?.randomizeCategory || 'Randomize exercise'; // Updated key
    } catch (e) {
        // console.warn("Could not get translations for randomize button, using defaults.", e);
    }

    btn.innerHTML = label;
    btn.title = title;
    btn.setAttribute('aria-label', title); 

    btn.onclick = async () => { 
        cancelAutoAdvanceTimer();
        await startRandomExerciseInCategory(categoryName, currentExerciseFunctionNameAsString, allPracticeTypesObject);
    };
    return btn;
}

function playSound(soundName) {
    const validSounds = ['click', 'success', 'error', 'select'];
    if (!validSounds.includes(soundName)) {
        console.warn(`Attempted to play an unknown sound: "${soundName}". Expected one of: ${validSounds.join(', ')}.`);
        // Optionally, play a default sound or do nothing. For now, just warn.
        // return; 
    }

    const audioPath = `assets/sounds/${soundName}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(error => {
        console.error(`Error playing sound "${soundName}" from path "${audioPath}":`, error);
    });
}

// Function to remove accents/diacritics from a string
function normalizeString(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
