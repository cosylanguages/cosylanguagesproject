// User progress module for XP, streaks, lesson completion, and gamification
const UserProgress = {
    data: {
        xp: 0,
        streak: 0,
        lastActive: null,
        completedLessons: [],
        achievements: [],
        level: 1,
        firstTimeTodayForDay1: {},
        learnedItems: [] // Added learnedItems
    },
    load() {
        const saved = localStorage.getItem('userProgress');
        if (saved) {
            this.data = JSON.parse(saved);
            // Ensure default values for new properties if loading old data
            if (this.data.xp === undefined) this.data.xp = 0;
            if (this.data.level === undefined) this.data.level = 1;
            if (this.data.streak === undefined) this.data.streak = 0;
            if (this.data.firstTimeTodayForDay1 === undefined) {
                this.data.firstTimeTodayForDay1 = {};
            }
            if (this.data.completedLessons === undefined) {
                this.data.completedLessons = [];
            }
            if (this.data.achievements === undefined) {
                this.data.achievements = [];
            }
            if (this.data.learnedItems === undefined) { 
                this.data.learnedItems = [];
            }
        } else {
            // If no saved data, initialize with defaults
            this.data = {
                xp: 0,
                streak: 0,
                lastActive: null,
                completedLessons: [],
                achievements: [],
                level: 1,
                firstTimeTodayForDay1: {},
                learnedItems: []
            };
        }
        this.updateXPLevelDisplay(); // Call the update here
    },
    updateXPLevelDisplay() {
        const xpElement = document.getElementById('xp-display');
        if (xpElement) {
            xpElement.textContent = `XP: ${this.data.xp}`;
        }
        const levelElement = document.getElementById('level-display');
        if (levelElement) {
            levelElement.textContent = `Level: ${this.data.level}`;
        }
        const streakElement = document.getElementById('streak-display');
        if (streakElement) {
            streakElement.textContent = `Streak: ${this.data.streak || 0}`;
        }
    },
    save() {
        localStorage.setItem('userProgress', JSON.stringify(this.data));
    },
    addXP(amount) {
        this.data.xp += amount;
        if (this.data.xp < 0) {
            this.data.xp = 0;
        }
        const newLevel = Math.floor(this.data.xp / 50) + 1; // Assuming 50 XP per level
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            if (typeof showConfetti === 'function') showConfetti();
            if (typeof showToast === 'function') showToast('🏅 Level Up!');
        }
        this.save();
        this.updateXPLevelDisplay(); // Add this call
    },
    recordAnswer(isCorrect) {
        if (isCorrect) {
            this.addXP(5); 
        } else {
            this.addXP(-2); // Deduct 2 XP for an incorrect answer
        }
        // save() and updateXPLevelDisplay() are called by addXP now.
    },
    completeLesson(lessonId) {
        if (!this.data.completedLessons.includes(lessonId)) {
            this.data.completedLessons.push(lessonId);
            this.addXP(10); // Example XP per lesson
            this.save();
        }
    },
    updateStreak() {
        const today = new Date().toDateString();
        if (this.data.lastActive !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (this.data.lastActive === yesterday) {
                this.data.streak += 1;
            } else {
                this.data.streak = 1;
            }
            this.data.lastActive = today;
            this.save();
        }
    }
};

export default UserProgress;
