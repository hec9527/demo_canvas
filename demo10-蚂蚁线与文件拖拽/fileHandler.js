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

// =============== public function  =================
function getFileBase(mime) {
    if (mime === undefined) return undefined;
    const fileTypes = {
        'audio/aac': '.aac',
        'video/x-msvideo': '.avi',
        'application/octet-stream': '.bin',
        'image/bmp': '.bmp',
        'application/x-bzip': '.bz',
        'application/x-bzip2': '.bz2',
        'text/css': '.css',
        'text/csv': '.csv',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-fontobject': '.eot',
        'image/gif': '.gif',
        'text/html': '.htm',
        'text/html': '.html',
        'image/vnd.microsoft.icon': '.ico',
        'image/jpeg': '.jpeg',
        'image/jpeg': '.jpg',
        'text/javascript': '.js',
        'application/json': '.json',
        'text/javascript': '.mjs',
        'audio/mpeg': '.mp3',
        'video/mpeg': '.mpeg',
        'audio/ogg': '.oga',
        'video/ogg': '.ogv',
        'application/ogg': '.ogx',
        'font/otf': '.otf',
        'image/png': '.png',
        'application/pdf': '.pdf',
        'application/vnd.ms-powerpoint': '.ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
        'application/x-rar-compressed': '.rar',
        'application/rtf': '.rtf',
        'image/svg+xml': '.svg',
        'application/x-shockwave-flash': '.swf',
        'application/x-tar': '.tar',
        'font/ttf': '.ttf',
        'text/plain': '.txt',
        'audio/wav': '.wav',
        'audio/webm': '.weba',
        'video/webm': '.webm',
        'image/webp': '.webp',
        'font/woff': '.woff',
        'font/woff2': '.woff2',
        'application/xhtml+xml': '.xhtml',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/xml': '.xml',
        'application/vnd.mozilla.xul+xml': '.xul',
        'application/zip': '.zip',
        'video/3gpp': '.3gp',
        'video/3gpp2': '.3g2',
        'application/x-7z-compressed': '.7z'
    };
    return fileTypes[mime];
}

