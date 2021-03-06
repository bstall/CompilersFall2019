//main file for project 3
///<reference path='tree.ts' />
///<reference path='scope.ts' />
///<reference path='symbol.ts' />
///<reference path='globals.ts' />
///<reference path='node.ts' />


module StallCompiler{
    export class SemanticAnalysis{
        //initialize the AST and variables to keep track of scope
        private static AST: Tree;
        private static scopes: Scope[];
        private static scopeNum: number;
        //driver method
        public static performAnalysis(): void {
            _S_Logger.logIgnoreVMode("\nBeginning Semantic Analysis.\n");
            this.scopes = [];
            this.scopeNum = 0;
            this.AST = new Tree();

            this.buildAST(_CST.getRoot());
            _S_Logger.logAST(this.AST.toStringAST());
            _S_Logger.logSymbolTable(this.scopes);
            _S_Logger.logIgnoreVMode("\nSemantic Analysis complete.\n");
        }
        public static buildAST(root: Node): void {
            this.semAnalyzeProgram(root);
        }

        //method initializes scope for program
        public static semAnalyzeProgram(node: Node): void {
            var newScope = new Scope(this.scopeNum);
            _S_Logger.logMessage("Created Scope " + newScope.nameAsString() + ".");
            this.scopeNum++;
            //calls next level for analysis
            this.semAnalyzeBlock(node.children[0], newScope);
        }

        public static semAnalyzeBlock(concreteNode: Node, scope: Scope, abstractNode?: Node): void {
            //titles ast node
            var newNode = new Node("Block");
            if (this.AST.getRoot() != null) {
                abstractNode.addChild(newNode);
                abstractNode = newNode;

                var newScope = new Scope(this.scopeNum);
                //logs scope creation
                _S_Logger.logMessage("Created Scope " + newScope.nameAsString() + ".");
                this.scopeNum++;
                newScope.setParent(scope);
                this.scopes.push(newScope);

                if (concreteNode.children.length > 2) {
                    this.semAnalyzeStatementList(concreteNode.children[1], abstractNode, newScope)
                }

            } else {
                this.AST.setRoot(newNode);
                abstractNode = newNode;

                this.scopes.push(scope);
                if (concreteNode.children.length > 2) {
                    this.semAnalyzeStatementList(concreteNode.children[1], abstractNode, scope)
                }
            }
        }

        public static semAnalyzeStatementList(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            //statement list doesn't get a node on ast

            //epsilon
            if (!concreteNode) {
                return;
            }

            //statement then statement list according to grammar
            this.semAnalyzeStatement(concreteNode.children[0], abstractNode, scope);
            this.semAnalyzeStatementList(concreteNode.children[1], abstractNode, scope);
        }
        //switch/case for varying stmt types
        public static semAnalyzeStatement(concreteNode: Node, abstractNode: Node, scope: Scope): void {
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
        }
        //in order of grammar productions
        //print
        public static semAnalyzePrintStatement(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            var newNode = new Node("Print");

            abstractNode.addChild(newNode);
            abstractNode = newNode;

            this.semAnalyzeExpression(concreteNode.children[2], abstractNode, scope);
        }

        //assign
        public static semAnalyzeAssignmentStatement(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            var newNode = new Node("Assignment");
            //adds id
            var id = new Node(concreteNode.children[0].children[0].getValue());
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
                _S_Logger.logError("Id '" + concreteNode.children[0].children[0].getValue() + "' not in scope.", abstractNode.getLineNumber(),
                                 "Semantic Analysis");
                throw new Error("Id not in scope, ending.");
            }
            _S_Logger.logMessage("Found '" + concreteNode.children[0].children[0].getValue() + "' in scope " + scope.nameAsString() + ".");

            //type check
            _S_Logger.logMessage("Checking if id '" + concreteNode.children[0].children[0].getValue() + "' is assigned the type it was declared.");
            var typeCheck = scope.confirmType(concreteNode.children[0].children[0].getValue(), abstractNode.children[1]);
            if (!typeCheck) {
                _S_Logger.logError("Type mismatch. Expected " + scope.getTypeOfSymbol(concreteNode.children[0].children[0].getValue()) + ".",
                                 abstractNode.getLineNumber(), "Semantic Analysis");
                throw new Error("Type mismatch, ending");
            }
            _S_Logger.logMessage("Id assigned.");
        }

