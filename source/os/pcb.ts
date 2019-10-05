
module TSOS {

    export class PCB {
    
        constructor(public PID: number = _PID,
                    public priority: number = _PRIORITY,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public base: number = _BASE,
                    public limit: number = _ProgramSize - 1,
                    public isExecuting: boolean = false,
                    public pcbProgram :string = "",
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public state: number = PS_NEW) {
        }
    }
}