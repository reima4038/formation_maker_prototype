// リザーブエリア
class ReservationArea {
    shape = new createjs.Shape()
    reservers = []
    area = { x: 0, y: 270, w: 210, h: 328 }
    stage_size = {}
    constructor(stage_size) {
        const margin = 10
        this.area.x = stage_size.width + margin
        this.stage_size = stage_size
        this.shape.graphics
            .beginStroke('darkred')
            .beginFill('white')
            .rect(this.area.x, this.area.y, this.area.w, this.area.h)
    }
    get reservers() {
        return this.reservers
    }
    get shape() {
        return this.shape
    }
    get area() {
        return this.area
    }
    /**
     * リザーバー枠内に存在する踊り子を整列させる
     * @param {Dancer[]} dancers 
     */
    collectDancersWithinArea(dancers) {
        this.reflesh()
        dancers.filter(d => this.isOutOfStage(d.point.x, d.point.y) == true)
            .filter(d => this.reservers.map(d => d.getId).includes(d.getId) == false)
            .forEach(d => {
                d.unSelect()
                this.push(d)
            })
    }
    reflesh() {
        if(this.reservers.length > 0) {
            const detentions = this.reservers.filter(d => this.isOutOfStage(d.point.x, d.point.y) == true)
            this.reservers = []
            detentions.forEach(d => this.push(d))
        }
    }
    /**
     * ステージ外に存在するか確認する
     * @param {number} x 
     * @param {number} y 
     */
    isOutOfStage(x, y) {
        return x > this.stage_size.width || x < 0
            || y > this.stage_size.height || y < 0
    }
    push(dancer) {
        const position = this.reservePosition(reserve_area.reservers.length)
        if(dancer != null && position != null) {
            this.reservers.push(dancer)
            dancer.move(position.x, position.y)
        }
    }
    /**
     * 横5列として左から並べた場合における、指定した順番のx, y座標を取得する
     */ 
    reservePosition(number) {
        const column = 5
        if(number > this.reservers.length) {
            alert(`Error! : Number should be less than reserve size. number: ${number}, reserve.size: ${this.reservers.size}`)
        } else {
            const gap_px = 40
            const origin = {
                x: this.shape.graphics.command.x + gap_px / 2,
                y: this.shape.graphics.command.y + gap_px / 2
            }
            return {
                x: origin.x + gap_px * (number % column),
                y: origin.y + gap_px * Math.floor(number / 5)
            }
        }
    }
}
