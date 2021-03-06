
///<reference path='scope.ts' />
///<reference path='node.ts' />
///<reference path='globals.ts' />
///<reference path='utils.ts' />
///<reference path='logger.ts' />
///<reference path='codeT.ts' />
///<reference path='staticT.ts' />
///<reference path='jumpT.ts' />

//main file for project 4
module StallCompiler{
    export class CodeGen{
        //initialize variables
        private codeT: CodeT;
        private staticT: StaticT;
        private jumpT: JumpT;
        //private static jumpTCounter: number = 0;

        public genCode(node:Node, scope: Scope) {
            _S_Logger.logIgnoreVMode("Beginning Code Gen.");
            this.staticT = new StaticT();
            this.codeT = new CodeT();
            this.jumpT = new JumpT();
            this.genCodeFromNode(node, scope);
            this.break();
            this.codeT.zeroOutEmptySlots();
            this.staticT.removeTempsInCodeT(this.codeT);
            this.jumpT.removeTempsInCodeT(this.codeT);
            _S_Logger.logCodeTable(this.codeT);
            _S_Logger.logIgnoreVMode("Code Generation complete.");
            
        }
        public genCodeFromNode(node: StallCompiler.Node, scope: StallCompiler.Scope) {
            _S_Logger.logMessage("Generating code for " + node.getType());
            console.log(node);
            switch (node.getType()) {
                case "Block":
                    this.genCodeForBlock(node, scope);
                    break;
                case "While Statement":
                    this.genCodeForWhileStmt(node, scope);
                    break;
                case "If Statement":
                    console.log(node); 
                    this.genCodeForIfStmt(node, scope);
                    break;
                case "Print Statement":
                    this.genCodeForPrintStmt(node, scope);
                    break;
                case "Variable Declaration":
                    this.genCodeForVarDecl(node, scope);
                    break;
                case "Assignment Statement":
                    this.genCodeForAssignStmt(node, scope);
                    break; 
                default:
                    _S_Logger.logError("Node has unidentified type.", node.getLineNumber(), "Code Generator");
                    throw new Error("Unidentified type of node in Code Gen.");    
            }   
        }
        
        public genCodeForBlock(node: Node, scope: Scope) {
            for (var i = 0; i < node.children.length; i++) {
                console.log(node.children[i]);
                this.genCodeFromNode(node.children[i], scope);
            }
        }
        
        public genCodeForWhileStmt(node: Node, scope: Scope) {
            var current = this.codeT.getCurrentAddr();
            this.genCodeForBoolExpr(node.children[0], scope);
            
            //create jump table entry
            var jumpTemp = this.jumpT.getNextTemp();
            var jumpItem = new JumpTItem(jumpTemp);
            this.jumpT.addItem(jumpItem);
            this.branch(Utils.leftPad(this.codeT.getCurrentAddr().toString(16), 2));
            
            //block in while loop
            console.log(node);
            this.genCodeForBlock(node.children[1], scope);
            
            this.loadAccWithConst("00");
            this.storeAccInMem("00", "00");
            this.loadXRegWithConst("01");
            this.compareByte("00", "00");
            
            var toLeftPad = (256 - (this.codeT.getCurrentAddr() - current + 2));
            var leftPadded = Utils.leftPad(toLeftPad.toString(16), 2);
            this.branch(leftPadded);
        }
        
