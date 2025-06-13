# Manual Testing: Randomize Button in Gender Practice

**Objective:** To ensure the "🎲" (randomize) button now appears in the gender practice exercise, is styled correctly, and functions as expected by loading a new gender item.

**Prerequisites:**
1.  A modern web browser with developer tools (e.g., Chrome, Firefox, Edge).
2.  The application code (with the randomize button added to gender practice) loaded in the browser.
3.  Familiarity with the application's UI for selecting languages, days, and navigating to grammar exercises.

---

**Test Steps:**

**1. Navigate to Gender Practice:**
    *   Open the application (`index.html`) in your web browser.
    *   Select a language from the "🌎 Choose Your Language" dropdown (e.g., "COSYfrançais", "COSYdeutsch").
    *   Select a day from the "📅 Choose Your Day" dropdown (e.g., "Day 1", or any day for which gender exercises are available – typically Day 1 onwards).
    *   Click on the "🧩 Grammar" main practice type button. This will reveal grammar sub-options.
    *   Click on the "✨ Gender" (or the translated equivalent for "Gender") sub-option button.
    *   The gender practice exercise should now load in the main content area (usually `div#result`).

**2. Verify Button Appearance and Styling:**
    *   **Observation:** Look at the top area of the loaded gender practice exercise (within the `div.gender-practice-container`).
    *   **Expected:** A "🎲" button (or the translated randomize symbol, if applicable) should be clearly visible, typically positioned at the top-right or top-center of the exercise container.
    *   **Styling Check:**
        *   To compare, first navigate to a vocabulary exercise that has a randomize button:
            *   Go back to the main menu (if necessary, refresh or re-navigate).
            *   Select the same language and day.
            *   Click "🔠 Vocabulary", then "🔤 Random Word". Observe the "🎲" button there.
            *   Now, navigate back to the Gender Practice exercise as in Step 1.
        *   Visually compare the "🎲" button in the Gender Practice with the one from Vocabulary.
        *   **Expected:** The buttons should have a very similar (if not identical) size, shape, color, icon, and general visual style.
        *   **(Optional) Inspect Element:** Right-click on the "🎲" button in the Gender Practice exercise and select "Inspect" or "Inspect Element" from the context menu.
            *   Examine the HTML element in the developer tools.
            *   **Expected:** The button element should ideally have classes like `btn-randomize` and `randomizer-button` (or similar consistent classes used for randomize buttons across the application).

**3. Verify Button Functionality:**
    *   **Initial Item:** When the gender practice first loads, note some detail of the displayed item (e.g., the word whose gender is being tested, like "maison" in French).
    *   **Click Randomize:** Click the "🎲" button located within the gender practice section.
    *   **Observation:** Observe the content of the gender practice exercise area.
    *   **Expected:**
        *   The gender practice exercise should refresh or update its content.
        *   A *new* gender item should be displayed. This new item should be different from the initial one you noted (assuming there is more than one gender item available for the selected language and day combination).
        *   The "🎲" button itself should still be present and visible with the new item.
    *   **Repeat Clicks:** Click the "🎲" button several more times (e.g., 3-5 times).
    *   **Expected:** Each click should result in a new gender item being loaded. The button should remain functional and visible throughout this process.

**4. Verify No Duplicate Buttons:**
    *   While repeatedly clicking the randomize button (as in step 3.c), carefully observe the area where the button appears.
    *   Alternatively, after a few clicks, right-click near the button and "Inspect Element". Examine the DOM structure of the `div.gender-practice-container`.
    *   **Expected:** There should only be **one** instance of the "🎲" (randomize) button present within the `gender-practice-container` at any given time. New buttons should not be appended on each click; the same button should persist or the area should be re-rendered with a single button.

**5. Test with Different Languages/Days (Optional but Recommended):**
    *   If time permits, repeat steps 1-4 using a different language and/or a different day. This helps ensure the functionality is robust and not specific to one content set.
    *   For example, if you first tested with "COSYfrançais" Day 1, try "COSYdeutsch" Day 3 (or any other combination known to have gender exercises).

---

**Reporting Template for Test Results:**

*   **Test Case:** Gender Practice - Randomize Button Verification
*   **Browser(s) Tested:** (e.g., Chrome vXX, Firefox vXX)
*   **Date of Test:**
*   **Tester:**
*   **Overall Result:** (Pass/Fail)

| Step                                       | Expected Result                                                                                                | Actual Result | Pass/Fail | Notes (e.g., specific words observed, any discrepancies) |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------ | :-------- | :------------------------------------------------------- |
| 1. Navigate to Gender Practice             | Gender exercise loads successfully in the result area.                                                         |               |           | Language/Day used:                                       |
| 2a. Verify Button Appearance               | "🎲" button is visible at the top of the gender exercise container.                                             |               |           |                                                          |
| 2b. Verify Button Styling                  | Button style is consistent with other randomize buttons (e.g., in vocabulary). Similar size, shape, icon.        |               |           |                                                          |
| 2c. (Optional) Inspect Element             | Button has expected classes (e.g., `btn-randomize`, `randomizer-button`).                                      |               |           | Classes found:                                           |
| 3a. Verify Functionality (First Click)     | New gender item loads. Button remains visible.                                                                 |               |           | Word changed from '...' to '...'?                        |
| 3b. Verify Functionality (Repeated Clicks) | Each click loads a new gender item. Button remains visible and functional.                                     |               |           |                                                          |
| 4. Verify No Duplicate Buttons             | Only one "🎲" button is present within the `gender-practice-container` at all times, even after multiple clicks. |               |           |                                                          |
| 5. Test with Other Language/Day (Optional) | Consistent behavior observed.                                                                                  |               |           | Language/Day used: Result:                             |

**Summary of Issues/Observations:**
*   (List any general problems, unexpected behaviors, styling inconsistencies not caught above, or suggestions for improvement based on the testing.)
