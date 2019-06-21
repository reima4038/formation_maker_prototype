/**
 * 踊り子
 */ 
class Dancer {
    container = new createjs.Container()
    color = Color.gray
    dragPointX = 0
    dragPointY = 0
    shadows = []
    shadowsLine = []
    constructor(id, name, x, y) {
        this.id = id
        this.name = name
        this.x = x
        this.y = y
        const scale = 10
        const circle = new createjs.Shape();
        circle.graphics.beginFill(this.color).drawCircle(x, y, scale)
        circle.cache(this.x - scale, this.y - scale, this.x + scale, this.y + scale)

        let nameText = new createjs.Text(name, "10px Arial", "brack")
        nameText.x = x - 5
        nameText.y = y - 5
        const circleIndex = 0
        const nameTextIndex = 1

        this.container.addChildAt(circle, circleIndex)
        this.container.addChildAt(nameText, nameTextIndex)

        this.container.addEventListener("mousedown", this.handleDown)
        this.container.addEventListener("pressmove", this.handleMove)
        this.container.addEventListener("pressup", this.handleUp)
    }
    handleDown = (event) => {
        this.dragPointX = event.stageX - this.container.x
        this.dragPointY = event.stageY - this.container.y
    }
    handleMove = (event) => {
        this.container.x = event.stageX - this.dragPointX
        this.container.y = event.stageY - this.dragPointY
    }
    handleUp = (event) => {
        this.x = event.stageX
        this.y = event.stageY
    }

    setColor(color) {
        this.color = color
        const circleIndex = 0
        let target = this.container.getChildAt(circleIndex)
        target.filters = [
            new createjs.ColorFilter(0, 0, 0, 1, 
                color.red, color.green, color.blue, color.alpha)
        ]
        target.updateCache()
    }
    addShadows() {
        const shadow = new createjs.Shape()
        const color = this.color.darker().semitransparent().rgba()
        shadow.graphics.beginFill(color).drawCircle(this.x, this.y, 10)
        shadow.cache(this.x - 10, this.y - 10, this.x + 10, this.y + 10)
        this.shadows.push(shadow)
        return shadow
    }
    tieShadows() {
         // FIXME: sliceはarrayの末尾アクセスのため。ぱっと見分からないからもう少しいいやり方ないかな...
        const line = this.drawLine({x : this.x, y : this.y},
             {x : this.shadows.slice(-1)[0].graphics.command.x, y : this.shadows.slice(-1)[0].graphics.command.y},
             this.color.darker().rgba())
        this.shadowsLine.push(line)
        return line
    }
    // TODO: 共通部品として外出し
    drawLine(from, to, color) {
        const line = new createjs.Shape()
        line.graphics.beginStroke(color)
        line.graphics
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
        return line;
    }
    get point() {
        return {x: this.x, y: this.y}
    }
    get container() {
        return this.container
    }
    get export() {
        let dancerJsonData = {
            id : this.id,
            name : this.name,
            x : this.x,
            y : this.y,
            shadows : []
        }
        this.shadows.forEach(s => dancerJsonData.shadows.push({x: s.graphics.command.x, y: s.graphics.command.y}))
        return dancerJsonData
    }
}

/**
 * 踊り子グループ
 */
class DancerGroup {
    dancers = []
    constructor(group_name, color) {
        this.group_name = group_name
        this.color = color
    }
    set(dancer) {
        dancer.setColor(this.color)
        this.dancers.push(dancer)
    } 
    get dancers() {
        return this.dancers
    }
    findDancer(x, y) {
        let targets = []
        this.dancers.filter(dancer => x >= dancer.point.x - 10 && x <= dancer.point.x + 10 &&
                y >= dancer.point.y - 10 && y <= dancer.point.y + 10)
            .forEach(dancer => targets.push(dancer))
        return {group_name: this.group_name, dancers: targets}
    }
    get export() {
        let dancersJsonData = {
            group_name : this.group_name,
            color : this.color,
            dancers : []
        }
        this.dancers.forEach(d => dancersJsonData.dancers.push(d.export))
        return dancersJsonData
    }
}

/**
 * 踊り子全体
 */
class DancerGroups {
    counter = 0
    groups = []
    constructor() {
    }
    addGroup(group_name, color) {
        this.groups.push(new DancerGroup(group_name, color))
    }
    addDancer(group_name, name, x, y) {
        this.groups.filter(g => g.group_name == group_name)
            .forEach(g => g.set(new Dancer(this.generateId(), name, x, y)))
    }
    get groups() {
        return this.groups
    }
    generateId() {
        return this.counter++
    }
    findDancer(x, y, callbackFunction) {
        return this.groups.flatMap(group => group.findDancer(x, y))
        .filter(result => result.dancers.length > 0)
        .map(result => result.dancers[0])
        .forEach(callbackFunction)
    }
    staging(stage) {
        this.groups.flatMap(group => group.dancers)
            .forEach(dancer => stage.addChild(dancer.container))
    }
    get export() {
        let dancerGroupsJsonData = {
            groups : []
        }
        this.groups.forEach(g => dancerGroupsJsonData.groups.push(g.export))
        return dancerGroupsJsonData
    }
}

/**
 * 踊り子の並び位置
 */
class DancerPosition {
    grid_column = {horizontal : 0, virtical : 0}
    stage_size = {width : 0, height : 0}
    constructor(stage_size, grid_horizontal_column, grid_virtical_column) {
        this.stage_size = stage_size
        this.grid_column.horizontal = grid_horizontal_column
        this.grid_column.virtical = grid_virtical_column
    }
    /**
     * 水平方向の位置を取得する
     * @param {number} position 左端から数えたグリッドのマス目 
     */
    h_position(position) {
        return this.stage_size.width / this.grid_column.horizontal * position
    }
    /**
     * 垂直方向の位置を取得する
     * @param {number} position 
     */
    v_position(position) {
        return this.stage_size.height / this.grid_column.virtical * position
    }
    get definedPosition() {
        return {
            h_four_column_outer_left : this.h_position(2),
            h_four_column_inner_left : this.h_position(6),
            h_four_column_inner_right : this.h_position(10),
            h_four_column_outer_right : this.h_position(14),
            h_three_column_left : this.h_position(2),
            h_three_column_mid : this.h_position(8),
            h_three_column_right : this.h_position(14),
            h_two_column_left : this.h_position(5),
            h_two_column_right : this.h_position(11),
            v_line_2 : this.v_position(2),
            v_line_5 : this.v_position(5),
            v_line_8 : this.v_position(8),
            v_line_11 : this.v_position(11),
            v_line_14 : this.v_position(14),
            v_line_17 : this.v_position(17),
        }
    }
}