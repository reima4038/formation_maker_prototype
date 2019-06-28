class Pointer {
    click_x = 0
    click_y = 0
    drag_x = 0
    drag_y = 0
    constructor() {
        
    }
    click(x, y) {
        this.click_x = x
        this.click_y = y
    }
    drag(x, y) {
        this.drag_x = x
        this.drag_y = y
    }

    init() {
        this.click_x = 0
        this.click_y = 0
        this.drag_x = 0
        this.drag_y = 0
    }
    get click_x() {
        return this.click_x
    }
    get click_y() {
        return this.click_y
    }
    get drag_x() {
        return this.drag_x
    }
    get drag_y() {
        return this.drag_y
    }
    get point() {
        return {
            click_x: this.click_x,
            click_y: this.click_y,
            drag_x: this.drag_x,
            drag_y: this.drag_y
        }
    }
    /**
     * ドラッグした量を取得する
     */
    get dragDistance(){
        return {
            w: this.drag_x - this.click_x,
            h: this.drag_y - this.click_y
        }
    }
    /**
     * ポインタで描いた矩形を取得する
     */
    get selectArea() {
        return {
            x: this.click_x < this.drag_x ? this.click_x : this.drag_x,
            y: this.click_y < this.drag_y ? this.click_y : this.drag_y,
            w: this.click_x < this.drag_x ? this.drag_x - this.click_x : this.click_x - this.drag_x,
            h: this.click_y < this.drag_y ? this.drag_y - this.click_y : this.click_y - this.drag_y
        }
    }
}
