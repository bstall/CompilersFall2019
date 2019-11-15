//file for tree construction and maintenance in compiler
var StallCompiler;
(function (StallCompiler) {
    var Tree = /** @class */ (function () {
        function Tree() {
            this.root = null;
            this.currentNode = null;
        }
        //get and set functions for nodes of tree
        Tree.prototype.getRoot = function () {
            return this.root;
        };
        Tree.prototype.setRoot = function (node) {
            this.root = node;
        };
        //functions to add different types of nodes
        Tree.prototype.addBranchNode = function (type) {
            var node = new StallCompiler.Node();
            node.setType(type);
            if (this.root === null || (!this.root)) {
                this.root = node;
                this.currentNode = node;
            }
            else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
                this.currentNode = node;
            }
        };
        Tree.prototype.addLeafNode = function (token) {
            var node = new StallCompiler.Node();
            node.setType(token.type);
            node.setValue(token.value);
            node.setLeafNode(true);
            node.setLineNumber(token.line);
            if (this.root === null || (!this.root)) {
                //error
            }
            else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
            }
        };
        Tree.prototype.endChildren = function () {
            if ((this.currentNode.getParent() !== null) && (this.currentNode.getParent().getType() !== undefined)) {
                this.currentNode = this.currentNode.getParent();
            }
            else {
                //error
            }
        };
        Tree.prototype.toString = function () {
            var traversalResult = "";
            //function for node expansion
            //recursively called
            function expand(node, depth) {
                //attempt to look somewhat tree-like
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                //if no leaf nodes, makes note of the node
                if (!node.children || node.children.length === 0) {
                    traversalResult += "[ " + node.value + " ]";
                    traversalResult += "\n";
                }
                else {
                    //if children, these are branch nodes
                    traversalResult += "< " + node.type + " > \n";
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            //initial call starting from root
            expand(this.root, 0);
            return traversalResult;
        };
        Tree.prototype.toStringAST = function () {
            var traversalResult = "";
            //handles node expansion
            function expand(node, depth) {
                //attempt to space it out and appear more like a tree
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                if (!node.children || node.children.length === 0) {
                    //keeps track of leaf node
                    traversalResult += "[ " + node.type + " ]";
                    traversalResult += "\n";
                }
                else {
                    //expand branch nodes
                    traversalResult += "< " + node.type + " > \n";
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            //expand from the root.
            expand(this.root, 0);
            return traversalResult;
        };
        return Tree;
    }());
    StallCompiler.Tree = Tree;
})(StallCompiler || (StallCompiler = {}));