        //vardecl
        public static semAnalyzeVariableDeclaration(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            var newNode = new Node("VarDecl");

            var type = new Node(concreteNode.children[0].getValue());
            var value = new Node(concreteNode.children[1].children[0].getValue());
            newNode.addChild(type);
            newNode.addChild(value);
            abstractNode.addChild(newNode);

            var newSymbol = new Symbol(concreteNode.children[1].children[0].getValue(), concreteNode.children[0].getValue(), concreteNode.children[0].getLineNumber());
            scope.addSymbol(newSymbol);
            _S_Logger.logMessage("Variable added to symbol table: " + newSymbol.getType() + " " + newSymbol.getName() +
                               " in Scope " + scope.nameAsString() + ".")
        }

        //while
        public static semAnalyzeWhileStatement(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            var newNode = new Node("While");
            abstractNode.addChild(newNode);
            abstractNode = newNode;

            this.semAnalyzeBoolExpr(concreteNode.children[1], abstractNode, scope);
            this.semAnalyzeBlock(concreteNode.children[2], scope, abstractNode);
        }

        //if
        public static semAnalyzeIfStatement(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            var newNode = new Node("If");
            abstractNode.addChild(newNode);
            abstractNode = newNode;

            this.semAnalyzeBoolExpr(concreteNode.children[1], abstractNode, scope);
            this.semAnalyzeBlock(concreteNode.children[2], scope, abstractNode);
        }

        //to-do: expression methods
        //expression has similar structure to statements/list
        public static semAnalyzeExpression(concreteNode: Node, abstractNode: Node, scope: Scope): void {
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
                    var id = new Node(concreteNode.children[0].children[0].getValue());
                    id.setIdentifier(true);
                    abstractNode.addChild(id);
                    var search = scope.findIdentifier(concreteNode.children[0].children[0].getValue());
                    if (!search) {
                        _S_Logger.logError("Id '" + concreteNode.children[0].children[0].getValue() + "' not found.",
                                         concreteNode.children[0].children[0].getLineNumber(), "Semantic Analysis");
                        throw new Error("ID not found.");
                    }
                    break;
                default:
                    _S_Logger.logError("Undefined expression.", concreteNode.getLineNumber(), "Semantic Analysis");
                    throw new Error("Undefined expression. Shouldn't have been sent here.");
            }

        }

        //int
        public static semAnalyzeIntExpr(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            if (concreteNode.children.length === 1) {
                var value = new Node(concreteNode.children[0].getValue());
                value.setInt(true);
                abstractNode.addChild(value);
            } else {
                
                var value = new Node(concreteNode.children[0].getValue());
                value.setInt(true);
                abstractNode.addChild(value);

                //only do addition
                var plus = new Node("+");
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
        }

        //str
        public static semAnalyzeStrExpr(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            if (concreteNode.children.length > 2) {
                this.semAnalyzeCharList(concreteNode.children[1], abstractNode, "", scope);
            } else {
                var newNode = new Node("");
                abstractNode.addChild(newNode);
            }
        }

        //bool
        public static semAnalyzeBoolExpr(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            if (concreteNode.children.length > 1) {
                //node is boolop
                var newNode = new Node(concreteNode.children[2].getValue());
                abstractNode.addChild(newNode);
                abstractNode = newNode;

                //exprs on either side of boolop
                this.semAnalyzeExpression(concreteNode.children[1], abstractNode, scope);
                this.semAnalyzeExpression(concreteNode.children[3], abstractNode, scope);
            } else {
                var newNode = new Node(concreteNode.children[0].getValue());

                newNode.setBoolean(true);
                abstractNode.addChild(newNode);
            }
        }

        //char list
        public static semAnalyzeCharList(concreteNode: Node, abstractNode: Node, string: string, scope: Scope): void {
            if (concreteNode.children.length === 1) {
                string += concreteNode.children[0].getValue();
                var newNode = new Node(string);

                abstractNode.addChild(newNode);
            } else {
                string += concreteNode.children[0].getValue();
                this.semAnalyzeCharList(concreteNode.children[1], abstractNode, string, scope);
            }
        }
        
    }

}