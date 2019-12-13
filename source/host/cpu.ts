///<reference path="../globals.ts" />
///<reference path="../os/cpuScheduler.ts" />
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

module TSOS {
  export class Cpu {
    constructor(
      public startIndex = 0,
      public PC: number = 0,
      public IR: string = _IR,
      public Acc: number = 0,
      public Xreg: number = 0,
      public Yreg: number = 0,
      public Zflag: number = 0,
      public isExecuting: boolean = false
    ) {}

    public init(): void {
      this.PC = 0;
      this.IR = _IR;
      this.Acc = 0;
      this.Xreg = 0;
      this.Yreg = 0;
      this.Zflag = 0;
      this.isExecuting = false;
    }

    public programExecute(opCode) {
      if (opCode == "A9") {
        //Load the accumulator with constant
        _IR = opCode;
        //Get Next byte from memory
        this.PC++;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        // Convert constant from hex to base 10
        this.Acc = parseInt(memAddress, 16);
        // Set constant to accumulator
        _Acc = this.Acc;
      } else if (opCode == "AD") {
        // Load the acccumulator from memory
        _IR = opCode;
        // Load the the next two bytes and switch them
        this.PC += 2;

        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let address = parseInt(memAddress, 16);

        if (_CurrentProgram.base == 256) {
          address = address + 256;
        } else if (_CurrentProgram.base == 512) {
          address = address + 512;
        }

        // let getAcc = _MemoryManager.fetch(parseInt(memAddress, 16));
        let getAcc = _MemoryManager.fetch(address);
        this.Acc = parseInt(getAcc, 16);
        _Acc = parseInt(getAcc, 16);
      } else if (opCode == "8D") {
        //Store accumulator in memory
        _IR = opCode;
        // Load the the next two bytes
        this.PC += 2;

        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let destAddress = parseInt(memAddress, 16);

        if (_CurrentProgram.base == 256) {
          destAddress = destAddress + 256;
        } else if (_CurrentProgram.base == 512) {
          destAddress = destAddress + 512;
        }
        _MemoryManager.storeValue(this.Acc.toString(16), destAddress);
      } else if (opCode == "6D") {
        _IR = opCode;
        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;

        let address = parseInt(memAddress, 16);
        if (_CurrentProgram.base == 256) {
          address = address + 256;
        } else if (_CurrentProgram.base == 512) {
          address = address + 512;
        }
        let val = _MemoryManager.fetch(address);
        this.Acc = this.Acc + parseInt(val, 16);
        _Acc = this.Acc + parseInt(val, 16);
      } else if (opCode == "A2") {
        // Load the X resgister with a constant
        _IR = opCode;
        // Load the the next byte
        this.PC++;
        // let numVal = _MemoryManager.fetch(++this.PC);
        let numVal = _MemoryManager.fetch(++this.startIndex);
        this.Xreg = parseInt(numVal, 16);
        _Xreg = parseInt(numVal, 16);
      } else if (opCode == "AE") {
        _IR = opCode;
        //Load the X register from memory
        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;

        let address = parseInt(memAddress, 16);

        if (_CurrentProgram.base == 256) {
          address = address + 256;
        } else if (_CurrentProgram.base == 512) {
          address = address + 512;
        }

        let val = _MemoryManager.fetch(address);
        this.Xreg = parseInt(val, 16);
        _Xreg = parseInt(val, 16);
      } else if (opCode == "AC") {
        // Load Y register from memory
        _IR = opCode;
        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let address = parseInt(memAddress, 16);

        if (_CurrentProgram.base == 256) {
          address = address + 256;
        } else if (_CurrentProgram.base == 512) {
          address = address + 512;
        }

        let val = _MemoryManager.fetch(address);
        this.Yreg = parseInt(val, 16);
        _Yreg = parseInt(val, 16);
      } else if (opCode == "A0") {
        //Load Y register with a constant
        _IR = opCode;
        // Load the the next byte
        this.PC++;
        let numVal = _MemoryManager.fetch(++this.startIndex);
        this.Yreg = parseInt(numVal, 16);
        _Yreg = parseInt(numVal, 16);
      } else if (opCode == "EA") {
        _IR = opCode;
        // Do nothing
      } else if (opCode == "00") {
        _IR = opCode;
        _CurrentProgram.startIndex = this.startIndex;
        _CurrentProgram.PC = this.PC;
        _CurrentProgram.Acc = this.Acc;
        _CurrentProgram.Xreg = this.Xreg;
        _CurrentProgram.Yreg = this.Yreg;
        _CurrentProgram.Zflag = this.Zflag;
      } else if (opCode == "EC") {
        _IR = opCode;

        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;

        let address = parseInt(memAddress, 16);

        if (_CurrentProgram.base == 256) {
          address = address + 256;
        } else if (_CurrentProgram.base == 512) {
          address = address + 512;
        }
        // Possible bug here
        let val = _MemoryManager.fetch(address);
        let newVal = _MemoryManager.fetch(parseInt(memAddress, 16));
        let xVal = parseInt(val, 16);

        if (xVal == this.Xreg) {
          this.Zflag = 1;
          _Zflag = 1;
        } else {
          this.Zflag = 0;
          _Zflag = 0;
        }
      } else if (opCode == "D0") {
        _IR = opCode;

        // Check if Z flag branch bytes is zero
        if (this.Zflag == 0) {
          this.PC++;
          // Get branch
          let branch = parseInt(_MemoryManager.fetch(++this.startIndex), 16);

          //  Get next byte and branch
          let nextAddr = this.startIndex + branch;

          // if (nextAddr > _ProgramSize) {
          //   nextAddr = nextAddr - _ProgramSize;
          // }
          if (nextAddr >= _CurrentProgram.limit + 1) {
            nextAddr = nextAddr - _ProgramSize;
          }
          this.startIndex = nextAddr;

          if (_CurrentProgram.base == 0) {
            this.PC = nextAddr;
          } else if (_CurrentProgram.base == 256) {
            this.PC = nextAddr - 256;
          } else {
            this.PC = nextAddr - 512;
          }
        } else {
          this.startIndex++;
          this.PC++;
        }
      } else if (opCode == "EE") {
        _IR = opCode;
        // Increment byte value
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let address = parseInt(memAddress, 16);

        if (_CurrentProgram.base == 256) {
          address = address + 256;
        } else if (_CurrentProgram.base == 512) {
          address = address + 512;
        }

        let val = _MemoryArray[address];
        let newVal = parseInt(val, 16) + 1;
        if (address <= _CurrentProgram.limit) {
          val = newVal.toString(16);
        }
        _MemoryManager.storeValue(val, address);
      } else if (opCode == "FF") {
        _IR = opCode;

        _Kernel.krnInterruptHandler(SYSCALL_IRQ, this.Xreg);
      } else {
        // End program
        _StdOut.putText("[ERROR] Invalid OPCODE, not a valid program");
        _Kernel.krnInterruptHandler(INVALIDOPCODE_IRQ, _CurrentProgram.PID);
        _StdOut.advanceLine();
        _StdOut.putText(">");
      }
      this.PC++;
      this.startIndex++;
    }

