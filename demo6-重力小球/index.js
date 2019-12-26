/**
 * @author    hec9527
 * @time      2019-12-26
 * @change    2019-12-26
 * @description
 *
 *     1, 效果参考B站UP主（忘了谁了，感觉挺简单的），然后自己做了一些类似效果的动画
 *     2，基于面向对象， 基于ES6 class
 *     3，后期可以考虑做一个带体积碰撞检查的，同时增加矢量运算使运动更加真是
 *
 */

/**
 * 重力小球
 */
class GravityBall {
    constructor(world) {
        this.world = world;
        this.world.items.push(this);

        this.radius = this.getRandomRadius();
        this.x = this.getRandomPosX();
        this.y = this.getRandomPosY();
        this.color = this.getRandomColor();
        this.speed = { x: this.getRandomSpeedX(), y: this.getRandomSpeedY() };
    }

    getRandomPosX() {
        return Math.random() * (this.world.width - this.radius * 2) + this.radius;
    }

    getRandomPosY() {
        return Math.random() * (this.world.height / 3) + this.radius;
    }

    getRandomColor() {
        const colors = ['#ff7473', '#ffc952', '#47b8e0', '#34314c', '#30A9DE'];
        return colors[(Math.random() * colors.length) | 0];
    }

    getRandomSpeedX() {
        return Math.random() * 10 - 5;
    }

    // 如果不设置初速度，最开始的时候一起向下移动，根据高度不同，后期的速度也不同
    getRandomSpeedY() {
        return Math.random() * this.radius + 5;
    }

    getRandomRadius() {
        return Math.random() * 10 + 5;
    }

    update() {
        const FRICTIONAL = this.world.FRICTIONAL;

        if (
            this.x + this.radius + this.speed.x > this.world.width ||
            this.x - this.radius + this.speed.x < 0
        ) {
            this.speed.x = -this.speed.x;
        }

        if (
            this.y + this.radius + this.speed.y > this.world.height ||
            this.y - this.radius + this.speedy < 0
        ) {
            this.speed.x *= FRICTIONAL;
            this.speed.y *= FRICTIONAL;
            this.speed.y = -this.speed.y;
        } else {
            this.speed.y += FRICTIONAL;
        }

        this.x += this.speed.x;
        this.y += this.speed.y;
    }

    render() {
        const ctx = this.world.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

/**
 * 世界
 */
class World {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        //摩擦系数
        this.FRICTIONAL = 0.89;
        // // 加速度   矢量方向向下
        // this.ACCELERATION = 0.9;
        this.items = [];
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.mousePos = { x: -1000, y: -1000 };
        this.ballNum = 100;
        this.tips = '点击页面重置';

        // 添加对象
        for (let i = 0; i < this.ballNum; i++) {
            new GravityBall(this);
        }

        // 事件监听
        window.addEventListener(
            'mousemove',
            e => {
                this.mousePos.x = e.pageX;
                this.mousePos.y = e.pageY;
            },
            false
        );

        // 重新初始化
        window.addEventListener('click', e => (world = new World()), { once: true });

        this.render();
    }

    renderTips() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Arial';
        this.tipsWidth = this.ctx.measureText(this.tips).width;
        this.ctx.fillText(
            this.tips,
            (this.canvas.width - this.tipsWidth) / 2,
            (this.canvas.height / 9) * 4
        );
        this.ctx.closePath();
    }

    render() {
        this.canvas.width = this.width;

        this.renderTips();

        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

let world = new World();
