/// <reference path="global.ts"/>
/// <reference path="lexer.ts"/>

module TSCompiler{
    export class Token{
        constructor(public type: string, public value: string, public line: number){
            //work with this later
        }
    }
}