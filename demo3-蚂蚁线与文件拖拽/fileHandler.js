/**
 * @time    2019-12-15
 * @change  2019-12-15
 * @author  hec9527
 * @description
 *
 *   1. 利用canvas来操作图片
 *   2. 实现图片的放大，缩小，移动，裁剪，混合等功能
 *   3. 相较于第一版的内容来说，这一版的蚂蚁线使用canvas绘制不在使用HTML元素实现
 */

import FileClick from './fileUploaderClick';
import fileDrag from './fileUploaderDrager';

export default class FileHandler {
    constructor(elID = 'myCanvas') {
        // ----------  初始化对象属性   -------------
        this.el = document.getElementById(elID);
        this.file = undefined;
        this.fileTyps = [];
        this.toolBar = {
            open: document.getElementsByClassName('toolbar-items reupload')[0],
            move: document.getElementsByClassName('toolbar-items move')[0],
            select: document.getElementsByClassName('toolbar-items select')[0],
            rotateL: document.getElementsByClassName('toolbar-items rotateL')[0],
            rotateR: document.getElementsByClassName('toolbar-items rotateR')[0],
            enlarge: document.getElementsByClassName('toolbar-items enlarge')[0],
            narrow: document.getElementsByClassName('toolbar-items narrow')[0],
            minus: document.getElementsByClassName('toolbar-items minus')[0],
            submit: document.getElementsByClassName('toolbar-items submit')[0],
            info: document.getElementsByClassName('toolbar-items info')[0],
            reset: document.getElementsByClassName('toolbar-items refresh')[0]
        };

        // -----------------  初始化对象的事件监听    ----------------
        new fileDrag(e => {
            this.file = e;
            if (String(app.file.type).split('/')[0] !== 'image') return alert('请打开图片文件');
        });
    }

    // ------------------------    功能方法区     ------------------------
    static ss() {
        //
    }
}

const fileHandler = new FileHandler();
