/// <reference path='global.ts'/>
/// <reference path='lexer.ts'/>
/// <reference path='util.ts'/>
/// <reference path='token.ts'/>
var StallCompiler;
(function (StallCompiler) {
    var logging = /** @class */ (function () {
        function logging() {
        }
        logging.prototype.printE = function (message) {
            var log1 = document.getElementById("outputTA");
            log1.value += "ERROR: " + message + "\n";
        };
        logging.prototype.printW = function (message) {
            var log1 = document.getElementById("outputTA");
            log1.value += "WARNING!!!: " + message + "\n";
        };
        logging.prototype.printM = function (message) {
            var log1 = document.getElementById("outputTA");
            log1.value += message + "\n";
        };
        return logging;
    }());
    StallCompiler.logging = logging;
})(StallCompiler || (StallCompiler = {}));
