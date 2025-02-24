document.getElementById('cssFileInput').addEventListener('change', function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const minifyButton = document.getElementById('minifyButton');
    const downloadLink = document.getElementById('downloadLink');

    if (file) {
        const validExtensions = ['css'];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(fileExtension) || file.type !== 'text/css') {
            alert('Invalid file format! Please upload a valid CSS file.');
            fileInput.value = '';
            minifyButton.disabled = true;
            return;
        }

        minifyButton.disabled = false;
        downloadLink.style.display = 'none';
    } else {
        minifyButton.disabled = true;
        downloadLink.style.display = 'none';
    }
});

document.getElementById('minifyButton').addEventListener('click', function () {
    const fileInput = document.getElementById('cssFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a CSS file first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const cssContent = event.target.result;
        const minified = cssContent.replace(/\s+/g, ' ').trim();

        const blob = new Blob([minified], { type: 'text/css' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'minified.min.css';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Minified CSS';
    };

    reader.readAsText(file);
});
