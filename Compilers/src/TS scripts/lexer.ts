//lexer
//first project for compiler's course
//Stall compiler
/// <reference path="token.ts"/>

module StallCompiler {
	export class Lexer {

		public static lex() {
            
            var keywordStr = ['boolean', 'true', 'false', 'while', 'print', 'if', 'int', 'string'];
            var symbolStr = ['=', '!=', '==', '{', '}', '(', ')',  '"', '$', '+'];
            var lexingStr = false;

            //regex to simplify getting tokens
            //uses \S to get a non-whitespace character for tokens longer than a single character
            var matchingReg: RegExp = /[a-z]+|[1-9]|(==)|(!=)|"[^"]*"|(\S)/g;
            //^ is used for the start of string/line
            var idReg: RegExp = /^[a-z]+$/;
            //* for 0 or more characters
            var stringReg: RegExp = /^"[a-z\s]*"$/;
            var digitReg: RegExp = /0|(^[1-9]([0-9])*)$/;

            //initializes log
            _S_Logger.logIgnoreVMode("Beginning lexing.\n");


            //Gets source code.
            var sc = (<HTMLInputElement>document.getElementById("source-code")).value;
            sc = sc.trim();
            //check program ends with EOP symbol
            if (sc[sc.length - 1] != '$') {
                _S_Logger.logWarning("Adding EOP symbol.");
                (<HTMLInputElement>document.getElementById("source-code")).value += '$';
                sc += '$';
            }

            //array split by new lines
            var sourceByLines: Array<string> = sc.split('\n');

            //trims whitespace from split array
            for (var i = 0; i < sourceByLines.length; i++) {
                sourceByLines[i] = StallCompiler.Utils.trim(sourceByLines[i]);
            }


            //splits code based on characters
            for (var i = 0; i < sourceByLines.length; i++) {
                var matches = sourceByLines[i].match(matchingReg);

                //skips blank lines.
                if (!(matches === null)) {

                    //looks at line's possible tokens
                    for (var j = 0; j < matches.length; j++) {
                        var currentToken = matches[j];

                        //check for keyword
                        if (keywordStr.indexOf(currentToken) > -1) {

                            for (var keywordI = 0; keywordI < _Keywords.length; keywordI++) {
                                if (currentToken === _Keywords[keywordI].value) {
                                    //i+1 is accurate line number (no line 0)
                                    var token = Token.makeNewToken(_Keywords[keywordI].type, _Keywords[keywordI].value, i + 1);
                                    _Tokens.push(token);
                                    _S_Logger.logMessage("Created " + token.value + " token.");
                                }
                            }
                        }
                        else if (idReg.test(currentToken)) {
                            //makes ID's out of strings
                            for (var idI = 0; idI < currentToken.length; idI++) {
                                if (lexingStr) {
                                    var token = Token.makeNewToken('CHARACTER', currentToken[idI], i + 1);
                                    _S_Logger.logMessage("Created '" + token.value + "' character token.");
                                } else {
                                    var token = Token.makeNewToken('IDENTIFIER', currentToken[idI], i + 1);
                                    _S_Logger.logMessage("Created '" + token.value + "' identifier token.");

                                }
                                _Tokens.push(token);
                            }
                        }

                        //check for digit
                        else if (digitReg.test(currentToken)) {
                            //make digit tokens out of strings of digits
                            for (var digitI = 0; digitI < currentToken.length; digitI++) {
                                var token = Token.makeNewToken('DIGIT', currentToken[digitI], i + 1);
                                _Tokens.push(token);
                                _S_Logger.logMessage("Created " + token.value + " token.");
                            }
                        }


                        //check for symbols
                        else if (symbolStr.indexOf(currentToken) > -1) {
                            for (var symbolI = 0; symbolI < _Punctuation.length; symbolI++) {
                                if (currentToken === _Punctuation[symbolI].value) {
                                    var token = Token.makeNewToken(_Punctuation[symbolI].type, _Punctuation[symbolI].value, i + 1);

                                    if ((token.type === QUOTE.type) && (lexingStr === false)) {
                                        //no new lines in quotes
                                        _S_Logger.logError('New lines invalid in strings.', i + 1, 'Lexer');
                                        throw new Error("No new lines in strings. Ending program execution.");
                                    }
                                    else if ((token.type === QUOTE.type) && (lexingStr === true)) {
                                        _Tokens.push(token);
                                        lexingStr = !lexingStr;
                                        _S_Logger.logMessage("Created " + token.value + " token.");
                                    }
                                    else {
                                        _Tokens.push(token);
                                        _S_Logger.logMessage("Created " + token.value + " token.");
                                    }
                                }
                            }
                        }

                        //handle strings
                        else if (stringReg.test(currentToken)) {
                            lexingStr = !lexingStr;
                            this.tokenizeString(currentToken, i + 1);
                            lexingStr = !lexingStr;
                        }

                        //if not in our language grammar, throws error
                        else {
                            _S_Logger.logError("Character '" + currentToken + "' is invalid.", i + 1, 'Lexer');
                            throw new Error ("Invalid character. Ending execution.");
                        }
                    }
                }
            }

            _S_Logger.logTokens();
            return _Tokens;
		}

        //strings for tokens
        public static tokenizeString(str: string, line: number) {
            for (var i = 0; i < str.length; i++) {
                //quotes
                if (str[i] === '"') {
                    var token = StallCompiler.Token.makeNewToken(QUOTE.type, str[i], line);
                    _Tokens.push(token);
                    _S_Logger.logMessage("Created " + token.value + " token.");
                }

                //spaces
                else if (str[i] === ' ') {
                    var token = StallCompiler.Token.makeNewToken(SPACE.type, str[i], line);
                    _Tokens.push(token);
                    _S_Logger.logMessage("Created '" + token.value + "' token.");
                }

                //characters, possibly
                else {
                    var token = Token.makeNewToken(CHARACTER.type, str[i], line);
                    _Tokens.push(token);
                    _S_Logger.logMessage("Created '" + token.value + "' token.");
                }
            }
        }
    }
}