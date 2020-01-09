/**
 * 小球类
 */
class Ball {
    constructor(word, set) {
        this.word = word;
        this.linkBall = set;
        this.word.items.push(this);

        this.x = Math.random() * this.word.width;
        this.y = Math.random() * this.word.height;
        this.radius = Math.random() * 5 + 5;
        this.speed = this.getRandomSpeed();
        this.mass = this.radius;
        this.minMass = this.mass;
        this.color = this.getRandomColor();
        this.maxBall = this.getMaxBall();
    }

    getRandomColor() {
        const colors = ['#B7FFBF', '#E8DD9E', '#E8DD9E', '#D89EE8', '#D89EE8'];
        return colors[(Math.random() * colors.length) | 0];
    }

    getRandomSpeed() {
        return {
            x: Math.random() < 0.5 ? Math.random() * 3 + 0.5 : -(Math.random() * 3 + 0.5),
            y: Math.random() < 0.5 ? Math.random() * 3 + 0.5 : -(Math.random() * 3 + 0.5)
        };
    }

    getMaxBall() {
        return Array.from(this.linkBall).reduce((pre, cur, arr) => {
            if (pre.mass < cur.mass) {
                return cur;
            } else {
                return pre;
            }
        }, this);
    }

    getNextTickDistence(ball) {
        const pos = { x: this.x + this.speed.x, y: this.y + this.speed.y };
        return Math.sqrt((pos.x - ball.x) ** 2 + (pos.y - ball.y) ** 2);
    }

    getThisTickDistence(ball) {
        return Math.sqrt((ball - this.x) ** 2 + (ball.y - this.y) ** 2);
    }

    getMaxPos(ball) {
        //
    }

    borderCheck() {
        if ((this.x < 0 && this.speed.x < 0) || (this.x > this.word.width && this.speed.x > 0)) {
            this.speed.x = -this.speed.x;
        }
        if ((this.y < 0 && this.speed.y < 0) || (this.y > this.word.height && this.speed.y > 0)) {
            this.speed.y = -this.speed.y;
        }
    }

    update() {
        // 特殊情况  鼠标捕获
        if (
            this.word.click &&
            !this.word.catch &&
            this.getThisTickDistence(this.word.mouse) < this.radius
        ) {
            this.word.catch = this;
            this.mass = 1000;
            Array.from(this.linkBall).forEach(item => {
                item.maxBall = item.getMaxBall();
            });
        }

        // 捕获之后 跟随鼠标移动
        if (this.word.click && this.word.catch === this) {
            this.x = this.word.mouse.x;
            this.y = this.word.mouse.y;
        }

        //边缘检测
        this.borderCheck();
        this.x += this.speed.x;
        this.y += this.speed.y;
    }

    render() {
        const ctx = this.word.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * 世界类
 */
class Word {
    constructor() {
        // 基础属性
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // 相关属性
        this.mouse = { x: -1000, y: -1000 };
        this.click = false;
        this.maxDistence = 150;
        this.minDistence = 50;
        this.catch = null;
        this.items = [];
        this.itemLen = 50;

        // 方法点用
        this.resize();
        this.render();
        this.addItem();

        // 事件监听
        window.addEventListener('resize', () => {
            this.resize();
        });
        window.addEventListener('mousedown', () => {
            this.click = true;
        });
        window.addEventListener('mouseup', () => {
            this.click = false;
            Array.from(this.catch.linkBall).forEach(item => {
                item.maxBall = item.getMaxBall();
            });
            this.catch = null;
        });
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
        });
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    addItem() {
        let set = new Set();
        for (let i = 0; i < this.itemLen; i++) {
            const result = new Ball(this, set);
            set.add(result);
            if (Math.random() < 0.3) {
                set = new Set();
            }
        }
    }

    render() {
        this.ctx.fillStyle = '#fcc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const word = new Word();
