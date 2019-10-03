///<reference path='globals.js' />
//Utility functions for Stall Compiler
var StallCompiler;
(function (StallCompiler) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        //sets verbose mode using button on page - toggles on and off
        Utils.setVerbose = function () {
            document.getElementById('verbose-button').classList.toggle("btn-success");
            document.getElementById('verbose-button').classList.toggle("btn-danger");
            //when button clicked, sets verbose mode to what it wasn't 
            _VerboseMode = !_VerboseMode;
        };
        Utils.compile = function () {
            var log = document.getElementById("log-output");
            var source = document.getElementById("source-code");
            source.value = this.trim(source.value);
            log.value = "";
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
        };
        //trims whitespace
        Utils.trim = function (str) {
            return str.replace(/^\s+ | \s+$/g, "");
        };
        //used to clear the tables on web page
        Utils.clearTable = function (element) {
            var table = document.getElementById(element);
            var length = table.rows.length;
            if (length > 1) {
                for (var i = length - 1; i > 0; i--) {
                    table.deleteRow(i);
                }
            }
        };
        return Utils;
    }());
    StallCompiler.Utils = Utils;
})(StallCompiler || (StallCompiler = {}));
