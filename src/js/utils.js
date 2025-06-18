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
    const existingBtn = container.querySelector('.btn-randomize');
    if (existingBtn) existingBtn.remove();
    
    let btn = document.createElement('button');
    btn.className = 'btn-randomize randomizer-button'; 
    const language = document.getElementById('language')?.value || 'COSYenglish'; 
    const currentTranslations = translations[language] || translations.COSYenglish;

    btn.setAttribute('aria-label', currentTranslations.aria?.randomize || 'Randomize exercise');
    btn.title = currentTranslations.aria?.randomize || 'Randomize exercise';
    btn.innerHTML = currentTranslations.buttons?.randomize || '<span aria-label="Randomize">🎲</span>';
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

function patchExerciseWithExtraButtons(originalExerciseFn, containerSelectorOrElement, randomizeFn) {
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
        const t = window.translations[language] || window.translations.COSYenglish;

        // Add/Update Randomize Button
        const existingRandomizeBtn = container.querySelector('.btn-randomize');
        if (existingRandomizeBtn) existingRandomizeBtn.remove();
        
        let randomizeBtn = document.createElement('button');
        randomizeBtn.className = 'btn-randomize randomizer-button'; // Keep both classes for compatibility
        randomizeBtn.setAttribute('aria-label', t.aria?.randomize || 'Randomize exercise');
        randomizeBtn.title = t.aria?.randomize || 'Randomize exercise';
        randomizeBtn.innerHTML = t.buttons?.randomize || '<span aria-label="Randomize">🎲</span>';
        randomizeBtn.onclick = randomizeFn;
        container.prepend(randomizeBtn); // Prepend to make it appear first (usually on the right due to float)

        // Add/Update Hint Button
        const existingHintBtn = container.querySelector('.btn-hint');
        if (existingHintBtn) existingHintBtn.remove();

        let hintBtn = document.createElement('button');
        hintBtn.className = 'btn-hint';
        hintBtn.innerHTML = '💡'; // Lightbulb emoji
        hintBtn.title = t.aria?.hint || 'Show a hint';
        hintBtn.setAttribute('aria-label', t.aria?.hint || 'Show a hint');
        
        hintBtn.onclick = () => {
            if (typeof container.showHint === 'function') {
                container.showHint();
            } else {
                alert(t.noHintAvailable || 'No hint available for this exercise.');
            }
        };
        // Prepend hint button. If randomize also prepended, hint will be before randomize.
        // If randomize floats right, and hint floats right and is added after, hint will be to the left of randomize.
        // To ensure hint is to the left of a right-floated randomize button:
        // randomizeBtn is already prepended. If hintBtn is also prepended, it will appear before randomizeBtn in DOM.
        // If both float right, the one appearing earlier in DOM will be further to the right.
        // So, prepend randomize, then prepend hint to put hint to the left of randomize.
        // Or, more simply, ensure CSS handles order if both float right (e.g. hint has margin-left, randomize has no margin-left or smaller).
        // Current CSS for .randomizer-button has margin-left: 10px and float: right.
        // .btn-hint has margin-left: 5px and float: right.
        // If hintBtn is prepended *after* randomizeBtn, it will be to the right of randomizeBtn.
        // If hintBtn is prepended *before* randomizeBtn, it will be to the left of randomizeBtn.
        // Let's prepend hint button *before* the randomize button to place it to the left, assuming float:right for both.
        if (randomizeBtn.parentNode === container) { // ensure randomizeBtn was added
             container.insertBefore(hintBtn, randomizeBtn);
        } else {
             container.prepend(hintBtn); // fallback if randomizeBtn somehow wasn't prepended
        }
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
    let label = '🎲';
    let title = 'Randomize exercise';
    try {
        const language = document.getElementById('language')?.value || 'COSYenglish';
        const currentTranslations = window.translations[language] || window.translations.COSYenglish;
        label = currentTranslations.buttons?.randomize || '<span aria-label="Randomize">🎲</span>';
        title = currentTranslations.aria?.randomize || 'Randomize exercise';
    } catch (e) {
        // console.warn("Could not get translations for randomize button, using defaults.", e);
    }

    btn.innerHTML = label;
    btn.title = title;
    btn.setAttribute('aria-label', title); // Ensure aria-label is set, especially if innerHTML is an icon

    btn.onclick = async () => { // Make sure the async nature of startRandomExerciseInCategory is handled
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
        // return; // Or proceed to try to play it anyway if assets might have other sounds.
    }

    const audioPath = `assets/sounds/${soundName}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(error => {
        console.error(`Error playing sound "${soundName}" from path "${audioPath}":`, error);
        // This can happen due to browser autoplay policies, or if the file is missing/corrupt.
    });
}

// Function to remove accents/diacritics from a string
function normalizeString(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
