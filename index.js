const showToast = (message, type = "primary") => {
  const toastEl = document.getElementById("toastMessage");
  const toastBody = toastEl.querySelector(".toast-body");

  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
};

const handleFileInput = (inputId, buttonId) => {
  const fileInput = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  fileInput.addEventListener("change", () => {
    button.disabled = !fileInput.files.length;
  });
};

const handleMinify = (inputId, buttonId, linkId, type) => {
  const fileInput = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const downloadLink = document.getElementById(linkId);

  button.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      showToast(`Please upload a ${type.toUpperCase()} file first.`, "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      let minified = "";

      try {
        if (type === "css") {
          minified = csso.minify(content).css;
        } else if (type === "js") {
          const result = await Terser.minify(content);
          if (result.error) throw result.error;
          minified = result.code;
        }
      } catch (err) {
        showToast(
          `${type.toUpperCase()} minification failed: ${err.message}`,
          "danger"
        );
        return;
      }

      const blob = new Blob([minified], { type: file.type });
      const url = URL.createObjectURL(blob);

      downloadLink.href = url;
      downloadLink.download = `minified.min.${type}`;
      downloadLink.style.display = "block";
      downloadLink.textContent = `Download Minified ${type.toUpperCase()}`;

      showToast(`${type.toUpperCase()} minified successfully!`, "success");

      downloadLink.onclick = () => {
        fileInput.value = "";
        downloadLink.style.display = "none";
        button.disabled = true;
      };
    };
    reader.readAsText(file);
  });
};

handleFileInput("cssFileInput", "minifyCssButton");
handleMinify("cssFileInput", "minifyCssButton", "cssDownloadLink", "css");

handleFileInput("jsFileInput", "minifyJsButton");
handleMinify("jsFileInput", "minifyJsButton", "jsDownloadLink", "js");
