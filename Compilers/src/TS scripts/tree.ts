//file for tree construction and maintenance in compiler
module StallCompiler {
    export class Tree {

        //initialize node variables
        private root: Node;
        private currentNode: Node;

        constructor() {
            this.root = null;
            this.currentNode = null;
        }

        //get and set functions for nodes of tree
        public getRoot(): Node {
            return this.root;
        }

        public setRoot(node: Node) {
            this.root = node;
        }

        //functions to add different types of nodes
        public addBranchNode(type: string): void {
            var node: StallCompiler.Node = new Node();
            node.setType(type);

            if (this.root === null || (!this.root)) {
                this.root = node;
                this.currentNode = node;
            } else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
                this.currentNode = node;
            }
        }

        public addLeafNode(token: Token): void {
            var node: Node = new Node();
            node.setType(token.type);
            node.setValue(token.value);
            node.setLeafNode(true);
            node.setLineNumber(token.line);

            if (this.root === null || (!this.root)) {
                //error

            } else {
                this.currentNode.addChild(node);
                node.setParent(this.currentNode);
            }
        }

        public endChildren(): void {
            if ((this.currentNode.getParent() !== null) && (this.currentNode.getParent().getType() !== undefined))
            {
                this.currentNode = this.currentNode.getParent();
            }
            else
            {
                //error
            }
        }

        public toString() {
            var traversalResult = "";

            //function for node expansion
            //recursively called
            function expand(node, depth)
            {
                //attempt to look somewhat tree-like
                for (var i = 0; i < depth; i++)
                {
                    traversalResult += "-";
                }

                //if no leaf nodes, makes note of the node
                if (!node.children || node.children.length === 0)
                {
                    traversalResult += "[ " + node.value + " ]";
                    traversalResult += "\n";
                }
                else
                {
                    //if children, these are branch nodes
                    traversalResult += "< " + node.type + " > \n";
                    for (var i = 0; i < node.children.length; i++)
                    {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            //initial call starting from root
            expand(this.root, 0);
            return traversalResult;
        }
        public toStringAST() {
            var traversalResult = "";
            //handles node expansion
            function expand(node, depth)
            {
                //attempt to space it out and appear more like a tree
                for (var i = 0; i < depth; i++)
                {
                    traversalResult += "-";
                }

                if (!node.children || node.children.length === 0)
                {
                    //keeps track of leaf node
                    traversalResult += "[ " + node.type + " ]";
                    traversalResult += "\n";
                }
                else
                {
                    //expand branch nodes
                    traversalResult += "< " + node.type + " > \n";
                    for (var i = 0; i < node.children.length; i++)
                    {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            //expand from the root.
            expand(this.root, 0);
            return traversalResult;
        }

    }
}