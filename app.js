const emu = require("./app2.js");
const fs = require("fs");

let d = fs.readFileSync("inputfile.txt.rillo");
console.log(d);

const emulator = new emu(d);
emulator.run();