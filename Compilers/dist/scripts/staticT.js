//file to keep track of static allocation of memory
var StallCompiler;
(function (StallCompiler) {
    var StaticT = /** @class */ (function () {
        function StaticT() {
            this.items = [];
            this.prefix = "T";
            this.suffix = 0;
        }
        //temps
        StaticT.prototype.getCurrentTemp = function () {
            return this.prefix + this.suffix.toString();
        };
        StaticT.prototype.getNextTemp = function () {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        };
        //items
        StaticT.prototype.getItems = function () {
            return this.items;
        };
        StaticT.prototype.getItemAtIndex = function (index) {
            return this.items[index];
        };
        StaticT.prototype.addItem = function (item) {
            this.items.push(item);
        };
        StaticT.prototype.findItemWithIdentifier = function (id) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getId() === id) {
                    return this.items[i];
                }
            }
        };
        StaticT.prototype.incrementTemp = function () {
            this.suffix++;
        };
        //offset
        StaticT.prototype.getOffset = function () {
            return this.suffix;
        };
        StaticT.prototype.getItemWithId = function (temp) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        };
        //same method as jump table
        StaticT.prototype.removeTempsInCodeT = function (codeT) {
            var regex = /^(T[0-9])/;
            for (var i = 0; i < codeT.table.length; i++) {
                var current = codeT.table[i];
                if (current.match(regex)) {
                    var item = this.getItemWithId(current.match(regex)[1]);
                    console.log("current address");
                    console.log(codeT.getCurrentAddr());
                    codeT.addByteAtAddr((parseInt(item.getTemp()[1]) + codeT.getCurrentAddr() + 1).toString(16), i.toString());
                    codeT.addByteAtAddr("00", (i + 1).toString());
                }
            }
        };
        return StaticT;
    }());
    StallCompiler.StaticT = StaticT;
    var staticTItem = /** @class */ (function () {
        function staticTItem(temp, id, scope, address, type) {
            this.addr = 0;
            this.id = id;
            this.temp = temp;
            this.scope = scope;
            this.addr = address;
            this.type = type;
        }
        staticTItem.prototype.getId = function () {
            return this.id;
        };
        staticTItem.prototype.setId = function (id) {
            this.id = id;
        };
        staticTItem.prototype.getTemp = function () {
            return this.temp;
        };
        staticTItem.prototype.setTemp = function (temp) {
            this.temp = temp;
        };
        staticTItem.prototype.getAddr = function () {
            return this.addr;
        };
        staticTItem.prototype.getType = function () {
            return this.type;
        };
        return staticTItem;
    }());
    StallCompiler.staticTItem = staticTItem;
})(StallCompiler || (StallCompiler = {}));
