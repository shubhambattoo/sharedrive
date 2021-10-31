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

export { dragOverHandler, dropHandler, dragenter };
