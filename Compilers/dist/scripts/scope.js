var StallCompiler;
(function (StallCompiler) {
    var Scope = /** @class */ (function () {
        function Scope(name) {
            this.symbols = [];
            this.children = [];
            this.parent = null;
            this.setName(name);
        }
        //name methods
        Scope.prototype.setName = function (name) {
            this.name = name;
        };
        Scope.prototype.nameAsString = function () {
            return this.name.toString();
        };
        Scope.prototype.nameAsInt = function () {
            return this.name;
        };
        //symbol methods
        Scope.prototype.getAllSymbols = function () {
            return this.symbols;
        };
        //scope methods
        //parent methods
        Scope.prototype.getParent = function () {
            return this.parent;
        };
        Scope.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        //current scope
        Scope.prototype.findIdentifierInCurrentScope = function (id) {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return true;
                }
            }
            return false;
        };
        Scope.prototype.addSymbol = function (symbol) {
            var id = symbol.getName();
            //checks name against names in current scope
            var checkScope = this.findIdentifierInCurrentScope(id);
            //adds to symbols[]
            if (!checkScope) {
                this.symbols.push(symbol);
            }
            else {
                //not sure if reassignment in current scope legal in our grammar
                //using this as placeholder
                _S_Logger.logError("Identifier '" + id + "' already declared in current scope.", parseInt(symbol.getLine()), "Semantic Analysis");
                throw new Error("ID already in scope");
            }
        };
        //child methods
        Scope.prototype.getChildren = function () {
            return this.children;
        };
        Scope.prototype.addChild = function (child) {
            this.children.push(child);
        };
        //type methods
        Scope.prototype.getTypeOfSymbolInScope = function (id, scope) {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    return scope.symbols[i].getType();
                }
            }
            if (scope.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, scope.getParent());
            }
        };
        Scope.prototype.getTypeOfSymbol = function (id) {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    return this.symbols[i].getType();
                }
            }
            if (this.getParent() != null) {
                return this.getTypeOfSymbolInScope(id, this.getParent());
            }
        };
        //id methods
        Scope.prototype.findIdentifierInScope = function (id, scope) {
            for (var i = 0; i < scope.symbols.length; i++) {
                if (scope.symbols[i].getName() === id) {
                    scope.symbols[i].setInitialized(true);
                    return true;
                }
            }
            if (scope.getParent() != null) {
                return this.findIdentifierInScope(id, scope.getParent());
            }
            else {
                return false;
            }
        };
        Scope.prototype.findIdentifier = function (id) {
            for (var i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].getName() === id) {
                    this.symbols[i].setInitialized(true);
                    return true;
                }
            }
            if (this.getParent() != null) {
                return this.findIdentifierInScope(id, this.getParent());
            }
            else {
                return false;
            }
        };
        Scope.prototype.confirmType = function (id, node) {
            var type = this.getTypeOfSymbol(id);
            var value = node.type;
            if (node.getIdentifier()) {
                // Lookup up the ID in scope
                var idType = this.getTypeOfSymbol(node.getType());
                return type === idType;
            }
            else if (type) {
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
                        throw new Error("Type not found");
                }
            }
            else {
                _S_Logger.logError("Type undefined.", node.getLineNumber(), "Semantic Analyzer");
                throw new Error("Type undefined");
            }
        };
        return Scope;
    }());
    StallCompiler.Scope = Scope;
})(StallCompiler || (StallCompiler = {}));
