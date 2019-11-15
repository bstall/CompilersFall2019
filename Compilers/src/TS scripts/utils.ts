///<reference path='globals.ts' />
///<reference path='tree.ts' />

//Utility functions for Stall Compiler

module StallCompiler {

    export class Utils {
        //sets verbose mode using button on page - toggles on and off
        public static setVerbose() {
            document.getElementById('verbose-button').classList.toggle("btn-success");
            document.getElementById('verbose-button').classList.toggle("btn-danger");
            //when button clicked, sets verbose mode to what it wasn't 
            _VerboseMode = !_VerboseMode;
        }

        public static compile() {
            var log: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("log-output");
            var source: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("source-code");
            //adding cst variable to clear cst output after each run
            var cstVal: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("cst-output");
            source.value = this.trim(source.value);
            log.value = "";
            cstVal.value = "";

            //resets global variables
            _Tokens = [];
            _CurrentToken = null;
            _TokenIndex = 0;
           
            //uses function to empty the tables
            this.clearTable('tokens-table');
            this.clearTable('symbol-table');

            //checks if empty
            if (source.value === '') {
                _S_Logger.logIgnoreVMode("No input.");
                return;
            }
            //runs the lex program
            _S_Lexer.lex();

            _S_Logger.logIgnoreVMode("Lexing successful.");
            //parse multiple programs
            while (_TokenIndex < _Tokens.length) {
                _S_Parser.parse();
                _S_Logger.logIgnoreVMode("Completed parsing program.");
            }
            //_S_Logger.logCST();
            SemanticAnalysis.performAnalysis();

        }

        
        //trims whitespace
        public static trim(str)   
        {
            return str.replace(/^\s+ | \s+$/g, "");

        }
        //used to clear the tables on web page
        public static clearTable(element: string) {
            var table = <HTMLTableElement> document.getElementById(element);
            var length = table.rows.length;

            if (length > 1) {
                for (var i = length - 1; i > 0; i--) {
                    table.deleteRow(i);
                }
            }
        }
    }
}