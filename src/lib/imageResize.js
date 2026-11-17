// Shrinks a picked image so it can be stored with the article.
// Output is a JPEG data URL, scaled to at most maxWidth and compressed
// to roughly maxBytes, to stay within browser storage limits.
export const fileToCoverDataUrl = async (file, { maxWidth = 1600, maxBytes = 350_000 } = {}) => {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image. Please try a JPG, PNG or WebP file."));
      el.src = url;
    });

    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; // transparent PNGs become white, not black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let quality = 0.85;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    // base64 is about 4/3 the size of the bytes it encodes
    while (dataUrl.length * 0.75 > maxBytes && quality > 0.5) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }
    return dataUrl;
  } finally {
    URL.revokeObjectURL(url);
  }
};
