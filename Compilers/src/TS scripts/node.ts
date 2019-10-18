module StallCompiler {
    export class Node {

        //variable type declarations
        
        private isBoolean: boolean = false;
        private isInt: boolean = false;
        private isIdentifier: boolean = false;
        
        private type: string;
        private value: string;
        
        private lineNumber: number;

        //children array because there can be multiple
        public children: Node[];
        //only 1 parent to a node on the tree
        private parent: Node;
        private isLeafNode: boolean;

        constructor(type?: string) {
            if (type) {
                this.type = type;
            } else {
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
        public checkBoolean(): boolean {
            return this.isBoolean;
        }

        public setBoolean(bool: boolean): void {
            this.isBoolean = bool;
        }
        //int
        public getInt(): boolean {
            return this.isInt;
        }

        public setInt(bool: boolean): void {
            this.isInt = bool;
        }
        //ID
        public setIdentifier(bool: boolean): void {
            this.isIdentifier = bool;
        }
        public getIdentifier(): boolean {
            return this.isIdentifier;
        }
        //types
        public getType(): string {
            return this.type;
        }
        public setType(type: string): void {
            this.type = type;
        }
        //values
        public getValue(): string {
            return this.value;
        }
        public setValue(value: string): void {
            this.value = value;
        }
        //;ine numbers
        public getLineNumber(): number {
            return this.lineNumber;
        }
        public setLineNumber(number: number): void {
            this.lineNumber = number;
        }
        //leaf nodes
        public checkLeafNode(): boolean {
            return this.isLeafNode;
        }
        public setLeafNode(bool: boolean): void {
            this.isLeafNode = bool;
        }

        //method to push children onto node
        public addChild(node: Node): void {
            this.children.push(node);
        }
        //parent nodes
        public getParent(): Node {
            return this.parent;
        }

        public setParent(parent: Node): void {
            this.parent = parent;
        }

        
    }
}