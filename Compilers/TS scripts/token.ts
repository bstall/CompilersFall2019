//file for keeping track of tokens during lexing

module StallCompiler {
    export class Token {
        //constructor for Token class
        constructor(public type: string, public value: string, public line: number) {
            this.type = type;
            this.value = value;
            this.line = line;
        }

        //method for making new tokens. Each has the type, value and line number it is found on
        //providing the line number makes debugging easier with more accurate error messages
        public static makeNewToken(type, value, lineNum) {
            var token = new Token(type, value, lineNum);
            return token;
        }
    }
}