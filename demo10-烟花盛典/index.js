/**
 * @author    hec9527
 * @time      2020-1-11
 * @change    2020-1-11
 */

/**
 * 爆炸粒子效果
 */
class Fragement {
    // items, basePos, color, radius, friction
    constructor(option = {}) {
        Object.assign(this, option);

        const mass = this.radius * 300;

        const x = Math.random() * mass - mass / 2;
        const y = Math.random() * (mass - Math.abs(x)) - (mass - Math.abs(x)) / 2;

        this.items.add(this);

        this.x = this.basePos.x + x;
        this.y = this.basePos.y + y;

        this.light = option.light || Math.random() * 30 + 70;
        this.speedY = Math.random() * 0.3 + 0.5;

        this.ticks = 0;

        this.radius = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.ticks++;

        this.radius -= 0.001;
        this.speedY -= 0.01;
        this.y += this.speedY;

        if (this.ticks >= 40) {
            this.items.delete(this);
        }
    }

    render() {
        if (Math.random() < 0.5) return; // 闪烁效果
        this.ctx.beginPath();
        this.ctx.fillStyle = `hsl(${this.color}, 100%, ${this.light}%)`;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

/**
 * 粒子下坠
 */
class fragementDrop {
    // items, basePos, color, radius, friction
    constructor(option = {}) {
        Object.assign(this, option);

        const mass = this.radius * 3 + 3;
        const speedX = Math.random() * mass - mass / 2;
        const speedY = Math.random() * (mass - Math.abs(speedX)) - (mass - Math.abs(speedX)) / 2;

        this.items.add(this);

        // 其它属性
        this.x = this.basePos.x;
        this.y = this.basePos.y;

        this.speed = { x: speedX, y: speedY };

        this.light = Math.random() * 30 + 70;

        this.lastPos = { x: this.x, y: this.y };
    }

    die() {
        this.items.delete(this);
    }

    update() {
        if (this.radius < 0.015 || this.light <= 1) return this.die();

        this.lastPos = { x: this.x, y: this.y };

        // 更新位置
        this.x += this.speed.x;
        this.y += this.speed.y;

        // 更新速度
        this.speed.y += 0.02;
        this.speed.y *= this.friction ** 2;
        this.speed.x *= this.friction ** 2;

        // 更新亮度
        this.light -= 0.04;

        // 更新大小
        this.radius -= 0.012;
    }

    render() {
        this.ctx.beginPath();
        this.ctx.fillStyle = `hsl(${this.color}, 100%, ${this.light}%)`;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

/**
 * 烟花
 */
class Fireworks {
    constructor(word) {
        this.word = word;
        setTimeout(() => this.word.items.add(this), Math.random() * 1000);

        // 基础属性
        this.x = Math.random() * this.word.width;
        this.y = this.word.height + Math.random() * 50 + 30;

        this.lastPos = { x: this.x, y: this.y };
        this.terminalPos = (Math.random() * this.word.height) / 3 + this.word.height / 5;

        this.color_hue = Math.random() * 360; // 色相
        this.color_sat = Math.random() * 30 + 70;

        this.radius = Math.random() * 3 + 5;
        this.radius_explode = ((Math.random() * this.word.width + 200) / 2) | 0; // 爆炸范围

        this.fragementDrop = Math.random() < 0.7 ? true : false;

        this.speed = {
            x: Math.random() < 0.5 ? Math.random() * 0.5 + 0.3 : -(Math.random() * 0.5 + 0.2),
            y: -(Math.random() * 5 + 8)
        };
    }

    explode() {
        new Fireworks(this.word);
        for (let i = 0, len = (Math.random() * this.radius * 30 + 40) | 0; i < len; i++) {
            if (this.fragementDrop) {
                new fragementDrop({
                    items: this.word.items,
                    basePos: { x: this.x, y: this.y },
                    color: this.color_hue,
                    radius: this.radius / 5,
                    friction: this.word.config.friction,
                    ctx: this.word.ctx
                });
            } else {
                new Fragement({
                    items: this.word.items,
                    basePos: { x: this.x, y: this.y },
                    color: this.color_hue,
                    radius: this.radius / 7,
                    friction: this.word.config.friction,
                    ctx: this.word.ctx
                });
            }
        }
        this.word.items.delete(this);
    }

    update() {
        this.lastPos = { x: this.x, y: this.y };

        if (this.y <= this.terminalPos) this.explode();

        // 更新位置
        this.x += this.speed.x;
        this.y += this.speed.y;

        // 更新速度
        this.speed.x *= this.word.config.friction;
        this.speed.y *= this.word.config.friction;

        // 更新颜色
        this.color_sat -= 0.5;
    }

    render() {
        const ctx = this.word.ctx;

        ctx.beginPath();
        ctx.lineWidth = this.radius;
        ctx.lineCap = 'round';
        ctx.strokeStyle = `hsl(${this.color_hue}, ${this.color_sat}%, 50%)`;
        ctx.moveTo(this.lastPos.x, this.lastPos.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

/**
 * 世界
 */
class Word {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.items = new Set();
        this.config = {
            fireworkNum: 7, // 烟花数量
            friction: 0.995 // 摩擦系数
        };

        this.resize();
        this.render();

        // 事件监听
        window.addEventListener('resize', this.resize);

        // 添加烟花
        for (let i = 0; i < this.config.fireworkNum; i++) {
            new Fireworks(this);
        }
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        Array.from(this.items).forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
