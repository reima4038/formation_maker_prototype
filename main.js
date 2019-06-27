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
 * コンテキスト
 *---------------------------*/
const manipurationMode = {
    PLACEMENT : 'placement', // 配置
    MOVE : 'move', // 移動
}

const ctx = {
    manipuration_mode : manipurationMode.PLACEMENT,
    dancer_groups : new DancerGroups()
}

/*---------------------------
 * 背景
 *---------------------------*/
// 背景
const back_ground = new BackGround(stage_size)
back_ground.staging(stage)

// 枠線
const frame_border = new FrameBorder(stage_size)
frame_border.drawLine()
frame_border.staging(stage)

// グリッド
const grid = new Grid(grid_properties.x, grid_properties.y, stage_size)
grid.drawLine()
grid.staging(stage)

const backgroud_index = grid.lastIndex(stage)

// リザーブエリア
const reserve_area = new ReservationArea()
stage.addChild(reserve_area.area)

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
exportButton.container.addEventListener("click", event => exportJsonData(JSON.stringify(dancer_groups.export)));
importButton.container.addEventListener("click", event => importData(successCallBack, () => {}));

const successCallBack = (file) => {
    const jsonData = JSON.parse(file)  

    ctx.dancer_groups.removeAllGroups().forEach(d => stage.removeChild(d))
    jsonData.groups.forEach(g => {
        ctx.dancer_groups.addGroup(g.group_name, new ColorDefine(g.color.red, g.color.green, g.color.blue, g.color.alpha))
        g.dancers.forEach(d => ctx.dancer_groups.addDancer(g.group_name, d.name, d.x, d.y))
    })
    ctx.dancer_groups.staging().forEach(d => stage.addChild(d))
}

/*---------------------------
 * イベント
 *---------------------------*/

stage.addEventListener("mousedown", handleMouseDown)
stage.addEventListener("pressmove", handleMove)
stage.addEventListener("pressup", handleUp)
stage.addEventListener("dblclick", dblClick)

// 選択領域
const selected_area = new createjs.Shape()
selected_area.graphics
    .setStrokeStyle(1.0)
    .beginStroke('black')
    .rect(0, 0, 0, 0)
selected_area.visible = false
stage.addChild(selected_area)

// TODO: ポインター座標情報
const point = {
    click_x: 0,
    click_y: 0,
    drag_x: 0,
    drag_y: 0
}

function handleMouseDown(event) {
    const foundDancer = ctx.dancer_groups.findDancer(event.stageX, event.stageY)

    if(ctx.manipuration_mode === manipurationMode.PLACEMENT){
        if(foundDancer) {
            foundDancer.selected()
        } else {
            ctx.dancer_groups.unSelect()
            // 選択領域
            if(selected_area.visible == false) {
                point.click_x = event.stageX
                point.click_y = event.stageY
                selected_area.visible = true
                selected_area.graphics
                    .clear()
                    .setStrokeStyle(1.0)
                    .beginStroke('black').rect(point.click_x, point.click_y, 0, 0)
            }
        }
    } else if(ctx.manipuration_mode === manipurationMode.MOVE) {
        // マウスクリックした地点の踊り子の地点を影として記録する
        // 影が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.addShadows(), backgroud_index)
        }
    }
}

function handleMove(event) {
    // 選択領域
    if(selected_area.visible == true) {
        point.drag_x = event.stageX
        point.drag_y = event.stageY
        selected_area.graphics
            .clear()
            .setStrokeStyle(1.0)
            .beginStroke('black')
            .rect(point.click_x, point.click_y, point.drag_x - point.click_x, point.drag_y - point.click_y)
    }
    
}

function handleUp(event) {
    if(ctx.manipuration_mode === manipurationMode.PLACEMENT){
        // 選択領域
        if(selected_area.visible == true) {
            ctx.dancer_groups.select(point.click_x < point.drag_x ? point.click_x : point.drag_x,
            point.click_y < point.drag_y ? point.click_y : point.drag_y,
            point.click_x < point.drag_x ? point.drag_x - point.click_x : point.click_x - point.drag_x,
            point.click_y < point.drag_y ? point.drag_y - point.click_y : point.click_y - point.drag_y)
            point.click_x = 0
            point.click_y = 0
            point.drag_x = 0
            point.drag_y = 0
            selected_area.graphics.clear()
            selected_area.visible = false
        }
    } else if(ctx.manipuration_mode === manipurationMode.MOVE){
        // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
        // 影を結ぶ線が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        const foundDancer = ctx.dancer_groups.findDancer(event.stageX, event.stageY)
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.tieShadows(), backgroud_index)
        }
    }
    // TODO: マウスを離したときにリザーブの中にいる踊り子の状態を反映する
}

function dblClick(event) {
    point.click_x = event.stageX
    point.click_y = event.stageY
    selected_area.graphics.clear()
    selected_area.visible = false

    // リザーブに送り込む
    const dancer = ctx.dancer_groups.findDancer(event.stageX, event.stageY)
    const position = reserve_area.reservePosition(reserve_area.reservers.length)
    if(dancer != null && position != null) {
        reserve_area.reservers.push(dancer)
        dancer.move(position.x, position.y)
    }
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}