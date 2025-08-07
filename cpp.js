const cppKeywords = [
  'alignas', 'alignof', 'and', 'and_eq', 'asm', 'atomic_cancel', 'atomic_commit',
  'atomic_noexcept', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch',
  'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const',
  'const_cast', 'constexpr', 'consteval', 'constinit', 'continue', 'co_await',
  'co_return', 'co_yield', 'decltype', 'default', 'delete', 'double', 'dynamic_cast',
  'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend',
  'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept',
  'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected',
  'public', 'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return',
  'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast',
  'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local', 'throw',
  'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using',
  'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
];

const cppFunctions = [
  'main', 'cout', 'cin', 'cerr', 'clog', 'endl', 'string', 'wstring', 'thread',
  'mutex', 'vector', 'list', 'map', 'set', 'unordered_map', 'unordered_set',
  'stack', 'queue', 'deque', 'priority_queue', 'pair', 'tuple', 'variant',
  'optional', 'any', 'shared_ptr', 'unique_ptr', 'weak_ptr', 'make_shared',
  'make_unique', 'std', 'array', 'atomic', 'future', 'promise', 'function',
  'bind', 'is_same', 'type_traits',
  'max', 'min', 'swap', 'sort', 'reverse', 'unique', 'find', 'count', 'accumulate',
  'transform', 'for_each', 'copy', 'move', 'fill', 'generate', 'all_of', 'any_of',
  'none_of',
  'printf', 'scanf', 'fopen', 'fclose', 'fread', 'fwrite', 'malloc', 'calloc',
  'realloc', 'free', 'memcpy', 'memmove', 'memset', 'strcpy', 'strncpy', 'strcat',
  'strncat', 'strcmp', 'strncmp', 'strlen', 'sscanf', 'sprintf', 'atoi', 'atol',
  'atof'
];

const cppModules = [
  'iostream', 'fstream', 'sstream', 'string', 'vector', 'list', 'map', 'set',
  'unordered_map', 'unordered_set', 'queue', 'deque', 'stack', 'algorithm',
  'numeric', 'memory', 'utility', 'functional', 'thread', 'mutex', 'atomic',
  'future', 'chrono', 'system_error', 'exception', 'stdexcept', 'type_traits',
  'concepts', 'ranges', 'filesystem',
  'cassert', 'cctype', 'cerrno', 'cfloat', 'ciso646', 'climits', 'clocale',
  'cmath', 'csetjmp', 'csignal', 'cstdarg', 'cstddef', 'cstdint', 'cstdio',
  'cstdlib', 'cstring', 'ctime', 'cwchar', 'cwctype'
];

// === Helper Function ===
function getMatchingBracket(char) {
  switch (char) {
    case '(': return ')';
    case '{': return '}';
    case '[': return ']';
    default: return '';
  }
}

// === Syntax and Structural Error Checker ===
function checkCppErrors(code) {
  const errors = [];
  const codeWithoutStringsAndComments = code
    .replace(/"(.*?)"/g, '""')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');

  const braceStack = [];
  for (let i = 0; i < codeWithoutStringsAndComments.length; i++) {
    const char = codeWithoutStringsAndComments[i];
    if ('({['.includes(char)) {
      braceStack.push(char);
    } else if (')}]'.includes(char)) {
      const last = braceStack.pop();
      if (!last) {
        errors.push(`Unexpected closing bracket '${char}' at position ${i + 1}`);
      } else if (getMatchingBracket(last) !== char) {
        errors.push(`Mismatched bracket near position ${i + 1}: expected '${getMatchingBracket(last)}' but found '${char}'`);
      }
    }
  }
  if (braceStack.length > 0) {
    errors.push(`Unclosed bracket(s): ${braceStack.join(', ')}`);
  }

  // Simplified semicolon checker
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed.length &&
      !trimmed.startsWith('#') &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}')
    ) {
      if (!cppKeywords.some(kw => trimmed.startsWith(kw + ' ')) &&
          !cppKeywords.includes(trimmed)) {
        errors.push(`Line ${index + 1}: Possible missing semicolon.`);
      }
    }
  });

  return errors;
}

// === Semantic and Contextual Error Checker ===
function checkCppCode(code) {
  const errors = [];

  // Check for main()
  if (!/int\s+main\s*\(\s*\)/.test(code)) {
    errors.push("Missing 'int main()' function.");
  }

  // Check for 'cout' without iostream
  if (code.includes("cout") && !code.includes("#include <iostream>")) {
    errors.push("Used 'cout' without including <iostream>.");
  }

  // Check for suspicious identifiers
  const words = code.match(/\b[A-Za-z_]\w*\b/g) || [];
  const knownWords = new Set([...cppKeywords, ...cppFunctions, ...cppModules]);

  words.forEach(word => {
    if (!knownWords.has(word)) {
      if (/^[a-z]+$/.test(word) && (word.length >= 3 && word.length <= 12)) {
        errors.push(`Warning: '${word}' may be an invalid or misspelled identifier.`);
      }
    }
  });

  return errors;
}

// === Full Linting Wrapper ===
function lintCppCode(code) {
  const syntaxErrors = checkCppErrors(code);
  const semanticErrors = checkCppCode(code);
  return [...syntaxErrors, ...semanticErrors];
}

// === Example Usage ===
const cppCode = `
#include <iostream>
using namespace std;

int main() {
    int x = 5
    cout << "Hello, World!" << endl;
    return 0;
}
`;

const lintErrors = lintCppCode(cppCode);
if (lintErrors.length > 0) {
  console.log("C++ Code Errors Found:");
  lintErrors.forEach(err => console.log(" - " + err));
} else {
  console.log("No syntax errors found.");
}

// === Optional: Godbolt Compiler API URL ===
const godboltCompilersUrls = ["https://godbolt.org/api/compilers"];

// === Optional: Highlight.js script for syntax highlighting ===
const highlightjs = ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.0/highlight.min.js"];
