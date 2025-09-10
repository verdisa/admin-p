// Función para formatear números con separadores de comas
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Función para formatear números sin decimales (para cantidades)
export const formatInteger = (num: number): string => {
  return num.toLocaleString('en-US');
};
