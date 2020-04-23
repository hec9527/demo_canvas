class Video {
    constructor(src) {
        this.src = src;
        this.canvas = document.getElementById('canvas');
        this.video = document.getElementById('video');
        this.ctx = this.canvas.getContext('2d');
        this.offScreen = this.getOffscreen();
        this.offCtx = this.offScreen.getContext('2d');

        this.render();
        this.resize();

        window.addEventListener('resize', this.resize);
    }

    getOffscreen() {
        const el = document.createElement('canvas');
        el.width = this.video.width;
        el.height = this.video.height;
        return el;
    }

    getFrameFromOffScreen() {
        this.offScreen.width = this.offScreen.width;
        this.offCtx.drawImage(
            this.video,
            0,
            0,
            this.video.width,
            this.video.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        return this.offScreen;
    }

    resize() {
        this.canvas.width = this.video.width;
        this.canvas.height = this.video.height;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.getFrameFromOffScreen(),
            0,
            0,
            this.video.width,
            this.video.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        window.requestAnimationFrame(() => this.render());
    }
}

new Video('../Assets/videos/bad apple.mp4');
