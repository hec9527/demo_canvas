class Pintu {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // el
        this.btns = {
            begin: document.getElementsByClassName('begin')[0],
            level: document.getElementsByClassName('level')[0],
            change: document.getElementsByClassName('change')[0],
            history: document.getElementsByClassName('history')[0],
            wraper: document.getElementsByClassName('img-select')[0],
            back: document.getElementsByClassName('img-select-cover')[0]
        };

        // arguments
        this.args = {
            history: {},
            currentImg: ''
        };

        // imgs
        this.imgs = [
            './images/1.jpg',
            './images/1.png',
            './images/2.jpg',
            './images/3.jpg',
            './images/4.jpg'
        ];

        // add event listener
        this.btns.begin.addEventListener('click', e => {
            console.log(1);
        });
        this.btns.level.addEventListener('click', e => {
            console.log(2);
        });
        this.btns.change.addEventListener('click', e => {
            console.log(3);
        });
        this.btns.history.addEventListener('click', e => {
            console.log(4);
        });

        // call it
        this.resize();
        this.render();
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
