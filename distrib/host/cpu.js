/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(startIndex, PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (startIndex === void 0) { startIndex = 0; }
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = _IR; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.startIndex = startIndex;
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = _IR;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.programExecute = function (opCode) {
            if (opCode == "A9") {
                //Load the accumulator with constant
                _IR = opCode;
                //Get Next byte from memory
                this.PC++;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                // Convert constant from hex to base 10
                this.Acc = parseInt(memAddress, 16);
                // Set constant to accumulator
                _Acc = this.Acc;
            }
            else if (opCode == "AD") {
                // Load the acccumulator from memory
                _IR = opCode;
                // Load the the next two bytes and switch them
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var address = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    address = address + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    address = address + 512;
                }
                var getAcc = _MemoryManager.fetch(parseInt(memAddress, 16));
                this.Acc = parseInt(getAcc, 16);
                _Acc = parseInt(getAcc, 16);
            }
            else if (opCode == "8D") {
                //Store accumulator in memory
                _IR = opCode;
                // Load the the next two bytes
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var destAddress = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    destAddress = destAddress + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    destAddress = destAddress + 512;
                }
                if (destAddress <= _CurrentProgram.limit) {
                    _MemoryArray[destAddress] = this.Acc.toString(16);
                }
            }
            else if (opCode == "A2") {
                // Load the X resgister with a constant
                _IR = opCode;
                // Load the the next byte
                this.PC++;
                var numVal = _MemoryManager.fetch(++this.PC);
                this.Xreg = parseInt(numVal, 16);
                _Xreg = parseInt(numVal, 16);
            }
            else if (opCode == "6D") {
                _IR = opCode;
                // Load the the next two bytes
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var address = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    address = address + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    address = address + 512;
                }
                var val = _MemoryManager.fetch(address);
                this.Acc = this.Acc + parseInt(val, 16);
                _Acc = this.Acc + parseInt(val, 16);
            }
            else if (opCode == "AE") {
                _IR = opCode;
                //Load the X register from memory
                // Load the the next two bytes
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var address = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    address = address + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    address = address + 512;
                }
                var val = _MemoryManager.fetch(address);
                this.Xreg = parseInt(val, 16);
                _Xreg = parseInt(val, 16);
            }
            else if (opCode == "AC") {
                // Load Y register from memory
                _IR = opCode;
                // Load the the next two bytes
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var address = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    address = address + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    address = address + 512;
                }
                var val = _MemoryManager.fetch(address);
                this.Yreg = parseInt(val, 16);
                _Yreg = parseInt(val, 16);
            }
            else if (opCode == "A0") {
                //Load Y register with a constant
                _IR = opCode;
                // Load the the next byte
                this.PC++;
                var numVal = _MemoryManager.fetch(++this.startIndex);
                this.Yreg = parseInt(numVal, 16);
                _Yreg = parseInt(numVal, 16);
            }
            else if (opCode == "EA") {
                _IR = opCode;
                // Do nothing
            }
            else if (opCode == "00") {
                _IR = opCode;
                _CurrentProgram.startIndex = this.startIndex;
                _CurrentProgram.PC = this.PC;
                _CurrentProgram.Acc = this.Acc;
                _CurrentProgram.Xreg = this.Xreg;
                _CurrentProgram.Yreg = this.Yreg;
                _CurrentProgram.Zflag = this.Zflag;
            }
            else if (opCode == "EC") {
                _IR = opCode;
                // Load the the next two bytes
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var address = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    address = address + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    address = address + 512;
                }
                var val = _MemoryManager.fetch(address);
                var newVal = _MemoryManager.fetch(parseInt(memAddress, 16));
                var xVal = parseInt(val, 16);
                if (xVal == this.Xreg) {
                    this.Zflag = 1;
                    _Zflag = 1;
                }
                else {
                    this.Zflag = 0;
                    _Zflag = 0;
                }
            }
            else if (opCode == "D0") {
                _IR = opCode;
                // Check if Z flag branch bytes is zero
                if (this.Zflag == 0) {
                    this.PC++;
                    // Get branch
                    var branch = parseInt(_MemoryManager.fetch(++this.startIndex), 16);
                    //  Get next byte and branch
                    var nextAddr = this.startIndex + branch;
                    if (nextAddr > _ProgramSize) {
                        nextAddr = nextAddr - _ProgramSize;
                    }
                    this.startIndex = nextAddr;
                    if (_CurrentProgram.base == 0) {
                        this.PC = nextAddr;
                    }
                    else if (_CurrentProgram.base == 256) {
                        this.PC = nextAddr - 256;
                    }
                    else {
                        this.PC = nextAddr - 512;
                    }
                }
                else {
                    this.startIndex++;
                    this.PC++;
                }
            }
            else if (opCode == "EE") {
                _IR = opCode;
                // Increment byte value
                this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.startIndex);
                memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
                var address = parseInt(memAddress, 16);
                if (_CurrentProgram.base == 256) {
                    address = address + 256;
                }
                else if (_CurrentProgram.base == 512) {
                    address = address + 512;
                }
                var val = _MemoryArray[address];
                var newVal = parseInt(val, 16) + 1;
                if (address <= _CurrentProgram.limit) {
                    val = newVal.toString(16);
                }
                _MemoryManager.storeValue(val, address);
            }
            else if (opCode == "FF") {
                _IR = opCode;
                _Kernel.krnInterruptHandler(SYSCALL_IRQ, this.Xreg);
                // if (this.Xreg == 1) {
                //   _StdOut.putText(_CPU.Yreg.toString());
                // } else if (this.Xreg == 2) {
                //   let str = "";
                //   let address = _CPU.Yreg;
                //   if (_CurrentProgram.base == 256) {
                //     address = address + 256;
                //   } else if (_CurrentProgram.base == 512) {
                //     address = address + 512;
                //   }
                //   while (_MemoryManager.fetch(address) !== "00") {
                //     let charAsc = parseInt(_MemoryManager.fetch(address), 16);
                //     str += String.fromCharCode(charAsc);
                //     address++;
                //   }
                //   _StdOut.putText(str);
                // }
            }
            else {
                // End program
                _StdOut.putText("[ERROR] Invalid OPCODE, not a valid program");
                _Kernel.krnInterruptHandler(INVALIDOPCODE_IRQ, _CurrentProgram.PID);
                _StdOut.advanceLine();
                _StdOut.putText(">");
            }
            this.startIndex++;
            this.PC++;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace("CPU cycle");
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (_MemoryManager.fetch(this.startIndex) != "00" && _DONE != true) {
                this.programExecute(_MemoryManager.fetch(this.startIndex));
                _CurrentProgram.state = PS_RUNNING;
                // Update PCB table with current program
                _MemoryManager.updatePcbTable(_CurrentProgram);
                // Update CPU table
                _MemoryManager.updateCpuTable();
                //Perform round robbin if ready queue is greater than 0
                if (_ReadyQueue.length > 1) {
                    TSOS.CpuScheduler.roundRobin();
                }
                //Increase turn around time for all programs in ready queue
                for (var i = 0; i < _ReadyQueue.length; i++) {
                    _ReadyQueue[i].taTime++;
                }
            }
            else {
                // Update CPU execution
                this.isExecuting = false;
                // Get current program if ready queue length is 1
                if (_ReadyQueue.length == 1) {
                    _CurrentProgram = _ReadyQueue[0];
                }
                // Set program state to terminated
                _CurrentProgram.state = PS_TERMINATED;
                // Update PCB table with current program
                _MemoryManager.updatePcbTable(_CurrentProgram);
                if ((_RunAll == true && _DONE != true) || _ReadyQueue.length > 1) {
                    TSOS.CpuScheduler.roundRobin();
                    // alert(`1 length = ${_ReadyQueue.length}`);
                    if (_MemoryManager.fetch(this.startIndex) != "00" &&
                        _CurrentProgram.state != PS_RUNNING) {
                        this.startIndex = _CurrentProgram.startIndex;
                        // alert(`Round Robin Switching to ${_CurrentProgram.PID}`);
                        _CurrentProgram.state = PS_RUNNING;
                        this.isExecuting = true;
                    }
                    _ClockTicks = 1;
                    // }
                    this.cycle();
                }
                else {
                    _ReadyQueue.splice(0, 1);
                    _MemoryManager.resetPartition(_CurrentProgram);
                    _MemoryManager.updateMemTable(_CurrentProgram);
                    _MemoryManager.deleteRowPcb(_CurrentProgram);
                    _StdOut.advanceLine();
                    _StdOut.putText(">");
                    this.init();
                    _MemoryManager.updateCpuTable();
                    _DONE = true;
                }
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
