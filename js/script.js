setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if(loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); 
    }
}, 3000); 

setTimeout(() => {
    const clippyCont = document.getElementById('clippy-container');
    if (clippyCont) clippyCont.classList.add('clippy-show');
}, 3500);

function atualizarRelogio() {
    const agora = new Date();
    let horas = agora.getHours();
    let minutos = agora.getMinutes();
    horas = horas < 10 ? '0' + horas : horas;
    minutos = minutos < 10 ? '0' + minutos : minutos;
    const clockElem = document.getElementById('clock');
    if(clockElem) clockElem.textContent = horas + ':' + minutos;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

const btnIniciar = document.getElementById('btn-iniciar');
const startMenu = document.getElementById('start-menu');

if (btnIniciar && startMenu) {
    btnIniciar.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });
}

document.addEventListener('click', (e) => {
    if(startMenu && !startMenu.contains(e.target) && e.target !== btnIniciar) {
        startMenu.style.display = 'none';
    }
});

window.fecharStartMenu = function() {
    if(startMenu) startMenu.style.display = 'none';
}

let zIndexCounter = 100;

window.trazerParaFrente = function(janela) {
    zIndexCounter++;
    janela.style.zIndex = zIndexCounter;
}

window.abrirJanela = function(idJanela, idIcone = null) {
    const janela = document.getElementById(idJanela);
    if (janela) {
        janela.style.display = 'flex';
        janela.classList.remove('popup-active');
        setTimeout(() => {
            janela.classList.add('popup-active');
        }, 10);
        trazerParaFrente(janela);
        
        if (idIcone) {
            const imgElement = document.querySelector(`#${idIcone} img`);
            if (imgElement && imgElement.dataset.aberta) {
                imgElement.src = imgElement.dataset.aberta;
            }
            janela.dataset.iconeLigado = idIcone; 
        }

        animarClippyAcao('abrir');
    }
}

const audioPasta = new Audio('assets/songs/clique.mp3');
audioPasta.preload = 'auto';

window.tocarSomPasta = function() {
    const somRapido = audioPasta.cloneNode();
    somRapido.play().catch(() => {});
}

window.fecharJanela = function(idJanela) {
    const janela = document.getElementById(idJanela);
    if (janela) {
        janela.classList.remove('popup-active');
        setTimeout(() => {
            janela.style.display = 'none';
        }, 250); 
        
        const idIcone = janela.dataset.iconeLigado;
        if (idIcone) {
            const imgElement = document.querySelector(`#${idIcone} img`);
            if (imgElement && imgElement.dataset.fechada) {
                imgElement.src = imgElement.dataset.fechada;
            }
        }

        if(idJanela === 'janela-player') {
            const audio = document.getElementById('bg-audio');
            if(audio) audio.pause();
        }

        animarClippyAcao('fechar');
    }
}

const janelas = document.querySelectorAll('.xp-window, .xp-player');
janelas.forEach(janela => {
    janela.addEventListener('mousedown', () => trazerParaFrente(janela));
    janela.addEventListener('touchstart', () => trazerParaFrente(janela), {passive: true});
});

const playlistMusicas = [
    'euphoria.mp3',
    'reflections.mp3'
];

let indiceMusicaAtual = 0;

const audio = document.getElementById('bg-audio');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const songTitle = document.getElementById('song-title');

function carregarMusica(index) {
    if(audio && playlistMusicas.length > 0) {
        const nomeArquivo = playlistMusicas[index];
        const source = audio.querySelector('source');
        source.src = 'assets/songs/' + nomeArquivo; 
        
        if(songTitle) {
            songTitle.textContent = "A reproduzir: " + nomeArquivo;
        }
        audio.load();
    }
}

if(btnPlay && audio) {
    btnPlay.addEventListener('click', () => {
        audio.play().catch(() => {});
    });
}

if(btnPause && audio) {
    btnPause.addEventListener('click', () => {
        audio.pause();
    });
}

if(btnNext) {
    btnNext.addEventListener('click', () => {
        indiceMusicaAtual = (indiceMusicaAtual + 1) % playlistMusicas.length;
        carregarMusica(indiceMusicaAtual);
        if (!audio.paused) audio.play();
        animarClippyAcao('musica'); 
    });
}

if(btnPrev) {
    btnPrev.addEventListener('click', () => {
        indiceMusicaAtual = (indiceMusicaAtual - 1 + playlistMusicas.length) % playlistMusicas.length;
        carregarMusica(indiceMusicaAtual);
        if (!audio.paused) audio.play();
        animarClippyAcao('musica'); 
    });
}

carregarMusica(0);

