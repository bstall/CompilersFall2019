
/// <reference path="global.ts"/>
/// <reference path="lexer.ts"/>
/// <reference path="util.ts"/>
/// <reference path="token.ts"/>

module StallCompiler{
    export class logs{
        public printErrorMessage(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            log1.value += "ERROR: " + message + "\n";
        }
        public printWarningMessage(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            log1.value += "WARNING!!!: " + message + "\n";
        }
        public printMessage(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTextArea");
            log1.value += message + "\n";
        }
        
    }
}