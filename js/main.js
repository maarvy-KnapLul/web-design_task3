document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Элементы управления
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    startBtn.addEventListener('click', () => {
        game.start();
        startBtn.disabled = true;
    });
    
    pauseBtn.addEventListener('click', () => {
        game.pause();
    });
    
    restartBtn.addEventListener('click', () => {
        game.restart();
        startBtn.disabled = true;
    });
    
    // Игровой цикл
    function gameLoop() {
        game.update();
        game.draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Запускаем игровой цикл сразу, но игра будет в состоянии 'menu'
    gameLoop();
    
    // Обновляем UI
    game.updateUI();
});