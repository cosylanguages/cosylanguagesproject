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
function addRandomizeButton(containerId, randomizeFn) {
    const container = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
    if (!container) return;
    // Remove any existing randomize button to avoid duplicates
    const existingBtn = container.querySelector('.btn-randomize');
    if (existingBtn) existingBtn.remove();
    let btn = document.createElement('button');
    btn.className = 'btn-randomize';
    const language = document.getElementById('language')?.value || 'COSYenglish';
    btn.setAttribute('aria-label', (translations[language]?.buttons?.randomize || 'Randomize exercise'));
    btn.title = translations[language]?.buttons?.randomize || 'Randomize exercise';
    btn.innerHTML = translations[language]?.buttons?.randomize || '🎲';
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
            const data = await response.json();
            return data;
        } else {
            console.error(`Error loading data from ${filePath}: ${response.status}`);
            return []; // Return empty array on HTTP error
        }
    } catch (error) {
        console.error(`Exception while loading data from ${filePath}:`, error);
        return []; // Return empty array on network error or JSON parsing error
    }
}
