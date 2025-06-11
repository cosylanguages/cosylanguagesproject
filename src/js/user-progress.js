// User progress module for XP, streaks, lesson completion, and gamification
const UserProgress = {
    data: {
        xp: 0,
        streak: 0,
        lastActive: null,
        completedLessons: [],
        achievements: [],
        level: 1
    },
    load() {
        const saved = localStorage.getItem('userProgress');
        if (saved) {
            this.data = JSON.parse(saved);
        }
    },
    save() {
        localStorage.setItem('userProgress', JSON.stringify(this.data));
    },
    addXP(amount) {
        this.data.xp += amount;
        const newLevel = Math.floor(this.data.xp / 50) + 1;
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            if (typeof showConfetti === 'function') showConfetti();
            if (typeof showToast === 'function') showToast('🏅 Level Up!');
        }
        this.save();
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
