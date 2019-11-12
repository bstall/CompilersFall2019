//file for keeping track of tokens during lexing
var StallCompiler;
(function (StallCompiler) {
    var Token = /** @class */ (function () {
        function Token(type, value, line) {
            this.type = type;
            this.value = value;
            this.line = line;
            this.type = type;
            this.value = value;
            this.line = line;
        }
        //method for making new tokens. Each has the type, value and line number it is found on
        //providing the line number makes debugging easier with more accurate error messages
        Token.makeNewToken = function (type, value, lineNum) {
            var token = new Token(type, value, lineNum);
            return token;
        };
        return Token;
    }());
    StallCompiler.Token = Token;
})(StallCompiler || (StallCompiler = {}));
