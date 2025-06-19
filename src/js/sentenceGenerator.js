// Helper function to load JSON data (similar to what's in grammar.js or utils.js)
// For now, assume a global loadData function or define a simple one.
// We might need to import it from utils.js if available and appropriate.
async function loadData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} for ${filePath}`);
            return { error: `HTTP error! status: ${response.status}`, data: null };
        }
        const data = await response.json();
        return { data };
    } catch (e) {
        console.error(`Error loading JSON from ${filePath}:`, e);
        return { error: e.message, data: null };
    }
}

// Configuration for noun/object sources
const NOUN_LIKE_VOCAB_DAYS_BY_LANG = {
    'COSYenglish': ['2', '3', '10'], // Based on our analysis (Boy, Girl, Mother, Father, Monday, etc.)
    // Add other languages here as needed
};

async function getVocabularyForDays(language, days) {
    const filePath = `data/vocabulary/words/${language.replace('COSY', '').toLowerCase()}.json`;
    const loadResult = await loadData(filePath);

    if (loadResult.error || !loadResult.data) {
        console.error(`Error loading vocabulary for ${language} from ${filePath}: ${loadResult.error || 'No data'}`);
        return [];
    }
    const vocabData = loadResult.data;
    let words = [];
    const daysToConsider = NOUN_LIKE_VOCAB_DAYS_BY_LANG[language] || Object.keys(vocabData); // Fallback to all days if lang not configured

    let relevantDays = [];
    if (Array.isArray(days)) { // Range of days
        const dayNumbers = days.map(d => parseInt(d, 10));
        const startDay = Math.min(...dayNumbers);
        const endDay = Math.max(...dayNumbers);
        for (let i = startDay; i <= endDay; i++) {
            relevantDays.push(String(i));
        }
    } else { // Single day string
        relevantDays.push(String(days));
    }

    const seenWords = new Set();
    relevantDays.forEach(dayKey => {
        if (daysToConsider.includes(dayKey) && vocabData[dayKey]) {
            vocabData[dayKey].forEach(word => {
                if (typeof word === 'string' && !seenWords.has(word)) {
                    words.push(word);
                    seenWords.add(word);
                }
                // If vocab items are objects, adapt this part e.g. word.word
            });
        }
    });
    // console.log(`[getVocabularyForDays] lang: ${language}, days: ${days}, found words: ${words.length}`);
    return words;
}

async function getVerbsForDays(language, days) {
    const filePath = `data/grammar/verbs/grammar_verbs_${language.replace('COSY', '').toLowerCase()}.json`;
    const loadResult = await loadData(filePath);

    if (loadResult.error || !loadResult.data) {
        console.error(`Error loading verb grammar for ${language} from ${filePath}: ${loadResult.error || 'No data'}`);
        return [];
    }
    const verbData = loadResult.data;
    let combinedVerbItems = [];
    const seenItems = new Set();

    let dayKeysToLoad = [];
    if (Array.isArray(days)) {
        const dayNumbers = days.map(d => parseInt(d, 10)).sort((a,b) => a-b);
        if (dayNumbers.length > 0) {
            const startDay = dayNumbers[0];
            const endDay = dayNumbers[dayNumbers.length - 1];
            for (let i = startDay; i <= endDay; i++) {
                dayKeysToLoad.push(String(i));
            }
        }
    } else { // Single day string
         // As per issue: "If people decide to select a range of days "from" and "to",
         // then you need to combine the elements of vocabulary and grammar of selected days together"
         // "Based on the day combine elements" - implies if single day, then just that day.
         // However, current loadVerbGrammar in grammar.js loads from 1 up to the selected day.
         // For consistency with user expectation from issue for single day, let's load only that day.
         // For range, it's start to end.
         // The `loadVerbGrammar` in `grammar.js` has a different logic for single day (1 to N).
         // We will make this function load only the specified day(s).
        dayKeysToLoad.push(String(days));
    }

    dayKeysToLoad.forEach(dayKey => {
        if (verbData[dayKey]) {
            verbData[dayKey].forEach(item => {
                const stringifiedItem = JSON.stringify(item);
                if (!seenItems.has(stringifiedItem)) {
                    combinedVerbItems.push(item);
                    seenItems.add(stringifiedItem);
                }
            });
        }
    });
    // console.log(`[getVerbsForDays] lang: ${language}, days: ${days}, found verbs: ${combinedVerbItems.length}`);
    return combinedVerbItems;
}

// Helper to get a random element from an array
function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to map nouns to pronouns for verb agreement (simple version)
function getNounPronounEquivalent(noun) {
    if (!noun) return 'it'; // Default
    // This is a very simplified mapping. A more robust solution would be complex.
    // For now, we'll assume nouns like "Boy", "Man", "Father" are 'he',
    // "Girl", "Woman", "Mother" are 'she'.
    // And plural nouns (if we had them) would be 'they'.
    // Defaulting to 'he' for simplicity if no clear gender.
    // This needs to be improved significantly for real-world use.
    const nounLower = noun.toLowerCase();
    if (['girl', 'woman', 'mother', 'sister', 'daughter', 'wife'].includes(nounLower)) return 'she';
    if (['boy', 'man', 'father', 'brother', 'son', 'husband', 'teacher', 'student'].includes(nounLower)) return 'he'; // Teacher/student can be he/she
    return 'it'; // Default for other nouns like days of the week, etc.
}


async function generateStatement(language, days, structureType) {
    if (language !== 'COSYenglish') {
        console.warn(`generateStatement currently only supports COSYenglish. Requested: ${language}`);
        return null; // Or throw error
    }

    const vocabulary = await getVocabularyForDays(language, days);
    const verbItems = await getVerbsForDays(language, days);

    if (vocabulary.length < 1) {
        console.warn(`[generateStatement] Not enough vocabulary for lang=${language}, days=${days}. Need at least 1 for object.`);
        return null;
    }
    if (verbItems.length === 0) {
        console.warn(`[generateStatement] No verb items found for lang=${language}, days=${days}.`);
        return null;
    }

    let subject, subjectForAgreement;
    let potentialPronouns = [];
    verbItems.forEach(v => {
        if (v.prompt && typeof v.prompt === 'string' && v.prompt.match(/^(I|you|he|she|it|we|they)$/i)) {
            potentialPronouns.push(v.prompt.toLowerCase());
        }
    });
    potentialPronouns = [...new Set(potentialPronouns)]; // Unique

    if (potentialPronouns.length === 0 && vocabulary.length <1) {
        console.warn(`[generateStatement] No pronouns from verbs and no nouns from vocab.`);
        return null;
    }

    // Decide subject type: pronoun or noun
    const usePronounSubject = Math.random() < 0.7 || vocabulary.length < 1; // Favor pronouns, or if no nouns

    let availableNouns = [...vocabulary];

    if (usePronounSubject && potentialPronouns.length > 0) {
        subject = getRandomElement(potentialPronouns);
        subjectForAgreement = subject;
    } else if (availableNouns.length > 0) {
        subject = getRandomElement(availableNouns);
        subjectForAgreement = getNounPronounEquivalent(subject);
        // Remove selected subject from available nouns for object selection
        availableNouns = availableNouns.filter(n => n !== subject);
    } else {
         console.warn(`[generateStatement] Could not determine a subject.`);
        return null; // Cannot form subject
    }

    if (!subject) {
        console.warn(`[generateStatement] Subject selection failed.`);
        return null;
    }

    // Object Selection (ensure one is available if subject took one)
    if (availableNouns.length < 1) {
        console.warn(`[generateStatement] Not enough vocabulary for object after selecting subject "${subject}".`);
        // If subject was a noun, try to put it back and pick a pronoun subject if possible
        if (!usePronounSubject && potentialPronouns.length > 0) {
            subject = getRandomElement(potentialPronouns);
            subjectForAgreement = subject;
            availableNouns = [...vocabulary]; // Reset available nouns
        } else {
            return null;
        }
    }
     const object = getRandomElement(availableNouns) || "something"; // Fallback if somehow still empty

    // Verb Selection
    let suitableVerbItem = null;
    let conjugatedVerb = '';
    let verbInfinitive = '';

    const possibleVerbs = verbItems.filter(v => {
        // Check if verb prompt matches subjectForAgreement or if it's a general verb entry
        return v.prompt && v.prompt.toLowerCase() === subjectForAgreement && v.answer;
    });

    if (possibleVerbs.length > 0) {
        suitableVerbItem = getRandomElement(possibleVerbs);
        conjugatedVerb = suitableVerbItem.answer;
        verbInfinitive = suitableVerbItem.infinitive || ( (suitableVerbItem.answer === 'am' || suitableVerbItem.answer === 'is' || suitableVerbItem.answer === 'are') ? 'be' : (suitableVerbItem.answer === 'have' || suitableVerbItem.answer === 'has') ? 'have' : suitableVerbItem.answer ); // Infer basic infinitive
    } else {
        console.warn(`[generateStatement] No suitable verb found for subject "${subject}" (agreement form "${subjectForAgreement}")`);
        return null;
    }

    if (!suitableVerbItem) {
        console.warn(`[generateStatement] Verb selection failed for subject "${subject}".`);
        return null;
    }

    // Sentence Assembly
    let sentence = "";
    let parts = [];
    const subjectDisplay = subject.charAt(0).toUpperCase() + subject.slice(1); // Capitalize first letter of subject

    switch (structureType) {
        case 'SVO':
            sentence = `${subjectDisplay} ${conjugatedVerb} ${object}.`;
            parts = [subjectDisplay, conjugatedVerb, object];
            break;
        case 'SVO_negative_verb': // e.g., He is not a teacher.
            if (verbInfinitive === 'be' || verbInfinitive === 'have') { // Simple negation for be/have
                sentence = `${subjectDisplay} ${conjugatedVerb} not ${object}.`;
                parts = [subjectDisplay, conjugatedVerb, 'not', object];
            } else { // Fallback for other verbs if no aux logic yet, or re-route
                console.warn(`[generateStatement] SVO_negative_verb requested for non be/have verb, but full aux logic not yet primary. Verb: ${verbInfinitive}`);
                // Defaulting to SVO or could try SVO_negative_aux if infinitive is solid
                 structureType = 'SVO_negative_aux'; // Attempt aux negation
            }
            // Fall-through to SVO_negative_aux if not handled or re-routed
            if (structureType !== 'SVO_negative_aux') break;

        case 'SVO_negative_aux': // e.g., He doesn't like apples.
            {
                if (!suitableVerbItem.infinitive && verbInfinitive !== 'be' && verbInfinitive !== 'have') { // 'be'/'have' handled by SVO_negative_verb
                     console.warn(`[generateStatement] SVO_negative_aux requires an infinitive for verb "${suitableVerbItem.answer}", but not found. Falling back.`);
                     // Fallback: try SVO if negation isn't possible
                    sentence = `${subjectDisplay} ${conjugatedVerb} ${object}.`;
                    parts = [subjectDisplay, conjugatedVerb, object];
                    break;
                }
                const actualInfinitive = suitableVerbItem.infinitive || verbInfinitive; // Prefer explicit if available
                let aux = '';
                if (subjectForAgreement === 'he' || subjectForAgreement === 'she' || subjectForAgreement === 'it') {
                    aux = "doesn't";
                } else {
                    aux = "don't";
                }
                sentence = `${subjectDisplay} ${aux} ${actualInfinitive} ${object}.`;
                parts = [subjectDisplay, aux, actualInfinitive, object];
            }
            break;
        case 'SVO_question_verb': // e.g., Is he a teacher?
             if (verbInfinitive === 'be' || verbInfinitive === 'have') {
                const conjugatedVerbDisplay = conjugatedVerb.charAt(0).toUpperCase() + conjugatedVerb.slice(1);
                sentence = `${conjugatedVerbDisplay} ${subject} ${object}?`;
                parts = [conjugatedVerbDisplay, subject, object];
            } else {
                console.warn(`[generateStatement] SVO_question_verb requested for non be/have verb. Verb: ${verbInfinitive}`);
                structureType = 'SVO_question_aux'; // Attempt aux question
            }
            // Fall-through to SVO_question_aux if not handled or re-routed
            if (structureType !== 'SVO_question_aux') break;

        case 'SVO_question_aux': // e.g., Does he like apples?
             {
                if (!suitableVerbItem.infinitive && verbInfinitive !== 'be' && verbInfinitive !== 'have') {
                    console.warn(`[generateStatement] SVO_question_aux requires an infinitive for verb "${suitableVerbItem.answer}", but not found. Falling back.`);
                    sentence = `${subjectDisplay} ${conjugatedVerb} ${object}.`; // Fallback to SVO
                    parts = [subjectDisplay, conjugatedVerb, object];
                    break;
                }
                const actualInfinitive = suitableVerbItem.infinitive || verbInfinitive;
                let aux = '';
                if (subjectForAgreement === 'he' || subjectForAgreement === 'she' || subjectForAgreement === 'it') {
                    aux = "Does";
                } else {
                    aux = "Do";
                }
                sentence = `${aux} ${subject} ${actualInfinitive} ${object}?`;
                parts = [aux, subject, actualInfinitive, object];
            }
            break;
        default:
            console.warn(`[generateStatement] Unknown structureType: ${structureType}. Defaulting to SVO.`);
            sentence = `${subjectDisplay} ${conjugatedVerb} ${object}.`;
            parts = [subjectDisplay, conjugatedVerb, object];
            break;
    }

    return {
        sentence: sentence,
        subject: subjectDisplay,
        verb: conjugatedVerb, // This is the conjugated verb
        object: object,
        verbInfinitive: verbInfinitive, // This is the best guess/data for infinitive
        conjugatedVerb: conjugatedVerb,
        parts: parts
    };
}

// Main function to be implemented next
// function generateStatement(language, days, structureType) { ... } // This comment is now outdated
// The main function generateStatement is now implemented above.

// Export functions if using modules, or attach to a global object for script tag inclusion
// For now, assuming functions will be globally accessible or imported where needed.
// Example (if using modules, which might require build process changes):
// export { getVocabularyForDays, getVerbsForDays, generateStatement };
