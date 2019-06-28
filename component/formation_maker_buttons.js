/*---------------------------------
 * システム系ボタン
 *---------------------------------*/
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

/*---------------------------------
 * 踊り子操作ボタン
 *---------------------------------*/
class CollectVirticalButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Collect:V', button_size.width, button_size.height, "#336699")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}

class CollectHorizonButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Collect:H', button_size.width, button_size.height, "#336699")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}

class CollectRectangleButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Collect:□', button_size.width, button_size.height, "#336699")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}

class ChangePlacesButton extends Button {
  constructor(stage_size_width, number, click_callback) {
    super('Chg.Places', button_size.width, button_size.height, "#336699")
    this.position(stage_size_width  + button_size.gap, (button_size.height + button_size.gap) * number)
    this.container.addEventListener("click", click_callback)
  }
}