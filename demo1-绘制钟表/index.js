/**
 * 绘制钟表
 */
class DrawClock {
    constructor() {
        this.canvas = document.getElementById('canvas') || this.newCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.FONT_HEIGHT = 20; // 字体高度  字体大小
        this.MARGIN = 35; // 距离边框的距离
        this.NUMBER_SPACING = -30; // 数字距离外框的距离
        this.RADIUS = this.canvas.height / 2 - this.MARGIN; // 外圆盘的半径
        this.NUMBER_RADIUS = this.RADIUS + this.NUMBER_SPACING; // 绘制数字的半径
        this.POINTERS = {
            hour: {
                length: this.RADIUS / 2,
                width: 4
            },
            minute: {
                length: (this.RADIUS / 5) * 3,
                width: 2
            },
            seconds: {
                length: (this.RADIUS / 3) * 2,
                width: 1
            }
        };
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

    // 绘制外圈圆环
    drawCircle() {
        this.ctx.save();
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.RADIUS, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // 绘制所有刻度
    drawTags() {
        // 只要是非连续路径绘制，都要记得都要执行一句context.beginPath()
        // 然后使用context.endPath() 结束路径
        this.ctx.save();
        for (let i = 0; i < 60; i++) {
            this.ctx.beginPath();
            const angle = (Math.PI / 30) * i;
            let lineLength = 10;

            this.ctx.lineWidth = 1;

            if (i % 15 === 0) {
                // 0 3 6 9 小时出绘制粗长的直线
                this.ctx.lineWidth = 5;
                lineLength = 20;
            } else if (i % 5 === 0) {
                // 冯5的倍数，绘制次级线条
                this.ctx.lineWidth = 3;
                lineLength = 15;
            }

            this.ctx.moveTo(this.canvas.width / 2 + Math.cos(angle) * this.RADIUS, this.canvas.height / 2 + Math.sin(angle) * this.RADIUS);
            this.ctx.lineTo(
                this.canvas.width / 2 + Math.cos(angle) * (this.RADIUS - lineLength),
                this.canvas.height / 2 + Math.sin(angle) * (this.RADIUS - lineLength)
            );
            this.ctx.closePath();
            this.ctx.stroke();
        }
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
                this.canvas.width / 2 + Math.cos(angle) * this.NUMBER_RADIUS - numberWidth / 2,
                this.canvas.height / 2 + Math.sin(angle) * this.NUMBER_RADIUS + this.FONT_HEIGHT / 3
            );
        });
    }

    // 绘制中间的原点
    drawCenter() {
        this.ctx.beginPath();
        this.ctx.arc((this.canvas.width / 2) | 0, (this.canvas.height / 2) | 0, 5, 0, Math.PI * 2, true);
        this.ctx.fill();
    }

    // 绘制指针
    drawHand(/** number: 刻度/360 */ ioc, pType) {
        const angle = Math.PI * 2 * (ioc / 60) - Math.PI / 2; // 坐标系朝右为0度，3时
        const POINTER = this.POINTERS[pType];

        this.ctx.save();
        this.ctx.lineWidth = POINTER.width;
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.lineTo(
            (this.canvas.width / 2 + Math.cos(angle) * POINTER.length) | 0,
            (this.canvas.height / 2 + Math.sin(angle) * POINTER.length) | 0
        );
        this.ctx.stroke();
        this.ctx.restore();
    }

    // 绘制所有指针
    drawHands() {
        const date = new Date();
        const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();

        this.drawHand(hour * 5 + (date.getMinutes() / 60) * 5, 'hour'); // 绘制时针
        this.drawHand(date.getMinutes(), 'minute'); // 绘制分针
        this.drawHand(date.getSeconds(), 'seconds'); // 绘制秒针
    }

    // 绘制右侧数字
    drwaDateNumber() {
        const date = new Date();
        this.ctx.save();
        this.ctx.font = 40 + 'px Arial';
        const hour = `${date.getHours()} : ${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()} : ${
            date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        }`;
        const hourSize = this.ctx.measureText(hour);
        this.ctx.fillText(hour, (this.canvas.width / 2 - hourSize.width / 2) | 0, this.canvas.height / 2 - (this.RADIUS / 9) * 2);

        this.ctx.font = 15 + 'px Arial';
        const weekDay = `星期${date.getDay()}`;
        const weekDaySize = this.ctx.measureText(weekDay).width;
        this.ctx.fillText(weekDay, (this.canvas.width / 2 - weekDaySize / 2) | 0, this.canvas.height / 2 + (this.RADIUS / 8) * 3);

        this.ctx.restore();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCircle();
        this.drawTags();
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
