/**
 * @author      hec9527
 * @time        2020-1-22
 * @change      2920-1-23
 * @description
 *    拼图小游戏
 *        基于canvas制作
 *        随机打乱顺序，采用洗牌算法，公平公正迅速
 *        采用逆序算法，确保每次生成的随机序列都有解
 *
 *
 *       后期修正：
 *
 *          1，  动画效果
 *          2，  bug调试
 *          3，  代码优化/重构
 *          4，  试玩
 */

/**
 * 拼图
 */
class Pintu {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // el
        this.els = {
            begin: document.getElementsByClassName('begin')[0],
            level: document.getElementsByClassName('level')[0],
            change: document.getElementsByClassName('change')[0],
            history: document.getElementsByClassName('history')[0],
            wraper: document.getElementsByClassName('img-select')[0],
            wraperBg: document.getElementsByClassName('img-select-cover')[0],
            wraperLv: document.getElementsByClassName('level-change')[0],
            closeLv: document.getElementsByClassName('level-close')[0],
            range: document.getElementsByClassName('level-value')[0],
            setLv: document.getElementsByClassName('level-set')[0],
            wraperTip: document.getElementsByClassName('tooltip')[0],
            toolTip: document.getElementsByClassName('tip content')[0],
            toolOk: document.getElementsByClassName('tip close')[0],
            steps: document.getElementsByClassName('steps')[0]
        };

        // arguments
        this.args = {
            history: {},
            currentImg: '',
            level: 1,
            levelMin: 1,
            levelMax: 7,
            levelOption: 1,
            scope: 0
        };

        // 备份
        this.argsBack = Object.assign({}, this.args);

        // imgs ， optional image src ，it mabey come from website or localhost
        this.imgs = [
            './images/1.jpg',
            './images/1.png',
            './images/2.jpg',
            './images/3.jpg',
            './images/4.jpg'
        ];

        // add event listener
        // 开始游戏
        this.els.begin.addEventListener('click', e => {
            this.els.begin.innerHTML = '重新开始';
            this.args = Object.assign({}, this.argsBack);
            this.init();
        });
        // 修改游戏难度
        this.els.level.addEventListener('click', e => {
            this.els.wraperLv.classList.remove('hide');
        });
        // 修改背景图
        this.els.change.addEventListener('click', e => {
            this.setBackgroundImages();
            this.els.wraperBg.classList.remove('hide');
        });
        // 历史最高
        this.els.history.addEventListener('click', e => {
            console.log(4);
        });
        // 鼠标悬浮预览
        this.els.wraper.addEventListener('mouseover', e => {
            const src = e.target.offsetParent.getAttribute('data-src');
            if (src) {
                this.setBackgroundImages(src);
            }
        });
        // 修改背景框的图片src
        this.els.wraper.addEventListener('click', e => {
            const src = e.target.offsetParent.getAttribute('data-src');
            if (src) {
                this.args.currentImg = src;
                this.setBackgroundImages();
                this.els.wraperBg.classList.add('hide');
            }
        });
        // 设置难度等级的界面
        this.els.setLv.addEventListener('click', e => {
            this.flushLevel();
            this.args.level = this.args.levelOption;
            this.els.wraperLv.classList.add('hide');
        });
        this.els.closeLv.addEventListener('click', e => {
            this.args.levelOption = 1;
            this.els.wraperLv.classList.add('hide');
        });
        // 提示信息框
        this.els.toolOk.addEventListener('click', e => {
            this.els.wraperTip.classList.add('hide');
        });
        // 难度变动
        this.els.range.addEventListener('change', e => {
            const value = parseInt(e.target.value);
            this.els.range.title = value;
            this.args.levelOption = value;
            this.flushLevel();
        });

        // call it
        this.init();
        this.resize();
        this.render();
    }

    init() {
        this.args.currentImg = this.imgs[0];
        this.initElement();
        this.setBackgroundImages();
        this.flushLevel();
        // this.newTips('hello world');
    }

    flushLevel() {
        const canvas = document.getElementsByClassName('canvas-level')[0];
        const ctx = canvas.getContext('2d');
        const el = document.createElement('img');
        const canvas_w = (canvas.width = canvas.offsetWidth);
        const canvas_h = (canvas.height = canvas.offsetHeight);

        el.onload = () => {
            const img_w = el.width;
            const img_h = el.height;
            const left = (canvas_w - img_w) / 2;
            const top = (canvas_h - img_h) / 2;
            const level = this.args.levelOption + 2;

            // 清除绘制区域
            canvas.width = canvas.width;

            // 居中绘制图片
            ctx.save();
            ctx.strokeStyle = '#fff';
            ctx.drawImage(el, 0, 0, img_w, img_h, left, top, img_w, img_h);

            // 绘制边界线
            for (let i = 1; i < level; i++) {
                ctx.beginPath();
                ctx.moveTo(0, (canvas_h / level) * i);
                ctx.lineTo(canvas_w, (canvas_h / level) * i);
                ctx.moveTo((canvas_w / level) * i, 0);
                ctx.lineTo((canvas_w / level) * i, canvas_h);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        };
        el.src = this.args.currentImg;
    }

    getLocalRecored() {
        const result = localStorage.getItem('history');
        if (result) {
            if (result instanceof Object) {
                return result;
            } else {
                return JSON.parse(result);
            }
        }
    }

    setLocalRecored(rec) {
        localStorage.setItem('history', rec instanceof Object ? JSON.stringify(res) : rec);
    }

    newTips(msg) {
        this.els.toolTip.innerHTML = msg;
        this.els.wraperTip.classList.remove('hide');
    }

    initElement() {
        this.els.wraper.innerHTML = '';
        this.imgs.forEach(item => {
            const el = document.createElement('img');
            el.onload = () => {
                const node = document.createElement('div');
                node.classList.add('select-box');
                node.setAttribute('data-src', item);
                node.style = `background-image: url(${item})`;
                node.innerHTML = '<i class="fa fa-check"></i></div>';
                this.els.wraper.appendChild(node);
            };
            el.src = item;
        });
    }

    setBackgroundImages(bg = this.args.currentImg) {
        this.els.wraperBg.style = `background-image: url(${bg})`;
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        this.canvas.width = this.width;

        // 更新

        window.requestAnimationFrame(() => this.render());
    }
}

const tutu = new Pintu();
