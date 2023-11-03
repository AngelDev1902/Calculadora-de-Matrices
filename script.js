const matrizContainer = document.querySelector(".matriz-container");
const pasosContainer = document.querySelector(".pasos");
let btnCalcular;
let matriz = []; // crear matriz
let cantFilas; //  numero de filas
let cantColumnas; // numero de columnas sin contar los terminos independientes
let cantColumnasT; // total de columnas contando los terminos independientes

// creamos los espacios para ingresar los datos de la matriz
function crearMatriz() {

    //extraemos los valores ingresados por el usuario de filas y columnas
    cantFilas = document.querySelector("#cant-filas").value;
    cantColumnas = document.querySelector("#cant-columnas").value;

    cantFilas = parseInt(cantFilas);
    cantColumnas = parseFloat(cantColumnas);
    cantColumnasT = cantColumnas + 1;

    for (let i = 0; i < cantFilas; i++) {
        const matrizFilas = document.createElement("div");
        matrizFilas.classList.add("matriz-filas");

        for (let j = 0; j < cantColumnasT; j++) {
            const inputM = document.createElement("input");
            inputM.type = "number";
            inputM.classList.add("inputM");

            const x = document.createElement("p");
            x.classList.add("valorX");

            if (j < cantColumnas ) {
                x.textContent = `X ${j+1}`

                matrizFilas.appendChild(inputM);
                matrizFilas.appendChild(x);
            }else if(j == cantColumnas){
                x.textContent = `=`

                matrizFilas.appendChild(x);
                matrizFilas.appendChild(inputM);
            }
        }

        matrizContainer.appendChild(matrizFilas);
    }

    let btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("btn-calcular");
    btn.textContent = "Calcular"
    btn.setAttribute("onclick", "calcular()");
    matrizContainer.appendChild(btn);

    let inputElement = document.querySelectorAll(".inputM");
    desactivarInput(inputElement);
}

function desactivarInput(inputElement) {
    inputElement.forEach(input => {
        input.addEventListener("keydown", function (e) {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
            }
        }); 
    });
}

function calcular(){
    llenarMatriz();
    acomodar();
    pivotes();
    dividir();
}

function llenarMatriz(){
    matriz = []; 
    let filaMatriz = document.querySelectorAll(".matriz-filas");

    filaMatriz.forEach(fila => {
        let columnas = []; // array que almacenara los elementos de cada columna
        let inputsM = fila.querySelectorAll(".inputM"); // extraemos todos los input

        // por cada input extraemos su valor convirtiendolo a flotante y lo agregamos al array
        inputsM.forEach(input => {
            columnas.push(parseFloat(input.value));
        });

        // agregamos cada Array a la matriz
        matriz.push(columnas);
    });

    let p = "Creamos la matriz aumentada";

    mostrarPasos(p);
}

function mostrarPasos(texto, colPiv, colRed, colRes){
    // creamos un contenedor donde colocaremos la matriz actual
    let paso = document.createElement("div");
    paso.classList.add("paso");

    let parrafo = document.createElement("p");
    parrafo.classList.add("parrafo");
    parrafo.textContent = texto;
    paso.appendChild(parrafo);

    let operacion = document.createElement("div");
    operacion.classList.add("operacion");
    paso.appendChild(operacion);

    if (colPiv && colRed && colRes) {
        for (let i = 0; i < 3; i++) {
            // en cada iteracion creamos un contenedor de las filas
            let pFilas = document.createElement("div");
            pFilas.classList.add("pFilas");
            pFilas.classList.add("pOperacion");
    
            for (let j = 0; j < cantColumnasT; j++) {
                // por cada elemento creamos un parrafoi
                let p = document.createElement("p");
                p.classList.add("pColumna");
                
                // definimos el contenido del parrafo como el elemento de la matriz en cada iteracion
                switch (i) {
                    case 0:
                        p.textContent = colRed[j].toString();
                        break;

                    case 1:
                        p.textContent = colPiv[j].toString();
                        break;

                    case 2:
                        p.textContent = colRes[j].toString();
                        break;
                }
    
                // añadimos cada parrafo al contenedor de filas
                pFilas.appendChild(p)
            }
        
            // añadimos cada contenedor de filas a la matriz
            operacion.appendChild(pFilas);
        }
    
    }

    let matrizRes = document.createElement("div");
    matrizRes.classList.add("matriz-res");
    paso.appendChild(matrizRes);

    for (let i = 0; i < cantFilas; i++) {
        // en cada iteracion creamos un contenedor de las filas
        let pFilas = document.createElement("div");
        pFilas.classList.add("pFilas");

        for (let j = 0; j < cantColumnasT; j++) {
            // por cada elemento creamos un parrafoi
            let p = document.createElement("p");
            p.classList.add("pColumna");
            
            // definimos el contenido del parrafo como el elemento de la matriz en cada iteracion
            p.textContent = matriz[i][j].toString();

            // añadimos cada parrafo al contenedor de filas
            pFilas.appendChild(p)
        }
    
        // añadimos cada contenedor de filas a la matriz
        matrizRes.appendChild(pFilas);
    }

    // añadimos la el contenedor de la matriz completa al contendor de pasos
    pasosContainer.appendChild(paso);
}

