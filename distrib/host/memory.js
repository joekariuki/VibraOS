var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < _ProgramSize; i++) {
                _MemoryArray.push("00");
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
