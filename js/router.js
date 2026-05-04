/* ==========================================================================
   router.js - Vanilla JS Simple Hash Router
   ========================================================================== */

class Router {
    constructor() {
        this.routes = {
            '/': 'pages/dashboard.html',
            '/dashboard': 'pages/dashboard.html',
            '/materi': 'pages/materi.html',
            '/level1': 'pages/level1.html',
            '/level2': 'pages/level2.html',
            '/level3': 'pages/level3.html',
            '/level4': 'pages/level4.html',
            '/level5': 'pages/level5.html',
            '/asisten': 'pages/asisten.html',
            '/challenge': 'pages/challenge.html',
            '/tools': 'pages/tools.html'
        };
        
        this.appContent = document.getElementById('app-content');
        
        // Listen to hash change
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    init() {
        this.handleRoute();
    }

    async handleRoute() {
        let hash = window.location.hash.replace('#', '') || '/';
        
        // Update active navigation
        document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
            el.classList.remove('active');
            const href = el.getAttribute('href').replace('#', '');
            if (hash.startsWith(href) && href !== '/' || (hash === '/' && href === '/dashboard')) {
                el.classList.add('active');
            }
        });

        // Add a slight fade out effect
        this.appContent.style.opacity = '0';
        
        const path = this.routes[hash] || 'pages/dashboard.html';

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();
            
            setTimeout(() => {
                this.appContent.innerHTML = html;
                this.appContent.style.opacity = '1';
                this.appContent.classList.remove('page-enter');
                void this.appContent.offsetWidth; // trigger reflow
                this.appContent.classList.add('page-enter-active');
                
                // Initialize specific logic based on page loaded
                this.initPageLogic(hash);
                window.scrollTo(0, 0);
            }, 200);

        } catch (e) {
            console.error('Error loading page:', e);
            setTimeout(() => {
                this.appContent.innerHTML = `
                    <div class="card text-center mt-4">
                        <h2>Oops!</h2>
                        <p class="text-muted">Halaman <b>${hash}</b> belum tersedia atau sedang dalam pengembangan.</p>
                        <a href="#/dashboard" class="btn btn-primary mt-2">Ke Beranda</a>
                    </div>
                `;
                this.appContent.style.opacity = '1';
            }, 200);
        }
    }

    initPageLogic(hash) {
        // Render dashboard progress bar if necessary
        if (hash === '/dashboard' || hash === '/') {
            const progressObj = window.StorageManager.getOverallProgress();
            const bar = document.getElementById('dashboard-progress-bar');
            const text = document.getElementById('dashboard-progress-text');
            if(bar && text) {
                bar.style.width = `${progressObj.percentage}%`;
                text.innerText = `${progressObj.percentage}% (${progressObj.completed}/${progressObj.total} Level)`;
            }
            const scoreText = document.getElementById('dashboard-score-text');
            if (scoreText) {
                scoreText.innerText = window.StorageManager.getChallengeScore();
            }
        }
        
        // Level Checker initialization
        if (hash.startsWith('/level')) {
            const levelId = hash.replace('/', '');
            const checkerBtn = document.getElementById('check-answer-btn');
            if (checkerBtn) {
                checkerBtn.addEventListener('click', () => {
                    const ans = checkerBtn.getAttribute('data-answer');
                    const inputId = checkerBtn.getAttribute('data-input');
                    window.AppLogic.checkAnswer(inputId, ans, levelId);
                });
            }
        }

        // Formula Assistant Logic
        if (hash === '/asisten') {
            const form = document.getElementById('asisten-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const val = document.getElementById('asisten-input').value;
                    const res = window.AppLogic.getFormulaSuggestion(val);
                    const resultBox = document.getElementById('asisten-result');
                    if (res) {
                        resultBox.innerHTML = `
                            <p class="text-muted mb-1">Rekomendasi rumus:</p>
                            <div class="formula-box">${res}</div>
                        `;
                    } else {
                        resultBox.innerHTML = `<p class="text-error">Maaf, kata kunci tidak dikenali. Coba 'rata-rata' atau 'jumlah'.</p>`;
                    }
                });
            }
        }

        // Challenge Logic
        if (hash === '/challenge') {
            let timerInterval;
            document.getElementById('start-challenge-btn')?.addEventListener('click', () => {
                document.getElementById('challenge-intro').style.display = 'none';
                document.getElementById('challenge-area').style.display = 'block';
                
                let time = 60; // 60 seconds
                const timerEl = document.getElementById('challenge-timer');
                timerInterval = setInterval(() => {
                    time--;
                    timerEl.innerText = `00:${time < 10 ? '0'+time : time}`;
                    if (time <= 0) {
                        clearInterval(timerInterval);
                        alert('Waktu Habis!');
                        window.StorageManager.updateChallengeScore(100);
                        location.hash = '#/dashboard';
                    }
                }, 1000);
            });
            
            document.getElementById('challenge-submit-btn')?.addEventListener('click', () => {
                clearInterval(timerInterval);
                const score = 100; // Mock score
                window.StorageManager.updateChallengeScore(score);
                window.AppLogic.showToast('Challenge selesai! Skor: ' + score);
                location.hash = '#/dashboard';
            });
        }
        
    }
}

window.Router = Router;
