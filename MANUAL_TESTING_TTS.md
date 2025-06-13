# Manual Testing Steps for Text-to-Speech (TTS) Pronunciation

**Objective:** Test if the existing `pronounceWord` function in `index.html` correctly utilizes available system voices for Armenian, Breton, Tatar, and Bashkir, and handles missing voices gracefully.

**Prerequisites:**
1.  A modern web browser with developer tools (e.g., Chrome, Firefox, Edge).
2.  The application code (presumably `index.html` and associated JavaScript files) loaded in the browser.
3.  Familiarity with opening the browser's developer console (usually by pressing F12).

---

**Part 1: Check Available System Voices**

This part helps determine which of the target languages have speech synthesis voices installed on the system you are testing with.

1.  **Open the Application:** Load `index.html` (or the main application page) in your web browser.
2.  **Open Developer Console:** Open the browser's developer console.
3.  **Execute Voice Listing Script:** Copy and paste the following JavaScript snippet into the console, then press Enter.

    ```javascript
    function checkSystemVoices() {
        console.log("Attempting to load and list system voices...");

        function listVoices() {
            console.log("Available voices loaded or voiceschanged event triggered.");
            const voices = speechSynthesis.getVoices();
            if (!voices.length) {
                console.log("No voices available on this system/browser.");
                alert("Speech Synthesis API returned no voices. TTS functionality will likely not work.");
                return;
            }

            const targetLangCodes = [
                { code: 'hy', name: 'Armenian' },
                { code: 'br', name: 'Breton' },
                { code: 'tt', name: 'Tatar' },
                { code: 'ba', name: 'Bashkir' }
            ];
            let foundVoicesFor = {};

            console.log("--- All Available Voices (" + voices.length + " total) ---");
            voices.forEach(voice => {
                console.log(`Name: "${voice.name}", Lang: ${voice.lang}, Default: ${voice.default ? 'Yes' : 'No'}`);
                targetLangCodes.forEach(target => {
                    if (voice.lang.startsWith(target.code)) {
                        if (!foundVoicesFor[target.code]) foundVoicesFor[target.code] = [];
                        foundVoicesFor[target.code].push(`"${voice.name}" (lang: ${voice.lang})`);
                    }
                });
            });

            console.log("\n--- Target Language Voice Check ---");
            targetLangCodes.forEach(target => {
                if (foundVoicesFor[target.code] && foundVoicesFor[target.code].length > 0) {
                    console.log(`✅ Found voice(s) for ${target.name} (${target.code}): ${foundVoicesFor[target.code].join(', ')}`);
                } else {
                    console.log(`❌ No specific voice for ${target.name} (${target.code}) found. Fallback voice might be used if language code alone is sufficient for the browser, or no voice if not.`);
                }
            });
            console.log("--- End of Voice Check ---");
        }

        // Ensure voices are loaded.
        // The onvoiceschanged event is the most reliable way to get voices.
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = listVoices;
        }

        // Trigger voice loading attempt, as some browsers require an action or delay.
        // Speaking a blank utterance and cancelling it can sometimes populate the list.
        const voicesCurrently = speechSynthesis.getVoices();
        if (voicesCurrently.length === 0) {
            console.log("Voice list initially empty, trying to trigger loading...");
            const dummyUtterance = new SpeechSynthesisUtterance(' ');
            dummyUtterance.volume = 0; // Make it silent
            speechSynthesis.speak(dummyUtterance);
            speechSynthesis.cancel(); // Clear the dummy utterance immediately

            // If onvoiceschanged is not supported or doesn't fire, try a timeout.
            // This is a fallback.
            if (speechSynthesis.onvoiceschanged === undefined) {
                 setTimeout(listVoices, 1000); // Allow 1 second for voices to load
            } else {
                 // if onvoiceschanged is defined, it should handle it.
                 // However, if it already fired before assignment, call listVoices directly.
                 if(speechSynthesis.getVoices().length > 0) {
                    listVoices();
                 }
            }
        } else {
            // Voices are already available
            console.log("Voices were already loaded.");
            listVoices();
        }
    }

    // Call the function to start the check
    checkSystemVoices();
    ```

4.  **Observe Console Output:**
    *   Look for lines starting with "✅ Found voice(s) for..." or "❌ No specific voice for...".
    *   **Record:** Note down which of the target languages (Armenian, Breton, Tatar, Bashkir) have voices available on your system. This information is crucial for Part 2.

