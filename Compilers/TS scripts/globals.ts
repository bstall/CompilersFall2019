//file for global variables for Stall Compiler


//logger
var _S_Logger = StallCompiler.Logger;
//list of tokens
var _Tokens = [];
//current token variable
var _CurrentToken: StallCompiler.Token = null;
//keeps track of token index
var _TokenIndex: number = 0;
//boolean for verbose mode of compiler
var _VerboseMode: boolean = true;

//variables for types of tokens
const L_BRACE       = {type: 'LEFT_BRACE', value: '{'};
const R_BRACE      = {type: 'RIGHT_BRACE', value: '}'};
const L_PAREN       = {type: 'LEFT_PAREN', value: '('};
const R_PAREN      = {type: 'RIGHT_PAREN', value: ')'};

const ASSIGNMENT       = {type: 'ASSIGNMENT', value: '='};
const EQUALS            = {type: 'EQUAL', value: '=='};
const NOT_EQUALS        = {type: 'NOT_EQUAL', value: '!='};

const PRINT            = {type: 'PRINT', value: 'print'};
const WHILE            = {type: 'WHILE', value: 'while'};
const IF               = {type: 'IF', value: 'if'};
const INT              = {type: 'INT', value: 'int'};
const STRING           = {type: 'STRING', value: 'string'};
const BOOL          = {type: 'BOOLEAN', value: 'boolean'};
const TRUE             = {type: 'TRUE', value: 'true'};
const FALSE            = {type: 'FALSE', value: 'false'};

const CHARACTER        = {type: 'CHARACTER', value: ''};
const DIGIT            = {type: 'DIGIT', value: ''};

const SPACE            = {type: 'SPACE', value: ' '};
const QUOTE            = {type: 'QUOTE', value: '"'};
const PLUS             = {type: 'PLUS', value: '+'};
const END_OF_PROGRAM   = {type: 'END_OF_PROGRAM', value: '$'};
const IDENTIFIER       = {type: 'IDENTIFIER', value: ''};

const _Keywords = [PRINT, WHILE, IF, INT, STRING, BOOL, TRUE, FALSE];
const _Punctuation = [L_BRACE, R_BRACE, L_PAREN, R_PAREN,
                      ASSIGNMENT, EQUALS, NOT_EQUALS, QUOTE, PLUS, END_OF_PROGRAM];