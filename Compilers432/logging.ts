
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
        public logTokens(): void {
            var tTable = <HTMLTableElement> document.getElementById("token_output");
            for (var i = 0; i < _Tokens_.length; i++) {
                var row = <HTMLTableRowElement> tTable.insertRow(i + 1);
                var type  = <HTMLTableCellElement> row.insertCell(0);
                var value = <HTMLTableCellElement> row.insertCell(1);
                var line  = <HTMLTableCellElement> row.insertCell(2);

                type.innerHTML = _Tokens_[i].type;
                value.innerHTML = _Tokens_[i].value;
                line.innerHTML = _Tokens_[i].lines;
            }
        }
    }
}