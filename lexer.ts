module StallCompiler{
    export class lexer{
        public lexerProgram(){
            //error count
            var lexError = 0;

            //keyword and symbol variable intialization
            var keywords = ['print', 'while', 'if', 'int', 'string', 'boolean', 'false', 'true'];
            var symbols = ['{', '}', '(', ')', '"', '=', '==', '!=', '+', '$'];

            //regular expression variables
            //--how is this id--
            var id_RE: RegExp = /^[a-z]$/;
            //--how is this digit--
            var digit_RE: RegExp = /0|(^[1-9]([0-9])*)$/;
            //--how is this char--
            var char_RE: RegExp = /^[a-z]$/;
            //--why using codeString--
            var codeString = false;
            //--how is this string--
            var string_RE: RegExp = /^"[a-z\S]*"$/;

            //implementing multiple programs at one execution
            var programCount = 1;


            //Test print
            //will fix _Log_ error later
            _Log_.printMessage("INFO Lexer - program " + programCount);


            //get code, trim, split into lines, get length
            var inputCode = (<HTMLInputElement>document.getElementById("inputTA")).value;
            inputCode = inputCode.trim();

            //check for $ - end of program symbol
            if(inputCode[inputCode.length - 1] != '$'){
                _Log_.printWarning("Missing $ at end of program");
                (<HTMLInputElement>document.getElementById("inputTA")).value += '$';
                inputCode += '$';
            }
            //splits the input into lines 
            var inputLines: Array<String> = inputCode.split("\n");
            //gets number of lines in the input program
            var inputLength = inputLines.length;
            for (var x = 0; x < inputLength; x++) {
                //replaces whitespace with empty strings
                inputLines[x] = (inputLines[x].replace(/^\s+ | \s+$/g, ""));
            }

            //loop through code
            
        }
    }
}