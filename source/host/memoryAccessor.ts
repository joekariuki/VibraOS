module TSOS {
  export class MemoryAccessor {
    constructor() {}

    public readMemory(address) {
      // read memory
      console.log(address);
    }

    public writeMemory(address, data) {
      //  write memory
      console.log(address, data);
    }
  }
}
