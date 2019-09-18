//file for global items in Stall Compiler
/// <reference path='token.ts'/>
/// <reference path='lexer.ts'/>
/// <reference path='logging.ts'/>

var _Log_ = StallCompiler.logging; //fix later
var _Lexer_ = StallCompiler.lexer; //fix later
var _Tokens_ = [];
var CurrentToken_: StallCompiler.Token = null;
var _TIndex_: number = 0;

//keywords of grammar
const PRINT = {type: 'PRINT', value: 'print'};
const WHILE = {type: 'WHILE', value: 'while'};
const IF = {type: 'IF', value: 'if'};
const INT = {type: 'INT', value: 'int'};
const STRING = {type: 'STRING', value: 'string'};
const BOOLEAN = {type: 'BOOLEAN', value: 'boolean'};
const FALSE = {type: 'FALSE', value: 'false'};
const TRUE = {type: 'TRUE', value: 'true'};

//stores all keywords
const _Keywords_ = [PRINT, WHILE, IF, INT, STRING, BOOLEAN, FALSE, TRUE];

//punctuation allowed in grammar
const L_BRACE = {type: 'L_BRACE', value: '{'};
const R_BRACE = {type: 'R_BRACE', value: '}'};
const L_PAREN = {type: 'L_PAREN', value: '('};
const R_PAREN = {type: 'R_PAREN', value: ')'};
const ASSIGN = {type: 'ASSIGN', value: '='};
const EQUAL = {type: 'EQUAL', value: '=='};
const N_EQUAL = {type: 'N_EQUAL', value: '!='};
const CHAR = {type: 'CHAR', value: ''};
const DIGIT = {type: 'DIGIT', value: ''};
const SPACE = {type: 'SPACE', value: ' '};
const QUOTE = {type: 'QUOTE', value: '"'};
const PLUS  = {type: 'PLUS', value: '+'};
const EOP = {type: 'EOP', value: '$'};

//stores all punctuation
const _Punc_ = [L_BRACE, R_BRACE, L_PAREN, R_PAREN, ASSIGN, EQUAL, N_EQUAL, CHAR, DIGIT, SPACE, QUOTE, PLUS, EOP];

//ID type
const ID = {type: 'ID', value: ''};