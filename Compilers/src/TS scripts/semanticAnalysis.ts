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

        public static semAnalyzeBlock(cstNode: Node, scope: Scope, astNode?: Node): void {
            var newNode = new Node("Block");
            if (this.AST.getRoot() != null) {
                astNode.addChild(newNode);
                astNode = newNode;

                var newScope = new Scope(this.scopeNum);
                //logs scope creation
                _S_Logger.logMessage("Created Scope " + newScope.nameAsString() + ".");
                this.scopeNum++;
                newScope.setParent(scope);
                this.scopes.push(newScope);

                if (cstNode.children.length > 2) {
                    this.semAnalyzeStatementList(cstNode.children[1], astNode, newScope)
                }

            } else {
                this.AST.setRoot(newNode);
                astNode = newNode;

                this.scopes.push(scope);
                if (cstNode.children.length > 2) {
                    this.semAnalyzeStatementList(cstNode.children[1], astNode, scope)
                }
            }
        }

        public static semAnalyzeStatementList(cstNode: Node, astNode: Node, scope: Scope): void {
            //statement list doesn't get a node on ast

            //epsilon
            if (!cstNode) {
                return;
            }

            //statement then statement list according to grammar
            this.semAnalyzeStatement(cstNode.children[0], astNode, scope);
            this.semAnalyzeStatementList(cstNode.children[1], astNode, scope);
        }
        //
        public static semAnalyzeStatement(cstNode: Node, astNode: Node, scope: Scope): void {
            switch (cstNode.children[0].getType()) {
                //to do - develop methods for different statement types
                case "Print Statement":
                    this.semAnalyzePrintStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Assignment Statement":
                    this.semAnalyzeAssignmentStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Variable Declaration":
                    this.semAnalyzeVariableDeclaration(cstNode.children[0], astNode, scope);
                    break;
                case "While Statement":
                    this.semAnalyzeWhileStatement(cstNode.children[0], astNode, scope);
                    break;
                case "If Statement":
                    this.semAnalyzeIfStatement(cstNode.children[0], astNode, scope);
                    break;
                case "Block":
                    this.semAnalyzeBlock(cstNode.children[0], scope, astNode);
                    break;
                default:
                    _S_Logger.logError("Statement undefined.", cstNode.getLineNumber(), "Semantic Analysis");
                    throw new Error("Undefined statement, should not have gotten into statement analysis.");
            }
        }
        
    }

}