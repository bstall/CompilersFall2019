///<reference path='globals.ts' />

//Utility functions for Stall Compiler

module StallCompiler {

    export class Utils {

        
        //trims whitespace
        public static trim(str)   
        {
            return str.replace(/^\s+ | \s+$/g, "");

        }
        //used to clear the tables on web page
        public static clearTable(element: string) {
            var table = <HTMLTableElement> document.getElementById(element);
            var length = table.rows.length;

            if (length > 1) {
                for (var i = length - 1; i > 0; i--) {
                    table.deleteRow(i);
                }
            }
        }
    }
}