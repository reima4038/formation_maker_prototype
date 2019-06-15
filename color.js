/**
 * 色定義
 */
class ColorDefine {
    constructor(r, g, b, a) {
        this.red = r
        this.green = g
        this.blue = b
        this.alpha = a
    }
}

const Color = {
    coral : new ColorDefine(255, 127, 80, 0),
    mediumaquamarine : new ColorDefine(102, 205, 170),
    skyblue : new ColorDefine(135, 206, 235)
}