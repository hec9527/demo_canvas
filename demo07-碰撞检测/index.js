/**
 * @author      hec9527
 * @time        2019-12-28
 * @change      2019-12-29
 * @description
 *
 * 动能定理
 *    E = (1 / 2) * m * v^2
 *    动能是因为物体运动产生的
 *    动能是标量
 *
 * 能量守恒
 *    能量不会凭空消失，也不会凭空产生
 *    只能从一个物体转移到另外一个物体
 *    或者从一种形式转为另外一种形式
 *
 * 动量
 *    物体的质量和速度的乘积
 *    动量是矢量，方向为运动的方向
 *    E = mv
 *
 * 动量守恒
 *    在一个封闭的系统中，动量的总和是不变的
 *
 *
 *
 *
 * 优化方向：
 *    1， 这里用到的碰撞检测是：事后检测，即发生碰撞之后再检测，这时候有些边界已经重合，应当处理为整合碰撞不重合的状态
 *    2， 多种类型的碰撞检测方式
 *
 */

/**
 * 小球类
 */
class Ball {
    constructor(world) {
        this.world = world;
        this.world.items.push(this);

        this.x = 0;
        this.y = 0;
        this.radius = this.getRandomRadius();
        this.speed = new Vector(this.getRandomSpeed(), this.getRandomSpeed());
        this.color = this.getRandomColor();
        this.mass = Math.PI * Math.pow(this.radius, 2); // 小球质量 PI*R^2

        // 初始化位置，防止出生的时候重叠
        this.getRandomPos();
    }

    getRandomSpeed() {
        return Math.random() * 3 - 1.5;
    }

    getRandomRadius() {
        return Math.random() * 10 + 10;
    }

    getRandomColor() {
        return this.world.colors[(Math.random() * this.world.colors.length) | 0];
    }

    getRandomPos() {
        this.x = Math.random() * (this.world.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (this.world.height - this.radius * 2) + this.radius;

        for (let i = 0, len = this.world.items.length; i < len; i++) {
            if (this !== this.world.items[i] && this.isOverlap(this.world.items[i])) {
                return this.getRandomPos();
            }
        }
    }

    getDistence(ball) {
        return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2));
    }

    // 检测和指定小球是否重叠
    isOverlap(ball) {
        const distance = this.getDistence(ball);
        return distance > this.radius + ball.radius ? false : true;
    }

    // 两个小球越来越近
    isCloser(ball) {
        // ----------   检测方式一   ----------
        // 速度是矢量，  位置也是矢量    利用矢量的点积运算， 查看是否会继续靠近
        const speed = this.speed.subtraction(ball.speed);
        const pos = new Vector(ball.x - this.x, ball.y - this.y);
        return speed.product(pos) > 0;

        // ----------   检测方式二    ----------
        // 当前帧的距离
        // const distence = this.getDistence(ball);
        // // 下一帧的位置
        // const thisBall = { x: this.x + this.speed.x, y: this.y + this.speed.y };
        // const thatBall = { x: ball.x + ball.speed.x, y: ball.y + ball.speed.y };
        // // 下一帧的距离
        // return distence > Ball.prototype.getDistence.call(thisBall, thatBall);
    }

    // 边界检测
    borderDetection() {
        if (
            (this.x + this.radius + this.speed.x >= this.world.width && this.speed.x > 0) ||
            (this.x - this.radius + this.speed.x <= 0 && this.speed.x < 0)
        ) {
            this.speed.x = -this.speed.x;
        }
        if (
            (this.y + this.radius + this.speed.y >= this.world.height && this.speed.y > 0) ||
            (this.y - this.radius + this.speed.x <= 0 && this.speed.y < 0)
        ) {
            this.speed.y = -this.speed.y;
        }
    }

    // 检测和指定小球是否 重叠并且继续靠近, 继续靠近再处理否则不管
    collisionDetection(ball) {
        // 速度是矢量    采用矢量的点积来判断是否会继续接近
        if (this.isOverlap(ball) && this.isCloser(ball)) {
            this.handlerCollision(this, ball);
            this.handlerCollision(ball, this);
        }
    }

    // 碰撞处理
    handlerCollision(ball1, ball2) {
        //  两个小球圆心之间的向量
        const posVector = new Vector(ball2.x - ball1.x, ball2.y - ball1.y);
        //  ball1小球，速度投影到圆心向量之间的分向量
        const subSpeed = posVector.getProjection(ball1.speed);
        //  修改ball1的速度
        ball1.speed = ball1.speed.subtraction(subSpeed);
        ball1.speed = ball1.speed.subtraction(subSpeed);
    }

    update() {
        // 碰撞检测
        this.world.items.forEach((item) => {
            if (this !== item) {
                this.collisionDetection(item);
            }
        });

        // 边界检测
        this.borderDetection();

        // 位置更新
        this.x += this.speed.x;
        this.y += this.speed.y;
    }

    render() {
        const ctx = this.world.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * 向量类
 */
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // 向量大小
    getVectorSize() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // 单位向量
    getUnitVector() {
        const size = this.getVectorSize();
        return new Vector(this.x / size, this.y / size);
    }

    // 向量基础运算  ---  加法
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    // 向量基础运算  ---  减法
    subtraction(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    // 向量基础运算  ---  点积（点乘）
    product(vector) {
        // 点积的结果为标量  大于0表示两个向量指向方向大致相同    小于0表示两个向量不会指向相同
        return this.x * vector.x + this.y * vector.y;
    }

    // 向量基础运算  --- 叉乘
    crossProduct(vector) {
        return this.x * ball.y - this.y * ball.x;
    }

    // 复合运算  --- 求另一个向量在该向量方向上的投影
    getProjection(vector) {
        // const size = this.product(vector) / Math.pow(vector.getVectorSize(), 2);
        // return new Vector(vector.x * size, vector.y * size);
        const drection = this.getUnitVector();
        const size = this.product(vector) / this.getVectorSize();
        return new Vector(drection.x * size, drection.y * size);
    }
}

/**
 * 世界类
 */
class World {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.colors = ['#ff7473', '#ffc952', '#47b8e0', '#34314c', '#30A9DE'];
        this.ballNum = 200;

        for (let i = 0; i < this.ballNum; i++) {
            new Ball(this);
        }

        // 事件监听
        window.addEventListener('resize', () => this.resize(), false);

        // 开始绘制
        this.resize();
        this.render();
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        this.canvas.width = this.canvas.width;

        this.items.forEach((item) => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const world = new World();
