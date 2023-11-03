function encontrarMultiploComun(num1, num2) {
    // Encuentra el LCM de los dos números
    let lcm = calcularLCM(num1, num2);
  
    // Si el LCM es igual al número más pequeño, devuelve ese número
    if (lcm === Math.min(num1, num2)) {
      return Math.min(num1, num2);
    } else {
      return lcm;
    }

    // Calcula el mínimo común múltiplo (LCM) usando el algoritmo de Euclides
    function calcularLCM(a, b) {
      return (a * b) / calcularMCD(a, b);
    }
  
    // Calcula el máximo común divisor (MCD) usando el algoritmo de Euclides
    function calcularMCD(a, b) {
      if (b === 0) {
        return a;
      } else {
        return calcularMCD(b, a % b);
      }
    }
  }
  
  // Ejemplo de uso
  const numero1 = 12;
  const numero2 = 18;
  
  const resultado = encontrarMultiploComun(numero1, numero2);
  console.log(`El número que multiplica al menor o a ambos es: ${resultado}`);