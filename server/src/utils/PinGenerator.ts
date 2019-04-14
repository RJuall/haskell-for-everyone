export class PinGenerator{
    // all possible characters (alpha-numeric)
    private static readonly VALS:string[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

    private _pinLength:number;
    private _pins:Map<string, boolean>;

    constructor(pinLength:number){
        this._pinLength = pinLength;
        this._pins = new Map();
    }

    // generates a random alpha-numeric character (a-z, A-Z, 0-9)
    public static anyAlphaNumericValue():string{
        let index:number = Math.floor(Math.random() * this.VALS.length);

        return this.VALS[index];
    }

    // generates a random pin 
    // @param length    pin character count (string length)
    public static anyPin(length:number):string{
        // store characters in an array
        let buf:string[] = new Array(length);

        // populate array
        for(let i:number = 0; i < length; i++){
            buf[i] = this.anyAlphaNumericValue();
        }

        // convert to string 
        return buf.join("");
    }

    // generates a unique pin
    public nextPin():string{
        // keep generating pins while they are unavailable 
        let pin:string;
        do{
            pin = PinGenerator.anyPin(this.pinLength);
        } while(this._pins.has(pin));

        // found a unique pin - store and return 
        this._pins.set(pin, true);
        return pin;
    }

    // releases a pin (makes it available again)
    // @param pin       pin to release
    public releasePin(pin:string):boolean{
        return this._pins.delete(pin);
    }

    // getter for the pin length (character count, string length)
    public get pinLength():number{
        return this._pinLength;
    }
}