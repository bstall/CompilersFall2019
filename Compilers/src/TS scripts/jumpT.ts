module StallCompiler{
    export class jumpT{
        private items: JumpTableItem[] = [];
        //holds as jump byte
        private prefix: string = "J";
        private suffix: number = 0;

        //item methods
        public getItems(): JumpTableItem[] {
            return this.items;
        }
        public getItemAtIndex(index: number): JumpTableItem {
            return this.items[index];
        }
        
        public addItem(item: JumpTableItem): void {
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

        
        public getItemWithId(temp): JumpTableItem {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].getTemp() === temp) {
                    return this.items[i];
                }
            }
            return null;
        }
    }
    //item getters/setters
    export class JumpTableItem {
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