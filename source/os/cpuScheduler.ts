///<reference path="../globals.ts" />
///<reference path="../os/pcb.ts" />

module TSOS {
  export class CpuScheduler {
    constructor() {}
    public static roundRobin() {
      let nextProgram = new PCB();

      if (_CurrentProgram.state != PS_TERMINATED) {
        if (_ClockTicks < _Quantum) {
          _ClockTicks++;
          // Increase waitime
          _WaitTime++;
        } else {
          //set current's program's time
          nextProgram = this.getNextprogram();
          nextProgram.waitTime = _CurrentProgram.waitTime + _WaitTime;
          _MemoryManager.updatePcbTable(nextProgram);

          this.contextSwitch();

          //set clockTicks to 1
          _ClockTicks = 1;
          //Reset wait time
          _WaitTime = 1;
        }
      } else {
        // Set current's program's time
        nextProgram = this.getNextprogram();
        nextProgram.waitTime = _CurrentProgram.waitTime + _WaitTime;
        _MemoryManager.updatePcbTable(nextProgram);

        this.contextSwitch();

        // Reset wait time
        _WaitTime = 1;
      }
    }

    public static contextSwitch() {
      let nextProgram = new PCB();
      nextProgram = this.getNextprogram();

      if (_CurrentProgram.state == PS_TERMINATED) {
        if (_ReadyQueue.length == 1) {
          _RunAll = false;
          _DONE = true;
        } else if (_ReadyQueue.length > 1) {
          _CurrentProgram.state = PS_TERMINATED;
          _MemoryManager.updatePcbTable(_CurrentProgram);

          for (let i = 0; i < _ReadyQueue.length; i++) {
            if (_ReadyQueue[i].PID == _CurrentProgram.PID) {
              _ReadyQueue.splice(i, 1);

              _MemoryManager.resetPartition(_CurrentProgram);
              _MemoryManager.updateMemTable(_CurrentProgram);

              _MemoryManager.deleteRowPcb(_CurrentProgram);
              break;
            }
          }
          if (nextProgram.location == "Hard Disk") {
            if (nextProgram.base == -1) {
              nextProgram.startIndex = _CurrentProgram.base;
            } else {
              //Get  start index for the next program in segment
              nextProgram.startIndex =
                nextProgram.startIndex -
                nextProgram.base +
                _CurrentProgram.base;
            }

            // Get base and limit for next program
            nextProgram.base = _CurrentProgram.base;
            nextProgram.limit = _CurrentProgram.limit;

            _IsProgramName = true;
            this.rollin(nextProgram);
            _IsProgramName = false;
            nextProgram.location = "Memory";
          }

          nextProgram.state = PS_READY;
          _MemoryManager.updatePcbTable(nextProgram);

          // Execute format command
          if (_FormatCommandActive == true) {
            _DeviceDriverFileSystem.format();
          }
        }
      } else {
        if (nextProgram.location == "Hard Disk") {
          this.swapProgram(_CurrentProgram, nextProgram);
          _CurrentProgram.location = "Hard Disk";
          nextProgram.location = "Memory";
          _MemoryManager.updatePcbTable(_CurrentProgram);
        }
        //Break and save all cpu values to current program
        _Kernel.krnInterruptHandler(BREAK_IRQ, "");
      }

      // Load next program
      _CurrentProgram = nextProgram;
      _CPU.startIndex = _CurrentProgram.startIndex;
      _CPU.PC = _CurrentProgram.PC;
      _CPU.Acc = _CurrentProgram.Acc;
      _CPU.Xreg = _CurrentProgram.Xreg;
      _CPU.Yreg = _CurrentProgram.Yreg;
      _CPU.Zflag = _CurrentProgram.Zflag;
    }

