///<reference path="../globals.js" />
///<reference path="deviceDriver.js" />
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var TSOS;
(function(TSOS) {
  // Extends DeviceDriver
  var DeviceDriverFileSystem = /** @class */ (function(_super) {
    __extends(DeviceDriverFileSystem, _super);
    function DeviceDriverFileSystem(
      tracks,
      sectors,
      blocks,
      blockSize,
      dataSize,
      headerSize
    ) {
      if (tracks === void 0) {
        tracks = 4;
      }
      if (sectors === void 0) {
        sectors = 8;
      }
      if (blocks === void 0) {
        blocks = 8;
      }
      if (blockSize === void 0) {
        blockSize = 64;
      }
      if (dataSize === void 0) {
        dataSize = 60;
      }
      if (headerSize === void 0) {
        headerSize = 4;
      }
      var _this = _super.call(this) || this;
      _this.tracks = tracks;
      _this.sectors = sectors;
      _this.blocks = blocks;
      _this.blockSize = blockSize;
      _this.dataSize = dataSize;
      _this.headerSize = headerSize;
      return _this;
    }
    // Initalize blocks with " - " and " 0 "
    DeviceDriverFileSystem.prototype.initializeBlock = function() {
      var data = "0";
      //initialize tsb with -
      for (var i = 1; i < this.headerSize; i++) {
        data += "-";
      }
      //intitialize data with 0s
      for (var i = 4; i < this.dataSize; i++) {
        data += "0";
      }
      return data;
    };
    //converts the string-data provided to hex
    DeviceDriverFileSystem.prototype.convertToHex = function(data) {
      var hexString = "";
      //converts a char at an index to hex and builds the string
      for (var i = 0; i < data.length; i++) {
        hexString += data.charCodeAt(i).toString(16);
      }
      return hexString;
    };
    return DeviceDriverFileSystem;
  })(TSOS.DeviceDriver);
  TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
