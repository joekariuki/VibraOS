var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFileSystem = /** @class */ (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem(tracks, sectors, blocks, dataSize, headerSize, formatCount) {
            if (tracks === void 0) { tracks = 4; }
            if (sectors === void 0) { sectors = 8; }
            if (blocks === void 0) { blocks = 8; }
            if (dataSize === void 0) { dataSize = 60; }
            if (headerSize === void 0) { headerSize = 4; }
            if (formatCount === void 0) { formatCount = 1; }
            var _this = _super.call(this) || this;
            _this.tracks = tracks;
            _this.sectors = sectors;
            _this.blocks = blocks;
            _this.dataSize = dataSize;
            _this.headerSize = headerSize;
            _this.formatCount = formatCount;
            _this.driverEntry = _this.krnFsDriverEntry;
            return _this;
        }
        DeviceDriverFileSystem.prototype.krnFsDriverEntry = function () {
            // Initialization routine for this, the kernel-mode File System Device Driver.
            this.status = "File System Driver loaded";
        };
        // Initalize blocks with " - " and " 0 "
        DeviceDriverFileSystem.prototype.initializeBlock = function () {
            var data = "0";
            //initialize tsb with -
            for (var i = 1; i < this.headerSize; i++) {
                data += "-";
            }
            // Intitialize data with 0s
            for (var i = 0; i < this.dataSize * 2; i++) {
                data += "0";
            }
            return data;
        };
        // Converts a hex dtring back to regular string
        DeviceDriverFileSystem.prototype.convertToString = function (data) {
            var str = "";
            for (var i = 0; i < data.length; i += 2) {
                if (data[i] + data[i + 1] != "00") {
                    return str;
                }
                else {
                    str += String.fromCharCode(parseInt(data.substr(i, 2), 16));
                }
            }
        };
        // Converts string-data provided to hex
        DeviceDriverFileSystem.prototype.convertToHex = function (data) {
            var hexString = "";
            data += "";
            // Converts a char at an index to hex and builds the string
            for (var i = 0; i < data.length; i++) {
                hexString += data.charCodeAt(i).toString(16);
            }
            // Sets rest of bytes to 0s
            for (var j = hexString.length; j < this.dataSize * 2; j++) {
                hexString += "0";
            }
            return hexString;
        };
        // Format
        DeviceDriverFileSystem.prototype.format = function () {
            var format = true;
            if (_ReadyQueue.length > 1) {
                for (var i = 0; i < _ReadyQueue.length; i++) {
                    if (_ReadyQueue[i].location == "Hard Disk") {
                        format = false;
                        if (this.formatCount == 1) {
                            _StdOut.putText("[LOADING] FORMAT WAITING...");
                            _StdOut.advanceLine();
                            this.formatCount++;
                        }
                        break;
                    }
                }
            }
            else if (_ResidentQueue.length > 1) {
                for (var i = 0; i < _ResidentQueue.length; i++) {
                    if (_ResidentQueue[i].location == "Hard Disk") {
                        format = false;
                        _StdOut.putText("[ERROR] Cannot format HD now. There are programs on Hard Disk waiting to be executed.");
                        // Deactive format command
                        _FormatCommandActive = false;
                        // Set format count to 1
                        this.formatCount = 1;
                        break;
                    }
                }
            }
            if (format == true) {
                for (var i = 0; i < this.tracks; i++) {
                    for (var j = 0; j < this.sectors; j++) {
                        for (var k = 0; k < this.blocks; k++) {
                            var key = i.toString() + j.toString() + k.toString();
                            var data = this.initializeBlock();
                            if (key == "000") {
                                data = "1000" + data.substring(this.headerSize);
                            }
                            sessionStorage.setItem(key, data);
                            this.updateHardDiskTable(key);
                        }
                    }
                }
                // Check if executing
                if (_FormatCommandActive == true) {
                    _StdOut.advanceLine();
                }
                // Display success message
                _StdOut.putText("Successfully Formatted");
                // Set format count to 1
                this.formatCount = 1;
                // Deactive format command
                _FormatCommandActive = false;
            }
        };
        // List files
        DeviceDriverFileSystem.prototype.listFiles = function () {
            for (var i = 0; i < this.sectors; i++) {
                for (var j = 1; j < this.blocks; j++) {
                    var key = "0" + i + j;
                    var inUseBit = sessionStorage.getItem(key).substring(0, 1);
                    if (inUseBit == "1") {
                        var data = sessionStorage.getItem(key).substring(this.headerSize);
                        console.log(data);
                        var fileName = this.convertToString(data);
                        console.log(fileName);
                        // Display files name
                        _StdOut.putText("File(s) available on disk:");
                        _StdOut.advanceLine();
                        _StdOut.putText(fileName);
                        _StdOut.advanceLine();
                    }
                }
            }
            _Kernel.krnTrace("List files on Hard Disk ");
        };
        // Write data to a specific TSB key
        DeviceDriverFileSystem.prototype.writeData = function (key, data) {
            var hexString = data.substring(0, this.headerSize);
            var newData = data.substring(this.headerSize);
            // Check  if header tsb is free,
            if (data.substring(1, this.headerSize) != "---" || key[0] != "0") {
                hexString += this.convertToHex(newData);
            }
            else {
                // Convert newdata to hex if not free
                hexString += newData;
            }
            sessionStorage.setItem(key, hexString);
        };
        // Create file method
        DeviceDriverFileSystem.prototype.createFile = function (fileName) {
            var dirKey = this.getFreeDirEntry();
            var dataKey = this.getFreeDataEntry();
            var dirData = "";
            var dataData = "";
            // Check if filename was given
            if (fileName.length > this.dataSize) {
                _StdOut.putText("[ERROR]");
                _StdOut.advanceLine();
                _StdOut.putText("File name too long. Please enter a file name less than 60 characters.");
            }
            else if (dirKey == null || dataKey == null) {
                _StdOut.putText("[ERROR]: Memory out of space");
                _StdOut.advanceLine();
                _StdOut.putText("There is no free space to create this file");
            }
            else if (this.findFilename(fileName) != null) {
                // Check if file already exist then don't create it.
                _StdOut.putText("[ERROR]: File already exist");
                _StdOut.advanceLine();
                _StdOut.putText("Create file using a different file name");
            }
            else {
                // Create file
                dirData = sessionStorage.getItem(dirKey);
                // Set inUse bit for directory block to 1
                // Set header tsb to the available dataKey
                dirData = "1" + dataKey + fileName;
                // Set data in dirBlock to the file name and write to data
                this.writeData(dirKey, dirData);
                //Set inUse bit for file/data block to 1
                dataData = sessionStorage.getItem(dataKey);
                dataData = "1" + dataData.substr(1);
                sessionStorage.setItem(dataKey, dataData);
                // Update hard  disk with dirKey
                this.updateHardDiskTable(dirKey);
                // Update hard  disk with dataKey
                this.updateHardDiskTable(dataKey);
                if (!fileName.match(/Process\d+/)) {
                    _StdOut.putText("[SUCCESS]: " + fileName + " has been created");
                }
            }
            _Kernel.krnTrace(fileName + " created and and stored on Hard Disk");
        };
        DeviceDriverFileSystem.prototype.writeToFile = function (fileName, contents) {
            var dirKey = this.findFilename(fileName);
            if (dirKey == null) {
                _StdOut.putText("[ERROR]: File name does not exist");
                _StdOut.advanceLine();
            }
            else {
                var dirData = sessionStorage.getItem(dirKey);
                var dataKey = dirData.substring(1, this.headerSize);
                var dataData = "";
                var inUseBit = sessionStorage.getItem(dataKey).substring(0, 1);
                var headerTSB = sessionStorage
                    .getItem(dataKey)
                    .substring(1, this.headerSize);
                // Check if length of data is less than 60 byte
                if (contents.length <= this.dataSize && inUseBit == "1") {
                    if (headerTSB == "---") {
                        var newData_1 = sessionStorage
                            .getItem(dataKey)
                            .substring(this.headerSize);
                        var prevContents = this.convertToString(newData_1);
                        var newContents = prevContents + contents;
                        if (newContents.length > this.dataSize) {
                            this.writeToFile(fileName, newContents);
                        }
                        else {
                            // Write to file
                            dataData = inUseBit + headerTSB + newContents;
                            sessionStorage.setItem(dataKey, dataData);
                            this.writeData(dataKey, dataData);
                            this.updateHardDiskTable(dataKey);
                            if (!fileName.match(/Process\d+/)) {
                                // Display success message
                                _StdOut.putText("[SUCCESS]: " + fileName + " has been updated!");
                            }
                        }
                    }
                    else {
                        // Get readable data from disk
                        var newData = sessionStorage
                            .getItem(dataKey)
                            .substring(this.headerSize);
                        var prevContents = this.convertToString(newData);
                        var newContents = prevContents;
                        var newKey = sessionStorage
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
                }
                else if (contents.length > this.dataSize && inUseBit == "1") {
                    if (headerTSB == "---") {
                        //Get first data to write to file
                        var newDataKey = this.getFreeDataEntry();
                        headerTSB = newDataKey;
                        if (newDataKey != null) {
                            var contentSize = 0;
                            var nextContentSize = this.dataSize;
                            while (contentSize < contents.length) {
                                inUseBit = "1";
                                dataData =
                                    inUseBit +
                                        headerTSB +
                                        contents.substring(contentSize, nextContentSize);
                                this.writeData(dataKey, dataData);
                                this.updateHardDiskTable(dataKey);
                                contentSize = contentSize + this.dataSize;
                                if (contents.length - contentSize <= this.dataSize) {
                                    nextContentSize = contents.length;
                                    dataKey = this.getFreeDataEntry();
                                    if (dataKey == null) {
                                        // Stop writing to file when HD is out of space
                                        break;
                                    }
                                    headerTSB = "---";
                                }
                                else {
                                    nextContentSize = contentSize + this.dataSize;
                                    dataKey = this.getFreeDataEntry();
                                    if (dataKey == null) {
                                        // Stop writing to file when HD is out of space
                                        break;
                                    }
                                    dataData = sessionStorage.getItem(dataKey);
                                    dataData = "1" + dataData.substr(1);
                                    sessionStorage.setItem(dataKey, dataData);
                                    this.updateHardDiskTable(dataKey);
                                    newDataKey = this.getFreeDataEntry();
                                    headerTSB = newDataKey;
                                    if (newDataKey == null) {
                                        // Stop writing to file when HD is out of space
                                        break;
                                    }
                                }
                            }
                            if (!fileName.match(/Process\d+/)) {
                                //Display success status
                                _StdOut.putText("[SUCCESS] " + fileName + " has been updated!");
                            }
                        }
                        else {
                            //TO DO:: Error if file is too large
                        }
                    }
                    else {
                        // Get readerable data from hard disk
                        var newData = sessionStorage
                            .getItem(dataKey)
                            .substring(this.headerSize);
                        var prevContents = this.convertToString(newData);
                        var newContents = prevContents;
                        var newKey = sessionStorage
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
                }
                else {
                    //TO DO:: Error if file is too large
                }
            }
        };
        // Read file
        DeviceDriverFileSystem.prototype.readFile = function (fileName) {
            var dirKey = this.findFilename(fileName);
            if (dirKey == null) {
                _StdOut.putText("[ERROR]");
                _StdOut.advanceLine();
                _StdOut.putText("File name does not exist");
            }
            else {
                var dirData = sessionStorage.getItem(dirKey);
                var dataKey = dirData.substring(1, this.headerSize);
                var fileData = "";
                var nextDataKey = sessionStorage
                    .getItem(dataKey)
                    .substring(1, this.headerSize);
                if (nextDataKey == "---") {
                    fileData =
                        fileData +
                            this.convertToString(sessionStorage.getItem(dataKey).substring(this.headerSize));
                }
                else {
                    fileData =
                        fileData +
                            this.convertToString(sessionStorage.getItem(dataKey).substring(this.headerSize));
                    while (nextDataKey != "---") {
                        fileData =
                            fileData +
                                this.convertToString(sessionStorage.getItem(nextDataKey).substring(this.headerSize));
                        nextDataKey = sessionStorage
                            .getItem(nextDataKey)
                            .substring(1, this.headerSize);
                    }
                }
                if (!fileName.match(/Process\d+/)) {
                    _StdOut.advanceLine();
                    _StdOut.putText(fileData);
                }
                console.log(fileData);
                return fileData;
            }
            _Kernel.krnTrace(fileName + "read.");
        };
        // Delete file
        DeviceDriverFileSystem.prototype.deleteFile = function (fileName) {
            var dirKey = this.findFilename(fileName);
            if (dirKey == null) {
                _StdOut.putText("[ERROR]: File name does not exist");
                _StdOut.advanceLine();
            }
            else {
                var dirData = sessionStorage.getItem(dirKey);
                var dataKey = dirData.substring(1, this.headerSize);
                // Reset data in directory
                sessionStorage.setItem(dirKey, this.initializeBlock());
                this.updateHardDiskTable(dirKey);
                // Get next data entry
                var nextDataKey = sessionStorage
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
                if (!_IsProgramName) {
                    // Display success message
                    _StdOut.putText("[SUCCESS]: " + fileName + " has been deleted!");
                }
            }
            _Kernel.krnTrace(fileName + " deleted from Hard Disk");
        };
        // Get available dir that is not in use
        DeviceDriverFileSystem.prototype.getFreeDirEntry = function () {
            var key = "";
            var data = "";
            var inUseBit = "";
            for (var i = 0; i < this.sectors; i++) {
                for (var j = 0; j < this.blocks; j++) {
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
        };
        // Get available data that is not in use
        DeviceDriverFileSystem.prototype.getFreeDataEntry = function () {
            var key = "";
            var data = "";
            var inUseBit = "";
            for (var i = 1; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
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
        };
        // Get filename
        DeviceDriverFileSystem.prototype.findFilename = function (fileName) {
            var key = "";
            var data = "";
            var inUseBit = "";
            var fileNameHex = this.convertToHex(fileName);
            for (var i = 0; i < this.sectors; i++) {
                for (var j = 0; j < this.blocks; j++) {
                    key = "0" + i + j;
                    data = sessionStorage.getItem(key).substring(this.headerSize);
                    inUseBit = sessionStorage.getItem(key).substring(0, 1);
                    // Check if data matches filename
                    if (data == fileNameHex && inUseBit == "1") {
                        return key;
                    }
                }
            }
            return null;
        };
        DeviceDriverFileSystem.prototype.updateHardDiskTable = function (key) {
            // Get hard disk table and upadate values
            var hardDiskTable = (document.getElementById("hardDiskTable"));
            var rows = hardDiskTable.getElementsByTagName("tr");
            for (var i = 1; i < rows.length; i++) {
                // Get data block if key is found and update table
                if (rows[i].cells[0].innerHTML == key) {
                    var data = sessionStorage.getItem(key);
                    rows[i].cells[1].innerHTML = data.substring(0, 1);
                    rows[i].cells[2].innerHTML = data.substring(1, this.headerSize);
                    rows[i].cells[3].innerHTML = data.substring(this.headerSize);
                    break;
                }
            }
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
