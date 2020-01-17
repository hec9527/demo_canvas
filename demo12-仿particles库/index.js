/**
 * 粒子类
 */
class Particles {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.x = this.word.click ? this.word.mouse.x : Math.random() * this.word.width;
        this.y = this.word.click ? this.word.mouse.y : Math.random() * this.word.height;
        this.radius = Math.random() * 2 + 2;
        this.speed = {
            x: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -(Math.random() * 1 + 0.1),
            y: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -(Math.random() * 1 + 0.1)
        };
    }

    render() {
        // 工具函数
        const ctx = this.word.ctx;
        const getDistence = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        const drawLine = (p1, p2, color) => {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color;
            ctx.stroke();
        };

        // 位置更新
        this.x += this.speed.x;
        this.y += this.speed.y;

        // 边缘检测
        if ((this.x < 0 && this.speed.x < 0) || (this.x > this.word.width && this.speed.x > 0)) {
            this.speed.x = -this.speed.x;
        }
        if ((this.y < 0 && this.speed.y < 0) || (this.y > this.word.height && this.speed.y > 0)) {
            this.speed.y = -this.speed.y;
        }

        // 距离检测
        this.word.items.forEach(item => {
            if (item !== this) {
                const distence = getDistence(this, item);
                if (distence <= this.word.linkDistence) {
                    drawLine(this, item, '#4fb0c610');
                }
            }
        });

        // 连线到鼠标
        if (getDistence(this.word.mouse, { x: this.x, y: this.y }) <= this.word.linkDistence) {
            drawLine(this.word.mouse, { x: this.x, y: this.y }, '#4fb0c67f');
        }

        // 绘制自身
        ctx.drawImage(
            this.word.img,
            this.x - this.radius / 2,
            this.y - this.radius / 2,
            this.radius,
            this.radius
        );
    }
}

/**
 * 世界类
 */
class Word {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineWdith = 0.1;

        // 基础属性
        this.img = this.getDot();
        this.items = [];
        this.mouse = {};
        this.linkDistence = 120; // 连线距离
        this.particlesNum = 300; // 粒子数量
        this.lineColor = '#4fb0c6'; // 线条颜色

        // 事件监听
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousedown', () => {
            this.click = true;
            new Particles(this);
            new Particles(this);
            new Particles(this);
            this.click = false;
        });
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
        });

        // 调用自身
        this.resize();
        this.render();

        // 生成粒子
        for (let i = 0; i < this.particlesNum; i++) {
            new Particles(this);
        }
    }

    getDot() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;

        const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
        gradient.addColorStop(0.04, '#4fb0c669');
        gradient.addColorStop(0.2, '#4fb0c650');
        gradient.addColorStop(0.6, '#4fb0c610');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        this.ctx.fillStyle = '#0303035f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.items.forEach(item => item.render());

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
