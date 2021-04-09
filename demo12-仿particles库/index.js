/**
 *  配置信息
 */
const Config = {
    linkDistence: 120, // 连线距离
    particlesNum: 300, // 粒子数量
    background: '#0303035f', // 背景颜色
    partilceColor: '#08bbe4', // 粒子颜色
    lineColor: 'rgba(117, 220, 243, ', // 线条颜色
};

/**
 * 粒子精灵
 * 采用离屏canvas提高性能
 */
class ParticlesSprite {
    constructor() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 2;
        canvas.height = 2;

        ctx.fillStyle = Config.partilceColor;
        ctx.arc(1, 1, 1, 0, Math.PI * 2);
        ctx.fill();
        return canvas;
    }
}

/**
 * 粒子类
 */
class Particles {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.x = this.word.click ? this.word.mouse.x : Math.random() * this.word.width;
        this.y = this.word.click ? this.word.mouse.y : Math.random() * this.word.height;
        this.r = Math.random() * 1 + 1;
        this.speed = this.getRandomSpeed();
        this.links = new Set(); // 缓存已经绘制过的线条，拒绝重复绘制
    }

    getRandomSpeed() {
        return {
            x: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -(Math.random() * 1 + 0.1),
            y: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -(Math.random() * 1 + 0.1),
        };
    }

    getDistence(p) {
        return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2);
    }

    lineTo(particles, perc) {
        this.word.ctx.beginPath();
        this.word.ctx.moveTo(this.x | 0, this.y | 0);
        this.word.ctx.lineTo(particles.x | 0, particles.y | 0);
        this.word.ctx.strokeStyle = Config.lineColor + perc + ')';
        this.word.ctx.stroke();
    }

    update() {
        // 更新link的元素
        this.links.clear();

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
    }

    render() {
        this.word.ctx.drawImage(this.word.sprite, 0, 0, 2, 2, this.x, this.y, this.r, this.r);
        this.word.items.forEach((item) => {
            if (item !== this && !item.links.has(this)) {
                const distence = this.getDistence(item);
                if (distence <= Config.linkDistence) {
                    this.lineTo(item, 0.4 - 0.35 * (distence / Config.linkDistence));
                    this.links.add(item);
                }
            }
        });
        if (this.getDistence(this.word.mouse, { x: this.x, y: this.y }) <= Config.linkDistence) {
            this.lineTo(this.word.mouse, 0.3);
        }
    }
}

/**
 * 世界类
 */
class Word {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = Config.background;
        this.ctx.lineWdith = 1;

        this.sprite = new ParticlesSprite();
        this.items = [];
        this.click = false;
        this.mouse = { x: 1, y: 1 };

        // 事件监听
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousedown', () => {
            this.click = true;
            new Particles(this);
            new Particles(this);
            new Particles(this);
            this.click = false;
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
        });

        // 调用自身
        this.resize();
        this.render();

        // 生成粒子
        for (let i = 0; i < Config.particlesNum; i++) {
            new Particles(this);
        }
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.items.forEach((item) => {
            item.update();
            item.render();
        });
        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