    public cycle(): void {
      _Kernel.krnTrace("CPU cycle");
      // TODO: Accumulate CPU usage and profiling statistics here.
      // Do the real work here. Be sure to set this.isExecuting appropriately.

      if (_MemoryManager.fetch(this.startIndex) != "00" && _DONE != true) {
        this.programExecute(_MemoryManager.fetch(this.startIndex));
        _CurrentProgram.state = PS_RUNNING;

        //Increase turn around time for all programs in ready queue
        for (let i = 0; i < _ReadyQueue.length; i++) {
          _ReadyQueue[i].taTime++;
        }

        // Update memory table with current program
        _MemoryManager.updateMemTable(_CurrentProgram);
        // Update PCB table with current program
        _MemoryManager.updatePcbTable(_CurrentProgram);
        // Update CPU table
        _MemoryManager.updateCpuTable();

        // Perform round robbin if ready queue is greater than 0
        if (_ReadyQueue.length > 1 && _CpuSchedule != "priority") {
          CpuScheduler.roundRobin();
        }
      } else {
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
          CpuScheduler.roundRobin();

          if (_CpuSchedule == "rr" || _CpuSchedule == "fcfs") {
            CpuScheduler.roundRobin();
            _ClockTicks = 1;
          } else {
            if (_CurrentProgram.state == PS_TERMINATED) {
              for (let i = 0; i < _ReadyQueue.length; i++) {
                if (_ReadyQueue[i].PID == _CurrentProgram.PID) {
                  _ReadyQueue.splice(i, 1);

                  _MemoryManager.resetPartition(_CurrentProgram);
                  _MemoryManager.updateMemTable(_CurrentProgram);

                  _MemoryManager.deleteRowPcb(_CurrentProgram);
                  break;
                }
              }
            }
            this.isExecuting = true;
            CpuScheduler.priority();
          }

          if (
            _MemoryManager.fetch(this.startIndex) != "00" &&
            _CurrentProgram.state != PS_RUNNING
          ) {
            this.startIndex = _CurrentProgram.startIndex;
            _CurrentProgram.state = PS_RUNNING;
            this.isExecuting = true;
          }
          _ClockTicks = 1;
          this.cycle();
        } else {
          _ReadyQueue.splice(0, 1);
          _MemoryManager.resetPartition(_CurrentProgram);
          _MemoryManager.updateMemTable(_CurrentProgram);
          _MemoryManager.deleteRowPcb(_CurrentProgram);
          _StdOut.advanceLine();
          _StdOut.putText(">");

          this.init();
          _IR = "NA";
          _MemoryManager.updateCpuTable();
          _DONE = true;
        }
      }
    }
  }
}
