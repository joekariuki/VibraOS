module TSOS {
  export class MemoryManager {
    constructor() {}
    public loadProgToMem() {
      // Remove spaces from input
      let programInput = _ProgramInput.replace(/[\s]/g, "");

      let base = -20;

      // Get new base
      for (let i = 0; i <= 512; i += 256) {
        if (_MemoryArray[i] == "00") {
          base = i;
          break;
        }
      }

      if (base != -20) {
        let j = base;

        for (let i = 0; i < programInput.length; i++) {
          _MemoryArray[j] = programInput[i] + programInput[i + 1];
          j++;
          i++;
        }

        _PID++;
        _CurrentProgram = new PCB();
        _CurrentProgram.init();
        _CurrentProgram.pcbProgram = programInput;
        _CurrentProgram.startIndex = base;
        _CurrentProgram.limit = base + (_ProgramSize - 1);

        _CurrentProgram.base = base;
        _CurrentProgram.state = PS_NEW;
        _ResidentQueue.push(_CurrentProgram);

        _StdOut.putText(`PID ${_PID} Loaded`);

        //Create row and insert into PCB table
        let pcbTab: HTMLTableElement = <HTMLTableElement>(
          document.getElementById("pcbTabDisplay")
        );
        let newRow = pcbTab.insertRow(pcbTab.rows.length);

        // Insert a cell in the row at index 0
        let newCell1 = newRow.insertCell(0);
        // Create PID text node
        let pidNode = document.createTextNode(`${_CurrentProgram.PID}`);
        // Append PID node to the cell
        newCell1.appendChild(pidNode);

        // Insert a cell in the row at index 1
        let newCell2 = newRow.insertCell(1);
        // Create PC text node
        let pcNode = document.createTextNode(`${_CurrentProgram.PC}`);
        // Append PC text node to the cell
        newCell2.appendChild(pcNode);

        // Insert a cell in the row at index 2
        let newCell3 = newRow.insertCell(2);
        // Create IR text node
        let IRNode = document.createTextNode(`${_CurrentProgram.IR}`);
        // Append a IR node to the cell
        newCell3.appendChild(IRNode);

        // Insert a cell in the row at index 4
        let newCell4 = newRow.insertCell(3);
        // Create Acc text node
        let AccNode = document.createTextNode(`${_CurrentProgram.Acc}`);
        // Append a Acc node to the cell
        newCell4.appendChild(AccNode);

        // Insert a cell in the row at index 5
        let newCell5 = newRow.insertCell(4);
        // Create Xreg text node
        let XregNode = document.createTextNode(`${_CurrentProgram.Xreg}`);
        // Append a Xreg text node to the cell
        newCell5.appendChild(XregNode);

        // Insert a cell in the row at index 6
        let newCell6 = newRow.insertCell(5);
        // Create Yreg text node
        let YregNode = document.createTextNode(`${_CurrentProgram.Yreg}`);
        // Append a Yreg text node to the cell
        newCell6.appendChild(YregNode);

        // Insert a cell in the row at index 7
        let newCell7 = newRow.insertCell(6);
        // Create Zflag text node
        let ZflagNode = document.createTextNode(`${_CurrentProgram.Zflag}`);
        // Append a Zflag text node to the cell
        newCell7.appendChild(ZflagNode);

        // Insert a cell in the row at index 8
        let newCell8 = newRow.insertCell(7);
        // Create a base text node
        let baseNode = document.createTextNode(`${_CurrentProgram.base}`);
        // Append base text node to the cell
        newCell8.appendChild(baseNode);

        // Insert a cell in the row at index 9
        let newCell9 = newRow.insertCell(8);
        //  Create limit text node
        let limitNode = document.createTextNode(`${_CurrentProgram.limit}`);
        // Append a limit text node to the cell
        newCell9.appendChild(limitNode);

        // Insert a cell in the row at index 10
        let newCell10 = newRow.insertCell(9);
        // Append a wait node to the cell
        let waitNode = document.createTextNode(`${_CurrentProgram.waitTime}`);
        newCell10.appendChild(waitNode);

        // Insert a cell in the row at index 11
        let newCell11 = newRow.insertCell(10);
        // Append a tatime node to the cell
        let taTime = document.createTextNode(`${_CurrentProgram.taTime}`);
        newCell11.appendChild(taTime);

        // Insert a cell in the row at index 12
        let newCell12 = newRow.insertCell(11);
        // Create state text node
        let stateNode = document.createTextNode(`${_CurrentProgram.state}`);
        // Append a state node to the cell
        newCell12.appendChild(stateNode);

        //Create CPU log
        this.cpuTableLog();
      } else {
        _StdOut.putText("Memory Full... Can't load Program");
      }
    }
    public updateCell(index) {
      let memoryTable: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("memoryTabDisplay")
      );
      let rows = memoryTable.getElementsByTagName("tr");
      let data = memoryTable.getElementsByTagName("td");

      let pcb = new PCB();
      pcb = _CurrentProgram;

      let startRow = 0;
      let endRow = 0;
      if (pcb.base == 0) {
        startRow = 0;
        endRow = startRow + 32;
      } else if (pcb.base == 256) {
        startRow = 32;
        endRow = startRow + 32;
      } else {
        startRow = 64;
        endRow = startRow + 32;
      }

      //To DO : Error if Base is greater than 512
      let memIndex = pcb.base;

      for (let i = startRow; i < endRow; i++) {
        let cells = rows[i].cells;
        for (let j = 1; j < cells.length; j++) {
          rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
          memIndex++;
        }
      }
    }

    public updateMemTable(pcb): void {
      // Load Program to Memory
      // this.loadProgToMem(_ProgramInput);
      // this.loadProgToMem();
      // Get memory table
      let memoryTab: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("memoryTabDisplay")
      );
      // Add table rows
      let rows = memoryTab.getElementsByTagName("tr");

      let startRow = 0;
      let endRow = 0;
      if (pcb.base == 0) {
        startRow = 0;
        endRow = startRow + 32;
      } else if (pcb.base == 256) {
        startRow = 32;
        endRow = startRow + 32;
      } else {
        startRow = 64;
        endRow = startRow + 32;
      }

      // Error if base is greater than 512
      let memIndex = pcb.base;

      for (let i = startRow; i < endRow; i++) {
        let cells = rows[i].cells;
        for (let j = 1; j < cells.length; j++) {
          rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
          memIndex++;
        }
      }
    }

    public clearMemLog() {
      let memoryTable: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("memoryTabDisplay")
      );
      let rows = memoryTable.getElementsByTagName("tr");

      let memIndex = 0;

      for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].cells;
        for (let j = 1; j < cells.length; j++) {
          rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
          memIndex++;
        }
      }
    }

    public storeValue(value, targetAddress) {
      value = value.toString();

      // pad value with 0 if length is 1
      if (value.length == 1) {
        value = "0" + value;
      }

      if (targetAddress <= _CurrentProgram.limit) {
        _MemoryArray[targetAddress] = value.toUpperCase();
      } else {
        //TO DO :: Throw an error or kill current program and move to next one
      }
    }

    public cpuTableLog() {
      //Create row and insert into CPU table
      let cpuTabLog: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("cpuTabDisplay")
      );

      let newRow = cpuTabLog.insertRow(cpuTabLog.rows.length);

      if (cpuTabLog.rows.length <= 2) {
        // Insert a cell in the row at index 0
        let newCell1 = newRow.insertCell(0);
        // Create PC text node
        let pcText = document.createTextNode(`${_CPU.PC}`);
        // Append PC text node to the cell
        newCell1.appendChild(pcText);

        // Insert a cell in the row at index 1
        let newCell2 = newRow.insertCell(1);
        // Create IR text node
        let IRText = document.createTextNode(`${_CPU.IR}`);
        // Append a IR node to the cell
        newCell2.appendChild(IRText);

        // Insert a cell in the row at index 2
        let newCell3 = newRow.insertCell(2);
        // Creat Acc text node
        let accText = document.createTextNode(`${_CPU.Acc}`);
        // Append a Acc text node to the cell
        newCell3.appendChild(accText);

        // Insert a cell in the row at index 3
        let newCell4 = newRow.insertCell(3);
        // Create Xreg text node
        let XregText = document.createTextNode(`${_CPU.Xreg}`);
        // Append a Xreg text node to the cell
        newCell4.appendChild(XregText);

        // Insert a cell in the row at index 4
        let newCell5 = newRow.insertCell(4);
        // Create Yreg text node
        let YregText = document.createTextNode(`${_CPU.Yreg}`);
        // Append a Yreg text node to the cell
        newCell5.appendChild(YregText);

        // Insert a cell in the row at index 5
        let newCell6 = newRow.insertCell(5);
        // Create Zflag text node
        let ZflagText = document.createTextNode(`${_CPU.Zflag}`);
        // Append a Zflag text node to the cell
        newCell6.appendChild(ZflagText);
      }
    }

    public updateCpuTable(): void {
      // Declare CPU table display
      let cpuTab: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("cpuTabDisplay")
      );
      // Set row element
      let row = cpuTab.getElementsByTagName("tr")[1];

      // Update memory cells
      row.cells[0].innerHTML = `${_CPU.PC}`;
      row.cells[1].innerHTML = _IR;
      row.cells[2].innerHTML = `${_CPU.Acc}`;
      row.cells[3].innerHTML = `${_CPU.Xreg}`;
      row.cells[4].innerHTML = `${_CPU.Yreg}`;
      row.cells[5].innerHTML = `${_CPU.Zflag}`;
    }

    public updatePcbTable(pcb): void {
      // Declare CPU table display
      let pcbTab: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("pcbTabDisplay")
      );
      // Set row element
      let rows = pcbTab.getElementsByTagName("tr");

      for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].cells;

        if (rows[i].cells[0].innerHTML == pcb.PID) {
          // Update memory cells
          rows[i].cells[0].innerHTML = `${pcb.PID}`;
          rows[i].cells[1].innerHTML = `${_CPU.PC}`;
          rows[i].cells[2].innerHTML = _IR;
          rows[i].cells[3].innerHTML = `${_CPU.Acc}`;
          rows[i].cells[4].innerHTML = `${_CPU.Xreg}`;
          rows[i].cells[5].innerHTML = `${_CPU.Yreg}`;
          rows[i].cells[6].innerHTML = `${_CPU.Zflag}`;
          rows[i].cells[7].innerHTML = `${pcb.base}`;
          rows[i].cells[8].innerHTML = `${pcb.limit}`;
          rows[i].cells[9].innerHTML = `${pcb.waitTime}`;
          rows[i].cells[10].innerHTML = `${pcb.taTime}`;
          rows[i].cells[11].innerHTML = `${pcb.state}`;
          break;
        }
      }
    }

    public deleteRowPcb(pcb): void {
      //get Memory table and upadte memory cells
      let pcbTable: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("pcbTabDisplay")
      );
      let rows = pcbTable.getElementsByTagName("tr");

      for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].cells;
        if (
          rows[i].cells[0].innerHTML == pcb.PID &&
          pcb.state == PS_TERMINATED
        ) {
          rows[i].remove();
          break;
        }
      }
    }

    // public deleteRowCpu(): void {
    //   let cpuTable: HTMLTableElement = <HTMLTableElement>(
    //     document.getElementById("cpuTabDisplay")
    //   );
    //   let row = cpuTable.getElementsByTagName("tr")[1];
    //   row.remove();
    // }

    // Clear a section of memory
    public resetPartition(pcb) {
      let index = pcb.base;
      for (let i = index; i <= pcb.limit; i++) {
        _MemoryArray[i] = "00";
      }
    }

    // Fetch opcode
    public fetch(addIndex) {
      let nextByte = _MemoryArray[addIndex];
      return nextByte;
    }
  }
}
