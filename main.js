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

function isInStageArea(x, y) {
    return x > 0 && x < stage_size.width && y > 0 && y < stage_size.height
}

/*---------------------------
 * 隊列表コンテキスト
 *---------------------------*/
class Context {
    manipuration_mode = ManipurationMode.PLACEMENT
    pointer = new Pointer()
    dancers = new DancerGroups()

    get manipuration_mode(){
        return this.manipuration_mode
    }
    get pointer() {
        return this.pointer
    }
    get dancers() {
        return this.dancers
    }
}
const ctx = new Context()

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
const reserve_area = new ReservationArea(stage_size)
stage.addChild(reserve_area.shape)

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

stage.addChild(new CollectVirticalButton(stage_size.width + button_size.width + button_size.gap, 0, event => collectDancersToVirtical()).container)
stage.addChild(new CollectHorizonButton(stage_size.width + button_size.width + button_size.gap, 1, event => collectDancersToHorizon()).container)
stage.addChild(new CollectRectangleButton(stage_size.width + button_size.width + button_size.gap, 2, event => collectDancersToRectangle()).container)
stage.addChild(new ChangePlacesButton(stage_size.width + button_size.width + button_size.gap, 3, event => changePlaces()).container)

function collectDancersToVirtical() {
    const selectedDancer = ctx.dancers.selectedDancers
    const origin = {x: 0, y: 0}
    const originDancer = selectedDancer.reduce((a, b) => distanceFromOrigin(origin, a) > distanceFromOrigin(origin, b) ? a : b)
    const gridHeight = stage_size.height / grid_properties.y
    const collectYOrigin = (grid_properties.y / selectedDancer.length) / 2 * gridHeight
    const gridGapY = (grid_properties.y / selectedDancer.length) * gridHeight
    selectedDancer.forEach((d, i) => d.move(originDancer.point.x, collectYOrigin + (gridGapY * i)))
}

function collectDancersToHorizon() {
    const selectedDancer = ctx.dancers.selectedDancers
    const origin = {x: 0, y: 0}
    const originDancer = selectedDancer.reduce((a, b) => distanceFromOrigin(origin, a) > distanceFromOrigin(origin, b) ? a : b)
    const gridWidth = stage_size.width / grid_properties.x
    const collectXOrigin = (grid_properties.x / selectedDancer.length) / 2 * gridWidth
    const gridGapX = (grid_properties.x / selectedDancer.length) * gridWidth
    selectedDancer.forEach((d, i) => d.move(collectXOrigin + (gridGapX * i) , originDancer.point.y))
}

