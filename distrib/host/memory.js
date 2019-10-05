///<reference path="../globals.ts" />
/* ------------
     memory.ts
     Requires global.ts.
     Defines a base memory class. Handles memory
     ------------ */
/* ------------
     memory.ts
     Requires global.ts.
     Defines a base memory class. Handles memory
     ------------ */
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(bytes) {
            if (bytes === void 0) { bytes = new Array(SEGMENT_SIZE * SEGMENT_COUNT); }
            this.bytes = bytes;
            this.zeroBytes(0, bytes.length);
        }
        Memory.prototype.setBytes = function (location, bytes) {
            for (var i = 0; i < bytes.length; i++) {
                this.bytes[location + i] = bytes[i];
            }
        };
        Memory.prototype.getBytes = function (location, size) {
            if (size === void 0) { size = 1; }
            var locSize = location + size;
            if (size < 0) {
                return [];
            }
            return this.bytes.slice(location, locSize);
        };
        Memory.prototype.zeroBytes = function (location, size) {
            var locSize = location + size;
            for (var i = location; i < locSize; i++) {
                this.bytes[i] = 0x0;
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
