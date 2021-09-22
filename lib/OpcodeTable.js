module.exports = {
    "NOP": {
        code: 0x0
    },
    "JMP": {
        code: 0x4,
        jumpNext: true
    },
    "LDA": {
        code: 0x11
    },
    "STA": {
        code: 0x12
    },
    "JA": {
        code: 0x14,
        jumpNext: true
    },
    "JAN": {
        code: 0x15,
        jumpNext: true
    },
    "ILA": {
        code: 0x17,
        jumpNext: true
    },
    "LDB": {
        code: 0x21
    },
    "STB": {
        code: 0x22
    },
    "JB": {
        code: 0x24,
        jumpNext: true
    },
    "JBN": {
        code: 0x25,
        jumpNext: true
    },
    "ILB": {
        code: 0x27,
        jumpNext: true
    },
    "CAB": {
        code: 0x36
    },
    "CBA": {
        code: 0x37
    },
    "AAB": {
        code: 0x38
    },
    "SAB": {
        code: 0x3A
    },
    "MAB": {
        code: 0x3B
    },
    "DAB": {
        code: 0x3D
    },
    "SBA": {
        code: 0x3E
    },
    "DBA": {
        code: 0x3F
    },
    "LDC": {
        code: 0x41
    },
    "STC": {
        code: 0x42
    },
    "JC": {
        code: 0x44
    },
    "JCN": {
        code: 0x45
    },
    "ILC": {
        code: 0x47,
        jumpNext: true
    },
    "CAC": {
        code: 0x56,
        jumpNext: true
    },
    "CCA": {
        code: 0x57
    },
    "AAC": {
        code: 0x58
    },
    "SAC": {
        code: 0x5A
    },
    "MAC": {
        code: 0x5B
    },
    "DAC": {
        code: 0x5D
    },
    "SCA": {
        code: 0x5E
    },
    "DCA": {
        code: 0x5F
    },
    "CBC": {
        code: 0x66
    },
    "CCB": {
        code: 0x67
    },
    "ABC": {
        code: 0x68
    },
    "SBC": {
        code: 0x6A
    },
    "MBC": {
        code: 0x6B
    },
    "DBC": {
        code: 0x6D
    },
    "SCB": {
        code: 0x6E
    },
    "DCB": {
        code: 0x6F
    },
    "LDD": {
        code: 0x81
    },
    "STD": {
        code: 0x82
    },
    "JD": {
        code: 0x84,
        jumpNext: true
    },
    "JDN": {
        code: 0x85,
        jumpNext: true
    },
    "ILD": {
        code: 0x87,
        jumpNext: true
    },
    "CAD": {
        code: 0x96
    },
    "CDA": {
        code: 0x97
    },
    "AAD": {
        code: 0x98
    },
    "SAD": {
        code: 0x9A
    },
    "MAD": {
        code: 0x9B
    },
    "DAD": {
        code: 0x9D
    },
    "SDA": {
        code: 0x9E
    },
    "DDA": {
        code: 0x9F
    },
    "CBD": {
        code: 0xA6
    },
    "CDB": {
        code: 0xA7
    },
    "ABD": {
        code: 0xA8
    },
    "SBD": {
        code: 0xAA
    },
    "MBD": {
        code: 0xAB
    },
    "DBD": {
        code: 0xAD
    },
    "SDB": {
        code: 0xAE
    },
    "DDB": {
        code: 0xAF
    },
    "CCD": {
        code: 0xC6
    },
    "CDC": {
        code: 0xC7
    },
    "ACD": {
        code: 0xC8
    },
    "SCD": {
        code: 0xCA
    },
    "MCD": {
        code: 0xCB
    },
    "DCD": {
        code: 0xCD
    },
    "SDC": {
        code: 0xCE
    },
    "DDC": {
        code: 0xCF
    },
    "DBG": {
        code: 0xFC
    },
    "RST": {
        code: 0xFE
    },
    "HLT": {
        code: 0xFF
    }
}