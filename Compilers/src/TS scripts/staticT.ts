//file to keep track of static allocation of memory
module StallCompiler{
    export class staticT{
        private items: staticTItem[] = [];
        private prefix: string = "T";
        private suffix: number = 0;
        
        //temps
        public getCurrentTemp(): string {
            return this.prefix + this.suffix.toString();
        }
        
        public getNextTemp(): string {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        }
        
        //items
        public getItems(): staticTItem[] {
            return this.items;
        }
        
        public getItemAtIndex(index: number): staticTItem {
            return this.items[index];
        }
        
        public addItem(item: staticTItem): void {
            this.items.push(item);
        }
        
        public findItemWithIdentifier(id: string): staticTItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getId() === id) {
                    return this.items[i];
                }
            }
        }
        
        public incrementTemp() {
            this.suffix++;
        }
        
        //offset
        public getOffset(): number {
            return this.suffix;
        }
        
        public getItemWithId(temp): staticTItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;    
        }
        
        //same method as jump table
        public removeTempsInCodeTable(codeT: CodeT): void {
            var regex = /^(T[0-9])/;
            for (var i = 0; i < codeT.table.length; i++) {
                var current = codeT.table[i];
                if (current.match(regex)) {
                    var item: staticTItem = this.getItemWithId(current.match(regex)[1]);
                    console.log("current address");
                    console.log(codeT.getCurrentAddr());
                    codeT.addByteAtAddr((parseInt(item.getTemp()[1]) + codeT.getCurrentAddr() + 1).toString(16), i.toString());
                    codeT.addByteAtAddr("00", (i + 1).toString());
                }
            }
        }

    }

    export class staticTItem{

        private id: string;
        private temp: string;
        private scope: number;
        private addr: number = 0;
        private type: string;

        constructor(temp: string, id: string, scope: number, address: number, type: string) {
            
            this.id = id;
            this.temp = temp;
            this.scope = scope; 
            this.addr = address;
            this.type = type;
        }

        public getId(): string {
            return this.id;
        }
        
        public setId(id: string): void {
            this.id = id;
        }
        public getTemp(): string {
            return this.temp;
        }
        
        public setTemp(temp: string): void {
            this.temp = temp;
        }
        
        public getAddr(): number {
            return this.addr;
        }
        
        public getType(): string {
            return this.type;
        }
    }
}