/*
    keydown    keyCode
    玩家一：
             W   S    A    D    G               H              B                 
            上  下   左    右   连续/取消/后退   单点           暂停
 onkeyDown  87  83   65   68   71               72            66
 onkeypress 119 115  97   100   103             104           98

    玩家二： ↑    ↓    ←    →    K     L
            上   下   左    右   单点  连续
onkeydown   38   40   37   39         76
onkeypress      没有keyCode值




地图 416*416
每个方块13*13 个大方块              32*32像素
半个方块26*26 个小方块              






/**
 *      dramimage:
 *  1.需要绘制的图像
 *  2.图像源文件开始剪切的位置X
 *  3.图像源文件开始剪切的位置UI_bgImage_Y
 *  4.源文件剪切宽度
 *  5.源文件剪切高度
 *  6.canvas中绘制的横坐标（左上角开始）
 *  7.canvas中绘制的纵坐标
 *  8.在canvas中绘制的宽度
 *  9.在canvas中绘制的高度
 */

/**
 * top space 516*117
 * 
 * battly city   376*137
 *             left  :70
 * 
 * center space
 */

/**
 *        ******游戏进程******
 * 开始界面
 * 自定义界面
 * 关卡界面
 * 玩游戏界面
 * 结算界面
 */

/**
 * 游戏中心界面大小   416*416
 * 
 * 左边空白   35
 * 
 * 上边空白   20
 * 
 * 右边空白   65             敌人坦克数量标识  14*14
 * 
 * 下面空白   20
 * 
 * 己方boss   32*6，32*12               192，384
 */




/**
 * 自定义 模式
 * 
 * 方块数组    1-15   15为我方boss
 * 图方块 上下左右  铁方块  上下左右  水  草  冰       14种
 * 
 */

 /**
  * 背景层：保护罩、坦克出生效果、爆炸效果                  z-index=3
  *     
  * 角色层：己方坦克、地方坦克、奖励、子弹                   z-index=2
  * 
  * 砖块层：砖块、己方BOSS、敌人的数量标识、己方生命、玩家数量、旗帜         z-index=1
  * 
  * 背景层：己方BOXX 黑色不透明背景                          z-index=0
  */



/**
 * 相关书组操作
 * 
 * arr.splice(起点，长度)    在数组‘起点’中删除‘长度’个元素
 * 
 * arr.push(x)      在数组的最后插入元素 x
 * 
 */


















            

