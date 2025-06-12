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
    btn.className = 'btn-randomize';
    const language = document.getElementById('language')?.value || 'COSYenglish'; // Assume translations is global
    const currentTranslations = translations[language] || translations.COSYenglish;

    btn.setAttribute('aria-label', currentTranslations.aria?.randomize || 'Randomize exercise');
    btn.title = currentTranslations.aria?.randomize || 'Randomize exercise';
    btn.innerHTML = currentTranslations.buttons?.randomize || '🎲';
    btn.style.marginLeft = '10px';
    btn.style.float = 'right';
    btn.style.fontSize = '1.5rem';
    btn.style.background = 'linear-gradient(90deg,#ffe082,#1de9b6)';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.width = '44px';
    btn.style.height = '44px';
    btn.style.boxShadow = '0 2px 8px #ccc';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'transform 0.2s';
    btn.onmouseover = () => btn.style.transform = 'scale(1.15)';
    btn.onmouseout = () => btn.style.transform = '';
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
    };
}
