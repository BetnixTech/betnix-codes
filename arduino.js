// Ultimate Enhanced Arduino Simulator State & Core
const arduinoState = {
  pins: {}, // pinNumber: {mode: INPUT|OUTPUT, value: 0|1|0-255 for PWM}
  serialBuffer: [],
  serialInputBuffer: [], // for Serial.read()
  millisCounter: 0,
  variables: {}, // variables storage (int, bool, float, etc)
  startTime: Date.now(),
  eventQueue: [], // for async delay simulation
  isDelaying: false,
};

const PIN_MODES = {
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
  ANALOG: 'ANALOG',
};

const HIGH = 1;
const LOW = 0;

// Helper: Clear state and start fresh
function reset() {
  arduinoState.pins = {};
  arduinoState.serialBuffer = [];
  arduinoState.serialInputBuffer = [];
  arduinoState.millisCounter = 0;
  arduinoState.variables = {};
  arduinoState.eventQueue = [];
  arduinoState.isDelaying = false;
  arduinoState.startTime = Date.now();
  console.log('[SIM] Arduino state reset.');
}

// Mock Arduino Functions
const mockFunctions = {
  pinMode(pin, mode) {
    arduinoState.pins[pin] = { mode, value: 0 };
    console.log(`[SIM] pinMode(${pin}, ${mode})`);
  },

  digitalWrite(pin, val) {
    const p = arduinoState.pins[pin];
    if (p && p.mode === PIN_MODES.OUTPUT) {
      p.value = val ? HIGH : LOW;
      console.log(`[SIM] digitalWrite(${pin}, ${val ? 'HIGH' : 'LOW'})`);
    } else {
      console.warn(`[SIM] digitalWrite ignored: pin ${pin} not OUTPUT`);
    }
  },

  digitalRead(pin) {
    const p = arduinoState.pins[pin];
    if (!p) {
      console.warn(`[SIM] digitalRead pin ${pin} not initialized`);
      return LOW;
    }
    if (p.mode === PIN_MODES.INPUT) {
      // Return set input value or LOW if undefined
      return p.value !== undefined ? p.value : LOW;
    } else if (p.mode === PIN_MODES.OUTPUT) {
      return p.value;
    }
    return LOW;
  },

  analogWrite(pin, val) {
    const p = arduinoState.pins[pin];
    if (p && p.mode === PIN_MODES.OUTPUT) {
      p.value = Math.min(255, Math.max(0, val));
      console.log(`[SIM] analogWrite(${pin}, ${val})`);
    } else {
      console.warn(`[SIM] analogWrite ignored: pin ${pin} not OUTPUT`);
    }
  },

  analogRead(pin) {
    const p = arduinoState.pins[pin];
    if (p && p.mode === PIN_MODES.INPUT) {
      // Simulate analog input: value 0-1023, random for now
      const val = Math.floor(Math.random() * 1024);
      console.log(`[SIM] analogRead(${pin}) => ${val}`);
      return val;
    }
    console.warn(`[SIM] analogRead pin ${pin} not INPUT`);
    return 0;
  },

  delay(ms) {
    console.log(`[SIM] delay(${ms}ms)`);
    arduinoState.isDelaying = true;
    // Synchronously pause the simulation for now (bad for UI, but simple)
    const start = Date.now();
    while (Date.now() - start < ms) { /* busy wait */ }
    arduinoState.isDelaying = false;
  },

  millis() {
    return Date.now() - arduinoState.startTime;
  },

  Serial: {
    println(message) {
      arduinoState.serialBuffer.push(String(message));
      console.log(`[SERIAL] ${message}`);
    },
    read() {
      if (arduinoState.serialInputBuffer.length === 0) return -1;
      return arduinoState.serialInputBuffer.shift();
    },
    available() {
      return arduinoState.serialInputBuffer.length;
    },
    // Simulate feeding serial input
    feedInput(data) {
      if (typeof data === 'string') {
        for (const ch of data) {
          arduinoState.serialInputBuffer.push(ch.charCodeAt(0));
        }
      } else if (Array.isArray(data)) {
        arduinoState.serialInputBuffer.push(...data);
      }
    }
  }
};

// Expression evaluator with support for variables and basic math
function evaluateExpression(expr) {
  // Remove comments
  expr = expr.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Replace variable names with values (including booleans and floats)
  expr = expr.replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
    if (mockFunctions[match] !== undefined) return match; // skip function names
    if (arduinoState.variables.hasOwnProperty(match)) {
      return arduinoState.variables[match];
    }
    if ([HIGH, LOW, INPUT, OUTPUT].includes(match)) {
      return match;
    }
    return match;
  });

  try {
    // Evaluate with safe Math functions allowed
    const func = new Function('Math', `return ${expr};`);
    return func(Math);
  } catch (e) {
    console.warn(`[EVAL ERROR] ${expr} - ${e.message}`);
    return 0;
  }
}

