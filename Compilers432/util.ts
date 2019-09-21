///<reference path="global.ts" />
///<reference path="lexer.ts" />
///<reference path="logging.ts" />
///<reference path="token.ts" />

module StallCompiler{
    export class util{
        public static compile(){
            //reset variables instantiated in global
            _Tokens_ = [];
            _CurrentToken_ = null;
            _TIndex_ = 0;

            var _Lexer_ = new StallCompiler.lexer();  
            var _Log_   = new StallCompiler.logging(); 
            
            //interfacing with HTML
            var log1: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("outputTA");
            var sourceCode: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("inputTA");
            sourceCode.value = this.trim(sourceCode.value);
            log1.value = "";

            _Lexer_.lexerProgram();

            

        }
        //trim whitespace
        public static trim(words) {
            return words.replace(/^\s+ | \s+$/g, "");
        }
        //method for buffer
        public static leftBuff(string: string, length: number): string {
            if (string.length === 2) {
                return string;
            }
            for (var k = 1; k < length; k++) {
                string = "0" + string;
            }
            return string;
        }
    }
}