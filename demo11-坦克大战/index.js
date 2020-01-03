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
 * 图片加载类
 * 负责加载并且处理图像
 */
class Image {
    constructor(word) {
        this.word = word;
        this.word.image = this;
    }
}

/**
 * 玩家类
 */
class Player {
    constructor(word) {
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

    brith() {
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
        this.word = word;
        this.word.game = this;

        // 键盘锁定
        this.KEYBORAD_BLOCK = false;
        // 玩家数量
        this.PLAYER_NUMS = 1;
        // 玩家列表 存放玩家对象
        this.PLAYER_LIST = [new Player(word)];
        // 游戏当前关卡
        this.GAME_RANK = 1;
    }

    reset() {
        new Game(this.word);
    }
}

/**
 * 坦克类
 */
class Tank {}

/**
 * 世界类
 * 游戏的核心类，所有的处理都包含在这个类里面
 * 游戏中的顶级类
 */
class Word {
    constructor() {
        // 世界基础属性
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;

        // 世界元素属性
        this.items = [];

        // 世界其它属性
        this.game = new Game(this);
        this.keyBorad = new KeyBorad(this);
    }
}

// !后期删除对外接口，采用闭包的方式使用
const word = new Word();
