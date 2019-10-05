var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadProgToMem = function () {
            // Remove spaces from input
            var programInput = _ProgramInput.replace(/[\s]/g, "").toUpperCase();
            for (var i = 0; i < programInput.length; i++) {
                // Check if current memory index  is less than program size
                if (_CurrMemIndex < _ProgramSize) {
                    _MemoryArray[_CurrMemIndex] = programInput[i] + programInput[i + 1];
                    _CurrMemIndex++;
                    i++;
                }
            }
            // Increment PID by one
            _PID++;
            // Create new PCB
            _PCB = new TSOS.PCB();
            // Set program input to PCB
            _PCB.pcbProgram = programInput;
            // Add program to resident queue
            _ResidentQueue.push(_PCB);
            _StdOut.putText("PID " + _PID + " Loaded");
        };
        MemoryManager.prototype.updateMemTable = function () {
            // Load Program to Memory
            this.loadProgToMem();
            // Get memory table
            var memoryTable = document.getElementById("memoryTable");
            // Add table rows 
            var rows = memoryTable.getElementsByTagName("tr");
            // Declare memory index
            var memIndex = 0;
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].cells;
                for (var j = 1; j < cells.length; j++) {
                    rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
                    memIndex++;
                }
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