---

**Part 2: Test `pronounceWord` Functionality**

For each of the target languages (Armenian, Breton, Tatar, and Bashkir), perform the following steps.

1.  **Navigate to Application:** Ensure the application is loaded in your browser.
2.  **Select Language in UI:** Use the application's language dropdown menu to select the language you are about to test.
    *   Armenian: Select "ԾՈՍՅհայկական"
    *   Breton: Select "COSYbrezhoneg"
    *   Tatar: Select "COSYtatarça"
    *   Bashkir: Select "COSYbashkort"
3.  **Open Developer Console:** If not already open, open it now.
4.  **Execute `pronounceWord`:** Manually call the `pronounceWord` function from the console with a sample word/phrase for the selected language.

    *   **For Armenian (language value: 'ԾՈՍՅհայկական'):**
        ```javascript
        pronounceWord('բարեւ', 'ԾՈՍՅհայկական');
        ```
        (Sample word: բարեւ / barev - meaning "hello")

    *   **For Breton (language value: 'COSYbrezhoneg'):**
        ```javascript
        pronounceWord('debr Mat', 'COSYbrezhoneg');
        ```
        (Sample phrase: debr Mat - meaning "enjoy your meal")

    *   **For Tatar (language value: 'COSYtatarça'):**
        ```javascript
        pronounceWord('исәнмесез', 'COSYtatarça');
        ```
        (Sample word: исәнмесез / isänmesez - meaning "hello")

    *   **For Bashkir (language value: 'COSYbashkort'):**
        ```javascript
        pronounceWord('һаумыһығыҙ', 'COSYbashkort');
        ```
        (Sample word: һаумыһығыҙ / hawmıhıgız - meaning "hello")

5.  **Observe and Record for EACH language tested:**

    *   **Audio Playback:**
        *   Did any sound play? (Yes/No)
        *   If yes, and if you are familiar with the language (or can compare with an external pronunciation source), did it sound like the correct language? (Yes/No/Unsure)

    *   **Console Output:**
        *   Were there any errors logged in the console related to speech synthesis (e.g., "SpeechSynthesisError", "No voice found for language...")? Record any errors.

    *   **Alert for Missing Voices:**
        *   Refer to your notes from Part 1. If a specific voice for this language was **NOT** found on your system, did the expected `alert` message appear in the browser (e.g., "No Armenian voice found on your system. Your browser might use a default voice if available.")? (Yes/No/Not Applicable if voice was found)
        *   If a voice **was** found in Part 1, this alert should **not** appear. Did it behave as expected? (Yes/No)

    *   **Voice Usage (Subjective):**
        *   If a voice was available (from Part 1), and audio played, does it seem like the specific voice was used? (This can be hard to determine without knowing the exact voice names the browser picks, but if it sounds distinct and reasonably correct for the language, it's a positive sign).

---

**Expected Outcomes/Reporting Template:**

Fill this out based on your testing:

**Part 1: Available System Voices**
*   Armenian (hy): Voice(s) Found (List names if possible) / No Voice Found
*   Breton (br): Voice(s) Found (List names if possible) / No Voice Found
*   Tatar (tt): Voice(s) Found (List names if possible) / No Voice Found
*   Bashkir (ba): Voice(s) Found (List names if possible) / No Voice Found

**Part 2: `pronounceWord` Functionality Test**

*   **Armenian ('ԾՈՍՅհայկական'):**
    *   Audio Played:
    *   Sounded Correct:
    *   Console Errors:
    *   Missing Voice Alert Appeared (if applicable):
    *   Notes:

*   **Breton ('COSYbrezhoneg'):**
    *   Audio Played:
    *   Sounded Correct:
    *   Console Errors:
    *   Missing Voice Alert Appeared (if applicable):
    *   Notes:

*   **Tatar ('COSYtatarça'):**
    *   Audio Played:
    *   Sounded Correct:
    *   Console Errors:
    *   Missing Voice Alert Appeared (if applicable):
    *   Notes:

*   **Bashkir ('COSYbashkort'):**
    *   Audio Played:
    *   Sounded Correct:
    *   Console Errors:
    *   Missing Voice Alert Appeared (if applicable):
    *   Notes:

**Summary of Issues/Observations:**
*   (List any general problems, unexpected behaviors, or suggestions for improvement based on the testing.)

This structured approach will help in thoroughly testing the TTS functionality for the new languages.
