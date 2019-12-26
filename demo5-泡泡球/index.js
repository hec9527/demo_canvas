/**
 * @author     hec9527
 * @time       2019-12-25
 * @change     2019-12-26
 * @description
 *     1, demo 包含大量元素动画
 *     2，如何使用面向对象的方式绘制出来
 *     3，新能调优，高性能展示
 *     4，速度计算，像素/S --->  像素/帧
 *     5，绘制的元素的事件
 *
 */

/**
 * 泡泡类
 */
class Bubble {
    constructor(word) {
        this.word = word;
        this.word.items.push(this);

        this.x = this.getRandomPosX();
        this.y = this.getRandomPosY();
        this.color = this.getRandomColor();
        this.speed = this.getRandomSpeed();
        this.radius = this.getRandomRadius();
        this.minRadius = this.radius;
        this.maxRadius = this.minRadius * 4;
    }

    getRandomPosX() {
        return (Math.random() * this.word.canvas.width) | 0;
    }

    getRandomPosY() {
        return (Math.random() * this.word.canvas.height) | 0;
    }

    getRandomColor() {
        const colors = ['#ff7473', '#ffc952', '#47b8e0', '#34314c'];
        return colors[(Math.random() * colors.length) | 0];
    }

    getRandomSpeed() {
        return [Math.random() * 2 - 1 || 0.5, Math.random() * 2 - 1 || 0.5];
    }

    getRandomRadius() {
        return ((Math.random() * 5) | 0) + 3;
    }

    update() {
        this.x += this.speed[0];
        this.y += this.speed[1];

        this.x > this.word.canvas.width && (this.x -= this.word.canvas.width);
        this.x < 0 && (this.x += this.word.canvas.width);

        this.y > this.word.canvas.height && (this.y -= this.word.canvas.height);
        this.y < 0 && (this.y += this.word.canvas.height);

        if (
            Math.abs(this.x - this.word.mousePos.x) <= 50 &&
            Math.abs(this.y - this.word.mousePos.y) <= 50
        ) {
            if (this.radius < this.maxRadius) {
                this.radius += 0.5;
            }
        } else if (this.radius > this.minRadius) {
            this.radius -= 0.5;
        }
    }

    render() {
        const context = this.word.ctx;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}

class World {
    constructor() {
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.items = [];
        this.mousePos = { x: -1000, y: -1000 };
        this.bubbleNum = 1000;

        // 添加事件监听
        window.addEventListener(
            'resize',
            () => {
                this.canvas.width = this.canvas.offsetWidth;
                this.canvas.height = this.canvas.offsetHeight;
            },
            false
        );

        window.addEventListener(
            'mousemove',
            e => {
                this.mousePos.x = e.pageX;
                this.mousePos.y = e.pageY;
            },
            false
        );

        // 添加bubble
        for (let i = 0; i < this.bubbleNum; i++) {
            new Bubble(this);
        }
        this.update();
    }

    update() {
        this.canvas.width = this.canvas.width;
        for (let i = 0; i < this.bubbleNum; i++) {
            this.items[i].update();
            this.items[i].render();
        }
        // this.items.forEach(item => {
        //     item.update();
        //     item.render();
        // });
        window.requestAnimationFrame(() => this.update());
    }
}

const world = new World();
