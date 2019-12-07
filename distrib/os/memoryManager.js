///<reference path="../globals.ts" />
///<reference path="../os/pcb.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadProgToMem = function () {
            // Remove spaces from input
            var programInput = _ProgramInput.replace(/[\s]/g, "");
            var base = -20;
            // Get new base
            for (var i = 0; i <= 512; i += 256) {
                if (_MemoryArray[i] == "00") {
                    base = i;
                    break;
                }
            }
            if (base != -20) {
                var j = base;
                for (var i = 0; i < programInput.length; i++) {
                    _MemoryArray[j] = programInput[i] + programInput[i + 1];
                    j++;
                    i++;
                }
                _PID++;
                _CurrentProgram = new TSOS.PCB();
                _CurrentProgram.init();
                _CurrentProgram.pcbProgram = programInput;
                _CurrentProgram.startIndex = base;
                _CurrentProgram.limit = base + (_ProgramSize - 1);
                _CurrentProgram.base = base;
                _CurrentProgram.state = PS_NEW;
                _ResidentQueue.push(_CurrentProgram);
                _StdOut.putText("PID " + _PID + " Loaded");
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
                // Append a wait node to the cell
                var waitNode = document.createTextNode("" + _CurrentProgram.waitTime);
                newCell10.appendChild(waitNode);
                // Insert a cell in the row at index 11
                var newCell11 = newRow.insertCell(10);
                // Append a tatime node to the cell
                var taTime = document.createTextNode("" + _CurrentProgram.taTime);
                newCell11.appendChild(taTime);
                // Insert a cell in the row at index 12
                var newCell12 = newRow.insertCell(11);
                // Create state text node
                var stateNode = document.createTextNode("" + _CurrentProgram.state);
                // Append a state node to the cell
                newCell12.appendChild(stateNode);
                //Create CPU log
                this.cpuTableLog();
            }
            else {
                _StdOut.putText("Memory Full... Can't load Program");
            }
        };
        MemoryManager.prototype.updateCell = function (index) {
            var memoryTable = (document.getElementById("memoryTabDisplay"));
            var rows = memoryTable.getElementsByTagName("tr");
            var data = memoryTable.getElementsByTagName("td");
            var pcb = new TSOS.PCB();
            pcb = _CurrentProgram;
            var startRow = 0;
            var endRow = 0;
            if (pcb.base == 0) {
                startRow = 0;
                endRow = startRow + 32;
            }
            else if (pcb.base == 256) {
                startRow = 32;
                endRow = startRow + 32;
            }
            else {
                startRow = 64;
                endRow = startRow + 32;
            }
            //To DO : Error if Base is greater than 512
            var memIndex = pcb.base;
            for (var i = startRow; i < endRow; i++) {
                var cells = rows[i].cells;
                for (var j = 1; j < cells.length; j++) {
                    rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
                    memIndex++;
                }
            }
        };
        MemoryManager.prototype.updateMemTable = function (pcb) {
            // Load Program to Memory
            // this.loadProgToMem(_ProgramInput);
            // this.loadProgToMem();
            // Get memory table
            var memoryTab = (document.getElementById("memoryTabDisplay"));
            // Add table rows
            var rows = memoryTab.getElementsByTagName("tr");
            var startRow = 0;
            var endRow = 0;
            if (pcb.base == 0) {
                startRow = 0;
                endRow = startRow + 32;
            }
            else if (pcb.base == 256) {
                startRow = 32;
                endRow = startRow + 32;
            }
            else {
                startRow = 64;
                endRow = startRow + 32;
            }
            // Error if base is greater than 512
            var memIndex = pcb.base;
            for (var i = startRow; i < endRow; i++) {
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
        MemoryManager.prototype.storeValue = function (value, targetAddress) {
            value = value.toString();
            // pad value with 0 if length is 1
            if (value.length == 1) {
                value = "0" + value;
            }
            if (targetAddress <= _CurrentProgram.limit) {
                _MemoryArray[targetAddress] = value.toUpperCase();
            }
            else {
                //TO DO :: Throw an error or kill current program and move to next one
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
                    rows[i].cells[9].innerHTML = "" + pcb.waitTime;
                    rows[i].cells[10].innerHTML = "" + pcb.taTime;
                    rows[i].cells[11].innerHTML = "" + pcb.state;
                    break;
                }
            }
        };
        MemoryManager.prototype.deleteRowPcb = function (pcb) {
            //get Memory table and upadte memory cells
            var pcbTable = (document.getElementById("pcbTabDisplay"));
            var rows = pcbTable.getElementsByTagName("tr");
            for (var i = 1; i < rows.length; i++) {
                var cells = rows[i].cells;
                if (rows[i].cells[0].innerHTML == pcb.PID &&
                    pcb.state == PS_TERMINATED) {
                    rows[i].remove();
                    break;
                }
            }
        };
        // Clear a section of memory
        MemoryManager.prototype.resetPartition = function (pcb) {
            var index = pcb.base;
            for (var i = index; i <= pcb.limit; i++) {
                _MemoryArray[i] = "00";
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
