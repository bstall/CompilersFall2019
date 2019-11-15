module StallCompiler{
    export class Scope{
        //initialize class variables to keep track of scope
        private name: number;
        private symbols: Symbol[] = [];
        private children: Scope[] = [];
        private parent: Scope = null;

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
        //parent methods
        public getParent(): Scope {
            return this.parent;
        }

        public setParent(parent: Scope): void {
            this.parent = parent;
        }
        
        //current scope
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
            //checks name against names in current scope
            var checkScope = this.findIdentifierInCurrentScope(id);

            //adds to symbols[]
            if (!checkScope) {
                this.symbols.push(symbol);
            } else {
                //not sure if reassignment in current scope legal in our grammar
                //using this as placeholder
                _S_Logger.logError("Identifier '" + id + "' already declared in current scope.", parseInt(symbol.getLine()), "Semantic Analysis");
                throw new Error("ID already in scope");
            }
        }
        //child methods
        public getChildren(): Scope[] {
            return this.children;
        }

        public addChild(child: Scope): void {
            this.children.push(child);
        }

        //type methods
        public getTypeOfSymbolInScope(id: string, scope: Scope): string {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    return scope.symbols[i].getType();
                }
            }

            if (scope.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, scope.getParent());
            }
        }
        public getTypeOfSymbol(id: string): string {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return this.symbols[i].getType();
                }
            }

            if (this.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, this.getParent());
            }
        }

        
        
        //id methods
        public findIdentifierInScope(id: string, scope: Scope): boolean {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    scope.symbols[i].setInitialized(true);
                    return true;
                }
            }

            if (scope.getParent() != null) {
                return this.findIdentifierInScope(id, scope.getParent());
            } else {
                return false;
            }
        }
        public findIdentifier(id: string): boolean {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    this.symbols[i].setInitialized(true);
                    return true;
                }
            }

            if (this.getParent() != null) {
                return this.findIdentifierInScope(id, this.getParent());
            } else {
                return false;
            }
        }

        public confirmType(id: string, node): boolean {

            var type = this.getTypeOfSymbol(id);
            var value = node.type;

            if (node.getIdentifier()) {
                // Lookup up the ID in scope
                var idType = this.getTypeOfSymbol(node.getType());
                return type === idType;

            } else if (type) {
                switch (type) {
                    case "int":
                        return !isNaN(value);
                    case "string":
                        if (value === "true" || value === "false") {
                            return !node.isBoolean;
                        }

                        if (node.isInt) {
                            return false;
                        }

                        return (typeof value === 'string');
                    case "boolean":
                        return node.isBoolean;
                    default:
                        _S_Logger.logError("Type not found.", node.getLineNumber(), "Semantic Analyzer");
                        throw new Error("Type not found");}
            } else {
                _S_Logger.logError("Type undefined.", node.getLineNumber(), "Semantic Analyzer");
                throw new Error("Type undefined");
            }
        }
    }
}