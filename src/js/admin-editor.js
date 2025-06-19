const AdminEditor = {
    languageSelect: null,
    exerciseTypeSelect: null,
    exerciseDataTextarea: null,
    saveButton: null,
    availableLanguages: ["armenian", "COSYenglish", "COSYfrançais"], // Hardcoded for now
    // Example: "vocabulary/words", "grammar/gender"
    availableExerciseTypes: { 
        "vocabulary": ["words", "images", "phrases"],
        "grammar": ["gender", "verbs", "articles"],
        "reading": ["stories", "facts"],
        "speaking": ["prompts", "questions"],
        "writing": ["prompts", "storytelling"]
    },

    init() {
        this.languageSelect = document.getElementById('admin-language-select');
        this.exerciseTypeSelect = document.getElementById('admin-exercise-type-select');
        this.exerciseDataTextarea = document.getElementById('admin-exercise-data');
        this.saveButton = document.getElementById('admin-save-button');

        if (!this.languageSelect || !this.exerciseTypeSelect || !this.exerciseDataTextarea || !this.saveButton) {
            console.error("Admin Editor UI elements not found. Ensure IDs are correct in index.html.");
            return;
        }

        this.populateLanguages();
        this.populateExerciseTypes();

        this.languageSelect.addEventListener('change', () => this.loadExerciseData());
        this.exerciseTypeSelect.addEventListener('change', () => this.loadExerciseData());
        this.saveButton.addEventListener('click', () => this.saveExerciseData());

        // Initial load if default selections are present
        if (this.languageSelect.value && this.exerciseTypeSelect.value) {
            this.loadExerciseData();
        }
        console.log("AdminEditor initialized");
    },

    populateLanguages() {
        this.availableLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            // Attempt to capitalize first letter for display, handle "COSYenglish" type names
            let displayName = lang.startsWith("COSY") ? lang.substring(4) : lang;
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
            option.textContent = displayName;
            this.languageSelect.appendChild(option);
        });
    },

    populateExerciseTypes() {
        // Populate main categories first
        Object.keys(this.availableExerciseTypes).forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
            
            this.availableExerciseTypes[category].forEach(type => {
                const option = document.createElement('option');
                // Value format: "category/type" e.g. "vocabulary/words"
                option.value = `${category}/${type}`; 
                // Display format: "Type (Category)" e.g. "Words (Vocabulary)"
                option.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
                optgroup.appendChild(option);
            });
            this.exerciseTypeSelect.appendChild(optgroup);
        });
         // Add a default blank option
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Select type...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        this.exerciseTypeSelect.prepend(defaultOption);
    },

    async loadExerciseData() {
        const language = this.languageSelect.value;
        const exerciseTypeValue = this.exerciseTypeSelect.value; // This will be "category/type"

        if (!language || !exerciseTypeValue) {
            this.exerciseDataTextarea.value = "Please select a language and exercise type.";
            return;
        }

        // Construct path: data/category/type/language.json
        // e.g. data/vocabulary/words/english.json
        // For armenian, it's just armenian.json, not COSYarmenian.json
        const langFileName = language.startsWith("COSY") ? language : language.toLowerCase();
        const path = `data/${exerciseTypeValue}/${langFileName}.json`;
        
        this.exerciseDataTextarea.value = `Loading ${path}...`;

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - File not found or error loading: ${path}`);
            }
            const data = await response.json();
            this.exerciseDataTextarea.value = JSON.stringify(data, null, 2); // Pretty print JSON
        } catch (error) {
            console.error("Error loading exercise data:", error);
            this.exerciseDataTextarea.value = `Error loading exercise data:\n${error.message}\n\nAttempted path: ${path}`;
        }
    },

    saveExerciseData() {
        const jsonDataString = this.exerciseDataTextarea.value;
        let parsedData;

        try {
            parsedData = JSON.parse(jsonDataString);
        } catch (error) {
            alert(`Invalid JSON: ${error.message}`);
            console.error("Invalid JSON:", error);
            return;
        }

        const language = this.languageSelect.value;
        const exerciseTypeValue = this.exerciseTypeSelect.value; // "category/type"

        if (!language || !exerciseTypeValue) {
            alert("Please select a language and exercise type before saving.");
            return;
        }

        // Construct filename: category_type_language.json
        // e.g., vocabulary_words_COSYenglish.json or grammar_gender_armenian.json
        const langFileNamePart = language.startsWith("COSY") ? language : language.toLowerCase();
        const filename = `${exerciseTypeValue.replace('/', '_')}_${langFileNamePart}.json`;

        const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Required for Firefox
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`File "${filename}" prepared for download.\n\nPlease manually move this file to the correct 'data/${exerciseTypeValue}/' directory in the project, replacing the existing file if necessary.`);
        console.log(`File ${filename} prepared for download.`);
    }
};

export default AdminEditor;
