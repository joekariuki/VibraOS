/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            // Letters
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            
            // Special characters and punctuation
            } else if ((keyCode >= 186) && (keyCode <= 222)) {
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
                } else {
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

            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13) ||                      // enter 
                        (keyCode == 8))  {                      // backspace   
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
                        case  55:
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
        }
    }
}
