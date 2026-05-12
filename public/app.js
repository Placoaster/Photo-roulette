const socket = io();
let miPin = "";

function unirse() {
    const nombre = document.getElementById('input-nombre').value;
    miPin = document.getElementById('input-pin').value;
    
    if(!nombre || !miPin) return alert("Rellena todo");

    socket.emit('unirse-sala', { pin: miPin, nombre });
    document.getElementById('pantalla-login').classList.add('hidden');
    document.getElementById('pantalla-juego').classList.remove('hidden');
}

function iniciarRonda() {
    socket.emit('iniciar-ronda', miPin);
}

socket.on('pedir-foto', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (e) => {
        const archivos = e.target.files;
        const elegido = archivos[Math.floor(Math.random() * archivos.length)];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            socket.emit('enviar-foto', { pin: miPin, foto: event.target.result });
        };
        reader.readAsDataURL(elegido);
    };
    input.click();
});

socket.on('nueva-ronda', (foto) => {
    document.getElementById('espera').classList.add('hidden');
    const img = document.getElementById('foto-pantalla');
    img.src = foto;
    img.classList.add('blur-3xl');
    
    // El efecto de enfoque lento
    setTimeout(() => {
        img.classList.remove('blur-3xl');
    }, 100);
});