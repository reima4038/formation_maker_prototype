const target = 'hello_create_js'
const stage = new createjs.Stage(target)

// タッチ操作をサポートしているブラウザーならばタッチ操作を有効にする
if(createjs.Touch.isSupported() == true){
    createjs.Touch.enable(stage)
}

// マウス操作時 マウスオーバーを有効化
stage.enableMouseOver();

// グリッド（マス）の情報
const grid_properties = {
    x : 16,
    y : 26,
    size : 23,
    scale : 1.0
}

// 横幅は3列, 4列どちらも対応するためどちらでも割れる数
const stage_size = {
    width : grid_properties.x * grid_properties.size * grid_properties.scale,
    height : grid_properties.y * grid_properties.size * grid_properties.scale
}

/*---------------------------
 * 背景
 *---------------------------*/
// 背景
const back_ground = new createjs.Shape()
back_ground.graphics.beginFill('white')
back_ground.graphics.rect(0, 0, stage_size.width, stage_size.height)
stage.addChild(back_ground)

// 枠線
const frame_border = new FrameBorder(stage_size)
frame_border.drawLine()
frame_border.staging(stage)

// グリッド
const grid = new Grid(grid_properties.x, grid_properties.y, stage_size)
grid.drawLine()
grid.staging(stage)

const backgroud_index = grid.lastIndex(stage)

/*---------------------------
 * ボタン類
 *---------------------------*/
const button_size = {
    width : 100,
    height : 40,
    gap : 10
}
const saveButton = new Button('Save', button_size.width, button_size.height, "#d9534f")
saveButton.position(stage_size.width + button_size.gap, (button_size.height + button_size.gap) * 0)
stage.addChild(saveButton.container)

const refleshButton = new Button('Refresh', button_size.width, button_size.height, "#d9534f")
refleshButton.position(stage_size.width + button_size.gap, (button_size.height + button_size.gap) * 1)
stage.addChild(refleshButton.container)

const exportButton = new Button('Export', button_size.width, button_size.height, "#d9534f")
exportButton.position(stage_size.width + button_size.gap, (button_size.height + button_size.gap) * 2)
stage.addChild(exportButton.container)

const importButton = new Button('Import', button_size.width, button_size.height, "#d9534f")
importButton.position(stage_size.width + button_size.gap, (button_size.height + button_size.gap) * 3)
stage.addChild(importButton.container)

saveButton.container.addEventListener("click", event => saveCanvas('png', target));
refleshButton.container.addEventListener("click", event => location.reload());
exportButton.container.addEventListener("click", event => exportJsonData(JSON.stringify(dancerGroups.export)));
importButton.container.addEventListener("click", event => importData(successCallBack, () => {}));

const successCallBack = (file) => {
    const jsonData = JSON.parse(file)
    jsonData.groups.forEach(g => {
        dancerGroups.addGroup(g.group_name, new ColorDefine(g.color.red, g.color.green, g.color.blue, g.color.alpha))
        g.dancers.forEach(d => dancerGroups.addDancer(g.group_name, d.name, d.x, d.y))
    })
    dancerGroups.staging(stage)
}

/*---------------------------
 * リザーブ
 *---------------------------*/

const reserve_area = new createjs.Shape()
reserve_area.graphics
    .beginStroke('darkred')
    .beginFill('white')
    .rect(stage_size.width + 10, 200, 210, 400)
stage.addChild(reserve_area)

const dancerGroups = new DancerGroups()

/*---------------------------
 * イベント
 *---------------------------*/

const manipurationMode = {
    PLACEMENT : 'placement',
    MOVE : 'move'
}

const status = {
    manipuration_mode : manipurationMode.PLACEMENT
}

stage.addEventListener("mousedown", handleMouseDown)
stage.addEventListener("pressup", handleUp)

function handleMouseDown(event) {
    if(status.manipuration_mode === manipurationMode.MOVE){
        // マウスクリックした地点の踊り子の地点を影として記録する
        // 影が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        stage.addChildAt(dancerGroups.findDancer(event.stageX, event.stageY).addShadows(), backgroud_index)
    }
}

function handleUp(event) {
    if(status.manipuration_mode === manipurationMode.MOVE){
        // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
        // 影を結ぶ線が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        stage.addChildAt(dancerGroups.findDancer(event.stageX, event.stageY).tieShadows(), backgroud_index)
    }
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}