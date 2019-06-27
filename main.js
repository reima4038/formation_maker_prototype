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

const ctx = {
    manipuration_mode : ManipurationMode.PLACEMENT,
    pointer : initPointer(),
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
stage.addChild(new SaveButton(stage_size.width, 0, event => saveCanvas('png', target)).container)
stage.addChild(new RefleshButton(stage_size.width, 1, event => location.reload()).container)
stage.addChild(new ImportButton(stage_size.width, 2, event => importData(successCallBack, () => {})).container)
stage.addChild(new ExportButton(stage_size.width, 3, event => exportJsonData(JSON.stringify(ctx.dancer_groups.export))).container)

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

function handleMouseDown(event) {
    const foundDancer = ctx.dancer_groups.findDancer(event.stageX, event.stageY)

    if(ctx.manipuration_mode === ManipurationMode.PLACEMENT){
        if(foundDancer) {
            foundDancer.select()
        } else {
            ctx.dancer_groups.unSelect()
            // 選択領域
            if(selected_area.visible == false) {
                ctx.pointer.click_x = event.stageX
                ctx.pointer.click_y = event.stageY
                selected_area.visible = true
                selected_area.graphics
                    .clear()
                    .setStrokeStyle(1.0)
                    .beginStroke('black').rect(ctx.pointer.click_x, ctx.pointer.click_y, 0, 0)
            }
        }
    } else if(ctx.manipuration_mode === ManipurationMode.MOVE) {
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
        ctx.pointer.drag_x = event.stageX
        ctx.pointer.drag_y = event.stageY
        selected_area.graphics
            .clear()
            .setStrokeStyle(1.0)
            .beginStroke('black')
            .rect(ctx.pointer.click_x, ctx.pointer.click_y, ctx.pointer.drag_x - ctx.pointer.click_x, ctx.pointer.drag_y - ctx.pointer.click_y)
    }
    
}

function handleUp(event) {
    if(ctx.manipuration_mode === ManipurationMode.PLACEMENT){
        // 選択領域
        if(selected_area.visible == true) {
            ctx.dancer_groups.select(ctx.pointer.click_x < ctx.pointer.drag_x ? ctx.pointer.click_x : ctx.pointer.drag_x,
            ctx.pointer.click_y < ctx.pointer.drag_y ? ctx.pointer.click_y : ctx.pointer.drag_y,
            ctx.pointer.click_x < ctx.pointer.drag_x ? ctx.pointer.drag_x - ctx.pointer.click_x : ctx.pointer.click_x - ctx.pointer.drag_x,
            ctx.pointer.click_y < ctx.pointer.drag_y ? ctx.pointer.drag_y - ctx.pointer.click_y : ctx.pointer.click_y - ctx.pointer.drag_y)
            ctx.pointer = initPointer()
            selected_area.graphics.clear()
            selected_area.visible = false
        }
    } else if(ctx.manipuration_mode === ManipurationMode.MOVE){
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
    ctx.pointer.click_x = event.stageX
    ctx.pointer.click_y = event.stageY
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