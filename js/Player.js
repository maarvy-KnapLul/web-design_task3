class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.gravity = 0.5;
        this.onGround = false;
        this.health = 100;
        this.color = '#FFD700';
        
        // Флаги для управления
        this.moveLeftFlag = false;
        this.moveRightFlag = false;
        this.jumpFlag = false;
    }
    
    moveLeft() {
        this.moveLeftFlag = true;
    }
    
    moveRight() {
        this.moveRightFlag = true;
    }
    
    jump() {
        // Проверяем, что игрок на земле и не в прыжке
        if (this.onGround && !this.jumpFlag) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.jumpFlag = true;
        }
    }
    
    stopLeft() {
        this.moveLeftFlag = false;
    }
    
    stopRight() {
        this.moveRightFlag = false;
    }
    
    stopJump() {
        this.jumpFlag = false;
    }
    
    update() {
        // Обработка движения влево/вправо
        if (this.moveLeftFlag) {
            this.velocityX = -this.speed;
        } else if (this.moveRightFlag) {
            this.velocityX = this.speed;
        } else {
            // Трение
            this.velocityX *= 0.8;
        }
        
        // Применяем гравитацию
        this.velocityY += this.gravity;
        
        // Обновляем позицию
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Границы экрана
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        if (this.x + this.width > 800) {
            this.x = 800 - this.width;
            this.velocityX = 0;
        }
        
        // Не даем игроку улететь вверх слишком высоко
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Рисуем глаза
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 5, this.y + 10, 5, 5);
        ctx.fillRect(this.x + 20, this.y + 10, 5, 5);
        
        // Рисуем рот (улыбку)
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.arc(this.x + 15, this.y + 25, 5, 0, Math.PI);
        ctx.stroke();
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
}