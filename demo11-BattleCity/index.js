/**
 * @author     hec9527
 * @time       2020-1-3
 * @change     2020-1-4
 * @description
 *
 *   说明：
 *      1, 自由软件协议
 *      2，本游戏采用HTML、CSS、JS制作
 *      3，在游戏逻辑部分使用ES6的语法，需要一定的canvas功底
 *
 *
 *   优化：
 *      1， 只有运动的物体才会调用碰撞检测，减少运算量
 *      2， 跳过没有体积碰撞的实体
 *
 *       碰撞检测
 *        1， 需要考虑阵营
 *        2， 相同阵营也有碰撞检测
 *
 *
 *
 *   ! 存在的问题：
 *       1， 碰撞检测的实现
 *
 *
 *        准确的碰撞检测：
 *        1， 当前帧是否发生碰撞
 *        2， 下一帧是否发生碰撞
 *        3， 在这一帧中，两者行进路径是否相交
 */

// ------------------   工具函数--开始   --------------------------

/**
 * 碰撞检测 ———
 * 判断两个实体对象下一帧是否会发生碰撞
 * @param {Entity} entity1 实体对象
 * @param {Entity} entity2 实体对象
 * @return {Boolean} Boolen
 */
function collisionDetectionNextTick(entity1, entity2) {
    // 检测是不是Entity是实例
    if (!entity1 instanceof Entity || !entity2 instanceof Entity) {
        throw new Error('参与碰撞检测对象，必须是Entity类的实例或者继承至Entity类的子类的实例');
    }

    // 排除不需要检测的对象
    if (!entity1.collision || !entity2.collision) {
        return false;
    }

    // 跳过不移动的物体
    if (entity1.speed === 0 && entity2.speed === 0) {
        return false;
    }

    // 检测是否发生碰撞
    const pos1 = { ...entity1.pos };
    const pos2 = { ...entity2.pos };
    const move = (pos, dir, speed) => {
        const dirs = {
            top: () => (pos.y -= speed),
            left: () => (pos.x -= speed),
            right: () => (pos.x += speed),
            bottom: () => (pos.y += speed)
        };
        dirs[dir]();
    };
    move(pos1, entity1.direction, entity1.speed);
    move(pos2, entity2.direction, entity2.speed);

    if (
        pos1.x <= pos2.x &&
        pos1.y <= pos2.y &&
        pos1.x + entity1.width >= pos2.x &&
        pos1.y + entity1.width >= pos2.y
    ) {
        return true;
    }

    if (
        pos1.x <= pos2.x &&
        pos2.x <= pos1.x + entity1.width &&
        pos1.y >= pos2.y &&
        pos2.y + entity2.width >= pos1.y
    ) {
        return true;
    }

    return false;
}

/**
 * 碰撞检测 ——— 判断两个实体对象是否已经碰撞
 * @param entity1 {Entity} Entity 类的实例
 * @param entity2 {Entity} Entity 类的实例
 * @returns boolen {Boolen} 对象是否碰撞
 */
function collisionDetectionThisTick(entity1, entity2) {
    // 检测是不是Entity是实例
    if (!entity1 instanceof Entity || !entity2 instanceof Entity) {
        throw new Error('参与碰撞检测对象，必须是Entity类的实例或者继承至Entity类的子类的实例');
    }

    // 排除不需要检测的对象
    if (!entity1.collision || !entity2.collision) {
        return false;
    }

    // 碰撞检测
    if (
        entity1.pos.x <= entity2.pos.x &&
        entity1.pos.y <= entity2.pos.y &&
        entity1.pos.x + entity1.width >= entity2.pos.x &&
        entity1.pos.x + entity1.width >= entity2.pos.y
    ) {
        return true;
    }

    if (
        entity1.pos.x <= entity2.pos.x &&
        entity2.pos.x <= entity1.pos.x + entity1.width &&
        entity1.pos.y >= entity2.pos.y + entity2.width &&
        entity1.pos.y - entity1.width <= entity2.pos.y + entity2.width
    ) {
        return true;
    }

    return false;
}

