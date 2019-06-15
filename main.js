const target = 'hello_create_js'
const stage = new createjs.Stage(target)

// タッチ操作をサポートしているブラウザーならばタッチ操作を有効にする
if(createjs.Touch.isSupported() == true){
    createjs.Touch.enable(stage)
}

// マウス操作時 マウスオーバーを有効化
stage.enableMouseOver();

// 横幅は3列, 4列どちらも対応するためどちらでも割れる数
const stage_scale = {
    width : 12 * 30,
    height : 600
}

/*---------------------------
 * 背景
 *---------------------------*/

// 枠線
const frame_border = new FrameBorder(stage_scale)
frame_border.drawLine()
frame_border.staging(stage)

// グリッド
const grid = new Grid(16, 26, stage_scale)
grid.drawLine()
grid.staging(stage)

/*---------------------------
 * 踊り子
 *---------------------------*/

// 踊り子：丸
const dancerGroups = new DancerGroups()
dancerGroups.addGroup("front_group", Color.coral)
dancerGroups.addGroup("mid_group", Color.mediumaquamarine)
dancerGroups.addGroup("back_group", Color.skyblue)

// 並び位置
const p = new DancerPosition(stage_scale, grid.horizontal_column, grid.virtical_column).definedPosition

// front_groupは3列で並ぶ
dancerGroups.addDancer('front_group', "宵越", p.h_three_column_left, p.v_line_2)
dancerGroups.addDancer('front_group', "畦道", p.h_three_column_mid, p.v_line_2)
dancerGroups.addDancer('front_group', "水澄", p.h_three_column_right, p.v_line_2)
dancerGroups.addDancer('front_group', "伊達", p.h_three_column_left, p.v_line_5)
dancerGroups.addDancer('front_group', "井浦", p.h_three_column_mid, p.v_line_5)
dancerGroups.addDancer('front_group', "王城", p.h_three_column_right, p.v_line_5)

// mid_groupは2列で並ぶ
dancerGroups.addDancer('mid_group', "冴木", p.h_two_column_left, p.v_line_8)
dancerGroups.addDancer('mid_group', "早乙女", p.h_two_column_right, p.v_line_8)
dancerGroups.addDancer('mid_group', "志場", p.h_two_column_left, p.v_line_11)
dancerGroups.addDancer('mid_group', "不破", p.h_two_column_right, p.v_line_11)

// back_gorupは3列で並ぶ
dancerGroups.addDancer('back_group', "岩田", p.h_four_column_outer_left, p.v_line_14)
dancerGroups.addDancer('back_group', "喜多野", p.h_four_column_inner_left, p.v_line_14)
dancerGroups.addDancer('back_group', "立石", p.h_four_column_inner_right, p.v_line_14)
dancerGroups.addDancer('back_group', "室井", p.h_four_column_outer_right, p.v_line_14)
dancerGroups.addDancer('back_group', "金澤", p.h_two_column_left, p.v_line_17)
dancerGroups.addDancer('back_group', "大和", p.h_two_column_right, p.v_line_17)

dancerGroups.staging(stage)

/*---------------------------
 * ボタン類
 *---------------------------*/
const dataOutoutButton = createButton('Export', 100, 40, "#d9534f")
dataOutoutButton.x = 375
dataOutoutButton.y = 0
stage.addChild(dataOutoutButton)

const dataImportButton = createButton('Import', 100, 40, "#d9534f")
dataImportButton.x = 375
dataImportButton.y = 60
stage.addChild(dataImportButton)

const allRefreshButton = createButton('Refresh', 100, 40, "#d9534f")
allRefreshButton.x = 375
allRefreshButton.y = 120
stage.addChild(allRefreshButton)

dataOutoutButton.addEventListener("click", handleClick);
dataImportButton.addEventListener("click", handleClick);
allRefreshButton.addEventListener("click", handleClick);
function handleClick(event) {
    // TODO: クリックされた時の処理を記述
    alert(event.currentTarget + " がクリックされました。");
}

/*---------------------------
 * イベント
 *---------------------------*/
stage.addEventListener("mousedown", handleMouseDown)
stage.addEventListener("pressup", handleUp)

function handleMouseDown(event) {
    // マウスクリックした地点の踊り子の地点を影として記録する
    dancerGroups.findDancer(event.stageX, event.stageY, d => stage.addChild(d.addShadows()))
}

function handleUp(event) {
    // マウスを離した地点の踊り子と直前に出現した影を線で結ぶ
    dancerGroups.findDancer(event.stageX, event.stageY, d => stage.addChild(d.tieShadows()))
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}