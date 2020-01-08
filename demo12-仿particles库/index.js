/**
 * 粒子类
 */
class Particles {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.x = this.word.click ? this.word.mouse.x : Math.random() * this.word.width;
        this.y = this.word.click ? this.word.mouse.y : Math.random() * this.word.height;
        this.radius = Math.random() * 2 + 1.5;
        this.speed = this.getRandomSpeed();

        this.distence = this.word.config.linkDistence;
    }

    getRandomSpeed() {
        return {
            x: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -(Math.random() * 1 + 0.1),
            y: Math.random() > 0.5 ? Math.random() * 1 + 0.5 : -(Math.random() * 1 + 0.1)
        };
    }

    getDistence(p) {
        return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2);
    }

    lineTo(particles, perc) {
        this.word.ctx.beginPath();
        this.word.ctx.moveTo(this.x, this.y);
        this.word.ctx.lineTo(particles.x, particles.y);
        this.word.ctx.lineWdith = this.word.config.lineWidth;
        this.word.ctx.strokeStyle = this.word.config.lineColor + perc + ')';
        this.word.ctx.stroke();
    }

    update() {
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
                const distence = this.getDistence(item);
                if (distence < this.distence) {
                    this.lineTo(item, 0.4 - 0.35 * (distence / this.distence));
                }
            }
        });

        // 连线到鼠标
        if (this.getDistence(this.word.mouse, { x: this.x, y: this.y }) < this.distence) {
            this.lineTo(this.word.mouse, 0.3);
        }
    }

    render() {
        this.word.ctx.beginPath();
        this.word.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.word.ctx.fillStyle = this.word.config.partilceColor;
        this.word.ctx.fill();
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
            linkDistence: 120, // 连线距离
            particlesNum: 200, // 粒子数量
            lineWidth: 0.1, // 线条宽度
            background: '#0303035f', // 背景颜色
            partilceColor: '#4fb0c6', // 粒子颜色
            lineColor: 'rgba(79, 176, 198, ' // 线条颜色
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
        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
