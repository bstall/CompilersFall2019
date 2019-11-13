module StallCompiler{
    export class Symbol{
        //class to keep track of symbols for semantic analysis
        
        private name: string;
        private type: string;
        private line: number;
        private isInitialized: boolean = false;
        constructor(name: string, type: string, line: number) {
            this.setName(name);
            this.setType(type);
            this.setLine(line);
        }

        //name methods
        public getName(): string {
            return this.name;
        }

        public setName(name: string): void {
            this.name = name;
        }

        //type methods
        public getType(): string {
            return this.type;
        }

        public setType(type: string) {
            this.type = type;
        }

        //line methods
        public getLine(): string {
            return this.line.toString();
        }

        public setLine(line: number) {
            this.line = line;
        }

        public getInitialized(): boolean {
            return this.isInitialized;
        }

        public setInitialized(bool: boolean): void {
            this.isInitialized = bool;
        }
    }
}