const target = 'hello_create_js'
const stage = new createjs.Stage(target)

// タッチ操作をサポートしているブラウザーならばタッチ操作を有効にする
if(createjs.Touch.isSupported() == true){
    createjs.Touch.enable(stage)
}

// 横幅は3列, 4列どちらも対応するためどちらでも割れる数
const stage_scale = {
    width : 12 * 30,
    height : 600
}

// 枠線
const frame_border = new FrameBorder(stage_scale)
frame_border.drawLine()
frame_border.staging(stage)

// グリッド
const grid = new Grid(16, 26, stage_scale)
grid.drawLine()
grid.staging(stage)

// 踊り子：丸
const dancerGroups = new DancerGroups(stage_scale)
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

stage.addEventListener("mousedown", handleMouseDown)
function handleMouseDown(event) {
    // マウスクリックした地点のグループ情報および踊り子情報を取得する
    dancerGroups.groups.flatMap(group => group.findDancers(event.stageX, event.stageY))
        .filter(result => result.dancers.length > 0)
        .map(result => result.dancers[0])
        .forEach(dancer => {
            stage.addChild(dancer.addShadows(stage_scale.width, stage_scale.height))
        })
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick() {
    stage.update();
}