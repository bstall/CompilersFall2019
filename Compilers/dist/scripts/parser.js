//main file for parse
///<reference path='tree.js' />
var StallCompiler;
(function (StallCompiler) {
    var Parser = /** @class */ (function () {
        function Parser() {
        }
        //initializes parse
        Parser.parse = function () {
            _CurrentToken = _Tokens[_TokenIndex];
            _CST = new StallCompiler.Tree();
            this.parseProgram();
        };
        //start with largest structures and recursively make parse calls
        //each parse call adds a node to the cst
        Parser.parseProgram = function () {
            _S_Logger.logIgnoreVMode("\nParsing program.\n");
            _CST.addBranchNode("Program");
            this.parseBlock();
            this.match(END_OF_PROGRAM.type);
            _CST.endChildren();
        };
        Parser.parseBlock = function () {
            _CST.addBranchNode("Block");
            this.match(L_BRACE.type);
            this.parseStatementList();
            this.match(R_BRACE.type);
            _CST.endChildren();
        };
        Parser.parseStatementList = function () {
            //checks for tokens that start statements
            if (_CurrentToken.type === PRINT.type ||
                _CurrentToken.type === IDENTIFIER.type ||
                _CurrentToken.type === INT.type ||
                _CurrentToken.type === BOOL.type ||
                _CurrentToken.type === STRING.type ||
                _CurrentToken.type === L_BRACE.type ||
                _CurrentToken.type === WHILE.type ||
                _CurrentToken.type === IF.type) {
                _CST.addBranchNode("Statement List");
                this.parseStatement();
                this.parseStatementList();
                _CST.endChildren();
            }
            //else, do nothing
        };
        Parser.parseStatement = function () {
            _CST.addBranchNode("Statement");
            //different token types call different parses
            switch (_CurrentToken.type) {
                case PRINT.type:
                    this.parsePrintStatement();
                    break;
                case IDENTIFIER.type:
                    this.parseAssignmentStatement();
                    break;
                case STRING.type:
                case INT.type:
                case BOOL.type:
                    this.parseVarDecl();
                    break;
                case WHILE.type:
                    this.parseWhileStatement();
                    break;
                case IF.type:
                    this.parseIfStatement();
                    break;
                default:
                    this.parseBlock();
            }
            _CST.endChildren();
        };
        Parser.parsePrintStatement = function () {
            _CST.addBranchNode("Print Statement");
            //finds print, parentheses and parses expression 
            this.match(PRINT.type);
            this.match(L_PAREN.type);
            this.parseExpr();
            this.match(R_PAREN.type);
            _CST.endChildren();
        };
        Parser.parseAssignmentStatement = function () {
            _CST.addBranchNode("Assignment Statement");
            //parses ID, finds assignments, parses the expression following
            this.parseId();
            this.match(ASSIGNMENT.type);
            this.parseExpr();
            _CST.endChildren();
        };
        Parser.parseVarDecl = function () {
            _CST.addBranchNode("Variable Declaration");
            //variable declarations for different tokent types, parses ID
            switch (_CurrentToken.type) {
                case STRING.type:
                    this.match(STRING.type);
                    this.parseId();
                    break;
                case INT.type:
                    this.match(INT.type);
                    this.parseId();
                    break;
                case BOOL.type:
                    this.match(BOOL.type);
                    this.parseId();
                    break;
                default:
                    _S_Logger.logError("Mistakes were made, should not have gotten here.", _CurrentToken.line, 'Parser');
                    throw new Error("Something broken in parser.");
            }
            _CST.endChildren();
        };
        Parser.parseWhileStatement = function () {
            _CST.addBranchNode("While Statement");
            //finds while token, parses for boolean, then parses for block
            //same structure for the other statement types
            this.match(WHILE.type);
            this.parseBooleanExpr();
            this.parseBlock();
            _CST.endChildren();
        };
        Parser.parseIfStatement = function () {
            _CST.addBranchNode("If Statement");
            this.match(IF.type);
            this.parseBooleanExpr();
            this.parseBlock();
            _CST.endChildren();
        };
        //parseExpr calls specific type expr parses
        Parser.parseExpr = function () {
            _CST.addBranchNode("Expression");
            //handles all the different types of expressions
            switch (_CurrentToken.type) {
                case DIGIT.type:
                    this.parseIntExpr();
                    break;
                case QUOTE.type:
                    this.parseStringExpr();
                    break;
                case L_PAREN.type:
                case TRUE.type:
                case FALSE.type:
                    this.parseBooleanExpr();
                    break;
                case IDENTIFIER.type:
                    this.parseId();
                    break;
                default:
                    _S_Logger.logError("Mistakes were made, should not have gotten here.", _CurrentToken.line, 'Parser');
                    throw new Error("Something broken in parser.");
            }
            _CST.endChildren();
        };
        Parser.parseIntExpr = function () {
            _CST.addBranchNode("Int Expression");
            if (_CurrentToken.type === DIGIT.type) {
                this.match(DIGIT.type);
                if (_CurrentToken.type === PLUS.type) {
                    this.match(PLUS.type);
                    this.parseExpr();
                }
            }
            _CST.endChildren();
        };
        Parser.parseStringExpr = function () {
            _CST.addBranchNode("String Expression");
            this.match(QUOTE.type);
            this.parseCharList();
            this.match(QUOTE.type);
            _CST.endChildren();
        };
        Parser.parseBooleanExpr = function () {
            _CST.addBranchNode("Boolean Expression");
            if (_CurrentToken.type === TRUE.type) {
                this.match(TRUE.type);
            }
            else if (_CurrentToken.type === FALSE.type) {
                this.match(FALSE.type);
            }
            else {
                this.match(L_PAREN.type);
                this.parseExpr();
                if (_CurrentToken.type === EQUALS.type) {
                    this.match(EQUALS.type);
                    this.parseExpr();
                    this.match(R_PAREN.type);
                }
                else if (_CurrentToken.type === NOT_EQUALS.type) {
                    this.match(NOT_EQUALS.type);
                    this.parseExpr();
                    this.match(R_PAREN.type);
                }
            }
            _CST.endChildren();
        };
        Parser.parseId = function () {
            _CST.addBranchNode("Identifier");
            this.match(IDENTIFIER.type);
            _CST.endChildren();
        };
        Parser.parseCharList = function () {
            if (_CurrentToken.type === CHARACTER.type) {
                _CST.addBranchNode("Char List");
                this.match(CHARACTER.type);
                this.parseCharList();
                _CST.endChildren();
            }
            else if (_CurrentToken.type === SPACE.type) {
                _CST.addBranchNode("Char List");
                this.match(SPACE.type);
                this.parseCharList();
                _CST.endChildren();
            }
            //else, nothing
        };
        Parser.match = function (type) {
            if (_CurrentToken.type === type) {
                _CST.addLeafNode(_CurrentToken);
                _S_Logger.logMessage("Successfully matched " + type + " token.");
            }
            else {
                //helpful error messages
                _S_Logger.logError("Expected " + type + ", found " + _CurrentToken.type, _CurrentToken.line, 'Parser');
                throw new Error("Error in Parse. Stopping execution.");
            }
            if (_TokenIndex < _Tokens.length) {
                _CurrentToken = _Tokens[_TokenIndex + 1];
                _TokenIndex++;
            }
        };
        return Parser;
    }());
    StallCompiler.Parser = Parser;
})(StallCompiler || (StallCompiler = {}));
