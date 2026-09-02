export function calcularNivelYEtapa(xpTotal: number) {
  const base = 80;
  const exponente = 1.7;

  let nivel = 1;
  let xpAcumulado = 0;

  while (xpAcumulado < xpTotal) {
    const xpParaSiguienteNivel = base * Math.pow(nivel, exponente);
    xpAcumulado += xpParaSiguienteNivel;
    nivel++;
  }

  return { nivel };
}