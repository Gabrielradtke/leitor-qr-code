export default function handler(req, res) {
  const codigosAutorizados = ["ABC123", "XYZ789", "QRCODE2025"];

  const codigo = req.query.codigo;

  if (!codigo) {
    return res.status(400).json({ error: "Código não informado" });
  }

  if (codigosAutorizados.includes(codigo)) {
    return res.status(200).json({ autorizado: true });
  } else {
    return res.status(200).json({ autorizado: false });
  }
}