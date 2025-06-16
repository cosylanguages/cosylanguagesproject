// tests/user-progress.test.js
import UserProgress from '../src/js/user-progress.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock UI update functions & elements needed for UserProgress.updateXPLevelDisplay()
global.showConfetti = jest.fn();
global.showToast = jest.fn();
document.body.innerHTML = `
    <span id="xp-display"></span>
    <span id="level-display"></span>
    <span id="streak-display"></span> 
`; // Added streak-display for completeness of the mocked UI

describe('UserProgress - XP Progression', () => {
    beforeEach(() => {
        localStorageMock.clear();
        // Reset UserProgress.data to a clean state before each test
        UserProgress.data = {
            xp: 0,
            streak: 0,
            lastActive: null,
            completedLessons: [],
            achievements: [],
            level: 1,
            firstTimeTodayForDay1: {},
            learnedItems: []
        };
        UserProgress.updateXPLevelDisplay(); // Initialize display elements based on reset data
    });

    test('load should initialize XP and Level to 0 and 1 if no saved data', () => {
        localStorageMock.getItem.mockReturnValueOnce(null); // Ensure no saved data
        UserProgress.load();
        expect(UserProgress.data.xp).toBe(0);
        expect(UserProgress.data.level).toBe(1);
        expect(document.getElementById('xp-display').textContent).toBe('XP: 0');
        expect(document.getElementById('level-display').textContent).toBe('Level: 1');
    });

    test('addXP should correctly increase XP and update level', () => {
        UserProgress.addXP(30);
        expect(UserProgress.data.xp).toBe(30);
        expect(UserProgress.data.level).toBe(1);
        UserProgress.addXP(30); // Total 60 XP
        expect(UserProgress.data.xp).toBe(60);
        expect(UserProgress.data.level).toBe(2); // Assumes 50 XP per level
        expect(document.getElementById('xp-display').textContent).toBe('XP: 60');
        expect(document.getElementById('level-display').textContent).toBe('Level: 2');
    });

    test('addXP should call showConfetti and showToast on level up', () => {
        showConfetti.mockClear(); // Clear previous calls if any
        showToast.mockClear();
        UserProgress.addXP(50); // Level up from 1 to 2
        expect(showConfetti).toHaveBeenCalledTimes(1);
        expect(showToast).toHaveBeenCalledWith('🏅 Level Up!');
    });

    test('addXP should not allow XP to go below zero', () => {
        UserProgress.addXP(10);
        UserProgress.addXP(-30); // Attempt to make XP negative
        expect(UserProgress.data.xp).toBe(0);
        expect(document.getElementById('xp-display').textContent).toBe('XP: 0');
    });

    test('recordAnswer(true) should award 5 XP', () => {
        UserProgress.recordAnswer(true);
        expect(UserProgress.data.xp).toBe(5);
    });

    test('recordAnswer(false) should deduct 2 XP, not going below zero', () => {
        UserProgress.recordAnswer(false); // XP becomes 0 (was 0, -2, clamped to 0)
        expect(UserProgress.data.xp).toBe(0);
        
        UserProgress.addXP(10); // XP is 10
        UserProgress.recordAnswer(false); // XP becomes 8 (10 - 2)
        expect(UserProgress.data.xp).toBe(8);
    });

    test('recordAnswer should trigger UI update via addXP', () => {
        UserProgress.recordAnswer(true);
        expect(document.getElementById('xp-display').textContent).toBe('XP: 5');
        UserProgress.recordAnswer(false); // XP becomes 3
        expect(document.getElementById('xp-display').textContent).toBe('XP: 3');
    });

    test('load should correctly parse and display saved XP and level', () => {
        const savedData = {
            xp: 120, // Should be Level 3 (50 for L2, 100 for L3)
            level: 1, // Deliberately incorrect level to test calculation in load or addXP
            streak: 3,
            lastActive: new Date().toDateString(),
            completedLessons: [], achievements: [], firstTimeTodayForDay1: {}, learnedItems: []
        };
        localStorageMock.setItem('userProgress', JSON.stringify(savedData));
        UserProgress.load(); // Load calls updateXPLevelDisplay
        
        expect(UserProgress.data.xp).toBe(120);
        // Level calculation primarily happens in addXP. 
        // If load doesn't recalculate level, it might show the saved level initially.
        // The current UserProgress.load initializes level if undefined, but doesn't recalculate.
        // Let's test that addXP fixes it if an action happens.
        expect(UserProgress.data.level).toBe(1); // As per current load logic
        expect(document.getElementById('level-display').textContent).toBe('Level: 1');

        UserProgress.addXP(1); // Trigger an XP change to recalculate level via addXP
        expect(UserProgress.data.xp).toBe(121);
        expect(UserProgress.data.level).toBe(3); // Now it should be corrected by addXP
        expect(document.getElementById('level-display').textContent).toBe('Level: 3');
    });
});
