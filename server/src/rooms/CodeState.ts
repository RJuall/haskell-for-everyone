export type ActionType = "insert" | "remove";

export interface UpdatePosition{
    row:number;
    column:number
}

export type CodeLineChars = string[][];

export type CodeLines = string[];

export class CodeState{
    private _lines:CodeLineChars;

    constructor(){
        this._lines = [[""]];
    }

    // updates the current code state
    // @param code      next code character
    // @param start     character(s) start position in the code
    // @param end       character(s) end position in the code
    // @param action    insert or removing code? 
    public update(codeLines:string[], start:UpdatePosition, end:UpdatePosition, action:ActionType):void{
        codeLines.forEach((line, idx) => {
            this.updateLine(line, start.row + idx, start, end, action)
        });
    }

    // updates the individual line 
    // @param line      line of text to change
    // @param row       row (line number) to update at
    // @param startCol  first characters starting column (index)
    // @param endCol    last character + 1 index
    // @param action    operation to perform 
    private updateLine(line:string, row:number, start:UpdatePosition, end:UpdatePosition, action:ActionType):void{
        // line must exist 
        if(!this._lines[row]){
            this._lines[row] = [""];
        }

        // chars before insert/remove location
        let before:string[] = this._lines[row].slice(0, start.column);

        // chars after insert/remove location
        let after:string[] = this._lines[row].slice(end.column, this._lines[row].length);

        if(action === "insert"){
            // insert the chars
            this._lines[row] = [...before, ...line, ...after];
        }
        else if(action === "remove"){
            // remove the chars
            this._lines[row] = [...before, ...after];
        }
    }

    // resets the code state
    public forceReset():void{
        this._lines = [[""]];
    }

    // getter for cached code state
    public get codeLinesChars():CodeLineChars{
        return this._lines;
    }

    // code lines as a string array 
    public get codeLines():CodeLines{
        return this._lines.map(line => line.join(""));
    }

    // number of code rows 
    public get numLines():number{
        return this._lines.length;
    }
}