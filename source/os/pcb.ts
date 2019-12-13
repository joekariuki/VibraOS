///<reference path="../globals.ts" />

module TSOS {
  export class PCB {
    constructor(
      public PC: number = 0,
      public PID: number = _PID,
      public base: number = 0,
      public Acc: number = 0,
      public Xreg: number = 0,
      public Yreg: number = 0,
      public limit: number = 0,
      public IR: string = _IR,
      public pcbProgram: string = "",
      public Zflag: number = 0,
      public startIndex: number = 0,
      public waitTime: number = 0,
      public taTime: number = 0,
      public priority: number = 120,
      public location: string = "",
      public state: string = PS_NEW
    ) {}
    public init() {
      this.PC = 0;
      this.IR = "NA";
    }
  }
}
