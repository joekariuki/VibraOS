///<reference path="../globals.ts" />
///<reference path="../os/pcb.ts" />

module TSOS {

    export class MemoryManager {

        public loadProgToMem(programInput) {
              // Remove spaces from input
               programInput = _ProgramInput.replace(/[\s]/g, "").toUpperCase();
               let Base = _BASE;

               if ((programInput.length/2) < 256) {
                  for (let i = 0; i < programInput.length; i++) {
                        _MemoryArray[Base] = programInput[i] + programInput[i + 1];
                        Base++;
                        i++;
               }

              _PID++;
              _CurrentProgram = new PCB();
               _CurrentProgram.pcbProgram = programInput;

              _CurrentProgram.state = PS_NEW;
              _ResidentQueue.push(_CurrentProgram);

              _StdOut.putText(`"PID ${ _PID} Loaded"`);



              //Create row and insert into PCB table
              let pcbTab: HTMLTableElement = <HTMLTableElement>document.getElementById("pcbTabDisplay");
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
              // Create state text node
              let stateNode = document.createTextNode(`${_CurrentProgram.state}`);
              // Append a state node to the cell
              newCell10.appendChild(stateNode);

              //Create CPU log
              this.cpuTableLog();
              //Get new base
              _BASE = _BASE + 256;
        } else {
          //Error if program is greater than or equal to 256
          _StdOut.putText("[ERROR]Program size too large... ");
        }
      }


      public updateMemTable():void {
             // Load Program to Memory
             this.loadProgToMem(_ProgramInput);

             // Get memory table
             let memoryTab : HTMLTableElement = <HTMLTableElement> document.getElementById("memoryTabDisplay");
             // Add table rows
             let rows = memoryTab.getElementsByTagName("tr");

             // Declare previous base
             let prevBase = _BASE - 256;
                  let startRowIndex = 0
               // Check if base is not empty
                 if (_MemoryArray[prevBase] != "00"){
                        startRowIndex = _RowNum;
                       _RowNum = _RowNum + 32;

                 }

             let memIndex = prevBase;

              for (let i = startRowIndex; i < _RowNum; i++) {

                    let cells = rows[i].cells;
                    for (let j = 1; j < cells.length; j++) {
                          rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
                          memIndex++;
                    }
              }
        }

        public cpuTableLog() {

                  //Create row and insert into CPU table
                  let cpuTabLog: HTMLTableElement = <HTMLTableElement>document.getElementById("cpuTabDisplay");

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
                  let cpuTab: HTMLTableElement = <HTMLTableElement>document.getElementById("cpuTabDisplay");
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
                  let pcbTab: HTMLTableElement = <HTMLTableElement>document.getElementById("pcbTabDisplay");
                  // Set row element
                  let rows = pcbTab.getElementsByTagName("tr");


                  for (let i = 1; i < rows.length; i++) {

                        let cells = rows[i].cells;

                        // Check if pcb state is running
                        if (pcb.state == PS_RUNNING && rows[i].cells[0].innerHTML == pcb.PID) {
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
                              rows[i].cells[9].innerHTML = `${pcb.state}`;
                              break;
                        }

                        // Check if pcb state is terminated
                        if (pcb.state == PS_TERMINATED && rows[i].cells[0].innerHTML == pcb.PID) {
                                    rows[i].cells[9].innerHTML = pcb.state;
                                    break;
                        }
                  }

            }

            // Fetch opcode
             public fetch(addIndex) {
                   let nextByte = _MemoryArray[addIndex];
                   return nextByte;

             }
       }
    }
