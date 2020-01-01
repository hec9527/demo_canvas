/**
 * 会闪烁的星星
 */
class StarStar {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);
    }

    update() {
        //
    }

    render() {
        //
    }
}

/**
 * 流星类
 */
class Meteor {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.pos = { ...this.word.birthCenter };
        this.lastPos = { ...this.pos };
        this.speed = { x: 0, y: 0 };
        this.maxSpeed = { x: 5, y: 5 };
        this.lineWidth = 1;

        this.birth();
    }

    // 在世界的出生点中心附近出生
    birth() {
        //
    }

    update() {
        //
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
        this.meteorNum = 5;
        this.starNum = 300;
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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
