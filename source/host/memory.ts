module TSOS {
    export class Memory {
       public init(): void {
           for (var i = 0; i < _ProgramSize; i++){
               _MemoryArray.push("00");
           }
            
        }

    }
}