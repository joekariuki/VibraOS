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
      // this.startIndex = _BaseProgram;
      this.PC = 0;
      this.IR = _IR;
      this.Acc = 0;
      this.Xreg = 0;
      this.Yreg = 0;
      this.Zflag = 0;
      this.isExecuting = false;
    }

    // public loadAcc() {
    //   //Load the accumulator with constant

    //   //Get Next byte from memory
    //   let memAddress = _MemoryManager.fetch(++this.PC);

    //   //convert constant from hex to base 10 and set it to accumulator
    //   this.Acc = parseInt(memAddress, 16);
    //   _Acc = this.Acc;
    // }

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
        let getAcc = _MemoryManager.fetch(parseInt(memAddress, 16));
        this.Acc = parseInt(getAcc, 16);
      } else if (opCode == "8D") {
        //Store accumulator in memory
        _IR = opCode;
        // Load the the next two bytes
        this.PC += 2;

        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let destAddress = parseInt(memAddress, 16);
        if (destAddress <= _CurrentProgram.limit) {
          _MemoryArray[destAddress] = this.Acc.toString(16);
        }
      } else if (opCode == "A2") {
        // Load the X resgister with a constant
        _IR = opCode;
        // Load the the next byte
        // this.PC++;
        let numVal = _MemoryManager.fetch(++this.PC);
        this.Xreg = parseInt(numVal, 16);
        _Xreg = parseInt(numVal, 16);
      } else if (opCode == "6D") {
        //Add with carry
        _IR = opCode;
        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let val = _MemoryManager.fetch(parseInt(memAddress, 16));
        this.Acc = this.Acc + parseInt(val, 16);
        _Acc = this.Acc + parseInt(val, 16);
      } else if (opCode == "AE") {
        _IR = opCode;
        //Load the X register from memory
        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;

        let val = _MemoryManager.fetch(parseInt(memAddress, 16));
        this.Xreg = parseInt(val, 16);
        _Xreg = parseInt(val, 16);
      } else if (opCode == "AC") {
        // Load Y register from memory
        _IR = opCode;
        // Load the the next two bytes
        this.PC += 2;
        let memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;
        let val = _MemoryManager.fetch(parseInt(memAddress, 16));

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
        // Do nothing
        _IR = opCode;
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
        var memAddress = _MemoryManager.fetch(++this.startIndex);
        memAddress = _MemoryManager.fetch(++this.startIndex) + memAddress;

        let val = _MemoryManager.fetch(parseInt(memAddress, 16));
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

          if (nextAddr > _ProgramSize) {
            nextAddr = nextAddr - _ProgramSize;
          }
          this.startIndex = nextAddr;
          this.PC = nextAddr;
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

        // let val = _MemoryManager.fetch(address);
        let val = _MemoryArray[address];
        // _MemoryArray[address] = (parseInt(val, 16) + 1).toString(16);
        let newVal = parseInt(val, 16) + 1;
        if (address <= _CurrentProgram.limit) {
          val = newVal.toString(16);
        }
      } else if (opCode == "FF") {
        _IR = opCode;

        if (this.Xreg == 1) {
          _StdOut.putText(_CPU.Yreg.toString());
        } else if (this.Xreg == 2) {
          let str = "";
          let currAddr = _CPU.Yreg;
          while (_MemoryManager.fetch(currAddr) !== "00") {
            let charAsc = parseInt(_MemoryManager.fetch(currAddr), 16);
            str += String.fromCharCode(charAsc);
            currAddr++;
          }
          _StdOut.putText(str);
        }
      } else {
        // End program
        _StdOut.putText("[ERROR] Invalid OPCODE, not a valid program");
      }
      this.startIndex++;
      this.PC++;
    }

    public roundRobin() {
      if (_CurrentProgram.state != PS_TERMINATED) {
        if (_ClockTicks < _Quantum) {
          _ClockTicks++;
        } else {
          //set clockTicks to 1
          _ClockTicks = 1;
          this.contextSwitch();
        }
      } else {
        this.contextSwitch();
      }
    }

    //Context switch
    public contextSwitch() {
      //break and save all instances of current program
      var nextProgram = new PCB();
      nextProgram = this.getNextprogram();

      if (_CurrentProgram.state == PS_TERMINATED) {
        if (_ReadyQueue.length == 1) {
          _ReadyQueue.splice(0, 1);
          _MemoryManager.deleteRowPcb(_CurrentProgram);

          this.init();
          _MemoryManager.updateCpuTable();
          _DONE = true;
        } else if (_ReadyQueue.length > 1) {
          _CurrentProgram.state = PS_TERMINATED;
          _MemoryManager.updatePcbTable(_CurrentProgram);

          for (var i = 0; i < _ReadyQueue.length; i++) {
            if (_ReadyQueue[i].PID == _CurrentProgram.PID) {
              _ReadyQueue.splice(i, 1);
              _MemoryManager.deleteRowPcb(_CurrentProgram);
              break;
            }
          }

          nextProgram.state = PS_READY;
          _MemoryManager.updatePcbTable(nextProgram);
        }
      } else {
        _CurrentProgram.startIndex = this.startIndex;
        _CurrentProgram.PC = this.PC;
        _CurrentProgram.Acc = this.Acc;
        _CurrentProgram.Xreg = this.Xreg;
        _CurrentProgram.Yreg = this.Yreg;
        _CurrentProgram.Zflag = this.Zflag;
        _CurrentProgram.state = PS_READY;
        _MemoryManager.updatePcbTable(_CurrentProgram);
      }

      //Load all instances of next program
      _CurrentProgram = nextProgram;
      this.startIndex = _CurrentProgram.startIndex;
      this.PC = _CurrentProgram.PC;
      this.Acc = _CurrentProgram.Acc;
      this.Xreg = _CurrentProgram.Xreg;
      this.Yreg = _CurrentProgram.Yreg;
      this.Zflag = _CurrentProgram.Zflag;

      //this.startIndex = _CurrentProgram.startIndex;
      //if (_MemoryManager.fetch(this.startIndex) != "00") {
      //   _CurrentProgram.state = PS_Running;
      //_IR = "NA"
      //this.cycle();
      //}
    }
    public getNextprogram() {
      var nextProgram = new PCB();

      if (_ReadyQueue.length == 1) {
        if (_MemoryManager.fetch(this.startIndex) != "00") {
          nextProgram = _CurrentProgram;
        } else {
          nextProgram.IR = "NA";
          nextProgram.startIndex = this.startIndex;
        }
      } else {
        for (var i = 0; i < _ReadyQueue.length; i++) {
          //Get next program in queue
          if (_CurrentProgram.PID == _ReadyQueue[i].PID) {
            //set next program to the program in the begining of the queue if the last program in queue is curreent
            if (i == _ReadyQueue.length - 1) {
              nextProgram = _ReadyQueue[0];
            } else {
              nextProgram = _ReadyQueue[i + 1];
            }
            break;
          }
        }
      }

      return nextProgram;
    }

    public cycle(): void {
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
          this.roundRobin();
        }
      } else {
        // Update CPU execution
        this.isExecuting = false;
        // Update index for programs
        // _BaseProgram = _BaseProgram + 256;
        // Set program state to terminated
        _CurrentProgram.state = PS_TERMINATED;
        // Update PCB table with current program
        _MemoryManager.updatePcbTable(_CurrentProgram);

        if ((_RunAll == true && _DONE != true) || _ReadyQueue.length > 1) {
          this.roundRobin();
          this.startIndex = _CurrentProgram.startIndex;

          if (_ReadyQueue.lemgth == 0) {
            this.isExecuting = false;
          } else {
            if (
              _MemoryManager.fetch(this.startIndex) != "00" &&
              _CurrentProgram.state != PS_RUNNING
            ) {
              _CurrentProgram.state = PS_RUNNING;
              this.isExecuting = true;
            }
            _ClockTicks = 1;
          }
          this.cycle();
        } else {
          //remove the only program from ready queue
          for (var i = 0; i < _ReadyQueue.length; i++) {
            if (
              _ReadyQueue[i].PID == _CurrentProgram.PID &&
              _ReadyQueue[i].state == PS_TERMINATED
            ) {
              _ReadyQueue.splice(i, 1);

              _MemoryManager.deleteRowPcb(_CurrentProgram);
              break;
            }
          }
        }
      }
    }
  }
}
