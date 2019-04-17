export type ActionType = "insert" | "remove";

export interface UpdatePosition{
    row:number;
    column:number
}

export type CodeLines = string[][];

export class CodeState{
    private _lines:CodeLines;

    constructor(){
        this._lines = [];
    }

    // updates the current code state
    // @param code      next code character
    // @param start     character(s) start position in the code
    // @param end       character(s) end position in the code
    // @param action    insert or removing code? 
    public update(code:string[], start:UpdatePosition, end:UpdatePosition, action:ActionType):void{
        let row:number = start.row;

        if(row in this._lines === false){
            // prevents the "empty lines" array
            // how many new lines to add 
            let diff:number = row - this.numLines + 1;

            // fill missing lines (could be many rows) with empty strings 
            for(let i:number = 0; i < diff; i++){
                this._lines.push([""]);
            }
        }

        // chars before insert/remove location
        let before:string[] = this._lines[row].slice(0, start.column);
        // chars after insert/remove location
        let after:string[] = this._lines[row].slice(end.column, this.numLines);

        if(action === "insert"){
            // insert the chars
            this._lines[row] = [...before, ...code, ...after];
        }
        else if(action === "remove"){
            // remove the chars
            this._lines[row] = [...before, ...after];
        }

        if(code.includes("~")) console.log(this._lines);
    }

    // getter for cached code state
    public get codeLines():CodeLines{
        return this._lines;
    }

    // number of code rows 
    public get numLines():number{
        return this._lines.length;
    }
}