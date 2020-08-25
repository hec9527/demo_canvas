/**
 * 绘制钟表
 */
class DrawClock {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.FONT_HEIGHT = 20; // 字体高度  字体大小
        this.MARGIN = 35; // 距离边框的距离
        this.NUMBER_SPACING = -30; // 数字距离外框的距离
        this.RADIUS = this.canvas.height / 2 - this.MARGIN; // 外圆盘的半径
        this.NUMBER_RADIUS = this.RADIUS + this.NUMBER_SPACING; // 绘制数字的半径
        this.POINTERS = {
            hour: {
                length: (this.RADIUS / 11) * 4,
                width: 7,
                color: 'rgb(0, 0, 0)',
            },
            minute: {
                length: (this.RADIUS / 11) * 7,
                width: 4,
                color: 'rgb(0, 33, 245)',
            },
            seconds: {
                length: (this.RADIUS / 11) * 9,
                width: 2,
                color: 'rgb(192, 63, 30)',
            },
        };
        this.ctx.font = this.FONT_HEIGHT + 'px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#fff';

        this.draw();
    }

    // 绘制外圈圆环
    drawCircle() {
        const LINE_WIDTH = 20;
        this.ctx.save();
        this.ctx.lineWidth = LINE_WIDTH;
        this.ctx.beginPath();
        this.ctx.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.RADIUS + LINE_WIDTH / 2,
            0,
            Math.PI * 2,
            true
        );
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    // 绘制所有刻度
    drawTags() {
        // 只要是非连续路径绘制，都要记得都要执行一句context.beginPath()
        // 然后使用context.endPath() 结束路径
        // 否则会以最后一次的绘制样式为准
        this.ctx.save();
        for (let i = 0; i < 60; i++) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;

            const angle = (Math.PI / 30) * i;
            let lineLength = 10;

            if (i % 15 === 0) {
                // 3 6 9 12小时绘制粗长的直线
                this.ctx.lineWidth = 8;
                lineLength = 20;
            } else if (i % 5 === 0) {
                // 冯5的倍数，绘制次级线条
                this.ctx.lineWidth = 4;
                lineLength = 15;
            }

            this.ctx.moveTo(
                this.canvas.width / 2 + Math.cos(angle) * this.RADIUS,
                this.canvas.height / 2 + Math.sin(angle) * this.RADIUS
            );
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

        numbers.forEach((num) => {
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
        const C = {
            x: (this.canvas.width / 2) | 0,
            y: (this.canvas.height / 2) | 0,
        };

        Object.keys(this.POINTERS).forEach((key) => {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.POINTERS[key].color;
            this.ctx.arc(C.x, C.y, 5, 0, Math.PI * 2, true);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    // 绘制指针
    drawHand(/** number: 刻度/360 */ ioc, pType) {
        const angle = Math.PI * 2 * (ioc / 60) - Math.PI / 2; // 坐标系朝右为0度，3时
        const POINTER = this.POINTERS[pType];

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineJoin = 'miter';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = POINTER.width;
        this.ctx.strokeStyle = POINTER.color;
        this.ctx.moveTo(
            this.canvas.width / 2 - (Math.cos(angle) * POINTER.length) / 5,
            this.canvas.height / 2 - (Math.sin(angle) * POINTER.length) / 5
        );
        this.ctx.lineTo(
            this.canvas.width / 2 + Math.cos(angle) * POINTER.length,
            this.canvas.height / 2 + Math.sin(angle) * POINTER.length
        );

        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    // 绘制所有指针
    drawHands() {
        const date = new Date();
        const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();

        this.drawHand(hour * 5 + (date.getMinutes() / 60) * 5, 'hour'); // 绘制时针
        this.drawHand(date.getMinutes() + date.getSeconds() / 60, 'minute'); // 绘制分针
        this.drawHand(date.getSeconds() + date.getMilliseconds() / 1000, 'seconds'); // 绘制秒针
    }

    // 绘制数字时间
    drwaDateNumber() {
        const date = new Date();
        this.ctx.save();
        this.ctx.font = 40 + 'px Arial';
        this.ctx.fillStyle = '#d8dfdb';
        const hour = `${date.getHours()} : ${
            date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        } : ${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
        const hourSize = this.ctx.measureText(hour);
        this.ctx.fillText(
            hour,
            (this.canvas.width / 2 - hourSize.width / 2) | 0,
            this.canvas.height / 2 - (this.RADIUS / 9) * 2
        );

        this.ctx.font = 15 + 'px Arial';
        const weekDay = `星期${this.mapWeekDay(date.getDay())}`;
        const weekDaySize = this.ctx.measureText(weekDay).width;
        this.ctx.fillText(
            weekDay,
            (this.canvas.width / 2 - weekDaySize / 2) | 0,
            this.canvas.height / 2 + (this.RADIUS / 8) * 3
        );

        this.ctx.restore();
    }

    mapWeekDay(num) {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return days[num];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCircle();
        this.drawTags();
        this.drawNumbers();
        this.drwaDateNumber();
        this.drawHands();
        this.drawCenter();

        window.requestAnimationFrame(() => this.draw());
    }
}

new DrawClock();
