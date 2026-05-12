const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: "*" },
    maxHttpBufferSize: 1e7 // Permite fotos de hasta 10MB
});

app.use(express.static(path.join(__dirname, 'public')));

let salas = {};

io.on('connection', (socket) => {
    socket.on('unirse-sala', ({ pin, nombre }) => {
        socket.join(pin);
        if (!salas[pin]) salas[pin] = { jugadores: [] };
        
        salas[pin].jugadores.push({ id: socket.id, nombre, puntos: 0 });
        io.to(pin).emit('actualizar-lista', salas[pin].jugadores);
    });

    socket.on('iniciar-ronda', (pin) => {
        const jugadores = salas[pin].jugadores;
        const elegido = jugadores[Math.floor(Math.random() * jugadores.length)];
        io.to(elegido.id).emit('pedir-foto');
    });

    socket.on('enviar-foto', ({ pin, foto }) => {
        io.to(pin).emit('nueva-ronda', foto);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));