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
      this.driverEntry = this.krnFsDriverEntry;
    }

    public krnFsDriverEntry() {
      // Initialization routine for this, the kernel-mode File System Device Driver.
      this.status = "File System Driver loaded";
    }

    // Initalize blocks with " - " and " 0 "
    public initializeBlock() {
      let data = "0";
      //initialize tsb with -
      for (let i = 1; i < this.headerSize; i++) {
        data += "-";
      }

      // Intitialize data with 0s
      for (let i = 0; i < this.dataSize * 2; i++) {
        data += "0";
      }
      return data;
    }

    // Converts a hex dtring back to regular string
    public convertToString(data) {
      let str = "";

      for (let i = 0; i < data.length; i += 2) {
        if (data[i] + data[i + 1] != "00") {
          return str;
        } else {
          str += String.fromCharCode(parseInt(data.substr(i, 2), 16));
        }
      }
    }

    // Converts string-data provided to hex
    public convertToHex(data) {
      let hexString = "";

      // Converts a char at an index to hex and builds the string
      for (let i = 0; i < data.length; i++) {
        hexString += data.charCodeAt(i).toString(16);
      }

      // Sets rest of bytes to 0s
      for (var j = hexString.length; j < this.dataSize * 2; j++) {
        hexString += "0";
      }

      return hexString;
    }

    // Write data to a specific TSB key
    public writeData(key, data): void {
      let hexString = data.substring(0, this.headerSize);

      let newData = data.substring(this.headerSize);

      // Check  if header tsb is free,
      if (data.substring(1, this.headerSize) != "---" || key[0] != "0") {
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
      } else if (dirKey == null || dataKey == null) {
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
        // this.writeData(dataKey, dataData);
        sessionStorage.setItem(dataKey, dataData);

        // Update hard  disk with dirKey
        this.updateHardDiskTable(dirKey);
        // Update hard  disk with dataKey
        this.updateHardDiskTable(dataKey);

        _StdOut.putText(`[SUCCESS]: ${fileName} has been created`);
      }
    }

    public writeToFile(fileName, contents) {
      let dirKey = this.findFilename(fileName);
      if (dirKey == null) {
        _StdOut.putText("[ERROR]: File name does not exist");
        _StdOut.advanceLine();
      } else {
        let dirData = sessionStorage.getItem(dirKey);
        let dataKey = dirData.substring(1, this.headerSize);

        let dataData = "";
        let inUseBit = sessionStorage.getItem(dataKey).substring(0, 1);
        let headerTSB = sessionStorage
          .getItem(dataKey)
          .substring(1, this.headerSize);

        // Check if length of data is less than 60 byte
        if (contents.length <= this.dataSize && inUseBit == "1") {
          if (headerTSB == "---") {
            let newData = sessionStorage
              .getItem(dataKey)
              .substring(this.headerSize);
            let prevContents = this.convertToString(newData);
            let newContents = prevContents + contents;

            if (newContents.length > this.dataSize) {
              this.writeToFile(fileName, newContents);
            } else {
              // Write to file
              dataData = inUseBit + headerTSB + newContents;
              sessionStorage.setItem(dataKey, dataData);
              this.writeData(dataKey, dataData);
              this.updateHardDiskTable(dataKey);

              // Display success message
              _StdOut.putText(`[SUCCESS]: ${fileName} has been updated!`);
            }
          } else {
            // Get readable data from disk
            var newData = sessionStorage
              .getItem(dataKey)
              .substring(this.headerSize);

            let prevContents = this.convertToString(newData);
            let newContents = prevContents;

            let newKey = sessionStorage
              .getItem(dataKey)
              .substring(1, this.headerSize);

            //Reset header tsb
            sessionStorage.setItem(dataKey, "1" + "---" + newData);

            while (newKey != "---") {
              newData = sessionStorage
                .getItem(newKey)
                .substring(this.headerSize);
              dataKey = sessionStorage
                .getItem(newKey)
                .substring(1, this.headerSize);

              newContents = newContents + this.convertToString(newData);

              // Reset header tsb
              sessionStorage.setItem(newKey, "0" + "---" + newData);

              // Get next header tsb
              newKey = dataKey;
            }
            // TODO: Add appending file message

            // Recall write to function
            this.writeToFile(fileName, newContents + contents);
          }
        } else if (contents.length > this.dataSize && inUseBit == "1") {
          if (headerTSB == "---") {
            //Get first data to write to file
            var newDataKey = this.getFreeDataEntry();
            headerTSB = newDataKey;

            if (newDataKey != null) {
              let contentSize = 0;
              let nextContentSize = this.dataSize;
              while (contentSize < contents.length) {
                inUseBit = "1";
                dataData =
                  inUseBit +
                  headerTSB +
                  contents.substring(contentSize, nextContentSize);

                this.writeData(dataKey, dataData);
                this.updateHardDiskTable(dataKey);

                contentSize = contentSize + this.dataSize;
                if (
                  contents.length - contentSize >= 0 &&
                  contents.length - contentSize <= this.dataSize
                ) {
                  nextContentSize = contents.length;
                  dataKey = this.getFreeDataEntry();
                  headerTSB = "---";
                } else {
                  nextContentSize = contentSize + this.dataSize;
                  dataKey = this.getFreeDataEntry();

                  dataData = sessionStorage.getItem(dataKey);
                  dataData = "1" + dataData.substr(1);

                  newDataKey = this.getFreeDataEntry();
                  headerTSB = newDataKey;

                  if (newDataKey == null) {
                    //TO DO:: Error if file is too large

                    break;
                  }
                }
              }
              //Display success status
              _StdOut.putText(`[SUCCESS] ${fileName} has been updated!`);
            } else {
              //TO DO:: Error if file is too large
            }
          } else {
            // Get readerable data from hard disk
            var newData = sessionStorage
              .getItem(dataKey)
              .substring(this.headerSize);

            let prevContents = this.convertToString(newData);
            let newContents = prevContents;

            let newKey = sessionStorage
              .getItem(dataKey)
              .substring(1, this.headerSize);

            // Reset header tsb
            sessionStorage.setItem(dataKey, "1" + "---" + newData);
            while (newKey != "---") {
              newData = sessionStorage
                .getItem(newKey)
                .substring(this.headerSize);
              dataKey = sessionStorage
                .getItem(newKey)
                .substring(1, this.headerSize);

              newContents = newContents + this.convertToString(newData);

              // Reset header tsb
              sessionStorage.setItem(newKey, "0" + "---" + newData);

              //Get next header tsb
              newKey = dataKey;
            }
            // Call write to function
            this.writeToFile(fileName, newContents + contents);
          }
        } else {
          //TO DO:: Error if file is too large
        }
      }
    }

    // Read file
    public readFile(fileName) {
      let dirKey = this.findFilename(fileName);
      if (dirKey == null) {
        _StdOut.putText("[ERROR]");
        _StdOut.advanceLine();
        _StdOut.putText("File name does not exist");
      } else {
        let dirData = sessionStorage.getItem(dirKey);
        let dataKey = dirData.substring(1, this.headerSize);

        let fileData = "";
        let nextDataKey = sessionStorage
          .getItem(dataKey)
          .substring(1, this.headerSize);

        if (nextDataKey == "---") {
          fileData =
            fileData +
            this.convertToString(
              sessionStorage.getItem(dataKey).substring(this.headerSize)
            );
        } else {
          fileData =
            fileData +
            this.convertToString(
              sessionStorage.getItem(dataKey).substring(this.headerSize)
            );

          while (nextDataKey != "---") {
            fileData =
              fileData +
              this.convertToString(
                sessionStorage.getItem(nextDataKey).substring(this.headerSize)
              );

            nextDataKey = sessionStorage
              .getItem(nextDataKey)
              .substring(1, this.headerSize);
          }
        }

        _StdOut.putText(`[SUCCESS]: Reading ${fileName} ...`);
        _StdOut.advanceLine();
        _StdOut.putText(fileData);
      }
    }

    // Delete file
    public deleteFile(fileName) {
      let dirKey = this.findFilename(fileName);
      if (dirKey == null) {
        _StdOut.putText("[ERROR]: File name does not exist");
        _StdOut.advanceLine();
      } else {
        let dirData = sessionStorage.getItem(dirKey);
        let dataKey = dirData.substring(1, this.headerSize);

        // Reset data in directory
        sessionStorage.setItem(dirKey, this.initializeBlock());
        this.updateHardDiskTable(dirKey);

        // Get next data entry
        let nextDataKey = sessionStorage
          .getItem(dataKey)
          .substring(1, this.headerSize);

        // Reset file data
        sessionStorage.setItem(dataKey, this.initializeBlock());
        this.updateHardDiskTable(dataKey);

        while (nextDataKey != "---") {
          // Get next data entry
          dataKey = sessionStorage
            .getItem(nextDataKey)
            .substring(1, this.headerSize);

          // Resetfile data
          sessionStorage.setItem(nextDataKey, this.initializeBlock());
          this.updateHardDiskTable(nextDataKey);

          nextDataKey = dataKey;
        }
        // Display success message
        _StdOut.putText(`[SUCCESS]: ${fileName} has been deleted!`);
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
      return null;
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
      return null;
    }

    // Get filename
    public findFilename(fileName) {
      let key = "";
      let data = "";
      let inUseBit = "";
      let fileNameHex = this.convertToHex(fileName);
      console.log(`file: ${fileName} file hex: ${fileNameHex}`);

      for (let i = 0; i < this.sectors; i++) {
        for (let j = 0; j < this.blocks; j++) {
          key = `0 ${i} ${j}`;
          data = sessionStorage.getItem(key).substring(this.headerSize);
          inUseBit = sessionStorage.getItem(key).substring(0, 1);

          // Check if data matches filename
          if (data == fileNameHex && inUseBit == "1") {
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
