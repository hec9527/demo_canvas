class CanvasEvent {
    constructor() {
        this.canvas = document.getElementById('canvas') || newCanvas();
        this.context = this.canvas.getContext('2d');
        this.etype = '';
        this.x = 0;
        this.y = 0;
        this.clear = window.clear = true;

        this.canvas.addEventListener('mousemove', e => {
            this.changeInfo('mousemove', e);
            this.drawLine();
        });

        this.canvas.addEventListener('mousedown', e => {
            this.changeInfo('mousedown', e);
            this.drawLine();
        });

        this.canvas.addEventListener('mouseup', e => {
            this.changeInfo('mouseup', e);
            this.drawLine();
        });

        this.canvas.addEventListener('mouseover', e => {
            this.changeInfo('mouseover', e);
            this.drawLine();
            // alert(1);
            console.log('在鼠标进入canvas的一瞬间触发');
        });

        this.canvas.addEventListener('mouseleave', e => {
            this.changeInfo('mouseleave', e);
            this.drawLine();
        });
    }

    changeInfo(etype, e) {
        this.etype = etype;
        this.x = e.layerX;
        this.y = e.layerY;
    }

    newCanvas() {
        const el = document.createElement('canvas');
        el.style.width = '800px';
        el.style.height = '450px';
        el.style.background = '#ccc';
        el.width = 800;
        el.height = 450;
        document.getElementsByTagName('body')[0].appendChild(el);
        return el;
    }

    drawLine() {
        // window.clear && this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        window.clear && (this.canvas.width = this.canvas.width); // 这2中方式都可以
        this.context.save();
        this.context.beginPath();
        this.context.setLineDash([10, 5]); // 设置虚线效果，数组中以此为实线长度，虚线长度
        this.context.moveTo(this.x, 0);
        this.context.lineTo(this.x, this.canvas.height);
        this.context.moveTo(0, this.y);
        this.context.lineTo(this.canvas.width, this.y);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
        this.drawFont();
    }

    drawFont() {
        this.context.save();
        this.context.font = '30px SimSun, Songti SC';
        this.context.fillText(`Event: ${this.etype}`, 30, 50);
        this.context.fillText(`X: ${this.x}`, 30, 80);
        this.context.fillText(`Y: ${this.y}`, 30, 110);
        this.context.restore();
    }
}

new CanvasEvent();

console.log('window.clear = true/false, it contral the canvas clear');
