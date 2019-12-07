/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "VibraOS"; // 'cause Bob and I were at a loss for a better name.
var APP_VERSION = "1.0"; // What did you expect?
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var SYSCALL_IRQ = 2;
var BREAK_IRQ = 3;
var INVALIDOPCODE_IRQ = 4;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
// Allocate 256 bytes for program
var _ProgramSize = 256;
// Memory size
var _MemorySize = _ProgramSize * 3;
var _MemoryArray = [];
// PCB
// var _PCB: TSOS.PCB;
var _PID = -1;
var _IR = "NA";
var _Acc = 0;
var _PC = 0;
var _Xreg = 0;
var _Yreg = 0;
var _Zflag = 0;
var _Quantum = 6; //Default Quantum number
var _ClockTicks = 0; // Number of clock ticks
var _WaitTime = 1; // Initialize wait time
var _TaTime = 1; // Initialize turn around time
// PCB process states
var PS_NEW = "New";
var PS_READY = "Ready";
var PS_RUNNING = "Running";
var PS_WAITING = "Waiting";
var PS_TERMINATED = "Terminated";
// Run all
var _RunAll = false;
// Reset Memory
var _ResetMem = false;
var _DONE = false;
// Declare default base memory
var _BASE = 0;
// Declare current memory index
var _CurrMemIndex = 0;
// Declare resident queue
var _ResidentQueue = [];
// Declare ready queue
var _ReadyQueue = [];
// Declare row for eacg program
var _RowNum = 0;
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelInputQueue = null;
var _KernelBuffers = null;
// Standard input and output
var _StdIn = null;
var _StdOut = null;
// Memory
var _CurrentProgram;
var _Memory;
var _MemoryManager;
var _MemoryAccessor;
// Declare start index for each program
var _BaseProgram = 0;
// Declare program input
var _ProgramInput = "";
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
