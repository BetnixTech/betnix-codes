/**
 * @file ascii-logic.js
 * Contains the logic for converting text to ASCII.
 */

/**
 * Converts a given string to a list of decimal ASCII values.
 * Each character is converted to its corresponding ASCII decimal code.
 *
 * @param {string} text - The input string to convert.
 * @returns {string} A space-separated string of ASCII decimal values.
 */
function convertToAscii(text) {
    // If the input is empty, return an empty string
    if (!text) {
        return '';
    }
    
    // Convert the string to an array of characters
    return text.split('')
        // Map each character to its decimal ASCII code
        .map(char => char.charCodeAt(0))
        // Join the decimal values with a space for readability
        .join(' ');
}
