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
    pointer : new Pointer(),
    dancers : new DancerGroups()
}

/*---------------------------
 * 背景
 *---------------------------*/
// 背景
new BackGround(stage_size).staging(stage)

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

// ボタン類
stage.addChild(new SaveButton(stage_size.width, 0, event => saveCanvas('png', target)).container)
stage.addChild(new RefleshButton(stage_size.width, 1, event => location.reload()).container)
stage.addChild(new ImportButton(stage_size.width, 2, event => importData(successCallBack, () => {})).container)
stage.addChild(new ExportButton(stage_size.width, 3, event => exportJsonData(JSON.stringify(ctx.dancers.export))).container)

const successCallBack = (file) => {
    const jsonData = JSON.parse(file)  

    ctx.dancers.removeAllGroups().forEach(d => stage.removeChild(d))
    jsonData.groups.forEach(g => {
        ctx.dancers.addGroup(g.group_name, new ColorDefine(g.color.red, g.color.green, g.color.blue, g.color.alpha))
        g.dancers.forEach(d => ctx.dancers.addDancer(g.group_name, d.name, d.x, d.y))
    })
    ctx.dancers.staging().forEach(d => stage.addChild(d))
}

/*---------------------------
 * イベント
 *---------------------------*/

stage.addEventListener("mousedown", handleMouseDown)
stage.addEventListener("pressmove", handleMove)
stage.addEventListener("pressup", handleUp)
stage.addEventListener("dblclick", dblClick)

const selected_area = new RectangleSelection()
stage.addChild(selected_area.container)

function handleMouseDown(event) {
    const foundDancer = ctx.dancers.findDancer(event.stageX, event.stageY)

    if(ctx.manipuration_mode === ManipurationMode.PLACEMENT){
        if(foundDancer) {
            foundDancer.select()
        } else {
            ctx.dancers.unSelect()
            // 選択領域
            if(selected_area.isVisible == false) {
                ctx.pointer.click(event.stageX, event.stageY)
                selected_area.draw(ctx.pointer.click_x, ctx.pointer.click_y, 0, 0)
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
    if(selected_area.isVisible == true) {
        ctx.pointer.drag(event.stageX, event.stageY)
        selected_area.draw(ctx.pointer.click_x, ctx.pointer.click_y,
             ctx.pointer.drag_x - ctx.pointer.click_x, ctx.pointer.drag_y - ctx.pointer.click_y)
    }
    
}

function handleUp(event) {
    if(ctx.manipuration_mode === ManipurationMode.PLACEMENT){
        // 選択領域
        if(selected_area.isVisible == true) {
            ctx.dancers.selectArea(ctx.pointer.selectArea)
            ctx.pointer.init()
            selected_area.hide()
        }
    } else if(ctx.manipuration_mode === ManipurationMode.MOVE){
        // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
        // 影を結ぶ線が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        const foundDancer = ctx.dancers.findDancer(event.stageX, event.stageY)
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.tieShadows(), backgroud_index)
        }
    }
    // TODO: マウスを離したときにリザーブの中にいる踊り子の状態を反映する
}

function dblClick(event) {
    ctx.pointer.click(event.stageX, event.stageY)
    selected_area.hide()

    // リザーブに送り込む
    const dancer = ctx.dancers.findDancer(event.stageX, event.stageY)
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