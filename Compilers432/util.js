///<reference path='global.ts' />
///<reference path='lexer.ts' />
///<reference path='logging.ts' />
///<reference path='token.ts' />
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
            var _Log_ = new StallCompiler.logging();
            //interfacing with HTML
            var log1 = document.getElementById("outputTA");
            var sourceCode = document.getElementById("inputTA");
            sourceCode.value = this.trim(sourceCode.value);
            log1.value = "";
            _Lexer_.lexerProgram();
        };
        //trim whitespace
        util.trim = function (words) {
            return words.replace(/^\s+ | \s+$/g, "");
        };
        //method for buffer
        util.leftBuff = function (string, length) {
            if (string.length === 2) {
                return string;
            }
            for (var k = 1; k < length; k++) {
                string = "0" + string;
            }
            return string;
        };
        return util;
    }());
    StallCompiler.util = util;
})(StallCompiler || (StallCompiler = {}));
