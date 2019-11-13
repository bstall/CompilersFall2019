module StallCompiler{
    export class Scope{
        //initialize class variables to keep track of scope
        private name: number;
        private symbols: Symbol[] = [];
        private children: Scope[] = [];
        private parent: Scope[] = null;

        //name methods
        public setName(name: number): void {
            this.name = name;
        }
        constructor(name:number){
            this.setName(name);
        }
        public nameAsString(): string {
            return this.name.toString();
        }
        public nameAsInt(): number {
            return this.name;
        }

        //symbol methods
        public getAllSymbols(): Symbol[] {
            return this.symbols;
        }
        //scope methods
        public findIdentifierInCurrentScope(id: string): boolean {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return true;
                }
            }
            return false;
        }

        public addSymbol(symbol: Symbol): void {

            var id = symbol.getName();
            var checkScope = this.findIdentifierInCurrentScope(id);

            if (!checkScope) {
                this.symbols.push(symbol);
            } else {
                //not sure if reassignment in current scope legal in our grammar
                //using this as placeholder
                _S_Logger.logError("Identifier '" + id + "' already declared in current scope.", parseInt(symbol.getLine()), "Semantic Analysis");
                throw new Error("ID already in scope");
            }
        }
    }
}