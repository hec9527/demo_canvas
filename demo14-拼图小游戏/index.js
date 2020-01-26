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
 *          0，  图片的cover模式
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

        // 事件委托
        document.getElementById('container').addEventListener('click', e => {
            console.log(e.target.classList);

            if (e.target.classList.contains('begin')) {
                // 开始游戏
                e.target.innerHTML = '重新开始';
                this.args = Object.assign({}, this.argsBack);
                this.init();
            } else if (e.target.classList.contains('level')) {
                // 设置难度
                document.getElementsByClassName('wraper-level')[0].classList.remove('hide');
                this.flushLevel();
            } else if (e.target.classList.contains('change')) {
                // 修改使用的图片
                this.setBackgroundImages();
                document.getElementsByClassName('wraper-image')[0].classList.remove('hide');
            } else if (e.target.classList.contains('history')) {
                // 历史记录
                console.log(4);
            } else if (
                e.target.classList.contains('level-set') ||
                e.target.offsetParent.classList.contains('level-set')
            ) {
                // 设置当前的等级
                this.args.level = this.args.levelOption;
                document.getElementsByClassName('wraper-level')[0].classList.add('hide');
            } else if (
                e.target.classList.contains('select-box') ||
                e.target.offsetParent.classList.contains('select-box')
            ) {
                // 设置当前使用的图片
                const src = e.target.offsetParent.getAttribute('data-src');
                if (src) {
                    this.args.currentImg = src;
                    this.setBackgroundImages();
                    document.getElementsByClassName('wraper-image')[0].classList.add('hide');
                }
            } else if (e.target.classList.contains('level-close')) {
                // 关闭难度设置界面
                this.args.levelOption = 1;
                document.getElementsByClassName('wraper-level')[0].classList.add('hide');
            } else if (e.target.classList.contains('tip-close')) {
                // 关闭消息提示界面
                document.getElementsByClassName('wraper-tooltip')[0].classList.add('hide');
            }
        });

        // 预览当前使用的图片
        document.getElementsByClassName('glass-bg')[0].addEventListener('mouseover', e => {
            const src = e.target.offsetParent.getAttribute('data-src');
            if (src) {
                this.setBackgroundImages(src);
            }
        });

        // 难度变动
        document.getElementsByClassName('level-value')[0].addEventListener('change', e => {
            const value = parseInt(e.target.value);
            e.target.title = this.args.levelOption = value;
            this.flushLevel();
        });

        // call it
        this.init();
        this.resize();
        this.render();
        this.newTips('hello wrold');
    }

    init() {
        this.args.currentImg = this.imgs[0];
        this.initElement();
        this.setBackgroundImages();
        this.flushLevel();
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
        document.getElementsByClassName('tip-content')[0].innerHTML = msg;
        document.getElementsByClassName('wraper-tooltip')[0].classList.remove('hide');
    }

    initElement() {
        document.getElementsByClassName('glass-bg')[0].innerHTML = '';
        this.imgs.forEach(item => {
            const el = document.createElement('img');
            el.onload = () => {
                const node = document.createElement('div');
                node.classList.add('select-box');
                node.setAttribute('data-src', item);
                node.style = `background-image: url(${item})`;
                node.innerHTML = '<i class="fa fa-check"></i></div>';
                document.getElementsByClassName('glass-bg')[0].appendChild(node);
            };
            el.src = item;
        });
    }

    setBackgroundImages(bg = this.args.currentImg) {
        document.getElementsByClassName('wraper-image')[0].style = `background-image: url(${bg})`;
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
