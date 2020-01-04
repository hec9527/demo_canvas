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
window.confirm = {
    image: {},
    sound: {}
};
