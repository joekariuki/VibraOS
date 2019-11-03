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
        function Cpu(
        // public startIndex = _BaseProgram,
        PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = _IR; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            // this.startIndex = _BaseProgram;
            this.PC = 0;
            this.IR = _IR;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.loadAcc = function () {
            //Load the accumulator with constant
            //Get Next byte from memory
            var memAddress = _MemoryManager.fetch(++this.PC);
            //convert constant from hex to base 10 and set it to accumulator
            this.Acc = parseInt(memAddress, 16);
            _Acc = this.Acc;
        };
        Cpu.prototype.programExecute = function (opCode) {
            if (opCode == "A9") {
                //Load the accumulator with constant
                _IR = opCode;
                //Get Next byte from memory
                // this.PC++;
                var memAddress_1 = _MemoryManager.fetch(++this.PC);
                // Convert constant from hex to base 10
                this.Acc = parseInt(memAddress_1, 16);
                // Set constant to accumulator
                _Acc = this.Acc;
            }
            else if (opCode == "AD") {
                // Load the acccumulator from memory
                _IR = opCode;
                // Load the the next two bytes and switch them
                // this.PC += 2;
                var memAddress_2 = _MemoryManager.fetch(++this.PC);
                memAddress_2 = _MemoryManager.fetch(++this.PC) + memAddress_2;
                var getAcc = _MemoryManager.fetch(parseInt(memAddress_2, 16));
                this.Acc = parseInt(getAcc, 16);
                _Acc = parseInt(getAcc, 16);
            }
            else if (opCode == "8D") {
                //Store accumulator in memory
                _IR = opCode;
                // Load the the next two bytes
                // this.PC += 2;
                var memAddress_3 = _MemoryManager.fetch(++this.PC);
                memAddress_3 = _MemoryManager.fetch(++this.PC) + memAddress_3;
                var destAddress = parseInt(memAddress_3, 16);
                if (destAddress <= _CurrentProgram.limit) {
                    _MemoryArray[destAddress] = this.Acc.toString(16);
                }
            }
            else if (opCode == "A2") {
                // Load the X resgister with a constant
                _IR = opCode;
                // Load the the next byte
                // this.PC++;
                var numVal = _MemoryManager.fetch(++this.PC);
                this.Xreg = parseInt(numVal, 16);
                _Xreg = parseInt(numVal, 16);
            }
            else if (opCode == "6D") {
                //Add with carry
                _IR = opCode;
                // Load the the next two bytes
                // this.PC += 2;
                var memAddress_4 = _MemoryManager.fetch(++this.PC);
                memAddress_4 = _MemoryManager.fetch(++this.PC) + memAddress_4;
                var val = _MemoryManager.fetch(parseInt(memAddress_4, 16));
                this.Acc = this.Acc + parseInt(val, 16);
                _Acc = this.Acc + parseInt(val, 16);
            }
            else if (opCode == "AE") {
                _IR = opCode;
                //Load the X register from memory
                // Load the the next two bytes
                // this.PC += 2;
                var memAddress_5 = _MemoryManager.fetch(++this.PC);
                memAddress_5 = _MemoryManager.fetch(++this.PC) + memAddress_5;
                var val = _MemoryManager.fetch(parseInt(memAddress_5, 16));
                this.Xreg = parseInt(val, 16);
                _Xreg = parseInt(val, 16);
            }
            else if (opCode == "AC") {
                // Load Y register from memory
                _IR = opCode;
                // Load the the next two bytes
                // this.PC += 2;
                var memAddress_6 = _MemoryManager.fetch(++this.PC);
                memAddress_6 = _MemoryManager.fetch(++this.PC) + memAddress_6;
                var val = _MemoryManager.fetch(parseInt(memAddress_6, 16));
                this.Yreg = parseInt(val, 16);
                _Yreg = parseInt(val, 16);
            }
            else if (opCode == "A0") {
                //Load Y register with a constant
                _IR = opCode;
                // Load the the next byte
                this.PC++;
                var numVal = _MemoryManager.fetch(++this.PC);
                this.Yreg = parseInt(numVal, 16);
                _Yreg = parseInt(numVal, 16);
            }
            else if (opCode == "EA") {
                // Do nothing
                _IR = opCode;
            }
            else if (opCode == "00") {
                _IR = opCode;
                _CurrentProgram.PC = this.PC;
                _CurrentProgram.Acc = this.Acc;
                _CurrentProgram.Xreg = this.Xreg;
                _CurrentProgram.Yreg = this.Yreg;
                _CurrentProgram.Zflag = this.Zflag;
            }
            else if (opCode == "EC") {
                _IR = opCode;
                // Load the the next two bytes
                // this.PC += 2;
                var memAddress = _MemoryManager.fetch(++this.PC);
                memAddress = _MemoryManager.fetch(++this.PC) + memAddress;
                var val = _MemoryManager.fetch(parseInt(memAddress, 16));
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
                // Get branch
                var branch = parseInt(_MemoryManager.fetch(++this.PC), 16);
                // Check if Z flag branch bytes is zero
                if (this.Zflag == 0) {
                    // this.PC++;
                    var memAddr = this.PC + branch;
                    if (memAddr > _ProgramSize) {
                        memAddr = memAddr - _ProgramSize;
                    }
                    this.PC = memAddr;
                } //else {
                // this.startIndex++;
                //this.PC++;
                //}
            }
            else if (opCode == "EE") {
                _IR = opCode;
                // Increment byte value
                // this.PC += 2;
                var memAddress_7 = _MemoryManager.fetch(++this.PC);
                memAddress_7 = _MemoryManager.fetch(++this.PC) + memAddress_7;
                var address = parseInt(memAddress_7, 16);
                var val = _MemoryManager.fetch(address);
                _MemoryArray[address] = (parseInt(val, 16) + 1).toString(16);
                // let newVal = parseInt(val, 16) + 1;
                // if (address <= _CurrentProgram.limit) {
                //   val = newVal.toString(16);
                // }
            }
            else if (opCode == "FF") {
                _IR = opCode;
                if (this.Xreg == 1) {
                    _StdOut.putText(_CPU.Yreg.toString());
                }
                else if (this.Xreg == 2) {
                    var str = "";
                    var currAddr = _CPU.Yreg;
                    while (_MemoryManager.fetch(currAddr) !== "00") {
                        var charAsc = parseInt(_MemoryManager.fetch(currAddr), 16);
                        str += String.fromCharCode(charAsc);
                        currAddr++;
                    }
                    _StdOut.putText(str);
                }
            }
            else {
                // End program
                // _StdOut.putText("[ERROR] Invalid OPCODE, not a valid program");
            }
            this.PC++;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace("CPU cycle");
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (_MemoryManager.fetch(this.PC) != "00") {
                this.programExecute(_MemoryManager.fetch(this.PC));
                _CurrentProgram.state = PS_RUNNING;
                // Update PCB table with current program
                _MemoryManager.updatePcbTable(_CurrentProgram);
                // Update CPU table
                _MemoryManager.updateCpuTable();
            }
            else {
                // Update CPU execution
                this.isExecuting = false;
                // Update index for programs
                _BaseProgram = _BaseProgram + 256;
                // Set program state to terminated
                _CurrentProgram.state = PS_TERMINATED;
                // Update PCB table with current program
                _MemoryManager.updatePcbTable(_CurrentProgram);
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
