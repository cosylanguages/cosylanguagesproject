// ALL VOCABULARY OPTIONS

async function practiceReading(type) {
    const language = document.getElementById('language').value;
    const days = getSelectedDays();
    const resultArea = document.getElementById('result');
    
    if (!language || !days.length) {
        alert('Please select language and day or a range of days first');
        return;
    }
    
    resultArea.style.display = 'block';
    const day = days[Math.floor(Math.random() * days.length)];
    const prompts = await loadSpeakingPrompts(language, day);
    
    if (!prompts.length) {
        resultArea.innerHTML = `<p>No prompts found for this day/language.</p>`;
        return;
    }
    
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    resultArea.innerHTML = `
        <div style="font-size:1.3rem; margin:20px 0;">${prompt}</div>
        <button id="start-record-btn" class="btn-secondary btn-emoji" title="Record your answer">🎤</button>
        <div id="speaking-feedback" style="margin-top:16px;"></div>
    `;
    
    setTimeout(() => {
        document.getElementById('start-record-btn').onclick = function() {
            startSpeakingCheck(prompt, language);
        };
    }, 0);
}

// Speaking practice function
        async function practiceSpeaking(type) {
            const language = document.getElementById('language').value;
            const days = getSelectedDays();
            const resultArea = document.getElementById('result');
            if (!language || !days.length) {
                alert('Please select language and day or a range of days first');
                return;
            }
            resultArea.style.display = 'block';
            const day = days[Math.floor(Math.random() * days.length)];

            switch (mode) {
                case 'daily':
                    await practiceSpeakingDaily(language, day);
                    break;
                case 'question':
                    await practiceSpeakingQuestion(language, day);
                    break;
                case 'dialogue':
                    await practiceSpeakingDialogue(language, day);
                    break;
                case 'role-play':
                    await practiceSpeakingRolePlay(language, day);
                    break;
                default:
                    await practiceSpeakingDaily(language, day);
                    break;
            }
            const prompts = await loadSpeakingPrompts(language, day);
            if (!prompts.length) {
                resultArea.innerHTML = `<p>No prompts found for this day/language.</p>`;
                return;
            }
            const prompt = prompts[Math.floor(Math.random() * prompts.length)];
            resultArea.innerHTML = `
                <div style="font-size:1.3rem; margin:20px 0;">${prompt}</div>
                <button id="start-record-btn" class="btn-secondary btn-emoji" title="Record your answer">🎤</button>
                <div id="speaking-feedback" style="margin-top:16px;"></div>
            `;
            setTimeout(() => {
                document.getElementById('start-record-btn').onclick = function() {
                    startSpeakingCheck(prompt, language);
                };
            }, 0);
        }