// FIXME: Util化していい類の共通関数
function distanceFromOrigin(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

/**
 * 4列N行の四角形に配置する。
 * 原点をグリッドの(2, 2)とし、そこから右に4マスずつ配置する。
 * 4人並んだら次の行とする。
 */
function collectDancersToRectangle() {
    const dp = new DancerPosition(stage_size, grid_properties.x, grid_properties.y)
    const origin = dp.gridToCoordinate(2, 2)
    const grid_gap_x = 4
    const grid_gap_y = 3
    const column = 4
    ctx.dancers.selectedDancers.forEach((d, i) => {
        d.move(origin.x + dp.oneGridWidth * grid_gap_x * (i % column),
         origin.y + dp.oneGridHeight * grid_gap_y * Math.floor(i / column))
    })
}

function changePlaces() {
    const selectedDancers = ctx.dancers.selectedDancers
    const count = selectedDancers != null ? selectedDancers.length : 0
    if(count != 2) {
        alert('This command is uses in the state selected two dancers.')
        return
    }
    const dancerA = selectedDancers[0]
    const dancerB = selectedDancers[1]
    const tempPoint = dancerA.point
    dancerA.move(dancerB.point.x, dancerB.point.y)
    dancerB.move(tempPoint.x, tempPoint.y)
}

// 色変更
const radius = 10
const padding = 10
const margin = radius * 2 + padding
const color_change_icons_x = stage_size.width + radius + padding
const color_change_icons_y = 200 + padding

const color_change_text = new createjs.Text('選択中の踊り子の色を変更します', '14px Arial', 'brack')
color_change_text.x = color_change_icons_x - padding
color_change_text.y = color_change_icons_y
stage.addChild(color_change_text)

const coral = new createjs.Shape()
coral.graphics.beginFill('coral')
    .drawCircle(color_change_icons_x + margin * 0, color_change_icons_y + margin, radius)
const mediumaquamarine = new createjs.Shape()
mediumaquamarine.graphics.beginFill('mediumaquamarine')
    .drawCircle(color_change_icons_x + margin * 1, color_change_icons_y + margin, radius)
const skyblue = new createjs.Shape()
skyblue.graphics.beginFill('skyblue')
    .drawCircle(color_change_icons_x + margin * 2, color_change_icons_y + margin, radius)

coral.addEventListener("mousedown", event => changeDancersGroup("front_group"))
mediumaquamarine.addEventListener("mousedown", event => changeDancersGroup("mid_group"))
skyblue.addEventListener("mousedown", event => changeDancersGroup("back_group"))

function changeDancersGroup(group_name) {
    ctx.dancers.selectedDancerChangeGroup(group_name)
}

stage.addChild(coral)
stage.addChild(mediumaquamarine)
stage.addChild(skyblue)

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
        ctx.pointer.click(event.stageX, event.stageY)
        if(foundDancer && (isInStageArea(event.stageX, event.stageY) ||
            reserve_area.isInReservationArea(event.stageX, event.stageY))) {
            // 単独の踊り子を選択していた場合、非選択状態に戻す
            if(ctx.dancers.selectedDancers.length == 1) {
                ctx.dancers.unSelect()
            }
            foundDancer.select()
        } else if(isInStageArea(event.stageX, event.stageY) ||
            reserve_area.isInReservationArea(event.stageX, event.stageY)){
            ctx.dancers.unSelect()
            // 選択領域描画条件, TODO: 条件追加 ステージエリア or リザーブエリアの範囲内なら選択領域を描画する
            if(selected_area.isVisible == false) {
                selected_area.draw(ctx.pointer.click_x, ctx.pointer.click_y, 0, 0)
            }
        }
        ctx.dancers.selectedDancers
            .forEach(d => d.saveCurrentPosition())
    } else if(ctx.manipuration_mode === ManipurationMode.MOVE) {
        // マウスクリックした地点の踊り子の地点を影として記録する
        // 影が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.addShadows(), backgroud_index)
        }
    }
}

function handleMove(event) {
    ctx.pointer.drag(event.stageX, event.stageY)
    // 選択領域
    if(selected_area.isVisible == true) {
        selected_area.draw(ctx.pointer.click_x, ctx.pointer.click_y,
            ctx.pointer.drag_x - ctx.pointer.click_x, ctx.pointer.drag_y - ctx.pointer.click_y)
    } else {
        const foundDancer = ctx.dancers.findDancer(event.stageX, event.stageY)
        if(foundDancer != null) {
            ctx.dancers.selectedDancers
            .filter(d => d.getId != foundDancer.getId)
            .forEach(d => d.move(d.currentPosition.x + ctx.pointer.dragDistance.w, d.currentPosition.y + ctx.pointer.dragDistance.h))
        }
    }
    
}

function handleUp(event) {
    const foundDancer = ctx.dancers.findDancer(event.stageX, event.stageY)

    if(ctx.manipuration_mode === ManipurationMode.PLACEMENT){
        // 選択領域
        if(selected_area.isVisible == true) {
            ctx.dancers.selectArea(ctx.pointer.selectArea)
            selected_area.hide()
        }
        //マウスを離したときにリザーブの中にいる踊り子の状態を反映する
        reserve_area.collectDancersWithinArea(ctx.dancers.allDancers)

        ctx.pointer.init()
    } else if(ctx.manipuration_mode === ManipurationMode.MOVE){
        // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
        // 影を結ぶ線が背景のグリッドより手前、踊り子より奥に配置されるようにindexを設定する
        if(foundDancer != null) {
            stage.addChildAt(foundDancer.tieShadows(), backgroud_index)
        }
    }
}

function dblClick(event) {
    ctx.pointer.click(event.stageX, event.stageY)
    selected_area.hide()
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}