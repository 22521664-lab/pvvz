export const generateAvatar = (name) => {
  const defaultName = name || "?";
  const firstLetter = defaultName.charAt(0).toUpperCase();

  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");

  const colors = [
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", 
    "#f1c40f", "#e67e22", "#e74c3c", "#0084ff", "#ff5e3a"
  ];
  
  const charIndex = firstLetter.charCodeAt(0);
  const bgColor = colors[charIndex % colors.length];

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 45px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  ctx.fillText(firstLetter, canvas.width / 2, canvas.height / 2 + 4);

  return canvas.toDataURL("image/png");
};