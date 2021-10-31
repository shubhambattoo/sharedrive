const saveFile = async (file, fileName) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  const res = await axios.post("/api/files", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export { saveFile };
