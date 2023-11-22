const offCanvas = document.createElement('canvas').transferControlToOffscreen();
const worker = new Worker('./worker.js');
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image;

offCanvas.width = canvas.width;
offCanvas.height = canvas.height;

worker.postMessage({ canvas: offCanvas }, [offCanvas]);
worker.addEventListener('message', (e) => {
    image = e.data.image;
});

function draw() {
    requestAnimationFrame(draw);

    if (!image) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
}

draw();
