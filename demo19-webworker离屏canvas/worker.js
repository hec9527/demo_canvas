onmessage = function (e) {
    /** @type {HTMLCanvasElement} */
    const canvas = e.data.canvas;
    console.log('worker:', canvas);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff7788';

    let last = 0;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    let dx = (Math.random() * 2 + 0.5) * Math.random() > 0.5 ? 1 : -1;
    let dy = (Math.random() * 2 + 0.5) * Math.random() > 0.5 ? 1 : -1;

    ctx.fillRect(x, y, 40, 40);

    const postCanvas = (ctime) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderFPS((1000 / (ctime - last)) | 0);
        last = ctime;
        if (x < 0 || x > canvas.width - 40) dx = -dx;
        if (y < 0 || y > canvas.height - 40) dy = -dy;
        x += dx;
        y += dy;
        ctx.fillRect(x, y, 40, 40);
        requestAnimationFrame(postCanvas);
    };

    const renderFPS = (fps) => {
        ctx.save();
        ctx.fillStyle = '#f8f8f8';
        ctx.font = '24px Arial';
        ctx.fillText(`FPS: ${fps}`, 20, 30);
        ctx.restore();
    };

    postCanvas();
};
