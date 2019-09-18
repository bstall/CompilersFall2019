
/// <reference path='global.ts'/>
/// <reference path='lexer.ts'/>

module StallCompiler{
    export class logging{
        public printE(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTA");
            log1.value += "ERROR: " + message + "\n";
        }
        public printW(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTA");
            log1.value += "WARNING!!!: " + message + "\n";
        }
        public printM(message: string): void{
            var log1 = <HTMLTextAreaElement> document.getElementById("outputTA");
            log1.value += message + "\n";
        }
        
    }
}