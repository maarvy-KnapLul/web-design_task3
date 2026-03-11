class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'normal', 'moving', 'breakable'
        this.color = this.getColor();
    }
    
    getColor() {
        switch(this.type) {
            case 'normal': return '#8B4513';
            case 'moving': return '#4CAF50';
            case 'breakable': return '#FF6B6B';
            default: return '#8B4513';
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Добавляем текстуру для платформ
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}