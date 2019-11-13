module StallCompiler{
    export class Scope{
        //initialize class variables to keep track of scope
        private name: number;
        private symbols: Symbol[] = [];
        private children: Scope[] = [];
        private parent: Scope[] = null;

        //method to set name, called by constructor
        public setName(name: number): void {
            this.name = name;
        }
        constructor(name:number){
            this.setName(name);
        }
        public nameAsString(): string {
            return this.name.toString();
        }
        public NameAsInt(): number {
            return this.name;
        }
    }
}