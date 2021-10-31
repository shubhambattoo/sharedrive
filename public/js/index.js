import copy from 'copy-to-clipboard';
import { saveFile } from './files';
import { dragenter, dragOverHandler, dropHandler } from './fileDrop';
import { getSelectedFile } from './utils';

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
  copy(copyText.value);
  this.innerHTML = 'Copied!';
}, false);