/**
 * 踊り子
 */ 
class Dancer {
    container = new createjs.Container();
    dragPointX = 0;
    dragPointY = 0;
    shadows = [];

    constructor(id, name, x, y, stage_width, stage_height) {
        this.id = id
        this.name = name
        this.x = x
        this.y = y
        let circle = new createjs.Shape();
        circle.graphics.beginFill("gray").drawCircle(x, y, 10)
        circle.cache(0, 0, stage_width, stage_height)

        let nameText = new createjs.Text(name, "10px Arial", "brack")
        nameText.x = x - 5
        nameText.y = y - 5
        nameText.cache(0, 0, stage_width, stage_height)

        const circleIndex = 0
        const nameTextIndex = 1

        this.container.addChildAt(circle, circleIndex)
        this.container.addChildAt(nameText, nameTextIndex)

        this.container.addEventListener("mousedown", this.handleDown)
        this.container.addEventListener("pressmove", this.handleMove)
        this.container.addEventListener("pressup", this.handleUp)
    }
    setColor(color) {
        const circleIndex = 0
        let target = this.container.getChildAt(circleIndex);
        target.filters = [
            new createjs.ColorFilter(0, 0, 0, 1, 
                color.red, color.green, color.blue, color.alpha)
        ]
        target.updateCache()
    }

    addShadows(stage_width, stage_height) {
        const shadow = new createjs.Shape();
        shadow.graphics.beginFill("gray").drawCircle(this.x, this.y, 10)
        shadow.cache(0, 0, stage_width, stage_height)
        this.shadows.push(shadow)
        return shadow
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
    
    get point() {
        return {x: this.x, y: this.y}
    }
    get container() {
        return this.container
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
    findDancers(x, y) {
        let targets = []
        this.dancers.filter(dancer => x >= dancer.point.x - 10 && x <= dancer.point.x + 10 &&
                y >= dancer.point.y - 10 && y <= dancer.point.y + 10)
            .forEach(dancer => targets.push(dancer))
        return {group_name: this.group_name, dancers: targets}
    }
}

/**
 * 踊り子全体
 */
class DancerGroups {
    counter = 0
    groups = []
    stage_scale = {width : 0, height : 0}
    constructor(stage_scale) {
        this.stage_scale = stage_scale
    }
    addGroup(group_name, color) {
        this.groups.push(new DancerGroup(group_name, color))
    }
    addDancer(group_name, name, x, y) {
        this.groups.filter(g => g.group_name == group_name)
            .forEach(g => g.set(new Dancer(this.generateId(), name, x, y, this.stage_scale.width, this.stage_scale.height)))
    }
    get groups() {
        return this.groups
    }
    generateId() {
        return this.counter++
    }
    staging(stage) {
        this.groups.flatMap(group => group.dancers)
            .forEach(dancer => stage.addChild(dancer.container))
    }
}

/**
 * 踊り子の並び位置
 */
class DancerPosition {
    grid_column = {horizontal : 0, virtical : 0}
    stage_scale = {width : 0, height : 0}
    constructor(stage_scale, grid_horizontal_column, grid_virtical_column) {
        this.stage_scale = stage_scale
        this.grid_column.horizontal = grid_horizontal_column
        this.grid_column.virtical = grid_virtical_column
    }
    /**
     * 水平方向の位置を取得する
     * @param {number} position 左端から数えたグリッドのマス目 
     */
    h_position(position) {
        return this.stage_scale.width / this.grid_column.horizontal * position
    }
    /**
     * 垂直方向の位置を取得する
     * @param {number} position 
     */
    v_position(position) {
        return this.stage_scale.height / this.grid_column.virtical * position
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