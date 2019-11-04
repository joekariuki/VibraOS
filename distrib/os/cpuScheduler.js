var TSOS;
(function (TSOS) {
    var CpuScheduler = /** @class */ (function () {
        function CpuScheduler() {
        }
        CpuScheduler.roundRobin = function () {
            if (_CurrentProgram.state != PS_TERMINATED) {
                if (_ClockTicks < _Quantum) {
                    _ClockTicks++;
                }
                else {
                    //set clockTicks to 1
                    _ClockTicks = 1;
                    this.contextSwitch();
                }
            }
            else {
                this.contextSwitch();
            }
        };
        CpuScheduler.contextSwitch = function () {
            var nextProgram = new TSOS.PCB();
            nextProgram = this.getNextprogram();
            if (_CurrentProgram.state == PS_TERMINATED) {
                if (_ReadyQueue.length == 1) {
                    _RunAll = false;
                    _DONE = true;
                }
                else if (_ReadyQueue.length > 1) {
                    _CurrentProgram.state = PS_TERMINATED;
                    _MemoryManager.updatePcbTable(_CurrentProgram);
                    for (var i = 0; i < _ReadyQueue.length; i++) {
                        if (_ReadyQueue[i].PID == _CurrentProgram.PID) {
                            _ReadyQueue.splice(i, 1);
                            _MemoryManager.resetPartition(_CurrentProgram);
                            _MemoryManager.updateMemTable(_CurrentProgram);
                            _MemoryManager.deleteRowPcb(_CurrentProgram);
                            break;
                        }
                    }
                    nextProgram.state = PS_READY;
                    _MemoryManager.updatePcbTable(nextProgram);
                }
            }
            else {
                _CurrentProgram.startIndex = _CPU.startIndex;
                _CurrentProgram.PC = _CPU.PC;
                _CurrentProgram.Acc = _CPU.Acc;
                _CurrentProgram.Xreg = _CPU.Xreg;
                _CurrentProgram.Yreg = _CPU.Yreg;
                _CurrentProgram.Zflag = _CPU.Zflag;
                _CurrentProgram.state = PS_READY;
                _MemoryManager.updatePcbTable(_CurrentProgram);
            }
            //Load next program
            _CurrentProgram = nextProgram;
            _CPU.startIndex = _CurrentProgram.startIndex;
            _CPU.PC = _CurrentProgram.PC;
            _CPU.Acc = _CurrentProgram.Acc;
            _CPU.Xreg = _CurrentProgram.Xreg;
            _CPU.Yreg = _CurrentProgram.Yreg;
            _CPU.Zflag = _CurrentProgram.Zflag;
        };
        // Get next program in memory
        CpuScheduler.getNextprogram = function () {
            var nextProgram = new TSOS.PCB();
            if (_ReadyQueue.length == 1) {
                if (_MemoryManager.fetch(_CPU.startIndex) != "00") {
                    nextProgram = _CurrentProgram;
                    _RunAll = false;
                    _DONE = true;
                    _CPU.cycle();
                }
            }
            else {
                for (var i = 0; i < _ReadyQueue.length; i++) {
                    // Get next program in queue
                    if (_CurrentProgram.PID == _ReadyQueue[i].PID) {
                        // Set next program to the program in the begining of the queue if the
                        if (i == _ReadyQueue.length - 1) {
                            nextProgram = _ReadyQueue[0];
                        }
                        else {
                            nextProgram = _ReadyQueue[i + 1];
                        }
                        break;
                    }
                }
            }
            return nextProgram;
        };
        return CpuScheduler;
    }());
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
