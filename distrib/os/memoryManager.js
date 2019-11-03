///<reference path="../globals.ts" />
///<reference path="../os/pcb.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadProgToMem = function (programInput) {
            // Remove spaces from input
            programInput = _ProgramInput.replace(/[\s]/g, "").toUpperCase();
            var Base = _BASE;
            // if (programInput.length/2 < 256) {
            for (var i = 0; i < programInput.length; i++) {
                _MemoryArray[Base] = programInput[i] + programInput[i + 1];
                Base++;
                i++;
            }
            // } else {
            //   //Error if program is greater than or equal to 256
            //   _StdOut.putText("Program too Large.. ");
            // }
            _PID++;
            _CurrentProgram = new TSOS.PCB();
            _CurrentProgram.pcbProgram = programInput;
            _CurrentProgram.base = _BASE;
            _CurrentProgram.state = PS_NEW;
            _ResidentQueue.push(_CurrentProgram);
            _StdOut.putText("\"PID " + _PID + " Loaded\"");
            //Create row and insert into PCB table
            var pcbTab = (document.getElementById("pcbTabDisplay"));
            var newRow = pcbTab.insertRow(pcbTab.rows.length);
            // Insert a cell in the row at index 0
            var newCell1 = newRow.insertCell(0);
            // Create PID text node
            var pidNode = document.createTextNode("" + _CurrentProgram.PID);
            // Append PID node to the cell
            newCell1.appendChild(pidNode);
            // Insert a cell in the row at index 1
            var newCell2 = newRow.insertCell(1);
            // Create PC text node
            var pcNode = document.createTextNode("" + _CurrentProgram.PC);
            // Append PC text node to the cell
            newCell2.appendChild(pcNode);
            // Insert a cell in the row at index 2
            var newCell3 = newRow.insertCell(2);
            // Create IR text node
            var IRNode = document.createTextNode("" + _CurrentProgram.IR);
            // Append a IR node to the cell
            newCell3.appendChild(IRNode);
            // Insert a cell in the row at index 4
            var newCell4 = newRow.insertCell(3);
            // Create Acc text node
            var AccNode = document.createTextNode("" + _CurrentProgram.Acc);
            // Append a Acc node to the cell
            newCell4.appendChild(AccNode);
            // Insert a cell in the row at index 5
            var newCell5 = newRow.insertCell(4);
            // Create Xreg text node
            var XregNode = document.createTextNode("" + _CurrentProgram.Xreg);
            // Append a Xreg text node to the cell
            newCell5.appendChild(XregNode);
            // Insert a cell in the row at index 6
            var newCell6 = newRow.insertCell(5);
            // Create Yreg text node
            var YregNode = document.createTextNode("" + _CurrentProgram.Yreg);
            // Append a Yreg text node to the cell
            newCell6.appendChild(YregNode);
            // Insert a cell in the row at index 7
            var newCell7 = newRow.insertCell(6);
            // Create Zflag text node
            var ZflagNode = document.createTextNode("" + _CurrentProgram.Zflag);
            // Append a Zflag text node to the cell
            newCell7.appendChild(ZflagNode);
            // Insert a cell in the row at index 8
            var newCell8 = newRow.insertCell(7);
            // Create a base text node
            var baseNode = document.createTextNode("" + _CurrentProgram.base);
            // Append base text node to the cell
            newCell8.appendChild(baseNode);
            // Insert a cell in the row at index 9
            var newCell9 = newRow.insertCell(8);
            //  Create limit text node
            var limitNode = document.createTextNode("" + _CurrentProgram.limit);
            // Append a limit text node to the cell
            newCell9.appendChild(limitNode);
            // Insert a cell in the row at index 10
            var newCell10 = newRow.insertCell(9);
            // Create state text node
            var stateNode = document.createTextNode("" + _CurrentProgram.state);
            // Append a state node to the cell
            newCell10.appendChild(stateNode);
            //Create CPU log
            this.cpuTableLog();
            //Get new base
            if (_BASE != 512) {
                _BASE = _BASE + 256;
            }
        };
        MemoryManager.prototype.updateMemTable = function () {
            // Load Program to Memory
            this.loadProgToMem(_ProgramInput);
            // Get memory table
            var memoryTab = (document.getElementById("memoryTabDisplay"));
            // Add table rows
            var rows = memoryTab.getElementsByTagName("tr");
            // Declare previous base
            var prevBase = _BASE - 256;
            var startRowIndex = 0;
            // Check if base is not empty
            if (_MemoryArray[prevBase] != "00") {
                startRowIndex = _RowNum;
                _RowNum = _RowNum + 32;
            }
            // Error if base is greater than 512
            var memIndex = prevBase;
            for (var i = startRowIndex; i < _RowNum; i++) {
                var cells = rows[i].cells;
                for (var j = 1; j < cells.length; j++) {
                    rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
                    memIndex++;
                }
            }
        };
        MemoryManager.prototype.clearMemLog = function () {
            var memoryTable = (document.getElementById("memoryTabDisplay"));
            var rows = memoryTable.getElementsByTagName("tr");
            var memIndex = 0;
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].cells;
                for (var j = 1; j < cells.length; j++) {
                    rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
                    memIndex++;
                }
            }
        };
        MemoryManager.prototype.cpuTableLog = function () {
            //Create row and insert into CPU table
            var cpuTabLog = (document.getElementById("cpuTabDisplay"));
            var newRow = cpuTabLog.insertRow(cpuTabLog.rows.length);
            if (cpuTabLog.rows.length <= 2) {
                // Insert a cell in the row at index 0
                var newCell1 = newRow.insertCell(0);
                // Create PC text node
                var pcText = document.createTextNode("" + _CPU.PC);
                // Append PC text node to the cell
                newCell1.appendChild(pcText);
                // Insert a cell in the row at index 1
                var newCell2 = newRow.insertCell(1);
                // Create IR text node
                var IRText = document.createTextNode("" + _CPU.IR);
                // Append a IR node to the cell
                newCell2.appendChild(IRText);
                // Insert a cell in the row at index 2
                var newCell3 = newRow.insertCell(2);
                // Creat Acc text node
                var accText = document.createTextNode("" + _CPU.Acc);
                // Append a Acc text node to the cell
                newCell3.appendChild(accText);
                // Insert a cell in the row at index 3
                var newCell4 = newRow.insertCell(3);
                // Create Xreg text node
                var XregText = document.createTextNode("" + _CPU.Xreg);
                // Append a Xreg text node to the cell
                newCell4.appendChild(XregText);
                // Insert a cell in the row at index 4
                var newCell5 = newRow.insertCell(4);
                // Create Yreg text node
                var YregText = document.createTextNode("" + _CPU.Yreg);
                // Append a Yreg text node to the cell
                newCell5.appendChild(YregText);
                // Insert a cell in the row at index 5
                var newCell6 = newRow.insertCell(5);
                // Create Zflag text node
                var ZflagText = document.createTextNode("" + _CPU.Zflag);
                // Append a Zflag text node to the cell
                newCell6.appendChild(ZflagText);
            }
        };
        MemoryManager.prototype.updateCpuTable = function () {
            // Declare CPU table display
            var cpuTab = (document.getElementById("cpuTabDisplay"));
            // Set row element
            var row = cpuTab.getElementsByTagName("tr")[1];
            // Update memory cells
            row.cells[0].innerHTML = "" + _CPU.PC;
            row.cells[1].innerHTML = _IR;
            row.cells[2].innerHTML = "" + _CPU.Acc;
            row.cells[3].innerHTML = "" + _CPU.Xreg;
            row.cells[4].innerHTML = "" + _CPU.Yreg;
            row.cells[5].innerHTML = "" + _CPU.Zflag;
        };
        MemoryManager.prototype.updatePcbTable = function (pcb) {
            // Declare CPU table display
            var pcbTab = (document.getElementById("pcbTabDisplay"));
            // Set row element
            var rows = pcbTab.getElementsByTagName("tr");
            for (var i = 1; i < rows.length; i++) {
                var cells = rows[i].cells;
                // Check if pcb state is running
                // if (pcb.state == PS_RUNNING && rows[i].cells[0].innerHTML == pcb.PID) {
                if (rows[i].cells[0].innerHTML == pcb.PID) {
                    // Update memory cells
                    rows[i].cells[0].innerHTML = "" + pcb.PID;
                    rows[i].cells[1].innerHTML = "" + _CPU.PC;
                    rows[i].cells[2].innerHTML = _IR;
                    rows[i].cells[3].innerHTML = "" + _CPU.Acc;
                    rows[i].cells[4].innerHTML = "" + _CPU.Xreg;
                    rows[i].cells[5].innerHTML = "" + _CPU.Yreg;
                    rows[i].cells[6].innerHTML = "" + _CPU.Zflag;
                    rows[i].cells[7].innerHTML = "" + pcb.base;
                    rows[i].cells[8].innerHTML = "" + pcb.limit;
                    rows[i].cells[9].innerHTML = "" + pcb.state;
                    break;
                }
                // Check if pcb state is terminated
                // if (
                //   pcb.state == PS_TERMINATED &&
                //   rows[i].cells[0].innerHTML == pcb.PID
                // ) {
                //   rows[i].cells[9].innerHTML = pcb.state;
                //   break;
                // }
            }
        };
        MemoryManager.prototype.deleteRowPcb = function (pcb) {
            //load program to memory
            //this.loadProgToMem();
            //get Memory table and upadte memory cells
            var pcbTable = (document.getElementById("pcbTabDisplay"));
            var rows = pcbTable.getElementsByTagName("tr");
            for (var i = 1; i < rows.length; i++) {
                var cells = rows[i].cells;
                console.log(cells);
                if (rows[i].cells[0].innerHTML == pcb.PID) {
                    rows[i].remove();
                    break;
                }
            }
        };
        // Clear a section of memory
        MemoryManager.prototype.resetMem = function () {
            var index = _CurrentProgram.base;
            console.log("Index " + index);
            for (var i = 0; i < _ProgramSize; i++) {
                _MemoryArray[index] = "00";
                index++;
            }
        };
        // Fetch opcode
        MemoryManager.prototype.fetch = function (addIndex) {
            var nextByte = _MemoryArray[addIndex];
            return nextByte;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
