function latinizeRussian(text) {
  const russianToLatinMap = {
    'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v',
    'Г': 'G', 'г': 'g', 'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e',
    'Ё': 'YO', 'ё': 'yo', 'Ж': 'ZH', 'ж': 'zh', 'З': 'Z', 'з': 'z',
    'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n',
    'О': 'O', 'о': 'o', 'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's', 'Т': 'T', 'т': 't', 'У': 'U', 'у': 'u',
    'Ф': 'F', 'ф': 'f', 'Х': 'KH', 'х': 'kh', 'Ц': 'TS', 'ц': 'ts',
    'Ч': 'CH', 'ч': 'ch', 'Ш': 'SH', 'ш': 'sh', 'Щ': 'SHCH', 'щ': 'shch',
    'Ъ': '', 'ъ': '',
    'Ы': 'Y', 'ы': 'y',
    'Ь': '', 'ь': '',
    'Э': 'E', 'э': 'e', 'Ю': 'YU', 'ю': 'yu', 'Я': 'YA', 'я': 'ya'
  };
  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (russianToLatinMap.hasOwnProperty(char)) {
      latinizedText += russianToLatinMap[char];
    } else {
      latinizedText += char;
    }
  }
  return latinizedText;
}

// Expose getLatinization to the global scope for use in other scripts.
// Assuming this is running in a browser environment.
if (typeof window !== 'undefined') {
  window.getLatinization = getLatinization;
  console.log('[TransliterationJS] typeof window.getLatinization after assignment:', typeof window.getLatinization);
}

function latinizeArmenian(text) {
  const simplerArmenianMap = {
    'Ա': 'A', 'Բ': 'B', 'Գ': 'G', 'Դ': 'D', 'Ե': 'YE', 'Զ': 'Z', 'Է': 'E', 'Ը': 'E',
    'Թ': 'T\'', 'Ժ': 'ZH', 'Ի': 'I', 'Լ': 'L', 'Խ': 'KH', 'Ծ': 'TS', 'Կ': 'K', 'Հ': 'H',
    'Ձ': 'DZ', 'Ղ': 'GH', 'Ճ': 'CH', 'Մ': 'M', 'Յ': 'Y', 'Ն': 'N', 'Շ': 'SH', 'Ո': 'VO',
    'Չ': 'CH\'', 'Պ': 'P', 'Ջ': 'J', 'Ռ': 'R', 'Ս': 'S', 'Վ': 'V', 'Տ': 'T', 'Ր': 'R',
    'Ց': 'TS\'', 'Ւ': 'V', 'Փ': 'P\'', 'Ք': 'K\'', 'Օ': 'O', 'Ֆ': 'F',
    'ա': 'a', 'բ': 'b', 'գ': 'g', 'դ': 'd', 'ե': 'ye', 'զ': 'z', 'է': 'e', 'ը': 'e',
    'թ': 't\'', 'ժ': 'zh', 'ի': 'i', 'լ': 'l', 'խ': 'kh', 'ծ': 'ts', 'կ': 'k', 'հ': 'h',
    'ձ': 'dz', 'ղ': 'gh', 'ճ': 'ch', 'մ': 'm', 'յ': 'y', 'ն': 'n', 'շ': 'sh', 'ո': 'vo',
    'չ': 'ch\'', 'պ': 'p', 'ջ': 'j', 'ռ': 'r', 'ս': 's', 'վ': 'v', 'տ': 't', 'ր': 'r',
    'ց': 'ts\'', 'ւ': 'v', 'փ': 'p\'', 'ք': 'k\'', 'օ': 'o', 'ֆ': 'f',
    'և': 'ev' // Common ligature
  };

  let latinizedText = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (simplerArmenianMap.hasOwnProperty(char)) {
      latinizedText += simplerArmenianMap[char];
    } else {
      latinizedText += char;
    }
  }
  return latinizedText;
}

