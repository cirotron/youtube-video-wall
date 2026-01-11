// --- CONFIGURACIÓN ---
// Lista mutable de 13 Videos
const videoIds = [
    "SF06Qy1Ct6Y", "Y-IlMeCCtIg", "cb12KmMMDJA", "Qr61waJ6AZg",
    "O9mOtdZ-nSk", "unR6PQyi8TM", "Vh8xmLBJtR8", "2-TJWjqWsSU",
    "jRnqxURJ120", "ArKbAx1K-2U", "jZVoKumc94A", "XhAYcYpPzTc", "ku09JnYKhz0"
];

// Variables de Estado
let players = [];
let activeIndex = 0; // Quién tiene el audio
let patrolInterval = null;
let isPatrolActive = false;

// Elementos DOM
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const patrolBtn = document.getElementById('patrol-btn');

// Layout Map
const layoutMap = [
    { container: 'q1', count: 1 },
    { container: 'q2', count: 4 },
    { container: 'q3', count: 4 },
    { container: 'q4', count: 4 }
];

// --- 1. INICIALIZACIÓN ---
function initDOM() {
    let globalIndex = 0;

    layoutMap.forEach(section => {
        const container = document.getElementById(section.container);
        
        for (let i = 0; i < section.count; i++) {
            if (globalIndex >= videoIds.length) break;

            // Wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            wrapper.id = `wrapper-${globalIndex}`;
            
            // Player Container
            const videoDiv = document.createElement('div');
            videoDiv.id = `player-${globalIndex}`;
            
            // Botón de Pánico (Recarga)
            const reloadBtn = document.createElement('button');
            reloadBtn.className = 'reload-btn';
            reloadBtn.innerHTML = '↻'; // Símbolo de recarga
            reloadBtn.title = "Recargar Stream (Pánico)";
            // Closure para capturar índice
            const idx = globalIndex; 
            reloadBtn.onclick = (e) => { e.stopPropagation(); reloadVideo(idx); };

            // Overlay de Eventos
            const overlay = document.createElement('div');
            overlay.className = 'event-overlay';
            overlay.title = "Doble Click: Fullscreen | Ctrl+Click: Audio | Shift+Click: Swap";
            
            overlay.addEventListener('dblclick', () => handleFullScreen(wrapper));
            overlay.addEventListener('click', (e) => handleClick(e, idx));

            wrapper.appendChild(videoDiv);
            wrapper.appendChild(overlay);
            wrapper.appendChild(reloadBtn);
            container.appendChild(wrapper);

            globalIndex++;
        }
    });

    // Evento botón Patrulla
    patrolBtn.addEventListener('click', togglePatrol);
}

function onYouTubeIframeAPIReady() {
    startBtn.addEventListener('click', () => {
        startOverlay.style.display = 'none';
        initializePlayers();
    });
}

// --- 2. GESTIÓN DE REPRODUCTORES ---
function initializePlayers() {
    // Limpiar array previo si hubiera
    players = []; 
    videoIds.forEach((vidId, index) => {
        createSinglePlayer(index, vidId);
    });
}

function createSinglePlayer(index, vidId) {
    // Si ya existe, nos aseguramos de destruirlo antes
    if(players[index]) {
        try { players[index].destroy(); } catch(e){}
    }

    players[index] = new YT.Player(`player-${index}`, {
        height: '100%', width: '100%',
        videoId: vidId,
        playerVars: {
            'autoplay': 1, 'controls': 0, 'disablekb': 1,
            'modestbranding': 1, 'rel': 0, 'mute': 1,
            'playsinline': 1
        },
        events: {
            'onReady': (e) => onPlayerReady(e, index),
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event, index) {
    event.target.playVideo();
    // Al inicio, solo el 0 tiene audio
    if (index === 0 && !isPatrolActive) {
        setAudioTo(0);
    }
}

function onPlayerStateChange(event) {
    // Loop infinito si termina el video
    if (event.data === YT.PlayerState.ENDED) {
        event.target.playVideo();
    }
}

// --- 3. LÓGICA DE CONTROL ---

// Manejador central de Clicks
function handleClick(event, index) {
    // Si estamos en modo patrulla, cualquier interacción manual lo desactiva
    if (isPatrolActive) togglePatrol();

    // SHIFT + CLICK: SWAP (Intercambio)
    if (event.shiftKey && index !== 0) {
        event.preventDefault();
        swapVideos(0, index);
        return;
    }

    // CTRL + CLICK: AUDIO
    if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        setAudioTo(index);
    }
}

// Cambiar audio y borde visual
function setAudioTo(index) {
    activeIndex = index;
    
    players.forEach(p => {
        if(p && typeof p.mute === 'function') p.mute();
    });

    if(players[index] && typeof players[index].unMute === 'function') {
        players[index].unMute();
        players[index].setVolume(100);
    }

    updateVisuals(index);
}

function updateVisuals(activeIdx) {
    document.querySelectorAll('.video-wrapper').forEach(w => w.classList.remove('audio-active'));
    const activeWrapper = document.getElementById(`wrapper-${activeIdx}`);
    if(activeWrapper) activeWrapper.classList.add('audio-active');
}

// --- 4. FEATURES AVANZADAS ---

// Feature: SWAP (Intercambio)
function swapVideos(idxA, idxB) {
    console.log(`Swapping video ${idxA} <-> ${idxB}`);
    
    // 1. Intercambiar IDs en el array
    const temp = videoIds[idxA];
    videoIds[idxA] = videoIds[idxB];
    videoIds[idxB] = temp;

    // 2. Recrear reproductores
    createSinglePlayer(idxA, videoIds[idxA]);
    createSinglePlayer(idxB, videoIds[idxB]);

    // 3. Restaurar audio al principal tras breve delay
    setTimeout(() => setAudioTo(0), 800);
}

// Feature: PÁNICO (Recarga Individual)
function reloadVideo(index) {
    console.log("Reloading stream:", index);
    const p = players[index];
    if (p && typeof p.loadVideoById === 'function') {
        // Forzamos recarga del mismo ID
        p.loadVideoById(videoIds[index]);
    } else {
        // Fallback drástico: recrear
        createSinglePlayer(index, videoIds[index]);
    }
}

// Feature: PATRULLA (Auto-Scan)
function togglePatrol() {
    isPatrolActive = !isPatrolActive;
    
    if (isPatrolActive) {
        patrolBtn.classList.add('active');
        patrolBtn.innerHTML = '<span class="indicator"></span> PATRULLA ON';
        // Iniciar intervalo (10 segundos)
        patrolInterval = setInterval(nextPatrolStep, 10000);
        // Ejecutar primer paso ya
        nextPatrolStep();
    } else {
        patrolBtn.classList.remove('active');
        patrolBtn.innerHTML = '<span class="indicator"></span> MODO PATRULLA';
        clearInterval(patrolInterval);
    }
}

function nextPatrolStep() {
    let nextIndex = activeIndex + 1;
    if (nextIndex >= videoIds.length) nextIndex = 0;
    setAudioTo(nextIndex);
}

// --- 5. FULLSCREEN ---
function handleFullScreen(element) {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}

// Arrancar
initDOM();