///<reference path='scope.js' />
///<reference path='node.js' />
///<reference path='globals.js' />
///<reference path='utils.js' />
///<reference path='logger.js' />
///<reference path='codeT.js' />
///<reference path='staticT.js' />
///<reference path='jumpT.js' />
//main file for project 4
var StallCompiler;
(function (StallCompiler) {
    var CodeGen = /** @class */ (function () {
        function CodeGen() {
        }
        //private static jumpTCounter: number = 0;
        CodeGen.genCode = function (node, scope) {
            _S_Logger.logIgnoreVMode("Beginning Code Gen.");
            this.staticT = new StallCompiler.StaticT();
            this.codeT = new StallCompiler.CodeT();
            this.jumpT = new StallCompiler.JumpT();
            this.genCodeFromNode(node, scope);
            this["break"]();
            this.codeT.zeroOutEmptySlots();
            this.staticT.removeTempsInCodeT(this.codeT);
            this.jumpT.removeTempsInCodeT(this.codeT);
            _S_Logger.logCodeTable(this.codeT);
            _S_Logger.logIgnoreVMode("Code Generation complete.");
        };
        CodeGen.genCodeFromNode = function (node, scope) {
            _S_Logger.logMessage("Generating code for " + node.getType());
            console.log(node);
            switch (node.getType()) {
                case "Block":
                    this.genCodeForBlock(node, scope);
                    break;
                case "While":
                    this.genCodeForWhileStmt(node, scope);
                    break;
                case "If":
                    console.log(node);
                    this.genCodeForIfStmt(node, scope);
                    break;
                case "Print":
                    this.genCodeForPrintStmt(node, scope);
                    break;
                case "VarDecl":
                    this.genCodeForVarDecl(node, scope);
                    break;
                case "Assignment":
                    this.genCodeForAssignStmt(node, scope);
                    break;
                default:
                    _S_Logger.logError("Node has unidentified type.", node.getLineNumber(), "Code Generator");
                    throw new Error("Unidentified type of node in Code Gen.");
            }
        };
        CodeGen.genCodeForBlock = function (node, scope) {
            for (var i = 0; i < node.children.length; i++) {
                console.log(node.children[i]);
                this.genCodeFromNode(node.children[i], scope);
            }
        };
        CodeGen.genCodeForWhileStmt = function (node, scope) {
            var current = this.codeT.getCurrentAddr();
            this.genCodeForBoolExpr(node.children[0], scope);
            //create jump table entry
            var jumpTemp = this.jumpT.getNextTemp();
            var jumpItem = new StallCompiler.JumpTItem(jumpTemp);
            this.jumpT.addItem(jumpItem);
            this.branch(StallCompiler.Utils.leftPad(this.codeT.getCurrentAddr().toString(16), 2));
            //block in while loop
            console.log(node);
            this.genCodeForBlock(node.children[1], scope);
            this.loadAccWithConst("00");
            this.storeAccInMem("00", "00");
            this.loadXRegWithConst("01");
            this.compareByte("00", "00");
            var toLeftPad = (256 - (this.codeT.getCurrentAddr() - current + 2));
            var leftPadded = StallCompiler.Utils.leftPad(toLeftPad.toString(16), 2);
            this.branch(leftPadded);
        };
        CodeGen.genCodeForIfStmt = function (node, scope) {
            // comparing two identifiers   
            if (node.children[0].children[0].getIdentifier() && node.children[0].children[1].getIdentifier()) {
                console.log(node);
                var firstTableEntry = this.staticT.findItemWithIdentifier(node.children[0].children[0].getType());
                this.loadXRegFromMem(firstTableEntry.getTemp(), "XX");
                var secondTableEntry = this.staticT.findItemWithIdentifier(node.children[0].children[1].getType());
                this.compareByte(secondTableEntry.getTemp(), "XX");
                var jumpEntry = new StallCompiler.JumpTItem(this.jumpT.getCurrentTemp());
                this.jumpT.addItem(jumpEntry);
                var start = this.codeT.getCurrentAddr();
                this.branch(jumpEntry.getTemp());
                this.jumpT.incrementTemp();
                this.genCodeForBlock(node.children[1], scope);
                //change jump dist
                console.log(this.codeT.getCurrentAddr() - start + 1);
                this.jumpT.setDistForItem(jumpEntry, this.codeT.getCurrentAddr() - start + 1);
            }
            else if (node.children.length === 1 && node.children[0].getType() === "true") {
                this.genCodeForBlock(node.children[1], scope);
            }
        };
        //vardecl
        CodeGen.genCodeForVarDecl = function (node, scope) {
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
        };
        //bool expr
        CodeGen.genCodeForBoolExpr = function (node, scope) {
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
        };
        CodeGen.genCodeForEquivStmt = function (node, scope) {
        };
        //assign
        CodeGen.genCodeForAssignStmt = function (node, scope) {
            //find id in static t 
            console.log(node);
            if (node.children[1].getIdentifier()) {
                //set id to other id value
                var firstTableEntry = this.staticT.findItemWithIdentifier(node.children[1].getType());
                var secondTableEntry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                this.loadAccFromMem(firstTableEntry.getTemp(), "XX");
                this.storeAccInMem(secondTableEntry.getTemp(), "XX");
            }
            else if (node.children[1].getInt()) {
                //int assign    
                var tableEntry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                var value = StallCompiler.Utils.leftPad(node.children[1].getType(), 2);
                this.loadAccWithConst(value);
                this.storeAccInMem(tableEntry.getTemp(), "XX");
            }
            else if (node.children[1].checkBoolean()) {
                //bool assign
            }
            else {
                //string
                //have to write to heap, bottom-up
                var entry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                var pointer = this.codeT.writeStringToHeap(node.children[1].getType());
                this.loadAccWithConst(pointer.toString(16).toUpperCase());
                this.storeAccInMem(entry.getTemp(), "XX");
            }
        };
        //print
        CodeGen.genCodeForPrintStmt = function (node, scope) {
            console.log(node);
            if (node.children[0].getIdentifier()) {
                var tableEntry = this.staticT.findItemWithIdentifier(node.children[0].getType());
                this.loadYRegFromMem(tableEntry.getTemp(), "XX");
                // change x register if we're printing a string or an int
                if (tableEntry.getType() === "int") {
                    this.loadXRegWithConst("01");
                }
                else {
                    this.loadXRegWithConst("02");
                }
                this.systemCall();
            }
            else if (node.children[0].getInt()) {
                //int
                this.genCodeForIntExpr(node.children[0], scope);
                this.storeAccInMem("00", "00");
                //system call to print int
                this.loadXRegWithConst("01");
                this.loadYRegFromMem("00", "00");
                this.systemCall();
            }
            else if (node.children[0].checkBoolean()) {
                //boolean
            }
            else {
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
        };
        CodeGen.genCodeForIntExpr = function (node, scope) {
        };
        //decls
        //int decl - saves temp for int value
        CodeGen.genCodeForIntDecl = function (node, scope) {
            // Initialize to zero
            this.loadAccWithConst("00");
            this.storeAccInMem(this.staticT.getCurrentTemp(), "XX");
            // Make entry in static table
            var item = new StallCompiler.staticTItem(this.staticT.getCurrentTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset(), "int");
            this.staticT.addItem(item);
            this.staticT.incrementTemp();
        };
        //string and bool similar to int
        CodeGen.genCodeForStringDecl = function (node, scope) {
            var item = new StallCompiler.staticTItem(this.staticT.getNextTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset() + 1, "string");
            this.staticT.addItem(item);
        };
        CodeGen.genCodeForBoolDecl = function (node, scope) {
            var item = new StallCompiler.staticTItem(this.staticT.getCurrentTemp(), node.children[1].getType(), scope.nameAsInt(), this.staticT.getOffset(), "bool");
            this.staticT.addItem(item);
            this.staticT.incrementTemp();
        };
        //pushing op codes down to bottom
        //instruction set methods
        //LDA 1
        CodeGen.loadAccWithConst = function (constant) {
            //op code
            this.codeT.addByte('A9');
            this.codeT.addByte(constant);
        };
        //LDA 2
        CodeGen.loadAccFromMem = function (atAddr, fromAddr) {
            this.codeT.addByte('AD');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        };
        //STA
        CodeGen.storeAccInMem = function (atAddr, fromAddr) {
            this.codeT.addByte('8D');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        };
        //ADC
        CodeGen.addWithCarry = function (atAddr, fromAddr) {
            this.codeT.addByte('6D');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        };
        //LDX 1
        CodeGen.loadXRegWithConst = function (constant) {
            this.codeT.addByte('A2');
            this.codeT.addByte(constant);
        };
        //LDX 2
        CodeGen.loadXRegFromMem = function (atAddr, fromAddr) {
            this.codeT.addByte('AE');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        };
        //LDY 1
        CodeGen.loadYRegWithConst = function (constant) {
            this.codeT.addByte('A0');
            this.codeT.addByte(constant);
        };
        //LDY 2
        CodeGen.loadYRegFromMem = function (atAddr, fromAddr) {
            this.codeT.addByte('AC');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        };
        //NOP
        CodeGen.noOp = function () {
            //just adds op code to code table
            this.codeT.addByte('EA');
        };
        //BRK
        CodeGen["break"] = function () {
            //same as nop
            this.codeT.addByte('00');
        };
        //CPX
        CodeGen.compareByte = function (atAddr, fromAddr) {
            this.codeT.addByte('EC');
            this.codeT.addByte(atAddr);
            this.codeT.addByte(fromAddr);
        };
        //BNE
        CodeGen.branch = function (compByte) {
            this.codeT.addByte('D0');
            this.codeT.addByte(compByte);
        };
        //INC
        CodeGen.incrementByte = function () {
            this.codeT.addByte('EE');
        };
        //SYS
        CodeGen.systemCall = function () {
            this.codeT.addByte('FF');
        };
        return CodeGen;
    }());
    StallCompiler.CodeGen = CodeGen;
})(StallCompiler || (StallCompiler = {}));
