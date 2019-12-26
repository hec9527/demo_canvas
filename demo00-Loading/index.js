class Loading {
    constructor() {
        this.canvas =
            document.getElementById('canvas') ||
            function() {
                const el = document.createElement('canvas');
                el.style.width = '800px';
                el.style.height = '450px';
                el.style.position = 'absolute';
                el.style.margin = 'auto';
                el.style.top = 0;
                el.style.bottom = 0;
                el.style.left = 0;
                el.style.right = 0;
                el.width = 800;
                el.height = 450;
                el.style.background = 'rgba(0, 0, 0, 0.3';
                return el;
            };
        this.ctx = this.canvas.getContext('2d');
        this.offset = 0; // 颜色偏移量
        this.lines = 12; // 线条数量
        this.offsetStep = 0.7 / this.lines;
        this.lineLength = 38; // 线条长度
        this.lineOffset = 14; // 线条偏移量
        this.raduis = this.lineLength + this.lineOffset;
        this.center = [this.canvas.width / 2, this.canvas.height / 2];
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
            this.ctx.lineCap = 'round'; // ! BUG 这个属性无效
            this.ctx.lineWidth = 5; // 线条宽度
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
