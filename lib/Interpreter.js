const LOADMODE = 1;
const STOREMODE = 2;
const COPYMODE = LOADMODE | STOREMODE;
const BRANCHMODE = 4;
const NEGATOR = BRANCHMODE;
const MARITH = 8;
const MADDMODE = 0;
const MSUBMODE = MARITH & 2;
const MMULMODE = LOADMODE | STOREMODE;
const MDIVMODE = MARITH & 5;
const LITMODE = BRANCHMODE & STOREMODE & LOADMODE;

let TESTPROGRAM;

/**
 *
 *
 * @class Emu2
 */
class Emu2 {
    get regA() {
        return this.registers[0];
    }

    get regB() {
        return this.registers[1];
    }

    get regC() {
        return this.registers[2];
    }

    get regD() {
        return this.registers[3];
    }

    registers = new Uint8Array(4);
    stack = new Uint8Array(0xFF);

    ip = 0;
    sp = 0;
    on = true;

    constructor(prg = null) {
        //    TESTPROGRAM = Uint8Array.from([0x17, 0x40, 0x27, 0x10, 0x38, 0xFF]);   //A and B
        if (prg === null) {
            prg = new Array(1);
            prg.fill(0xFF);
        }
        TESTPROGRAM = Uint8Array.from(prg);
    }

    reset() {
        this.registers.fill(0);

        this.stack.fill(0xA);

        this.registers.fill(0);
    }

    cycle() {
        let inst = this.decode(this.pullFromProgramMemory());
        this.executeCycle(inst[0], inst[1]);
    }

    run() {
        while (this.on) {
            this.cycle();
        }
    }

    jumpToInstruction(inst) {
        this.ip = ++inst;
        console.log("Executing at " + this.ip);
    }

    pullFromProgramMemory() {
        let d = TESTPROGRAM[this.ip];
        this.ip++;

        return d;
    }

    decode(inst) {
        // console.log(inst);
        if (!inst) return [0, 0];  //NOOP

        let mode = inst & 0xF;
        let regs = inst >> 4;

        return [regs, mode];
    }

    //Pulls next byte from program instructions, used for literal assignments of registers
    getNextByte(length = 1) {
        let b = 0;
        for (let i = 0; i < length; i++) {
            b = (b << i * 8) & this.pullFromProgramMemory();
        }
        return b;
    }

    executeCycle(registers, mode) {

        //Chip Commands are easy, because we just have to check if all registers are set to TRUE
        if (registers === 0b1111) {
            //Special Mode, used to control the CPU itself
            let flags = this.convertRegistersToIndexes(mode);
            this.runChipMethod(flags);
            return;
        }

        //Because Arithmethic Mode only gets invoked when the ARITH Flag is on, we can check for this flag
        //We then execute a subroutine so we don't clutter the current scope
        if (mode & MARITH) {
            //Switch to arithmethic mode because its syntax is different sadly
            this.doMath(mode & 0b0111, registers);
            return;
        }

        if (mode === LOADMODE) {    //Fortunately, the LOADMODE can be checked by comparing the mode with the bitmask alone
            console.log("Loadmode");
            let regs = this.convertRegistersToIndexes(registers);
            this.loadIntoRegister(...regs, mode);
            return;
        } else if (mode === STOREMODE) {    //Same as the LAODMODE
            console.log("Storemode");
            let regs = this.convertRegistersToIndexes(registers);
            this.pushRegisterToStack(...regs, mode);
            return;
        }

        console.log(((registers << 4 | mode) & COPYMODE));

        if (((registers << 4 | mode) & COPYMODE) >= 2) {
            let indexes = this.convertRegistersToIndexes(registers, (mode & LOADMODE) === 1);
            if (indexes.length === 1) { //Literal Mode or Copymode?
                this.insertIntoRegister(...indexes);
                return;
            }
            console.log("Copymode");
            this.copyRegisters(...indexes);
            return;
        }

        if ((mode & BRANCHMODE) > 0) {
            console.log("Branchmode");
            let indexes = this.convertRegistersToIndexes(registers, (mode & LOADMODE) === 1).length;
            if (!indexes) {  //unconditional
                this.stack[this.sp] = this.ip;
                this.jumpToInstruction(this.pullFromProgramMemory());
            } else {
                this.jump((mode & 0b01) === 1, ...indexes);
            }
            return;
        }

        console.log("no operation, cycling");
    }

