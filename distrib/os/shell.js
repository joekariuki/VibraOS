/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = "~VibraOS ";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellLocation, "whereami", "- Displays users current location. Hint: Try the command multiple times");
            this.commandList[this.commandList.length] = sc;
            // telljoke
            sc = new TSOS.ShellCommand(this.shellJoke, "telljoke", "- Only programmers will smile");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status in the taskbar.");
            this.commandList[this.commandList.length] = sc;
            // nuke
            sc = new TSOS.ShellCommand(this.shellCrash, "nuke", " - [WARNING] Crashes the entire OS.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<HEX>- Loads program with valid HEX from user program input");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", " <pid> - runs a valid process.");
            this.commandList[this.commandList.length] = sc;
            // clear mem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", " - Clears all memory partitions.");
            this.commandList[this.commandList.length] = sc;
            //run All
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", " - Runs all loaded programs in memory.");
            this.commandList[this.commandList.length] = sc;
            //Quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - sets the quantum for round robin.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
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
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    // Check for apologies.
                    this.execute(this.shellApology);
                }
                else {
                    // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
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
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        // Although args is unused in some of these functions, it is always provided in the
        // actual parameter list when this function is called, so I feel like we need it.
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " +
                    _OsShell.commandList[i].command +
                    " " +
                    _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        // Displays descriptive MANual page entries for shell commands
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    // help
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("Displays the current version data.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
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
                        _StdOut.putText("Display users location. Hint: Try the command multiple times");
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
                        _StdOut.putText("<HEX>- Loads program with valid HEX from user program input");
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
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(" ") + " = '" + TSOS.Utils.rot13(args.join(" ")) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            var currentDate = new Date();
            _StdOut.putText("" + currentDate);
        };
        Shell.prototype.shellLocation = function (args) {
            // Array of locations
            var location = [
                "...On a pale blue dot...",
                "...EARTH!...",
                "... On a lonely spec in a great envolping cosmic dark...",
                "...On a mote of dust suspended in a sunbeam...",
                '...The question is not "where you are?" but rather, where will you be going?...'
            ];
            // Generate random index
            var randomIndex = Math.floor(Math.random() * location.length);
            // Display location value
            _StdOut.putText("" + location[randomIndex]);
        };
        Shell.prototype.shellJoke = function (arg) {
            // Array of jokes
            var jokes = [
                "A journalist asked a programmer: \"What makes code bad?\" Programmer: \"No comment.\"\n                ",
                "Documentation is like sex. When it's good , it's very good. When it is bad, it's better than nothing.\n                ",
                "\n                How real people play Russian roulette: bash-4.4$ [ $[ $RANDOM % 6] == 0] && rm -rf /* || echo *click*\n                ",
                "I'd like to make the world a better place, but they won't give me the source code...",
                "Q: How many programmers does it take to screw in a light bulb? A: None. It's a hardware problem."
            ];
            // Generate random index
            var randomIndex = Math.floor(Math.random() * jokes.length);
            // Display joke value
            _StdOut.putText("" + jokes[randomIndex]);
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                TSOS.Control.hostSetStatus(args.join(" "));
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellCrash = function (args) {
            // Clear console
            _StdOut.clearScreen();
            // Display system error message
            _StdOut.putText("[SYSTEM FAILURE] User initiated VibraOS system crash!");
            _StdOut.advanceLine();
            _StdOut.putText("Please reset the console...");
            // Display kernel error
            _Kernel.krnTrapError("User initiated OS error");
        };
        Shell.prototype.shellLoad = function (args) {
            // Get user input
            _ProgramInput = (document.getElementById("taProgramInput")).value;
            // Declare hex code from user input
            var hexCode = _ProgramInput;
            // Declare new regex to check user input
            var regex = new RegExp("^[0-9A-Fa-f\\s]+$");
            // Check if hexCode matches regex
            if (hexCode.match(regex)) {
                _StdOut.putText("[SUCCESS] Valid hex. Program loaded");
                _Console.advanceLine();
                var programInput = _ProgramInput.replace(/[\s]/g, "");
                if (programInput.length / 2 < 256 && _MemoryArray[_BASE] == "00") {
                    // Add new memory instance
                    _MemoryManager = new TSOS.MemoryManager();
                    //load program to memory
                    // Update Memory Table with current program
                    _MemoryManager.updateMemTable();
                }
                else {
                    // Error if program is bigger than or equal to 256 bytes
                    _StdOut.putText("Program too Large.. ");
                }
            }
            else {
                _StdOut.putText("[ERROR] Invalid hex. Only characters are 0-9, a-z, and A-z are valid!");
                // Reset program input if not valid
                _ProgramInput = "";
            }
        };
        Shell.prototype.shellRun = function (args) {
            //set Runall to false for running a specific program
            _RunAll = false;
            // Check if args is 0
            if (args.length == 0) {
                _StdOut.putText("Empty PID... Please enter a PID");
            }
            else {
                var pid = -1;
                var index = -1;
                for (index = 0; index < _ResidentQueue.length; index++) {
                    if (args == _ResidentQueue[index].PID) {
                        pid = _ResidentQueue[index].PID;
                        // Set process to ready
                        _ResidentQueue[index].state = PS_READY;
                        _CurrentProgram = _ResidentQueue[index];
                        _ResidentQueue.splice(index, 1);
                        // Add program to ready queue
                        _ReadyQueue.push(_CurrentProgram);
                        // Update PCB table with current program
                        _MemoryManager.updatePcbTable(_CurrentProgram);
                        break;
                    }
                }
                if (_CurrentProgram.state != PS_TERMINATED) {
                    _StdOut.putText("Running PID " + pid);
                    if (document.getElementById("singleStep")
                        .disabled == true) {
                        // Run CPU cylce
                        _CPU.cycle();
                    }
                    else {
                        // Initialize CPU
                        _CPU.init();
                        // Update CPU execution
                        _CPU.isExecuting = true;
                    }
                }
                else {
                    _StdOut.putText("PID " + pid + " is terminated. You cannot run this process");
                }
            }
        };
        Shell.prototype.shellClearMem = function (args) {
            // Clear memory and update memory log
            _BASE = 0;
            _BaseProgram = 0;
            _ResidentQueue = [];
            _ReadyQueue = [];
            _RowNum = 0;
            _Memory.init();
            _MemoryManager.clearMemLog();
            _StdOut.putText("[SUCCESS] Memory cleared.");
            _StdOut.advanceLine();
        };
        Shell.prototype.shellRunAll = function (args) {
            _RunAll = true;
            // Check if resident queue is empty
            if (_ResidentQueue.length > 0) {
                var resLength = _ResidentQueue.length;
                //   Run programs in resident queue
                for (var i = resLength; i > 0; i--) {
                    // Remove process from resident queue and push it to ready queue
                    _ResidentQueue[0].state = PS_READY;
                    _CurrentProgram = _ResidentQueue[0];
                    _ResidentQueue.splice(0, 1);
                    // Add to PCB
                    _ReadyQueue.push(_CurrentProgram);
                    //Update PCB Table
                    _MemoryManager.updatePcbTable(_CurrentProgram);
                    _CurrentProgram = _ReadyQueue[0];
                    // _CurrentProgram.state = PS_READY;
                    // _ReadyQueue.push(_CurrentProgram);
                    // _MemoryManager.updatePcbTable(_CurrentProgram);
                }
                if (_CurrentProgram.state != PS_TERMINATED) {
                    _StdOut.putText("Running PID: " + _CurrentProgram.PID);
                    if (document.getElementById("singleStep")
                        .disabled == true) {
                        _CPU.cycle();
                    }
                    else {
                        _CPU.init();
                        _CPU.isExecuting = true;
                    }
                }
            }
            else {
                _StdOut.putText("No loaded programs to run. Please load a program to run.");
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            //Sets quantum number for round robin
            if (args == parseInt(args, 10)) {
                _Quantum = args;
            }
            else {
                _StdOut.putText("Please enter an integer");
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
