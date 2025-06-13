// JavaScript Snippet to List System Voices and Check for Specific Languages

function checkSystemVoices() {
    const targetLanguages = [
        { name: 'Armenian', code: 'hy' },
        { name: 'Breton', code: 'br' },
        { name: 'Tatar', code: 'tt' },
        { name: 'Bashkir', code: 'ba' }
    ];

    let availableVoices = [];
    let foundTargetLanguages = [];

    // Function to perform the check
    function findVoices() {
        availableVoices = speechSynthesis.getVoices();
        if (availableVoices.length === 0) {
            console.log("Voice list is empty. Speech synthesis might not be supported or voices not yet loaded.");
            // Some browsers require user interaction to load voices, or speech synthesis might be disabled.
            if (speechSynthesis.onvoiceschanged === undefined) {
                console.warn("speechSynthesis.onvoiceschanged is not supported. Voice list might be incomplete.");
            }
            return;
        }

        console.log("Available system voices:");
        availableVoices.forEach(voice => {
            console.log(`- Name: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default}, URI: ${voice.voiceURI}`);
            targetLanguages.forEach(target => {
                if (voice.lang.startsWith(target.code)) {
                    if (!foundTargetLanguages.some(found => found.code === target.code)) {
                        foundTargetLanguages.push(target);
                        console.log(`  Found voice for ${target.name}: ${voice.name} (${voice.lang})`);
                    }
                }
            });
        });

        console.log("\n--- Summary ---");
        if (availableVoices.length > 0) {
            console.log(`Total voices found: ${availableVoices.length}`);
        }

        targetLanguages.forEach(target => {
            if (foundTargetLanguages.some(found => found.code === target.code)) {
                console.log(`✅ Voice for ${target.name} (${target.code}) was FOUND.`);
            } else {
                console.log(`❌ Voice for ${target.name} (${target.code}) was NOT FOUND.`);
            }
        });

        if (foundTargetLanguages.length === targetLanguages.length) {
            console.log("All target language voices were found!");
        } else if (foundTargetLanguages.length > 0) {
            console.log("Some, but not all, target language voices were found.");
        } else {
            console.log("None of the target language voices were found.");
        }
    }

    // Check if voices are already loaded
    if (speechSynthesis.getVoices().length > 0) {
        findVoices();
    } else {
        // If not, wait for the voiceschanged event
        speechSynthesis.onvoiceschanged = findVoices;
        // As a fallback, if onvoiceschanged is not fired or supported in some contexts,
        // try to call findVoices after a small delay.
        // This is particularly for browsers that might not fire onvoiceschanged reliably without prior interaction.
        setTimeout(() => {
            if (availableVoices.length === 0) { // Check if findVoices hasn't run or found voices
                 console.log("Retrying to get voices after a delay (fallback)...");
                 findVoices();
            }
        }, 1000);
    }
}

// To run this, open your browser's developer console and paste this code,
// then call checkSystemVoices();
// For example: checkSystemVoices();
//
// Note: Voice availability is system-dependent. The output will vary.
// Some browsers/OS might require specific voice packs to be installed.
console.log("To check for voices, call the function: checkSystemVoices()");
