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
        logs.prototype.logTokens = function () {
            var tTable = document.getElementById("token_output");
            for (var i = 0; i < _Tokens_.length; i++) {
                var row = tTable.insertRow(i + 1);
                var type = row.insertCell(0);
                var value = row.insertCell(1);
                var line = row.insertCell(2);
                type.innerHTML = _Tokens_[i].type;
                value.innerHTML = _Tokens_[i].value;
                line.innerHTML = _Tokens_[i].line;
            }
        };
        return logs;
    }());
    StallCompiler.logs = logs;
})(StallCompiler || (StallCompiler = {}));
