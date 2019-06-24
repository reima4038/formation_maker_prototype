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

    dancerGroups.removeAllGroups().forEach(d => stage.removeChild(d))
    jsonData.groups.forEach(g => {
        dancerGroups.addGroup(g.group_name, new ColorDefine(g.color.red, g.color.green, g.color.blue, g.color.alpha))
        g.dancers.forEach(d => dancerGroups.addDancer(g.group_name, d.name, d.x, d.y))
    })
    dancerGroups.staging().forEach(d => stage.addChild(d))
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
const reserve = []
/**
 * 横5列として左から並べた場合における、指定した順番のx, y座標を取得する
 */ 
function reservePosition(number) {
    const column = 5
    if(number > reserve.length) {
        alert(`Error! : Number should be less than reserve size. number: ${number}, reserve.size: ${reserve.size}`)
    } else {
        const gap_px = 40
        const origin = {
            x: reserve_area.graphics.command.x + gap_px / 2,
            y: reserve_area.graphics.command.y + gap_px / 2
        }
        return {
            x: origin.x + gap_px * (number % column),
            y: origin.y + gap_px * Math.floor(number / 5)
        }
    }
}

const dancerGroups = new DancerGroups()

/*---------------------------
 * イベント
 *---------------------------*/

const manipurationMode = {
    PLACEMENT : 'placement', // 配置
    MOVE : 'move', // 移動
}

const status = {
    manipuration_mode : manipurationMode.PLACEMENT
}

stage.addEventListener("mousedown", handleMouseDown)
stage.addEventListener("pressup", handleUp)
stage.addEventListener("dblclick", dblClick)
function handleMouseDown(event) {
    if(status.manipuration_mode === manipurationMode.MOVE) {
        // マウスクリックした地点の踊り子の地点を影として記録する
        // 影が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        const foundDancer = dancerGroups.findDancer(event.stageX, event.stageY)
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.addShadows(), backgroud_index)
        }
    }
}

function handleUp(event) {
    if(status.manipuration_mode === manipurationMode.MOVE){
        // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
        // 影を結ぶ線が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        const foundDancer = dancerGroups.findDancer(event.stageX, event.stageY)
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.tieShadows(), backgroud_index)
        }
    }
    // TODO: マウスを離したときにリザーブの中にいる踊り子の状態を反映する
}

function dblClick(event) {
    // リザーブに送り込む
    const dancer = dancerGroups.findDancer(event.stageX, event.stageY)
    const position = reservePosition(reserve.length)
    if(dancer != null && position != null) {
        reserve.push(dancer)
        dancer.move(position.x, position.y)
    }
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}