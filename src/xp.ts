export function calcularNivelYEtapa(xpTotal: number) {
  const base = 80;
  const exponente = 1.7;

  let nivel = 1;
  let xpAcumulado = 0;
  let etapa = 1;

  while (xpAcumulado < xpTotal) {
    const xpParaSiguienteNivel = base * Math.pow(nivel, exponente);
    xpAcumulado += xpParaSiguienteNivel;
    nivel++;
  }
  etapa = Math.floor(nivel / 2);

  return { nivel, etapa };
}