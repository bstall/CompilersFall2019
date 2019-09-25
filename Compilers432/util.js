///<reference path="global.ts" />
///<reference path="lexer.ts" />
///<reference path="logging.ts" />
///<reference path="token.ts" />
var StallCompiler;
(function (StallCompiler) {
    var util = /** @class */ (function () {
        function util() {
        }
        util.compile = function () {
            //reset variables instantiated in global
            _Tokens_ = [];
            _CurrentToken_ = null;
            _TIndex_ = 0;
            var _Lexer_ = new StallCompiler.lexer();
            var _Log_ = new StallCompiler.logs();
            //interfacing with HTML
            var log1 = document.getElementById("outputTextArea");
            var sourceCode = document.getElementById("inputTextArea");
            sourceCode.value = this.trim(sourceCode.value);
            log1.value = "";
            _Lexer_.lexerProgram();
        };
        //trim whitespace
        util.trim = function (words) {
            return words.replace(/^\s+ | \s+$/g, "");
        };
        return util;
    }());
    StallCompiler.util = util;
})(StallCompiler || (StallCompiler = {}));
