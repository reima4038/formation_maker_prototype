class Button {
  container = new createjs.Container()
  constructor(text, width, height, keyColor) {
    this.container.name = text
    this.container.cursor = 'pointer'
    const bgUp = new createjs.Shape()
    bgUp.graphics
      .setStrokeStyle(1.0)
      .beginStroke(keyColor)
      .beginFill('white')
      .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4)
    this.container.addChild(bgUp)
    bgUp.visble = true
    const bgOver = new createjs.Shape()
    bgOver.graphics
      .beginFill(keyColor)
      .drawRoundRect(0, 0, width, height, 4)
    bgOver.visible = false // 非表示にする
    this.container.addChild(bgOver)
    // ラベル
    const label = new createjs.Text(text, "14px sans-serif", keyColor)
    label.x = width / 2
    label.y = height / 2
    label.textAlign = "center"
    label.textBaseline = "middle"
    this.container.addChild(label)

    // event listener
    this.container.addEventListener("mouseover", event => this.bgUpVisible(bgUp, bgOver, label, 'white'))
    this.container.addEventListener("mouseout", event => this.bgOverVisible(bgUp, bgOver, label, keyColor))
  }
  bgUpVisible(bgUp, bgOver, label, color) {
    bgUp.visble = false
    bgOver.visible = true
    label.color = color
  }
  bgOverVisible(bgUp, bgOver, label, color) {
    bgUp.visble = true
    bgOver.visible = false
    label.color = color
  }
  position(x, y) {
    this.container.x = x
    this.container.y = y
  }
  get container() {
    return this.container
  } 
}
