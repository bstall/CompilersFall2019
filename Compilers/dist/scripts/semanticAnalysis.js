//main file for project 3
///<reference path='tree.js' />
///<reference path='scope.js' />
///<reference path='symbol.js' />
///<reference path='globals.js' />
///<reference path='node.js' />
///<reference path='codeGen.js' />
var StallCompiler;
(function (StallCompiler) {
    var SemanticAnalysis = /** @class */ (function () {
        function SemanticAnalysis() {
        }
        //driver method
        SemanticAnalysis.performAnalysis = function () {
            _S_Logger.logIgnoreVMode("\nBeginning Semantic Analysis.\n");
            this.scopes = [];
            this.scopeNum = 0;
            this.AST = new StallCompiler.Tree();
            this.buildAST(_CST.getRoot());
            _S_Logger.logAST(this.AST.toStringAST());
            _S_Logger.logSymbolTable(this.scopes);
            _S_Logger.logIgnoreVMode("\nSemantic Analysis complete.\n");
            StallCompiler.CodeGen.genCode(this.AST.getRoot(), this.scopes[0]);
        };
        SemanticAnalysis.buildAST = function (root) {
            this.semAnalyzeProgram(root);
        };
        //method initializes scope for program
        SemanticAnalysis.semAnalyzeProgram = function (node) {
            var newScope = new StallCompiler.Scope(this.scopeNum);
            _S_Logger.logMessage("Created Scope " + newScope.nameAsString() + ".");
            this.scopeNum++;
            //calls next level for analysis
            this.semAnalyzeBlock(node.children[0], newScope);
        };
        SemanticAnalysis.semAnalyzeBlock = function (concreteNode, scope, abstractNode) {
            //titles ast node
            var newNode = new StallCompiler.Node("Block");
            if (this.AST.getRoot() != null) {
                abstractNode.addChild(newNode);
                abstractNode = newNode;
                var newScope = new StallCompiler.Scope(this.scopeNum);
                //logs scope creation
                _S_Logger.logMessage("Created Scope " + newScope.nameAsString() + ".");
                this.scopeNum++;
                newScope.setParent(scope);
                this.scopes.push(newScope);
                if (concreteNode.children.length > 2) {
                    this.semAnalyzeStatementList(concreteNode.children[1], abstractNode, newScope);
                }
            }
            else {
                this.AST.setRoot(newNode);
                abstractNode = newNode;
                this.scopes.push(scope);
                if (concreteNode.children.length > 2) {
                    this.semAnalyzeStatementList(concreteNode.children[1], abstractNode, scope);
                }
            }
        };
        SemanticAnalysis.semAnalyzeStatementList = function (concreteNode, abstractNode, scope) {
            //statement list doesn't get a node on ast
            //epsilon
            if (!concreteNode) {
                return;
            }
            //statement then statement list according to grammar
            this.semAnalyzeStatement(concreteNode.children[0], abstractNode, scope);
            this.semAnalyzeStatementList(concreteNode.children[1], abstractNode, scope);
        };
        //switch/case for varying stmt types
        SemanticAnalysis.semAnalyzeStatement = function (concreteNode, abstractNode, scope) {
            switch (concreteNode.children[0].getType()) {
                case "Print Statement":
                    this.semAnalyzePrintStatement(concreteNode.children[0], abstractNode, scope);
                    break;
                case "Assignment Statement":
                    this.semAnalyzeAssignmentStatement(concreteNode.children[0], abstractNode, scope);
                    break;
                case "Variable Declaration":
                    this.semAnalyzeVariableDeclaration(concreteNode.children[0], abstractNode, scope);
                    break;
                case "While Statement":
                    this.semAnalyzeWhileStatement(concreteNode.children[0], abstractNode, scope);
                    break;
                case "If Statement":
                    this.semAnalyzeIfStatement(concreteNode.children[0], abstractNode, scope);
                    break;
                case "Block":
                    this.semAnalyzeBlock(concreteNode.children[0], scope, abstractNode);
                    break;
                default:
                    //if nothing else, throw error
                    _S_Logger.logError("Statement undefined.", concreteNode.getLineNumber(), "Semantic Analysis");
                    throw new Error("Undefined statement, should not have gotten into statement analysis.");
            }
        };
        //in order of grammar productions
        //print
        SemanticAnalysis.semAnalyzePrintStatement = function (concreteNode, abstractNode, scope) {
            var newNode = new StallCompiler.Node("Print");
            abstractNode.addChild(newNode);
            abstractNode = newNode;
            this.semAnalyzeExpression(concreteNode.children[2], abstractNode, scope);
        };
        //assign
        SemanticAnalysis.semAnalyzeAssignmentStatement = function (concreteNode, abstractNode, scope) {
            var newNode = new StallCompiler.Node("Assignment");
            //adds id
            var id = new StallCompiler.Node(concreteNode.children[0].children[0].getValue());
            newNode.addChild(id);
            newNode.setLineNumber(concreteNode.children[0].children[0].getLineNumber());
            abstractNode.addChild(newNode);
            abstractNode = newNode;
            this.semAnalyzeExpression(concreteNode.children[2], abstractNode, scope);
            //existence check
            _S_Logger.logMessage("Checking for id '" + concreteNode.children[0].children[0].getValue() + "' in scope " + scope.nameAsString() + ".");
            //gets scope
            var scopeCheck = scope.findIdentifier(concreteNode.children[0].children[0].getValue());
            if (!scopeCheck) {
                _S_Logger.logError("Id '" + concreteNode.children[0].children[0].getValue() + "' not in scope.", abstractNode.getLineNumber(), "Semantic Analysis");
                throw new Error("Id not in scope, ending.");
            }
            _S_Logger.logMessage("Found '" + concreteNode.children[0].children[0].getValue() + "' in scope " + scope.nameAsString() + ".");
            //type check
            _S_Logger.logMessage("Checking if id '" + concreteNode.children[0].children[0].getValue() + "' is assigned the type it was declared.");
            var typeCheck = scope.confirmType(concreteNode.children[0].children[0].getValue(), abstractNode.children[1]);
            if (!typeCheck) {
                _S_Logger.logError("Type mismatch. Expected " + scope.getTypeOfSymbol(concreteNode.children[0].children[0].getValue()) + ".", abstractNode.getLineNumber(), "Semantic Analysis");
                throw new Error("Type mismatch, ending");
            }
            _S_Logger.logMessage("Id assigned.");
        };
        //vardecl
        SemanticAnalysis.semAnalyzeVariableDeclaration = function (concreteNode, abstractNode, scope) {
            var newNode = new StallCompiler.Node("VarDecl");
            var type = new StallCompiler.Node(concreteNode.children[0].getValue());
            var value = new StallCompiler.Node(concreteNode.children[1].children[0].getValue());
            newNode.addChild(type);
            newNode.addChild(value);
            abstractNode.addChild(newNode);
            var newSymbol = new StallCompiler.Symbol(concreteNode.children[1].children[0].getValue(), concreteNode.children[0].getValue(), concreteNode.children[0].getLineNumber());
            scope.addSymbol(newSymbol);
            _S_Logger.logMessage("Variable added to symbol table: " + newSymbol.getType() + " " + newSymbol.getName() +
                " in Scope " + scope.nameAsString() + ".");
        };
        //while
        SemanticAnalysis.semAnalyzeWhileStatement = function (concreteNode, abstractNode, scope) {
            var newNode = new StallCompiler.Node("While");
            abstractNode.addChild(newNode);
            abstractNode = newNode;
            this.semAnalyzeBoolExpr(concreteNode.children[1], abstractNode, scope);
            this.semAnalyzeBlock(concreteNode.children[2], scope, abstractNode);
        };
        //if
        SemanticAnalysis.semAnalyzeIfStatement = function (concreteNode, abstractNode, scope) {
            var newNode = new StallCompiler.Node("If");
            abstractNode.addChild(newNode);
            abstractNode = newNode;
            this.semAnalyzeBoolExpr(concreteNode.children[1], abstractNode, scope);
            this.semAnalyzeBlock(concreteNode.children[2], scope, abstractNode);
        };
        //to-do: expression methods
        //expression has similar structure to statements/list
        SemanticAnalysis.semAnalyzeExpression = function (concreteNode, abstractNode, scope) {
            switch (concreteNode.children[0].getType()) {
                case "Int Expression":
                    this.semAnalyzeIntExpr(concreteNode.children[0], abstractNode, scope);
                    break;
                case "String Expression":
                    this.semAnalyzeStrExpr(concreteNode.children[0], abstractNode, scope);
                    break;
                case "Boolean Expression":
                    this.semAnalyzeBoolExpr(concreteNode.children[0], abstractNode, scope);
                    break;
                case "Identifier":
                    var id = new StallCompiler.Node(concreteNode.children[0].children[0].getValue());
                    id.setIdentifier(true);
                    abstractNode.addChild(id);
                    var search = scope.findIdentifier(concreteNode.children[0].children[0].getValue());
                    if (!search) {
                        _S_Logger.logError("Id '" + concreteNode.children[0].children[0].getValue() + "' not found.", concreteNode.children[0].children[0].getLineNumber(), "Semantic Analysis");
                        throw new Error("ID not found.");
                    }
                    break;
                default:
                    _S_Logger.logError("Undefined expression.", concreteNode.getLineNumber(), "Semantic Analysis");
                    throw new Error("Undefined expression. Shouldn't have been sent here.");
            }
        };
        //int
        SemanticAnalysis.semAnalyzeIntExpr = function (concreteNode, abstractNode, scope) {
            if (concreteNode.children.length === 1) {
                var value = new StallCompiler.Node(concreteNode.children[0].getValue());
                value.setInt(true);
                abstractNode.addChild(value);
            }
            else {
                var value = new StallCompiler.Node(concreteNode.children[0].getValue());
                value.setInt(true);
                abstractNode.addChild(value);
                //only do addition
                var plus = new StallCompiler.Node("+");
                abstractNode.addChild(plus);
                abstractNode = plus;
                //only really want int expr
                var typeCheck = concreteNode.children[2].children[0];
                if (typeCheck.getType() === "Boolean Expression" || typeCheck.getType() === "String Expression") {
                    _S_Logger.logError("Type mismatch, expected Int Expression.", typeCheck.getLineNumber(), "Semantic Analysis");
                    throw new Error("Type mismatch.");
                }
                this.semAnalyzeExpression(concreteNode.children[2], abstractNode, scope);
            }
        };
        //str
        SemanticAnalysis.semAnalyzeStrExpr = function (concreteNode, abstractNode, scope) {
            if (concreteNode.children.length > 2) {
                this.semAnalyzeCharList(concreteNode.children[1], abstractNode, "", scope);
            }
            else {
                var newNode = new StallCompiler.Node("");
                abstractNode.addChild(newNode);
            }
        };
        //bool
        SemanticAnalysis.semAnalyzeBoolExpr = function (concreteNode, abstractNode, scope) {
            if (concreteNode.children.length > 1) {
                //node is boolop
                var newNode = new StallCompiler.Node(concreteNode.children[2].getValue());
                abstractNode.addChild(newNode);
                abstractNode = newNode;
                //exprs on either side of boolop
                this.semAnalyzeExpression(concreteNode.children[1], abstractNode, scope);
                this.semAnalyzeExpression(concreteNode.children[3], abstractNode, scope);
            }
            else {
                var newNode = new StallCompiler.Node(concreteNode.children[0].getValue());
                newNode.setBoolean(true);
                abstractNode.addChild(newNode);
            }
        };
        //char list
        SemanticAnalysis.semAnalyzeCharList = function (concreteNode, abstractNode, string, scope) {
            if (concreteNode.children.length === 1) {
                string += concreteNode.children[0].getValue();
                var newNode = new StallCompiler.Node(string);
                abstractNode.addChild(newNode);
            }
            else {
                string += concreteNode.children[0].getValue();
                this.semAnalyzeCharList(concreteNode.children[1], abstractNode, string, scope);
            }
        };
        return SemanticAnalysis;
    }());
    StallCompiler.SemanticAnalysis = SemanticAnalysis;
})(StallCompiler || (StallCompiler = {}));
