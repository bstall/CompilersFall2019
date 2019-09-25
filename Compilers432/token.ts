/// <reference path='global.ts'/>
/// <reference path='lexer.ts'/>
/// <reference path='util.ts'/>
/// <reference path='logging.ts'/>

module StallCompiler{
    export class Token{
        constructor(public type: string, public value: string, public lines: number){
                    this.type = type;
                    this.value = value;
                    this.lines = lines;
                    }
        public newToken(type, value, lines){
            var Token = new Token(type, value, lines);
            return Token;
        }
        
    }
}