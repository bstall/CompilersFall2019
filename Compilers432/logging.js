/// <reference path="global.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="util.ts"/>
/// <reference path="token.ts"/>
var StallCompiler;
(function (StallCompiler) {
    var logging = /** @class */ (function () {
        function logging() {
        }
        logging.prototype.printErrorMessage = function (message) {
            var log1 = document.getElementById("outputTextArea");
            log1.value += "ERROR: " + message + "\n";
        };
        logging.prototype.printWarningMessage = function (message) {
            var log1 = document.getElementById("outputTextArea");
            log1.value += "WARNING!!!: " + message + "\n";
        };
        logging.prototype.printMessage = function (message) {
            var log1 = document.getElementById("outputTextArea");
            log1.value += message + "\n";
        };
        return logging;
    }());
    StallCompiler.logging = logging;
})(StallCompiler || (StallCompiler = {}));
