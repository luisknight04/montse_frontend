document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 0. ESTADO GLOBAL Y CONEXIÓN A MONGODB (RENDER)
    // =========================================================
    const BACKEND_URL = 'https://montse-backend.onrender.com'; // ⚠️ CAMBIA ESTO POR TU URL REAL
    
    let appState = {
        openedWeeks: [],
        wonPrizes: {}
    };

    async function saveProgressToCloud() {
        try {
            await fetch(`${BACKEND_URL}/api/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    openedWeeks: appState.openedWeeks,
                    wonPrizes: appState.wonPrizes
                })
            });
            updateDrawer(); // Refresca el panel lateral visualmente
        } catch (error) {
            console.error("Error guardando en la bóveda:", error);
        }
    }

    // =========================================================
    // 1. SISTEMA DE NOTIFICACIONES PERSONALIZADAS (TOAST)
    // =========================================================
    function showToast(message) {
        const container = document.getElementById('notification-container');
        const toast = document.createElement('div');
        toast.classList.add('toast-notification');
        
        toast.innerHTML = `<span>🗝️</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 4000);
    }

    // =========================================================
    // GENERADOR DE PARTÍCULAS AMBIENTALES
    // =========================================================
    const particlesContainer = document.getElementById('ambient-particles');
    const particleCount = 40; 

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 18 + 12}s`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        particlesContainer.appendChild(particle);
    }

    // =========================================================
    // 2.5 INTEGRACIÓN IA (Llamada segura al Backend)
    // =========================================================
    async function fetchAIMessage() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/bienvenida`);
            if (!response.ok) throw new Error('Error en la conexión con el servidor');
            
            const data = await response.json();
            return data.mensaje;
            
        } catch (error) {
            console.error("Fallo la conexión con el oráculo:", error);
            return null; 
        }
    }

    async function showCenterWelcomeToast() {
        let toast = document.getElementById('welcome-toast-center');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'welcome-toast-center';
            toast.classList.add('welcome-toast');
            document.body.appendChild(toast);
        }
        
        toast.innerHTML = `<span class="ai-icon">✨</span><p>Consultando el destino...</p>`;
        toast.classList.add('show');
        
        const aiText = await fetchAIMessage();
        toast.innerHTML = `<span class="ai-icon">✨</span><p>${aiText || "La cerradura ha cedido. Bienvenida, Mi Amor."}</p>`;
        
        let autoClose = setTimeout(closeToast, 15000);

        function closeToast() {
            toast.classList.remove('show');
            document.removeEventListener('click', clickOutsideHandler);
            clearTimeout(autoClose);
        }

        function clickOutsideHandler(e) {
            closeToast();
        }

        setTimeout(() => {
            document.addEventListener('click', clickOutsideHandler);
        }, 100);
    }

    // =========================================================
    // 2. LÓGICA DE LA PANTALLA DE BLOQUEO Y ANIMACIÓN GSAP
    // =========================================================
    const loginOverlay = document.getElementById('login-overlay');
    const unlockBtn = document.getElementById('unlock-btn');
    const pinInput = document.getElementById('secret-pin');
    const loginError = document.getElementById('login-error');

    const CORRECT_PIN = "0710"; 

    unlockBtn.addEventListener('click', async () => {
        const enteredPin = pinInput.value;
        
        if (enteredPin === CORRECT_PIN) {
            loginError.innerText = "";
            loginOverlay.classList.add('hidden'); 
            
            showCenterWelcomeToast();

            // NUEVO: REGISTRAR LA VISITA EN LA BASE DE DATOS (SILENCIOSO)
            try {
                fetch(`${BACKEND_URL}/api/visita`, { method: 'POST' });
            } catch (err) {
                console.error("No se pudo registrar la visita", err);
            }

            // DESCARGAMOS EL PROGRESO DESDE MONGODB
            try {
                const response = await fetch(`${BACKEND_URL}/api/sync`);
                const data = await response.json();
                if (data) {
                    appState.openedWeeks = data.openedWeeks || [];
                    appState.wonPrizes = data.wonPrizes || {};
                }
            } catch (err) {
                console.error("Fallo carga inicial de la bóveda", err);
            }
            
            updateDrawer(); // Pintar el cajón de cupones con lo que haya en la nube

            // Actualizar visualmente las tarjetas que ya están abiertas según la base de datos
            document.querySelectorAll('.day-card').forEach(card => {
                const weekNum = parseInt(card.dataset.week);
                if (appState.openedWeeks.includes(weekNum)) {
                    card.classList.add('opened');
                }
            });

            gsap.to(".day-card, .finale-card", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1, 
                ease: "power3.out",
                delay: 0.3 
            });

        } else {
            loginError.innerText = "La llave es incorrecta.";
            pinInput.value = ""; 
            pinInput.focus();
        }
    });

    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') unlockBtn.click();
    });
    
    // =========================================================
    // 3. FUEGOS ARTIFICIALES (PALETA TERCIOPELO Y VINO)
    // =========================================================
    let fireworksFired = false;

    function triggerFireworks() {
        const duration = 20 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 2000,
            colors: ['#dca4ad', '#2e181f', '#5c1827', '#f5ecee'] 
        };

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // =========================================================
    // 4. RELOJ DE CUENTA REGRESIVA
    // =========================================================
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = TARGET_DATE - now;

        if (difference <= 0) {
            document.querySelector('.countdown-container').innerHTML = 
                "<div style='font-family:var(--font-title); color:var(--accent-color); font-size:1.8rem; text-align:center; width:100%; padding:10px; font-style: italic;'>El tiempo se ha cumplido. Feliz Aniversario.</div>";
            
            if (!fireworksFired) {
                fireworksFired = true;
                triggerFireworks();
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('timer-days').innerText = String(days).padStart(2, '0');
        document.getElementById('timer-hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('timer-minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('timer-seconds').innerText = String(seconds).padStart(2, '0');
    }
    
    updateCountdown(); 
    setInterval(updateCountdown, 1000);

    // =========================================================
    // 5. LÓGICA DEL MENÚ LATERAL Y QUIZ DEL DÍA
    // =========================================================
    const drawer = document.getElementById('coupon-drawer');
    const openDrawerBtn = document.getElementById('menu-toggle-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerContent = document.getElementById('drawer-content');

    const navCouponsBtn = document.getElementById('nav-coupons-btn');
    const navQuizBtn = document.getElementById('nav-quiz-btn');

    let currentDrawerTab = 'coupons'; // Estado interno: 'coupons' o 'quiz'

    function updateDrawer() {
        drawerContent.innerHTML = "";
        
        if (currentDrawerTab === 'coupons') {
            const prizeKeys = Object.keys(appState.wonPrizes);
            if (prizeKeys.length === 0) {
                drawerContent.innerHTML = "<p class='empty-drawer'>Aún no tienes cupones. Gira la ruleta en las semanas correspondientes.</p>";
                return;
            }
            prizeKeys.forEach(week => {
                const coupon = document.createElement('div');
                coupon.classList.add('coupon-item');
                coupon.innerHTML = `<strong>Capítulo ${week}:</strong><br>${appState.wonPrizes[week]}`;
                drawerContent.appendChild(coupon);
            });
        } else if (currentDrawerTab === 'quiz') {
            renderQuizInterface();
        }
    }

async function renderQuizInterface() {
        drawerContent.innerHTML = "<p class='quiz-loading'>Consultando al Oráculo el dilema de hoy...</p>";
        const usuario = esPrueba ? '?user=luis_pruebas' : '?user=montse_0710';
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/quiz-diario${usuario}`);
            if (!response.ok) throw new Error();
            const quiz = await response.json();

            // Creamos el HTML del termómetro de la racha de forma dinámica
            const racha = quiz.currentStreak || 0;
            let iconoFuego = racha > 0 ? "🔥" : "❄️";
            let mensajeRacha = racha > 0 ? `¡Llevas ${racha} días manteniendo la sintonía!` : "¡Inicia tu racha de amor hoy!";

            const termometroHTML = `
                <div class="quiz-streak-thermometer">
                    <span class="streak-icon">${iconoFuego}</span>
                    <div class="streak-details">
                        <span class="streak-count">Racha Activa: ${racha} días</span>
                        <span class="streak-msg">${mensajeRacha}</span>
                    </div>
                </div>
            `;

            // CASO A: YA JUGÓ HOY
            if (quiz.alreadyPlayed) {
                drawerContent.innerHTML = `
                    <div class="quiz-container">
                        ${termometroHTML} <p class="quiz-question" style="margin-top:15px;">${quiz.pregunta}</p>
                        <div class="quiz-options">
                            <button class="quiz-opt-btn selected" disabled style="font-style: italic;">
                                Tu elección: "${quiz.respuestaElegida}"
                            </button>
                        </div>
                        <p style="color: var(--text-muted); font-size:0.85rem; font-style:italic; text-align:center; margin-top:10px;">
                            Tu respuesta ha quedado grabada en la nube del destino. Vuelve mañana para un nuevo enigma.
                        </p>
                    </div>
                `;
                return;
            }

            // CASO B: DÍA NUEVO
            drawerContent.innerHTML = `
                <div class="quiz-container">
                    ${termometroHTML} <p class="quiz-question" style="margin-top:15px;">${quiz.pregunta}</p>
                    <div class="quiz-options">
                        ${quiz.opciones.map((opcion, index) => `
                            <button class="quiz-opt-btn" data-index="${index}">${opcion}</button>
                        `).join('')}
                    </div>
                    <div id="quiz-feedback" class="quiz-feedback"></div>
                </div>
            `;

            // Lógica de los botones de opciones...
            document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const botones = document.querySelectorAll('.quiz-opt-btn');
                    botones.forEach(b => b.disabled = true); 
                    e.target.classList.add('selected');

                    const elegidaTexto = e.target.innerText;
                    const feedback = document.getElementById('quiz-feedback');
                    
                    let comentario = "";
                    if (quiz.categoria.includes("Romántica")) {
                        comentario = "✨ El hilo rojo se tensa. Tu corazón y el mío vibran en la misma frecuencia, Mi Vida.";
                    } else if (quiz.categoria.includes("Divertida")) {
                        comentario = "🥂 ¡Cómplices perfectos! Nadie en este mundo entiende nuestra conexión mejor que tú.";
                    } else {
                        comentario = "🔥 Una respuesta fascinante... Has encendido una llama que arderá con fuerza en nuestro próximo encuentro.";
                    }

                    feedback.innerText = comentario;
                    feedback.classList.add('show');

                    // MANDAMOS AL BACKEND Y REVISAMOS SI HUBO PREMIO DE RACHA
                    try {
                        const res = await fetch(`${BACKEND_URL}/api/quiz-completar${usuario}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                categoria: quiz.categoria,
                                pregunta: quiz.pregunta,
                                respuesta: elegidaTexto 
                            })
                        });
                        const dataRes = await res.json();

                        // Si el backend responde que desbloqueó un premio por hito de racha, le avisamos con un Toast descampanante
                        if (dataRes.premioDesbloqueado) {
                            setTimeout(() => {
                                showToast(`🎉 ¡LOGRO DE RACHA EXTRAORDINARIO! Se ha desbloqueado un cupón secreto en tu panel.`);
                            }, 1500);
                        }
                    } catch (err) {
                        console.error("No se pudo salvar la sesión del quiz", err);
                    }
                });
            });

        } catch (err) {
            drawerContent.innerHTML = "<p class='quiz-error'>Las estrellas se han nublado. Intenta consultar el quiz más tarde.</p>";
        }
    }

    if (navCouponsBtn && navQuizBtn) {
        navCouponsBtn.addEventListener('click', () => {
            navCouponsBtn.classList.add('active');
            navQuizBtn.classList.remove('active');
            currentDrawerTab = 'coupons';
            updateDrawer();
        });

        navQuizBtn.addEventListener('click', () => {
            navQuizBtn.classList.add('active');
            navCouponsBtn.classList.remove('active');
            currentDrawerTab = 'quiz';
            updateDrawer();
        });
    }

    if(openDrawerBtn && closeDrawerBtn && drawer) {
        openDrawerBtn.addEventListener('click', () => {
            currentDrawerTab = 'coupons'; // Abrir por defecto en cupones
            if(navCouponsBtn && navQuizBtn) {
                navCouponsBtn.classList.add('active');
                navQuizBtn.classList.remove('active');
            }
            updateDrawer();
            drawer.classList.add('open');
        });
        closeDrawerBtn.addEventListener('click', () => drawer.classList.remove('open'));
    }

    // =========================================================
    // 6. RENDERIZADO DEL TABLERO DE SEMANAS
    // =========================================================
    const gridContainer = document.getElementById('calendar-grid');
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); 

    weeklyData.sort((a, b) => a.week - b.week).forEach(item => {
        const card = document.createElement('div');
        
        const targetUnlock = new Date(item.unlockDate + "T00:00:00");
        const isUnlocked = todayDate >= targetUnlock;
        
        card.dataset.week = item.week; // Referencia clave para Mongo

        if (item.week === 18) {
            card.classList.add('day-card', 'finale-card'); 
            card.innerHTML = `
                <div class="day-number">EL GRAN DÍA</div>
                <div class="status-indicator">${isUnlocked ? '🥂' : '🔒'}</div>
            `;
        } else {
            card.classList.add('day-card');
            card.innerHTML = `
                <div class="day-number">CAPÍTULO ${String(item.week).padStart(2, '0')}</div>
                <div class="status-indicator">${isUnlocked ? '📜' : '🔒'}</div>
            `;
        }

        if (isUnlocked) {
            card.classList.add('unlocked');
            card.addEventListener('click', () => { openModal(item, card); });
        } else {
            card.addEventListener('click', () => {
                showToast(`Las páginas aún están en blanco. Podrás leerlas el ${item.unlockDate}.`);
            });
        }
        gridContainer.appendChild(card);

        VanillaTilt.init(card, {
            max: 12,          
            speed: 400,       
            glare: true,      
            "max-glare": 0.15 
        });
    });

    // =========================================================
    // 7. MANEJO DEL MODAL Y EFECTO MÁQUINA DE ESCRIBIR
    // =========================================================
    const modal = document.getElementById('content-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-day-title');
    const modalQuoteContainer = document.getElementById('modal-quote-container');
    const modalMessage = document.getElementById('modal-day-message');
    const modalMediaContainer = document.getElementById('modal-media-container');

    let typingTimeouts = [];

    function clearTyping() {
        typingTimeouts.forEach(clearTimeout);
        typingTimeouts = [];
        modalMessage.classList.remove('typing-cursor');
        if (document.getElementById('quote-text-target')) {
            document.getElementById('quote-text-target').classList.remove('typing-cursor');
        }
    }

    function typeWriterEffect(element, text, speed = 30, onComplete = null) {
        element.innerHTML = ""; 
        element.classList.add('typing-cursor');
        let i = 0;
        
        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                let timeout = setTimeout(type, speed);
                typingTimeouts.push(timeout);
            } else {
                element.classList.remove('typing-cursor');
                if (onComplete) onComplete();
            }
        }
        type();
    }

    function openModal(item, cardElement) {
        clearTyping();
        
        modalTitle.innerText = item.title;
        modalMessage.innerHTML = ""; 

        if (item.quote) {
            modalQuoteContainer.innerHTML = `
                <blockquote id="quote-text-target" style="font-family: var(--font-title); font-style: italic; font-size: 1.2rem; color: var(--accent-color); border-left: 2px solid var(--accent-color); padding-left: 20px; margin-bottom: 25px; line-height: 1.5; min-height: 50px;">
                </blockquote>
            `;
            const quoteTarget = document.getElementById('quote-text-target');
            
            typeWriterEffect(quoteTarget, item.quote, 30, () => {
                typeWriterEffect(modalMessage, item.message, 25);
            });
        } else {
            modalQuoteContainer.innerHTML = "";
            typeWriterEffect(modalMessage, item.message, 25);
        }

        // A. Integración Responsiva TIDAL
        if (item.tidalID) {
            modalMediaContainer.innerHTML = `
                <div class="tidal-player-container">
                    <iframe src="https://embed.tidal.com/tracks/${item.tidalID}"  frameborder="0" 
                    allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture">
                    </iframe>
                </div>
            `;
        } 
        // B. Ruleta
        else if (item.hasRoulette) {
            modalMediaContainer.innerHTML = `
                <div class="roulette-wrapper">
                    <div class="roulette-pointer"></div>
                    <div class="roulette-wheel" id="roulette-wheel"></div>
                </div>
                <button class="spin-btn" id="spin-btn">Girar Ruleta</button>
                <div class="roulette-result" id="roulette-result"></div>
            `;

            const spinBtn = document.getElementById('spin-btn');
            const wheel = document.getElementById('roulette-wheel');
            const resultDisplay = document.getElementById('roulette-result');
            
            const masterPrizes = [
                "Masaje de cuerpo completo a la luz de las velas 🕯️", 
                "Te invito un rico café y tu postre favorito ☕",      
                "Hoy tienes el control total de mi en la cama 😈", 
                "Noche de películas donde tú eliges todo 🎬",  
                "Cumplimos esa fantasía pendiente 🔥",      
                "Cita sorpresa organizada 100% por mí 🍷"    
            ];

            const rouletteColors = ['var(--bg-card-hover)', 'var(--bg-card-locked)', 'var(--accent-glow)'];

            let wonPrizeValues = Object.values(appState.wonPrizes);
            let availablePrizes = masterPrizes.filter(prize => !wonPrizeValues.includes(prize));
            
            if (availablePrizes.length === 0) {
                availablePrizes = ["Comodín: Tú eliges el premio de hoy 👑"];
            }

            const numSegments = availablePrizes.length;
            const degreesPerSegment = 360 / numSegments;
            let gradientStops = [];
            
            for(let i = 0; i < numSegments; i++) {
                let color = rouletteColors[i % rouletteColors.length];
                let startDegree = i * degreesPerSegment;
                let endDegree = (i + 1) * degreesPerSegment;
                gradientStops.push(`${color} ${startDegree}deg ${endDegree}deg`);
            }
            
            wheel.style.background = `conic-gradient(${gradientStops.join(', ')})`;
            
            if (appState.wonPrizes[item.week]) {
                spinBtn.disabled = true;
                spinBtn.innerText = "Ruleta Bloqueada";
                resultDisplay.innerText = "Ya ganaste: " + appState.wonPrizes[item.week];
                resultDisplay.classList.add('show');
                wheel.style.transform = `rotate(1080deg)`; 
            } else {
                let currentRotation = 0;

                spinBtn.addEventListener('click', () => {
                    spinBtn.disabled = true; 
                    resultDisplay.classList.remove('show');
                    resultDisplay.innerText = "";

                    const extraDegrees = Math.floor(Math.random() * 360);
                    const totalSpin = (360 * 8) + extraDegrees; 
                    currentRotation += totalSpin;

                    wheel.style.transform = `rotate(${currentRotation}deg)`;

                    setTimeout(() => {
                        const normalizedRotation = currentRotation % 360;
                        const pointerDegree = (360 - normalizedRotation) % 360;
                        
                        const prizeIndex = Math.floor(pointerDegree / degreesPerSegment);
                        const wonPrize = availablePrizes[prizeIndex];
                        
                        resultDisplay.innerText = "Ganaste: " + wonPrize;
                        resultDisplay.classList.add('show');
                        spinBtn.innerText = "¡Cupón Guardado!";
                        
                        // GUARDAMOS EN LA NUBE
                        appState.wonPrizes[item.week] = wonPrize;
                        saveProgressToCloud(); 
                    }, 4000); 
                });
            }
        }
        // C. Rasca y Gana interactivo
        else if (item.hasScratchCard) {
            modalMediaContainer.innerHTML = `
                <div style="text-align:center; font-style:italic; margin-top:20px; color:var(--text-muted); font-size: 0.95rem;">
                    Elige sabiamente. Raspa solo una casilla con tu dedo. Las otras dos se bloquearán.
                </div>
                <div class="scratch-game-container" id="scratch-game-container"></div>
                <div class="roulette-result" id="scratch-result"></div>
            `;

            const container = document.getElementById('scratch-game-container');
            const resultDisplay = document.getElementById('scratch-result');

            if (appState.wonPrizes[item.week]) {
                container.innerHTML = `
                    <p style="color: var(--accent-color); font-family: var(--font-title); font-size: 1.3rem; text-align: center; width: 100%;">
                        Ya revelaste tu destino: <br><strong style="color: var(--text-main);">${appState.wonPrizes[item.week]}</strong>
                    </p>`;
            } else {
                const shuffledPrizes = item.scratchPrizes.sort(() => 0.5 - Math.random());
                let isGameLocked = false; 

                shuffledPrizes.forEach((prize) => {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('scratch-card-wrapper');

                    const prizeText = document.createElement('div');
                    prizeText.classList.add('scratch-prize');
                    prizeText.innerText = prize;

                    const canvas = document.createElement('canvas');
                    canvas.classList.add('scratch-canvas');
                    canvas.width = 160;
                    canvas.height = 240;

                    wrapper.appendChild(prizeText);
                    wrapper.appendChild(canvas);
                    container.appendChild(wrapper);

                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#3a2e22'; 
                    ctx.fillRect(0, 0, 160, 240);
                    
                    ctx.fillStyle = '#d4af37'; 
                    ctx.font = 'italic 18px Playfair Display';
                    ctx.textAlign = 'center';
                    ctx.fillText('Raspar', 80, 125); 

                    let isDrawing = false;
                    let scratchCount = 0;

                    const scratchStart = (e) => {
                        if(isGameLocked) return;
                        isDrawing = true;
                        scratch(e);
                    };

                    const scratchMove = (e) => {
                        if(!isDrawing || isGameLocked) return;
                        scratch(e);
                    };

                    const scratchEnd = () => { isDrawing = false; };

                    const scratch = (e) => {
                        if(scratchCount === 150) {
                            document.querySelectorAll('.scratch-canvas').forEach(c => {
                                if(c !== canvas) c.classList.add('locked-card');
                            });
                        }

                        const rect = canvas.getBoundingClientRect();
                        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                        const x = clientX - rect.left;
                        const y = clientY - rect.top;

                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.beginPath();
                        ctx.arc(x, y, 22, 0, Math.PI * 2); 
                        ctx.fill();

                        scratchCount++;

                        if(scratchCount % 4 === 0 && !isGameLocked) {
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const pixels = imageData.data;
                            let transparent = 0;
                            
                            for(let i = 3; i < pixels.length; i += 4) {
                                if(pixels[i] < 128) transparent++;
                            }
                            
                            const percent = (transparent / (pixels.length / 4)) * 100;

                            if(percent > 30) {
                                isGameLocked = true;
                                
                                canvas.style.opacity = '0'; 
                                setTimeout(() => canvas.remove(), 500); 

                                document.querySelectorAll('.scratch-card-wrapper').forEach(w => {
                                    const c = w.querySelector('.scratch-canvas');
                                    const pText = w.querySelector('.scratch-prize');
                                    
                                    if(c !== canvas) {
                                        if(c) {
                                            c.style.opacity = '0'; 
                                            setTimeout(() => c.remove(), 500);
                                        }
                                        if(pText) pText.classList.add('lost-prize');
                                    }
                                });

                                resultDisplay.innerText = "¡Destino Revelado!";
                                resultDisplay.classList.add('show');

                                // GUARDAMOS EN LA NUBE
                                appState.wonPrizes[item.week] = prize;
                                saveProgressToCloud();
                            }
                        }
                    };

                    canvas.addEventListener('mousedown', scratchStart);
                    canvas.addEventListener('mousemove', scratchMove);
                    canvas.addEventListener('mouseup', scratchEnd);
                    canvas.addEventListener('mouseleave', scratchEnd);
                    canvas.addEventListener('touchstart', scratchStart, {passive: true});
                    canvas.addEventListener('touchmove', scratchMove, {passive: true});
                    canvas.addEventListener('touchend', scratchEnd);
                });
            }
        }
        else {
            modalMediaContainer.innerHTML = "";
        }

        modal.classList.add('active');

        // SI LA TARJETA NO ESTABA ABIERTA, LA ABRIMOS Y GUARDAMOS EN LA NUBE
        if (!appState.openedWeeks.includes(item.week)) {
            appState.openedWeeks.push(item.week);
            cardElement.classList.add('opened');
            saveProgressToCloud(); 
        }
    }

    // =========================================================
    // 8. EVENTOS PARA CERRAR EL MODAL
    // =========================================================
    if(closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            clearTyping(); 
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                clearTyping();
            }
        });
    }
});
