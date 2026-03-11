class InputHandler {
    constructor(player) {
        this.player = player;
        this.keys = {};
        
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            
            // Предотвращаем прокрутку страницы при нажатии на стрелки и пробел
            if (key === ' ' || key === 'Spacebar' || key === 'Space' ||
                key === 'ArrowUp' || key === 'ArrowDown' || 
                key === 'ArrowLeft' || key === 'ArrowRight' ||
                key === 'w' || key === 'a' || key === 's' || key === 'd') {
                e.preventDefault();
            }
            
            // Движение влево
            if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
                this.player.moveLeft();
            }
            
            // Движение вправо
            if (key === 'ArrowRight' || key === 'd' || key === 'D') {
                this.player.moveRight();
            }
            
            // Прыжок
            if (key === ' ' || key === 'Spacebar' || key === 'Space' || 
                key === 'w' || key === 'W' || key === 'ArrowUp') {
                this.player.jump();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const key = e.key;
            
            // Остановка движения влево
            if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
                this.player.stopLeft();
            }
            
            // Остановка движения вправо
            if (key === 'ArrowRight' || key === 'd' || key === 'D') {
                this.player.stopRight();
            }
            
            // Сброс флага прыжка
            if (key === ' ' || key === 'Spacebar' || key === 'Space' || 
                key === 'w' || key === 'W' || key === 'ArrowUp') {
                this.player.stopJump();
            }
        });
    }
}