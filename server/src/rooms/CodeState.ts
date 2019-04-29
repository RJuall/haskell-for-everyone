export type ActionType = "insert" | "remove";

export interface UpdatePosition{
    row:number;
    column:number
}

export type CodeLineChars = string[][];

export type CodeLine = string[];

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
        if(action === "insert"){
            this.fillMissingRows(end.row);

            codeLines.forEach((line, idx) => {
                this._lines[start.row + idx].splice(start.column, 0, ...line);
            });
        }
        else if(action === "remove"){
            if(codeLines.length === 1){
                // removing characters in a single line
                this._lines[start.row].splice(start.column, end.column - start.column);
            }
            else{
                // fix the last line 
                let fixedLastLine:CodeLine = this._lines[end.row].slice(end.column, this._lines[end.row].length);

                // remove inner lines and last line
                this._lines.splice(start.row + 1, end.row);

                // fix first line (might start deleting from not first char)
                this._lines[start.row] = this._lines[start.row].slice(0, start.column);

                // merge the last line (case where you don't remove every char in last line)
                if(fixedLastLine.length){
                    this._lines[start.row].push(...fixedLastLine);
                }
            }
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
    public get codeLines():CodeLine{
        return this._lines.map(line => line.join(""));
    }

    // number of code rows 
    public get numLines():number{
        return this._lines.length;
    }
}