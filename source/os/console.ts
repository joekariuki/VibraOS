/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public prevCommandHistory = [], // Old commands
                    public recCommandHistory = [],  // Most recent commands
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        // Clears line
        public clearLine(): void {
            this.currentXPosition = 0;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, _Canvas.width, this.consoleLineHeight());
            _StdOut.putText(_OsShell.promptStr);
        }

        // Handles Scrolling
        public consoleLineHeight(): number {
            return _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                // Tab Key - autocomplete comes first
                if (chr === String.fromCharCode(9)) {
                    this.tabComplete(this.buffer);
                } 
                // Enter key
                else if (chr === String.fromCharCode(13)) { 
                    // The enter key marks the end of a console command, so ...
                    // buffer is empty; advance line and do not process command
                    if (this.buffer.length == 0) { 
                        this.advanceLine();
                        _OsShell.putPrompt();
                        return;
                    }
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // Add initial entered command
                    this.prevCommandHistory.push(this.buffer);

                    // Reset buffer.
                    this.buffer = "";
                
                } else if (chr === "&uarr;") { // Up arrow key
                    this.recCommandHistory.push(this.buffer);
                    // Clear line
                    this.clearLine();
                    // Reset buffer
                    this.buffer = "";
                    // Set previous command
                    let prevCmd = this.prevCommandHistory.pop();
                    // Display previous command
                    this.putText(prevCmd);
                    // Set buffer to previous command
                    this.buffer = prevCmd;

                    // // debug
                    // console.log(prevCmd);


                } else if (chr === "&darr;") { // Down arrow key
                    this.prevCommandHistory.push(this.buffer);
                    // Clear line
                    this.clearLine();
                    // Reset buffer
                    this.buffer = "";
                    // Set recent command
                    let recentCmd = this.recCommandHistory.pop();
                    // Display most recent command
                    this.putText(recentCmd);
                    // Set buffer to most recent command
                    this.buffer = recentCmd;

                    // // debug
                    // console.log(recentCmd);

                }
                // Backspace key
                else if (chr === String.fromCharCode(8)) {
                    // Get last character in buffer
                    let lastChar = this.buffer.slice(-1); 
                    // Get backspace width
                    let backspaceWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);
                    // Get backspace height
                    let backspaceHeight = this.consoleLineHeight();
                    // Decrement current position by size of backspace width
                    this.currentXPosition -= backspaceWidth;
                    //  Delete character using clearRect
                    _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - backspaceHeight + _FontHeightMargin, backspaceWidth, backspaceHeight);
                    // Remove character from buffer
                    this.buffer = this.buffer.slice(0, -1);
                    // Check if last character from line deleted, and snap back to last line if needed
                    if (this.currentXPosition <= 0) {
                        this.currentYPosition -= this.consoleLineHeight();
                        // xPosition is used to compute where to place the cursor on the previous line
                        var xPosition = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _OsShell.promptStr + this.buffer);
                        xPosition = xPosition % _Canvas.width; // If there are multiple lines worth of text in the buffer, calculate the width of the last line
                        this.currentXPosition = xPosition;
                    }
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }


        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */

            // Line Wrap
            if (text !== "") {
                let lineWrappedText = this.lineWrapText(text);
                for (let i = 0; i < lineWrappedText.length; i++) {
                    let line = lineWrappedText[i];
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, line);
                    // Move the current X position.
                    let offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, line);
                    this.currentXPosition = this.currentXPosition + offset;
                    if (i+1 < lineWrappedText.length) { this.advanceLine(); }
                }
            }
         }

         public tabComplete(prefix): void {
            // Check if buffer is empty
            if (prefix.length === 0) { return; }
            let prefixCommands = _OsShell.commandList.filter((cmd) => {
                // Returns true command has prefix
                 return cmd.command.startsWith(prefix); 
            });
            // Check if prefix has only 1 possible command
            if (prefixCommands.length == 1) { 
                let currCmd = prefixCommands[0].command;
                // Clear line
                this.clearLine();
                this.putText(currCmd);
                this.buffer = currCmd;
            } 
            // Check if prefix has multiple possible commands
            else if (prefixCommands.length > 1) { 
                // Get appropriate command names and join with a space
                let commandNames = prefixCommands.map((cmd) => { return cmd.command; }).join(" ");
                this.advanceLine();
                // Display all possible commands with prefix
                this.putText(commandNames);
                this.advanceLine();
                // Prepare for next input
                _OsShell.putPrompt();
                // Restore buffer
                this.putText(this.buffer);
            }
        }

        public advanceLine(): void {
            this.currentXPosition = 0;

            // Assign current Y position to console height
            this.currentYPosition += this.consoleLineHeight();
            
            // Check if current position cursor is at bottom of canvas
            if (this.currentYPosition >= _Canvas.height) {
                // Assign scroll distance
                let scrollYBy = this.currentYPosition-_Canvas.height + _FontHeightMargin;
                // Capture console contents
                let screenShot = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                // Clear console
                this.clearScreen();
                // Subtract current position by scroll distance
                this.currentYPosition -= scrollYBy;
                // Display console contents one line down
                _DrawingContext.putImageData(screenShot, 0, -scrollYBy);
            }
        }

        public lineWrapText(text): string[] {
            let buffer = "";
            let lineWrappedText: string[] = [];
            // Get available space on current line
            let availableWidth = _Canvas.width - this.currentXPosition;
            
            while (text.length > 0) {
                // Add character by character while width of buffer is smaller than the available width of canvas
                while (text.length > 0 &&
                _DrawingContext.measureText(this.currentFont, this.currentFontSize, (buffer + text.charAt(0))) <= availableWidth) {
                    buffer += text.charAt(0);
                    text = text.slice(1);
                }
                lineWrappedText.push(buffer);
                buffer = "";
                // Assign availabe width to canvas width
                availableWidth = _Canvas.width; 
            }
            return lineWrappedText;
        }
    }
}
