//file for outputting information during compilation
var StallCompiler;
(function (StallCompiler) {
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        //method for outputting messages
        Logger.logMessage = function (message) {
            // Only log messages in verbose
            if (_VerboseMode) {
                var log = document.getElementById("log-output");
                log.value += message + "\n";
            }
        };
        //warnings aren't quite errors, so different function
        Logger.logWarning = function (message) {
            var log = document.getElementById("log-output");
            log.value += "WARNING: " + message + "\n";
        };
        //errors stop program
        Logger.logError = function (message, line, module) {
            var log = document.getElementById("log-output");
            log.value += "ERROR in " + module + " on line " + line + ": " + message + "\n";
            log.value += "Ending compilation.";
        };
        //populates token table
        Logger.logTokens = function () {
            //builds a table to output tokens
            var table = document.getElementById('tokens-table');
            //creates a row for each token
            for (var x = 0; x < _Tokens.length; x++) {
                var row = table.insertRow(x + 1);
                var type = row.insertCell(0);
                var value = row.insertCell(1);
                var line = row.insertCell(2);
                type.innerHTML = _Tokens[x].type;
                value.innerHTML = _Tokens[x].value;
                line.innerHTML = _Tokens[x].line;
            }
        };
        Logger.logCST = function () {
            var log = document.getElementById('cst-output');
            log.value += _CST.toString();
            log.value += "\n";
        };
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
        Logger.logIgnoreVMode = function (message) {
            var log = document.getElementById("log-output");
            log.value += message + "\n";
        };
        return Logger;
    }());
    StallCompiler.Logger = Logger;
})(StallCompiler || (StallCompiler = {}));
