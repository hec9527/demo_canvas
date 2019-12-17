/**
 * @author    hec9527
 * @time      2019-12-16
 * @change    2019-12-16
 * @description
 *
 *   1, canvas截图并且保存到本地
 *   2，两种API实现保存到本地（同步Vs异步）
 */

class CanvasSnap {
    constructor(elID = 'canvas') {
        this.canvas =
            document.getElementById(elID) ||
            function() {
                const el = document.createElement('canvas');
                el.style.width = '800px';
                el.style.height = '450px';
                el.style.background = 'rgba(0, 0, 0, 0.3)';
                el.width = 800;
                el.height = 450;
                document.getElementsByTagName('body')[0].appendChild(el);
                return el;
            };
        this.ctx = this.canvas.getContext('2d');
        this.btnBlob = document.getElementById('blob');
        this.btnToDataURL = document.getElementById('toDataURL');
        this.imgSrc = '../bg.png';

        // 事件监听
        this.btnBlob.onclick = e => {
            // 点击
        };

        this.btnToDataURL.onclick = e => {
            // 点击
        };
    }

    DrawImage() {
        const img = document.createElement('img');
        img.onload = () => {
            this.ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        };
        img.src = this.imgSrc;
    }
}

const snap = new CanvasSnap();

snap.DrawImage();
