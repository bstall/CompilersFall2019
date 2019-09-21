//file for global items in Stall Compiler
/// <reference path='token.ts'/>
/// <reference path='lexer.ts'/>
/// <reference path='logging.ts'/>
/// <reference path='util.ts'/>
var _Log_;
var _Lexer_;
var _Tokens_ = [];
var _CurrentToken_ = null;
var _TIndex_ = 0;
//keywords of grammar
var PRINT = { type: 'PRINT', value: 'print' };
var WHILE = { type: 'WHILE', value: 'while' };
var IF = { type: 'IF', value: 'if' };
var INT = { type: 'INT', value: 'int' };
var STRING = { type: 'STRING', value: 'string' };
var BOOLEAN = { type: 'BOOLEAN', value: 'boolean' };
var FALSE = { type: 'FALSE', value: 'false' };
var TRUE = { type: 'TRUE', value: 'true' };
//stores all keywords
var _Keywords_ = [PRINT, WHILE, IF, INT, STRING, BOOLEAN, FALSE, TRUE];
//punctuation allowed in grammar
var L_BRACE = { type: 'L_BRACE', value: '{' };
var R_BRACE = { type: 'R_BRACE', value: '}' };
var L_PAREN = { type: 'L_PAREN', value: '(' };
var R_PAREN = { type: 'R_PAREN', value: ')' };
var ASSIGN = { type: 'ASSIGN', value: '=' };
var EQUAL = { type: 'EQUAL', value: '==' };
var N_EQUAL = { type: 'N_EQUAL', value: '!=' };
var CHAR = { type: 'CHAR', value: '' };
var DIGIT = { type: 'DIGIT', value: '' };
var SPACE = { type: 'SPACE', value: ' ' };
var QUOTE = { type: 'QUOTE', value: '"' };
var PLUS = { type: 'PLUS', value: '+' };
var EOP = { type: 'EOP', value: '$' };
//stores all punctuation
var _Punc_ = [L_BRACE, R_BRACE, L_PAREN, R_PAREN, ASSIGN, EQUAL, N_EQUAL, CHAR, DIGIT, SPACE, QUOTE, PLUS, EOP];
//ID type
var ID = { type: 'ID', value: '' };
