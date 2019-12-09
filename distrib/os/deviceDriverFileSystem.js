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
        function DeviceDriverFileSystem(tracks, sectors, blocks, dataSize, headerSize) {
            if (tracks === void 0) { tracks = 4; }
            if (sectors === void 0) { sectors = 8; }
            if (blocks === void 0) { blocks = 8; }
            if (dataSize === void 0) { dataSize = 60; }
            if (headerSize === void 0) { headerSize = 4; }
            var _this = _super.call(this) || this;
            _this.tracks = tracks;
            _this.sectors = sectors;
            _this.blocks = blocks;
            _this.dataSize = dataSize;
            _this.headerSize = headerSize;
            return _this;
        }
        // Initalize blocks with " - " and " 0 "
        DeviceDriverFileSystem.prototype.initializeBlock = function () {
            var data = "0";
            //initialize tsb with -
            for (var i = 1; i < this.headerSize; i++) {
                data += "-";
            }
            // Intitialize data with 0s
            for (var i = 4; i < this.dataSize; i++) {
                data += "0";
            }
            return data;
        };
        // Converts string-data provided to hex
        DeviceDriverFileSystem.prototype.convertToHex = function (data) {
            var hexString = "";
            // Converts a char at an index to hex and builds the string
            for (var i = 0; i < data.length; i++) {
                hexString += data.charCodeAt(i).toString(16);
            }
            // Sets rest of bytes to 0s
            for (var j = hexString.length; j < this.dataSize; j++) {
                hexString += "0";
            }
            return hexString;
        };
        // Write data to a specific TSB key
        DeviceDriverFileSystem.prototype.writeData = function (key, data) {
            var hexString = data.substring(0, this.headerSize);
            var newData = data.substring(this.headerSize);
            // Check  if header tsb is free,
            if (data.substring(1, this.headerSize) != "---") {
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
            else if (dirKey == "null" || dataKey == null) {
                _StdOut.putText("[ERROR]");
                _StdOut.advanceLine();
                _StdOut.putText("Memory out of space.There is no free space to create this file");
            }
            else {
                // Create file
                dirData = sessionStorage.getItem(dirKey);
                // Set inUse bit for directory block to 1
                // Set header tsb to the available dataKey
                dirData = "1 " + dataKey + " " + fileName;
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
                _StdOut.putText("[SUCCESS]: " + fileName + " has been created");
            }
        };
        // Get available dir that is not in use
        DeviceDriverFileSystem.prototype.getFreeDirEntry = function () {
            var key = "";
            var data = "";
            var inUseBit = "";
            for (var i = 0; i < this.sectors; i++) {
                for (var j = 1; j < this.blocks; j++) {
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
            return "null";
        };
        // Get filename
        DeviceDriverFileSystem.prototype.findFilename = function (filename) {
            var key = "";
            var data = "";
            var fileNameHex = this.convertToHex(filename);
            for (var i = 0; i < this.sectors; i++) {
                for (var j = 0; j < this.blocks; j++) {
                    key = "0" + i + j;
                    data = sessionStorage.getItem(key).substring(this.headerSize);
                    // Check if data matches filename
                    if (data == fileNameHex) {
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
