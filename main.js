const stage = new createjs.Stage("hello_create_js")

// タッチ操作をサポートしているブラウザーならば
if(createjs.Touch.isSupported() == true){
    // タッチ操作を有効にします。
    createjs.Touch.enable(stage)
}

const stage_width = 300
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

// 踊り子
class Dancer {
    container = new createjs.Container();
    dragPointX = 0;
    dragPointY = 0;

    constructor(number, name, x, y, stage_width, stage_height) {
        this.number = number

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
        console.log(event)
        this.dragPointX = stage.mouseX - this.container.x
        this.dragPointY = stage.mouseY - this.container.y
    }
    handleMove = (event) => {
        this.container.x = stage.mouseX - this.dragPointX
        this.container.y = stage.mouseY - this.dragPointY
    }
    handleUp = (event) => {

    }

    get container() {
        return this.container
    }
}

class DancerGroup {
    dancers = []
    constructor(color) {
        this.color = color
    }
    set(dancer) {
        dancer.setColor(this.color)
        this.dancers.push(dancer)
    } 
    get dancers() {
        return this.dancers
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
let front_group = new DancerGroup(Color.coral)
let mid_group = new DancerGroup(Color.mediumaquamarine)
let back_group = new DancerGroup(Color.skyblue)

front_group.set(new Dancer(1, "れいま", 50, 50, stage_width, stage_height))
front_group.set(new Dancer(2, "ふじもん", 150, 50, stage_width, stage_height))
front_group.set(new Dancer(3, "りょうご", 250, 50, stage_width, stage_height))
front_group.set(new Dancer(4, "ちぇる", 50, 100, stage_width, stage_height))
front_group.set(new Dancer(5, "レイバン", 150, 100, stage_width, stage_height))
front_group.set(new Dancer(6, "くー", 250, 100, stage_width, stage_height))

mid_group.set(new Dancer(8, "まさ", 100, 175, stage_width, stage_height))
mid_group.set(new Dancer(9, "純", 200, 175, stage_width, stage_height))
mid_group.set(new Dancer(10, "まり", 100, 225, stage_width, stage_height))
mid_group.set(new Dancer(11, "びー", 200, 225, stage_width, stage_height))

back_group.set(new Dancer(12, "キャス", 50, 300, stage_width, stage_height))
back_group.set(new Dancer(13, "きり", 150, 300, stage_width, stage_height))
back_group.set(new Dancer(14, "なたり", 250, 300, stage_width, stage_height))
back_group.set(new Dancer(15, "むーらん", 50, 350, stage_width, stage_height))
back_group.set(new Dancer(16, "ねぎ", 150, 350, stage_width, stage_height))
back_group.set(new Dancer(17, "きらら", 250, 350, stage_width, stage_height))

front_group.dancers.forEach(dancer => {
    stage.addChild(dancer.container)
})

mid_group.dancers.forEach(dancer => {
    stage.addChild(dancer.container)
})

back_group.dancers.forEach(dancer => {
    stage.addChild(dancer.container)
})

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}