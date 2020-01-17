/**
 * 会闪烁的星星
 */
class StarStar {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.x = Math.random() * this.word.width;
        this.y = Math.random() * this.word.height;
        this.raduis = Math.random() * 0.7 + 0.5;
        this.blinkStep = Math.random() * 0.005 + 0.007;
        this.opacity = 0.1 + (this.raduis / 1.2) * 0.5;
        this.minOpacity = this.opacity / 10;
        this.maxOpacity = 2 * this.opacity >= 1 ? 1 : 2 * this.opacity;
        this.isBlink = true; // 是否亮度增加
    }

    update() {
        if (this.isBlink) {
            if (this.opacity < this.maxOpacity) {
                this.opacity += this.blinkStep;
            } else {
                this.isBlink = !this.isBlink;
            }
        } else {
            if (this.opacity > this.minOpacity) {
                this.opacity -= this.blinkStep;
            } else {
                this.isBlink = !this.isBlink;
            }
        }
    }

    render() {
        const ctx = this.word.ctx;

        ctx.beginPath();
        // ctx.shadowColor = '#fff'; // 超级耗费性能
        // ctx.shadowBlur = 3; // 超级耗费性能
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.raduis, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * 流星类
 */
class Meteor {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.pos = { x: -100, y: -100 };
        this.lastPos = { ...this.pos };
        this.speed = { x: 0, y: 0 };
        this.lineWidth = 1;
        this.timer = null;

        setTimeout(() => this.birth(), Math.random() * 3000);
    }

    getRandomLineWidth() {
        return Math.random() * 2 + 1;
    }

    getRandomPosX() {
        return ((Math.random() * this.word.width) / 7) * 4;
    }

    getRandomPosY() {
        return (Math.random() * this.word.height) / 5;
    }

    getRandomSpeed() {
        return {
            x: Math.random() * 2 + 6,
            y: Math.random() * 2 + 6
        };
    }

    // 新生成流星
    birth() {
        this.timer = null;
        this.pos.x = this.getRandomPosX();
        this.pos.y = this.getRandomPosY();

        this.lastPos = { ...this.pos };

        this.speed = this.getRandomSpeed();
        this.lineWidth = this.getRandomLineWidth();
    }

    update() {
        this.lastPos = { ...this.pos };

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;

        // 新生
        if (
            (this.pos.x > this.word.width * 2 || this.pos.y > this.word.height * 2) &&
            !this.timer
        ) {
            this.timer = setTimeout(() => this.birth(), Math.random() * 4000 + 1000);
        }
    }

    render() {
        const ctx = this.word.ctx;

        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(this.lastPos.x, this.lastPos.y);
        ctx.lineTo(this.pos.x, this.pos.y);
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
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.items = [];
        this.meteorNum = 3;
        this.starNum = 500;
        this.clicked = false;

        // 注册事件
        window.addEventListener('resize', () => {
            this.width = this.canvas.width = this.canvas.offsetWidth;
            this.height = this.canvas.height = this.canvas.offsetHeight;
        });

        // 添加流星
        for (let i = 0; i < this.meteorNum; i++) {
            new Meteor(this);
        }

        // 添加星星
        for (let i = 0; i < this.starNum; i++) {
            new StarStar(this);
        }

        this.render();
    }

    render() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
