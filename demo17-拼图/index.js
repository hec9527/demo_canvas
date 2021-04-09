/**
 * 拼图小游戏
 * @author  hec9527
 * @time    2020
 */

const SCREEN_WIDTH = 516;
const SCREEN_HEIGHT = 516;

window.shuffle = false;

/**
 * 从DOM中通过ID获取 canvas 并且设定宽高
 * 或者 生成一个指定宽高的离屏canvas
 */
function getCanvas(el, width, height) {
    const canvas = el ? document.getElementById(el) : document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width || canvas.width;
    canvas.height = height || canvas.height;

    return { canvas, ctx };
}

/**
 * 将给定图片剪切为 canvas 的宽高，截取图片中间部分
 * @img {string} img 图片的src
 */
async function getCutedPicture(img) {
    return await new Promise((res) => {
        const Img = new Image();
        Img.onload = () => {
            const w = Img.width,
                h = Img.height,
                min = Math.min(w, h),
                { canvas, ctx } = getCanvas(undefined, min, min);
            ctx.drawImage(Img, (w - min) / 2, (h - min) / 2, min, min, 0, 0, min, min); // cover
            res(canvas);
        };
        Img.src = img;
    });
}

/**
 * 基于canvas的拼图小游戏
 */
class Puzzle {
    constructor(row, img) {
        const { canvas, ctx } = getCanvas('canvas', SCREEN_WIDTH, SCREEN_HEIGHT);
        this.canvas = canvas;
        this.ctx = ctx;
        this.row = row;
        this.img = this.resizeImg(img);
        this.grid = null;
        this.blockIndex = row ** 2 - 1;
        this.step = 0;
        this.isOver = false;
        this.isShuffled = false;
        this.isAnimation = false;
        this.stepEl = document.getElementById('step');
        this.canvas.width = this.canvas.width;

        this.init();
        window.shuffle ? this.shuffle() : this.moveStep();
        // this.isShuffled = true;
    }

    init() {
        const w = (SCREEN_WIDTH / this.row) | 0,
            h = (SCREEN_HEIGHT / this.row) | 0;
        const getThumb = (row, col) => {
            const { canvas, ctx } = getCanvas(undefined, w, h);
            ctx.drawImage(this.img, col * w, row * h, w, h, 0, 0, w, h);
            return canvas;
        };

        this.grid = [];

        for (let row = 0; row < this.row; row++) {
            const arr = [];
            for (let col = 0; col < this.row; col++) {
                const thumb = {
                    index: row * this.row + col,
                    row,
                    col,
                    w,
                    h,
                    x: col * w,
                    y: row * h,
                    thumb: getThumb(row, col),
                };
                arr.push(thumb);
                this.draw(thumb);
            }
            this.grid.push(arr);
        }

        for (let row = 0; row < this.row; row++) {
            for (let col = 0; col < this.row; col++) {
                const thumb = this.grid[row][col];
                thumb.top = row === 0 ? null : this.grid[row - 1][col];
                thumb.left = col === 0 ? null : this.grid[row][col - 1];
                thumb.right = col === this.row - 1 ? null : this.grid[row][col + 1];
                thumb.bottom = row === this.row - 1 ? null : this.grid[row + 1][col];
            }
        }
    }

    animation(img, sourcePos, targetPos, w, h, callback) {
        if ((sourcePos[0] === targetPos[0] && sourcePos[1] === targetPos[1]) || this.isOver) {
            callback();
            return;
        }
        this.ctx.clearRect(...sourcePos, w, h);

        const dx = targetPos[0] - sourcePos[0];
        const dy = targetPos[1] - sourcePos[1];

        if (this.isShuffled || window.shuffle) {
            sourcePos[0] = Math.abs(dx) < 1 ? targetPos[0] : sourcePos[0] + dx / 7;
            sourcePos[1] = Math.abs(dy) < 1 ? targetPos[1] : sourcePos[1] + dy / 7;
        } else {
            sourcePos[0] = Math.abs(dx) < 5 ? targetPos[0] : sourcePos[0] + (dx > 0 ? 5 : -5);
            sourcePos[1] = Math.abs(dy) < 5 ? targetPos[1] : sourcePos[1] + (dy > 0 ? 5 : -5);
        }

        this.ctx.drawImage(img, sourcePos[0] + 1, sourcePos[1] + 1, w - 2, h - 2);
        window.requestAnimationFrame(() => this.animation(...arguments));
    }

    move(dir, callback = () => {}) {
        if (this.isAnimation || this.isOver) return callback(false);

        const findThumb = () => {
            for (let row = 0; row < this.row; row++) {
                for (let col = 0; col < this.row; col++) {
                    const thumb = this.grid[row][col];
                    if (thumb[dir] && thumb[dir].index === this.blockIndex) {
                        return thumb;
                    }
                }
            }
        };

        const source = findThumb();
        const target = source && source[dir];

        if (!source || !target) return callback(false);

        const sourcePos = [source.x, source.y];
        const targetPos = [target.x, target.y];

        this.isAnimation = true;
        if (this.isShuffled) {
            this.step += 1;
            this.stepEl.innerHTML = this.step;
        }

        this.animation(source.thumb, sourcePos, targetPos, source.w, source.h, () => {
            const { index, thumb } = source;
            source.index = target.index;
            source.thumb = target.thumb;
            target.index = index;
            target.thumb = thumb;

            this.isAnimation = false;

            if (this.isShuffled) {
                console.log('animation over', this.grid);
                this.check();
            }
            callback(true);
        });
    }