    public static priority() {
      let nextProgram = this.priorityNextProgram();

      if (nextProgram.location == "Hard Disk") {
        if (_CurrentProgram.state == PS_TERMINATED) {
          _IsProgramName = true;
          if (nextProgram.base == -1) {
            nextProgram.startIndex = _CurrentProgram.base;
          } else {
            //Get start index for the next program in particular segment
            nextProgram.startIndex =
              nextProgram.startIndex - nextProgram.base + _CurrentProgram.base;
          }

          nextProgram.base = _CurrentProgram.base;
          nextProgram.limit = _CurrentProgram.limit;

          this.rollin(nextProgram);

          nextProgram.location = "Memory";
        } else {
          this.swapProgram(_CurrentProgram, nextProgram);
          _CurrentProgram.location = "Hard Disk";
          nextProgram.location = "Memory";
          _MemoryManager.updatePcbTable(_CurrentProgram);
        }
      }

      _CurrentProgram = nextProgram;
      //update pcb table for the new rolled-in program
      _MemoryManager.updatePcbTable(_CurrentProgram);

      // Load next program
      _CPU.startIndex = _CurrentProgram.startIndex;
      _CPU.PC = _CurrentProgram.PC;
      _CPU.Acc = _CurrentProgram.Acc;
      _CPU.Xreg = _CurrentProgram.Xreg;
      _CPU.Yreg = _CurrentProgram.Yreg;
      _CPU.Zflag = _CurrentProgram.Zflag;

      if (_ReadyQueue.length == 1) {
        _RunAll = false;
      }
    }

    public static priorityNextProgram() {
      let lowestPriority = _ReadyQueue[0].priority;
      let nextProgram = _ReadyQueue[0];
      for (let i = 1; i < _ReadyQueue.length; i++) {
        if (_ReadyQueue[i].priority < lowestPriority) {
          lowestPriority = _ReadyQueue[i].priority;
          nextProgram = _ReadyQueue[i];
        }
      }

      return nextProgram;
    }

    // Roll out program from memory to hard drive
    public static rollout(program) {
      let programInput: string = "";

      for (let i = program.base; i <= program.limit; i++) {
        programInput += _MemoryArray[i];
      }

      _DeviceDriverFileSystem.createFile("Process" + program.PID);
      _DeviceDriverFileSystem.writeToFile(
        "Process" + program.PID,
        programInput
      );
      _CurrentProgram.location = "Hard Disk";

      _MemoryManager.resetPartition(program);

      // Log roll out process
      _Kernel.krnTrace(`${program.PID} - Rolled out "`);
    }

    // Roll in  program from hard drive
    public static rollin(program) {
      let programInput = _DeviceDriverFileSystem.readFile(
        `Process ${program.PID}`
      );

      let j = program.base;
      for (let i = 0; i < programInput.length; i++) {
        _MemoryArray[j] = programInput[i] + programInput[i + 1];
        j++;
        i++;
      }
      _MemoryManager.updateMemTable(program);

      _DeviceDriverFileSystem.deleteFile(`Process ${program.PID}`);

      // Log roll in process
      _Kernel.krnTrace(`${program.PID} - Rolled in`);
    }

    // Swap out process and place it on
    public static swapProgram(currProg, nextProg) {
      if (nextProg.base == -1) {
        nextProg.startIndex = currProg.base;
      } else {
        // Get current start index in a particular segment
        nextProg.startIndex =
          nextProg.startIndex - nextProg.base + currProg.base;
      }

      nextProg.base = currProg.base;
      nextProg.limit = currProg.limit;

      if (currProg.state != PS_TERMINATED) {
        this.rollout(currProg);
      }

      this.rollin(nextProg);
      _Kernel.krnTrace(
        `Swapping ${currProg.PID} out of memory and ${nextProg.PID} into memory`
      );
    }

    // Get next program in memory
    public static getNextprogram() {
      let nextProgram = new PCB();

      if (_ReadyQueue.length == 1) {
        if (_MemoryManager.fetch(_CPU.startIndex) != "00") {
          nextProgram = _CurrentProgram;
          _RunAll = false;
          _DONE = true;
        }
      } else {
        for (let i = 0; i < _ReadyQueue.length; i++) {
          // Get next program in queue
          if (_CurrentProgram.PID == _ReadyQueue[i].PID) {
            // Set next program to the program in the begining of the queue if the
            if (i == _ReadyQueue.length - 1) {
              nextProgram = _ReadyQueue[0];
              _WaitTime = 0;
            } else {
              nextProgram = _ReadyQueue[i + 1];
            }
            break;
          }
        }
      }
      return nextProgram;
    }
  }
}
