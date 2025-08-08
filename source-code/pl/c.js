// Simulate environment and C-like data structures
let env = {};  // Holds variables
let typedefs = {};  // Holds typedefs
let structs = {};  // Holds structs
let functionPointers = {};  // Simulate function pointers
let macros = {};  // Macros
let includeFiles = {};  // Simulate #include files
let enums = {};  // Enums

// Simulate basic C standard libraries
const stdio = {
  printf: function(format, ...args) {
    let formatted = format;
    args.forEach((arg, index) => {
      formatted = formatted.replace(`%${index + 1}$s`, arg);
    });
    console.log(formatted);
  },
  fopen: function(filename, mode) {
    console.log(`Opening file: ${filename} with mode: ${mode}`);
    return { filename, mode };
  },
  fclose: function(file) {
    console.log(`Closing file: ${file.filename}`);
  },
  fwrite: function(data, size, count, file) {
    console.log(`Writing ${size * count} bytes to ${file.filename}:`, data);
  },
  fread: function(size, count, file) {
    console.log(`Reading ${size * count} bytes from ${file.filename}`);
    return "file data";
  },
  fseek: function(file, offset, whence) {
    console.log(`Seeking in file ${file.filename} to ${offset} with whence ${whence}`);
  },
  ftruncate: function(file, length) {
    console.log(`Truncating file ${file.filename} to length ${length}`);
  }
};

const math = {
  sqrt: function(x) {
    return Math.sqrt(x);
  },
  abs: function(x) {
    return Math.abs(x);
  },
  pow: function(base, exponent) {
    return Math.pow(base, exponent);
  },
  sin: function(x) {
    return Math.sin(x);
  },
  cos: function(x) {
    return Math.cos(x);
  },
  log: function(x) {
    return Math.log(x);
  },
  tan: function(x) {
    return Math.tan(x);
  },
  ceil: function(x) {
    return Math.ceil(x);
  },
  floor: function(x) {
    return Math.floor(x);
  },
  min: function(x, y) {
    return Math.min(x, y);
  },
  max: function(x, y) {
    return Math.max(x, y);
  },
  hypot: function(x, y) {
    return Math.hypot(x, y);
  },
  atan: function(x) {
    return Math.atan(x);
  },
  exp: function(x) {
    return Math.exp(x);
  },
  log10: function(x) {
    return Math.log10(x);
  },
  fmod: function(x, y) {
    return x % y;
  }
};

const stdlib = {
  rand: function() {
    return Math.floor(Math.random() * 100);
  },
  malloc: function(size) {
    if (size <= 0) {
      console.error("Memory allocation failed: Size must be greater than zero.");
      return null;
    }
    return new Array(size).fill(0);
  },
  free: function(ptr) {
    if (ptr) {
      ptr.length = 0;
      console.log("Memory freed.");
    } else {
      console.error("Cannot free NULL pointer.");
    }
  },
  realloc: function(ptr, size) {
    if (size <= 0) {
      console.error("Reallocation failed: Size must be greater than zero.");
      return null;
    }
    ptr.length = size;
    return ptr;
  },
  calloc: function(count, size) {
    return new Array(count).fill(0);
  },
  abort: function() {
    console.error("Program aborted.");
    return;
  },
  exit: function(status) {
    console.log(`Exiting program with status: ${status}`);
    return;
  }
};

// Bitwise operations
const bitwise = {
  AND: (x, y) => x & y,
  OR: (x, y) => x | y,
  XOR: (x, y) => x ^ y,
  NOT: (x) => ~x,
  SHL: (x, y) => x << y,  // Left Shift
  SHR: (x, y) => x >> y,  // Right Shift
};

// Simulate variable casting
function castToInt(value) {
  return parseInt(value);
}

function castToFloat(value) {
  return parseFloat(value);
}

function castToChar(value) {
  return String.fromCharCode(value);
}

// Handle typedefs (type aliasing)
function handleTypedef(line) {
  const parts = line.split(' ').map(part => part.trim());
  const typeName = parts[1];
  const realType = parts[2];
  typedefs[typeName] = realType;
  console.log(`typedef created: ${typeName} -> ${realType}`);
}

// Simulate `#include` directives
function handleInclude(filename) {
  if (!includeFiles[filename]) {
    console.log(`Including file: ${filename}`);
    includeFiles[filename] = true;
  } else {
    console.log(`File ${filename} already included.`);
  }
}

// Handle macro definitions
function handleDefine(line) {
  const parts = line.split(' ').map(part => part.trim());
  macros[parts[1]] = parts[2] || true;
  console.log(`Macro defined: ${parts[1]} = ${parts[2]}`);
}

// Handle macro undefined
function handleUndef(line) {
  const parts = line.split(' ').map(part => part.trim());
  delete macros[parts[1]];
  console.log(`Macro undefined: ${parts[1]}`);
}

// Simulate enums
function handleEnum(line) {
  const parts = line.split(' ').map(part => part.trim());
  const enumName = parts[1];
  const values = line.substring(line.indexOf('{') + 1, line.indexOf('}')).split(',').map(val => val.trim());
  enums[enumName] = values;
  console.log(`Enum created: ${enumName} with values: ${values}`);
}

// Simulating Function Recursion
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Execute C-like code
function runCCode(code) {
  const lines = code.split(';').map(line => line.trim()).filter(line => line);
  let insideBlock = false;
  let blockStatements = [];

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("typedef")) {
      handleTypedef(line);
    } else if (line.startsWith("#include")) {
      handleInclude(line.split(' ')[1]);
    } else if (line.startsWith("#define")) {
      handleDefine(line);
    } else if (line.startsWith("#undef")) {
      handleUndef(line);
    } else if (line.startsWith("enum")) {
      handleEnum(line);
    } else if (line.startsWith("if")) {
      insideBlock = true;
      handleIf(line);
    } else if (line.startsWith("while")) {
      insideBlock = true;
      handleWhile(line);
    } else if (line.startsWith("for")) {
      insideBlock = true;
      handleFor(line);
    } else if (line.startsWith("switch")) {
      insideBlock = true;
      handleSwitch(line);
    } else if (line === '}') {
      insideBlock = false;
      processBlockStatements(blockStatements);
    } else if (insideBlock) {
      blockStatements.push(line);
    } else if (line.includes("printf")) {
      eval(line);  // For simplicity, using eval here
    } else {
      console.log("Unsupported statement:", line);
    }
  }

  console.log("Environment State:", env);
  console.log("Defined Macros:", macros);
  console.log("Defined Structs:", structs);
  console.log("Defined Typedefs:", typedefs);
  console.log("Enums:", enums);
  console.log("Included Files:", includeFiles);
}

// Example code to test the extended functionality
const code = `
  #include <stdio.h>
  #define MAX_SIZE 100
  #undef MAX_SIZE
  typedef int MyInt;
  
  enum Colors { RED, GREEN, BLUE };
  
  MyInt x = 10;
  printf("Value of x: %1$s\\n", x);
  printf("PI: %1$.2f\\n", 3.14159);

  // Array manipulation
  int arr[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  for (int i = 0; i < 10; i++) {
    printf("Element at %1$d: %2$s\\n", i, arr[i]);
  }
  
  // Function call recursion example
  int fact = factorial(5);
  printf("Factorial of 5: %1$s\\n", fact);

  // Simulating memory management
  int* ptr = malloc(5 * sizeof(int));
  ptr[0] = 1;
  ptr[1] = 2;
  free(ptr);
`;

runCCode(code);
