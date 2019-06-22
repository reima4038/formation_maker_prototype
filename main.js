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

// 枠線
const frame_border = new FrameBorder(stage_size)
frame_border.drawLine()
frame_border.staging(stage)

// グリッド
const grid = new Grid(grid_properties.x, grid_properties.y, stage_size)
grid.drawLine()
grid.staging(stage)

const backgroud_index = grid.lastIndex(stage)

const dancerGroups = new DancerGroups()

/*---------------------------
 * ボタン類
 *---------------------------*/
const saveButton = createButton('Save', 100, 40, "#d9534f")
saveButton.x = 375
saveButton.y = 0
stage.addChild(saveButton)

const refleshButton = createButton('Refresh', 100, 40, "#d9534f")
refleshButton.x = 375
refleshButton.y = 60
stage.addChild(refleshButton)

const exportButton = createButton('Export', 100, 40, "#d9534f")
exportButton.x = 375
exportButton.y = 120
stage.addChild(exportButton)

const importButton = createButton('Import', 100, 40, "#d9534f")
importButton.x = 375
importButton.y = 180
stage.addChild(importButton)

saveButton.addEventListener("click", event => saveCanvas('png', target));
refleshButton.addEventListener("click", event => location.reload());
exportButton.addEventListener("click", event => exportJsonData(JSON.stringify(dancerGroups.export)));
importButton.addEventListener("click", event => importJsonData(dancerGroups, stage));

/*---------------------------
 * イベント
 *---------------------------*/
stage.addEventListener("mousedown", handleMouseDown)
stage.addEventListener("pressup", handleUp)

function handleMouseDown(event) {
    // マウスクリックした地点の踊り子の地点を影として記録する
    // 影が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
    dancerGroups.findDancer(event.stageX, event.stageY, d => stage.addChildAt(d.addShadows(), backgroud_index))
}

function handleUp(event) {
    // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
    // 影を結ぶ線が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
    dancerGroups.findDancer(event.stageX, event.stageY, d => stage.addChildAt(d.tieShadows(), backgroud_index))
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}