function getFileSize(size) {
    size = Number(size);

    if (size < 1024) {
        return size + 'B';
    } else if (size < 1024 * 1024) {
        return Number(size / 1024).toFixed(2) + 'KB';
    } else if (size < Math.pow(1024, 3)) {
        return Number(size / 1024 / 1024).toFixed(2) + 'MB';
    } else if (size < Math.pow(1024, 4)) {
        return Number(size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
    } else {
        return size + 'B';
    }
}

// ===================== class  =====================

/**
 *
 * @class FileClick
 * @param {callback} callback
 * @param {elID} elID
 */
class FileClick {
    constructor(callback, elID = 'fileReader') {
        document.getElementById(elID).addEventListener(
            'change',
            e => {
                const file = e.target.files[0];
                const fileReader = new FileReader();

                if (!file) return alert('文件读取出错！');

                fileReader.onload = e => {
                    file.fileData = e.target.result;
                    file.base = getFileBase(file.type || undefined);
                    file.computedSize = getFileSize(file.size || undefined);
                    callback(file);
                };
                fileReader.readAsDataURL(file);
            },
            false
        );
    }
}

class FileDrager {
    constructor(callback, elID = 'uploader') {
        const el = document.getElementsByClassName(elID)[0];

        // 需要将这两个事件的默认事件给禁用了
        el.addEventListener(
            'dragenter',
            e => {
                e.preventDefault();
                e.stopPropagation();
            },
            false
        );

        // 在这两个阶段的默认事件都应该禁用了
        el.addEventListener(
            'dragover',
            e => {
                e.stopPropagation();
                e.preventDefault();
            },
            false
        );

        // drop 事件  drop  drop  放下拖动放下的事件 不是drag
        el.addEventListener(
            'drop',
            e => {
                const fileReader = new FileReader();
                const file = e.dataTransfer.files[0];

                e.stopPropagation();
                e.preventDefault();

                fileReader.onload = e => {
                    file.fileData = e.target.result;
                    file.base = getFileBase(file.type || undefined);
                    file.computedSize = getFileSize(file.size || undefined);
                    callback(file);
                };
                fileReader.readAsDataURL(file);
            },
            false
        );
    }
}

class FileHandler {
    constructor(elID = 'myCanvas') {
        // ----------  初始化对象属性   -------------
        const self = this;
        this.canvas = document.getElementById(elID);
        this.ctx = this.canvas.getContext('2d');
        this.file = undefined;
        this.image = undefined;
        this.toolBar = {
            open: document.getElementsByClassName('toolbar-items reupload')[0],
            select: document.getElementsByClassName('toolbar-items select')[0],
            submit: document.getElementsByClassName('toolbar-items submit')[0],
            info: document.getElementsByClassName('toolbar-items info')[0],
            reset: document.getElementsByClassName('toolbar-items refresh')[0]
        };

        // 画板参数对象
        window.args = this.args = {
            canvasCenter: [self.canvas.width / 2, self.canvas.height / 2],
            imageCenter: [self.canvas.width / 2, self.canvas.height / 2],
            imageSize: [0, 0],
            minZoom: 0.1,
            maxZoom: 10,
            zoom: undefined,
            rotate: 0
        };

        // -----------------  初始化对象的事件监听    ----------------
        new FileDrager(e => this.fileChange(e));
        new FileClick(e => this.fileChange(e));

        this.canvas.addEventListener('mousewheel', this.mousewheel, false);

        // -------------------    左侧工具栏按键监听    -------------------
        // 打开
        this.toolBar.open.addEventListener(
            'click',
            e => {
                console.log('打开');
                this.toolBar.reset.click();
                document.getElementById('fileReader').click();
            },
            false
        );

        // 创建选区
        this.toolBar.select.addEventListener(
            'click',
            e => {
                console.log('select');
            },
            false
        );

        // 提交
        this.toolBar.submit.addEventListener(
            'click',
            e => {
                console.log('提交');
            },
            false
        );

        // 信息
        this.toolBar.info.addEventListener(
            'click',
            e => {
                console.log('信息');
            },
            false
        );

        // 重制
        this.toolBar.reset.addEventListener(
            'click',
            e => {
                console.log('重置');
            },
            false
        );
    }

    // ------------------------    功能方法区     ------------------------
    // 文件加载
    fileChange(e) {
        this.file = e;
        this.image = this.file.fileData;

        if (String(this.file.type).split('/')[0] !== 'image') {
            return alert('请打开图片类型');
        }
        console.log('fileLoaded:\n', this.file);

        document.onresize = () => this.resizeCanvas();
        this.changeSection();
        this.resizeCanvas();
        this.getZoom();
    }

    // 加载文件之后调用，如果已经加载图片文件则切换到编辑界面
    changeSection() {
        const sections = document.getElementsByClassName('section');

        sections[0].classList.add('hide');
        sections[1].classList.remove('hide');
    }

    // 重置canvas大小
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    // 鼠标滚动
    mousewheel(e) {
        e.stopPropagation();
        e.preventDefault();

        // 按下ctrl缩放
        if (e.ctrlKey) {
            // 缩小
            if (e.deltaX < 0 || e.deltaY < 0) {
                const zoom = Math.min(e.deltaX, e.deltaY) / 10;
                self.args.zoom =
                    self.args.zoom > self.args.minZoom ? self.args.zoom - zoom : self.args.minZoom;
            } else if (e.deltaX > 0 || e.deltaY > 0) {
                // 放大
                const zoom = Math.max(e.deltaX, e.deltaY) / 10;
                self.args.zoom =
                    self.args.zoom < self.args.maxZoom ? self.args.zoom + zoom : self.args.maxZoom;
            }
        } else if (e.altKey) {
            // 按下altkey旋转
            let rotate = 0;

            if (e.deltaX < 0 || e.deltaY < 0) {
                // 顺时针  增加角度
                rotate = Math.min(e.deltaX, e.deltaY) / 2;
            } else if (e.deltaX > 0 || e.deltaY > 0) {
                // 逆时针  减少角度
                rotate = Math.max(e.deltaX, e.deltaY) / 2;
            }

            self.args.rotate += rotate;
            self.args.rotate = self.args.rotate % 360;
            console.log(self.args.rotate);
        } else {
            // 向右移动
            if (e.deltaX < 0) {
                self.args.imageCenter[0] =
                    self.args.imageCenter[0] < ((this.width * 1.5) | 0)
                        ? self.args.imageCenter[0] - e.deltaX / 2
                        : (this.width * 1.5) | 0;
            } else if (e.deltaX > 0) {
                // 向左移动
                self.args.imageCenter[0] =
                    self.args.imageCenter[0] > ((-this * 0.5) | 0)
                        ? self.args.imageCenter[0] - e.deltaX / 2
                        : (-this.width * 0.5) | 0;
            }
            // 向下移动
            if (e.deltaY < 0) {
                self.args.imageCenter[1] =
                    self.args.imageCenter[1] <= ((this.height * 1.5) | 0)
                        ? self.args.imageCenter[1] - e.deltaY / 2
                        : (this.height * 1.5) | 0;
            } else if (e.deltaY > 0) {
                // 向上移动
                self.args.imageCenter[1] =
                    self.args.imageCenter[1] > ((-this.height * 0.5) | 0)
                        ? self.args.imageCenter[1] - e.deltaY / 2
                        : (-this.height * 0.5) | 0;
            }
        }
    }

    // 获取图片的缩放比例
    getZoom() {
        const el = document.createElement('img');
        el.onload = e => {
            const ratioImage = el.width / el.height;
            const ratioCanvas = this.canvas.width / this.canvas.height;

            //  canvas相对图片更宽
            if (ratioCanvas > ratioImage) {
                this.args.zoom = this.canvas.height / el.height;
            } else {
                this.args.zoom = this.canvas.width / el.width;
            }

            this.image = el;
            this.args.imageSize = [el.width, el.height];
            this.draw();
        };
        el.src = this.image;
    }

    // 绘制
    draw() {
        // 旋转是旋转画布然后绘画，画完了再将画布旋转回来
        // 涉及中心旋转问题，根据图片的中心位置来计算图片旋转后的位置

        if (!this.image) return setTimeout(() => this.draw(), 100);

        // 图片缩放后的大小
        const w = (this.args.imageSize[0] * this.args.zoom) | 0;
        const h = (this.args.imageSize[1] * this.args.zoom) | 0;
        const r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2; // 定点到中心的距离

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.rotate((this.args.rotate * Math.PI) / 180);

        this.ctx.rotate(0);

        requestAnimationFrame(() => this.draw());
    }
}

new FileHandler();
