var StallCompiler;
(function (StallCompiler) {
    var Node = /** @class */ (function () {
        function Node(type) {
            //variable type declarations
            this.isBoolean = false;
            this.isInt = false;
            this.isIdentifier = false;
            if (type) {
                this.type = type;
            }
            else {
                this.type = "";
            }
            this.value = "";
            this.children = [];
            this.parent = null;
            this.lineNumber = 0;
            this.isLeafNode = false;
        }
        //get and set methods for node variables
        //bool
        Node.prototype.checkBoolean = function () {
            return this.isBoolean;
        };
        Node.prototype.setBoolean = function (bool) {
            this.isBoolean = bool;
        };
        //int
        Node.prototype.getInt = function () {
            return this.isInt;
        };
        Node.prototype.setInt = function (bool) {
            this.isInt = bool;
        };
        //ID
        Node.prototype.setIdentifier = function (bool) {
            this.isIdentifier = bool;
        };
        Node.prototype.getIdentifier = function () {
            return this.isIdentifier;
        };
        //types
        Node.prototype.getType = function () {
            return this.type;
        };
        Node.prototype.setType = function (type) {
            this.type = type;
        };
        //values
        Node.prototype.getValue = function () {
            return this.value;
        };
        Node.prototype.setValue = function (value) {
            this.value = value;
        };
        //;ine numbers
        Node.prototype.getLineNumber = function () {
            return this.lineNumber;
        };
        Node.prototype.setLineNumber = function (number) {
            this.lineNumber = number;
        };
        //leaf nodes
        Node.prototype.checkLeafNode = function () {
            return this.isLeafNode;
        };
        Node.prototype.setLeafNode = function (bool) {
            this.isLeafNode = bool;
        };
        //method to push children onto node
        Node.prototype.addChild = function (node) {
            this.children.push(node);
        };
        //parent nodes
        Node.prototype.getParent = function () {
            return this.parent;
        };
        Node.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        return Node;
    }());
    StallCompiler.Node = Node;
})(StallCompiler || (StallCompiler = {}));