function getLatinization(text, languageIdentifier) {
  console.log(`[getLatinization DEBUG] Received text: "${text}", languageIdentifier: "${languageIdentifier}"`);

  if (!text || typeof text.trim !== 'function' || text.trim() === '') {
    console.log('[getLatinization DEBUG] Text is empty or invalid, returning original text.');
    return text;
  }

  const normalizedIdentifier = (languageIdentifier || '').toLowerCase();
  console.log(`[getLatinization DEBUG] Normalized identifier: "${normalizedIdentifier}"`);

  let resultText = text; // Default to original text

  if (normalizedIdentifier.includes('русский') || normalizedIdentifier.includes('russian')) {
    console.log('[getLatinization DEBUG] Attempting to call latinizeRussian.');
    console.log(`[getLatinization DEBUG] Text before calling latinizeRussian: "${text}"`);
    resultText = latinizeRussian(text);
  } else if (normalizedIdentifier.includes('ελληνικά') || normalizedIdentifier.includes('greek')) {
    console.log('[getLatinization DEBUG] Attempting to call latinizeGreek.');
    console.log(`[getLatinization DEBUG] Text before calling latinizeGreek: "${text}"`);
    resultText = latinizeGreek(text); // This is where hyper-detailed logs should trigger if called
  } else if (normalizedIdentifier.includes('հայկական') || normalizedIdentifier.includes('armenian')) {
    console.log('[getLatinization DEBUG] Attempting to call latinizeArmenian.');
    console.log(`[getLatinization DEBUG] Text before calling latinizeArmenian: "${text}"`);
    resultText = latinizeArmenian(text); // Hyper-detailed logs for Armenian would be here
  } else {
    console.log('[getLatinization DEBUG] Language not supported or identifier unclear, returning original text.');
  }
  
  console.log(`[getLatinization DEBUG] Returning: "${resultText}"`);
  return resultText;
}

function latinizeGreek(text) {
  console.log(`[latinizeGreek DEBUG] Input text: "${text}"`);
  const greekToLatinMap = {
    // Uppercase
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'CH', 'Ψ': 'PS', 'Ω': 'O',
    // Lowercase
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    // Accented Uppercase
    'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O',
    // Accented Lowercase
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    // Lowercase with diaeresis
    'ϊ': 'i', 'ϋ': 'y',
    // Accented with diaeresis
    'ΐ': 'i', 'ΰ': 'y',
    // Digraphs
    'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'ου': 'ou', 'γγ': 'ng', 'γκ': 'gk', 'γχ': 'nch', 'τσ': 'ts',
    'μπ': 'b', 'ντ': 'd',
    // Uppercase Digraphs
    'ΑΙ': 'AI', 'ΕΙ': 'EI', 'ΟΙ': 'OI', 'ΟΥ': 'OU', 'ΓΓ': 'NG', 'ΓΚ': 'GK', 'ΓΧ': 'NCH', 'ΤΣ': 'TS',
    'ΜΠ': 'B', 'ΝΤ': 'D',
    // Accented Digraphs
    'άι': 'ai', 'έι': 'ei', 'όι': 'oi', 'ού': 'ou'
  };

  let latinizedText = "";
  let i = 0;
  console.log('[latinizeGreek DEBUG] Starting processing loop.');
  while (i < text.length) {
    let foundDigraph = false;
    let charToProcess = ''; // Not used in current log, but kept from prompt
    let unicodePoint = ''; // Not used in current log, but kept from prompt

    // Check for 2-character digraphs
    if (i + 1 < text.length) {
      const digraph = text.substring(i, i + 2);
      console.log(`[latinizeGreek DEBUG] Checking digraph: "${digraph}" (Unicode: U+${digraph.charCodeAt(0).toString(16).toUpperCase()} U+${digraph.charCodeAt(1).toString(16).toUpperCase()}) at index ${i}`);
      if (greekToLatinMap.hasOwnProperty(digraph)) {
        latinizedText += greekToLatinMap[digraph];
        console.log(`[latinizeGreek DEBUG] Digraph found in map. Mapped to: "${greekToLatinMap[digraph]}". Appended: "${greekToLatinMap[digraph]}". New latinizedText: "${latinizedText}"`);
        i += 2;
        foundDigraph = true;
      } else {
        console.log(`[latinizeGreek DEBUG] Digraph "${digraph}" not in map.`);
      }
    }
    
    if (!foundDigraph) {
      const char = text[i];
      console.log(`[latinizeGreek DEBUG] Processing single char: "${char}" (Unicode: U+${char.charCodeAt(0).toString(16).toUpperCase()}) at index ${i}`);
      if (greekToLatinMap.hasOwnProperty(char)) {
        latinizedText += greekToLatinMap[char];
        console.log(`[latinizeGreek DEBUG] Char found in map. Mapped to: "${greekToLatinMap[char]}". Appended: "${greekToLatinMap[char]}". New latinizedText: "${latinizedText}"`);
      } else {
        latinizedText += char; // Append original character if not in map
        console.log(`[latinizeGreek DEBUG] Char not in map. Appended original: "${char}". New latinizedText: "${latinizedText}"`);
      }
      i += 1;
    }
  }
  console.log(`[latinizeGreek DEBUG] Finished processing. Final latinizedText: "${latinizedText}"`);
  return latinizedText;
}

console.log('[TransliterationJS] Script executed to end.');