const clippyContainer = document.getElementById('clippy-container');
const clippyBubble = document.getElementById('clippy-bubble');
const clippyText = document.getElementById('clippy-text');
const clippyOptions = document.getElementById('clippy-options');
const clippyImg = document.getElementById('clippy-img');
const clippyNotif = document.getElementById('clippy-notif');

let clippyTimeout;
let clippyState = 'idle'; 

const audioBalao = new Audio('assets/songs/balao.mp3');
audioBalao.preload = 'auto';

window.animarClippyAcao = function(acao) {
    if(!clippyImg) return;
    
    clippyImg.className = 'clippy-img';
    void clippyImg.offsetWidth; 
    
    if(acao === 'abrir') clippyImg.classList.add('anim-jump');
    else if(acao === 'arrastar') clippyImg.classList.add('anim-shake');
    else if(acao === 'musica') clippyImg.classList.add('anim-think');
    else if(acao === 'fechar') clippyImg.classList.add('anim-nod');
}

window.chamarClippy = function() {
    if(clippyContainer) {
        clippyContainer.classList.add('clippy-show');
        abrirMenuClippy();
    }
}

window.abrirMenuClippy = function() {
    clearTimeout(clippyTimeout); 
    clippyState = 'menu';
    if(clippyNotif) clippyNotif.style.display = "none"; 
    
    if(clippyText) clippyText.textContent = "Como posso ajudar você hoje?";
    if(clippyOptions) clippyOptions.style.display = "block";
    if(clippyBubble) clippyBubble.style.display = "block";
    animarClippyAcao('abrir');
};

window.acaoClippy = function(acao) {
    if(clippyOptions) clippyOptions.style.display = "none";
    
    if(acao === 'sobre') {
        clippyText.textContent = "Este é o portfólio do Bruno! Clique nas pastas na área de trabalho para explorar.";
        clippyState = 'tip';
        animarClippyAcao('abrir');
        esconderClippyAposTempo(4000);
    } else if(acao === 'musica') {
        clippyText.textContent = "Ótima escolha! Abrindo o Media Player para você...";
        abrirJanela('janela-player', 'icon-player');
        clippyState = 'tip';
        esconderClippyAposTempo(3000);
    } else if(acao === 'esconder') {
        animarClippyAcao('fechar');
        clippyState = 'idle';
        if(clippyBubble) clippyBubble.style.display = "none";
    }
};

function esconderClippyAposTempo(ms = 3000) {
    clearTimeout(clippyTimeout);
    clippyTimeout = setTimeout(() => {
        if(clippyState === 'tip') {
            if(clippyBubble) clippyBubble.style.display = 'none';
        }
    }, ms);
}

if (clippyContainer) {
    clippyContainer.addEventListener('mouseenter', () => {
        if (clippyState === 'tip') {
            clearTimeout(clippyTimeout);
            if(clippyBubble) clippyBubble.style.display = 'block';
        }
    });

    clippyContainer.addEventListener('mouseleave', () => {
        if (clippyState === 'tip' && clippyBubble.style.display === 'block') {
            esconderClippyAposTempo(3000); 
        }
    });
}

document.addEventListener('mousedown', (e) => {
    if (clippyContainer && !clippyContainer.contains(e.target)) {
        if (clippyBubble && clippyBubble.style.display === 'block') {
            clippyBubble.style.display = 'none';
            if (clippyState === 'menu') clippyState = 'idle';
        }
    }
});

window.mostrarDicaClippy = function() {
    if(!clippyBubble || !clippyText || !clippyOptions || !clippyContainer.classList.contains("clippy-show")) return;
    
    if(clippyState === 'menu') return; 
    
    const dicas = [
        "Ei! Sabia que você pode clicar no Media Player e colocar algumas músicas legais?",
        "Experimente arrastar as janelas clicando e segurando na barra azul superior!",
        "Não esqueça de dar uma olhada nas minhas Fotografias. Tem coisas incríveis lá!",
        "O menu Iniciar lá em baixo à esquerda está funcionando. Já clicou nele?",
        "Dica de ouro: Se você abrir várias janelas, elas ficam umas sobre as outras. Legal, né?",
        "Você pode clicar em mim a qualquer momento para abrir as minhas opções!"
    ];
    
    clippyText.textContent = dicas[Math.floor(Math.random() * dicas.length)];
    clippyOptions.style.display = "none";
    clippyBubble.style.display = 'block';
    
    if(clippyNotif) clippyNotif.style.display = 'block'; 
    
    clippyState = 'tip';
    animarClippyAcao('abrir');
    audioBalao.cloneNode().play().catch(() => {});

    esconderClippyAposTempo(3000); 
}

