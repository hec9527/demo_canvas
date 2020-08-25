class Loading {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.offset = 0; // 颜色偏移量
        this.lines = 12; // 线条数量
        this.offsetStep = 0.7 / this.lines;
        this.lineLength = 24; // 线条长度
        this.lineOffset = 14; // 线条偏移量
        this.raduis = this.lineLength + this.lineOffset;
        this.center = [this.canvas.width / 2, this.canvas.height / 2];
        this.ctx.lineWidth = 5; // 线条宽度
    }

    newTimer() {
        this.timer = setInterval(() => {
            this.offset += 1;
            this.offset >= this.lines && (this.offset = 0);
        }, 150);
    }

    drawLines() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.lines; i++) {
            const angle = (Math.PI / (this.lines / 2)) * (i + this.offset);
            this.ctx.beginPath();
            this.ctx.lineJoin = 'round';
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + i * this.offsetStep})`;
            this.ctx.moveTo(
                (this.center[0] + this.lineOffset * Math.cos(angle)) | 0,
                (this.center[1] + this.lineOffset * Math.sin(angle)) | 0
            );
            this.ctx.lineTo(
                (this.center[0] + this.raduis * Math.cos(angle)) | 0,
                (this.center[1] + this.raduis * Math.sin(angle)) | 0
            );
            this.ctx.closePath();
            this.ctx.stroke();
        }

        requestAnimationFrame(() => this.drawLines());
    }
}

const loading = new Loading();
loading.newTimer();
loading.drawLines();
