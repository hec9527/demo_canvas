let isMoseDown = false;
let isShowAnima = false;
let selectedPoint = null;
let per = 0;
const { canvas, ctx } = getCanvas('canvas');
const { canvas: bg, ctx: bgx } = getCanvas('bg');
const colors = [];
const MOSEPOS = { x: 0, y: 0 };

/** 获取canvas元素 */
function getCanvas(el) {
    const canvas = document.getElementById(el);
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    return { canvas, ctx };
}

/** 查找当前鼠标悬浮的点 */
function findPoint() {
    for (let p of POINTS) {
        if (
            p.pos.x <= MOSEPOS.x + 5 &&
            p.pos.x >= MOSEPOS.x - 5 &&
            p.pos.y <= MOSEPOS.y + 5 &&
            p.pos.y >= MOSEPOS.y - 5
        ) {
            return p;
        }
    }
}

/** 控制点 */
class ControlPoints {
    constructor(pos) {
        this.width = 10;
        this.pos = { ...pos };
        console.info(`new control points {${pos.x}, ${pos.y}}`);
    }

    updatePos(pos) {
        this.pos = { ...pos };
    }

    draw() {
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(
            this.pos.x - this.width / 2,
            this.pos.y - this.width / 2,
            this.width,
            this.width
        );
        ctx.restore();
    }
}

const POINTS = [new ControlPoints({ x: 400, y: 500 }), new ControlPoints({ x: 600, y: 500 })];
let lastPoint = { ...POINTS[0].pos };
document.getElementById('animation').onclick = function (e) {
    const text = e.target.innerText;
    if (text === '开启动画') {
        this.innerText = '关闭动画';
        isShowAnima = true;
    } else {
        this.innerText = '开启动画';
        isShowAnima = false;
    }
};

document.addEventListener('mouseup', () => (isMoseDown = false));
document.addEventListener('mousedown', () => (isMoseDown = true));
document.addEventListener('mousemove', (e) => {
    MOSEPOS.x = e.pageX * window.devicePixelRatio;
    MOSEPOS.y = e.pageY * window.devicePixelRatio;
    if (isMoseDown) {
        if (!selectedPoint) {
            const point = findPoint();
            if (point) {
                selectedPoint = point;
                document.addEventListener('mouseup', () => (selectedPoint = null));
            }
        } else {
            selectedPoint.updatePos(MOSEPOS);
            bgx.clearRect(0, 0, bg.width, bg.height);
            per = 0;
        }
    }
});
/** 双击 - 添加/删除控制点 */
document.addEventListener('dblclick', (e) => {
    const point = findPoint();
    if (!point) {
        POINTS.push(
            new ControlPoints({
                x: e.pageX * window.devicePixelRatio,
                y: e.pageY * window.devicePixelRatio,
            })
        );
    } else {
        if (POINTS.length < 3) return console.log('只剩两个点，不能再删了');
        for (let i = 0; i < POINTS.length; ) {
            if (POINTS[i++] === point) {
                POINTS.splice(i - 1, 1);
                console.info(`delete control point {${point.pos.x}, ${point.pos.y}}`);
            }
        }
    }
    bgx.clearRect(0, 0, bg.width, bg.height);
    per = 0;
});

(function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // per = 0;
    for (let p of POINTS) p.draw();

    if (isShowAnima) {
        //
    } else {
        while (per <= 1) {
            per += 0.01;
            ComputeBezierCurve(POINTS);
        }
    }

    window.requestAnimationFrame(() => draw());
})();

/** 计算贝塞尔曲线 */
function ComputeBezierCurve(lis) {
    const _lis = [];
    for (let i = 0, len = lis.length - 1; i < len; i++) {
        const x = (lis[i].pos.x + (lis[i + 1].pos.x - lis[i].pos.x) * per) | 0;
        const y = (lis[i].pos.y + (lis[i + 1].pos.y - lis[i].pos.y) * per) | 0;
        _lis.push(new ControlPoints({ x, y }));
    }
    if (_lis.length == 1) {
        drawBezierCurve(_lis[0].pos);
    } else {
        return ComputeBezierCurve(_lis);
    }
}

function drawBezierCurve(p) {
    bgx.beginPath();
    bgx.lineWidth = 1;
    bgx.strokeStyle = '#564';
    bgx.moveTo(lastPoint.x, lastPoint.y);
    bgx.lineTo(p.x, p.y);
    bgx.stroke();
    lastPoint = { ...p };
}
