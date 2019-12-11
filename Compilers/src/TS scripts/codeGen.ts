
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
        private static staticT: staticT;
        private static jumpT: jumpT;
        private static jumpTCounter: number = 0;

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
        public static loadXRegrWithConst(constant: string): void {
            this.codeT.addByte('A2');
            this.codeT.addByte(constant);
        }
        //LDX 2
        //LDY 1
        //LDY 2
        //NOP
        //BRK
        //CPX
        //BNE
        //INC
        //SYS

    }
}