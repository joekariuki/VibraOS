
module TSOS {

    export class PCB {

        constructor(public PC: number = 0,
                    public PID: number = _PID,
                    public base: number = 0,
                    public Acc: number = _Acc,
                    public Xreg: number = _Xreg,
                    public Yreg: number = _Yreg,
                    public limit: number = 0,
                    public IR: string = _IR,
                    public pcbProgram :string = "",
                    public Zflag: number = _Zflag,
                    public startIndex: number = 0,
                    public waitTime: number = 0,
                    public taTime: number = 0,
                    public state: string = PS_NEW) {
        }
        public init(){
            this.PC = 0;
            this.IR = "NA";
      
        }
    }
}
