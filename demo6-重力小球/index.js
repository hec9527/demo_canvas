/**
 * 重力小球
 */
class GravityBall {
    constructor(world) {
        this.world = world;
        this.world.items.push(this);

        this.x = this.world.width / 2;
        this.y = this.world.height / 4;
        this.color = '#30A9DE';
    }
}

/**
 * 世界
 */
class World {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        //摩擦
        this.frictional = 0.89;
        this.items = [];
        this.width = this.canvas.height = this.canvas.offsetWidth;
        this.height = this.canvas.width = this.canvas.offsetHeight;
        this.mousePos = { x: -1000, y: -1000 };

        // 事件监听
        window.addEventListener(
            'mousemove',
            e => {
                this.mousePos.x = e.pageX;
                this.mousePos.y = e.pageY;
            },
            false
        );
    }

    render() {
        this.canvas.width = this.width;
        this.items.forEach(item => {
            item.upadte();
            item.render();
        });

        window.requestAnimationFrame(() => this.render());
    }
}

const world = new World();
