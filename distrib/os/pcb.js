var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(PID, priority, PC, Acc, Xreg, base, limit, isExecuting, pcbProgram, Yreg, Zflag, state) {
            if (PID === void 0) { PID = _PID; }
            if (priority === void 0) { priority = _PRIORITY; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (base === void 0) { base = _BASE; }
            if (limit === void 0) { limit = _ProgramSize - 1; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (pcbProgram === void 0) { pcbProgram = ""; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (state === void 0) { state = PS_NEW; }
            this.PID = PID;
            this.priority = priority;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.base = base;
            this.limit = limit;
            this.isExecuting = isExecuting;
            this.pcbProgram = pcbProgram;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.state = state;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
