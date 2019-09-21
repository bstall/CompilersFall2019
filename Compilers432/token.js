/// <reference path='global.ts'/>
/// <reference path='lexer.ts'/>
/// <reference path='util.ts'/>
/// <reference path='logging.ts'/>
var StallCompiler;
(function (StallCompiler) {
    var Token = /** @class */ (function () {
        function Token(type, value, line) {
            this.type = type;
            this.value = value;
            this.line = line;
            //this.type = type;
            //this.value = value;
            //this.line = line;
        }
        Token.prototype.newToken = function (type, value, line) {
            var Token = new Token(type, value, line);
            return Token;
        };
        return Token;
    }());
    StallCompiler.Token = Token;
})(StallCompiler || (StallCompiler = {}));
