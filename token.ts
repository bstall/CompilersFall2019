/// <reference path='global.ts'/>
/// <reference path='lexer.ts'/>

module StallCompiler{
    export class Token{
        public newToken(type, value, line){
            var Token = new Token(type, value, line);
            return Token;
        }
        constructor(public type: string, public value: string, public line: number){
            //this.type = type;
            //this.value = value;
            //this.line = line;
        }
    }
}