/**
 * 边缘检测
 * @param {Entity} entity Entity 实例
 * @return {Boolean} Boolen 是否触碰边缘
 */
function collisionBorder(entity, word) {
    // 检测是否为 Entity 类的实例
    if (!entity instanceof Entity) {
        throw new Error('参与边缘检测的对象，必须是Entity类的实例或者继承至Entity类的子类的实例');
    }

    // 边缘检测
    if (
        entity.pos.x < 0 ||
        entity.pos.x + entity.width > word.width ||
        entity.pos.y < 0 ||
        entity.pos.y + entity.width > word.height
    ) {
        return true;
    }

    return false;
}

/**
 * 获取当前帧两个实体的距离
 * @param {Entity} entity1 Entity类的实例
 * @param {Entity} entity2  Entity类的实例
 * @returns {Number} 返会两个实体的距离
 */
function getDistenceThisTick(entity1, entity2) {
    if (!entity1 instanceof Entity || !entity2 instanceof Entity) {
        throw new Error('参与距离检测的对象必须是Entity类的实例，或者继承至Entity类');
    }

    // 获取两个对象的左上角的位置
    return Math.sqrt((entity1.pos.x - entity2.pos.x) ** 2 + (entity1.pos.y - entity2.pos.y) ** 2);
}

/**
 * 获取下一帧两个实体的距离
 * @param {Entity} entity1  Entity类的实例
 * @param {Entity} entity2   Entity类的实例
 * @returns {Number} 返回两个实体的下一帧的距离
 */
function getDistenceNextTick(entity1, entity2) {
    if (!entity1 instanceof Entity || !entity2 instanceof Entity) {
        throw new Error('参与距离检测的对象必须是Entity类的实例，或者继承至Entity类');
    }

    // 先更新实体的位置再获取距离
    const pos1 = { ...entity1.pos };
    const pos2 = { ...entity2.pos };
    const move = (pos, dir, speed) => {
        const dirs = {
            top: () => (pos.y -= speed),
            left: () => (pos.x -= speed),
            right: () => (pos.x += speed),
            bottom: () => (pos.y += speed)
        };
        dirs[dir]();
    };
    move(pos1, entity1.direction, entity1.speed);
    move(pos2, entity2.direction, entity2.speed);

    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
}
// ------------------   工具函数--结束   --------------------------

/**
 * 工具类
 * 输入到控制台
 */
class Print {
    constructor(word) {
        this.word = word;
        this.word.printer = this;
    }

    debug(msg) {
        console.debug(`%cdebug: ${msg}`, 'color:#58C9B9');
    }

    info(msg) {
        console.info(`%cinfo: ${msg}`, 'color:#30A9DE');
    }

    warn(msg) {
        console.warn(`%cwarn: ${msg}`, 'color:#f9c00c');
    }

    error(msg) {
        console.error(`%cerror: ${msg}`, 'color:#E53A40');
    }

    copyright() {
        console.clear();
        console.log(
            '%c ',
            `background: url(${this.word.pwd}/image/UI.png);
            padding:0px 184px; line-height:136px;margin: 15px calc(50% - 184px);`
        );
        console.log(
            `%c@author: hec9527\n@time:   2020-1-5\n@description: \n\n\thi，你好程序员，这是我无聊时写的一个小游戏，主要是为了向经典致敬，其中很多实现方式可能不是很科学合理，或许有更好的实现方法。我知道，那些肯定都会有的，所以这个项目需要更多人来不断优化迭代它，让它能成为一个可以作为新手学习的项目，就像"hello world"或者"图书管理系统"一样，在rookie中发光发热。\n\t如果你在使用过程中发现有任何bug，或者优化建议，可以直接发送到我的邮箱:\thec9527@foxmail.com\n\n`,
            'color:red'
        );
    }
}

