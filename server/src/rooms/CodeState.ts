export type ActionType = "insert" | "remove";

export interface UpdatePosition{
    row:number;
    column:number
}

export type CodeLines = string[][];

export class CodeState{
    private _lines:Map<number, string[]>;   // row number to line of text 
    private _codeCache:CodeLines;           // 2d array of code lines 

    constructor(){
        this._lines = new Map();
        this._codeCache = [];
    }

    // updates the current code state
    // @param code      next code character
    // @param start     character(s) start position in the code
    // @param end       character(s) end position in the code
    // @param action    insert or removing code? 
    public update(code:string, start:UpdatePosition, end:UpdatePosition, action:ActionType):void{
        // get the line of code, otherwise empty line 
        let line:string[] = this._lines.get(start.row) || [];

        // prepare to update
        let updatedLine:string[];
        
        // update based on action 
        if(action === "insert"){
            // insert the code based on position 
            updatedLine = [
                ...line.slice(0, start.column), code, ...line.slice(end.column, line.length)
            ];
        } 
        else if(action === "remove"){
            // remove the code  based on position
            updatedLine = line.slice(start.column, end.column);
        }

        // store the updated line of code
        this._lines.set(start.row, updatedLine);

        // update the cache 
        this.updateCache();
    }


    // updates the code cache 
    private updateCache():void{
        this._codeCache = new Array(this._lines.size);
        
        for(let entry of this._lines.entries()){
            this._codeCache[entry[0]] = entry[1];
        }
    }

    // getter for cached code state
    public get codeLines():CodeLines{
        return this._codeCache;
    }
}