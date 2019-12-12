///<reference path='lexer.js' />
///<reference path='logger.js' />
///<reference path='token.js' />
///<reference path='utils.js' />
/// <reference path="node.js"/>
/// <reference path="parser.js"/>
/// <reference path="tree.js"/>
/// <reference path="semanticAnalysis.js"/>
/// <reference path="symbol.js"/>
///<reference path='scope.js' />
///<reference path='codeGen.js' />
///<reference path='codeT.js' />
///<reference path='staticT.js' />
///<reference path='jumpT.js' />
//file for global variables for Stall Compiler
//lexer
var _S_Lexer = StallCompiler.Lexer;
//logger
var _S_Logger = StallCompiler.Logger;
//parser
var _S_Parser = StallCompiler.Parser;
//list of tokens
var _Tokens = [];
//current token variable
var _CurrentToken = null;
//keeps track of token index
var _TokenIndex = 0;
//boolean for verbose mode of compiler
var _VerboseMode = true;
//tree for cst output of parse
var _CST = null;
//SA
var _S_SemanticAnalysis = StallCompiler.SemanticAnalysis;
var _S_CodeGen = StallCompiler.CodeGen;
var _S_codeT;
var _S_staticT;
var _S_jumpT;
//variables for types of tokens
var L_BRACE = { type: 'LEFT_BRACE', value: '{' };
var R_BRACE = { type: 'RIGHT_BRACE', value: '}' };
var L_PAREN = { type: 'LEFT_PAREN', value: '(' };
var R_PAREN = { type: 'RIGHT_PAREN', value: ')' };
var ASSIGNMENT = { type: 'ASSIGNMENT', value: '=' };
var EQUALS = { type: 'EQUAL', value: '==' };
var NOT_EQUALS = { type: 'NOT_EQUAL', value: '!=' };
var PRINT = { type: 'PRINT', value: 'print' };
var WHILE = { type: 'WHILE', value: 'while' };
var IF = { type: 'IF', value: 'if' };
var INT = { type: 'INT', value: 'int' };
var STRING = { type: 'STRING', value: 'string' };
var BOOL = { type: 'BOOLEAN', value: 'boolean' };
var TRUE = { type: 'TRUE', value: 'true' };
var FALSE = { type: 'FALSE', value: 'false' };
var CHARACTER = { type: 'CHARACTER', value: '' };
var DIGIT = { type: 'DIGIT', value: '' };
var SPACE = { type: 'SPACE', value: ' ' };
var QUOTE = { type: 'QUOTE', value: '"' };
var PLUS = { type: 'PLUS', value: '+' };
var END_OF_PROGRAM = { type: 'END_OF_PROGRAM', value: '$' };
var IDENTIFIER = { type: 'IDENTIFIER', value: '' };
var _Keywords = [PRINT, WHILE, IF, INT, STRING, BOOL, TRUE, FALSE];
var _Punctuation = [L_BRACE, R_BRACE, L_PAREN, R_PAREN,
    ASSIGNMENT, EQUALS, NOT_EQUALS, QUOTE, PLUS, END_OF_PROGRAM];
