//file for outputting information during compilation

module StallCompiler {
    export class Logger {

        //method for outputting messages
        public static logMessage(message: string): void {
            // Only log messages in verbose
            if (_VerboseMode) {
                var log = <HTMLTextAreaElement> document.getElementById("log-output");
                log.value += message + "\n"
            }
        }

        //warnings aren't quite errors, so different function
        public static logWarning(message: string): void {
            var log = <HTMLTextAreaElement> document.getElementById("log-output");
            log.value += "WARNING: " + message + "\n";
        }

        //errors stop program
        public static logError(message: string, line: number, module: String): void {
            var log = <HTMLTextAreaElement> document.getElementById("log-output");
            log.value += "ERROR in " + module + " on line " + line + ": " + message + "\n";
            log.value += "Ending compilation.";
        }

        //populates token table
        public static logTokens(): void {
            //builds a table to output tokens
            var table = <HTMLTableElement> document.getElementById('tokens-table');
            //creates a row for each token
            for (var x = 0; x < _Tokens.length; x++) {
                
                var row = <HTMLTableRowElement> table.insertRow(x + 1);
                var type  = <HTMLTableCellElement> row.insertCell(0);
                var value = <HTMLTableCellElement> row.insertCell(1);
                var line  = <HTMLTableCellElement> row.insertCell(2);

                type.innerHTML = _Tokens[x].type;
                value.innerHTML = _Tokens[x].value;
                line.innerHTML = _Tokens[x].line;
            }
        }
        public static logCST(): void {
            var log = <HTMLTextAreaElement> document.getElementById('cst-output');
            log.value += _CST.toString();
            log.value += "\n";

        } 
        //trying to get output properly formatted

        // public printParseMessage(message: string): void{
        //     var log = <HTMLTextAreaElement> document.getElementById("log-output");
        //     log.value += message + "\n";
        // }

        // public printParseError(message: string): void{
        //     var log = <HTMLTextAreaElement> document.getElementById("log-output");
        //     log.value += "ERROR: " + message + "\n";
        // }

        // public printParseComplete(){
        //     var log = <HTMLTextAreaElement> document.getElementById("log-output");
        //     log.value += "Parse Completed" + "\n";
        // }


        //exception to log when not in verbose mode
        public static logIgnoreVMode(message: string): void {
            var log = <HTMLTextAreaElement> document.getElementById("log-output");
            log.value += message + "\n";
        }

        //display ast from semantic analysis
        public static logAST(output: string): void {
            var log = <HTMLTextAreaElement> document.getElementById('ast-output');
            log.value = output;
        }

        //populate symbol table
        public static logSymbolTable(symbolTable: Scope[]): void {
            for (var i = 0; i < symbolTable.length; i++) {
                this.logScope(symbolTable[i]);
            }
        }
        public static logCodeTable(codeTable: CodeT) {
            var log = <HTMLTextAreaElement> document.getElementById('code-output');
            log.value = codeTable.toString();
        }

        //scope tracking part of symbol table
        public static logScope(scope: Scope): void {
            var table = <HTMLTableElement> document.getElementById('symbol-table');
            var unusedSymbols: Symbol[] = [];
            for (var i = 0; i < scope.getAllSymbols().length; i++) {
                var symbols = scope.getAllSymbols();

                var row = <HTMLTableRowElement> table.insertRow(i + 1);
                var name  = <HTMLTableCellElement> row.insertCell(0);
                var type  = <HTMLTableCellElement> row.insertCell(1);
                var level = <HTMLTableCellElement> row.insertCell(2);
                var line  = <HTMLTableCellElement> row.insertCell(3);

                name.innerHTML = symbols[i].getName();
                type.innerHTML = symbols[i].getType();
                level.innerHTML = scope.nameAsString();
                line.innerHTML = symbols[i].getLine();

                if (!symbols[i].getInitialized()) {
                    unusedSymbols.push(symbols[i]);
                }
            }

        }
    }
}