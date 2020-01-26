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
            setLv: document.getElementsByClassName('level-set')[0],
            wraperTip: document.getElementsByClassName('tooltip')[0],
            toolTip: document.getElementsByClassName('tip content')[0],
            toolOk: document.getElementsByClassName('tip close')[0]
        };

        // arguments
        this.args = {
            history: {},
            currentImg: '',
            level: 1,
            levelMin: 1,
            levelMax: 7
        };

        // imgs ， optional image src ，it mabey come from website or localhost
        this.imgs = [
            './images/1.jpg',
            './images/1.png',
            './images/2.jpg',
            './images/3.jpg',
            './images/4.jpg'
        ];

        // add event listener
        this.els.begin.addEventListener('click', e => {
            console.log(1);
        });
        this.els.level.addEventListener('click', e => {
            this.els.wraperLv.classList.remove('hide');
        });
        this.els.change.addEventListener('click', e => {
            this.setBackgroundImages();
            this.els.wraperBg.classList.remove('hide');
        });
        this.els.history.addEventListener('click', e => {
            console.log(4);
        });
        this.els.wraper.addEventListener('mouseover', e => {
            const src = e.target.offsetParent.getAttribute('data-src');
            if (src) {
                this.setBackgroundImages(src);
            }
        });
        this.els.wraper.addEventListener('click', e => {
            const src = e.target.offsetParent.getAttribute('data-src');
            if (src) {
                this.args.currentImg = src;
                this.setBackgroundImages();
                this.els.wraperBg.classList.add('hide');
            }
        });
        this.els.setLv.addEventListener('click', e => {
            console.log('set level');
        });
        this.els.closeLv.addEventListener('click', e => {
            this.els.wraperLv.classList.add('hide');
        });

        this.els.toolOk.addEventListener('click', e => {
            this.els.wraperTip.classList.add('hide');
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
        // this.newTips('hello world');
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
        localStorage.setItem('history', JSON.stringify(res));
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
