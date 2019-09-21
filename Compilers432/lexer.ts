//File for lexer program
//Barbara Stall
//Compilers Fall 2019

/// <reference path="global.ts"/>
/// <reference path="token.ts"/>
/// <reference path="logging.ts"/>
/// <reference path="util.ts"/>

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


            //get code, trim, split into lines, get length
            var inputCode = (<HTMLInputElement>document.getElementById("inputTextArea")).value;
            inputCode = inputCode.trim();

            //check for $ - end of program symbol
            if(inputCode[inputCode.length - 1] != '$'){
                _Log_.printW("Missing $ at end of program");
                (<HTMLInputElement>document.getElementById("inputTextArea")).value += '$';
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
                                    _Log_.printM("Debug the Lexer: " + thing);
                            }
                        }

                        //check for symbol
                        else if(symbols.indexOf(currentToken) > -1){
                            for(var t = 0; t < _Punc_.length; t++){
                                if(currentToken === _Punc_[t].value){
                                    var TType = _Punc_[t].type;
                                    var TValue = _Punc_[t].value
                                    var token = new Token(TType, TValue, x);
                                    var thing = (TType + "[" + TValue + "]" + " on line " + x);

                                    if((token.type === QUOTE.type) && (codeString === false)){
                                        _Log_.printE(" not a complete string");
                                        lexError = lexError + 1;
                                    }
                                    else if((token.type === QUOTE.type) && (codeString === true)){
                                        _Tokens_.push(token);
                                        codeString = !codeString;
                                        _Log_.printM("Debug the Lexer: " + thing);
                                    }
                                    else{
                                        _Tokens_.push(token);
                                        _Log_.printM("Debug the Lexer: " + thing);
                                    }
                                }
                            }
                        }

                        //check for digit
                        else if(digit_regex.test(currentToken)){
                            for (var i = 0; i < currentToken.length; i++){
                                var token = new Token('DIGIT', currentToken[i], x);
                                var thing = ('DIGIT' + " [ " + currentToken[i] + " ] " + " on line " + x);
                                _Tokens_.push(token);
                                _Log_.printM("Debug the Lexer: " + thing);
                            }
                        }

                        //check for character
                        else if(char_regex.test(currentToken)){
                            for (var i = 0; i < currentToken.length; i++){
                                    var token = new Token('CHAR', currentToken[i], x);
                                    var thing = ('CHAR' + " [ " + currentToken[i] + " ] " + " on line " + x);
                                    _Tokens_.push(token);
                                    _Log_.printM("Debug the Lexer: " + thing);
                            }
                        }
                        //checking for strings
                        else if(string_regex.test(currentToken)){
                            for(var i = 0; i < currentToken.length; i++){
                                if(currentToken[i]=== '"'){
                                    var token = new Token(QUOTE.type, currentToken[i], x+1);
                                    var thing = ('QUOTE' + " [ " + currentToken[i] + " ] " + " on line " + x);
                                    _Log_.printM("Debug the Lexer: " + thing);
                                    _Tokens_.push(token);
                                }
                                else if(currentToken[i] === ' '){
                                    var token = new Token(SPACE.type, currentToken[i], x+1);
                                    var stuff = ('SPACE' + " [ " + currentToken[i] + " ] " + " on line " + x);
                                    _Log_.printM("Debug the Lexer: " + stuff);
                                    _Tokens_.push(token);
                                }
                                else if(currentToken[i] === "/" && currentToken[i+1] === "*"){
                                        i = i + 2;
                                        while(currentToken[i] != "/"){
                                            i++;
                                        }
                                        i++;
                                }
                                else if (char_regex.test(currentToken[i])){
                                        var token = new Token('CHAR', currentToken[i], x);
                                        var thing = ('CHAR' + " [ " + currentToken[i] + " ] " + " on line " + x);
                                        _Tokens_.push(token);
                                        _Log_.printM("Debug the Lexer: " + thing);
                                }
                                else{
                                    _Log_.printE("Not valid in string -" + currentToken[i] + " on line " + x);
                                    lexError = lexError + 1;
                                }
                            }
                        }
                        //handle comments being ignored
                        else if(com_RE.test(currentToken)){
                            console.log(currentToken);
                            console.log("Comment");
                        }

                        //else throw error
                        else{
                            _Log_.printE(" Invalid Token " +"[" + currentToken + "]" + " on line " + x);
                            lexError = lexError + 1;
                        }
                    }
                }
            }
        }
    }
}