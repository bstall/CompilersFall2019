
/// <reference path="global.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="util.ts"/>
/// <reference path="token.ts"/>

module StallCompiler{
    export class logging{
        public printE(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            log1.value += "ERROR: " + message + "\n";
        }
        public printW(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            log1.value += "WARNING!!!: " + message + "\n";
        }
        public printM(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            log1.value += message + "\n";
        }
    }
}