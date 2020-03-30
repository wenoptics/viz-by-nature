/*
CanTree by Arnaud Couturier, improve by Grayson Wen

Copyright (c) 2010 Arnaud Couturier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
trees2d = {};
trees2d.normalVariate = function (mean, variance) {
    return mean;
    return mean + (Math.random() * 2 + Math.random() * 2 + Math.random() * 2 - 3) / 3 * variance / 2
};
trees2d.tree = function (canvas2d) {
    this.canvas2d = canvas2d;
    this.ctx2d = canvas2d.getContext("2d");
    this.string = "lL[+L][-L]";
    this.branchTexture;
    this.treePosY = 50;
    this.iterations = 10;
    this.angleMean = 20 / 180 * Math.PI;
    this.angleVariation = 10 / 180 * Math.PI;
    this.length = 30;
    this.lengthReduction = 0.8;
    this.thickness = 15;
    this.thicknessReduction = 0.65;
    this.rules = {
        L: {developsInto: ["l", "+lL", "-lL", "L[+LL][-LL]l", "[+L][-L]", "L[+lLL]", "L[-lLL]"]},
        l: {developsInto: ["l"]},
        "[": {developsInto: ["["]},
        "]": {developsInto: ["]"]},
        "+": {developsInto: ["+"]},
        "-": {developsInto: ["-"]}
    };
    this.leafTextures = [];
    this.leafScaleVariation = 0.5;
    this.leafMinDepth = 4;
    this.leafProba = 0.5;
    this.leafScale = 1;
    this.leafTotalPerBranch = 1;
    this.leafProbaLighterMult = 0.5;
    this.curveXVariation = 10;
    this.curveYVariation = 5;
    this.shadowProba = 0.2;
    this.shadowAlpha = 0.025;
    this.shadowRadius = 40
};
trees2d.tree.prototype.addLeafTexture = function (a, b, c) {
    this.leafTextures.push({img: a, targetWidthInPixel: b, relativeProba: c})
};
trees2d.tree.prototype.generateLString = function () {

    // L-string expansion
    var _str = this.string;
    var lstring;

    for (var m = 0; m < this.iterations; m++) {
        lstring = "";
        for (var s = 0; s < _str.length; s++) {
            var _ch = _str[s];
            var _developsInto = this.rules[_ch].developsInto;
            if (_developsInto.length <= 0) {
                continue
            }
            // Randomly pick one of the devInto
            var a = _developsInto[parseInt(Math.random() * _developsInto.length)];

            lstring += a
        }
        _str = lstring
    }

    // lstring = ''
    console.log('lString', lstring);
    return lstring
};
trees2d.tree.prototype.removeLeafTexture = function (a) {
    for (var b = 0; b < this.leafTextures.length; b++) {
        var c = this.leafTextures[b];
        if (c.img == a) {
            this.leafTextures.splice(b, 1);
            break
        }
    }
};
trees2d.tree.prototype.hasLeafTexture = function (a) {
    for (var b = 0; b < this.leafTextures.length; b++) {
        var c = this.leafTextures[b];
        if (c.img == a) {
            return true
        }
    }
    return false
};
trees2d.tree.prototype.totalLeafTextures = function () {
    return this.leafTextures.length
};
trees2d.tree.prototype.draw = function (lstring) {
    for (var s = 0; s < this.leafTextures.length; s++) {
        var l = this.leafTextures[s];
        if (!l.img.complete) {
            return l.img.src.substring(0, 100) + " is not completely loaded, wait until all textures are loaded"
        }
        if (l.img.naturalWidth === 0 || l.img.naturalHeight === 0) {
            return l.img.src.substring(0, 100) + " is not a valid image"
        }
    }
    if (this.branchTexture) {
        if (!this.branchTexture.complete) {
            return this.branchTexture.src.substring(0, 100) + " is not completely loaded, wait until all textures are loaded"
        }
        if (this.branchTexture.naturalWidth === 0 || this.branchTexture.naturalHeight === 0) {
            return this.branchTexture.src.substring(0, 100) + " is not a valid image"
        }
    }
    var ctx = this.ctx2d;
    var err;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save();
    try {

        var w = 0.1;
        var f = 1 / this.iterations;
        var strokeStyle = this.branchTexture ? this.ctx2d.createPattern(this.branchTexture, "repeat") : 'black';
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = "round";
        var p = 1;
        var h = 0;
        ctx.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height);
        ctx.translate(this.canvas2d.width / 2, this.canvas2d.height - this.treePosY);
        for (var s = 0; s < lstring.length; s++) {
            switch (lstring[s]) {
                case "l":
                    ctx.strokeStyle = strokeStyle;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(trees2d.normalVariate(0, this.curveXVariation), trees2d.normalVariate(0, this.curveYVariation) - this.length / 2, 0, -this.length);
                    ctx.stroke();

                    if (Math.random() <= this.shadowProba) {
                        // Draw dark shadow
                        ctx.save();
                        ctx.globalCompositeOperation = "source-atop";
                        ctx.globalAlpha = this.shadowAlpha;
                        ctx.beginPath();
                        ctx.arc(0, 0, this.shadowRadius, 0, Math.PI * 2, false);
                        ctx.fill();
                        ctx.restore()
                    }
                    h++;
                    ctx.translate(0, -this.length);

                    // Draw leaf here
                    if (this.leafTextures.length > 0 && p >= this.leafMinDepth && Math.random() <= this.leafProba) {
                        for (var q = 0; q < this.leafTotalPerBranch; q++) {
                            ctx.save();
                            if (Math.random() <= (p / this.iterations * this.leafProbaLighterMult)) {
                                ctx.globalCompositeOperation = "lighter"
                            }
                            // Randomly pick a load leaf texture
                            var _leafTexture = this.leafTextures[parseInt(Math.random() * this.leafTextures.length)];
                            var u = _leafTexture.targetWidthInPixel / _leafTexture.img.naturalWidth * this.leafScale;

                            ctx.scale(
                                u * (1 + (Math.random() * 2 - 1) * this.leafScaleVariation),
                                u * (1 + (Math.random() * 2 - 1) * this.leafScaleVariation)
                            );
                            ctx.rotate(Math.random() * Math.PI * 2);
                            ctx.drawImage(_leafTexture.img, 0, 0);
                            ctx.restore()
                        }
                    }
                    break;
                case "+":
                    // Rotate left with variation
                    ctx.rotate(trees2d.normalVariate(this.angleMean, this.angleVariation));
                    break;
                case "-":
                    // Rotate right with variation
                    ctx.rotate(-trees2d.normalVariate(this.angleMean, this.angleVariation));
                    break;
                case "[":
                    ctx.save();
                    this.length *= this.lengthReduction;
                    p++;
                    w += f;
                    ctx.lineWidth *= this.thicknessReduction;
                    break;
                case "]":
                    this.length *= 1 / this.lengthReduction;
                    p--;
                    w -= f;
                    ctx.restore();
                    break;
            }
        }
    } catch (e) {
        err = e
    }
    ctx.restore();
    return err
};
