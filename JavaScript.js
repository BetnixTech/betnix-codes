function evaluateJS(input) {
  try {
    const result = eval(input);
    return result;
  } catch (err) {
    return "Error: " + err.message;
  }
}

// Example usage:
const input = `
  const x = 5;
  const y = 10;
  x * y;
`;

const output = evaluateJS(input);
console.log("Result:", output); // → Result: 50
