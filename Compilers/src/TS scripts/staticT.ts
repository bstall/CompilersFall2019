//file to keep track of static allocation of memory
module StallCompiler{
    export class staticT{
        private items: staticTItem[] = [];
        private prefix: string = "T";
        private suffix: number = 0;
        

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