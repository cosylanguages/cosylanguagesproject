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
    const langKey = language.replace('COSY', '').toLowerCase();
    const filePath = `data/speaking/question/question_${langKey}.json`;

    const result = await loadData(filePath);

    if (result.error) {
        // Error already logged by loadData, but we can add context
        console.error(`Error encountered in loadSpeakingQuestions for ${language}, day ${day} from ${filePath}: ${result.errorType} - ${result.error}`);
        return [];
    }

    const data = result.data;
    // Ensure data is not null and day exists
    if (data && data[day]) {
        return data[day];
    } else {
        // console.warn(`No speaking questions found for ${language}, day ${day}`);
        return [];
    };
}
