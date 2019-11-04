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
const APP_NAME: string = "VibraOS"; // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "1.0"; // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100; // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0; // Page 23.

var _Mode: number = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

// Allocate 256 bytes for program
var _ProgramSize: number = 256;
// Memory size
var _MemorySize: number = _ProgramSize * 3;
var _MemoryArray = [];

// PCB
var _PCB: TSOS.PCB;
var _PID: number = -1;
var _IR: string = "0";
var _Acc: number = 0;
var _PC: number = 0;
var _Xreg: number = 0;
var _Yreg: number = 0;
var _Zflag: number = 0;

var _Quantum: number = 6; //Default Quantum number
var _ClockTicks: number = 0; // Number of clock ticks

// PCB process states
var PS_NEW: string = "New";
var PS_READY: string = "Ready";
var PS_RUNNING: string = "Running";
var PS_WAITING: string = "Waiting";
var PS_TERMINATED: string = "Terminated";

// Run all
var _RunAll: Boolean = false;
// Reset Memory
var _ResetMem: Boolean = false;

var _DONE: boolean = false;

// Declare default base memory
var _BASE: number = 0;
// Declare current memory index
var _CurrMemIndex: number = 0;
// Declare resident queue
var _ResidentQueue: any = [];
// Declare ready queue
var _ReadyQueue: any = [];
// Declare row for eacg program
var _RowNum: number = 0;

var _Canvas: HTMLCanvasElement; // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4; // Additional space added to font size when advancing a line.

var _Trace: boolean = true; // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue: TSOS.Queue = null;
var _KernelInputQueue: TSOS.Queue = null;
var _KernelBuffers = null;

// Standard input and output
var _StdIn: TSOS.Console = null;
var _StdOut: TSOS.Console = null;

// Memory
var _CurrentProgram: TSOS.PCB;
var _Memory: TSOS.Memory;
var _MemoryManager: TSOS.MemoryManager;
var _MemoryAccessor: TSOS.MemoryAccessor;
// Declare start index for each program
var _BaseProgram: number = 0;
// Declare program input
var _ProgramInput = "";

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver: TSOS.DeviceDriverKeyboard = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
  TSOS.Control.hostInit();
};
