var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.readMemory = function (address) {
            // read memory
            console.log(address);
        };
        MemoryAccessor.prototype.writeMemory = function (address, data) {
            //  write memory
            console.log(address, data);
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
