//file to keep track of static allocation of memory
module StallCompiler{
    export class staticT{

    }

    export class staticTItem{

        private temp: string;
        private id: string;
        private scope: number;
        private addr: number = 0;
        private type: string;

        constructor(temp: string, id: string, scope: number, address: number, type: string) {
            this.temp = temp;
            this.id = id;
            this.scope = scope; 
            this.addr = address;
            this.type = type;
        }
    }
}