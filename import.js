function importDancersData(dancerGroups, stage) {
    // TODO: jsonDataをファイルから読み込む機能追加
    const jsonData = {"groups":[{"group_name":"front_group","color":{"red":255,"green":127,"blue":80,"alpha":1},"dancers":[{"id":0,"name":"宵越","x":46,"y":46,"shadows":[]},{"id":1,"name":"畦道","x":184,"y":46,"shadows":[]},{"id":2,"name":"水澄","x":322,"y":46,"shadows":[]},{"id":3,"name":"伊達","x":46,"y":115,"shadows":[]},{"id":4,"name":"井浦","x":184,"y":115,"shadows":[]},{"id":5,"name":"王城","x":322,"y":115,"shadows":[]}]},{"group_name":"mid_group","color":{"red":102,"green":205,"blue":170,"alpha":1},"dancers":[{"id":6,"name":"冴木","x":115,"y":184,"shadows":[]},{"id":7,"name":"早乙女","x":253,"y":184,"shadows":[]},{"id":8,"name":"志場","x":115,"y":253,"shadows":[]},{"id":9,"name":"不破","x":253,"y":253,"shadows":[]}]},{"group_name":"back_group","color":{"red":135,"green":206,"blue":235,"alpha":1},"dancers":[{"id":10,"name":"岩田","x":46,"y":322,"shadows":[]},{"id":11,"name":"喜多野","x":138,"y":322,"shadows":[]},{"id":12,"name":"立石","x":230,"y":322,"shadows":[]},{"id":13,"name":"室井","x":322,"y":322,"shadows":[]},{"id":14,"name":"金澤","x":115,"y":391,"shadows":[]},{"id":15,"name":"大和","x":253,"y":391,"shadows":[]}]}]}
    jsonData.groups.forEach(g => {
        dancerGroups.addGroup(g.group_name, new ColorDefine(g.color.red, g.color.green, g.color.blue, g.color.alpha))
        g.dancers.forEach(d => dancerGroups.addDancer(g.group_name, d.name, d.x, d.y))
    })
    dancerGroups.staging(stage)
}
