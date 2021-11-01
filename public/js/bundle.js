'use strict';

var toggleSelection = function () {
  var selection = document.getSelection();
  if (!selection.rangeCount) {
    return function () {};
  }
  var active = document.activeElement;

  var ranges = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' &&
    selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }

    active &&
    active.focus();
  };
};

var deselectCurrent = toggleSelection;

var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
};

var defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text, options) {
  var debug,
    message,
    reselectPrevious,
    range,
    selection,
    mark,
    success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement("span");
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = "unset";
    // prevents scrolling to the end of the page
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = "pre";
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function(e) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") { // IE 11
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
          window.clipboardData.setData(format, text);
        } else { // all other browsers
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection.addRange(range);

    var successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }

  return success;
}

var copyToClipboard = copy;

const saveFile = async (file, fileName) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  const res = await axios.post("/api/files", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  ev.stopPropagation();

  const dt = ev.dataTransfer;
  const files = dt.files;

  return files[0];
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  ev.stopPropagation();
}

function getFileSize(size, decimals = 2) {
  if (size === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(size) / Math.log(k));

  return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getSelectedFile(file) {
  return {
    name: file.name,
    size: getFileSize(file.size),
    type: file.type,
    blob: file,
  };
}

const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const mainArea = document.getElementById('main-row');
const selectorArea = document.getElementById('selector');
const selectedArea = document.getElementById('selected');
const loadingArea = document.getElementById('loading');
const uploadedArea = document.getElementById('uploaded');
const fileBox = document.getElementById('file');
const fileBox1 = document.getElementById('file-1');
const fileBox2 = document.getElementById('file-2');
const uploadBtn = document.getElementById('upl-btn');
const removeBtn = document.getElementById('remove-btn');
const okBtn = document.getElementById('ok-btn');
const copyBtn = document.getElementById('copy-btn');

let selectedFile = null;

dropArea.addEventListener('dragenter', dragenter, false);
dropArea.addEventListener('dragover', dragOverHandler, false);
dropArea.addEventListener(
  'drop',
  (e) => {
    const file = dropHandler(e);
    selectedFile = getSelectedFile(file);
    const html = `
    <div> ${selectedFile.name} </div>
    <div> ${selectedFile.size} </div>    
  `;
    selectorArea.style.display = 'none';
    selectorArea.setAttribute('aria-hidden', 'true');
    selectedArea.style.display = 'block';
    selectedArea.setAttribute('aria-hidden', 'false');
    fileBox.innerHTML = html;
  },
  false
);

fileInput.addEventListener(
  'change',
  (e) => {
    const file = e.target.files[0];
    selectedFile = getSelectedFile(file);
    const html = `
      <div> ${selectedFile.name} </div>
      <div> ${selectedFile.size} </div>    
    `;
    selectorArea.style.display = 'none';
    selectorArea.setAttribute('aria-hidden', 'true');
    selectedArea.style.display = 'block';
    selectedArea.setAttribute('aria-hidden', 'false');
    fileBox.innerHTML = html;
  },
  false
);

removeBtn.addEventListener('click', () => {
  selectedArea.style.display = 'none';
  selectedArea.setAttribute('aria-hidden', 'true');
  selectorArea.style.display = 'block';
  selectorArea.setAttribute('aria-hidden', 'false');
  fileBox.innerHTML = '';
  selectedFile = null;
}, false);

uploadBtn.addEventListener('click', async () => {
  const html = `
    <div> ${selectedFile.name} </div>
    <div> ${selectedFile.size} </div>    
  `;
  loadingArea.style.display = 'block';
  loadingArea.setAttribute('aria-hidden', 'false');
  fileBox1.innerHTML = html;
  selectedArea.style.display = 'none';
  selectedArea.setAttribute('aria-hidden', 'true');

  try {
    const data = await saveFile(selectedFile.blob, selectedFile.name);
    document.getElementById('link').value = `${data.file}`;
    fileBox2.innerHTML = `${selectedFile.name}`;
    mainArea.style.display = 'none';
    mainArea.setAttribute('aria-hidden', 'true');
    fileBox1.innerHTML = '';
    uploadedArea.style.display = 'block';
    uploadedArea.setAttribute('aria-hidden', 'false');
  } catch (error) {
    alert('Could not save the file.');
    selectorArea.style.display = 'block';
    selectorArea.setAttribute('aria-hidden', 'false');
    selectedFile = null;
    mainArea.style.display = 'grid';
    mainArea.setAttribute('aria-hidden', 'false');
  } finally {
    loadingArea.style.display = 'none';
    loadingArea.setAttribute('aria-hidden', 'true');
  }
});

okBtn.addEventListener('click', () => {
  uploadedArea.style.display = 'none';
  uploadedArea.setAttribute('aria-hidden', 'true');
  selectorArea.style.display = 'block';
  selectorArea.setAttribute('aria-hidden', 'false');
  fileBox.innerHTML = '';
  selectedFile = null;
  mainArea.style.display = 'grid';
  mainArea.setAttribute('aria-hidden', 'false');
}, false);

copyBtn.addEventListener('click', function() {
  const copyText = document.getElementById('link');
  copyToClipboard(copyText.value);
  this.innerHTML = 'Copied!';
}, false);
