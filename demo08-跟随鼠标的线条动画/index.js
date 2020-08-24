/**
 * 粒子
 */
class Particle {
    constructor(world) {
        this.world = world;
        this.world.items.push(this);

        // 粒子位置
        this.pos = { ...this.world.mousePos };
        this.lastPos = { ...this.world.mousePos };
        this.lastMousePos = { ...this.world.mousePos }; // 粒子对应的鼠标位置
        this.lineWidth = this.getRandomLineWidth();
        this.radius = this.getRandomRadius();
        this.maxRadius = this.radius * 1.3;
        this.minRadius = this.radius;
        this.angle = this.getRandomAngle();
        this.angleSpeed = this.getRandomAngleSpeed();
        this.moveStep = this.getRandomMoveStep();
        this.color = this.getRandomColor();
    }

    // 初始角度
    getRandomAngle() {
        return Math.random() * 360;
    }

    //  旋转速度
    getRandomAngleSpeed() {
        return Math.random() * 0.03 + 0.03;
    }

    // 获取随机大小的粒子
    getRandomLineWidth() {
        return Math.random() * 2.5 + 2;
    }

    getRandomColor() {
        const colors = [
            '#97A7F8',
            '#C957CA',
            '#76E2FE',
            '#ff7473',
            '#ffc952',
            '#47b8e0',
            '#34314c',
            '#30A9DE',
        ];
        return colors[(Math.random() * colors.length) | 0];
    }

    // 获取随机的移动步长  想要获得统一的移动效果，把随机部分转移到固定部分
    getRandomMoveStep() {
        return Math.random() * 0.03 + 0.04;
    }

    // 旋转半径
    getRandomRadius() {
        return Math.random() * 50 + 30;
    }

    update() {
        this.lastPos = { ...this.pos };

        // 计算新的鼠标位置
        this.lastMousePos.x += (this.world.mousePos.x - this.lastMousePos.x) * this.moveStep;
        this.lastMousePos.y += (this.world.mousePos.y - this.lastMousePos.y) * this.moveStep;

        // 点击加速效果
        if (this.world.clicked) {
            this.angle += 1.5 * this.angleSpeed;
            if (this.radius < this.maxRadius) {
                this.radius += 1;
            }
        } else {
            this.angle += this.angleSpeed;
            if (this.radius > this.minRadius) {
                this.radius -= 1;
            }
        }

        // 计算新的粒子位置
        this.pos.x = this.lastMousePos.x + Math.cos(this.angle) * this.radius;
        this.pos.y = this.lastMousePos.y + Math.sin(this.angle) * this.radius;
    }

    render() {
        const ctx = this.world.ctx;

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(this.lastPos.x, this.lastPos.y);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.stroke();
        ctx.closePath();
    }
}

class World {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.mousePos = { x: this.width / 2, y: this.height / 2 };
        this.particleNum = 55;
        this.clicked = false;

        // 监听
        window.addEventListener('resize', (e) => {
            this.width = this.canvas.width = this.canvas.offsetWidth;
            this.height = this.canvas.height = this.canvas.offsetHeight;
        });

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.pageX;
            this.mousePos.y = e.pageY;
        });

        window.addEventListener('mousedown', (e) => {
            this.clicked = true;
        });

        window.addEventListener('mouseup', (e) => {
            this.clicked = false;
        });

        for (let i = 0; i < this.particleNum; i++) {
            new Particle(this);
        }

        this.render();
    }

    render() {
        // 蒙板透明度越低，小尾巴越短
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.items.forEach((item) => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const world = new World();
