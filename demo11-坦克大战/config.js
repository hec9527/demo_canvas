/**
 * @author     hec9527
 * @time       2020-1-4
 * @change     2020-1-4
 * @description
 *
 *      1, BattleCity 配置文件
 *      2, 用于加载游戏素材配置
 */

//  暂时存放在全局对象上面，等游戏加载后，读取到闭包中然后删除这个属性，防止外部注入
window.config = {
    image: {
        bonus: '/image/bonus.png',
        explode: '/image/explode.png', // 爆炸
        brick: '/image/brick.png',
        enemyTank: '/image/enemyTank.png',
        myTank: '/image/myTank.png',
        tool: '/image/tool.png',
        ui: '/image/UI.png'
    },
    sound: {
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
    }
    // clip: {
    //     bonus: {
    //         image: 'bonus',
    //         icon: {
    //             spade: [0, 0], // 铁锹
    //             star: [1, 0], // 五角星
    //             tank: [2, 0], // 坦克
    //             helmet: [3, 0], // 头盔
    //             boomb: [4, 0], // 炸弹
    //             timing: [5, 0] // 定时弹
    //         }
    //     },
    //     scope: {
    //         image: 'bonus',
    //         icon: {
    //             '100': [0, 1],
    //             '200': [1, 1],
    //             '300': [2, 1],
    //             '400': [3, 1],
    //             '500': [4, 1]
    //         }
    //     },
    //     birth: {
    //         image: 'bonus',
    //         icon: {
    //             step1: [0, 2],
    //             step2: [1, 2],
    //             step3: [2, 2],
    //             step4: [3, 2]
    //         }
    //     },
    //     explode: {
    //         // 爆炸效果
    //         image: 'explode',
    //         icon: {
    //             step1: [0, 0],
    //             step2: [1, 0],
    //             step3: [2, 0],
    //             step4: [3, 0]
    //         }
    //     },
    //     brick: {
    //         image: 'brick',
    //         icon:{
    //             brick
    //         }
    //     }
    // }
};
