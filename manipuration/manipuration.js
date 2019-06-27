const ManipurationMode = {
    PLACEMENT : 'placement', // 配置
    MOVE : 'move', // 移動
}

// 矩形選択
class RectangleSelection {
    container = new createjs.Shape()
    constructor() {
        this.container.graphics
            .setStrokeStyle(1.0)
            .beginStroke('black')
            .rect(0, 0, 0, 0)
        this.container.visible = false
    }
    show() {
        this.container.visible = true
    }
    hide() {
        this.container.visible = false
        this.container.graphics.clear()
    }
    draw(x, y, w, h) {
        this.container.visible = true
        this.container.graphics
            .clear()
            .setStrokeStyle(1.0)
            .beginStroke('black').rect(x, y, w, h)
    }
    get isVisible() {
        return this.container.visible
    }    
    get container() {
        return this.container
    }
}