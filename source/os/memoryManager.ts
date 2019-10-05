module TSOS {

    export class MemoryManager {
    
        public loadProgToMem(){
              // Remove spaces from input
              let programInput = _ProgramInput.replace(/[\s]/g, "").toUpperCase();

              for (let i = 0 ; i < programInput.length; i++){
                // Check if current memory index  is less than program size
                if (_CurrMemIndex < _ProgramSize){
                    _MemoryArray[_CurrMemIndex] = programInput[i] + programInput[i+1];
                    _CurrMemIndex++;
                    i++;
                }
              }
              
              // Increment PID by one
              _PID++;
              // Create new PCB
              _PCB = new PCB();
              // Set program input to PCB
              _PCB.pcbProgram = programInput;
              // Add program to resident queue
              _ResidentQueue.push(_PCB);
              _StdOut.putText(`PID ${_PID} Loaded`);
        }
    
          public updateMemTable():void {
             // Load Program to Memory
             this.loadProgToMem();
             
             // Get memory table
             let memoryTable : HTMLTableElement = <HTMLTableElement> document.getElementById("memoryTable");
             // Add table rows 
             let rows = memoryTable.getElementsByTagName("tr");
    
            // Declare memory index
            let memIndex = 0;

            for (let i = 0 ; i < rows.length; i++){         
                let cells = rows[i].cells;
                for (let j = 1 ; j < cells.length; j++){
                    rows[i].cells[j].innerHTML = _MemoryArray[memIndex];
                    memIndex++;
                }                  
            } 
        }
       }  
    }