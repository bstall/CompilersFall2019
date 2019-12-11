
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
        private static codeT: CodeT;
        private static staticT: StaticT;
        private static jumpT: JumpT;
        private static jumpTCounter: number = 0;

        public static genCode(node:Node, scope: Scope):void {
            _S_Logger.logIgnoreVMode("Beginning Code Gen.");
            this.staticT = new StaticT();
            this.codeT = new CodeT();
            this.jumpT = new JumpT();
            
        }
        //assign
        public static genCodeForAssignStmt(node: Node, scope: Scope): void {
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
        public static genCodeForPrintStmt(node: Node, scope: Scope): void {
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
        public static genCodeForIntExpr(node: Node, scope: Scope): void {
            
        }

        //decls
        //int decl - saves temp for int value
        public static genCodeForIntDecl(node: Node, scope: Scope): void {
            // Initialize to zero
            this.loadAccWithConst("00");
            this.storeAccInMem(this.staticT.getCurrentTemp(), "XX");
            
            // Make entry in static table
            var item = new staticTItem(this.staticT.getCurrentTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset(), "int");
            this.staticT.addItem(item);
            this.staticT.incrementTemp();
        }
        //string and bool similar to int
        public static genCodeForStringDecl(node: Node, scope: Scope): void {
            var item = new staticTItem(this.staticT.getNextTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset() + 1, "string");
            this.staticT.addItem(item);
        }
        
        public static genCodeForBoolDecl(node: Node, scope: Scope): void {
            var item = new staticTItem(this.staticT.getCurrentTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset(), "bool");
            this.staticT.addItem(item);
            this.staticT.incrementTemp();
        }

        //pushing op codes down to bottom
        //instruction set methods
        //LDA 1
        public static loadAccWithConst(constant: string): void {
            //op code
            this.codeT.addByte('A9');
            this.codeT.addByte(constant);
        }
        //LDA 2
        public static loadAccFromMem(atAddr: string, fromAddr: string): void {
            this.codeT.addByte('AD');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //STA
        public static storeAccInMem(atAddr: string, fromAddr: string): void {
            this.codeT.addByte('8D');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //ADC
        public static addWithCarry(atAddr: string, fromAddr: string): void {
            this.codeT.addByte('6D');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //LDX 1
        public static loadXRegWithConst(constant: string): void {
            this.codeT.addByte('A2');
            this.codeT.addByte(constant);
        }
        //LDX 2
        public static loadXRegFromMem(atAddr: string, fromAddr: string): void {
            this.codeT.addByte('AE');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //LDY 1
        public static loadYRegWithConst(constant: string): void {
            this.codeT.addByte('A0');
            this.codeT.addByte(constant);
        }
        //LDY 2
        public static loadYRegFromMem(atAddr: string, fromAddr: string): void {
            this.codeT.addByte('AC');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //NOP
        public static noOp(): void {
            //just adds op code to code table
            this.codeT.addByte('EA');
        }
        //BRK
        public static break(): void {
            //same as nop
            this.codeT.addByte('00');
        }
        //CPX
        public static compareByte(atAddr: string, fromAddr: string): void {
            this.codeT.addByte('EC');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        }
        //BNE
        public static branch(compByte: string): void {
            this.codeT.addByte('D0');
            this.codeT.addByte(compByte)
        }
        //INC
        public static incrementByte(): void {
            this.codeT.addByte('EE');
        }
        //SYS
        public static systemCall(): void {
            this.codeT.addByte('FF');
        }

    }
}