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
        bonus: './image/bonus.png',
        boom: './image/Boom.png',
        brick: './image/brick.png',
        enemyTank: './image/enemyTank.png',
        myTank: './image/myTank.png',
        tool: './image/tool.png',
        ui: './image/UI.png'
    },
    sound: {
        attack: '/music/attack.mp3',
        attackOver: '/music/attackOver.mp3',
        boomb: '/music/bomb.mp3',
        eat: '/music/eat.mp3',
        explode: '/music/explode.mp3',
        life: '/music/life.mp3',
        misc: '/music/misc.mp3',
        over: '/music/over.mp3',
        pasue: '/music/pause.mp3',
        start: '/music/start.mp3'
    }
};
