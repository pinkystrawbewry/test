/* ==========================================================================
   logic.js - Application Logic (Auto Checker, Mini Tools, Formula logic)
   ========================================================================== */

class AppLogic {
    // Show a toast notification
    static showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/></svg>`;
        } else if (type === 'error') {
            icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>`;
        }

        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fadeout');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Interactive Quiz / Auto Checker Support
    static checkAnswer(inputId, correctAnswer, levelId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const val = input.value.trim().toUpperCase();
        if (val === correctAnswer.toUpperCase()) {
            this.showToast('Jawaban Benar! Luar biasa.', 'success');
            input.style.borderColor = 'var(--success)';
            if (levelId) {
                StorageManager.updateProgress(levelId, true);
            }
        } else {
            this.showToast('Jawaban salah. Coba periksa kembali.', 'error');
            input.style.borderColor = 'var(--error)';
        }
    }

    // Formula Assistant
    static getFormulaSuggestion(keyword) {
        const map = {
            'rata-rata': '=AVERAGE(range)',
            'jumlah': '=SUM(range)',
            'banyak data': '=COUNT(range)',
            'tertinggi': '=MAX(range)',
            'maksimal': '=MAX(range)',
            'terendah': '=MIN(range)',
            'minimal': '=MIN(range)',
            'cari': '=VLOOKUP(nilai_dicari, tabel_referensi, kolom, 0)',
            'syarat': '=IF(kondisi, jika_benar, jika_salah)',
            'kondisi': '=IF(kondisi, jika_benar, jika_salah)',
            'gabung': '=CONCATENATE(teks1, teks2) atau teks1 & teks2',
            'teks awal': '=LEFT(teks, jumlah_karakter)'
        };
        
        keyword = keyword.toLowerCase().trim();
        for (const key in map) {
            if (keyword.includes(key)) {
                return map[key];
            }
        }
        return null;
    }
}

window.AppLogic = AppLogic;
