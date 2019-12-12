var StallCompiler;
(function (StallCompiler) {
    var JumpT = /** @class */ (function () {
        function JumpT() {
            this.items = [];
            //holds as jump byte
            this.prefix = "J";
            this.suffix = 0;
        }
        //item methods
        JumpT.prototype.setDistForItem = function (item, distance) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] === item) {
                    this.items[i].setDist(distance);
                }
            }
        };
        JumpT.prototype.getItems = function () {
            return this.items;
        };
        JumpT.prototype.getItemAtIndex = function (index) {
            return this.items[index];
        };
        JumpT.prototype.addItem = function (item) {
            this.items.push(item);
        };
        //temp methods
        JumpT.prototype.getCurrentTemp = function () {
            return this.prefix + this.suffix.toString();
        };
        JumpT.prototype.getNextTemp = function () {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        };
        JumpT.prototype.incrementTemp = function () {
            this.suffix++;
        };
        JumpT.prototype.getItemWithId = function (temp) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        };
        JumpT.prototype.removeTempsInCodeT = function (codeT) {
            //regex to match temp markers
            var regex = /^(J[0-9])/;
            for (var i = 0; i < codeT.table.length; i++) {
                var current = codeT.table[i];
                console.log(current.match(regex));
                if (current.match(regex)) {
                    var item = this.getItemWithId(current.match(regex)[1]);
                    codeT.addByteAtAddr(StallCompiler.Utils.leftPad(item.getDist().toString(16), 2), i.toString());
                }
            }
        };
        return JumpT;
    }());
    StallCompiler.JumpT = JumpT;
    //item getters/setters
    var JumpTItem = /** @class */ (function () {
        function JumpTItem(temp) {
            this.temp = temp;
            this.dist = 0;
        }
        JumpTItem.prototype.getTemp = function () {
            return this.temp;
        };
        JumpTItem.prototype.setTemp = function (temp) {
            this.temp = temp;
        };
        JumpTItem.prototype.getDist = function () {
            return this.dist;
        };
        JumpTItem.prototype.setDist = function (dist) {
            this.dist = dist;
        };
        return JumpTItem;
    }());
    StallCompiler.JumpTItem = JumpTItem;
})(StallCompiler || (StallCompiler = {}));