/**
 * 键盘类
 */
class KeyBorad {
    constructor(word) {
        this.word = word;
        this.word.keyBorad = this;

        this.keyCode = new Set();
        this.blockCode = new Set();

        // 键盘   --  按下
        window.addEventListener('keydown', e => {
            if (!this.word.game.KEYBORAD_BLOCK) {
                this.keyCode.add(e.keyCode);
            }
        });

        // 键盘  -- 抬起
        window.addEventListener('keyup', e => {
            this.keyCode.delete(e.keyCode);
            this.blockCode.delete(e.keyCode);
        });
    }

    addBlock(code) {
        return this.blockCode.add(code);
    }

    // 被屏蔽的按键
    hasBlock(code) {
        return this.blockCode.has(code);
    }

    hasKey(code) {
        return this.keyCode.has(code);
    }

    clear() {
        this.keyCode.clear();
        this.blockCode.clear();
    }
}

/**
 * 音频类
 * 负责游戏中的各种音效
 */
class Sound {
    constructor(word) {
        this.word = word;
        this.word.sound = this;

        this.loaded = false;
        this.sound = {};

        this.load();
    }

    load() {
        const pwd = this.word.pwd;
        const sound = this.sound;
        const printer = this.word.printer;
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
            start: '/music/start.mp3'
        };

