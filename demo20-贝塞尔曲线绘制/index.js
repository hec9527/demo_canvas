function getCanvas(id) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    ctx.lineWidth = 3;
    ctx.font = '20px Arial';

    return { canvas, ctx };
}

const { canvas, ctx } = getCanvas('canvas');
const { canvas: bg, ctx: btx } = getCanvas('bg');

/** 绘制直线 */
// ctx.moveTo(500, 500);
// ctx.lineTo(1300, 500);
// ctx.moveTo(900, 200);
// ctx.lineTo(900, 800);

/** 绘制三角形 */
// ctx.beginPath();
// ctx.moveTo(500, 500);
// ctx.lineTo(800, 800);
// ctx.lineTo(1300, 300);
// ctx.closePath();

/** 绘制一个原 */
ctx.beginPath();
// ctx.arc(800, 500, 200, (Math.PI * 2) / 3, (Math.PI * 3) / 4, true); // 逆时针？

/** 绘制图片 */
const img = document.createElement('img');
img.onload = function () {
    // 图片， Dx,   Dy
    // 图片， Dx,   Dy,    Dw,    Dh
    // 图片， Sx,   Sy,    Sw,    Sh,   Dx,  Dy,   Dw,  Dh
    // ctx.drawImage(img, 200, 200);
    // ctx.drawImage(img, 200, 200, 300, 150);
    // ctx.drawImage(img, 200, 200, 800, 400, 200, 200, 1000, 880);
};
img.src = '/images/bilibili.jpg';

// 绘制矩形
// ctx.fillStyle = '#abf9';
// ctx.strokeStyle = '#f67';
// ctx.rect(300, 300, 500, 300);
// ctx.fill();
// // 擦除
// window.addEventListener('mousemove', (e) => {
//     ctx.clearRect(
//         e.pageX * window.devicePixelRatio - 50,
//         e.pageY * window.devicePixelRatio - 50,
//         100,
//         100
//     );
// });
// // 清屏
window.addEventListener('dblclick', (e) => {
    // canvas.width = canvas.width; // 会重置canvas   ctx上下文丢失
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 贝塞尔曲线     傅里叶变换    科赫曲线
//  ----------------------------------------------------------------
// 图解 https://zhuanlan.zhihu.com/p/72595018

let x = 800,
    y = 800,
    flag = false,
    pre = 0,
    timer = null,
    last = [500, 500];

window.addEventListener('mousedown', () => (flag = true));
window.addEventListener('mouseup', () => (flag = false));
window.addEventListener('mousemove', (e) => {
    if (!flag) return;
    x = e.pageX * window.devicePixelRatio;
    y = e.pageY * window.devicePixelRatio;
    clearInterval(timer);
    pre = 0;
    btx.clearRect(0, 0, bg.width, bg.height);
    setTimer();
});

setTimer();
function setTimer() {
    timer = setInterval(() => {
        if (pre > 1) return clearInterval(timer);
        pre += 0.01;
    }, 30);
}

(function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(500, 500);
    ctx.fillText('O', 485, 495);
    ctx.fillText('P1', x, y + 25);
    ctx.fillText('P2', 1215, 500);
    ctx.strokeStyle = '#abf'; // 辅助线
    ctx.lineTo(x, y);
    ctx.lineTo(1200, 500);
    ctx.stroke();

    drawSBRLine();

    window.requestAnimationFrame(() => draw());
})();

function drawSBRLine() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#f67';
    let op = [(500 + (x - 500) * pre) | 0, (500 + (y - 500) * pre) | 0];
    let pp = [(x + (1200 - x) * pre) | 0, (y + (500 - y) * pre) | 0];
    let cc = [(op[0] + (pp[0] - op[0]) * pre) | 0, (op[1] + (pp[1] - op[1]) * pre) | 0];

    ctx.moveTo(op[0], op[1]);
    ctx.lineTo(pp[0], pp[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000';
    ctx.moveTo(cc[0], cc[1]);
    ctx.lineTo(cc[0] - 3, cc[1] - 3);
    ctx.stroke();

    btx.beginPath();
    btx.lineWidth = 2;
    btx.strokeStyle = '#000';
    btx.moveTo(last[0], last[1]);
    btx.lineTo(cc[0], cc[1]);
    btx.stroke();

    last = [...cc];

    ctx.restore();
}

ctx.fill();
ctx.stroke();
