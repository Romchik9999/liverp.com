const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Базовое значение онлайна
let currentOnline = 3450;

io.on('connection', (socket) => {
    // Когда игрок заходит на сайт, отправляем ему текущий онлайн
    socket.emit('init-data', { online: currentOnline });

    socket.on('disconnect', () => {
        // Пользователь закрыл вкладку
    });
});

// Имитация "живого" изменения онлайна для красоты (каждые 10 секунд)
// В будущем замени это на реальный запрос к серверу GTA 5
setInterval(() => {
    // Случайное изменение онлайна (от -2 до +2 человек)
    const change = Math.floor(Math.random() * 5) - 2;
    currentOnline += change;
    
    // Лимиты, чтобы онлайн не ушел в минус или выше слотов
    if (currentOnline < 0) currentOnline = 0;
    if (currentOnline > 1000) currentOnline = 1000;

    // Отправляем новые данные всем, кто сейчас сидит на сайте
    io.emit('online-update', { online: currentOnline });
}, 10000);

// Запуск сервера на порту 80 (стандартный HTTP-порт)
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`Сайт успешно запущен на порту ${PORT}`);
});