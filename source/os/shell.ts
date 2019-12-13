///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="pcb.ts" />
///<reference path="memoryManager.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
  export class Shell {
    // Properties
    public promptStr = "~VibraOS ";
    public commandList = [];
    public curses =
      "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    public apologies = "[sorry]";

    constructor() {}

    public init() {
      var sc: ShellCommand;
      //
      // Load the command list.

      // ver
      sc = new ShellCommand(
        this.shellVer,
        "ver",
        "- Displays the current version data."
      );
      this.commandList[this.commandList.length] = sc;

      // help
      sc = new ShellCommand(
        this.shellHelp,
        "help",
        "- This is the help command. Seek help."
      );
      this.commandList[this.commandList.length] = sc;

      // shutdown
      sc = new ShellCommand(
        this.shellShutdown,
        "shutdown",
        "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running."
      );
      this.commandList[this.commandList.length] = sc;

      // cls
      sc = new ShellCommand(
        this.shellCls,
        "cls",
        "- Clears the screen and resets the cursor position."
      );
      this.commandList[this.commandList.length] = sc;

      // man <topic>
      sc = new ShellCommand(
        this.shellMan,
        "man",
        "<topic> - Displays the MANual page for <topic>."
      );
      this.commandList[this.commandList.length] = sc;

      // trace <on | off>
      sc = new ShellCommand(
        this.shellTrace,
        "trace",
        "<on | off> - Turns the OS trace on or off."
      );
      this.commandList[this.commandList.length] = sc;

      // rot13 <string>
      sc = new ShellCommand(
        this.shellRot13,
        "rot13",
        "<string> - Does rot13 obfuscation on <string>."
      );
      this.commandList[this.commandList.length] = sc;

      // prompt <string>
      sc = new ShellCommand(
        this.shellPrompt,
        "prompt",
        "<string> - Sets the prompt."
      );
      this.commandList[this.commandList.length] = sc;

      // date
      sc = new ShellCommand(
        this.shellDate,
        "date",
        "- Displays the current date and time"
      );
      this.commandList[this.commandList.length] = sc;

      // whereami
      sc = new ShellCommand(
        this.shellLocation,
        "whereami",
        "- Displays users current location. Hint: Try the command multiple times"
      );
      this.commandList[this.commandList.length] = sc;

      // telljoke
      sc = new ShellCommand(
        this.shellJoke,
        "telljoke",
        "- Only programmers will smile"
      );
      this.commandList[this.commandList.length] = sc;

      // status <string>
      sc = new ShellCommand(
        this.shellStatus,
        "status",
        "<string> - Sets the status in the taskbar."
      );
      this.commandList[this.commandList.length] = sc;

      // nuke
      sc = new ShellCommand(
        this.shellCrash,
        "nuke",
        " - [WARNING] Crashes the entire OS."
      );
      this.commandList[this.commandList.length] = sc;

      // load
      sc = new ShellCommand(
        this.shellLoad,
        "load",
        "[<priority>] - Loads program with valid HEX from user program input"
      );
      this.commandList[this.commandList.length] = sc;
      // run
      sc = new ShellCommand(
        this.shellRun,
        "run",
        " <pid> - runs a valid process."
      );
      this.commandList[this.commandList.length] = sc;

      // clear mem
      sc = new ShellCommand(
        this.shellClearMem,
        "clearmem",
        " - Clears all memory partitions."
      );
      this.commandList[this.commandList.length] = sc;

      //run All
      sc = new ShellCommand(
        this.shellRunAll,
        "runall",
        " - Runs all loaded programs in memory."
      );
      this.commandList[this.commandList.length] = sc;

      //Quantum
      sc = new ShellCommand(
        this.shellQuantum,
        "quantum",
        "<int> - sets the quantum for round robin."
      );
      this.commandList[this.commandList.length] = sc;

      // ps  - list the running processes and their IDs
      sc = new ShellCommand(
        this.shellActivePids,
        "ps",
        "Displays all acive pids."
      );
      this.commandList[this.commandList.length] = sc;

      // kill <id> - kills the specified process id.
      sc = new ShellCommand(
        this.shellKill,
        "kill",
        "<pid> to kill a specific process."
      );
      this.commandList[this.commandList.length] = sc;

      //create file
      sc = new ShellCommand(
        this.shellCreateFile,
        "create",
        " <filename> - Creates a new file on disk."
      );
      this.commandList[this.commandList.length] = sc;

      // write to file
      sc = new ShellCommand(
        this.shellWriteFile,
        "write",
        ' <filename> "data" - writes data to the specified file name.'
      );
      this.commandList[this.commandList.length] = sc;

      // find file
      sc = new ShellCommand(
        this.shellReadFile,
        "read",
        " <filename> - reads and displays contents of a file name."
      );
      this.commandList[this.commandList.length] = sc;

      // format
      sc = new ShellCommand(
        this.shellFormat,
        "format",
        " - Initialize	all	blocks in all sectors in all tracks."
      );
      this.commandList[this.commandList.length] = sc;

      // List files
      sc = new ShellCommand(
        this.shellListFiles,
        "ls",
        "- List all files on disk."
      );
      this.commandList[this.commandList.length] = sc;

      //delete file
      sc = new ShellCommand(
        this.shellDeleteFile,
        "delete",
        " <filename> - Deletes a filename from storage."
      );
      this.commandList[this.commandList.length] = sc;

      // Set schedule
      sc = new ShellCommand(
        this.shellSetSchedule,
        "setschedule",
        " [rr, fcfs, priority] sets a CPU scheduling algorithm."
      );
      this.commandList[this.commandList.length] = sc;

      // Get schedule
      sc = new ShellCommand(
        this.shellGetSchedule,
        "getschedule",
        "gets the current CPU scheduling algorithm."
      );
      this.commandList[this.commandList.length] = sc;

      // Display the initial prompt.
      this.putPrompt();
    }

    public putPrompt() {
      _StdOut.putText(this.promptStr);
    }

    public handleInput(buffer) {
      _Kernel.krnTrace("Shell Command~" + buffer);
      //
      // Parse the input...
      //
      var userCommand = this.parseInput(buffer);
      // ... and assign the command and args to local variables.
      var cmd = userCommand.command;
      var args = userCommand.args;
      //
      // Determine the command and execute it.
      //
      // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
      // command list in attempt to find a match.
      // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
      var index: number = 0;
      var found: boolean = false;
      var fn = undefined;
      while (!found && index < this.commandList.length) {
        if (this.commandList[index].command === cmd) {
          found = true;
          fn = this.commandList[index].func;
        } else {
          ++index;
        }
      }
      if (found) {
        this.execute(fn, args); // Note that args is always supplied, though it might be empty.
      } else {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {
          // Check for curses.
          this.execute(this.shellCurse);
        } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
          // Check for apologies.
          this.execute(this.shellApology);
        } else {
          // It's just a bad command. {
          this.execute(this.shellInvalidCommand);
        }
      }
    }

    // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
    public execute(fn, args?) {
      // We just got a command, so advance the line...
      _StdOut.advanceLine();
      // ... call the command function passing in the args with some über-cool functional programming ...
      fn(args);
      // Check to see if we need to advance the line again
      if (_StdOut.currentXPosition > 0) {
        _StdOut.advanceLine();
      }
      // ... and finally write the prompt again.
      this.putPrompt();
    }

    public parseInput(buffer: string): UserCommand {
      var retVal = new UserCommand();

      // 1. Remove leading and trailing spaces.
      buffer = Utils.trim(buffer);

      // 2. Lower-case it.
      buffer = buffer.toLowerCase();

      // 3. Separate on spaces so we can determine the command and command-line args, if any.
      var tempList = buffer.split(" ");

      // 4. Take the first (zeroth) element and use that as the command.
      var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
      // 4.1 Remove any left-over spaces.
      cmd = Utils.trim(cmd);
      // 4.2 Record it in the return value.
      retVal.command = cmd;

      // 5. Now create the args array from what's left.
      for (var i in tempList) {
        var arg = Utils.trim(tempList[i]);
        if (arg != "") {
          retVal.args[retVal.args.length] = tempList[i];
        }
      }
      return retVal;
    }

    //
    // Shell Command Functions. Kinda not part of Shell() class exactly, but
    // called from here, so kept here to avoid violating the law of least astonishment.
    //
    public shellInvalidCommand() {
      _StdOut.putText("Invalid Command. ");
      if (_SarcasticMode) {
        _StdOut.putText("Unbelievable. You, [subject name here],");
        _StdOut.advanceLine();
        _StdOut.putText("must be the pride of [subject hometown here].");
      } else {
        _StdOut.putText("Type 'help' for, well... help.");
      }
    }

    public shellCurse() {
      _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
      _StdOut.advanceLine();
      _StdOut.putText("Bitch.");
      _SarcasticMode = true;
    }

    public shellApology() {
      if (_SarcasticMode) {
        _StdOut.putText("I think we can put our differences behind us.");
        _StdOut.advanceLine();
        _StdOut.putText("For science . . . You monster.");
        _SarcasticMode = false;
      } else {
        _StdOut.putText("For what?");
      }
    }

    // Although args is unused in some of these functions, it is always provided in the
    // actual parameter list when this function is called, so I feel like we need it.

    public shellVer(args: string[]) {
      _StdOut.putText(APP_NAME + " version " + APP_VERSION);
    }

    public shellHelp(args: string[]) {
      _StdOut.putText("Commands:");
      for (var i in _OsShell.commandList) {
        _StdOut.advanceLine();
        _StdOut.putText(
          "  " +
            _OsShell.commandList[i].command +
            " " +
            _OsShell.commandList[i].description
        );
      }
    }

    public shellShutdown(args: string[]) {
      _StdOut.putText("Shutting down...");
      // Call Kernel shutdown routine.
      _Kernel.krnShutdown();
      // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
    }

    public shellCls(args: string[]) {
      _StdOut.clearScreen();
      _StdOut.resetXY();
    }

    // Displays descriptive MANual page entries for shell commands
    public shellMan(args: string[]) {
      if (args.length > 0) {
        var topic = args[0];
        switch (topic) {
          // help
          case "help":
            _StdOut.putText(
              "Help displays a list of (hopefully) valid commands."
            );
            break;
          // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
          case "ver":
            _StdOut.putText("Displays the current version data.");
            break;
          case "shutdown":
            _StdOut.putText(
              "Shuts down the virtual OS but leaves the underlying host / hardware simulation running."
            );
            break;
          case "cls":
            _StdOut.putText(
              "Clears the screen and resets the cursor position."
            );
            break;
          case "man":
            _StdOut.putText("<topic> - Displays the MANual page for <topic>.");
            break;
          case "trace":
            _StdOut.putText("<on | off> - Turns the OS trace on or off.");
            break;
          case "rot13":
            _StdOut.putText("<string> - Does rot13 obfuscation on <string>.");
            break;
          case "prompt":
            _StdOut.putText("<string> - Sets the prompt.");
            break;
          case "date":
            _StdOut.putText("Displays the current date and time");
            break;
          case "whereami":
            _StdOut.putText(
              "Display users location. Hint: Try the command multiple times"
            );
            break;
          case "telljoke":
            _StdOut.putText("Only programmers will smile");
            break;
          case "status":
            _StdOut.putText("<string> - Sets the status in the taskbar");
            break;
          case "nuke":
            _StdOut.putText(" - [WARNING] Crashes the entire OS.");
            break;
          case "load":
            _StdOut.putText(
              "- Loads program to memory and sets priority of program if specified."
            );
            break;
          case "run":
            _StdOut.putText("Runs a valid process.");
            break;
          case "clearmem":
            _StdOut.putText("Clears all memory partitions");
            break;
          case "quantum":
            _StdOut.putText("Sets the quantum number for Round Robin");
            break;
          case "ps":
            _StdOut.putText("Displys all active pids");
            break;
          case "kill":
            _StdOut.putText("Kills a specified process");
            break;
          case "create":
            _StdOut.putText("Creates a new file on disk");
            break;
          case "write":
            _StdOut.putText("Writes data to a specified filename");
          case "read":
            _StdOut.putText("reads and displays contents of a filename");
            break;
          case "delete":
            _StdOut.putText("removes filename from storage");
            break;
          case "format":
            _StdOut.putText("Initialize	all	blocks in all sectors in all tracks");
            break;
          case "ls":
            _StdOut.putText(" - List all files on disk");
            break;
          case "setschedule":
            _StdOut.putText(" - Sets a CPU scheduling algorithm");
            break;
          case "getschedule":
            _StdOut.putText(" - Gets the current CPU scheduling algorithm");
            break;
          default:
            _StdOut.putText("No manual entry for " + args[0] + ".");
        }
      } else {
        _StdOut.putText("Usage: man <topic>  Please supply a topic.");
      }
    }

    public shellTrace(args: string[]) {
      if (args.length > 0) {
        var setting = args[0];
        switch (setting) {
          case "on":
            if (_Trace && _SarcasticMode) {
              _StdOut.putText("Trace is already on, doofus.");
            } else {
              _Trace = true;
              _StdOut.putText("Trace ON");
            }
            break;
          case "off":
            _Trace = false;
            _StdOut.putText("Trace OFF");
            break;
          default:
            _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
        }
      } else {
        _StdOut.putText("Usage: trace <on | off>");
      }
    }

    public shellRot13(args: string[]) {
      if (args.length > 0) {
        // Requires Utils.ts for rot13() function.
        _StdOut.putText(
          args.join(" ") + " = '" + Utils.rot13(args.join(" ")) + "'"
        );
      } else {
        _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
      }
    }

    public shellPrompt(args: string[]) {
      if (args.length > 0) {
        _OsShell.promptStr = args[0];
      } else {
        _StdOut.putText("Usage: prompt <string>  Please supply a string.");
      }
    }

    public shellDate(args: string[]) {
      let currentDate = new Date();
      _StdOut.putText(`${currentDate}`);
    }

    public shellLocation(args: string[]) {
      // Array of locations
      let location = [
        "...On a pale blue dot...",
        "...EARTH!...",
        "... On a lonely spec in a great envolping cosmic dark...",
        "...On a mote of dust suspended in a sunbeam...",
        '...The question is not "where you are?" but rather, where will you be going?...'
      ];
      // Generate random index
      let randomIndex = Math.floor(Math.random() * location.length);
      // Display location value
      _StdOut.putText(`${location[randomIndex]}`);
    }

    public shellJoke(arg: string[]) {
      // Array of jokes
      let jokes = [
        `A journalist asked a programmer: "What makes code bad?" Programmer: "No comment."
                `,
        `Documentation is like sex. When it's good , it's very good. When it is bad, it's better than nothing.
                `,
        `
                How real people play Russian roulette: bash-4.4$ [ $[ $RANDOM % 6] == 0] && rm -rf /* || echo *click*
                `,
        "I'd like to make the world a better place, but they won't give me the source code...",
        `Q: How many programmers does it take to screw in a light bulb? A: None. It's a hardware problem.`
      ];
      // Generate random index
      let randomIndex = Math.floor(Math.random() * jokes.length);
      // Display joke value
      _StdOut.putText(`${jokes[randomIndex]}`);
    }

    public shellStatus(args) {
      if (args.length > 0) {
        Control.hostSetStatus(args.join(" "));
      } else {
        _StdOut.putText("Usage: status <string>  Please supply a string.");
      }
    }

    public shellCrash(args) {
      // Clear console
      _StdOut.clearScreen();
      // Display system error message
      _StdOut.putText("[SYSTEM FAILURE] User initiated VibraOS system crash!");
      _StdOut.advanceLine();
      _StdOut.putText("Please reset the console...");
      // Display kernel error
      _Kernel.krnTrapError("User initiated OS error");
    }

    public shellLoad(args) {
      // Get user input
      _ProgramInput = (<HTMLInputElement>(
        document.getElementById("taProgramInput")
      )).value;
      // Declare hex code from user input
      let hexCode = _ProgramInput;
      // Declare new regex to check user input
      let regex = new RegExp("^[0-9A-Fa-f\\s]+$");
      // Check if hexCode matches regex
      if (hexCode.match(regex)) {
        _StdOut.putText("[SUCCESS] Valid hex. Program loaded");
        _Console.advanceLine();

        let programInput = _ProgramInput.replace(/[\s]/g, "");

        if (
          (args.length == 1 && args == parseInt(args, 10)) ||
          args.length == 0
        ) {
          if (args.length == 1) {
            _Priority = args;
          }

          let programLength = programInput.length / 2;
          if (programLength <= _ProgramSize) {
            if (_CPU.isExecuting != true) {
              // Add new memory instance
              _MemoryManager = new MemoryManager();

              // Load program to memory
              _MemoryManager.loadProgToMem();

              //  Check if current program base is not -1
              if (_CurrentProgram.base != -1) {
                // Update Memory Table with current program
                _MemoryManager.updateMemTable(_CurrentProgram);
              }
            } else {
              let newprog = new PCB();
              newprog = _CurrentProgram;
              _MemoryManager = new MemoryManager();
              // Load program to memory
              _MemoryManager.loadProgToMem();

              //  Check if current program base is not -1
              if (_CurrentProgram.base != -1) {
                // Update Memory Table with current program
                _MemoryManager.updateMemTable(_CurrentProgram);
              }

              _CurrentProgram = newprog;
            }
          } else {
            // Error if program is bigger than or equal to 256 bytes
            _StdOut.putText("Program too Large.. ");
          }
        } else {
          _StdOut.putText(
            "[ERROR] Invalid priority. Please enter valid priority"
          );
        }
      } else {
        _StdOut.putText("INVALID HEX");
        // Reset program input if not valid
        _ProgramInput = "";
      }
    }

    public shellRun(args) {
      //set Runall to false for running a specific program
      _DONE = false;
      _RunAll = false;
      _CPU.isExecuting = false;
      // Check if args is 0
      if (args.length == 0) {
        _StdOut.putText("Empty PID... Please enter a PID");
      } else {
        let pid = -1;
        let index = -1;

        let activeProg = new PCB();
        activeProg = _CurrentProgram;

        for (index = 0; index < _ResidentQueue.length; index++) {
          if (args == _ResidentQueue[index].PID) {
            pid = _ResidentQueue[index].PID;
            // Remove process from resident queue
            _CurrentProgram = _ResidentQueue[index];
            //  Set program state to ready
            _CurrentProgram.state = PS_READY;
            _ResidentQueue.splice(index, 1);

            // Add program to ready queue
            _ReadyQueue.push(_CurrentProgram);
            // Update PCB table with current program
            _MemoryManager.updatePcbTable(_CurrentProgram);
            break;
          }
        }

        // Swap current program with  program in memory if current program is on Hard Disk
        if (_CurrentProgram.location == "Hard Disk") {
          for (let i = 0; i < _ResidentQueue.length; i++) {
            if (_ResidentQueue[i].location == "Memory") {
              CpuScheduler.swapProgram(_ResidentQueue[i], _CurrentProgram);
              _ResidentQueue[i].location = "Hard Disk";
              _CurrentProgram.location = "Memory";
              _MemoryManager.updatePcbTable(_CurrentProgram);
              _MemoryManager.updatePcbTable(_ResidentQueue[i]);
              break;
            }
          }
        }

        if (_CurrentProgram.state == PS_READY) {
          _StdOut.putText(`Running PID ${pid}`);
          _RunOne = true;
          if (
            (<HTMLButtonElement>document.getElementById("singleStep")).value ==
            "Exit"
          ) {
            _CPU.cycle();
          } else {
            if (_ReadyQueue.length > 1) {
              _CurrentProgram = activeProg;
              _ClockTicks++;
              _RunOne = false;
              _RunAll = true;
              _CPU.isExecuting = true;
            } else {
              // Base to start running program
              _RunOne = true;
              _CPU.init();
              _CPU.startIndex = _CurrentProgram.startIndex;
              _CPU.isExecuting = true;
            }
          }
        } else if (pid == -1) {
          pid = args;
          _StdOut.putText(
            `PID ${pid} does not exist... please enter a valid pid to run program`
          );
        } else {
          _StdOut.putText(
            `PID ${pid} is terminated. You cannot run this process`
          );
        }
      }
    }
    public shellClearMem(args) {
      // Clear memory and update memory log
      // _BASE = 0;
      _BaseProgram = 0;
      _ResidentQueue = [];
      _ReadyQueue = [];
      _RowNum = 0;
      _Memory.init();
      _MemoryManager.clearMemLog();
      _StdOut.putText("[SUCCESS] Memory cleared.");
      _StdOut.advanceLine();

      // Clear pcb log
      let pcbTable: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("pcbTabDisplay")
      );
      let rows = pcbTable.getElementsByTagName("tr");
      //Clear pcb table
      while (rows.length > 1) {
        pcbTable.deleteRow(1);
      }
    }

    public shellRunAll(args) {
      _RunAll = true;
      _DONE = false;
      _ClockTicks = 0;
      // Check if resident queue is empty
      if (_ResidentQueue.length > 0) {
        let resLength = _ResidentQueue.length;
        //   Run programs in resident queue
        for (let i = resLength; i > 0; i--) {
          // Remove process from resident queue and push it to ready queue
          _ResidentQueue[0].state = PS_READY;
          _CurrentProgram = _ResidentQueue[0];
          _ResidentQueue.splice(0, 1);

          // Add to PCB
          _ReadyQueue.push(_CurrentProgram);

          //Update PCB Table
          _MemoryManager.updatePcbTable(_CurrentProgram);
        }

        _CurrentProgram = _ReadyQueue[0];

        if (_CpuSchedule == "priority") {
          CpuScheduler.priority();
        }
        _CPU.startIndex = _CurrentProgram.base;

        if (_CurrentProgram.state != PS_TERMINATED) {
          _StdOut.putText(`Running all Programs...`);
          if (
            (<HTMLButtonElement>document.getElementById("singleStep")).value ==
            "Exit"
          ) {
            _ClockTicks++;
            _CPU.cycle();
          } else {
            _CPU.init();
            _ClockTicks++;
            _CPU.isExecuting = true;
          }
        }
      } else {
        _StdOut.putText(
          "No loaded programs to run. Please load a program to run."
        );
      }
    }

    public shellQuantum(args) {
      if (_CpuSchedule == "fcfs") {
        // Do not allow user to change quantum number if current scheduling is fcfs
        _StdOut.putText("[ERROR]: Cannot set quantum at fcfs CPU schedule");
      } else {
        //Sets quantum number for round robin
        if (args == parseInt(args, 10)) {
          _Quantum = args;
        } else {
          _StdOut.putText("Please enter an integer");
        }
      }
    }

    public shellActivePids(args) {
      if (_ReadyQueue.length != 0) {
        for (let i = 0; i < _ReadyQueue.length; i++) {
          _StdOut.putText(`Active PID : ${_ReadyQueue[i].PID}`);
          _StdOut.advanceLine();
        }
      } else {
        _StdOut.putText("There are no active pids");
      }
    }
    public shellKill(args) {
      _CPU.isExecuting = false;
      let pid = -1;
      if (args.length == 0) {
        _StdOut.putText("Empty PID... Please enter PID");
      } else {
        if (_ReadyQueue.length == 0) {
          _StdOut.putText("There are no active PIDs to Kill");
        } else {
          for (let i = 0; i < _ReadyQueue.length; i++) {
            if (args == _ReadyQueue[i].PID) {
              pid = _ReadyQueue[i].PID;
              let deadProg = new PCB();

              // Remove process from ready queue
              if (_ReadyQueue.length > 1) {
                deadProg = _ReadyQueue[i];
                deadProg.state = PS_TERMINATED;

                if (i == _ReadyQueue.length - 1) {
                  _CurrentProgram = _ReadyQueue[0];
                } else {
                  _CurrentProgram = _ReadyQueue[i + 1];
                }

                _ReadyQueue.splice(i, 1);
                _CPU.startIndex = _CurrentProgram.startIndex;
                _CPU.isExecuting = true;
              } else {
                deadProg = _ReadyQueue[i];
                deadProg.state = PS_TERMINATED;
                _ReadyQueue.splice(i, 1);

                _CPU.init();
                _IR = "NA";
                _MemoryManager.updateCpuTable();
              }
              // Reset memory at partition
              _MemoryManager.resetPartition(deadProg);
              // Update memory table
              _MemoryManager.updateMemTable(deadProg);
              // Update PCB table
              _MemoryManager.deleteRowPcb(deadProg);
              break;
            }
          }
        }
        if (pid == -1) {
          _StdOut.putText(
            "[ERROR] INVALID PID! The pid you entered is not active"
          );
          // Run other programs in the ready queue
          if (_ReadyQueue.length > 0) {
            _CPU.isExecuting = true;
          }
        }
      }
    }

    // Create file
    public shellCreateFile(args) {
      let str = args + "";
      // Check if file name is same as program/process on hard disk
      if (str.match(/process\d+/)) {
        _StdOut.putText(
          "[ERROR]: File in use by OS. Use a different file name"
        );
        _StdOut.advanceLine();
      }
      // Check if filename is given
      else if (args.length == 0) {
        _StdOut.putText(
          "[ERROR]: Empty file name. Please specify the name of file"
        );
        _StdOut.advanceLine();
      } else if (args.length > 1) {
        // Check if there's spaces in file name
        _StdOut.putText(
          "[ERROR]: Spaces in file name. Filename cannot contain spaces"
        );
        _StdOut.advanceLine();
      } else {
        // Create file if checks pass
        let fileName = args + "";
        _DeviceDriverFileSystem.createFile(fileName);
        console.log(`${fileName} from Shell`);
      }
    }

    //  Write to file
    public shellWriteFile(args) {
      // Handle spaces enterred in data
      let dataString = "";

      for (let i = 1; i < args.length; i++) {
        if (i == args.length - 1) {
          dataString = dataString + args[i];
        } else {
          dataString = dataString + args[i] + " ";
        }
      }

      if (args.length < 2) {
        // Error if no create command is missing an operand
        _StdOut.putText("[ERROR]: Missing operand(s)!");
        _StdOut.advanceLine();
        _StdOut.putText(
          "Please specify name of file or the data you want to write"
        );
      } else if (
        dataString[0] != `"` ||
        dataString[dataString.length - 1] != `"`
      ) {
        // Error if data is incorrectly entered
        _StdOut.putText("[ERROR]: Missing quotes!");
        _StdOut.advanceLine();
        _StdOut.putText(`Correct syntax: write <filename> "data"`);
      } else {
        let fileName = args[0];
        // Remove beginning and ending commas from data enterred
        let contents = dataString.slice(1, -1);
        _DeviceDriverFileSystem.writeToFile(fileName, contents);
        console.log(fileName, contents);
      }
    }

    //  Read file
    public shellReadFile(args) {
      if (args.length == 0) {
        _StdOut.putText("[ERROR]: Empty file name");
        _StdOut.advanceLine();
        _StdOut.putText("Please specify name of file");
      } else {
        // Proceed to read file
        var fileName: string = args + "";
        _DeviceDriverFileSystem.readFile(fileName);
      }
    }
    public shellDeleteFile(args) {
      if (args.length == 0) {
        _StdOut.putText("[ERROR] Cannot delete file. Empty file name");
        _StdOut.advanceLine();
        _StdOut.putText("Please specify name of file");
      } else {
        // Proceed to delete file
        var fileName: string = args + "";
        _DeviceDriverFileSystem.deleteFile(fileName);
      }
    }

    // Format
    public shellFormat(args) {
      _FormatCommandActive = true;

      if (!_ReadyQueue) {
        _StdOut.putText("[ERROR] Cannot format. Empty disk");
      } else {
        _DeviceDriverFileSystem.format();
      }
    }

    // List files
    public shellListFiles(args) {
      _DeviceDriverFileSystem.listFiles();
    }

    // Sets Schedule
    public shellSetSchedule(args) {
      if (args.length > 1) {
        _StdOut.putText("[ERROR]: Too many operands");
        _StdOut.putText(
          "Correct command is -- setschedule [rr, fcfs, priority]"
        );
      } else if (args == "rr") {
        _CpuSchedule = args;
        _Quantum = 6;
      } else if (args == "fcfs") {
        _CpuSchedule = args;
        _Quantum = Number.MAX_VALUE;
      } else if (args == "priority") {
        _CpuSchedule = args;
      } else {
        _StdOut.putText("[ERROR] Invalid scheduling input");
        _StdOut.putText(`Available scheduling are "rr", "fcfs" and "priority"`);
      }
    }
    // Get Schedule
    public shellGetSchedule(args) {
      _StdOut.putText(`Current CPU scheduling is ${_CpuSchedule}`);
    }
  }
}