    runChipMethod(method) {
        method.map((val, index) => {
            if ((val & (index ** 2)) > 0) {
                return true;
            } else {
                return false;
            };
        }).forEach((value, index) => {
            switch (index) {
                case 0:
                    if (value) {
                        //reserved
                    }
                    break;

                case 1:
                    if (value) {
                        //reserved
                        console.log("DEBUG");
                        console.log(this);
                    }
                    break;

                case 2:
                    if (value) {
                        this.reset();
                    }
                    break;

                case 3:
                    if (value) {
                        this.on = !this.on;
                        console.log("HALTED because of command");
                    }
                    break;
            }
        });
    }

    doMath(mode, regs) {
        let r = this.convertRegistersToIndexes(regs, (mode & STOREMODE) === 1);
        if (mode === MADDMODE) {
            //Addition
            console.log("Addition");
            this.mathAdd(...r);
            return;
        }

        if (mode === MMULMODE) {
            //Multiplication
            console.log("Multiplication Mode");
            this.mathMul(...r);
            return;
        }

        if (((mode & 2) > 0) && ((mode & 1) === 0)) {
            //Subtraction
            console.log("Subtraction");
            if ((mode & BRANCHMODE) > 0) r.reverse();
            this.mathSub(...r);
            return;
        }

        if (((mode & LOADMODE)) > 0) {
            //division
            console.log("division");
            if ((mode & STOREMODE) > 0) r.reverse();
            this.mathDiv(...r);
            return;
        }
    }

    loadIntoRegister(reg) {
        this.registers[reg] = this.pullFromStack();
    }

    pushRegisterToStack(reg, mode) {
        this.pushToStack(this.registers[reg]);
    }

    pushToStack(data) {
        this.stack[this.sp] = data;
        this.sp++;
        if (this.sp > this.stack.length) {
            this.sp = 0;
        }
    }

    pullFromStack() {
        let data = this.stack[this.sp];

        this.sp--;
        if (this.sp < 0) {
            this.sp = 0xFF;
        }
        return data;
    }

    copyRegisters(from, to) {
        this.registers[to] = this.registers[from];
    }

    cp(regs) {
        let a = [];
        for (let i = 0; i < 4; i++) {
            let cond = (2 ** i);

            if ((cond & regs) > 0) a.push(cond);
        }

        return a;
    }

    convertRegistersToIndexes(regs, reverse = false) {

        let extracted = this.cp(regs);
        if (reverse) extracted.reverse();
        return extracted;
    }

    jump(negator, register) {
        this.stack[this.sp] = this.ip;
        if (negator) {
            if (this.registers[register] === 1) {
                this.jumpToInstruction(this.pullFromProgramMemory());
            }
        } else {
            if (this.registers[register] !== 1) {
                this.jumpToInstruction(this.pullFromProgramMemory());
            }
        }
    }

    insertIntoRegister(reg) {
        console.log("Literal Mode", reg);
        this.registers[reg] = this.pullFromProgramMemory();
        // console.log(this.registers);
    }

    mathAdd(from, to) {
        this.registers[to] += this.registers[from];
    }

    mathSub(from, to) {
        this.registers[to] -= this.registers[from];
    }

    mathMul(from, to) {
        this.registers[to] *= this.registers[from];
    }

    mathDiv(from, to) {
        this.registers[to] /= this.registers[from];
    }
}

module.exports = Emu2;