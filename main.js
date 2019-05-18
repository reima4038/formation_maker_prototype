const stage = new createjs.Stage("hello_create_js")

// タッチ操作をサポートしているブラウザーならばタッチ操作を有効にします。
if(createjs.Touch.isSupported() == true){
    createjs.Touch.enable(stage)
}

// 横幅は3列, 4列どちらも対応するためどちらでも割れる数とする
const stage_width = 12 * 30
const stage_height = 600

// 背景：枠線
let frame_border = new createjs.Shape()
frame_border.graphics.beginStroke("DarkRed")
frame_border.graphics
    .moveTo(0, 0)
    .lineTo(stage_width, 0)
    .lineTo(stage_width, stage_height)
    .lineTo(0, stage_height)
    .lineTo(0, 0)
stage.addChild(frame_border)

// 背景：グリッド(横4列)
const horizontal_column = 12
const virtical_column = 24
let grid_horizontal = []
let grid_virtical = []
const horizontal_interval = stage_width / horizontal_column
const virtical_interval = stage_height / virtical_column
for(let i = 1; i < horizontal_column; i++) {
    let horizon_line = new createjs.Shape()
    horizon_line.graphics.beginStroke(i % 2 == 0 ? "darkgray": "gainsboro")
    horizon_line.graphics
        .moveTo(stage_width / horizontal_column * i, 0)
        .lineTo(stage_width / horizontal_column * i, stage_height)
    grid_horizontal.push(horizon_line)
}

for(let i = 1; i < virtical_column; i++) {
    let virtical_line = new createjs.Shape()
    
    virtical_line.graphics.beginStroke(i % 2 == 0 ? "darkgray": "gainsboro")
    virtical_line.graphics
        .moveTo(0, stage_height / virtical_column * i)
        .lineTo(stage_width, stage_height / virtical_column * i)
    grid_virtical.push(virtical_line)
}

grid_horizontal.forEach(grid => stage.addChild(grid))
grid_virtical.forEach(grid => stage.addChild(grid))







// 踊り子
class Dancer {
    container = new createjs.Container();
    dragPointX = 0;
    dragPointY = 0;

    constructor(number, name, x, y, stage_width, stage_height) {
        this.number = number
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
    handleDown = (event) => {
        this.dragPointX = event.stageX - this.container.x
        this.dragPointY = event.stageY - this.container.y
    }
    handleMove = (event) => {
        this.container.x = event.stageX - this.dragPointX
        this.container.y = event.stageY - this.dragPointY
    }
    handleUp = (event) => {

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
        this.dancers.filter(dancer => x >= dancer.point.x -5 && x <= dancer.point.x + 5 &&
                y >= dancer.point.y - 5 && y <= dancer.point.y + 5)
            .forEach(dancer => targets.push(dancer))
        return {group_name: this.group_name, dancers: targets}
    }
}

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

// 踊り子：丸
let dancerGroups = []
let front_group = new DancerGroup("front_group", Color.coral)
let mid_group = new DancerGroup("mid_group", Color.mediumaquamarine)
let back_group = new DancerGroup("back_group", Color.skyblue)
dancerGroups.push(front_group, mid_group, back_group)

// 並び位置
const three_column_left = stage_width / 12 * 2;
const three_column_mid = stage_width / 12 * 6;
const three_column_right = stage_width / 12 * 10;
const two_column_left = stage_width / 12 * 4
const two_column_right = stage_width / 12 * 8

// front_groupは3列で並ぶ
front_group.set(new Dancer(1, "れいま", three_column_left, 50, stage_width, stage_height))
front_group.set(new Dancer(2, "ふじもん", three_column_mid, 50, stage_width, stage_height))
front_group.set(new Dancer(3, "りょうご", three_column_right, 50, stage_width, stage_height))
front_group.set(new Dancer(4, "ちぇる", three_column_left, 100, stage_width, stage_height))
front_group.set(new Dancer(5, "レイバン", three_column_mid, 100, stage_width, stage_height))
front_group.set(new Dancer(6, "くー", three_column_right, 100, stage_width, stage_height))

// mid_groupは2列で並ぶ
mid_group.set(new Dancer(8, "まさ", two_column_left, 175, stage_width, stage_height))
mid_group.set(new Dancer(9, "純", two_column_right, 175, stage_width, stage_height))
mid_group.set(new Dancer(10, "まり", two_column_left, 225, stage_width, stage_height))
mid_group.set(new Dancer(11, "びー", two_column_right, 225, stage_width, stage_height))

// back_gorupは3列で並ぶ
back_group.set(new Dancer(12, "キャス", three_column_left, 300, stage_width, stage_height))
back_group.set(new Dancer(13, "きり", three_column_mid, 300, stage_width, stage_height))
back_group.set(new Dancer(14, "なたり", three_column_right, 300, stage_width, stage_height))
back_group.set(new Dancer(15, "むーらん", three_column_left, 350, stage_width, stage_height))
back_group.set(new Dancer(16, "ねぎ", three_column_mid, 350, stage_width, stage_height))
back_group.set(new Dancer(17, "きらら", three_column_right, 350, stage_width, stage_height))

dancerGroups.flatMap(group => group.dancers)
    .forEach(dancer => {
        stage.addChild(dancer.container)
    })

stage.addEventListener("mousedown", handleMouseDown)
function handleMouseDown(event) {
    // マウスクリックした地点のグループ情報および踊り子情報を取得する
    dancerGroups.flatMap(group => group.findDancers(event.stageX, event.stageY))
        .filter(result => result.dancers.length > 0)
        .forEach(result => {
            console.log(result.group_name)
            console.log(result.dancers)
        })
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}