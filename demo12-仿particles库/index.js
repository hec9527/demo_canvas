/**
 * 粒子类
 */
class Particles {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.x = this.word.click ? this.word.mouse.x : this.getRandomX();
        this.y = this.word.click ? this.word.mouse.y : this.getRandomY();
        this.radius = this.getRandomRadius();
        this.speed = this.getRandomSpeed();

        this.distence = this.word.config.linkDistence;
    }

    getRandomX() {
        return Math.random() * this.word.width;
    }

    getRandomY() {
        return Math.random() * this.word.height;
    }

    getRandomRadius() {
        return Math.random() * 2 + 1.5;
    }

    getRandomSpeed() {
        return {
            x: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -Math.random() * 1 + 0.5,
            y: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -Math.random() * 1 + 0.5
        };
    }

    checkBorder() {
        if (this.x < 0 || this.x > this.word.width) {
            this.speed.x = -this.speed.x;
        }
        if (this.y < 0 || this.y > this.word.height) {
            this.speed.y = -this.speed.y;
        }
    }

    checkDistence() {
        for (let i = 0, len = this.word.items.length; i < len; i++) {
            const item = this.word.items[i];
            if (this !== item) {
                if (this.getDistence(item) < this.distence) {
                    this.lineTo(item);
                }
            }
        }
        if (this.getDistence(this.word.mouse) < this.distence) {
            this.lineTo(this.word.mouse);
        }
    }

    getDistence(particles) {
        return Math.sqrt(Math.pow(this.x - particles.x, 2) + Math.pow(this.y - particles.y, 2));
    }

    lineTo(particles) {
        const ctx = this.word.ctx;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(particles.x, particles.y);
        ctx.lineWdith = this.word.config.lineWidth;
        ctx.strokeStyle = this.word.config.lineColor;
        ctx.stroke();
    }

    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.checkBorder();
        this.checkDistence();
    }

    render() {
        const ctx = this.word.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.word.config.partilceColor;
        ctx.fill();
    }
}

/**
 * 世界类
 */
class Word {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.items = [];
        this.click = false;
        this.mouse = { x: 1, y: 1 };

        // 自定义配置信息
        this.config = {
            linkDistence: 120,
            particlesNum: 220,
            newpraticlesNum: 3,
            lineWidth: 0.5,
            background: '#030303',
            partilceColor: '#4fb0c6',
            lineColor: 'rgba(79, 176, 198, 0.165)'
        };

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
        for (let i = 0; i < this.config.particlesNum; i++) {
            new Particles(this);
        }
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        this.ctx.fillStyle = this.config.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0, len = this.items.length; i < len; i++) {
            const item = this.items[i];
            item.update();
            item.render();
        }

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
