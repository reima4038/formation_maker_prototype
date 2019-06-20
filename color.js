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

    darker() {
        const subtraction_value = 30;
        const red = this.red - subtraction_value >= 0 ? this.red - subtraction_value : 0
        const green = this.green - subtraction_value >= 0 ? this.green - subtraction_value : 0
        const blue = this.blue - subtraction_value >= 0 ? this.blue - subtraction_value : 0
        return new ColorDefine(red, green, blue, this.alpha)
    }

    lighter() {
        const addition_value = 30;
        const red = this.red + addition_value <= 255 ? this.red + addition_value : 255
        const green = this.green + addition_value <= 255 ? this.green + addition_value : 255
        const blue = this.blue + addition_value <= 255 ? this.blue + addition_value : 255
        return new ColorDefine(red, green, blue, this.alpha)
    }

    semitransparent() {
        return new ColorDefine(this.red, this.green, this.blue, this.alpha / 2)
    }

    rgba() {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }
}

const Color = {
    gray : new ColorDefine(128, 128, 128, 1),
    coral : new ColorDefine(255, 127, 80, 1),
    mediumaquamarine : new ColorDefine(102, 205, 170, 1),
    skyblue : new ColorDefine(135, 206, 235, 1)
}