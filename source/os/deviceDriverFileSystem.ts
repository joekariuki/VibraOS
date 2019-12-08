module TSOS {
  // Extends DeviceDriver
  export class DeviceDriverFileSystem extends DeviceDriver {
    constructor(
      public tracks: number = 4,
      public sectors: number = 8,
      public blocks: number = 8,
      public blockSize: number = 64,
      public dataSize: number = 60,
      public headerSize: number = 4
    ) {
      super();
    }

    // Initalize blocks with " - " and " 0 "
    public initializeBlock() {
      let data = "0";
      //initialize tsb with -
      for (let i = 1; i < this.headerSize; i++) {
        data += "-";
      }

      //intitialize data with 0s
      for (let i = 4; i < this.dataSize; i++) {
        data += "0";
      }
      return data;
    }

    //converts the string-data provided to hex
    public convertToHex(data) {
      let hexString = "";

      //converts a char at an index to hex and builds the string
      for (let i = 0; i < data.length; i++) {
        hexString += data.charCodeAt(i).toString(16);
      }

      return hexString;
    }
  }
}
