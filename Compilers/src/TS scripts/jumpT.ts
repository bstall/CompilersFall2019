module StallCompiler{
    export class jumpT{
        private items: JumpTableItem[] = [];
        //holds as jump byte
        private prefix: string = "J";
        private suffix: number = 0;

        public getItems(): JumpTableItem[] {
            return this.items;
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