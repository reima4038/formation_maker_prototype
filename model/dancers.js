/**
 * 踊り子
 */ 
class Dancer {
    container = new createjs.Container()
    color = Color.gray
    shadows = []
    shadowsLine = []
    selected = false
    // 選択時に他の踊り子と共連れて移動するための現在位置保持用フィールド
    // FIXME:実際の現在位置を表すthis.contain.pointと混同しそうなので少し可読性をあげたい。
    currentPosition = {x:0, y:0}
    constructor(id, name, x, y) {
        this.id = id
        this.name = name
        const radius = 10
        this.move(x, y)
        const circle = new createjs.Shape()
        circle.graphics.beginFill(this.color).drawCircle(0, 0, radius)
        circle.cache(-radius, -radius, radius * 2, radius * 2)

        const selectedCircle = new createjs.Shape()
        selectedCircle.graphics.beginStroke(this.color).drawCircle(0, 0, radius + 3)
        selectedCircle.cache(-(radius+3), -(radius+3), (radius+3)*2, (radius+3)*2)
        selectedCircle.visible = false

        let nameText = new createjs.Text(name, "10px Arial", "brack")
        nameText.x = -5
        nameText.y = -5
        const circleIndex = 0
        const selectedCircleIndex = 1
        const nameTextIndex = 2

        this.container.addChildAt(circle, circleIndex)
        this.container.addChildAt(selectedCircle, selectedCircleIndex)
        this.container.addChildAt(nameText, nameTextIndex)

        this.container.addEventListener("mousedown", this.handleDown)
        this.container.addEventListener("pressmove", this.handleMove)
        this.container.addEventListener("pressup", this.handleUp)
    }
    handleDown = (event) => {
        console.log(this)
    }
    handleMove = (event) => {
        this.move(event.stageX, event.stageY)
    }
    handleUp = (event) => {
        this.move(event.stageX, event.stageY)
    }
    /**
     * 絶対座標で移動する。
     * @param {number} x : 移動後のx座標
     * @param {number} y : 移動後のy座標
     */
    move(x, y) {
        this.container.x = x
        this.container.y = y
    }
    /**
     * 相対値で移動する
     * @param {number} w : x軸の移動量
     * @param {number} h : y軸の移動量
     */
    relativeMove(w, h) {
        this.container.x += w
        this.container.y += h
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
        const radius = 10
        shadow.graphics.beginFill(color).drawCircle(this.point.x, this.point.y, radius)
        shadow.cache(this.point.x - radius, this.point.y - radius, this.point.x + radius, this.point.y + radius)
        this.shadows.push(shadow)
        return shadow
    }
    tieShadows() {
         // FIXME: sliceはarrayの末尾アクセスのため。ぱっと見分からないからもう少しいいやり方ないかな...
        const line = this.drawLine(this.point,
            {x : this.shadows.slice(-1)[0].graphics.command.x, y : this.shadows.slice(-1)[0].graphics.command.y},
            this.color.darker().rgba())
        this.shadowsLine.push(line)
        return line
    }
    removeShadows() {
        let removeTargets = []
        removeTargets.push(this.shadows)
        removeTargets.push(this.shadowsLine)
        this.shadows = []
        this.shadowsLine = []
        return removeTargets
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
    select() {
        this.selected = true
        const selectedCicleIndex = 1
        this.container.getChildAt(selectedCicleIndex).visible = true
    }
    unSelect() {
        this.selected = false
        const selectedCicleIndex = 1
        this.container.getChildAt(selectedCicleIndex).visible = false
    }
    saveCurrentPosition() {
        this.currentPosition = this.point
    }
    get getId() {
        return this.id
    }
    get currentPosition() {
        return this.currentPosition
    }
    get isSelected() {
        return this.selected
    }
    get point() {
        return {x: this.container.x, y: this.container.y}
    }
    get container() {
        return this.container
    }
    get export() {
        let dancerJsonData = {
            id : this.id,
            name : this.name,
            x : this.point.x,
            y : this.point.y,
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
    get groupName() {
        return this.group_name
    }
    findDancer(x, y) {
        let targets = []
        this.dancers.filter(dancer => x >= dancer.point.x - 10 && x <= dancer.point.x + 10 &&
                y >= dancer.point.y - 10 && y <= dancer.point.y + 10)
            .forEach(dancer => targets.push(dancer))
        return {
            group_name: this.group_name,
            dancers: targets
        }
    }
    selectedDancers() {
        return this.dancers.filter(d => d.isSelected == true)
    }
    select(x, y, w, h) {
        this.dancers.filter(d => d.point.x >= x && d.point.x <= x + w &&
            d.point.y <= y + h && d.point.y >= y)
            .forEach(d => d.select())
    }
    unSelect() {
        this.dancers.forEach(d => d.unSelect())
    }
    removeDancer(remove_dancer_id) {
        this.dancers = this.dancers.filter(d => d.id != remove_dancer_id)
    }
    removeAllDancers() {
        this.dancers = []
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
    get allDancers() {
        return this.groups.flatMap(g => g.dancers)
    }
    removeAllDancersShadows() {
        return this.allDancers.flatMap(d => d.removeShadows())
            .filter(t => t.length > 0)
            .flatMap(t => t)

    }
    generateId() {
        return this.counter++
    }
    findDancer(x, y) {
        const foundDancer = this.groups.flatMap(g => g.findDancer(x, y))
        .filter(result => result.dancers.length > 0) // これ以降は要素数1以上の配列に絞れる
        .map(result => result.dancers)
        .find(dancers => dancers) // 配列の最初の要素を返す
        return foundDancer != null ? foundDancer[0] : null
    }
    get selectedDancers() {
        return this.groups.flatMap(g => g.selectedDancers())
    }
    select(x, y, w, h) {
        // 誤選択を防ぐため、閾値設定。また、通常選択されない値が入力されたときは処理を実行されない。
        const threshold = 25
        if(w * h > threshold && x != 0 && y != 0) {
            this.groups.forEach(g => g.select(x, y, w, h))
        } 
    }
    selectArea(area) {
        this.select(area.x, area.y, area.w, area.h)
    }
    unSelect() {
        this.groups.forEach(g => g.unSelect())
    }
    selectedDancerChangeGroup(group_name) {
        if(this.groups.filter(g => g.groupName == group_name).length <= 0) {
            log.warn(`[Changing Group] Command Failed. Selected Dancer Group is not Found.`)
        }
        const selectedDancer = this.selectedDancers
        this.groups.forEach(g => selectedDancer.map(d => d.id).forEach(id => g.removeDancer(id)))
        this.groups.filter(g => g.groupName == group_name)
            .forEach(g => selectedDancer.forEach(d => g.set(d)))

    }

    /**
     * ステージング対象を取得する
     */
    staging() {
        return this.groups.flatMap(group => group.dancers)
            .map(d => d.container)
    }
    removeAllGroups() {
        const targets = this.staging()
        this.groups.forEach(g => g.removeAllDancers())
        this.groups = []
        return targets
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
    /**
     * グリッド上のマス目を座標に変換する
     * @param {number} gridX 
     * @param {number} gridY 
     */
    gridToCoordinate(gridX, gridY) {
        return {
            x: this.h_position(gridX),
            y: this.v_position(gridY)
        }
    }
    get oneGridWidth() {
        return this.stage_size.width / this.grid_column.horizontal
    }
    get oneGridHeight() {
        return this.stage_size.height / this.grid_column.virtical
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