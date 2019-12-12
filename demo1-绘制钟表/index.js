/**
 * 绘制钟表
 */
class DrawClock {
    constructor() {
        this.canvas = document.getElementById('canvas') || this.newCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.currentTime = this.getCurrentTime();
        this.FONT_HEIGHT = 15; // 字体高度
        this.MARGIN = 35;
        this.HAND_TRUNCATION = this.canvas.width / 25;
        this.HOUR_HAND_TRUNCATION = this.canvas.width / 10;
        this.NUMBER_SPACING = 20;
        this.RADIUS = this.canvas.height / 2 - this.MARGIN;
        this.HAND_RADIUS = this.RADIUS + this.NUMBER_SPACING;
        this.ctx.font = this.FONT_HEIGHT + 'px Arial';
    }

    newCanvas() {
        const el = document.createElement('canvas');
        el.id = 'canvas';
        el.width = 800;
        el.height = 450;
        el.style.width = 800 + 'px';
        el.style.height = 450 + 'px';
        el.style.background = '#ccc';
        document.getElementsByTagName('body')[0].appendChild(el);
        return el;
    }

    getCurrentTime() {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const h = date.getHours();
        const M = date.getMinutes();
        const s = date.getSeconds();
        return [y, m, d, h, M, s];
    }

    // 绘制外圈圆环
    drawCircle() {
        this.ctx.save();
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(
            this.canvas.width / 3,
            this.canvas.height / 2,
            this.RADIUS,
            0,
            Math.PI * 2,
            true
        );
        this.ctx.stroke();
        this.ctx.restore();
    }

    // 绘制数字
    drawNumbers() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let angle = 0;
        let numberWidth = 0;

        numbers.forEach(num => {
            angle = (Math.PI / 6) * (num - 3);
            numberWidth = this.ctx.measureText(num).width;
            this.ctx.fillText(
                num,
                this.canvas.width / 3 +
                    Math.cos(angle) * this.HAND_RADIUS -
                    numberWidth / 2,
                this.canvas.height / 2 +
                    Math.sin(angle) * this.HAND_RADIUS +
                    this.FONT_HEIGHT / 3
            );
        });
    }

    // 绘制中间的原点
    drawCenter() {
        this.ctx.beginPath();
        this.ctx.arc(
            (this.canvas.width / 3) | 0,
            (this.canvas.height / 2) | 0,
            5,
            0,
            Math.PI * 2,
            true
        );
        this.ctx.fill();
    }

    // 绘制指针
    drawHand(ioc, isHour) {
        const angle = Math.PI * 2 * (ioc / 60) - Math.PI / 2;
        const handRadius = isHour
            ? this.RADIUS - this.HAND_TRUNCATION - this.HOUR_HAND_TRUNCATION
            : this.RADIUS - this.HAND_TRUNCATION;
        this.ctx.moveTo(this.canvas.width / 3, this.canvas.height / 2);
        this.ctx.lineTo(
            (this.canvas.width / 3 + Math.cos(angle) * handRadius) | 0,
            (this.canvas.height / 2 + Math.sin(angle) * handRadius) | 0
        );
        this.ctx.stroke();
    }

    // 绘制所有指针
    drawHands() {
        const date = new Date();
        const hour =
            date.getHours() > 12 ? date.getHours() - 12 : date.getHours();

        this.drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true); // 绘制时针
        this.drawHand(date.getMinutes(), false); // 绘制分针
        this.drawHand(date.getSeconds(), false); // 绘制秒针
    }

    // 绘制右侧数字
    drwaDateNumber() {
        const date = new Date();
        this.ctx.save();
        this.ctx.font = 20 + 'px Arial';

        const title = `${date.getFullYear()} 年 ${date.getMonth() +
            1} 月 ${date.getDate()} 日`;
        const titleSize = this.ctx.measureText(title);
        this.ctx.fillText(
            title,
            ((this.canvas.width / 5) * 4 - titleSize.width / 2) | 0,
            (this.canvas.height / 2 - 50) | 0
        );

        this.ctx.font = 36 + 'px Arial';
        const hour = `${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`;
        const hourSize = this.ctx.measureText(hour);
        this.ctx.fillText(
            hour,
            ((this.canvas.width / 5) * 4 - hourSize.width / 2) | 0,
            this.canvas.height / 2
        );

        this.ctx.font = 15 + 'px Arial';
        const weekDay = `星期${date.getDay()}`;
        const weekDaySize = this.ctx.measureText(weekDay).width;
        this.ctx.fillText(
            weekDay,
            ((this.canvas.width / 5) * 4 - weekDaySize / 2) | 0,
            this.canvas.height / 2 + 35
        );

        this.ctx.restore();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCircle();
        this.drawNumbers();
        this.drawCenter();
        this.drawHands();
        this.drwaDateNumber();

        requestAnimationFrame(() => {
            this.draw();
        });
    }
}

const drawClock = new DrawClock();
drawClock.draw();
