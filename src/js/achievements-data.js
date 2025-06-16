// src/js/achievements-data.js
const achievementsData = {
    "streak3": {
        "nameKey": "achievementStreak3Name",
        "descriptionKey": "achievementStreak3Desc",
        "criteria": { "type": "streak", "value": 3 },
        "icon": "🔥" // Example icon
    },
    "level5": {
        "nameKey": "achievementLevel5Name",
        "descriptionKey": "achievementLevel5Desc",
        "criteria": { "type": "level", "value": 5 },
        "icon": "🌟"
    },
    "lessons10": {
        "nameKey": "achievementLessons10Name",
        "descriptionKey": "achievementLessons10Desc",
        "criteria": { "type": "lessons", "value": 10 }, // Assuming 'lessons' refers to 'completedLessons.length'
        "icon": "📚"
    },
    "firstWord": {
        "nameKey": "achievementFirstWordName",
        "descriptionKey": "achievementFirstWordDesc",
        "criteria": { "type": "srsItems", "itemType": "vocabulary-word", "count": 1 }, // For first vocab item learned via SRS
        "icon": "💡"
    },
    "grammarGuruEasy": {
        "nameKey": "achievementGrammarGuruEasyName",
        "descriptionKey": "achievementGrammarGuruEasyDesc",
        "criteria": { "type": "srsItems", "itemType": "verb", "count": 5 }, // Example: 5 verbs mastered (added to SRS)
        "icon": "🧩"
    }
};

// Make it available for import if using modules, or attach to a global object if not.
// For now, assuming it will be loaded via script tag and 'achievementsData' will be global.
if (typeof window !== 'undefined') {
    window.achievementsData = achievementsData;
}
