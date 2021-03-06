class CanvasEvent {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.etype = '';
        this.x = 0;
        this.y = 0;

        this.canvas.addEventListener('mousemove', (e) => {
            this.changeInfo('mousemove', e);
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.changeInfo('mousedown', e);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.changeInfo('mouseup', e);
        });

        this.canvas.addEventListener('mouseover', (e) => {
            this.changeInfo('mouseover', e);

            // alert(1);
            console.log('在鼠标进入canvas的一瞬间触发');
        });

        this.canvas.addEventListener('mouseleave', (e) => {
            this.changeInfo('mouseleave', e);
        });

        this.draw();
    }

    changeInfo(etype, e) {
        this.etype = etype;
        this.x = e.layerX;
        this.y = e.layerY;
    }

    draw() {
        this.canvas.width = this.canvas.width;
        this.context.save();
        this.context.beginPath();
        this.context.setLineDash([10, 5]); // 设置虚线效果，数组中以此为实线长度，虚线长度
        // 通过设置 this.context.lineDashOffset 来绘制蚂蚁线
        this.context.moveTo(this.x, 0);
        this.context.lineTo(this.x, this.canvas.height);
        this.context.moveTo(0, this.y);
        this.context.lineTo(this.canvas.width, this.y);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
        // 绘制文字
        this.context.save();
        this.context.font = '30px SimSun, Songti SC';
        this.context.fillText(`Event: ${this.etype}`, 30, 50);
        this.context.fillText(`X: ${this.x}`, 30, 80);
        this.context.fillText(`Y: ${this.y}`, 30, 110);
        this.context.restore();

        window.requestAnimationFrame(() => this.draw());
    }
}

new CanvasEvent();
