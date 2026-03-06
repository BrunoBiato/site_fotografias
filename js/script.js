
const btnClose = document.getElementById('btn-fechar');
const janelaPrincipal = document.getElementById('janela-principal');
const msgFechado = document.getElementById('msg-fechado');
const btnRecarregar = document.getElementById('btn-recarregar');

if (btnClose && janelaPrincipal) {
    btnClose.addEventListener('click', () => {
        janelaPrincipal.style.display = 'none';
        msgFechado.style.display = 'block';
    });
}

if (btnRecarregar) {
    btnRecarregar.addEventListener('click', () => {
        janelaPrincipal.style.display = 'flex';
        msgFechado.style.display = 'none';
    });
}


const audio = document.getElementById('bg-audio');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');

if(btnPlay && audio) {
    btnPlay.addEventListener('click', () => {
        
        audio.play().catch(e => alert("Coloque o ficheiro de áudio correto na pasta para tocar!"));
    });
}

if(btnPause && audio) {
    btnPause.addEventListener('click', () => {
        audio.pause();
    });
}