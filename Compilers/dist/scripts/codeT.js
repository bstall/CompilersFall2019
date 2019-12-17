//file to keep track of code generated to output to table
var StallCompiler;
(function (StallCompiler) {
    var CodeT = /** @class */ (function () {
        //only allowed 256 bytes
        function CodeT() {
            this.table = [];
            this.currentAddr = 0;
            this.heapPos = 255;
            for (var i = 0; i < 256; i++) {
                this.table[i] = "";
            }
        }
        //adds to table, updates address
        CodeT.prototype.addByte = function (byte) {
            this.table[this.currentAddr] = byte;
            this.currentAddr++;
        };
        //add to specific location
        CodeT.prototype.addByteAtAddr = function (byte, address) {
            byte = byte.toUpperCase();
            this.table[address] = byte;
        };
        CodeT.prototype.getCurrentAddr = function () {
            return this.currentAddr;
        };
        //makes the unused spaces 00's
        CodeT.prototype.zeroOutEmptySlots = function () {
            for (var i = 0; i < 256; i++) {
                if (this.table[i] === "") {
                    this.table[i] = "00";
                }
            }
        };
        //method to handle strings in the table
        CodeT.prototype.writeStringToHeap = function (string) {
            var start;
            this.addByteAtAddr("00", this.heapPos.toString());
            this.heapPos--;
            for (var i = string.length - 1; i >= 0; i--) {
                start = this.heapPos;
                var hex = string.charCodeAt(i).toString(16);
                this.addByteAtAddr(hex, this.heapPos.toString());
                this.heapPos--;
            }
            return start;
        };
        return CodeT;
    }());
    StallCompiler.CodeT = CodeT;
})(StallCompiler || (StallCompiler = {}));
