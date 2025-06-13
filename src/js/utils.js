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

// Helper: Add randomize button to exercise containers
function addRandomizeButton(containerIdOrElement, randomizeFn) { // Modified to accept element directly
    let container = containerIdOrElement;
    if (typeof containerIdOrElement === 'string') {
        container = document.getElementById(containerIdOrElement) || document.querySelector(`.${containerIdOrElement}`);
    }

    if (!container) {
        // console.warn(`Container not found for randomize button: ${containerIdOrElement}`);
        return;
    }
    // Remove any existing randomize button to avoid duplicates
    const existingBtn = container.querySelector('.btn-randomize');
    if (existingBtn) existingBtn.remove();

    let btn = document.createElement('button');
    btn.className = 'btn-randomize randomizer-button'; // Apply new and old class
    const language = document.getElementById('language')?.value || 'COSYenglish'; // Assume translations is global
    const currentTranslations = translations[language] || translations.COSYenglish;

    btn.setAttribute('aria-label', currentTranslations.aria?.randomize || 'Randomize exercise');
    btn.title = currentTranslations.aria?.randomize || 'Randomize exercise';
    btn.innerHTML = currentTranslations.buttons?.randomize || '🎲';
    // Inline styles and mouse event handlers removed
    btn.onclick = randomizeFn; // Assign the passed randomizeFn directly

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

function patchExerciseForRandomizeButton(originalExerciseFn, containerSelectorOrElement, randomizeFn) {
    return async function() {
        // Call the original exercise function, ensuring 'this' and 'arguments' are passed correctly
        await originalExerciseFn.apply(this, arguments);

        // Now, add the randomize button.
        // addRandomizeButton can take an ID string, a class selector string (e.g. ".my-class"), or an element.
        // The existing addRandomizeButton logic handles ID or class selector (if class is passed as ".class-name" or just "class-name").
        addRandomizeButton(containerSelectorOrElement, randomizeFn);
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

/**
 * Retrieves the selected days from the checkboxes.
 * @returns {string[]} An array of selected days.
 */
function getSelectedDays() {
  const days = [];
  document.querySelectorAll('.day-checkbox:checked').forEach(checkbox => {
    days.push(checkbox.value);
  });
  return days;
}

/**
 * Removes accents from a string.
 * @param {string} str The input string.
 * @returns {string} The string without accents.
 */
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// --- Stubs for speech functions to prevent errors if called before speech-features.js loads ---
if (typeof window.pronounceWord !== 'function') {
    window.pronounceWord = function(word, language) {
        console.warn("pronounceWord called before speech-features.js loaded or fully initialized. Word:", word, "Lang:", language);
        // Optionally, alert the user or provide minimal feedback via UI
        // alert("Pronunciation feature is still loading. Please try again shortly.");
    };
}

if (typeof window.startPronunciationCheck !== 'function') {
    window.startPronunciationCheck = function(targetWord, language, transcriptDivId, feedbackDivId, onStartCallback, onResultCallback, onErrorCallback, onEndCallback) {
        console.warn("startPronunciationCheck called before speech-features.js loaded or fully initialized. Target:", targetWord);
        const feedbackEl = document.getElementById(feedbackDivId);
        if (feedbackEl) {
            // Assuming 'translations' is globally available or use a generic message
            const lang = document.getElementById('language')?.value || 'COSYenglish';
            const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : { featureLoading: "Speech features are loading. Please try again shortly." };
            feedbackEl.textContent = t.featureLoading;
        }
        // Call error or end callback if provided, to prevent UI hangs in calling code
        if (typeof onErrorCallback === 'function') {
            onErrorCallback({ error: "not-loaded", message: "Speech recognition service not yet available." });
        } else if (typeof onEndCallback === 'function') {
            // If only onEnd is provided, call it to signal completion.
            onEndCallback();
        }
    };
}

// Ensure the global 'recognition' object used by speech features is at least null if not defined
if (typeof window.recognition === 'undefined') {
    window.recognition = null;
}
[end of src/js/utils.js]
