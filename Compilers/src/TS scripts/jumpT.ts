module StallCompiler{
    export class JumpT{
        private items: JumpTItem[] = [];
        //holds as jump byte
        private prefix: string = "J";
        private suffix: number = 0;

        //item methods
        public setDistForItem(item: JumpTItem, distance: number) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] === item) {
                    this.items[i].setDist(distance);
                }
            }
        }
        public getItems(): JumpTItem[] {
            return this.items;
        }
        public getItemAtIndex(index: number): JumpTItem {
            return this.items[index];
        }
        
        public addItem(item: JumpTItem): void {
            this.items.push(item);
        }
        //temp methods
        public getCurrentTemp(): string {
            return this.prefix + this.suffix.toString();
        }
        
        public getNextTemp(): string {
            this.suffix++;
            return this.prefix + this.suffix.toString();
        }
        public incrementTemp(): void {
            this.suffix++;
        }


        public getItemWithId(temp): JumpTItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        }

        public removeTempsInCodeT(codeT: CodeT): void {
            //regex to match temp markers
            var regex = /^(J[0-9])/;
            for (var i = 0; i < codeT.table.length; i++) {
                var current = codeT.table[i];
                console.log(current.match(regex));
                if (current.match(regex)) {
                    var item: JumpTItem = this.getItemWithId(current.match(regex)[1]);
                    codeT.addByteAtAddr(Utils.leftPad(item.getDist().toString(16), 2), i.toString());
                }
            }
        }

    }
    //item getters/setters
    export class JumpTItem {
        private temp: string;
        private dist: number;
        
        constructor(temp: string) {
            this.temp = temp;
            this.dist = 0;
        }
        
        public getTemp(): string {
            return this.temp;
        }
        
        public setTemp(temp: string): void {
            this.temp = temp;
        }
        
        public getDist(): number {
            return this.dist;
        }
        
        public setDist(dist: number): void {
            this.dist = dist;
        }
    }
}