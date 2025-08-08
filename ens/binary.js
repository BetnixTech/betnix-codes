/**
 * @file binary-logic.js
 * Contains the logic for converting text to binary.
 */

/**
 * Converts a given string to its binary representation.
 * Each character is converted to its ASCII value, and then to an 8-bit binary string.
 *
 * @param {string} text - The input string to convert.
 * @returns {string} The binary representation of the input string.
 */
function convertToBinary(text) {
    // If the input is empty, return an empty string
    if (!text) {
        return '';
    }
    
    // Convert the string to an array of characters
    return text.split('')
        // Map each character to its 8-bit binary string
        .map(char => {
            // Get the character's ASCII value (code point)
            const asciiValue = char.charCodeAt(0);
            // Convert the ASCII value to a binary string
            const binary = asciiValue.toString(2);
            // Pad the binary string with leading zeros to ensure it's 8 bits long
            return binary.padStart(8, '0');
        })
        // Join the binary strings with a space for readability
        .join(' ');
}
