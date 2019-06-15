// 踊り子
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

//--------------
// 色定義
//--------------
class ColorDefine {
    constructor(r, g, b, a) {
        this.red = r
        this.green = g
        this.blue = b
        this.alpha = a
    }
}

const Color = {
    coral : new ColorDefine(255, 127, 80, 0),
    mediumaquamarine : new ColorDefine(102, 205, 170),
    skyblue : new ColorDefine(135, 206, 235)
}