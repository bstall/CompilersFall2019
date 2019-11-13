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
            this.semAnalyzeStatement(cstNode.children[0], astNode, scope);
            this.semAnalyzeStatementList(cstNode.children[1], astNode, scope);
        }
        
    }

}