setTimeout(mostrarDicaClippy, 6000); 
setInterval(mostrarDicaClippy, 15000);

let isDraggingWindow = false;
let dragTarget = null;
let winStartX, winStartY, winInitialLeft, winInitialTop;

function tornarArrastavel(elementoJanela) {
    const barraTitulo = elementoJanela.querySelector('.xp-titlebar');
    if (!barraTitulo) return;

    barraTitulo.addEventListener('mousedown', (e) => {
        isDraggingWindow = true;
        dragTarget = elementoJanela;
        winStartX = e.clientX;
        winStartY = e.clientY;
        winInitialLeft = elementoJanela.offsetLeft;
        winInitialTop = elementoJanela.offsetTop;
        
        trazerParaFrente(elementoJanela);
        animarClippyAcao('arrastar'); 
        e.preventDefault(); 
    });
}

document.querySelectorAll('.window-draggable').forEach(janela => {
    if(janela.id !== 'clippy-container') {
        tornarArrastavel(janela);
    }
});

window.addEventListener('mousemove', (e) => {
    if (isDraggingWindow && dragTarget) {
        e.preventDefault();
        let dx = e.clientX - winStartX;
        let dy = e.clientY - winStartY;

        let novoTopo = winInitialTop + dy;
        let novoEsquerda = winInitialLeft + dx;

        if (novoTopo < 0) novoTopo = 0; 

        dragTarget.style.top = novoTopo + "px";
        dragTarget.style.left = novoEsquerda + "px";
    }
});

window.addEventListener('mouseup', () => {
    isDraggingWindow = false;
    dragTarget = null;
});

let isClippyDragging = false;
let hasMovedClippy = false;
let clippyStartX, clippyStartY, clippyInitialLeft, clippyInitialTop;

if (clippyImg && clippyContainer) {
    clippyImg.addEventListener('mousedown', (e) => {
        isClippyDragging = true;
        hasMovedClippy = false;
        clippyStartX = e.clientX;
        clippyStartY = e.clientY;
        clippyInitialLeft = clippyContainer.offsetLeft;
        clippyInitialTop = clippyContainer.offsetTop;
        e.preventDefault(); 
    });

    window.addEventListener('mousemove', (e) => {
        if (isClippyDragging) {
            let dx = e.clientX - clippyStartX;
            let dy = e.clientY - clippyStartY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMovedClippy = true;
            }

            if (hasMovedClippy) {
                let novoTopoClippy = clippyInitialTop + dy;
                let novoEsquerdaClippy = clippyInitialLeft + dx;

                if (novoTopoClippy < 0) novoTopoClippy = 0;

                clippyContainer.style.top = novoTopoClippy + "px";
                clippyContainer.style.left = novoEsquerdaClippy + "px";
                clippyContainer.style.bottom = "auto";
                clippyContainer.style.right = "auto";
            }
        }
    });

    window.addEventListener('mouseup', () => {
        if (isClippyDragging) {
            isClippyDragging = false;
            if (!hasMovedClippy) {
                abrirMenuClippy(); 
            }
        }
    });
}

let idleTime = 0;
let screensaverActive = false;
let ssX = 0, ssY = 0, ssDx = 2, ssDy = 2;
let reqAnim = null;
const ssElement = document.getElementById('screensaver');
const ssMover = document.getElementById('screensaver-mover');

function resetIdleTimer() {
    idleTime = 0;
    if (screensaverActive) {
        ssElement.style.display = 'none';
        screensaverActive = false;
        if(reqAnim) cancelAnimationFrame(reqAnim);
    }
}

document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('mousedown', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('touchstart', resetIdleTimer);

setInterval(() => {
    idleTime++;
    if (idleTime >= 30 && !screensaverActive) {
        ssElement.style.display = 'block';
        screensaverActive = true;
        
        ssX = Math.random() * (window.innerWidth - 200);
        ssY = Math.random() * (window.innerHeight - 100);
        
        animarScreensaver();
    }
}, 1000);

function animarScreensaver() {
    if (!screensaverActive || !ssMover) return;
    
    const rect = ssMover.getBoundingClientRect();
    
    ssX += ssDx;
    ssY += ssDy;
    
    if (ssX + rect.width >= window.innerWidth || ssX <= 0) ssDx = -ssDx;
    if (ssY + rect.height >= window.innerHeight || ssY <= 0) ssDy = -ssDy;
    
    ssMover.style.left = ssX + 'px';
    ssMover.style.top = ssY + 'px';
    
    reqAnim = requestAnimationFrame(animarScreensaver);
}
