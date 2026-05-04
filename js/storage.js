/* ==========================================================================
   storage.js - Handles localStorage for the application
   ========================================================================== */

const STORAGE_KEY = 'excel_assistant_data';

const defaultData = {
    userName: 'Siswa',
    progress: {
        level1: false,
        level2: false,
        level3: false,
        level4: false,
        level5: false
    },
    scores: {
        challenge: 0
    },
    lastAccess: null
};

class StorageManager {
    static getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return defaultData;
        try {
            return JSON.parse(data);
        } catch (e) {
            return defaultData;
        }
    }

    static saveData(data) {
        data.lastAccess = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    static getProgress() {
        return this.getData().progress;
    }

    static updateProgress(levelId, isCompleted) {
        const data = this.getData();
        data.progress[levelId] = isCompleted;
        this.saveData(data);
    }

    static getChallengeScore() {
        return this.getData().scores.challenge || 0;
    }

    static updateChallengeScore(score) {
        const data = this.getData();
        if (score > (data.scores.challenge || 0)) {
            data.scores.challenge = score;
            this.saveData(data);
        }
    }

    static getOverallProgress() {
        const progress = this.getProgress();
        const total = Object.keys(progress).length;
        const completed = Object.values(progress).filter(v => v).length;
        return {
            completed,
            total,
            percentage: Math.round((completed / total) * 100)
        };
    }
}

window.StorageManager = StorageManager;
