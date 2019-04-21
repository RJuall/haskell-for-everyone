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
        this.fillMissingRows(row);

        if(action === "insert"){
            // insert the chars
            this._lines[row].splice(start.column, 0, ...line);
        }
        else if(action === "remove"){
            // remove the chars
            this._lines[row].splice(start.column, end.column - start.column);
        }
    }

    // enforces that all rows are not-null and not-undefined
    // @param row   row being changed (safeguards all subsequent rows)
    private fillMissingRows(row:number):void{
        let len:number = this.numLines;

        while(row >= len){
            if(!this._lines[row]){
                this._lines[row] = [""];
            }

            row--;
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