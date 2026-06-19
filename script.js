document.addEventListener('DOMContentLoaded', () => {
    
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
    const particleCount = 40; // Cantidad de partículas flotando al mismo tiempo

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tamaños aleatorios sutiles (entre 2px y 5px)
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posición horizontal aleatoria (0% a 100% del ancho de la pantalla)
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Duración de la animación súper lenta y relajante (entre 12s y 30s)
        particle.style.animationDuration = `${Math.random() * 18 + 12}s`;
        
        // Retraso aleatorio para que no salgan todas de golpe
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        particlesContainer.appendChild(particle);
    }

    // =========================================================
    // 2.5 INTEGRACIÓN IA (Llamada segura al Backend Propio)
    // =========================================================
    async function fetchAIMessage() {
        const BACKEND_URL = 'https://montse-backend.onrender.com/bienvenida';
        
        try {
            const response = await fetch(BACKEND_URL);
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
        
        // Temporizador de 10 segundos
        let autoClose = setTimeout(closeToast, 10000);

        // Función que destruye el mensaje y limpia los eventos
        function closeToast() {
            toast.classList.remove('show');
            document.removeEventListener('click', clickOutsideHandler);
            clearTimeout(autoClose);
        }

        // Función intermediaria para el clic
        function clickOutsideHandler(e) {
            closeToast();
        }

        // Retrasamos 100ms la activación del clic global para evitar que 
        // el clic original del botón "Desbloquear" lo cierre accidentalmente al instante.
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

    unlockBtn.addEventListener('click', () => {
        const enteredPin = pinInput.value;
        
        if (enteredPin === CORRECT_PIN) {
            loginError.innerText = "";
            loginOverlay.classList.add('hidden'); 
            
            // Disparamos la notificación central de IA en lugar del toast básico
            showCenterWelcomeToast();

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
        // Duración del espectáculo: 10 segundos
        const duration = 20 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 2000,
            // NUEVOS COLORES: Rubor, Vino Tinto, Carmesí Oscuro y Blanco Rosáceo
            colors: ['#dca4ad', '#2e181f', '#5c1827', '#f5ecee'] 
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Disparos desde la izquierda y derecha imitando pirotecnia cruzada
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
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
            
            // Disparar fuegos artificiales solo la primera vez que se renderiza el 0
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
    
    // Llamamos el update inmediatamente y luego cada segundo
    updateCountdown(); 
    setInterval(updateCountdown, 1000);


    
    // =========================================================
    // 5. LÓGICA DEL MENÚ LATERAL (BÓVEDA DE CUPONES)
    // =========================================================
    const drawer = document.getElementById('coupon-drawer');
    const openDrawerBtn = document.getElementById('menu-toggle-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerContent = document.getElementById('drawer-content');

    function updateDrawer() {
        let wonPrizes = JSON.parse(localStorage.getItem('won_prizes')) || {};
        drawerContent.innerHTML = "";
        
        const prizeKeys = Object.keys(wonPrizes);
        if (prizeKeys.length === 0) {
            drawerContent.innerHTML = "<p class='empty-drawer'>Aún no tienes cupones. Gira la ruleta en las semanas correspondientes.</p>";
            return;
        }

        prizeKeys.forEach(week => {
            const coupon = document.createElement('div');
            coupon.classList.add('coupon-item');
            coupon.innerHTML = `<strong>Capítulo ${week}:</strong><br>${wonPrizes[week]}`;
            drawerContent.appendChild(coupon);
        });
    }

    if(openDrawerBtn && closeDrawerBtn && drawer) {
        openDrawerBtn.addEventListener('click', () => {
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
    let openedWeeks = JSON.parse(localStorage.getItem('opened_weeks')) || [];

    weeklyData.sort((a, b) => a.week - b.week).forEach(item => {
        const card = document.createElement('div');
        
        const targetUnlock = new Date(item.unlockDate + "T00:00:00");
        const isUnlocked = todayDate >= targetUnlock;
        const isOpened = openedWeeks.includes(item.week);

        if (item.week === 18) {
            card.classList.add('day-card'); 
            card.classList.add('finale-card'); 
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
            if (isOpened) card.classList.add('opened');

            card.addEventListener('click', () => {
                openModal(item, card);
            });
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

        if (item.tidalID) {
            modalMediaContainer.innerHTML = `
                <div style="margin-top: 25px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
                    <iframe src="https://embed.tidal.com/tracks/${item.tidalID}" width="480" height="120" allow="encrypted-media; fullscreen; 
                    clipboard-write https://embed.tidal.com; web-share" sandbox="allow-same-origin allow-scripts allow-forms allow-popups 
                    allow-popups-to-escape-sandbox" style="color-scheme: light dark" title="TIDAL Embed Player" />
                </div>
            `;
        } 
        // C. Inyectar Ruleta Interactiva Dinámica (Elimina premios ganados)
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
            
            // LA LISTA MAESTRA DE PREMIOS
            const masterPrizes = [
                "Masaje de cuerpo completo a poca luz 🕯️", 
                "Te invito un buen café y postre ☕",      
                "Hoy tienes el control total de mi 😈", 
                "Noche de películas donde tú eliges todo 🎬",  
                "Cumplimos esa fantasía pendiente 🔥",      
                "Cita sorpresa organizada 100% por mí 🍷"    
            ];

            // Paleta de colores Dark Academia para repintar la ruleta
            const rouletteColors = ['var(--bg-card-hover)', '#8B5A2B', '#3a2e22', '#A85751', '#5e3a23', '#2a231d'];

            // Verificamos qué premios ya ganó Montse
            let wonPrizes = JSON.parse(localStorage.getItem('won_prizes')) || {};
            let wonPrizeValues = Object.values(wonPrizes);
            
            // FILTRAR PREMIOS: Dejamos solo los que NO están en la bóveda
            let availablePrizes = masterPrizes.filter(prize => !wonPrizeValues.includes(prize));
            
            // Sistema de seguridad: Por si pone más tarjetas de ruleta que premios disponibles
            if (availablePrizes.length === 0) {
                availablePrizes = ["Comodín: Tú eliges el premio de hoy 👑"];
            }

            // MATEMÁTICA VISUAL: Dibujar la ruleta dinámicamente con los premios restantes
            const numSegments = availablePrizes.length;
            const degreesPerSegment = 360 / numSegments;
            let gradientStops = [];
            
            for(let i = 0; i < numSegments; i++) {
                let color = rouletteColors[i % rouletteColors.length];
                let startDegree = i * degreesPerSegment;
                let endDegree = (i + 1) * degreesPerSegment;
                gradientStops.push(`${color} ${startDegree}deg ${endDegree}deg`);
            }
            
            // Pintamos la ruleta inyectando el CSS directamente desde JavaScript
            wheel.style.background = `conic-gradient(${gradientStops.join(', ')})`;
            
            // Lógica de bloqueo si ya giró esta semana
            if (wonPrizes[item.week]) {
                spinBtn.disabled = true;
                spinBtn.innerText = "Ruleta Bloqueada";
                resultDisplay.innerText = "Ya ganaste: " + wonPrizes[item.week];
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
                        
                        // MATEMÁTICA DE PREMIOS: Calcular qué rebanada ganó con los grados nuevos
                        const prizeIndex = Math.floor(pointerDegree / degreesPerSegment);
                        const wonPrize = availablePrizes[prizeIndex];
                        
                        resultDisplay.innerText = "Ganaste: " + wonPrize;
                        resultDisplay.classList.add('show');
                        spinBtn.innerText = "¡Cupón Guardado!";
                        
                        // Guardar en memoria y actualizar panel
                        wonPrizes[item.week] = wonPrize;
                        localStorage.setItem('won_prizes', JSON.stringify(wonPrizes));
                        updateDrawer(); 
                    }, 4000); 
                });
            }
        }

        // D. Inyectar Rasca y Gana interactivo
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
            let wonPrizes = JSON.parse(localStorage.getItem('won_prizes')) || {};

            // Verificamos si ya jugó esta semana
            if (wonPrizes[item.week]) {
                container.innerHTML = `
                    <p style="color: var(--accent-color); font-family: var(--font-title); font-size: 1.3rem; text-align: center; width: 100%;">
                        Ya revelaste tu destino: <br><strong style="color: var(--text-main);">${wonPrizes[item.week]}</strong>
                    </p>`;
            } else {
                // Mezclamos los premios al azar para que no sepa dónde está cada uno
                const shuffledPrizes = item.scratchPrizes.sort(() => 0.5 - Math.random());
                let isGameLocked = false; // Bandera para bloquear las demás tarjetas

                shuffledPrizes.forEach((prize) => {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('scratch-card-wrapper');

                    const prizeText = document.createElement('div');
                    prizeText.classList.add('scratch-prize');
                    prizeText.innerText = prize;

                    // ... [código anterior de creación del wrapper y prizeText] ...

                    const canvas = document.createElement('canvas');
                    canvas.classList.add('scratch-canvas');
                    // Nuevas medidas verticales
                    canvas.width = 160;
                    canvas.height = 240;

                    wrapper.appendChild(prizeText);
                    wrapper.appendChild(canvas);
                    container.appendChild(wrapper);

                    const ctx = canvas.getContext('2d');
                    
                    // Pintamos el nuevo recuadro vertical
                    ctx.fillStyle = '#3a2e22'; 
                    ctx.fillRect(0, 0, 160, 240);
                    
                    ctx.fillStyle = '#d4af37'; 
                    ctx.font = 'italic 18px Playfair Display';
                    ctx.textAlign = 'center';
                    // Centramos el texto "Raspar" en las nuevas medidas
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
                        // Bloquear los demás en el instante que raspa la primera vez
                        if(scratchCount === 150) {
                            const allCanvases = document.querySelectorAll('.scratch-canvas');
                            allCanvases.forEach(c => {
                                if(c !== canvas) {
                                    c.classList.add('locked-card');
                                }
                            });
                        }

                        const rect = canvas.getBoundingClientRect();
                        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                        const x = clientX - rect.left;
                        const y = clientY - rect.top;

                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.beginPath();
                        ctx.arc(x, y, 22, 0, Math.PI * 2); // Pincel un poco más grande
                        ctx.fill();

                        scratchCount++;

                        // LÓGICA DEL 30%: Evaluamos los píxeles cada 4 movimientos para no saturar la memoria
                        if(scratchCount % 4 === 0 && !isGameLocked) {
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const pixels = imageData.data;
                            let transparent = 0;
                            
                            // Revisamos el canal Alpha de cada píxel
                            for(let i = 3; i < pixels.length; i += 4) {
                                if(pixels[i] < 128) transparent++;
                            }
                            
                            const percent = (transparent / (pixels.length / 4)) * 100;

                            // Si raspó más del 30%, revelamos todo el cupón
                            // Si raspó más del 30%, revelamos todo
                            if(percent > 30) {
                                isGameLocked = true;
                                
                                // 1. Desvanecemos el canvas de la tarjeta ganadora
                                canvas.style.opacity = '0'; 
                                setTimeout(() => canvas.remove(), 500); 

                                // 2. Buscamos todas las tarjetas para revelar las perdedoras
                                const allWrappers = document.querySelectorAll('.scratch-card-wrapper');
                                allWrappers.forEach(w => {
                                    const c = w.querySelector('.scratch-canvas');
                                    const pText = w.querySelector('.scratch-prize');
                                    
                                    // Si NO es la tarjeta que ella raspó (es decir, perdió esta opción)
                                    if(c !== canvas) {
                                        if(c) {
                                            c.style.opacity = '0'; // Quitamos la pintura
                                            setTimeout(() => c.remove(), 500);
                                        }
                                        if(pText) {
                                            // Aplicamos el desenfoque al texto revelado
                                            pText.classList.add('lost-prize');
                                        }
                                    }
                                });

                                // Mostramos el mensaje de éxito
                                resultDisplay.innerText = "¡Destino Revelado!";
                                resultDisplay.classList.add('show');

                                // Guardamos en memoria
                                wonPrizes[item.week] = prize;
                                localStorage.setItem('won_prizes', JSON.stringify(wonPrizes));
                                updateDrawer();
                            }
                        }
                    };

                    // ... [resto de los EventListeners táctiles y de ratón iguales] ...

                    // Eventos para Ratón (PC)
                    canvas.addEventListener('mousedown', scratchStart);
                    canvas.addEventListener('mousemove', scratchMove);
                    canvas.addEventListener('mouseup', scratchEnd);
                    canvas.addEventListener('mouseleave', scratchEnd);

                    // Eventos para Táctil (Celular)
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

        if (!openedWeeks.includes(item.week)) {
            openedWeeks.push(item.week);
            localStorage.setItem('opened_weeks', JSON.stringify(openedWeeks));
            cardElement.classList.add('opened');
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