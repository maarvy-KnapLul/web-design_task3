class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = new Player(100, 300);
        // ВАЖНО: Передаем player в InputHandler
        this.input = new InputHandler(this.player);
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.score = 0;
        this.level = 1;
        this.gameState = 'menu'; // menu, playing, paused, gameOver, victory
        this.isRunning = false;
        
        this.initLevel();
    }
    
    initLevel() {
        // Базовые платформы для каждого уровня
        const levelPlatforms = {
            1: [
                new Platform(0, 350, 800, 50), // Пол
                new Platform(200, 250, 100, 20),
                new Platform(400, 200, 100, 20),
                new Platform(600, 150, 100, 20)
            ],
            2: [
                new Platform(0, 350, 800, 50),
                new Platform(150, 280, 80, 20),
                new Platform(300, 220, 80, 20),
                new Platform(450, 160, 80, 20),
                new Platform(600, 100, 80, 20)
            ],
            3: [
                new Platform(0, 350, 800, 50),
                new Platform(100, 280, 100, 20),
                new Platform(250, 220, 100, 20),
                new Platform(400, 280, 100, 20),
                new Platform(550, 220, 100, 20),
                new Platform(700, 280, 100, 20)
            ]
        };
        
        this.platforms = levelPlatforms[this.level] || levelPlatforms[1];
        
        // Создаем монеты
        this.coins = [];
        this.platforms.forEach(platform => {
            if (platform !== this.platforms[0]) { // Не на полу
                this.coins.push({
                    x: platform.x + platform.width / 2 - 10,
                    y: platform.y - 25,
                    width: 20,
                    height: 20,
                    collected: false
                });
            }
        });
    }
    
    start() {
        this.gameState = 'playing';
        this.isRunning = true;
        document.getElementById('pauseBtn').disabled = false;
    }
    
    pause() {
        this.gameState = this.gameState === 'playing' ? 'paused' : 'playing';
        document.getElementById('pauseBtn').textContent = 
            this.gameState === 'paused' ? 'Продолжить' : 'Пауза';
    }
    
    restart() {
        this.player = new Player(100, 300);
        // ВАЖНО: Обновляем ссылку на игрока в InputHandler
        this.input.player = this.player;
        this.score = 0;
        this.level = 1;
        this.gameState = 'playing';
        this.isRunning = true;
        this.initLevel();
        this.updateUI();
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Пауза';
    }
    
    nextLevel() {
        this.level++;
        this.player = new Player(100, 300);
        // ВАЖНО: Обновляем ссылку на игрока в InputHandler
        this.input.player = this.player;
        this.initLevel();
        this.updateUI();
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Сохраняем предыдущее состояние для проверки коллизий
        const previousOnGround = this.player.onGround;
        this.player.onGround = false;
        
        // Обновление игрока (теперь движение обрабатывается внутри Player.update)
        this.player.update();
        
        // Проверка коллизий с платформами
        this.platforms.forEach(platform => {
            Collision.handlePlatformCollision(this.player, platform);
        });
        
        // Проверка коллизий с монетами
        this.coins.forEach(coin => {
            if (!coin.collected && Collision.checkCollision(this.player, coin)) {
                coin.collected = true;
                this.score += 10;
                this.updateUI();
            }
        });
        
        // Проверка завершения уровня
        if (this.coins.every(coin => coin.collected)) {
            if (this.level < 3) {
                this.nextLevel();
            } else {
                this.gameState = 'victory';
            }
        }
        
        // Проверка падения с карты
        if (this.player.y > 400) {
            this.player.takeDamage(10);
            this.player.x = 100;
            this.player.y = 300;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            this.updateUI();
            
            if (this.player.health <= 0) {
                this.gameState = 'gameOver';
            }
        }
    }
    
    draw() {
        // Очистка canvas
        this.ctx.clearRect(0, 0, 800, 400);
        
        // Рисуем фон
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, 800, 400);
        
        // Рисуем платформы
        this.platforms.forEach(platform => platform.draw(this.ctx));
        
        // Рисуем монеты
        this.coins.forEach(coin => {
            if (!coin.collected) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#B8860B';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Добавляем блеск
                this.ctx.fillStyle = '#FFF';
                this.ctx.beginPath();
                this.ctx.arc(coin.x + 5, coin.y + 5, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Рисуем игрока
        this.player.draw(this.ctx);
        
        // Рисуем информационные сообщения
        if (this.gameState === 'paused') {
            this.drawMessage('ПАУЗА', 'Нажмите "Продолжить"');
        } else if (this.gameState === 'gameOver') {
            this.drawMessage('ИГРА ОКОНЧЕНА', 'Нажмите "Рестарт"');
        } else if (this.gameState === 'victory') {
            this.drawMessage('ПОБЕДА!', 'Вы прошли все уровни!');
        } else if (this.gameState === 'menu') {
            this.drawMessage('ПЛАТФОРМЕР', 'Нажмите "Старт" для начала игры');
        }
    }
    
    drawMessage(title, subtitle) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(200, 150, 400, 100);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, 400, 200);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText(subtitle, 400, 230);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('level').textContent = this.level;
    }
}