    tap(row, col) {
        ['top', 'right', 'bottom', 'left'].forEach((dir) => {
            if (this.grid[row][col][dir] && this.grid[row][col][dir].index === this.blockIndex) {
                return this.move(dir);
            }
        });
    }

    /** 检测洗牌之后的顺序是否有解 */
    shuffleCheck(arr) {
        let outOfOrder = 0;
        const exChange = (index) => ([arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]);

        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i].index > arr[j].index) {
                    outOfOrder++;
                }
            }
        }
        console.log('outOfOrder:', outOfOrder);
        if (outOfOrder % 2 !== 0) {
            exChange(~~(Math.random() * (this.row ** 2 - 2)));
            this.shuffleCheck(arr);
        } else {
            this.shuffleMove(arr);
        }
    }

    shuffleMove(arr) {
        let overNum = 0;
        for (let row = 0; row < this.row; row++) {
            for (let col = 0; col < this.row; col++) {
                const index = row * this.row + col;
                const block = this.grid[row][col];

                this.animation(
                    arr[index].thumb,
                    [arr[index].x, arr[index].y],
                    [block.x, block.y],
                    block.w,
                    block.h,
                    () => {
                        ++overNum;
                        block.index = arr[index].index;
                        block.thumb = arr[index].thumb;
                        // block.x = arr[index].x;
                        // block.y = arr[index].y;
                        if (overNum > this.blockIndex) {
                            setTimeout(() => (this.isShuffled = true), 200);
                        }
                        if (block.index === this.blockIndex) {
                            this.ctx.clearRect(block.x, block.y, block.w, block.h);
                        }
                    }
                );
            }
        }
    }

    /** 使用洗牌算法，公平公正 */
    shuffle() {
        const arr = this.grid
            .reduce((pre, cur) => pre.concat(cur), [])
            .map((item) => ({ ...item }));

        for (let i = this.row * this.row - 1; i >= 0; i--) {
            const rand = ~~(Math.random() * i);
            [arr[i], arr[rand]] = [arr[rand], arr[i]];
        }

        this.shuffleCheck(arr);
    }

    moveStep() {
        let step = ((Math.random() * 3 * this.row) | 0) + this.row ** 2;
        let lDir = undefined;

        console.log(`steps: ${step}`);

        const dirs = ['top', 'right', 'bottom', 'left'];
        const isOppositeDir = (dir) => {
            return (
                (dir === 'top' && lDir === 'bottom') ||
                (dir === 'bottom' && lDir === 'top') ||
                (dir === 'left' && lDir === 'right') ||
                (dir === 'right' && lDir === 'left')
            );
        };

        const move = () => {
            let dir = dirs[(Math.random() * 4) | 0];
            if (isOppositeDir(dir)) return move();
            this.move(dir, (flag) => {
                if (step > 0) {
                    setTimeout(() => !this.isOver && move(), 0);
                } else {
                    this.isShuffled = true;
                }
                if (flag) {
                    step--;
                    lDir = dir;
                }
            });
        };
        move();
    }

    check() {
        for (let row = 0; row < this.row; row++) {
            for (let col = 0; col < this.row; col++) {
                if (this.grid[row][col].index !== row * this.row + col) {
                    return false;
                }
            }
        }
        window.toasts(
            undefined,
            `恭喜你通关啦，当前步数：${this.step}，尝试增加难度或者用更少的步数通关吧`,
            5000
        );
        this.isOver = true;
    }

    resizeImg(img) {
        const { canvas, ctx } = getCanvas(undefined, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        return canvas;
    }

    changeImg(img) {
        this.img = this.resizeImg(img);
        this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.grid.forEach((arr) => arr.forEach((thumb) => this.draw(thumb)));
    }

    draw(thumb) {
        if (thumb.index === this.blockIndex) return false;
        this.ctx.drawImage(thumb.thumb, thumb.x + 1, thumb.y + 1, thumb.w - 2, thumb.h - 2);
    }
}

