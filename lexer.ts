//File for lexer program
//Barbara Stall
//Compilers Fall 2019

/// <reference path='global.ts'/>
/// <reference path='token.ts'/>
/// <reference path='logging.ts'/>

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
            var id_regex: RegExp = /^[a-z]$/;
            //--how is this digit--
            var digit_regex: RegExp = /0|(^[1-9]([0-9])*)$/;
            //--how is this char--
            var char_regex: RegExp = /^[a-z]$/;
            //--why using codeString--
            var codeString = false;
            //--how is this string--
            var string_regex: RegExp = /^"[a-z\S]*"$/;
            //regex for anything in grammar
            var any_regex: RegExp = /[a-z]+|[1-9]|(==)|(!=)|"[^"]*"|(")|(\/\*[^\/\*]*\*\/)|(\S)|(\n)/g;
            //comments regex
            var com_RE: RegExp = /\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/;;

            //implementing multiple programs at one execution
            var programCount = 1;


            //Test print
            //will fix _Log_ error later
            _Log_.printM("INFO Lexer - program " + programCount);


            //get code, trim, split into lines, get length
            var inputCode = (<HTMLInputElement>document.getElementById("inputTA")).value;
            inputCode = inputCode.trim();

            //check for $ - end of program symbol
            if(inputCode[inputCode.length - 1] != '$'){
                _Log_.printW("Missing $ at end of program");
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
            for(var x = 0; x < inputLength; x++){
                //make sure regex in grammar
                var checkRegex = inputLines[x].match(any_regex);
                if(checkRegex == null){
                    return;
                }
                else{
                    var lengthCheck =  checkRegex.length;
                }

                if(checkRegex != null){
                    //work with Tokens
                    for(var y = 0; y  < lengthCheck; y++){
                        var currentToken = checkRegex[y];
                        console.log(currentToken);

                        //now find tokens
                        //check for keyword
                        if(keywords.indexOf(currentToken) > - 1){
                            for(var j = 0; j < _Keywords_.length; j++){
                                if(currentToken === _Keywords_[j].value){
                                    var TType = _Keywords_[j].type;
                                    var TValue = _Keywords_[j].value;
                                    var token = new Token(TType, TValue, x);
                                    var thing = (TType + "[" + TValue + "]" + " on line " + x);
                                    _Tokens_.push(token);
                                    _Log_.printM("Debug the Lexer: " + thing);
                                }
                            }
                        }

                        //check for ID
                        else if(id_regex.test(currentToken)){
                            for (var i = 0; i < 1; i++){
                                var token = new Token('ID', currentToken[i], x);
                                var thing = ('ID' + " [ " + currentToken[i] + " ] " + " on line " + x);
                                    _Tokens_.push(token);
                                   // console.log(currentT);
                                    _Log_.printM("Debug the Lexer: " + thing);
                            }
                        }

                        //check for symbol

                        //check for digit

                        //check for character

                        //ignore comments

                        //else throw error
                    }
                }
            }
        }
    }
}