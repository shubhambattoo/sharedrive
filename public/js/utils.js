export function getFileSize(size, decimals = 2) {
  if (size === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(size) / Math.log(k));

  return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getSelectedFile(file) {
  return {
    name: file.name,
    size: getFileSize(file.size),
    type: file.type,
    blob: file,
  };
}
