var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(PC, PID, base, Acc, Xreg, Yreg, limit, IR, pcbProgram, Zflag, startIndex, waitTime, taTime, state) {
            if (PC === void 0) { PC = 0; }
            if (PID === void 0) { PID = _PID; }
            if (base === void 0) { base = 0; }
            if (Acc === void 0) { Acc = _Acc; }
            if (Xreg === void 0) { Xreg = _Xreg; }
            if (Yreg === void 0) { Yreg = _Yreg; }
            if (limit === void 0) { limit = 0; }
            if (IR === void 0) { IR = _IR; }
            if (pcbProgram === void 0) { pcbProgram = ""; }
            if (Zflag === void 0) { Zflag = _Zflag; }
            if (startIndex === void 0) { startIndex = 0; }
            if (waitTime === void 0) { waitTime = 0; }
            if (taTime === void 0) { taTime = 0; }
            if (state === void 0) { state = PS_NEW; }
            this.PC = PC;
            this.PID = PID;
            this.base = base;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.limit = limit;
            this.IR = IR;
            this.pcbProgram = pcbProgram;
            this.Zflag = Zflag;
            this.startIndex = startIndex;
            this.waitTime = waitTime;
            this.taTime = taTime;
            this.state = state;
        }
        PCB.prototype.init = function () {
            this.PC = 0;
            this.IR = "NA";
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
