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
 *       后期修正：
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
            gameBegin: false,
            history: {},
            level: 1,
            levelMin: 1,
            levelMax: 7,
            levelOption: 1,
            step: 0,
            lis: []
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

    async init() {
        if (!this.img) {
            await this.clipImage(this.imgs[0]);
        }
        this.args = Object.assign({}, this.argsBack);
        this.initList(); // 初始化列表
        this.initElement(); // 初始化所有可选图片
        this.bindEvent(); // 绑定事件
        this.flushLevel();
        this.render();
    }

    initElement() {
        this.el.cover_select.innerHTML = '';
        this.imgs.forEach(url => {
            this.el.cover_select.innerHTML += `<div class="images" style="background-image: url(${url});"><i class="fa fa-check" data-src="${url}"></i></div>`;
        });
    }

    initList() {
        const lis = [];
        const row = (this.args.level | 0) + 2;
        lis.block = row * row; // 最后一个为空白方块
        // 初始化列表
        for (let i = 0; i < lis.block; i++) {
            lis[i] = { t: (i / row) | 0, l: i % row };
        }
        // 建立二维联系
        for (let i = 0; i < lis.block; i++) {
            if (i >= row) {
                lis[i].top = lis[i - row];
            }
            if (i % row !== 0) {
                lis[i].left = lis[i - 1];
            }
            if (i % row !== row - 1) {
                lis[i].right = lis[i + 1];
            }
            if (i < lis.block - row) {
                lis[i].bottom = lis[i + row];
            }
        }
        this.args.lis = lis;
        this.clipImageBlock();
    }

    bindEvent() {
        // 事件委托  单击
        this.el.container.addEventListener('click', e => {
            if (e.target === this.el.btn_begin) {
                e.target.innerHTML = '重新开始';
                this.init();
            } else if (e.target === this.el.btn_level) {
                this.el.cover_level.classList.remove('hide') || this.flushLevel();
            } else if (e.target === this.el.btn_change) {
                this.el.cover_select.classList.remove('hide') || this.setBackgroundImages();
            } else if (e.target === this.el.btn_history) {
                console.log(4);
            } else if (e.target === this.el.btn_ok_level) {
                this.el.cover_level.classList.add('hide');
                this.args.level = this.args.levelOption;
                this.initList();
            } else if (e.target.classList.contains('fa')) {
                const src = e.target.getAttribute('data-src');
                src && this.clipImage(src).then(() => this.el.cover_select.classList.add('hide'));
            } else if (e.target === this.el.btn_close_level) {
                this.args.levelOption = 1;
                this.el.cover_level.classList.add('hide');
            }
        });

        this.el.container.addEventListener('mousemove', e => {
            if (e.target.tagName === 'I') {
                const src = e.target.getAttribute('data-src');
                src && this.setBackgroundImages(src);
            }
        });

        this.el.cover_select.addEventListener('dblclick', () => {
            this.el.cover_select.classList.add('hide');
        });

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

    clipImage(src) {
        const img = document.createElement('img');
        return new Promise((res, rej) => {
            img.onload = async () => {
                const min = Math.min(img.width, img.height);
                const left = (img.width - min) / 2;
                const top = (img.height - min) / 2;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = min;
                canvas.height = min;
                ctx.drawImage(img, left, top, min, min, 0, 0, min, min);
                this.img = await new Promise(res => {
                    canvas.toBlob(blob => {
                        res(URL.createObjectURL(blob));
                    });
                });

                this.setBackgroundImages();
                res();
            };
            img.src = src;
        });
    }

    clipImageBlock() {
        if (!this.img) {
            throw new Error('当前使用图片加载错误， 请检查网络链接状态');
        }
        const img = document.createElement('img');
        return new Promise((res, rej) => {
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const width = img.width;
                const row = this.args.left + 2;
                for (let i = 0; i < this.args.lis.block; i++) {
                    canvas.width = width;
                    ctx.drawImage(
                        img,
                        (i % row) * width,
                        ((i / row) | 0) * width,
                        width,
                        width,
                        0,
                        0,
                        width,
                        width
                    );
                    this.args.lis[i].data = await new Promise(res => {
                        canvas.toBlob(blob => {
                            res(URL.createObjectURL(blob));
                        });
                    });

                    this.args.lis[i].width = width;
                    console.log(this.args.lis[i]);
                }
                res();
            };
            img.src = this.img;
        });
    }

    drawOne(option) {
        this.ctx.drawImage(
            option.img,
            option.l,
            option.t,
            option.width,
            option.width,
            0,
            0,
            option.width,
            option.width
        );
    }

    drawAll() {
        this.args.lis.forEach(item => {
            this.drawOne({
                l: item.l,
                t: item.t,
                img: item.data,
                width: item.width
            });
        });
    }

    // 排序？  自动打乱？
    sortIt(arr) {}

    flushLevel() {}

    render() {
        this.drawAll();
    }
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
