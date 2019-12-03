//file to keep track of code generated to output to table
module StallCompiler{
    export class CodeT{
        public table: string[] = [];
        private currentAddr: number = 0;
        private heapPos: number = 255;
        //only allowed 265 bytes
        constructor() {
            for (var i = 0; i < 256; i++) {
                this.table[i] = "";
            }
        }
        //adds to table, updates address
        public addByte(byte: string): void {
            this.table[this.currentAddr] = byte;
            this.currentAddr++;
        }
        
        //add to specific location
        public addByteAtAddr(byte: string, address: string): void {
            byte = byte.toUpperCase();
            this.table[address] = byte;
        }
        
        public getCurrentAddr(): number {
            return this.currentAddr;
        }
        //makes the unused spaces 00's
        public zeroOutEmptySlots(): void {
            for (var i = 0; i < 256; i++) {
                if (this.table[i] === "") {
                    this.table[i] = "00";
                }
            }
        }
    }
}