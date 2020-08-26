/** 画板 */
class DrawBoard {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.penDown = false;
        this.penPos = { x: 0, y: 0 };
        this.penLastPos = { x: 0, y: 0 };

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mouseup', () => (this.penDown = false));
        window.addEventListener('mousedown', () => (this.penDown = true));
        window.addEventListener('mousemove', (e) => {
            this.penLastPos = { ...this.penPos };
            this.penPos = {
                x: e.layerX * window.devicePixelRatio,
                y: e.layerY * window.devicePixelRatio,
            };
        });
        window.addEventListener('dblclick', () => {
            console.log('清除画板');
            this.canvas.width = this.canvas.width;
        });

        this.resize();
        this.draw();
        window.canvas = this.canvas;
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.height = this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    }

    draw() {
        if (this.penDown) {
            this.ctx.moveTo(this.penLastPos.x, this.penLastPos.y);
            this.ctx.lineTo(this.penPos.x, this.penPos.y);
            this.ctx.stroke();
        }

        window.requestAnimationFrame(() => this.draw());
    }
}

new DrawBoard();