(async function () {
    const btns = document.querySelectorAll('.btns'),
        modals = document.querySelectorAll('.modals'),
        closes = document.querySelectorAll('.close'),
        upload = document.querySelectorAll('.upload')[0],
        imgbox = document.querySelectorAll('.imgbox')[0],
        toast = document.querySelector('.toast'),
        upfile = document.getElementById('upload'),
        diffi = document.querySelector('.diffi'),
        imgs = [
            '/images/bilibili.jpg',
            '/images/325112.jpg',
            '/images/325098.jpg',
            '/images/323083.jpg',
        ];

    let timer = null,
        puzzle = null,
        currentImg = null,
        difficult = 1; // 难度改变

    const init = () => {
        imgs.forEach((src) => {
            const el = document.createElement('div');
            el.setAttribute('class', 'imgs');
            el.setAttribute('style', `background: url('${src}')`);
            el.setAttribute('data-src', src);
            imgbox.insertBefore(el, upload);
            el.addEventListener('click', async (e) => {
                await selectImg(e.target.dataset.src);
                closes[0].click();
                start();
            });
        });
    };

    const selectImg = async (_img = imgs[0]) => {
        const img = await getCutedPicture(_img);
        currentImg = img;
        changePreview();
    };

    const changePreview = () => {
        const { canvas, ctx } = getCanvas('preview', 240, 240);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentImg, 0, 0, currentImg.width, currentImg.height, 0, 0, 240, 240);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = '1px';
        for (let i = 1; i < difficult + 3; i++) {
            ctx.moveTo(0, i * (240 / (difficult + 2)));
            ctx.lineTo(240, i * (240 / (difficult + 2)));
            ctx.moveTo(i * (240 / (difficult + 2)), 0);
            ctx.lineTo(i * (240 / (difficult + 2)), 240);
        }
        ctx.stroke();
    };

    const toasts = (window.toasts = (title, content, time = 5000) => {
        window.clearTimeout(timer);
        toast.classList.add('hide');
        toast.classList.remove('hide');
        title && (toast.getElementsByClassName('title')[0].innerHTML = title);
        content && (toast.getElementsByClassName('content')[0].innerHTML = content);
        timer = window.setTimeout(() => {
            toast.style.animation = 'fadeout 275ms linear';
            setTimeout(() => toast.classList.add('hide'), 275);
        }, time);
    });

    const start = () => {
        if (puzzle && !puzzle.isOver) {
            puzzle.isOver = true;
            return setTimeout(() => start(), 300);
        }
        puzzle = new Puzzle(difficult + 2, currentImg);
        document.addEventListener('keydown', (e) => {
            const dir = {
                ArrowUp: 'top',
                ArrowRight: 'right',
                ArrowDown: 'bottom',
                ArrowLeft: 'left',
            }[e.key];
            if (dir) {
                e.preventDefault();
                puzzle.isShuffled && puzzle.move(dir);
            }
        });
        document.addEventListener('click', (e) => {
            const row = (e.layerY / (SCREEN_HEIGHT / (difficult + 2))) | 0;
            const col = (e.layerX / (SCREEN_WIDTH / (difficult + 2))) | 0;
            puzzle.isShuffled && puzzle.tap(row, col);
        });
    };

    const changeDiffi = (value) => {
        const { ctx } = getCanvas('diffiPreview', 500, 500);
        diffi.dataset.value = value | 0;
        difficult = value | 0;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = '1px';
        ctx.clearRect(0, 0, 500, 500);
        console.log(`当前难度:${value}`);
        ctx.drawImage(currentImg, 0, 0, currentImg.width, currentImg.height, 0, 0, 500, 500);
        for (let i = 1; i < difficult + 2; i++) {
            ctx.moveTo(0, i * (500 / (difficult + 2)));
            ctx.lineTo(500, i * (500 / (difficult + 2)));
            ctx.moveTo(i * (500 / (difficult + 2)), 0);
            ctx.lineTo(i * (500 / (difficult + 2)), 500);
        }
        ctx.stroke();
        start();
        changePreview();
    };

    init();
    await selectImg();
    // start();
    toasts('操作指南', '请使用方向按键↑↓←→或者点击移动的图块', 5000);
    console.log('修改"window.shuffle: true;" 使用洗牌的方式打乱卡片，默认使用移动的方式');
    changeDiffi(1);

    btns[0].addEventListener('click', () => start());
    btns[1].addEventListener('click', () => modals[0].classList.remove('hide'));
    btns[2].addEventListener('click', () => modals[1].classList.remove('hide'));

    diffi.addEventListener('change', async (e) => changeDiffi(e.target.value));

    upfile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        if (!file) return;
        fileReader.onload = (e) => {
            let img = new Image();
            img.onload = function () {
                const { canvas, ctx } = getCanvas(undefined, img.width, img.height);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const el = document.createElement('div');
                    el.setAttribute('class', 'imgs');
                    el.setAttribute('style', `background: url('${URL.createObjectURL(blob)}')`);
                    el.setAttribute('data-src', `${URL.createObjectURL(blob)}`);
                    imgbox.insertBefore(el, upload);
                    el.addEventListener('click', async (e) => {
                        await selectImg(e.target.dataset.src);
                        closes[0].click();
                        start();
                    });
                });
            };
            img.src = e.target.result;
        };
        fileReader.readAsDataURL(file);
    });

    closes.forEach((close) => {
        close.addEventListener('click', (e) => {
            const findEl = (el) => (el.classList.contains('modals') ? el : findEl(el.parentNode));
            findEl(e.target).classList.add('hide');
        });
    });
})();
