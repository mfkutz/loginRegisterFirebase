function sumar(a, b) {
    return a + b
}


const sumarConLlaves = (a, b) => {
    return sumar(a, b)
}

const sumarSinLlaves = (a, b) => sumar(a, b)

console.log(sumarConLlaves(3, 5));
console.log(sumarSinLlaves(3, 5));