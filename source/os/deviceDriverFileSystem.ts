module TSOS {
  // Extends DeviceDriver
  export class DeviceDriverFileSystem extends DeviceDriver {
    constructor(
      public tracks: number = 4,
      public sectors: number = 8,
      public blocks: number = 8,
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

      // Intitialize data with 0s
      for (let i = 4; i < this.dataSize; i++) {
        data += "0";
      }
      return data;
    }

    // Converts string-data provided to hex
    public convertToHex(data) {
      let hexString = "";

      // Converts a char at an index to hex and builds the string
      for (let i = 0; i < data.length; i++) {
        hexString += data.charCodeAt(i).toString(16);
      }

      // Sets rest of bytes to 0s
      for (var j = hexString.length; j < this.dataSize; j++) {
        hexString += "0";
      }

      return hexString;
    }

    // Write data to a specific TSB key
    public writeData(key, data): void {
      let hexString = data.substring(0, this.headerSize);

      let newData = data.substring(this.headerSize);

      // Check  if header tsb is free,
      if (data.substring(1, this.headerSize) != "---") {
        hexString += this.convertToHex(newData);
      } else {
        // Convert newdata to hex if not free
        hexString += newData;
      }

      sessionStorage.setItem(key, hexString);
    }

    // Create file method
    public createFile(fileName) {
      let dirKey = this.getFreeDirEntry();
      let dataKey = this.getFreeDataEntry();
      let dirData = "";
      let dataData = "";

      // Check if filename was given
      if (fileName.length > this.dataSize) {
        _StdOut.putText("[ERROR]");
        _StdOut.advanceLine();
        _StdOut.putText(
          "File name too long. Please enter a file name less than 60 characters."
        );
      } else if (dirKey == "null" || dataKey == null) {
        _StdOut.putText("[ERROR]");
        _StdOut.advanceLine();
        _StdOut.putText(
          "Memory out of space.There is no free space to create this file"
        );
      } else {
        // Create file
        dirData = sessionStorage.getItem(dirKey);
        // Set inUse bit for directory block to 1
        // Set header tsb to the available dataKey
        dirData = `1 ${dataKey} ${fileName}`;
        // Set data in dirBlock to the file name and write to data
        this.writeData(dirKey, dirData);

        //Set inUse bit for file/data block to 1
        dataData = sessionStorage.getItem(dataKey);
        dataData = "1" + dataData.substr(1);
        this.writeData(dataKey, dataData);
        // Update hard  disk with dirKey
        this.updateHardDiskTable(dirKey);
        // Update hard  disk with dataKey
        this.updateHardDiskTable(dataKey);

        _StdOut.putText(`[SUCCESS]: ${fileName} has been created`);
      }
    }

    // Get available dir that is not in use
    public getFreeDirEntry() {
      let key = "";
      let data = "";
      let inUseBit = "";

      for (let i = 0; i < this.sectors; i++) {
        for (let j = 1; j < this.blocks; j++) {
          key = "0" + i + j;
          data = sessionStorage.getItem(key);
          inUseBit = data.substring(0, 1);

          if (inUseBit == "0") {
            return key;
          }
        }
      }
      // Return null if there are no available or free tsb
      return "null";
    }

    // Get available data that is not in use
    public getFreeDataEntry() {
      let key = "";
      let data = "";
      let inUseBit = "";

      for (let i = 1; i < this.tracks; i++) {
        for (let j = 0; j < this.sectors; j++) {
          for (let k = 0; k < this.blocks; k++) {
            key = i.toString() + j.toString() + k.toString();
            data = sessionStorage.getItem(key);
            inUseBit = data.substring(0, 1);

            if (inUseBit == "0") {
              return key;
            }
          }
        }
      }

      // Return null if there are no available or free tsb
      return "null";
    }

    // Get filename
    public findFilename(filename) {
      let key = "";
      let data = "";
      let fileNameHex = this.convertToHex(filename);

      for (let i = 0; i < this.sectors; i++) {
        for (let j = 0; j < this.blocks; j++) {
          key = "0" + i + j;
          data = sessionStorage.getItem(key).substring(this.headerSize);

          // Check if data matches filename
          if (data == fileNameHex) {
            return key;
          }
        }
      }

      return null;
    }

    public updateHardDiskTable(key): void {
      // Get hard disk table and upadate values
      let hardDiskTable: HTMLTableElement = <HTMLTableElement>(
        document.getElementById("hardDiskTable")
      );
      let rows = hardDiskTable.getElementsByTagName("tr");

      for (let i = 1; i < rows.length; i++) {
        // Get data block if key is found and update table
        if (rows[i].cells[0].innerHTML == key) {
          let data = sessionStorage.getItem(key);
          rows[i].cells[1].innerHTML = data.substring(0, 1);
          rows[i].cells[2].innerHTML = data.substring(1, this.headerSize);
          rows[i].cells[3].innerHTML = data.substring(this.headerSize);
          break;
        }
      }
    }
  }
}
