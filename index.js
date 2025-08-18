const showToast = (message, type = 'primary') => {
    const toastEl = document.getElementById('toastMessage');
    const toastBody = toastEl.querySelector('.toast-body');

    toastBody.textContent = message;
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;

    const toast = new bootstrap.Toast(toastEl, {
        delay: 5000
    });
    toast.show();
}

document.getElementById('cssFileInput').addEventListener('change', function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const minifyButton = document.getElementById('minifyButton');
    const downloadLink = document.getElementById('downloadLink');

    if (file) {
        const validExtensions = ['css'];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(fileExtension) || file.type !== 'text/css') {
            showToast('Invalid file format! Please upload a valid CSS file.', 'warning');
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
        showToast('Please upload a CSS file first.', 'warning');
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
        
        downloadLink.addEventListener('click', () => {
            showToast('File downloaded successfully!', 'success');
            
            fileInput.value = '';
            downloadLink.style.display = 'none';
            document.getElementById('minifyButton').disabled = true;
        });
    };
    reader.readAsText(file);
});
