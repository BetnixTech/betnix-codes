const htmlInput = document.getElementById('htmlInput');
const htmlPreview = document.getElementById('htmlPreview');

htmlInput.addEventListener('input', function() {
    const htmlCode = htmlInput.value;
    // Access the iframe's document and set its body's innerHTML
    htmlPreview.contentDocument.body.innerHTML = htmlCode;
});
