class Collision {
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static handlePlatformCollision(player, platform) {
        if (!Collision.checkCollision(player, platform)) return false;
        
        // Определяем сторону столкновения
        const playerBottom = player.y + player.height;
        const playerTop = player.y;
        const playerRight = player.x + player.width;
        const playerLeft = player.x;
        
        const platformBottom = platform.y + platform.height;
        const platformTop = platform.y;
        const platformRight = platform.x + platform.width;
        const platformLeft = platform.x;
        
        // Вычисляем перекрытия
        const overlapLeft = playerRight - platformLeft;
        const overlapRight = platformRight - playerLeft;
        const overlapTop = playerBottom - platformTop;
        const overlapBottom = platformBottom - playerTop;
        
        // Находим минимальное перекрытие
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        // Применяем коррекцию позиции с небольшим запасом для избежания залипания
        const epsilon = 0.1;
        
        if (minOverlap === overlapTop && player.velocityY >= 0) {
            // Столкновение сверху платформы
            player.y = platformTop - player.height - epsilon;
            player.velocityY = 0;
            player.onGround = true;
            return true;
        } else if (minOverlap === overlapBottom && player.velocityY <= 0) {
            // Столкновение снизу платформы
            player.y = platformBottom + epsilon;
            player.velocityY = 0;
        } else if (minOverlap === overlapLeft && player.velocityX >= 0) {
            // Столкновение слева
            player.x = platformLeft - player.width - epsilon;
            player.velocityX = 0;
        } else if (minOverlap === overlapRight && player.velocityX <= 0) {
            // Столкновение справа
            player.x = platformRight + epsilon;
            player.velocityX = 0;
        }
        
        return false;
    }
}