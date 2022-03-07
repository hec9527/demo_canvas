/**
 * @type { HTMLCanvasElement}
 */
const canvas = new OffscreenCanvas(516, 458);
const ctx = canvas.getContext('2d');
const img = document.getElementById('aa');

let x = 0;
let y = 0;
let last = 0;

let dx = Math.random() * 2;
let dy = Math.random() * 2;

ctx.fillStyle = '#ff7788';

function postCanvas(ctime) {
    document.title = `FPS:${1000 / (ctime - last)}`;
    last = ctime;

    if (x < 0 || x > canvas.width - 40) dx = -dx;
    if (y < 0 || y > canvas.height - 40) dy = -dy;
    x += dx;
    y += dy;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(x, y, 40, 40);

    ctx.canvas.convertToBlob({ type: 'image/png', quality: 100 }).then((res) => {
        const url = URL.createObjectURL(res);
        img.src = url;
    });
    requestAnimationFrame(postCanvas);
}

postCanvas();
