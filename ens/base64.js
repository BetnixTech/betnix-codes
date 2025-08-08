/**
 * @file base64-logic.js
 * Contains the logic for converting text to Base64.
 */

/**
 * Converts a given string to a Base64 encoded string.
 * This uses the built-in `btoa()` function, which encodes a string in Base64.
 *
 * @param {string} text - The input string to convert.
 * @returns {string} The Base64 encoded string.
 */
function convertToBase64(text) {
    // If the input is empty, return an empty string
    if (!text) {
        return '';
    }

    try {
        // Use the built-in btoa() function to encode the string
        return btoa(text);
    } catch (e) {
        // Handle potential errors if the string contains characters outside the Latin-1 range
        console.error('Error converting to Base64:', e);
        return 'Error: Invalid characters for Base64 encoding. Please use Latin-1 characters.';
    }
}
