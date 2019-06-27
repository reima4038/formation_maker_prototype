/**
 * ベースのボタンクラス
 */
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

/*---------------------------------
 * 具象ボタン
 *---------------------------------*/

const button_size = {
  width : 100,
  height : 40,
  gap : 10
}

class SaveButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Save', button_size.width, button_size.height, "#d9534f")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}

class RefleshButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Refresh', button_size.width, button_size.height, "#d9534f")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}

class ExportButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Export', button_size.width, button_size.height, "#d9534f")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}

class ImportButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Import', button_size.width, button_size.height, "#d9534f")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}