/**
 * @author     hec9527
 * @time       2020-1-3
 * @change     2020-1-3
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

class Sound {
    constructor(word) {
        console.info('info: load Sound');

        this.word = word;
        this.word.sound = this;

        this.loaded = false;
        this.sound = {};

        this.loadSound();
    }

    loadSound() {
        const music = this.word.game.config.sound;
        const pwd = this.word.pwd;
        const sound = this.sound;

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
class Image {
    constructor(word) {
        console.info('info: load image');
        this.word = word;
        this.word.image = this;
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
            this.tank = new Tank();
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
 * 实体类
 * 所有现实在游戏画面上的所有实体的父类
 */
class Entity {
    constructor(word, image, pos) {
        console.info('info: new entity');

        this.word = word;
        this.word.items.add(this);

        this.image = image;
        this.birthPos = pos;
        this.pos = pos;
    }

    die() {
        this.word.items.delete(this);
    }

    update() {
        return new Error('每个实体对象应该有自己的<update>方法');
    }

    render() {
        return new Error('每个实体对象应该有自己的<render>方法');
    }
}

/**
 * 坦克类
 */
class Tank extends Entity {
    constructor(word, image, pos) {
        super(word, image, word);
    }
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
        this.keyBorad = new KeyBorad(this);
    }

    getPwd() {
        const href = window.location.href;
        return href.slice(0, href.lastIndexOf('/'));
    }
}

// !后期删除对外接口，采用闭包的方式使用
const word = new Word();