// Parsing and executing code lines, supporting:
// variable declarations (int, float, bool), assignments, control flow (if, for, while), function calls
function parseAndExecute(code) {
  // Remove comments
  code = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  // Tokenize by lines, keeping track of blocks
  const lines = [];
  let currentLine = '';
  let braceLevel = 0;
  for (let c of code) {
    currentLine += c;
    if (c === '{') braceLevel++;
    if (c === '}') braceLevel--;
    if ((c === ';' || (braceLevel === 0 && c === '}')) && currentLine.trim()) {
      lines.push(currentLine.trim());
      currentLine = '';
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip empty
    if (!line) continue;

    // Variable declaration or assignment: int x = 5; float y= 3.14; bool flag = true;
    let varDeclMatch = line.match(/^(int|float|bool)?\s*([a-zA-Z_]\w*)\s*=\s*(.+);?$/);
    if (varDeclMatch) {
      const [, type, varName, expr] = varDeclMatch;
      let val = evaluateExpression(expr);
      if (type === 'bool') {
        val = !!val;
      } else if (type === 'int') {
        val = parseInt(val);
      } else if (type === 'float') {
        val = parseFloat(val);
      }
      arduinoState.variables[varName] = val;
      console.log(`[VAR] ${varName} = ${val}`);
      continue;
    }

    // Assignment only: x = 10;
    let assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+);?$/);
    if (assignMatch) {
      const [, varName, expr] = assignMatch;
      const val = evaluateExpression(expr);
      arduinoState.variables[varName] = val;
      console.log(`[VAR] ${varName} = ${val}`);
      continue;
    }

    // if statement
    if (line.startsWith('if')) {
      let conditionMatch = line.match(/^if\s*\((.+)\)\s*\{?$/);
      if (conditionMatch) {
        const condition = conditionMatch[1];
        let blockCode = '';
        let braceCount = 0;
        // Collect block lines
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('{')) braceCount++;
          if (lines[j].includes('}')) braceCount--;
          if (braceCount < 0) {
            i = j;
            break;
          }
          if (braceCount >= 0) blockCode += lines[j] + '\n';
          if (braceCount === 0 && lines[j].includes('}')) {
            i = j;
            break;
          }
        }
        if (evaluateExpression(condition)) {
          parseAndExecute(blockCode);
        }
        continue;
      }
    }

    // while loop
    if (line.startsWith('while')) {
      let whileMatch = line.match(/^while\s*\((.+)\)\s*\{?$/);
      if (whileMatch) {
        const condition = whileMatch[1];
        let blockCode = '';
        let braceCount = 0;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('{')) braceCount++;
          if (lines[j].includes('}')) braceCount--;
          if (braceCount < 0) {
            i = j;
            break;
          }
          if (braceCount >= 0) blockCode += lines[j] + '\n';
          if (braceCount === 0 && lines[j].includes('}')) {
            i = j;
            break;
          }
        }
        // Run the while loop safely with max iterations
        let safety = 1000;
        while (evaluateExpression(condition) && safety > 0) {
          parseAndExecute(blockCode);
          safety--;
        }
        if (safety === 0) {
          console.warn('[SIM] Safety break on while loop to prevent infinite loops');
        }
        continue;
      }
    }

    // for loop: for (int i=0; i<5; i=i+1)
    if (line.startsWith('for')) {
      let forMatch = line.match(/^for\s*\((.+);(.+);(.+)\)\s*\{?$/);
      if (forMatch) {
        const [_, init, condition, increment] = forMatch;
        parseAndExecute(init + ';'); // initialize
        let blockCode = '';
        let braceCount = 0;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes('{')) braceCount++;
          if (lines[j].includes('}')) braceCount--;
          if (braceCount < 0) {
            i = j;
            break;
          }
          if (braceCount >= 0) blockCode += lines[j] + '\n';
          if (braceCount === 0 && lines[j].includes('}')) {
            i = j;
            break;
          }
        }
        let safety = 1000;
        while (evaluateExpression(condition) && safety > 0) {
          parseAndExecute(blockCode);
          parseAndExecute(increment + ';');
          safety--;
        }
        if (safety === 0) {
          console.warn('[SIM] Safety break on for loop to prevent infinite loops');
        }
        continue;
      }
    }

    // Function calls
    // pinMode(pin, mode)
    let pinModeMatch = line.match(/pinMode\s*\(\s*(\d+)\s*,\s*(\w+)\s*\);?/);
    if (pinModeMatch) {
      const pin = parseInt(pinModeMatch[1]);
      const mode = pinModeMatch[2];
      mockFunctions.pinMode(pin, mode);
      continue;
    }

    // digitalWrite(pin, value)
    let digitalWriteMatch = line.match(/digitalWrite\s*\(\s*(\d+)\s*,\s*([a-zA-Z0-9_]+)\s*\);?/);
    if (digitalWriteMatch) {
      const pin = parseInt(digitalWriteMatch[1]);
      const val = arduinoState.variables[digitalWriteMatch[2]] !== undefined ? arduinoState.variables[digitalWriteMatch[2]] : (digitalWriteMatch[2] === 'HIGH' ? HIGH : LOW);
      mockFunctions.digitalWrite(pin, val);
      continue;
    }

    // analogWrite(pin, value)
    let analogWriteMatch = line.match(/analogWrite\s*\(\s*(\d+)\s*,\s*(.+)\);?/);
    if (analogWriteMatch) {
      const pin = parseInt(analogWriteMatch[1]);
      const val = evaluateExpression(analogWriteMatch[2]);
      mockFunctions.analogWrite(pin, val);
      continue;
    }

    // digitalRead(pin) -> var assignment or expression
    let digitalReadMatch = line.match(/digitalRead\s*\(\s*(\d+)\s*\)/);
    if (digitalReadMatch) {
      // replace with value in expression parsing
      const val = mockFunctions.digitalRead(parseInt(digitalReadMatch[1]));
      // NOTE: No assignment here, used in expression only
      continue;
    }

    // analogRead(pin) -> var assignment or expression
    let analogReadMatch = line.match(/analogRead\s*\(\s*(\d+)\s*\)/);
    if (analogReadMatch) {
      // replace with value in expression parsing
      const val = mockFunctions.analogRead(parseInt(analogReadMatch[1]));
      continue;
    }

    // delay(ms)
    let delayMatch = line.match(/delay\s*\(\s*(\d+)\s*\);?/);
    if (delayMatch) {
      mockFunctions.delay(parseInt(delayMatch[1]));
      continue;
    }

    // Serial.println(...)
    let serialPrintlnMatch = line.match(/Serial\.println\s*\(\s*("?)(.+?)\1\s*\);?/);
    if (serialPrintlnMatch) {
      let msg = serialPrintlnMatch[2];
      // if it's a variable, replace with value
      if (arduinoState.variables[msg] !== undefined) {
        msg = arduinoState.variables[msg];
      }
      mockFunctions.Serial.println(msg);
      continue;
    }

    // Serial.read()
    let serialReadMatch = line.match(/Serial\.read\s*\(\s*\)/);
    if (serialReadMatch) {
      const val = mockFunctions.Serial.read();
      continue;
    }
  }
}

// Extract setup and loop from sketch
function parseSketch(sketch) {
  const setupMatch = /void\s+setup\s*\(\s*\)\s*\{([\s\S]*?)\}/m.exec(sketch);
  const loopMatch = /void\s+loop\s*\(\s*\)\s*\{([\s\S]*?)\}/m.exec(sketch);
  return {
    setupCode: setupMatch ? setupMatch[1] : '',
    loopCode: loopMatch ? loopMatch[1] : '',
  };
}

// Run the sketch
function runSketch(sketchString, loopIterations = 3) {
  reset();
  const parsed = parseSketch(sketchString);
  console.log('--- Starting Ultimate Arduino Simulator ---');
  console.log('--- Executing setup() ---');
  parseAndExecute(parsed.setupCode);

  console.log('--- Setup complete, entering loop() ---');
  for (let i = 0; i < loopIterations; i++) {
    console.log(`--- Loop iteration ${i + 1} ---`);
    parseAndExecute(parsed.loopCode);
  }
  console.log('--- Simulation finished ---');
}

// Example sketch that uses new features
const arduinoSketch = `
void setup() {
  pinMode(13, OUTPUT);
  pinMode(2, INPUT);
  Serial.println("Starting Ultimate Sketch...");
}

void loop() {
  int analogVal = analogRead(2);
  Serial.println("Analog value read:");
  Serial.println(analogVal);
  
  if (analogVal > 512) {
    digitalWrite(13, HIGH);
    Serial.println("LED ON");
  } else {
    digitalWrite(13, LOW);
    Serial.println("LED OFF");
  }

  delay(1000);

  int count = 0;
  for (int i = 0; i < 5; i = i + 1) {
    count = count + i;
    Serial.println(count);
  }

  bool flag = true;
  while(flag) {
    Serial.println("While loop running");
    flag = false; // break loop
  }
}
`;

runSketch(arduinoSketch, 2);
