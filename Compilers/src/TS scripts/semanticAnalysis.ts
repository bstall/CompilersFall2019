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
                //to do - develop methods for different statement types
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
        public static semAnalyzePrintStatement(concreteNode: Node, abstractNode: Node, scope: Scope): void {
            var newNode = new Node("Print");

            abstractNode.addChild(newNode);
            abstractNode = newNode;
            
            this.semAnalyzeExpression(concreteNode.children[2], abstractNode, scope);
        }
        
    }

}