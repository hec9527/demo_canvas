/**
 * @author     hec9527
 * @time       2020-1-3
 * @change     2020-1-4
 * @description
 *
 *      1, 自由软件协议
 *      2，本游戏采用HTML、CSS、JS制作
 *      3，在游戏逻辑部分使用ES6的语法，需要一定的canvas功底
 *
 */

/**
 * 键盘类
 */
class KeyBorad {
    constructor(word) {
        console.info('info: init keyborad');

        this.word = word;
        this.word.keyBorad = this;
        this.BLOCK = this.word.game.KEYBORAD_BLOCK = false;

        // ! TODO 双线发展，后期测试 key 和 keyCode 究竟那个更加方便合适
        this.keyCode = new Set();
        this.keys = new Set();

        // 键盘   --  按下
        window.addEventListener('keydown', e => {
            if (!this.BLOCK) {
                this.keyCode.add(e.keyCode);
                this.keys.add(e.key);
            }
        });

        // 键盘  -- 抬起
        window.addEventListener('keyup', e => {
            this.keyCode.delete(e.keyCode);
            this.keys.delete(e.key);
        });
    }

    hasKey(key) {
        return this.keys.has(key);
    }

    hasKeyCode(code) {
        return this.keyCode.has(code);
    }

    clear() {
        this.keyCode.clear();
        this.keys.clear();
    }
}

/**
 * 音频类
 * 负责游戏中的各种音效
 */
class Sound {
    constructor(word) {
        console.info('info: load Sound');

        this.word = word;
        this.word.sound = this;

        this.loaded = false;
        this.sound = {};

        this.load();
    }

    load() {
        const music = this.word.game.config.sound;
        const pwd = this.word.pwd;
        const sound = this.sound;

        // ES2020
        Promise.allSettled(
            (() => {
                return Reflect.ownKeys(music).map(item => {
                    return new Promise((resolve, reject) => {
                        const player = new Audio();
                        let load = false;

                        setTimeout(() => {
                            if (!load) {
                                console.warn(`warn: 音频加载失败 ${pwd + music[item]}`);
                                reject();
                            }
                        }, 5000);
                        player.oncanplay = () => {
                            Reflect.defineProperty(sound, item, { value: player });
                            load = true;
                            resolve();
                        };
                        player.src = pwd + music[item];
                    });
                });
            })()
        ).then(() => {
            this.loadSound = true;
            console.info('info: 音频加载完成');
        });
    }

    play(sound) {
        if (Reflect.ownKeys(this.sound).includes(sound)) {
            this.sound[sound].play();
        } else {
            console.warn('warn: 未注册的音频文件');
        }
    }
}

/**
 * 图片加载类
 * 负责加载并且处理图像
 */
class Images {
    constructor(word) {
        console.info('info: load image');
        this.word = word;
        this.word.image = this;

        this.loaded = false;
        this.images = {};

        this.load();
    }

    load() {
        const images = this.word.game.config.image;
        const pwd = this.word.pwd;
        const resource = this.images;

        Promise.allSettled(
            (() => {
                return Reflect.ownKeys(images).map(item => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        let load = false;

                        setTimeout(() => {
                            if (!load) {
                                console.warn(`warn: 图片加载出错 ${pwd + images[item]}`);
                                reject();
                            }
                        }, 5000);
                        img.onload = () => {
                            load = true;
                            Reflect.defineProperty(resource, item, { value: img });
                            resolve();
                        };
                        img.src = pwd + images[item];
                    });
                });
            })()
        ).then(() => {
            this.loaded = true;
            console.info('info: 图片加载完成');
            new Tank(this.word, this.images.myTank, { x: 5, y: 5 }, { x: 0, y: 0 });
        });
    }
}

/**
 * 玩家类
 */
class Player {
    constructor(word) {
        console.info('info: new player');

        this.word = word;
        this.PLAYER_LIST = this.word.game.PLAYER_LIST || [];
        this.PLAYER_LIST.push(this);

        this.index = this.PLAYER_LIST.length;
        this.life = 3;
        this.tank = {}; // 玩家的坦克
        this.scope = 0; // 玩家分数
        this.scopeAward = 0; // 分数奖励次数
    }

    addLife() {
        this.life += 1;
    }

    addScope(scope) {
        this.scope += scope;
    }

    steal() {
        const index = this.index === 0 ? 1 : 0;
        console.info(`steal: 玩家${index}  --->  玩家${this.index}`);
        if (this.life === 0 && this.PLAYER_LIST[index] && this.PLAYER_LIST[index].life >= 2) {
            this.life += 1;
            this.PLAYER_LIST[index].life -= 1;
        }
    }

    birth() {
        console.info(`player${this.index} new tank`);
        if (this.life >= 1) {
            this.life -= 1;
            // this.tank = new Tank();
        }
    }
}

/**
 * 游戏类
 * 用于存放游戏中的运行时参数
 */
class Game {
    constructor(word) {
        console.info('info: init game');

        this.word = word;
        this.word.game = this;

        // 配置文件
        this.config = this.loadConfig();
        // 键盘锁定
        this.KEYBORAD_BLOCK = false;
        // 玩家数量
        this.PLAYER_NUMS = 1;
        // 玩家列表 存放玩家对象
        this.PLAYER_LIST = [];
        // 游戏当前关卡
        this.GAME_RANK = 1;
    }

    loadConfig() {
        if (window.config) {
            console.info('info: load config');
            const config = window.config;
            Reflect.deleteProperty(window, config);
            return config;
        } else {
            setTimeout(() => this.loadConfig(), 10);
        }
    }

    reset() {
        new Game(this.word);
    }
}

/**
 * 窗体类
 * 游戏中的各种游戏进程
 */
class Windows {}

/**
 * 实体类
 * 所有现实在游戏画面上的所有实体的父类
 */
class Entity {
    constructor(word, image, clip, pos) {
        console.info('info: new entity');

        this.word = word;
        this.word.items.add(this);

        this.image = image;
        this.birthPos = pos;
        this.pos = pos;
        this.clip = clip;
        this.alternative = { x: this.clip.x, y: this.clip.y + 1 };
        this.tick = 1;
    }

    die() {
        this.word.items.delete(this);
    }

    update() {
        throw new Error('每个实体对象应该实现自己的<update>方法');
    }

    render() {
        const ctx = this.word.ctx;

        ctx.drawImage(
            this.image,
            this.clip.x * 32,
            this.clip.y * 32,
            32,
            32,
            this.pos.x * 32,
            this.pos.y * 32,
            32,
            32
        );
    }
}

/**
 * 坦克类
 */
class Tank extends Entity {
    constructor(word, image, pos, clip) {
        super(word, image, pos, clip);

        this.life = 1;
        this.level = 1;
        this.direction = undefined;
        this.bulletNum = 1;
        this.bullets = [];
        this.speed = 16;
    }

    changeIcon() {
        //
    }

    // update() {}
}

/**
 * 世界类
 * 游戏的核心类，所有的处理都包含在这个类里面
 * 游戏中的顶级类
 */
class Word {
    constructor() {
        console.info('info: init word');

        // 世界基础属性
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        this.pwd = this.getPwd();

        // 世界元素属性
        this.items = new Set();

        // 世界其它属性
        this.game = new Game(this);
        this.sound = new Sound(this);
        this.images = new Images(this);
        this.keyBorad = new KeyBorad(this);

        // 调用自身方法
        this.render();
    }

    getPwd() {
        const href = window.location.href;
        return href.slice(0, href.lastIndexOf('/'));
    }

    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

// !后期删除对外接口，采用闭包的方式使用
const word = new Word();