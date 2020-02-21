/**
 * @author      hec9527
 * @time        2020-1-22
 * @change      2920-2-21
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
            container: document.getElementById('container'),
            canvas_main: document.querySelector('#canvas-game'),
            canvas_level: document.querySelector('#canvas-level'),
            btn_begin: document.querySelector('.btn.begin'),
            btn_level: document.querySelector('.btn.level'),
            btn_change: document.querySelector('.btn.change'),
            btn_history: document.querySelector('.btn.history'),
            btn_close_level: document.querySelector('.level-close'),
            btn_ok_level: document.querySelector('.level-set'),
            cover_bg: document.querySelectorAll('.bg'),
            cover_level: document.querySelector('.wraper-level'),
            cover_select: document.querySelector('.wraper-image'),
            level_input: document.querySelector('.level-input'),
            level_value: document.querySelector('.level-value')
        };

        // arguments
        this.args = {
            history: {},
            level: 1,
            levelMin: 1,
            levelMax: 7,
            levelOption: 1,
            step: 0
        };

        this.img = undefined;
        this.ctx = this.el.canvas_main.getContext('2d');
        this.argsBack = Object.assign({}, this.args);

        // imgs ， optional image src ，it mabey come from website or localhost
        this.imgs = [
            './images/1.jpg',
            './images/1.png',
            './images/2.jpg',
            './images/3.jpg',
            './images/4.jpg'
        ];

        // call it
        this.init();
        this.render();
    }

    init() {
        this.img = this.img || this.imgs[0];
        this.args = Object.assign({}, this.argsBack);
        this.initElement();
        this.bindEvent();
        this.setBackgroundImages();
        this.flushLevel();
    }

    initElement() {
        this.el.cover_select.innerHTML = '';
        this.imgs.forEach(url => {
            const el = document.createElement('img');
            el.onload = () =>
                (this.el.cover_select.innerHTML += `<div class="images" style="background-image: url(${url});"><i class="fa fa-check" data-src="${url}"></i></div>`);
            el.src = url;
        });
    }

    bindEvent() {
        // 事件委托  单击
        this.el.container.addEventListener('click', e => {
            if (e.target === this.el.btn_begin) {
                this.init();
            } else if (e.target === this.el.btn_level) {
                this.el.cover_level.classList.remove('hide') || this.flushLevel();
            } else if (e.target === this.el.btn_change) {
                this.el.cover_select.classList.remove('hide') || this.setBackgroundImages();
            } else if (e.target === this.btn_history) {
                console.log(4);
            } else if (e.target === this.el.btn_ok_level) {
                this.el.cover_level.classList.add('hide');
                this.args.level = this.args.levelOption;
            } else if (e.target.classList.contains('fa')) {
                const src = e.target.getAttribute('data-src');
                if (src) {
                    this.img = src;
                    this.setBackgroundImages();
                    this.el.cover_select.classList.add('hide');
                }
            } else if (e.target === this.el.btn_close_level) {
                this.args.levelOption = 1;
                this.el.cover_level.classList.add('hide');
            }
        });

        // 预览当前使用的图片
        this.el.container.addEventListener('mousemove', e => {
            if (e.target.tagName === 'I') {
                const src = e.target.getAttribute('data-src');
                src && this.setBackgroundImages(src);
            }
        });

        this.el.cover_select.addEventListener('dblclick', () => {
            this.el.cover_select.classList.add('hide');
        });

        // 难度变动
        this.el.level_input.addEventListener('input', e => {
            this.args.levelOption = e.target.value;
            this.el.level_value.innerHTML = e.target.value;
            this.flushLevel();
        });
    }

    setBackgroundImages(src) {
        if (src) {
            return (this.el.cover_select.style = `background-image: url(${src})`);
        }

        Array.from(this.el.cover_bg).forEach(item => {
            item.style = `background-image: url(${this.img})`;
        });
    }

    // cover 剪切图片
    clipImage(img) {}

    sortIt(arr) {}

    flushLevel() {}

    render() {}
    // getLocalRecored() {
    //     const result = localStorage.getItem('history');
    //     if (result) {
    //         if (result instanceof Object) {
    //             return result;
    //         } else {
    //             return JSON.parse(result);
    //         }
    //     }
    // }

    // setLocalRecored(rec) {
    //     localStorage.setItem('history', rec instanceof Object ? JSON.stringify(res) : String(rec));
    // }
}

const tutu = new Pintu();
