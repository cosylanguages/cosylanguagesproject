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
    if (typeof window.refreshLatinization === 'function') {
        window.refreshLatinization();
    }
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
    // It's good to keep this cleanup for any rogue old buttons.
    const existingBtn = container.querySelector('.btn-randomize'); 
    if (existingBtn) existingBtn.remove();
    
    // Also check for and remove button with the new ID to prevent duplicates if called mistakenly.
    const existingNewBtn = container.querySelector('#btn-randomize-category');
    if (existingNewBtn) existingNewBtn.remove();

    let btn = document.createElement('button');
    btn.className = 'exercise-button randomizer-button'; // MODIFIED
    btn.id = 'btn-randomize-category';                   // ADDED
    const language = document.getElementById('language')?.value || 'COSYenglish'; 
    const currentTranslations = (window.translations && window.translations[language]) || (window.translations && window.translations.COSYenglish) || { buttons: {}, aria: {} };

    btn.setAttribute('aria-label', currentTranslations.aria?.randomizeCategory || 'Randomize exercise');
    btn.title = currentTranslations.aria?.randomizeCategory || 'Randomize exercise';
    btn.innerHTML = '🎲'; // MODIFIED


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
        await originalExerciseFn.apply(this, arguments);
        
        let container;
        if (typeof containerSelectorOrElement === 'string') {
            container = document.querySelector(containerSelectorOrElement);
        } else {
            container = containerSelectorOrElement;
        }

        if (!container) {
            console.error(`[patchExerciseWithExtraButtons] Container NOT FOUND for selector/element: ${containerSelectorOrElement}. Buttons will not be added.`);
            return;
        }

        const language = document.getElementById('language')?.value || 'COSYenglish';
        window.translations = window.translations || {};
        window.translations.COSYenglish = window.translations.COSYenglish || { buttons: {}, aria: {}, errors: {} }; 
        const t = window.translations[language] || window.translations.COSYenglish;
        t.buttons = t.buttons || {};
        t.aria = t.aria || {};
        t.errors = t.errors || {};

        // 1. Cleanup existing buttons from the main container
        const btnIdsToRemove = ['btn-randomize-category', 'btn-hint', 'btn-check-exercise', 'btn-reveal-answer', 'btn-next-specific-exercise'];
        btnIdsToRemove.forEach(id => {
            const existingBtn = container.querySelector(`#${id}`);
            if (existingBtn) existingBtn.remove();
        });
        const oldClassBtns = container.querySelectorAll('.btn-randomize, .btn-hint, .exercise-button-bar-top, .exercise-button-bar-bottom'); 
        oldClassBtns.forEach(btn => {
            // Check if it's one of the bars themselves or an old button without a new ID
            if (btn.classList.contains('exercise-button-bar-top') || btn.classList.contains('exercise-button-bar-bottom')) {
                 btn.remove(); 
            } else if (!btn.id || !btnIdsToRemove.includes(btn.id)) {
                 // This condition might be too broad, be careful.
                 // Intended to remove old buttons not matching new IDs.
            }
        });

        // 2. Create specific containers for top and bottom buttons
        const topButtonContainer = document.createElement('div');
        topButtonContainer.className = 'exercise-button-bar-top';

        const bottomButtonContainer = document.createElement('div');
        bottomButtonContainer.className = 'exercise-button-bar-bottom';

        // 3. Create and add buttons to their respective containers

        // --- TOP BUTTONS ---

        // "🎲 Randomize (Category)" button - Always added to top.
        let randomizeBtn = document.createElement('button');
        randomizeBtn.id = 'btn-randomize-category';
        randomizeBtn.className = 'exercise-button randomizer-button'; 
        randomizeBtn.innerHTML = `🎲`;
        randomizeBtn.title = t.aria?.randomizeCategory || 'Start a new random exercise in this category';
        randomizeBtn.setAttribute('aria-label', t.aria?.randomizeCategory || 'Start a new random exercise in this category');
        
        if (options.deferRandomizeClick) {
            const actualRandomizeFn = randomizeFn; 
            randomizeBtn.onclick = null; 
            setTimeout(() => {
                if (document.body.contains(randomizeBtn)) { 
                    randomizeBtn.onclick = actualRandomizeFn;
                }
            }, 100); 
        } else {
            randomizeBtn.onclick = randomizeFn;
        }
        topButtonContainer.appendChild(randomizeBtn);

        // "💡 Hint" button - Conditionally added to top.
        if (!options.noHint) { 
            let hintBtn = document.createElement('button');
            hintBtn.id = 'btn-hint';
            hintBtn.className = 'exercise-button';
            hintBtn.innerHTML = `💡`;
            hintBtn.title = t.aria?.hint || 'Show a hint';
            hintBtn.setAttribute('aria-label', t.aria?.hint || 'Show a hint');
            hintBtn.onclick = () => {
                if (typeof container.showHint === 'function') {
                    container.showHint();
                } else {
                    alert(t.noHintAvailable || 'No hint available for this exercise.');
                }
            };
            topButtonContainer.appendChild(hintBtn);
        }
        
        // "👁️ Reveal Answer" button - Added to top if not disabled
        if (!options.noReveal) {
            let revealBtn = document.createElement('button');
            revealBtn.id = 'btn-reveal-answer';
            revealBtn.className = 'exercise-button'; 
            revealBtn.innerHTML = `👁️`;
            revealBtn.title = t.aria?.reveal || 'Reveal answer';
            revealBtn.setAttribute('aria-label', t.aria?.reveal || 'Reveal answer');
            revealBtn.onclick = () => {
                if (typeof container.revealAnswer === 'function') {
                    container.revealAnswer();
                } else {
                    alert(t.errors.revealNotImplemented || 'RevealAnswer function not found on container.');
                }
            };
            topButtonContainer.appendChild(revealBtn);
        }

        // --- BOTTOM BUTTONS ---

        // "✅ Check" button - Added to bottom if not disabled
        if (!options.noCheck) {
            let checkBtn = document.createElement('button');
            checkBtn.id = 'btn-check-exercise';
            checkBtn.className = 'exercise-button'; 
            checkBtn.innerHTML = `✅ ${t.buttons.check || 'Check'}`;
            checkBtn.title = t.aria?.check || 'Check answer';
            checkBtn.setAttribute('aria-label', t.aria?.check || 'Check answer');
            checkBtn.onclick = () => {
                if (typeof container.checkAnswer === 'function') {
                    container.checkAnswer();
                } else {
                    const specificCheckButton = container.querySelector('#check-button') || container.querySelector('.check-button') || container.querySelector('button[id*="check-"]');
                    if (specificCheckButton && typeof specificCheckButton.click === 'function') {
                        specificCheckButton.click();
                    } else {
                        alert(t.errors.checkNotImplemented || 'CheckAnswer function not found on container and no fallback button found.');
                    }
                }
            };
            bottomButtonContainer.appendChild(checkBtn);
        }

        // "🔄 Next Exercise (Same Type)" button - Added to bottom if specified
        if (options.specificNextExerciseFn) {
            let specificNextBtn = document.createElement('button');
            specificNextBtn.id = 'btn-next-specific-exercise'; 
            specificNextBtn.className = 'exercise-button'; 
            
            let labelContent = '';
            if (options.specificNextExerciseLabelKey && t.buttons) {
                const actualKey = options.specificNextExerciseLabelKey.startsWith('buttons.') ? options.specificNextExerciseLabelKey.substring('buttons.'.length) : options.specificNextExerciseLabelKey;
                if (t.buttons[actualKey]) {
                    labelContent = t.buttons[actualKey];
                }
            }

            if (!labelContent) { 
                labelContent = options.specificNextExerciseAlternateLabel || (t.buttons?.newExerciseSameType || 'New Exercise');
            }
            
            specificNextBtn.innerHTML = `🔄 ${labelContent}`;
            specificNextBtn.title = labelContent;
            specificNextBtn.setAttribute('aria-label', labelContent);
            specificNextBtn.onclick = options.specificNextExerciseFn;
            bottomButtonContainer.appendChild(specificNextBtn);
        }

        // 4. Add button containers to the main exercise container
        if (topButtonContainer.hasChildNodes()) {
            container.prepend(topButtonContainer);
        }
        if (bottomButtonContainer.hasChildNodes()) {
            container.appendChild(bottomButtonContainer); 
        }
        
        if (typeof window.refreshLatinization === 'function') {
            window.refreshLatinization();
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
