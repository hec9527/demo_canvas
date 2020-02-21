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
        // 独立出来el
        this.el = {
            canvas_main: document.querySelector('#canvas-game'),
            canvas_level: document.querySelector('#canvas-level'),
            btn_begin: document.querySelector('.btn.begin'),
            btn_level: document.querySelector('.btn.level'),
            btn_change: document.querySelector('.btn.change'),
            btn_history: document.querySelector('.btn.history'),
            btn_close_tooltip: document.querySelector('.tip.tip-close'),
            btn_close_select: document.querySelector('.level-close'),
            btn_ok_level: document.querySelector('.level-set'),
            cover_all: document.querySelectorAll('.option'),
            cover_level: document.querySelector('.option.wraper-level'),
            cover_select: document.querySelector('.option.wraper-image'),
            cover_tooltip: document.querySelector('.option.wraper-tooltip')
        };

        this.canvas = document.getElementById('canvas-game');
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
            if (e.target.classList.contains('begin')) {
                // 开始游戏
                this.args = Object.assign({}, this.argsBack);
                this.init();
            } else if (e.target.classList.contains('level')) {
                // 设置难度
                this.el.cover_level.classList.remove('hide');
                this.flushLevel();
            } else if (e.target.classList.contains('change')) {
                // 修改使用的图片
                this.setBackgroundImages();
                this.el.cover_select.classList.remove('hide');
            } else if (e.target.classList.contains('history')) {
                // 历史记录
                console.log(4);
            } else if (
                e.target.classList.contains('level-set') ||
                e.target.offsetParent.classList.contains('level-set')
            ) {
                // 设置当前的等级
                this.args.level = this.args.levelOption;
                this.el.cover_level.classList.add('hide');
                this.newTips(`当前难度等级为 ${this.args.level}`, 1500);
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
                const el = document.getElementsByClassName('wraper-tooltip')[0];
                el.classList.add('hide');
            }
        });

        // 预览当前使用的图片
        // document.getElementsByClassName('glass-bg')[0].addEventListener('mouseover', e => {
        //     const src = e.target.offsetParent.getAttribute('data-src');
        //     if (src) {
        //         this.setBackgroundImages(src);
        //     }
        // });

        // 难度变动
        document.getElementsByClassName('level-value')[0].addEventListener('input', e => {
            const value = parseInt(e.target.value);
            e.target.title = this.args.levelOption = value;
            this.flushLevel();
        });

        // call it
        this.init();
        this.render();
        // this.newTips('部分素材需要联网获取，并确保网络畅通');
    }

    init() {
        this.args.currentImg = this.imgs[0];
        this.initElement();
        this.setBackgroundImages();
        this.flushLevel();
    }

    // cover 剪切图片
    clipImage(img) {}

    sortIt(arr) {}

    flushLevel() {}

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

    initElement() {
        // document.getElementsByClassName('glass-bg')[0].innerHTML = '';
        // this.imgs.forEach(item => {
        //     const el = document.createElement('img');
        //     el.onload = () => {
        //         const node = document.createElement('div');
        //         node.classList.add('select-box');
        //         node.setAttribute('data-src', item);
        //         node.style = `background-image: url(${item})`;
        //         node.innerHTML = '<i class="fa fa-check"></i></div>';
        //         document.getElementsByClassName('glass-bg')[0].appendChild(node);
        //     };
        //     el.src = item;
        // });
    }

    setBackgroundImages(bg) {
        if (bg) {
            return (this.el.cover_select.style = `background-image: url(${bg})`);
        }

        // Array.from(this.el.cover_all).forEach(item => {
        //     item.style = `background-image: url(${this.args.currentImg})`;
        // });
    }

    render() {}
    // render() {
    //     this.canvas.width = this.width;

    //     // 更新
    //     window.requestAnimationFrame(() => this.render());
    // }
}

const tutu = new Pintu();

// document.getElementById('xx').addEventListener('click', e => {
//     console.log(e);
// });

// document.getElementsByTagName('input')[0].addEventListener('change', e => {
//     console.log(e);
// });

function show() {
    console.log(arguments);
}

// function foo(callback = () => {}) {
//     return new Promise((res, rej) => {
//         setTimeout(() => {
//             callback(1, 2, 3, 4, 5, 6, 7, 8);
//         }, 1000);
//     });
// }

// function show(...argus) {
//     console.log(argus);
// }

// foo(show);
