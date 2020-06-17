/**
 * @author     hec9527
 * @time       2020-5-14
 * @description
 *    提高运行效率：  使用clip 之后再 clearReact 就不会清除其它区域的内容了
 *    提高性能，Item只在需要的时候 擦除，不必每次循环都全部擦除
 */

class Tank {}

class EnemyTank extends Tank {
    constructor(word) {
        const image = word.images.images.enemyTank;
        const pos = (() => {
            const random = Math.random();
            return { x: 0, y: random < 0.33 ? 0 : random < 0.66 ? 192 : 384 };
        })();
        const clips = [0, 0];

        super(word, image, pos, clips);

        this.word = word;
        this.camp = 'enemy';
        this.direction = 'bottom';
        this.level = (Math.random * 5) | 0;
        this.reward = Math.random() <= 0.2 ? Math.random() * 3 + 1 : 0;
        this.armor = this.level <= 4 ? 0 : 2;
    }

    die() {
        if (this.reward > 0) {
            this.reward--;
            return new Reward(this.word);
        }
        if (this.armor > 0) {
            return this.armor--;
        }
        this.word.items.delete(this);
    }

    // ! 未完成
    changeClip() {
        const clip = { x: 0, y: 0 };
        const dirs = {
            top: () => {},
            left: () => (clip.y = 6),
            right: () => (clip.y = 2),
            bottom: () => (clip.y = 4),
        };
        dirs[this.direction]();

        if (this.clipIndex === 1) {
            clip.y += 1;
        }

        if (this.level <= 3) {
            clip.x = (this.level - 1) * 2;
        } else {
            this.level === 4 && clip.x === 6;
            this.level === 4 && clip.y === 8;
        }
        i(this.reward !== 0) && (clip.x += 1);
    }

    update() {
        // this.shoot();
        // this.isMoveing = false;
        // if (!this.isMoveing) {
        //     const rand = Math.rand;
        //     const dir = rand < 0.3 ? 'bottom' : rand < 0.55 ? 'left' : rand < 0.8 ? 'right' : 'top';
        //     this.direction = dir;
        //     return this.changeClip();
        // }
        // this.move();
        // this.changeClip();
    }
}

class AllyTank extends Tank {
    // deputy = true 表示为2号玩家
    constructor(word, deputy = false) {
        const image = word.images.images.myTank;
        const pos = { x: deputy ? 240 : 176, y: 416 }; // ! 注意这里的具体数值需要经过测量
        const clip = { x: 0, y: 0 };
        const p1Keys = {
            top: 87,
            left: 65,
            bottom: 83,
            right: 68,
            single: 71,
            double: 72,
            pause: 99,
        };
        const p2Keys = {
            top: 38,
            left: 37,
            right: 39,
            bottom: 40,
            single: 76,
            double: 186,
        };

        super(word, image, pos, clip);
        this.camp = 'ally';
        this.deputy = deputy;
        this.keys = deputy ? p2Keys : p1Keys;
        this.bulletSpeed = 5;

        // ! 临时设置
        this.bulletNum = 3;

        // 初始化属性
        this.changeClip();
    }

    changeClip() {
        const clip = { x: 0, y: 0 };
        const dirs = {
            top: () => {},
            left: () => (clip.y = 6),
            right: () => (clip.y = 2),
            bottom: () => (clip.y = 4),
        };

        clip.x = clip.x + this.level - 1;
        dirs[this.direction]();

        if (this.clipIndex === 1) {
            clip.y++;
        }
        if (this.deputy) {
            clip.x += 4;
        }
        this.clip = { ...clip };
    }

    // 坦克的碰撞检测
    collisionDetection() {
        let detection = false;

        if (collisionBorder(this, this.word)) {
            detection = true;
            return true;
        }

        Array.from(this.word.items).some((item) => {
            if (item === this) return false;
            if (collisionDetectionNextTick(this, item)) {
                detection = true;
                return true;
            }
        });

        return detection;
    }

    update() {
        const keyBorad = this.word.keyBorad;
        const changeDir = (dir) => {
            if (this.direction !== dir) {
                const col = ['top', 'bottom'];
                const row = ['left', 'right'];
                // 90度转向？
                if (!(col.includes(this.direction) && col.includes(dir)) || !(row.includes(this.direction) && row.includes(dir))) {
                    // 没移动到指定位置禁止转向
                    if (
                        (col.includes(this.direction) && this.pos.y % 16 !== 0) ||
                        (row.includes(this.direction) && this.pos.x % 16 !== 0)
                    ) {
                        return false;
                    }
                }
                this.direction = dir;
                this.changeClip();
                return true;
            }
            return false;
        };
        let moving = false;

        // 向上
        if ((keyBorad.hasKey(87) && !this.deputy) || (keyBorad.hasKey(38) && this.deputy)) {
            moving = true;
            changeDir('top');
        }

        // 向下
        if ((keyBorad.hasKey(83) && !this.deputy) || (keyBorad.hasKey(40) && this.deputy)) {
            moving = true;
            changeDir('bottom');
        }

        // 向左
        if ((keyBorad.hasKey(65) && !this.deputy) || (keyBorad.hasKey(37) && this.deputy)) {
            moving = true;
            changeDir('left');
        }

        // 向右
        if ((keyBorad.hasKey(68) && !this.deputy) || (keyBorad.hasKey(39) && this.deputy)) {
            moving = true;
            changeDir('right');
        }

        // 单发
        if ((keyBorad.hasKey(74) && !this.deputy) || (keyBorad.hasKey(76) && this.deputy)) {
            // 判断按键是否锁定
            if ((!keyBorad.hasBlock(74) && !this.deputy) || (!keyBorad.hasBlock(76) && this.deputy)) {
                // 单发子弹发出之后按键锁定，抬起后取消锁定
                if (this.shoot()) {
                    if (this.deputy) {
                        keyBorad.addBlock(76);
                    } else {
                        keyBorad.addBlock(74);
                    }
                }
            }
        }

        // 连发
        if ((keyBorad.hasKey(75) && !this.deputy) || (keyBorad.hasKey(186) && this.deputy)) {
            this.shoot();
        }

        // 暂停
        if (keyBorad.hasKey(66)) {
            if (keyBorad.hasBlock(66)) return;
            this.word.game.pause = true;
            keyBorad.clear();
            keyBorad.addBlock(66);
        }

        // 移动
        if (moving) {
            this.move();
        } else {
            if (this.pos.x % 16 !== 0 || this.pos.y % 16 !== 0) {
                this.move();
            }
        }
    }
}

