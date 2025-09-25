export function getUltimosMeses(cantidad = 3): string[]{
  const hoy = new Date();
  const meses: string[] = [];

  for (let i = cantidad - 1; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const nombreMes = fecha.toLocaleString("es-ES", { month: "long" });
    const año = fecha.getFullYear();
    meses.push(`${nombreMes} ${año}`);
  }

  return meses;
}
