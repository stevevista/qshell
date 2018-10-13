
export default [
  {
    name: 'DIAG',
    tests: [
      { name: 'Keypress ( 1 )', cmd: 'testDaigKeyPress' },
      { name: 'Read Phone State', cmd: 'testReportPhoneState' },
      { name: 'Power On (Send Sync)', cmd: 'testSendSync' },
      { name: 'ICCID', cmd: 'readICCID' }
    ]
  },
  {
    name: 'Version Info',
    tests: [
      { name: 'Get', cmd: 'testVersionInfo' }
    ]
  },
  {
    name: 'FTM State Control',
    tests: [
      { name: 'Is FTM ?', cmd: 'testIsFTMMode' },
      { name: 'Enter FTM', cmd: 'testEnterFTM' }
    ]
  },
  { name: 'IzAt GNSS Tests',
    tests: []
  },
  { name: 'FTM Bluetooth',
    tests: []
  },
  { name: 'AT commands',
    tests: [
      { name: 'send AT', cmd: 'testAT' }
    ]
  },
  { name: 'FTM PMIC',
    tests: []
  },
  { name: 'Download',
    tests: []
  },
  { name: 'Miscellaneous',
    tests: []
  },
  { name: 'Test Phone Logging',
    tests: []
  },
  { name: 'FTM Audio',
    tests: []
  },
  { name: 'FTM Camera',
    tests: []
  },
  { name: 'SIMLOCK test',
    tests: []
  },
  { name: 'Backup/Restore NV to/from QCN/xQCN without NV Definition file',
    tests: []
  },
  { name: 'Test Library',
    tests: []
  },
  { name: 'Security (GSDI)',
    tests: []
  },
  { name: 'RF Calibration (C2K/GSM/WCDMA/LTE/TDS)',
    tests: []
  },
  { name: 'RF Verification (C2K/GSM/WCDMA/LTE/TDS)',
    tests: []
  },
  { name: 'Test_FTM_DetectCommand',
    tests: []
  },
  { name: 'GSM Diag',
    tests: []
  },
  { name: 'Handset Diag',
    tests: []
  },
  { name: 'FTM WLAN',
    tests: []
  },
  { name: 'FTM Common',
    tests: []
  },
  { name: 'FTM FM (Broadcast Radio)',
    tests: []
  },
  { name: 'FTM Sequencer',
    tests: []
  },
  { name: 'Blow QFPROM in Download Mode',
    tests: []
  },
  { name: 'ESC ET Parser',
    tests: []
  },
  { name: 'FTM ANT',
    tests: []
  },
  { name: 'FTM NFC',
    tests: []
  },
  { name: 'SECURITY ID SENSOR (FPRINT)',
    tests: []
  }
]
