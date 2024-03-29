// 背景
class BackGround {
    back_ground = new createjs.Shape()
    constructor(stage_size) {
        this.back_ground.graphics.beginFill('white')
        this.back_ground.graphics.rect(0, 0, stage_size.width, stage_size.height)
    }
    staging(stage) {
        stage.addChild(this.back_ground)
    }
}

// 背景：枠線
class FrameBorder {
    frame_border
    stage_size = {width : 0, height : 0}
    constructor(stage_size) {
        this.stage_size = stage_size
        this.frame_border = new createjs.Shape()
    }
    drawLine() {
        this.frame_border.graphics.beginStroke("DarkRed")
        this.frame_border.graphics
            .moveTo(0, 0)
            .lineTo(this.stage_size.width, 0)
            .lineTo(this.stage_size.width, this.stage_size.height)
            .lineTo(0, this.stage_size.height)
            .lineTo(0, 0)
    }
    staging(stage) {
        stage.addChild(this.frame_border)
    }
}

// 背景：グリッド
class Grid {
    horizontal_column = 0
    virtical_column = 0
    line_bold_interval = 2
    stage_size = {width : 0, height : 0}
    grid_horizontal = []
    grid_virtical = []
    constructor(horizontal_column, virtical_column, stage_size) {
        this.horizontal_column = horizontal_column
        this.virtical_column = virtical_column
        this.stage_size = stage_size
    }
    get horizontal_column() {
        return this.horizontal_column
    }
    get virtical_column() {
        return this.virtical_column
    }
    get line_bold_interval() {
        return this.horizontal_column
    }
    get horizontal_interval() {
        return this.stage_size.width / this.horizontal_column
    }
    get virtical_interval() {
        return this.stage_size.height / this.virtical_column
    }
    drawLine() {
        for(let i = 1; i < this.horizontal_column; i++) {
            let horizon_line = new createjs.Shape()
            horizon_line.graphics.beginStroke(i % this.line_bold_interval == 0 ? "darkgray": "gainsboro")
            horizon_line.graphics
                .moveTo(this.horizontal_interval * i, 0)
                .lineTo(this.horizontal_interval * i, this.stage_size.height)
            this.grid_horizontal.push(horizon_line)
        }
        
        for(let i = 1; i < this.virtical_column; i++) {
            let virtical_line = new createjs.Shape()
            virtical_line.graphics.beginStroke(i % this.line_bold_interval == 0 ? "darkgray": "gainsboro")
            virtical_line.graphics
                .moveTo(0, this.virtical_interval * i)
                .lineTo(this.stage_size.width, this.virtical_interval * i)
            this.grid_virtical.push(virtical_line)
        }
        
    }
    staging(stage) {
        this.grid_horizontal.forEach(grid => stage.addChild(grid))
        this.grid_virtical.forEach(grid => stage.addChild(grid))
    }

    lastIndex(stage) {
        return stage.getChildIndex(this.grid_virtical[this.grid_virtical.length - 1])
    }

}