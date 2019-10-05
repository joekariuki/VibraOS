
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

module TSOS {

    export class Memory {

        constructor(public bytes: number[] = new Array(SEGMENT_SIZE*SEGMENT_COUNT)) {
            this.zeroBytes(0, bytes.length);
        }

        public setBytes(location: number, bytes: number[]): void {
            for (var i = 0; i < bytes.length; i++) {
                this.bytes[ location + i ] = bytes[i];
            }
        }

        public getBytes(location: number, size: number = 1): number[] {
            let locSize = location + size;
            if (size < 0) {
                return [];
            }
            return this.bytes.slice(location, locSize);
        }

        public zeroBytes(location: number, size: number): void {
            let locSize = location + size;
            for (let i = location; i < locSize; i++) {
                this.bytes[i] = 0x0;
            }
        }

    }
}