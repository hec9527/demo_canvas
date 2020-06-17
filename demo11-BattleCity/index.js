"use strict";
/**
 * @author    hec9527
 * @time      2020/06/17
 * @change    2020/06/17
 * @description
 *
 *     不知道第多少版，修改为TS版本
 *
 *     let's go
 *
 */
(function () {
    function typeOf(value) {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }
    function isEmpty(value) {
        return [NaN, undefined, null, false, ''].includes(value);
    }
    function getCanvas(size = 32) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        return { canvas, ctx };
    }
    function getGameCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        // TODO 设置canvas的大小
        // canvas.width =
        // canvas.height =
        return { canvas, ctx };
    }
    function copyright() {
        console.clear();
        // TODO 修改那啥
        // console.log('%c ', `background: url(${PWD}/image/UI.png);padding:0px 184px; line-height:136px;margin: 15px calc(50% - 184px);`);
        console.log(`%c@author: hec9527\n@time:   2020-1-5\n@description: \n\n\thi，留了一个小彩蛋，竟然被你发现了。看来阁下应该是个程序员没错了，既然如此，不知可否有意向一起来优化一下这个小游戏。如果你在使用过程中发现有任何bug，或者优化建议，可以直接发起pr或者发送到我的邮箱:\thec9527@foxmail.com\n\n`, 'color:red');
    }
    class Tool {
        // abstract collisionBorderNextTick(): void;
        static getPwd() {
            return window.location.href.slice(0, window.location.href.lastIndexOf('/'));
        }
    }
    class KeyBorad {
        constructor() {
            // 屏蔽所有按键响应
            this.isBlockKeys = false;
            // 按下的按键
            this.keysCode = new Set();
            // 暂时屏蔽的按键，防止快速连续响应
            this.blockedCode = new Set();
            // 暂时屏蔽的时间
            this.interval = 150;
            window.addEventListener('keydown', (e) => {
                this.keysCode.add(e.keyCode);
            });
            window.addEventListener('keyup', (e) => {
                this.keysCode.delete(e.keyCode);
            });
        }
        addBlockKey(code) {
            this.blockedCode.add(code);
            setTimeout(() => this.blockedCode.delete(code), this.interval);
        }
        showKeys() {
            console.log(`%c当前Keys:${Array.from(this.keysCode).toString()}`, 'color:#abf');
        }
        isTapKey(code) {
            if (this.isBlockKeys || this.blockedCode.has(code) || !this.keysCode.has(code)) {
                return false;
            }
            else {
                this.addBlockKey(code);
                return true;
            }
        }
        isPressKey(code, disableKey = false) {
            if (this.isBlockKeys || !this.keysCode.has(code)) {
                return false;
            }
            else {
                if (disableKey) {
                    this.addBlockKey(code);
                }
                return true;
            }
        }
        clearKeyBorad() {
            this.keysCode.clear();
            this.blockedCode.clear();
        }
    }
    class Media {
        constructor() {
            this._isLoad = false;
            this.sounds = {};
            this.files = ['attack', 'attackOver', 'bomb', 'eat', 'move', 'life', 'misc', 'over', 'pause', 'start'];
            this.loadMedia();
        }
        async loadMedia() {
            // ES2020
            return await Promise.allSettled(this.files.map((value) => {
                return new Promise((resolve, reject) => {
                    const player = new Audio();
                    const timer = setTimeout(() => {
                        console.error(`音频加载失败：/music/${value}.mp3`);
                        reject();
                    }, 10000);
                    player.oncanplay = () => {
                        clearTimeout(timer);
                        Reflect.defineProperty(this.sounds, value, { value: player.src });
                        resolve();
                    };
                    player.src = Tool.getPwd() + `/music/${value}.mp3`;
                });
            })).then(() => {
                console.log('%cinfo 音频加载完成', 'color:#30A9DE');
                this._isLoad = true;
            });
        }
        isLoad() {
            return this._isLoad;
        }
        play(msic) {
            if (this.files.includes(msic)) {
                const player = new Audio();
                player.src = this.sounds[msic];
                player.play();
            }
            else {
                console.error('未注册的音频文件:', msic);
            }
        }
    }
    class Images {
        constructor() {
            this._isLoad = false;
            this.files = ['bonus', 'explode', 'brick', 'enemyTank', 'myTank', 'tool', 'UI', 'getScore', 'getScoreDouble'];
            this.images = {};
            this.loadImages();
        }
        loadImages() {
            Promise.allSettled(Object.keys(this.files).map((value) => {
                return new Promise((resolve, reject) => {
                    const img = document.createElement('img');
                    const timer = setTimeout(() => {
                        console.error(`图片加载出错, ${'/image/' + value + '.png'}`);
                        reject();
                    }, 5000);
                    img.onload = () => {
                        clearTimeout(timer);
                        Object.defineProperty(this.images, value, { value: img });
                        resolve();
                    };
                    img.src = Tool.getPwd() + `/image/${value}.png`;
                });
            })).then(() => {
                console.info('%cinfo 图片加载完成', 'color:#30A9DE');
                this._isLoad = true;
            });
        }
    }
})();
