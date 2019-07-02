// リザーブエリア
class ReservationArea {
    shape = new createjs.Shape()
    reservers = []
    constructor(stage_size) {
        this.shape.graphics
            .beginStroke('darkred')
            .beginFill('white')
            .rect(stage_size.width + 10, 270, 210, 328)
    }
    get reservers() {
        return this.reservers
    }
    get shape() {
        return this.shape
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