        public genCodeForIfStmt(node: Node, scope: Scope) {   
            
            // comparing two identifiers   
            if (node.children[0].children[0].getIdentifier() && node.children[0].children[1].getIdentifier()) {
                console.log(node);
                var firstTableEntry = this.staticT.findItemWithIdentifier(node.children[0].children[0].getType());
                this.loadXRegFromMem(firstTableEntry.getTemp(), "XX");
            
                var secondTableEntry = this.staticT.findItemWithIdentifier(node.children[0].children[1].getType());
                this.compareByte(secondTableEntry.getTemp(), "XX");
                
                var jumpEntry = new JumpTItem(this.jumpT.getCurrentTemp());
                this.jumpT.addItem(jumpEntry);
                var start = this.codeT.getCurrentAddr();
                this.branch(jumpEntry.getTemp());
                this.jumpT.incrementTemp();
            
                this.genCodeForBlock(node.children[1], scope);
            
                //change jump dist
                console.log(this.codeT.getCurrentAddr() - start + 1);
                this.jumpT.setDistForItem(jumpEntry, this.codeT.getCurrentAddr() - start + 1)
            } else if (node.children.length === 1 && node.children[0].getType() === "true") {
                this.genCodeForBlock(node.children[1], scope);
            }
            
        }
        //vardecl
        public genCodeForVarDecl(node: Node, scope: Scope) {
            switch (node.children[0].getType()) {
                case "int":
                    this.genCodeForIntDecl(node, scope);
                    break;
                case "bool":
                    this.genCodeForBoolDecl(node, scope);
                    break;
                case "string":
                    this.genCodeForStringDecl(node, scope);
                    break;
                default:
                    //should not get errors at this point
                    _S_Logger.logError("Variable type undefined.", node.getLineNumber(), "Code Gen");
                    throw new Error("broken");
            }
        }
        //bool expr
        public genCodeForBoolExpr(node: Node, scope: Scope) {
            console.log(node);
            switch (node.getType()) {
                case "==":
                    console.log("==");
                    this.genCodeForEquivStmt(node, scope);
                    break;
                case "!=":
                    console.log("!=");
                    break;
                case "true":
                    console.log("true");
                    break;
                case "false":
                    this.loadXRegWithConst("01");
                    this.loadAccWithConst("00");
                    this.storeAccInMem("00", "00");
                    this.compareByte("00", "00");
                    break;
                default:
                    _S_Logger.logError("Undefined bool type.", node.getLineNumber(), "Code Gen");
                    throw new Error("broken");
            }
        }
        public genCodeForEquivStmt(node: Node, scope: Scope) {
            
        }
        //assign
        public genCodeForAssignStmt(node: Node, scope: Scope) {
            //find id in static t 
            console.log(node);
            if (node.children[1].getIdentifier()) {
                //set id to other id value
                var firstTableEntry = this.staticT.findItemWithIdentifier(node.children[1].getType());
                var secondTableEntry = this.staticT.findItemWithIdentifier(node.children[0].getType())
                this.loadAccFromMem(firstTableEntry.getTemp(), "XX");
                this.storeAccInMem(secondTableEntry.getTemp(), "XX");
            } else if (node.children[1].getInt()) {
                //int assign    
                var tableEntry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                var value = Utils.leftPad(node.children[1].getType(), 2);
                this.loadAccWithConst(value);
                this.storeAccInMem(tableEntry.getTemp(), "XX"); 
            } else if (node.children[1].checkBoolean()) {
                //bool assign
                
            } else {
                //string
                //have to write to heap, bottom-up
                var entry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                var pointer = this.codeT.writeStringToHeap(node.children[1].getType());
                this.loadAccWithConst(pointer.toString(16).toUpperCase());
                this.storeAccInMem(entry.getTemp(), "XX");
            }
        }
        //print
        public genCodeForPrintStmt(node: Node, scope: Scope) {
            console.log(node);
            if (node.children[0].getIdentifier()) {
                var tableEntry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                this.loadYRegFromMem(tableEntry.getTemp(), "XX");
                
                // change x register if we're printing a string or an int
                if (tableEntry.getType() === "int") {
                    this.loadXRegWithConst("01");
                } else {
                    this.loadXRegWithConst("02");
                }
                
                this.systemCall();
            } else if (node.children[0].getInt()) {
                //int
                this.genCodeForIntExpr(node.children[0], scope);
                this.storeAccInMem("00", "00");
                //system call to print int
                this.loadXRegWithConst("01");
                this.loadYRegFromMem("00", "00");
                this.systemCall();
            } else if (node.children[0].checkBoolean()) {
                //boolean
                
            } else {
                //string
                // write it to the heap
                var heapPosition = this.codeT.writeStringToHeap(node.children[0].getType());
                // load acc with heap position
                this.loadAccWithConst(heapPosition.toString(16).toUpperCase());
                this.storeAccInMem("00", "00");
                // system call to print string
                this.loadXRegWithConst("02");
                this.loadYRegFromMem("00", "00");
                this.systemCall();
            }            
        }
        public genCodeForIntExpr(node: Node, scope: Scope) {
            
        }

        //decls
        //int decl - saves temp for int value
        public genCodeForIntDecl(node: Node, scope: Scope) {
            // Initialize to zero
            this.loadAccWithConst("00");
            this.storeAccInMem(this.staticT.getCurrentTemp(), "XX");
            
            // Make entry in static table
            var item = new staticTItem(this.staticT.getCurrentTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset(), "int");
            this.staticT.addItem(item);
            this.staticT.incrementTemp();
        }
        //string and bool similar to int
        public genCodeForStringDecl(node: Node, scope: Scope) {
            var item = new staticTItem(this.staticT.getNextTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset() + 1, "string");
            this.staticT.addItem(item);
        }
        
        public genCodeForBoolDecl(node: Node, scope: Scope) {
            var item = new staticTItem(this.staticT.getCurrentTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset(), "bool");
            this.staticT.addItem(item);
            this.staticT.incrementTemp();
        }

        //pushing op codes down to bottom
        //instruction set methods
        //LDA 1
        public loadAccWithConst(constant: string) {
            //op code
            this.codeT.addByte('A9');
            this.codeT.addByte(constant);
        }
        //LDA 2
        public loadAccFromMem(atAddr: string, fromAddr: string) {
            this.codeT.addByte('AD');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //STA
        public storeAccInMem(atAddr: string, fromAddr: string) {
            this.codeT.addByte('8D');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //ADC
        public addWithCarry(atAddr: string, fromAddr: string) {
            this.codeT.addByte('6D');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //LDX 1
        public loadXRegWithConst(constant: string) {
            this.codeT.addByte('A2');
            this.codeT.addByte(constant);
        }
        //LDX 2
        public loadXRegFromMem(atAddr: string, fromAddr: string) {
            this.codeT.addByte('AE');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //LDY 1
        public loadYRegWithConst(constant: string) {
            this.codeT.addByte('A0');
            this.codeT.addByte(constant);
        }
        //LDY 2
        public loadYRegFromMem(atAddr: string, fromAddr: string) {
            this.codeT.addByte('AC');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //NOP
        public noOp() {
            //just adds op code to code table
            this.codeT.addByte('EA');
        }
        //BRK
        public break(){
            //same as nop
            this.codeT.addByte('00');
        }
        //CPX
        public compareByte(atAddr: string, fromAddr: string) {
            this.codeT.addByte('EC');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //BNE
        public branch(compByte: string) {
            this.codeT.addByte('D0');
            this.codeT.addByte(compByte)
        }
        //INC
        public incrementByte() {
            this.codeT.addByte('EE');
        }
        //SYS
        public systemCall() {
            this.codeT.addByte('FF');
        }

    }
}