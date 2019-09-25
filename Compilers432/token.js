/// <reference path='global.ts'/>
/// <reference path='lexer.ts'/>
/// <reference path='util.ts'/>
/// <reference path='logging.ts'/>
var StallCompiler;
(function (StallCompiler) {
    var Token = /** @class */ (function () {
        function Token(type, value, lines) {
            this.type = type;
            this.value = value;
            this.lines = lines;
            this.type = type;
            this.value = value;
            this.lines = lines;
        }
        Token.prototype.newToken = function (type, value, lines) {
            var Token = new Token(type, value, lines);
            return Token;
        };
        return Token;
    }());
    StallCompiler.Token = Token;
})(StallCompiler || (StallCompiler = {}));