//  采用闭包的方式，防止修改游戏数据
(function () {
    // 获取元素类型
    function typeOf(value) {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }

    // 是否为空值
    function isEmpty(value) {
        return [undefined, null].includes(value) || value != value;
    }

    // 修改地图数据
    function fixMapData(value) {
        return value;
    }

    // 获取一个canvas实例
    function getCanvas(size = 32) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        return { canvas, ctx };
    }

    // 获取游戏画布
    function getGameCanvas() {
        const canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = CONFIG.static.screen.width;
        canvas.height = CONFIG.static.screen.height;
        return { canvas, ctx };
    }

    // 打印copyRight
    function copyright() {
        console.clear();
        console.log('%c ', `background: url(${PWD}/image/UI.png);padding:0px 184px; line-height:136px;margin: 15px calc(50% - 184px);`);
        console.log(
            `%c@author: hec9527\n@time:   2020-1-5\n@description: \n\n\thi，留了一个小彩蛋，竟然被你发现了。看来阁下应该是个程序员没错了，既然如此，不知可否有意向一起来优化一下这个小游戏。如果你在使用过程中发现有任何bug，或者优化建议，可以直接发起pr或者发送到我的邮箱:\thec9527@foxmail.com\n\n`,
            'color:red'
        );
    }

    // 计算 entity 移动之后的位置
    function entityMove(entity) {
        const x = entity.pos.x;
        const y = entity.pos.y;
        const dirs = {
            top: () => (y -= entity.speed),
            left: () => (x -= entity.speed),
            right: () => (x += entity.speed),
            bottom: () => (y += entity.speed),
        };
        dirs[entity]();
        return { x, y };
    }

    // 边缘检测
    function collisionBorderNextTick(entity) {
        const { x, y } = entityMove(entity);
        return x < 0 || x + entity.width > CONFIG.static.screen.innerWidth || y < 0 || y + entity.width > CONFIG.static.screen.innerHeight
            ? true
            : false;
    }

    // 碰撞检测  -- 物体是否已经发生重叠
    function collisionDetection(entity, lis = []) {
        return lis.some((item) => {
            return (
                item.collision &&
                ((item.pos.x - entity.pos.x < entity.width && item.pos.y - entity.pos.y < entity.width) ||
                    (entity.pos.x - item.pos.x < item.width && entity.pos.y - item.pos.y < item.width))
            );
        });
    }

    // 碰撞检测  -- 物体运动之后是否碰撞
    function collisionDetectionNextTick(entity, lis = []) {
        const { x, y } = entityMove(entity);
        return lis.some((item) => {
            return (
                item.collision &&
                ((item.pos.x - x < entity.width && item.pos.y - y < entity.width) ||
                    (x - item.pos.x < item.width && y - item.pos.y < item.width))
            );
        });
    }

    // 工具类
    class Tool {
        static getRecored() {
            return localStorage.getItem('recored');
        }
        static setRecored() {
            // return
        }
        static getRecoredHigh() {
            const recored = Tool.getRecored();
            return [0, 0];
        }
    }

    // 键盘监听
    class KeyBorad {
        constructor() {
            this.keyCode = new Set(); // 已经按下的按键
            this.blockKey = new Set(); // 暂时屏蔽的按键，防止连续响应速度过快
            this.interval = 150; // 连续响应按键的间隔

            // 键盘   --  按下
            window.addEventListener('keydown', (e) => {
                this.keyCode.add(e.keyCode);
            });

            // 键盘  -- 抬起
            window.addEventListener('keyup', (e) => {
                this.keyCode.delete(e.keyCode);
            });
        }

        showKey() {
            console.log(`%c当前Keys:${Array.from(this.keyCode)}`, 'color:#abf');
        }

        hasKey(code) {
            return this.keyCode.has(code);
        }

        delKey(code) {
            return this.keyCode.delete(code);
        }

        // 判断一个按键是否按下？ 并且弹出,  用于按键的单次响应
        isTapTapKey(key) {
            if (this.hasKey(key)) {
                this.delKey(key);
                return true;
            }
            return false;
        }

        // 一个按键是否按下？  连续响应, 增加响应间隔
        isHammerKey(key) {
            if (!this.blockKey.has(key) && this.keyCode.has(key)) {
                this.blockKey.add(key);
                setTimeout(() => this.blockKey.delete(key), this.interval);
                return true;
            } else {
                return false;
            }
        }

        clear() {
            return this.keyCode.clear();
        }
    }

    // 音频加载 并且播放播放
    class Sound {
        constructor(pwd) {
            this.loaded = false;
            this.sound = {};
            this.pwd = pwd;
            this.load();
        }

        async load() {
            const sound = this.sound;
            const music = {
                attack: '/music/attack.mp3',
                attackOver: '/music/attackOver.mp3',
                bomb: '/music/bomb.mp3',
                eat: '/music/eat.mp3',
                move: '/music/move.mp3',
                life: '/music/life.mp3',
                misc: '/music/misc.mp3', // 定时
                over: '/music/over.mp3',
                pasue: '/music/pause.mp3',
                start: '/music/start.mp3',
            };

            // ES2020
            await Promise.allSettled(
                Reflect.ownKeys(music).map((item) => {
                    return new Promise((resolve, reject) => {
                        const player = new Audio();
                        const timer = setTimeout(() => {
                            console.error(`音频加载失败：${music[item]}`);
                            reject();
                        }, 5000);
                        player.oncanplay = () => {
                            clearTimeout(timer);
                            Reflect.defineProperty(sound, item, { value: player.src });
                            resolve();
                        };
                        player.src = this.pwd + music[item];
                    });
                })
            ).then(() => {
                console.log('%cinfo 音频加载完成', 'color:#30A9DE');
                this.loaded = true;
            });
        }

        /**
         * @param {*} sound attack   attackOver   bomb   eat   move   life   misc  over   pasue   start
         */
        play(sound) {
            if (Reflect.ownKeys(this.sound).includes(sound)) {
                const player = new Audio();
                player.src = this.sound[sound];
                player.play();
            } else {
                console.error('未注册的音频文件:', sound);
            }
        }
    }

    // 图片加载 提供精灵图
    class Images {
        constructor(pwd) {
            this.loaded = false;
            this.pwd = pwd;
            this.images = {};
            this.load();
        }

        load() {
            const images = {
                bonus: '/image/bonus.png',
                explode: '/image/explode.png', // 爆炸
                brick: '/image/brick.png',
                enemyTank: '/image/enemyTank.png',
                myTank: '/image/myTank.png',
                tool: '/image/tool.png',
                ui: '/image/UI.png',
                score: '/image/getScore.png',
                scoreDouble: '/image/getScoreDouble.png',
            };

            Promise.allSettled(
                Reflect.ownKeys(images).map((key) => {
                    return new Promise((resolve, reject) => {
                        const img = document.createElement('img');
                        const timer = setTimeout(() => {
                            console.error(`图片加载出错 ${this.pwd + images[key]}`);
                            reject();
                        }, 5000);
                        img.onload = () => {
                            clearTimeout(timer);
                            Object.defineProperty(this.images, key, { value: img });
                            resolve();
                        };
                        img.src = this.pwd + images[key];
                    });
                })
            ).then(() => {
                console.info('%cinfo 图片加载完成', 'color:#30A9DE');
                this.loaded = true;
            });
        }

        // 获取空白精灵图
        getBlockSpirit() {
            if (this.getBlockSpirit.canvas) return this.getBlockSpirit.canvas;
            const { canvas, ctx } = getCanvas();
            ctx.drawImage(this.images.bonus, 32 * 5, 32 * 2, 32, 32, 0, 0, 32, 32);
            this.getBlockSpirit.canvas = canvas;
            return canvas;
        }

        // 获取子弹精灵图
        getBulletSpirit() {
            if (this.getBulletSpirit.lis) return this.getBulletSpirit.lis;
            const lis = [];
            for (let i = 0; i < 4; i++) {
                const { canvas, ctx } = getCanvas(8);
                ctx.drawImage(this.images.tool, i * 8, 0, 8, 8, 0, 0, 8, 8);
                lis.push(canvas);
            }
            this.getBulletSpirit.lis = lis;
            return lis;
        }

        // 我方坦克 精灵图列表  玩家  坦克等级  坦克 运动状态  坦克方向
        getTankAllySpirit() {
            if (this.getTankAllySpirit.lis) return this.getTankAllySpirit.lis;
            const lis = [
                // 玩家1
                [
                    [[], []], // 一级坦克  [ 坦克运动形态1上右下左 ], [ 坦克运动形态2上右下左 ]
                    [[], []], // 二级坦克
                    [[], []],
                    [[], []],
                ],
                // 玩家2
                [
                    [[], []],
                    [[], []],
                    [[], []],
                    [[], []],
                ],
            ];
            for (let col = 0; col < 8; col++) {
                for (let row = 0; row < 4; row++) {
                    const { canvas, ctx } = getCanvas();
                    const { canvas: canvas1, ctx: ctx1 } = getCanvas();
                    ctx.drawImage(this.images.myTank, col * 32, row * 64, 32, 32, 0, 0, 32, 32);
                    ctx1.drawImage(this.images.myTank, col * 32, row * 64 + 32, 32, 32, 0, 0, 32, 32);
                    lis[col >= 4 ? 1 : 0][col % 4][0].push(canvas);
                    lis[col >= 4 ? 1 : 0][col % 4][1].push(canvas1);
                }
            }
            this.getTankAllySpirit.lis = lis;
            return lis;
        }

        // 敌方坦克 精灵图列表  类型  带奖励/等级  运动状态  坦克方向
        getTankEnemySpirit() {
            if (this.getTankEnemySpirit.lis) return this.getTankEnemySpirit.lis;
            const lis = [
                // 类型1   [ 类型1普通版, 类型1带奖励版 ]
                [
                    [[], []],
                    [[], []],
                ],
                // 类型2
                [
                    [[], []],
                    [[], []],
                ],
                // 类型3
                [
                    [[], []],
                    [[], []],
                ],
                // 类型4  多种等级
                [
                    [[], []],
                    [[], []],
                    [[], []],
                    [[], []],
                ],
            ];
            for (let col = 0; col < 6; col++) {
                for (let row = 0; row < 4; row++) {
                    const { canvas, ctx } = getCanvas();
                    const { canvas: canvas1, ctx: ctx1 } = getCanvas();
                    ctx.drawImage(this.images.enemyTank, col * 32, row * 64, 32, 32, 0, 0, 32, 32);
                    ctx1.drawImage(this.images.enemyTank, col * 32, row * 64 + 32, 32, 32, 0, 0, 32, 32);
                    lis[(col / 2) | 0][col % 2][0].push(canvas);
                    lis[(col / 2) | 0][col % 2][1].push(canvas1);
                }
            }
            for (let col = 6; col < 10; col++) {
                for (let row = 0; row < 4; row++) {
                    const { canvas, ctx } = getCanvas();
                    const { canvas: canvas1, ctx: ctx1 } = getCanvas();
                    ctx.drawImage(this.images.enemyTank, col * 32, row * 64, 32, 32, 0, 0, 32, 32);
                    ctx1.drawImage(this.images.enemyTank, col * 32, row * 64 + 32, 32, 32, 0, 0, 32, 32);
                    lis[3][col - 6][0].push(canvas);
                    lis[3][col - 6][1].push(canvas1);
                }
            }
            this.getTankEnemySpirit.lis = lis;
            return lis;
        }

        // 奖励图标 精灵图列表
        getReawrdSpirit() {
            if (this.getReawrdSpirit.lis) return this.getReawrdSpirit.lis;
            const lis = [];
            for (let col = 0; col < 6; col++) {
                const { canvas, ctx } = getCanvas();
                ctx.drawImage(this.images.bonus, 32 * col, 0, 32, 32, 0, 0, 32, 32);
                lis.push(canvas);
            }
            lis.push(this.getBlockSpirit());
            return lis;
        }

        // 分数精灵图
        getScoreSpirit() {
            if (this.getScoreSpirit.lis) return this.getScoreSpirit.lis;
            const lis = [];
            for (let col = 0; col < 6; col++) {
                const { canvas, ctx } = getCanvas();
                ctx.drawImage(this.images.bonus, 32 * col, 32, 32, 32, 0, 0, 32, 32);
                lis.push(canvas);
            }
            this.getScoreSpirit.lis = lis;
            return lis;
        }

        // 出生动画精灵图
        getBirthAnimationSpirit() {
            if (this.getBirthAnimationSpirit.lis) return this.getBirthAnimationSpirit.lis;
            const lis = [];
            for (let col = 0; col < 5; col++) {
                const { canvas, ctx } = getCanvas();
                ctx.drawImage(this.images.bonus, col * 32, 64, 32, 32, 0, 0, 32, 32);
                lis.push(canvas);
            }
            this.getBirthAnimationSpirit.lis = lis.reverse();
            return lis;
        }

        // 爆炸动画精灵图
        getExplodeAnimationSpirit() {
            if (this.getExplodeAnimationSpirit.lis) return this.getExplodeAnimationSpirit.lis;
            const lis = [];
            for (let col = 0; col < 5; col++) {
                const { canvas, ctx } = getCanvas(64);
                ctx.drawImage(this.images.explode, 64 * col, 0, 64, 64, 0, 0, 64, 64);
                lis.push(canvas);
            }
            this.getExplodeAnimationSpirit.lis = lis;
            return lis;
        }

        // 砖块精灵图
        getBrickSpirit() {
            if (this.getBrickSpirit.lis) return this.getBrickSpirit.lis;
            const lis = [];
            for (let col = 0; col < 21; col++) {
                const { canvas, ctx } = getCanvas();
                ctx.drawImage(this.images.brick, col * 32, 0, 32, 32, 0, 0, 32, 32);
                lis.push(canvas);
            }
            this.getBrickSpirit.lis = lis;
            return lis;
        }

        // 分数结算界面精灵图
        getScoreComputeSpirit() {
            if (this.getScoreComputeSpirit.lis) return this.getScoreComputeSpirit.lis;
            const lis = [];
            const { canvas, ctx } = getCanvas(456);
            const { canvas: canvas1, ctx: ctx1 } = getCanvas(456);
            ctx.drawImage(this.images.score, 0, 0, 516, 456, 0, 0, 456, 456);
            ctx1.drawImage(this.images.scoreDouble, 0, 0, 516, 456, 0, 0, 456, 456);
            lis.push(canvas);
            lis.push(canvas1);
            this.getScoreComputeSpirit.lis = lis;
            return lis;
        }

        // 获取页面上各种标志
        getFlagSpirit() {
            if (this.getFlagSpirit.lis) return this.getFlagSpirit.lis;
            const { canvas, ctx } = getCanvas(16);
            const { canvas: canvas1, ctx: ctx1 } = getCanvas(16);
            const { canvas: canvas2, ctx: ctx2 } = getCanvas(16);
            const { canvas: canvas3, ctx: ctx3 } = getCanvas();
            ctx.drawImage(this.images.tool, 0, 16, 16, 16, 0, 0, 16, 16);
            ctx1.drawImage(this.images.tool, 16, 16, 16, 16, 0, 0, 16, 16);
            ctx2.drawImage(this.images.tool, 96, 0, 16, 16, 0, 0, 16, 16);
            ctx3.drawImage(this.images.tool, 128, 0, 32, 32, 0, 0, 32, 32);
            const lis = [canvas, canvas1, canvas2, canvas3, this.getTankAllySpirit()[0][0][0][0], this.getTankAllySpirit()[0][0][0][1]];
            this.getFlagSpirit.lis = lis;
            return lis;
        }

        // 获取LOGO  gameover 精灵图
        getLogoAndGameoverSpirit() {
            if (this.getLogoAndGameoverSpirit.lis) return this.getLogoAndGameoverSpirit.lis;
            const { canvas, ctx } = getCanvas();
            const { canvas: canvas1, ctx: ctx1 } = getCanvas();
            canvas.width = 376;
            canvas.height = 136;
            canvas1.width = 248;
            canvas1.height = 160;
            ctx.drawImage(this.images.ui, 0, 0, 376, 136, 0, 0, 376, 136);
            ctx1.drawImage(this.images.ui, 0, 160, 248, 160, 0, 0, 248, 160);
            const lis = [canvas, canvas1];
            this.getLogoAndGameoverSpirit.lis = lis;
            return lis;
        }

        // 获取  防护罩精灵图
        getArmorSpirit() {
            if (this.getArmorSpirit.lis) return this.getArmorSpirit.lis;
            const lis = [];
            for (let col = 1; col < 3; col++) {
                const { canvas, ctx } = getCanvas();
                ctx.drawImage(this.images.tool, col * 32, 0, 32, 32, 0, 0, 32, 32);
                lis.push(canvas);
            }
            this.getArmorSpirit.lis = lis;
            return lis;
        }
    }

    // 玩家类
    class Player {
        static lis = [];
        // 副手=false
        constructor(deputy = false) {
            this.life = 3;
            this.tank = undefined; // 玩家的坦克
            this.scope = 0; // 玩家分数
            this.scopeAward = 0; // 分数奖励次数
            this.isDeputy = deputy;
            this.index = this.isDeputy ? 2 : 1;
            Player.lis[deputy ? 1 : 0] = this;
        }

        addLife() {
            this.life++;
        }

        reduceLife() {
            this.life--;
        }

        addScope(scope) {
            this.scope += scope;
        }

        steal() {
            const index = this.isDeputy ? 0 : 1; // 另一个玩家的index
            if (this.life === 0 && Player.lis[index] && Player.lis[index].life > 1) {
                this.addLife();
                Player.lis[index].reduceLife();
                console.log(`%csteal: 玩家${index + 1} --> 玩家${this.index}  1❤`, 'color:#d4d4d4');
            } else {
                console.log(`%csteal: 玩家${index + 1} --> 玩家${this.index}  失败`, 'color:#d4d4d4');
            }
        }
    }

    // 世界类 窗体/流程调度
    class Word {
        constructor() {
            this.window = undefined;
            this.taggleWindow();
        }

        // 切换新的流程
        // title   custom   rankPick   battle   settlement
        taggleWindow() {
            const window = CONFIG.gameFlow.shift();
            console.debug(`%cdebug 流程切换：${window}`, 'color:#ccc');

            switch (window) {
                case 'title': {
                    this.window = new WindowsTitle(this);
                    break;
                }
                case 'custom': {
                    this.window = new WindowsMapEdit(this);
                    break;
                }
                case 'rankPick': {
                    this.window = new WindowsRankPick(this);
                    break;
                }
                case 'battle': {
                    this.window = new WindowsBattle(this);
                    break;
                }
                case 'settlement': {
                    console.log('TODO 结算');
                    break;
                }
                default: {
                    console.error('未知的窗体名称: ', window);
                }
            }
        }
    }

    class Windows {
        constructor(word) {
            const { canvas, ctx } = getGameCanvas();
            this.word = word;
            this.canvas = canvas;
            this.ctx = ctx;
            this.isOver = false; // 当前窗体是否已经结束？  终止渲染render
        }

        getBackgroundUI() {
            const { canvas, ctx } = getCanvas();
            canvas.width = 516;
            canvas.height = 456;
            ctx.fillStyle = 'rgb(127, 127, 127)';
            ctx.fillRect(0, 0, 516, 456);
            ctx.fillStyle = '#000';
            ctx.fillRect(
                CONFIG.static.screen.offset.x,
                CONFIG.static.screen.offset.y,
                CONFIG.static.screen.innerWidth,
                CONFIG.static.screen.innerHeight
            );
            return canvas;
        }

        nextWindow(str) {
            console.log(`%cNext windows: ${str}`, 'color:#FFEC3D');
            CONFIG.gameFlow.push(str);
            this.isOver = true;
            this.word.taggleWindow();
        }

        render() {
            window.requestAnimationFrame(() => {
                if (!this.isOver) {
                    // this.canvas.width = this.canvas.width;
                    this.ctx.clearRect(0, 0, 516, 456);
                    this.render();
                }
            });
        }
    }

    // 标题窗口
    class WindowsTitle extends Windows {
        constructor(word) {
            super(word);
            const _this = this;
            this.flagPos = [300, 340, 380];
            this.isload = false;
            this.currentFlag = 0; // 初始选择 第一个  单人游戏
            this.animaSource = 450; // 动画起始位置
            this.animaTarget = 0; // 动画结束位置
            this.animaCurrent = CONFIG.game.isFirstLoad ? this.animaSource : this.animaTarget;
            this.menusMarginLeft = (470 - ctx.measureText('PLAYER').width) / 2;
            this.background = this.getBackgroundUI();
            CONFIG.game.isFirstLoad = false;
            this.render();

            // TODO 第一次按键不响应其它操作
            window.addEventListener(
                'keydown',
                () => {
                    _this.animaCurrent = _this.animaTarget;
                    setTimeout(() => (this.isload = true), 100);
                },
                { once: true }
            );
        }

        getBackgroundUI() {
            // TODO 优化字体，以及显示效果
            const { canvas, ctx } = getCanvas();
            canvas.width = 516;
            canvas.height = 456;
            ctx.font = '22px Arial';
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'top';
            ctx.fillText('1  PLAYER', this.menusMarginLeft, this.flagPos[0]);
            ctx.fillText('2  PLAYERS', this.menusMarginLeft, this.flagPos[1]);
            ctx.fillText('CONSTRUCTION', this.menusMarginLeft, this.flagPos[2]);
            ctx.fillText(`I -        00   HI - 20000     I -        00`, 95, 50);
            ctx.drawImage(IMAGE.getLogoAndGameoverSpirit()[0], 70, 110);
            return canvas;
        }

        update() {
            if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.top)) {
                this.currentFlag--;
                SOUND.play('attackOver');
            } else if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.bottom)) {
                this.currentFlag++;
                SOUND.play('attackOver');
            } else if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.pause)) {
                if (this.currentFlag === 0 || this.currentFlag === 1) {
                    CONFIG.game.playerNums = this.currentFlag === 0 ? 1 : 2;
                    CONFIG.game.playerList.add(new Player(true));
                    this.currentFlag === 1 && CONFIG.game.playerList.add(new Player());
                    this.nextWindow(CONFIG.gameFlows.rankPick);
                } else if (this.currentFlag === 2) {
                    this.nextWindow(CONFIG.gameFlows.custom);
                } else {
                    console.error('游戏流程选择错误~~~');
                    this.nextWindow(CONFIG.gameFlows.title);
                }
            }

            if (this.currentFlag < 0) {
                this.currentFlag = this.flagPos.length - 1;
            } else if (this.currentFlag >= this.flagPos.length) {
                this.currentFlag = 0;
            }
        }

        render() {
            super.render();
            if (this.animaCurrent > this.animaTarget) {
                this.animaCurrent--;
                this.ctx.drawImage(this.background, 0, this.animaCurrent);
            } else {
                this.isload && this.update();
                this.ctx.drawImage(this.background, 0, 0);
                this.ctx.drawImage(IMAGE.getFlagSpirit()[5], this.menusMarginLeft - 50, this.flagPos[this.currentFlag] - 5);
            }
        }
    }

    // 地图编辑器
    class WindowsMapEdit extends Windows {
        constructor(word) {
            super(word);

            const lis = new Array(13).fill(0, 0, 13);
            this.map = [];
            this.pos = { x: 0, y: 0 };
            this.tick = 0;
            this.brickIndex = 0;
            this.background = this.getBackgroundUI();
            for (let row = 0; row < 13; row++) {
                this.map.push(lis.concat([]));
            }
            this.render();
        }

        update() {
            this.tick++;
            // 位置更新
            if (KEYBORAD.isHammerKey(CONFIG.static.keys.p1.top)) {
                this.pos.y = this.pos.y <= 0 ? 0 : this.pos.y - 1;
            } else if (KEYBORAD.isHammerKey(CONFIG.static.keys.p1.left)) {
                this.pos.x = this.pos.x <= 0 ? 0 : this.pos.x - 1;
            } else if (KEYBORAD.isHammerKey(CONFIG.static.keys.p1.bottom)) {
                this.pos.y = this.pos.y >= 12 ? 12 : this.pos.y + 1;
            } else if (KEYBORAD.isHammerKey(CONFIG.static.keys.p1.right)) {
                this.pos.x = this.pos.x >= 12 ? 12 : this.pos.x + 1;
            }

            // TODO 砖块切换逻辑修改
            // 状态更新 鼠标左键，倒序状态    15  16 不可用  boss状态
            if (KEYBORAD.isHammerKey(CONFIG.static.keys.p1.single)) {
                if (this.brickIndex < 1) {
                    this.brickIndex = 20;
                } else if (this.brickIndex === 17) {
                    this.brickIndex -= 3;
                } else {
                    this.brickIndex--;
                }
                this.map[this.pos.y][this.pos.x] = this.brickIndex;
            } else if (KEYBORAD.isHammerKey(CONFIG.static.keys.p1.double)) {
                if (this.brickIndex >= 20) {
                    this.brickIndex = 0;
                } else if (this.brickIndex === 14) {
                    this.brickIndex += 3;
                } else {
                    this.brickIndex++;
                }
                this.map[this.pos.y][this.pos.x] = this.brickIndex;
            }
            if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.pause)) {
                console.log('地图编辑完成');

                this.nextWindow(CONFIG.gameFlows.title);
            }
            KEYBORAD.showKey();
        }

        render() {
            super.render();
            this.update();
            this.ctx.drawImage(this.background, 0, 0);
            for (let row = 0; row < 13; row++) {
                for (let col = 0; col < 13; col++) {
                    this.ctx.drawImage(
                        IMAGE.getBrickSpirit()[this.map[row][col]],
                        32 * col + CONFIG.static.screen.offset.x,
                        32 * row + CONFIG.static.screen.offset.y
                    );
                }
            }
            this.tick <= 20 &&
                this.ctx.drawImage(
                    IMAGE.getFlagSpirit()[4],
                    32 * this.pos.x + CONFIG.static.screen.offset.x,
                    32 * this.pos.y + CONFIG.static.screen.offset.y
                );
            if (this.tick > 35) {
                this.tick = 0;
            }
        }
    }

    // 关卡选择界面
    class WindowsRankPick extends Windows {
        constructor(word) {
            super(word);
            // 456 / 2 = 228
            this.rank = CONFIG.game.gameRank;
            this.isLoad = false;
            this.isBegin = false;
            this.targetTop = 0;
            this.ctx.font = '22px Microsoft Yahei';
            this.ctx.textBaseline = 'middle';
            this.timer = null;
            this.render();
        }

        renderLoadAnimation() {
            if (this.targetTop < 228) {
                this.targetTop += 8;
                this.ctx.fillStyle = 'rgb(127, 127, 127)';
                this.ctx.fillRect(0, 0, 516, this.targetTop);
                this.ctx.fillRect(0, 456 - this.targetTop, 516, 228);
            } else {
                this.isLoad = true;
            }
        }

        renderRankChange() {
            this.ctx.fillStyle = 'rgb(127, 127, 127)';
            this.ctx.fillRect(0, 0, 516, 456);
            this.ctx.fillStyle = '#000';
            this.ctx.fillText('STAGE', 200, 220);
            this.ctx.fillText(`${this.rank}`, 300, 220);
        }

        update() {
            if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.top)) {
                this.rank = this.rank >= 50 ? 50 : ++this.rank;
            } else if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.bottom)) {
                this.rank = this.rank > 1 ? --this.rank : 1;
            } else if (KEYBORAD.isTapTapKey(CONFIG.static.keys.p1.pause)) {
                this.beginGame();
                CONFIG.game.gameRank = this.rank;
            }
        }

        beginGame() {
            this.isBegin = true;
            SOUND.play('start');
            setTimeout(() => {
                this.nextWindow(CONFIG.gameFlows.battle);
            }, 1000);
        }

        render() {
            super.render();
            // 加载完成之前  加载动画
            if (!this.isLoad) {
                this.renderLoadAnimation();
            }
            if (this.isLoad) {
                if (!this.isBegin) {
                    if (typeOf(MAP.maps[0]) !== 'array') {
                        this.beginGame();
                    } else {
                        this.update();
                    }
                }
                this.renderRankChange();
            }
        }
    }

    // 战斗界面
    class WindowsBattle extends Windows {
        constructor(word) {
            super(word);
            this.background = this.getBackgroundUI();
            this.isload = false;
            this.targetTop = 228;
            this.enemyRemain = 20; // 每一关卡敌人的数量
            // 敌人默认出生位置
            this.enemyBirthPos = [
                { x: 0, y: 0 },
                { x: 6, y: 0 },
                { x: 12, y: 12 },
            ];
            this.enemyBirthIndex = 0; // 本次敌人出生位置
            this.map = fixMapData(MAP.maps[CONFIG.game.gameRank]);

            this.render();
        }

        getBackgroundUI() {
            const { canvas, ctx } = getCanvas();
            canvas.width = 516;
            canvas.height = 456;
            ctx.fillStyle = 'rgb(127, 127, 127)';
            ctx.fillRect(0, 0, 516, 456);
            ctx.fillStyle = '#000';
            ctx.fillRect(
                CONFIG.static.screen.offset.x,
                CONFIG.static.screen.offset.y,
                CONFIG.static.screen.innerWidth,
                CONFIG.static.screen.innerHeight
            );
            return canvas;
        }

        renderLoadAnimation() {
            if (this.targetTop > 0) {
                this.targetTop -= 8;
                this.ctx.fillStyle = 'rgb(127, 127, 127)';
                this.ctx.fillRect(0, 0, 516, this.targetTop);
                this.ctx.fillRect(0, 456 - this.targetTop, 516, 228);
            } else {
                this.isLoad = true;
            }
        }

        renderEnemyFlag() {
            const left = 470;
            const top = 35;
            for (let i = 0; i < this.enemyRemain; i++) {
                const col = (i / 2) | 0;
                this.ctx.drawImage(IMAGE.getFlagSpirit()[0], left + (i % 2 === 0 ? 0 : 16), top + 16 * col);
            }
        }

        renderMyFlag() {
            const left = 464;
            const top = 270;
            this.ctx.save();
            // this.ctx.fillText('1P', left, top);
            this.ctx.font = '22px Microsoft Yahei';
            this.ctx.fillStyle = '#000';
            // TODO 显示玩家的血量
            this.ctx.fillText('ⅠP', left, top);
            this.ctx.fillText('2', left + 20, top + 25);
            this.ctx.drawImage(IMAGE.getFlagSpirit()[1], left + 5, top + 10);
            this.ctx.fillText('ⅡP', left, top + 60);
            this.ctx.fillText('2', left + 20, top + 85);
            this.ctx.drawImage(IMAGE.getFlagSpirit()[1], left + 5, top + 70);
            // 渲染关卡标识
            this.ctx.drawImage(IMAGE.getFlagSpirit()[3], left + 3, top + 100);
            this.ctx.fillText(CONFIG.game.gameRank, left + 20, top + 145);
            this.ctx.restore();
        }

        renderAllyFlag() {}

        update() {}

        render() {
            super.render();
            this.ctx.drawImage(this.background, 0, 0);
            this.renderEnemyFlag();
            this.renderMyFlag();

            if (!this.isLoad) {
                this.renderLoadAnimation();
            }
        }
    }

    // 实体类
    class Entity {
        constructor(window, images, pos) {
            this.window = window;
            // 自身属性
            this.spirit = this.changeSpirit();
            this.images = images;
            this.birthPos = pos;
            this.pos = pos;
            this.camp = 'neutral'; // 实体的阵营  'neutral' 'enemy' 'ally'
            this.dir = 'top';
            this.tick = 0; // 改变自身spirit计数
            this.tickSpirit = false; // 标记坦克的运动状态
            this.speed = 0; // 移动速度
            this.width = 32; // 宽高
            this.collision = true; // 参与碰撞检测
        }

        // 实体改变自身精灵的方法，继承的类可以重写
        changeSpirit() {
            if (typeOf(this.images) === 'array') {
                if (typeOf(this.images[0]) === 'array') {
                    return this.images[0][0];
                }
                return this.images[0];
            }
            return this.images;
        }

        die() {
            this.window.delSpirit(this);
        }

        move() {
            const isCanmove = !collisionBorderNextTick(this) || !collisionDetectionNextTick(this, this.window.items);
            if (isCanmove) {
                this.pos = entityMove(this);
            }
        }

        render() {
            this.window.ctx.drawImage(this.spirit, this.pos.x + CONFIG.static.screen.offset.x, this.pos.y + CONFIG.static.screen.offset.y);
        }
    }

    // 坦克类
    class Tank extends Entity {
        constructor(window, images, pos) {
            super(window, images, pos);
            // 坦克自身属性
            this.level = 1;
            this.levelMax = 1; // 最高等级, 不同等级的坦克外形不同
            this.bullets = new Set(); // 每个坦克的子弹
            this.bulletNum = 1; // 坦克初始只有一发子弹
            this.bulletSpeed = 1; // 子弹的速度
            this.bulletTick = 0; // 连续发射的间隔
            this.armor = false; // 护甲，护甲存在则无敌
            this.life = 1; // 不同等级的坦克生命不同，不同
        }

        shoot() {
            if (this.bullets.length < this.bulletNum || this.bulletTick <= 0) {
                const dirs = {
                    top: { x: this.pos.x + 12, y: this.pos.y },
                    left: { x: this.pos.x, y: this.pos.y + 12 },
                    bottom: { x: this.pos.x + 12, y: this.pos.y + 24 },
                    right: { x: this.pos.x + 24, y: this.pos.y + 12 },
                };
                const bullet = new Bullet(this, dirs[this.dir], this.bulletSpeed);
                this.bullets.add(bullet);
                this.window.items.add(bullet);
                this.bulletTick = 20;
            }
        }

        upLevel() {
            if (this.level < this.levelMax) {
                this.level++;
                this.left += 1;
            }
        }

        injured() {
            if (this.armor) return false;

            if (this.life > 1) {
                this.life--;
            } else {
                return this.die();
            }

            if (this.level > 1) {
                this.level--;
            }
        }

        changeDirection() {}

        move() {
            this.bulletTick > 0 && this.bulletTick--;
            const direction = this.changeDirection();
            if (direction !== false) {
                if (direction === this.dir) {
                    super.move();
                    if (this.tick > 20) {
                        this.changeSpirit();
                    }
                } else {
                    this.dir = direction;
                    this.changeSpirit();
                }
            }
        }
    }

    // 子弹类
    class Bullet extends Entity {
        // 子弹的精灵图都是一样的， 单独处理
        constructor(tank, pos, speed) {
            const images = getBulletImages();
            super(tank, images, pos);
            this.speed = speed;
            // this.tank.window.add(this);
        }

        die() {}
    }

    // 防护罩类
    class Armor extends Entity {
        constructor(window, tank) {
            const images = Image.get;
            super(window);
        }
    }

    // 奖励类
    class Reward extends Entity {}

    // 我方坦克类
    class TankAlly extends Tank {
        constructor(window, deputy = false) {
            const img = IMAGE.getTankAllySpirit()[deputy ? 1 : 0];
            const pos = CONFIG.static.pos[deputy ? 'p2' : 'p1'];

            super(window, img, pos);
            this.keys = CONFIG.static.keys[deputy ? 'p2' : 'p1'];
        }

        // 我方坦克 精灵图列表  玩家  坦克等级  坦克运动状态  坦克方向
        changeSpirit() {
            const dirs = { top: 0, right: 1, bottom: 2, left: 3 };
            return this.images[this.level][this.tickSpirit ? 1 : 0][dirs[this.dir]];
        }

        changeDirection() {
            if (KEYBORAD.hasKey(this.keys.top)) {
                return 'top';
            } else if (KEYBORAD.hasKey(this.keys.right)) {
                return 'right';
            } else if (KEYBORAD.hasKey(this.keys.bottom)) {
                return 'bottom';
            } else if (KEYBORAD.hasKey(this.keys.left)) {
                return 'left';
            }
            return false;
        }

        move() {
            //
        }
    }

    class GameMap {
        constructor() {
            this.maps = [undefined];
        }
    }

    const PWD = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
    const IMAGE = new Images(PWD);
    const SOUND = new Sound(PWD);
    const KEYBORAD = new KeyBorad();
    const MAP = new GameMap();

    // 游戏相关属性
    const CONFIG = {
        game: {
            playerNums: 1,
            playerList: new Set(),
            gameRank: 1, // 当前关卡
            customRank: undefined,
            isFirstLoad: true,
        },
        static: {
            // 玩家按键
            keys: {
                //    w        a         s           d          j           k           b
                p1: { top: 87, left: 65, bottom: 83, right: 68, single: 74, double: 75, pause: 66 },
                //    上        坐        下          右         l            ;
                p2: { top: 38, left: 37, bottom: 40, right: 39, single: 76, double: 186 },
            },
            // 默认位置
            pos: {
                p1: { x: 176, y: 416 },
                p2: { x: 240, y: 416 },
                enemy1: { x: 0, y: 0 },
                enemy2: { x: 192, y: 0 },
                enemy3: { x: 384, y: 0 },
            },
            // 屏幕参数
            screen: {
                offset: { x: 35, y: 20 },
                innerWidth: 416,
                innerHeight: 416,
                width: 516,
                height: 456,
            },
        },
        // 游戏流程（窗口）    标题页--title  地图编辑器--custom   关卡选择/查看--rankPick  战斗界面--battle  结算界面--settlement
        gameFlows: { title: 'title', custom: 'custom', rankPick: 'rankPick', battle: 'battle', settlement: 'settlement' },
        gameFlow: ['title'],
    };

    // 开发
    CONFIG.gameFlow = [CONFIG.gameFlows.title];

    setTimeout(() => {
        const WORD = new Word();
    }, 200);

    copyright();

    // 图片加载调试
    setTimeout(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        // const img = IMAGE.getBulletSpirit();
        // const img = IMAGE.getTankAllySpirit();
        // const img = IMAGE.getTankEnemySpirit();
        // const img = IMAGE.getReawrdSpirit();
        // const img = IMAGE.getScoreSpirit();
        // const img = IMAGE.getBirthAnimationSpirit();
        const img = IMAGE.getBrickSpirit();
        // const img = IMAGE.getExplodeAnimationSpirit();
        // const img = IMAGE.getScoreComputeSpirit();
        // const img = IMAGE.getFlagSpirit();
        // const img = IMAGE.getLogoAndGameoverSpirit();
        // const img = IMAGE.getArmorSpirit();

        // 子弹   精灵图列表
        // ctx.drawImage(img[3], 0, 0);
        // 我方坦克 精灵图列表  玩家  坦克等级  坦克 运动状态  坦克方向
        // ctx.drawImage(img[0][3][1][0], 0, 0);
        // 敌方坦克 精灵图列表  类型  带奖励/等级  运动状态  坦克方向
        // ctx.drawImage(img[3][3][1][0], 0, 0);
        // 奖励图标  精灵图   铁锹  星星  坦克  帽子  炸弹  定弹 空白
        // ctx.drawImage(img[2], 0, 0);
        // 分数 100，200，300，400，500
        // ctx.drawImage(img[4], 0, 0);
        // 出生动画精灵图
        // ctx.drawImage(img[1], 0, 0);
        // 砖块精灵图
        ctx.drawImage(img[20], 0, 0);
        // 爆炸精灵图
        // ctx.drawImage(img[4], 0, 0);
        // 结算界面
        // ctx.drawImage(img[1], 0, 0);
        // 标记 敌人坦克标记  我方玩家life 标记， 左侧箭头标记  旗帜标记  坦克选择标记
        // ctx.drawImage(img[5], 0, 0);
        // 精灵图  logo  gameover
        // ctx.drawImage(img[0], 0, 0);
        // 防护罩精灵图
        // ctx.drawImage(img[1], 0, 0);
    }, 200);
})();

/**
 *  =====  问题  =======
 *  精灵绘制顺序？
 *  子弹？  坦克  ？ 砖块   冰块   树林
 *  闪烁实现方式
 */

//  离屏canvas demo
// function getCanvas() {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     canvas.width = 100;
//     canvas.height = 100;

//     ctx.arc(50, 50, 40, 0, Math.PI * 2);
//     ctx.fillStyle = '#abf';
//     ctx.fill();
//     return canvas;
// }
// console.log('返回值类型：', Object.prototype.toString.call(getCanvas()));
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// ctx.drawImage(getCanvas(), 50, 50);

// TODO 字体调整，修改为合适的字体

// TODO 首页选择