/* 
    funcion que extrae las filas de la columna ,
    evalua si entre esos numeros encuentra un 1
    si lo encuentra acomodas las filas
*/
function acomodar() {
    let elementos = extraerFilas(0);

    if (elementos.indexOf(1) != -1) {
        let filaOrigen = elementos.indexOf(1);

        // acomoda las filas cambiando de lugar y otras
        if (filaOrigen != 0) {
            reoordenar(filaOrigen, 0);   
        }

        elementos = [];
    }
}

function reoordenar(filaOrigen, filaDestino) {
    // extraemos la fila que vamos a quitar
    let filaMovida = matriz[filaOrigen].splice(0, cantColumnasT);
    // extraemos la fila de destino a la que pasaremos la otra fila
    let filaQuitada = matriz[filaDestino].splice(0, cantColumnasT);

    matriz[filaDestino] = filaMovida; // igualamos la fila de destino a nuestra fila de origen
    matriz[filaOrigen] = filaQuitada; // igualaremos la fila de origen a la fila que movimos

    let p = `Intercambiamos la posicion de la fila ${filaOrigen + 1} a la fila ${filaDestino + 1}`;

    mostrarPasos(p);
}

function pivotes(){
    let pos = 0;

    for (let i = 0; i < cantColumnas; i++) {
        let elementosF = extraerFilas(i); // extraemos las columnas de cada iteracion
        let pivote = elementosF[pos]; // extraemos el pivote dependiendo de cada columna

        // extraemos los numeros que estan antes y despues del pivote
        let pivoteBefore = pos - 1;
        let pivoteAfter = pos + 1;

        for (let j = 0; j < cantFilas - 1; j++) {
            let num;

            if (pivoteBefore >= 0) {
                num = pivoteBefore--;
            } else if (pivoteAfter < cantFilas) {
                num = pivoteAfter++;
            }

            reducir(num, pivote, i);
        }

        pos++;
    }

}

function extraerColumnas(fil) {
    let elementos = [];

    for (let i = 0; i < cantColumnasT; i++) {
        elementos.push(matriz[fil][i]);
    }

    return elementos;
}

function extraerFilas(col) {
    let elementos = [];

    for (let i = 0; i < cantFilas; i++) {
        elementos.push(matriz[i][col]);
    }

    return elementos;
}

function reducir(colRed, pivote, colPiv) {
    let columnaReducir = extraerColumnas(colRed); // extraemos la columna que reduciremos
    let columnaPivote = extraerColumnas(colPiv); // extraemos la columna del pivote

    // obtenemos el o los numeros multiplos para hacer coincidir los numeros
    let divisor = obtenerMultiplos(pivote, columnaReducir[colPiv]);

    const columnaPiv = columnaPivote.map(e => e * divisor[0]);
    const columnaRed = columnaReducir.map(e => e * divisor[1]);

    // multiplicamos cada elemento de las columnas por su multiplo o divisor
    columnaPivote = columnaPivote.map(e => e * divisor[0]);
    columnaReducir = columnaReducir.map(e => e * divisor[1]);
    

    // restamos la columna pivote a la columna a reducir
    for (let i = 0; i < columnaReducir.length; i++) {
        columnaReducir[i] -= columnaPivote[i];
    }

    // regresamos la columna pivote a su estado original
    columnaPivote = columnaPivote.map(e => e / divisor[0]);

    // Igualamos cada fila a las nuevas filas modificadas
    matriz[colRed] = columnaReducir;
    matriz[colPiv] = columnaPivote;
    
    let p = '';

    if (divisor[0] != 1 && divisor[1] != 1) {
        p = `R${colRed + 1}(${divisor[1]}) - R${colPiv + 1}(${divisor[0]})`;
    }else if(divisor[0] != 1 && divisor[1] == 1){
        p = `R${colRed + 1} - R${colPiv + 1}(${divisor[0]})`;
    }else if(divisor[0] == 1 && divisor[1] != 1){
        p = `R${colRed + 1}(${divisor[1]}) - R${colPiv + 1}`;
    }

    mostrarPasos(p, columnaPiv, columnaRed, columnaReducir);

}

function obtenerMultiplos(pivote, num) {
    // obtenemos el numero mayor y el numero menor
    let menor = Math.min(pivote, num);
    let mayor = Math.max(pivote, num);
    // en un array almacenaremos los numeros que modificaran las columnas
    let divisor = [1, 1];

    if(pivote != num){
        if (mayor % menor == 0) {
            if (menor === pivote) {
                divisor = [mayor / menor, 1];
            }else if(menor === num){
                divisor = [1, mayor / menor];
            }
        }else{
            if (menor === pivote) {
                divisor = [mayor, menor];
            }else if(menor === num){
                divisor = [menor, mayor]
            }
        }
    }

    return divisor;
}

function dividir() {
    let pos = 0;
    let p = 'Dividimos ';

    for (let i = 0; i < cantColumnas; i++) {
        let elementosF = extraerFilas(i);
        let pivote = elementosF[pos];
        let columna = extraerColumnas(i);

        columna = columna.map(function(e){
            let n = e / pivote;
            return n % 1 !== 0 ? n.toFixed(2) : n;
        });

        matriz[i] = columna;

        p += `la fila ${i + 1} entre ${pivote} `;
        
        pos++;
    }

    mostrarPasos(p);
}