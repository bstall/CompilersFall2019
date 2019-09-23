///<reference path="global.ts" />
///<reference path="lexer.ts" />
///<reference path="logging.ts" />
///<reference path="token.ts" />

//import {StallCompiler} from "./lexer";

module StallCompiler{
    export class util{
        public static compile(){
            //reset variables instantiated in global
            _Tokens_ = [];
            _CurrentToken_ = null;
            _TIndex_ = 0;

            //var _Lexer_ = new StallCompiler.lexer();  
            //var _Log_   = new StallCompiler.logging(); 
            
            //interfacing with HTML
            var log1: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            var sourceCode: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("inputTextArea");
            sourceCode.value = this.trim(sourceCode.value);
            log1.value = "";

            _Lexer_.lexerProgram();

            

        }
        //trim whitespace
        public static trim(words) {
            return words.replace(/^\s+ | \s+$/g, "");
        }
        
    }
}