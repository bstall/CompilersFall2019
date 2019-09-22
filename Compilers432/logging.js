/// <reference path="global.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="util.ts"/>
/// <reference path="token.ts"/>
var StallCompiler;
(function (StallCompiler) {
    var logs = /** @class */ (function () {
        function logs() {
        }
        logs.prototype.printErrorMessage = function (message) {
            var log1 = document.getElementById("outputTextArea");
            log1.value += "ERROR: " + message + "\n";
        };
        logs.prototype.printWarningMessage = function (message) {
            var log1 = document.getElementById("outputTextArea");
            log1.value += "WARNING!!!: " + message + "\n";
        };
        logs.prototype.printMessage = function (message) {
            var log1 = document.getElementById("outputTextArea");
            log1.value += message + "\n";
        };
        return logs;
    }());
    StallCompiler.logs = logs;
})(StallCompiler || (StallCompiler = {}));
