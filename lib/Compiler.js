// let emu = require("./Interpreter");
let opcodes = require("./OpcodeTable");
let fs = require("fs");

function removeComments(prg) {
    let file = prg.replaceAll("\r", "");

    let g = file.split("\n");
    g = g.map((e) => {
        
        let commIndex = e.indexOf(";");
        if ( commIndex !== -1 ) {
            return e.substring(0, commIndex).trim();
        } else {
            return e;
        }
    });

    return g;
}

let file = fs.readFileSync(process.argv[2]).toString();


file = removeComments(file);
// console.log(file);

console.log(Object.keys(opcodes));
// debugger;

let ip = 0;
// let skipNext = false;
while (ip < file.length) {
    let currentInstruction = file[ip].trim().toUpperCase();
    console.log(Object.keys(opcodes).includes(currentInstruction));

    //lookup instruction
    if (Object.keys(opcodes).includes(currentInstruction)) {
        file[ip] = opcodes[currentInstruction].code;
        if (opcodes[currentInstruction].jumpNext ?? false) {
            console.log("Jumping next instruction");
        }
    } else {
        console.log("Unknown Mnemonic found at " + ip);
        process.exit(-1);
    }
    ip++;
}

// fs.writeFileSync(process.argv[2] + ".rillo", complete.toString());
console.log(file);
fs.createWriteStream(process.argv[2] + ".rillo").write(Buffer.from(file));