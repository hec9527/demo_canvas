class Demo {
    constructor(elID = 'canvas') {
        this.canvas =
            document.getElementById(elID) ||
            function() {
                const el = document.createElement('canvas');
                el.style.width = '800px';
                el.style.height = '450px';
                el.style.position = 'absolute';
                el.style.margin = 'auto';
                el.style.top = 0;
                el.style.bottom = 0;
                el.style.left = 0;
                el.style.right = 0;
                el.width = 800;
                el.height = 450;
                el.style.background = 'rgba(0, 0, 0, 0.3';
                return el;
            };
        this.ctx = this.canvas.getContext('2d');
    }
}