        // ES2020
        Promise.allSettled(
            (() => {
                return Reflect.ownKeys(music).map(item => {
                    return new Promise((resolve, reject) => {
                        const player = new Audio();
                        let load = false;

                        setTimeout(() => {
                            if (!load) {
                                printer.warn(`音频加载失败 ${pwd + music[item]}`);
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
            printer.info('音频加载完成');
            this.loaded = true;
        });
    }

    play(sound) {
        if (Reflect.ownKeys(this.sound).includes(sound)) {
            this.sound[sound].play();
        } else {
            this.word.printer.warn('未注册的音频文件');
        }
    }
}

/**
 * 图片加载类
 * 负责加载并且处理图像
 */
class Images {
    constructor(word) {
        this.word = word;
        this.word.image = this;

        this.loaded = false;
        this.images = {};

        this.load();
    }

    load() {
        const pwd = this.word.pwd;
        const resource = this.images;
        const printer = this.word.printer;
        const images = {
            bonus: '/image/bonus.png',
            explode: '/image/explode.png', // 爆炸
            brick: '/image/brick.png',
            enemyTank: '/image/enemyTank.png',
            myTank: '/image/myTank.png',
            tool: '/image/tool.png',
            ui: '/image/UI.png'
        };

        Promise.allSettled(
            (() => {
                return Reflect.ownKeys(images).map(item => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        let load = false;

                        setTimeout(() => {
                            if (!load) {
                                printer.warn(`图片加载出错 ${pwd + images[item]}`);
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
            this.word.printer.info('图片加载完成');
            this.loaded = true;
        });
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
        this.tank = undefined; // 玩家的坦克
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
        this.word.printer.info(`steal: 玩家${index}  --->  玩家${this.index}`);
        if (this.life === 0 && this.PLAYER_LIST[index] && this.PLAYER_LIST[index].life >= 2) {
            this.life += 1;
            this.PLAYER_LIST[index].life -= 1;
        }
    }

    birth() {
        this.word.printer.info(`player${this.index} new tank`);
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
        this.word = word;
        this.word.game = this;

        // 键盘锁定
        this.KEYBORAD_BLOCK = false;
        // 玩家数量
        this.PLAYER_NUMS = 1;
        // 玩家列表 存放玩家对象
        this.PLAYER_LIST = [];
        // 游戏当前关卡
        this.GAME_RANK = 1;
        // 当前的奖励
        this.REWARD = undefined;
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
    constructor(word, image, pos, clip) {
        this.word = word;
        this.word.items.add(this);

        // 实体的游戏属性
        this.image = image; // 精灵图
        this.birthPos = pos; // 出生位置
        this.pos = pos; // 实体的实际位置
        this.camp = 'neutral'; // 实体的阵营  'neutral' 'enemy' 'ally'
        this.clipIndex = 0;
        this.clip = clip; // 实体在精灵图中的剪切位置
        this.tick = 0; // 计数器
        this.direction = 'top'; // 实体默认都朝上
        this.speed = 0; // 默认实体移速为0
        this.width = 32; // 宽高
        this.collision = true; // 是否参与碰撞检测
    }

    move() {
        const ifCanMove = Array.from(this.word.items).every(item => {
            if (item !== this) {
                return !collisionDetectionNextTick(this, item) || !collisionBorder(this, this.word);
            }
            return true;
        });
        //  ifCanMove = true;
        if (ifCanMove) {
            const dirs = {
                top: () => (this.pos.y -= this.speed),
                left: () => (this.pos.x -= this.speed),
                bottom: () => (this.pos.y += this.speed),
                right: () => (this.pos.x += this.speed)
            };
            this.tick++;
            if (this.tick >= 5) {
                this.tick = 0;
                this.clipIndex = this.clipIndex === 1 ? 0 : 1;
                if (this.changeClip instanceof Function) {
                    this.changeClip();
                }
            }
            if (this.collisionDetection instanceof Function) {
                if (this.collisionDetection()) return;
            }
            dirs[this.direction]();
        }
    }

    die() {
        this.word.items.delete(this);
    }

    update() {
        throw new Error('每个实体对象应该实现自己的<update>方法');
    }

    render() {
        this.word.ctx.drawImage(
            this.image,
            this.clip.x * this.width,
            this.clip.y * this.width,
            this.width,
            this.width,
            this.pos.x,
            this.pos.y,
            this.width,
            this.width
        );
    }
}

/**
 * 坦克类
 */
class Tank extends Entity {
    constructor(word, image, pos, clip) {
        super(word, image, pos, clip);

        // 所有坦克应该新增的属性以及方法
        this.level = 1;
        this.bulletNum = 1;
        this.bullets = new Set(); // 弹夹
        this.speed = 2; // 所有坦克的默认速度，不同坦克可以覆盖这个默认值
        this.blockShoot = false; // 射击锁定，防止连续快速无间隔射击
    }

    setBlockShoot() {
        this.blockShoot = true;
        setTimeout(() => {
            this.blockShoot = false;
        }, 50);
    }

    shoot() {
        if (this.bullets.size < this.bulletNum && !this.blockShoot) {
            this.setBlockShoot();
            return new Bullet(this);
        }
    }
}

/**
 * 敌方坦克类
 * 击杀敌方坦克根据等级不同，分数为100，200，300，400，500。
 * 使用炸弹杀死的坦克，每个200增加200分
 */
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
            bottom: () => (clip.y = 4)
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

/**
 * 友方坦克
 */
class AllyTank extends Tank {
    // deputy = true 表示为2号玩家
    constructor(word, deputy = false) {
        const image = word.images.images.myTank;
        const pos = { x: deputy ? 176 : 240, y: 416 }; // ! 注意这里的具体数值需要经过测量
        const clip = { x: 0, y: 0 };
        const p1Keys = {
            top: 87,
            left: 65,
            bottom: 83,
            right: 68,
            single: 71,
            double: 72,
            pause: 99
        };
        const p2Keys = {
            top: 38,
            left: 37,
            right: 39,
            bottom: 40,
            single: 76,
            double: 186
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
            bottom: () => (clip.y = 4)
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

        Array.from(this.word.items).some(item => {
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
        const changeDir = dir => {
            if (this.direction !== dir) {
                const col = ['top', 'bottom'];
                const row = ['left', 'right'];
                // 90度转向？
                if (
                    !(col.includes(this.direction) && col.includes(dir)) ||
                    !(row.includes(this.direction) && row.includes(dir))
                ) {
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
            if (
                (!keyBorad.hasBlock(74) && !this.deputy) ||
                (!keyBorad.hasBlock(76) && this.deputy)
            ) {
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

/**
 * 子弹类
 */
class Bullet extends Entity {
    constructor(tank) {
        const changeClip = dir => {
            if (dir === 'top') {
                return { x: 0, y: 0 };
            } else if (dir === 'bottom') {
                return { x: 2, y: 0 };
            } else if (dir === 'left') {
                return { x: 3, y: 0 };
            } else if (dir === 'right') {
                return { x: 1, y: 0 };
            }
        };
        super(tank.word, tank.word.image.images.tool, tank.pos, changeClip(tank.direction));
        this.tank = tank;
        this.word = this.tank.word;

        // 添加到实体列表
        this.word.items.add(this);
        this.tank.bullets.add(this);

        // 子弹的游戏属性
        this.width = 8;
        this.pos = this.getPos();
        this.camp = this.tank.camp;
        this.speed = this.tank.bulletSpeed || 3;
        this.direction = this.tank.direction;
    }

    getPos() {
        const dirs = {
            top: { x: this.tank.pos.x + 12, y: this.tank.pos.y },
            left: { x: this.tank.pos.x, y: this.tank.pos.y + 12 },
            bottom: { x: this.tank.pos.x + 12, y: this.tank.pos.y + 24 },
            right: { x: this.tank.pos.x + 24, y: this.tank.pos.y + 12 }
        };
        return dirs[this.tank.direction];
    }

    die() {
        super.die();
        this.tank.bullets.delete(this);
    }

    // 子弹碰撞之后立即销毁
    collisionDetection() {
        let detection = false;

        if (collisionBorder(this, this.word)) {
            this.die();
            detection = true;
        }

        // 逐个检测是否碰撞
        Array.from(this.word.items).some(item => {
            if (item === this) return false;
            if (collisionDetectionNextTick(this, item)) {
                // 子弹遇到其他阵营实体或者 遇到子弹，两者都销毁
                if (this.camp !== item.camp || item instanceof Bullet) {
                    this.die();
                    item.die();
                    detection = true;
                    return true;
                }
            }
        });

        return detection;
    }

    update() {
        this.move();
    }
}

/**
 * 奖励类
 */
class Reward extends Entity {
    constructor(word) {
        // super()
    }
}

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
        this.pwd = this.getPwd();

        // 世界元素属性
        this.items = new Set();

        // 世界其它属性
        this.printer = new Print(this);
        this.game = new Game(this);
        this.sound = new Sound(this);
        this.images = new Images(this);
        this.keyBorad = new KeyBorad(this);

        // 调用自身方法
        this.start();
    }

    getPwd() {
        const href = window.location.href;
        return href.slice(0, href.lastIndexOf('/'));
    }

    start() {
        if (!this.images.loaded || !this.sound.loaded) {
            return setTimeout(() => this.start(), 100);
        }

        this.printer.copyright();
        this.render();

        // !  测试数据
        window.t = new AllyTank(word);
        new AllyTank(word, true);
    }

    // 绘制辅助线，开发辅助线
    drawLins() {
        // 保存绘制环境
        this.ctx.save();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#60606005';

        // 竖线
        for (let i = 1; i < 26; i++) {
            this.ctx.moveTo(i * 16, 0);
            this.ctx.lineTo(i * 16, 416);
        }

        // 横线
        for (let i = 0; i < 26; i++) {
            this.ctx.moveTo(0, i * 16);
            this.ctx.lineTo(416, i * 16);
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 绘制辅助线
        // this.drawLins();

        this.items.forEach(item => {
            item.update();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

// !后期删除对外接口，采用闭包的方式使用
const word = new Word();
