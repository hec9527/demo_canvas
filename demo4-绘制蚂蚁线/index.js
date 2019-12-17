/**
 * @author      hec9527
 * @time        2019-12-17
 * @change      2019-12-17
 */
class Antdline {
    constructor(elID = 'canvas') {
        this.canvas =
            document.getElementById(elID) ||
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
        this.lineDash = [8, 4];
        this.ctx.setLineDash(this.lineDash);
        this.ctx.lineDashOffset = 1;

        this.rect = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            show: false
        };
        this.mousePos = { x: 0, y: 0 };
        const self = this;

        this.canvas.addEventListener(
            'mousedown',
            e => {
                window.addEventListener(
                    'mouseup',
                    e => {
                        window.removeEventListener('mousemove', move, false);
                        window.removeEventListener('mousemove', resize, false);
                    },
                    { once: true },
                    false
                );
                if (this.rect.show) {
                    if (
                        this.rect.x < e.layerX &&
                        this.rect.y < e.layerY &&
                        this.rect.x + this.rect.w > e.layerX &&
                        this.rect.y + this.rect.h > e.layerY
                    ) {
                        // 存在蚂蚁线选区 移动
                        this.mousePos.x = e.screenX;
                        this.mousePos.y = e.screenY;
                        window.addEventListener('mousemove', move, false);
                    } else {
                        // 取消显示蚂蚁线选区
                        this.rect.show = false;
                    }
                } else {
                    // 不存在蚂蚁线选区 缩放
                    this.rect.show = true;
                    this.rect.x = e.layerX;
                    this.rect.y = e.layerY;
                    window.addEventListener('mousemove', resize, false);
                }
            },
            false
        );

        // 移动蚂蚁线
        function move(e) {
            let x = self.rect.x + (e.screenX - self.mousePos.x);
            let y = self.rect.y + (e.screenY - self.mousePos.y);

            self.mousePos.x = e.screenX;
            self.mousePos.y = e.screenY;

            x = x <= 0 ? 0 : x;
            x = x + self.rect.w >= self.canvas.width ? self.canvas.width - self.rect.w : x;
            y = y <= 0 ? 0 : y;
            y = y + self.rect.h >= self.canvas.height ? self.canvas.height - self.rect.h : y;

            self.rect.x = x;
            self.rect.y = y;
        }

        // 缩放选取
        function resize(e) {
            self.rect.w = e.layerX - self.rect.x;
            self.rect.h = e.layerY - self.rect.y;
        }

        // lineDash 自动更改
        function changeLineDash() {
            setTimeout(() => {
                self.ctx.lineDashOffset -= 0.1;
                if (self.ctx.lineDashOffset <= 0) {
                    self.ctx.lineDashOffset = self.lineDash[0] + self.lineDash[1];
                }
                changeLineDash();
            }, 10);
        }

        // 绘制
        function draw() {
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.ctx.beginPath();
            if (self.rect.show) {
                self.ctx.moveTo(self.rect.x, self.rect.y);
                self.ctx.lineTo(self.rect.x + self.rect.w, self.rect.y);
                self.ctx.lineTo(self.rect.x + self.rect.w, self.rect.y + self.rect.h);
                self.ctx.lineTo(self.rect.x, self.rect.y + self.rect.h);
                self.ctx.lineTo(self.rect.x, self.rect.y);
            }
            self.ctx.closePath();
            self.ctx.stroke();
            requestAnimationFrame(draw);
        }

        setTimeout(() => {
            changeLineDash();
            draw();
        }, 0);
    }
}

new Antdline();
