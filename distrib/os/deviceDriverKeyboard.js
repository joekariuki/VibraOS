/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
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
    var DeviceDriverKeyboard = /** @class */ (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            // Letters
            if (((keyCode >= 65) && (keyCode <= 90)) || // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) { // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
                // Refactor code below
                // Special characters and punctuation
            }
            else if ((keyCode >= 186) && (keyCode <= 222)) {
                if (isShifted) {
                    switch (keyCode) {
                        case 186:
                            chr = ":";
                            break;
                        case 187:
                            chr = "+";
                            break;
                        case 188:
                            chr = "<";
                            break;
                        case 189:
                            chr = "_";
                            break;
                        case 190:
                            chr = ">";
                            break;
                        case 191:
                            chr = "?";
                            break;
                        case 192:
                            chr = "~";
                            break;
                        case 219:
                            chr = "{";
                            break;
                        case 220:
                            chr = "|";
                            break;
                        case 221:
                            chr = "}";
                            break;
                        case 222:
                            chr = '""';
                            break;
                        default:
                            chr = String.fromCharCode(keyCode);
                    }
                    _KernelInputQueue.enqueue(chr);
                }
                else {
                    switch (keyCode) {
                        case 186:
                            chr = ";";
                            break;
                        case 187:
                            chr = "=";
                            break;
                        case 188:
                            chr = ",";
                            break;
                        case 189:
                            chr = "-";
                            break;
                        case 190:
                            chr = ".";
                            break;
                        case 191:
                            chr = "/";
                            break;
                        case 192:
                            chr = "`";
                            break;
                        case 219:
                            chr = "[";
                            break;
                        case 220:
                            chr = "\\";
                            break;
                        case 221:
                            chr = "]";
                            break;
                        case 222:
                            chr = "'";
                            break;
                        default:
                            chr = String.fromCharCode(keyCode);
                    }
                    _KernelInputQueue.enqueue(chr);
                }
            }
            else if (keyCode == 38) {
                chr = "&uarr;";
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 40) {
                chr = "&darr;";
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) || // digits
                (keyCode == 32) || // space
                (keyCode == 13) || // enter 
                (keyCode == 8) || // backspace 
                (keyCode == 9)) { // tab
                chr = String.fromCharCode(keyCode);
                // Shifted special number characters and punctiation
                if (isShifted) {
                    switch (keyCode) {
                        case 49:
                            chr = "!";
                            break;
                        case 48:
                            chr = ")";
                            break;
                        case 55:
                            chr = "&";
                            break;
                        case 54:
                            chr = "^";
                            break;
                        case 50:
                            chr = "@";
                            break;
                        case 52:
                            chr = "$";
                            break;
                        case 57:
                            chr = "(";
                            break;
                        case 51:
                            chr = "#";
                            break;
                        case 53:
                            chr = "%";
                            break;
                        case 56:
                            chr = "*";
                            break;
                    }
                }
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
