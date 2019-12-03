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
        //method to handle strings in the table
        public writeStringToHeap(string: string): number {
            var start: number;
            this.addByteAtAddr("00", this.heapPos.toString());
            this.heapPos--;
            
            for (var i = string.length - 1; i >= 0; i--) {
                start = this.heapPos;
                var hex = string.charCodeAt(i).toString(16);
                this.addByteAtAddr(hex, this.heapPos.toString());
                this.heapPos--;
            }
            
            return start;
        }
    }
}