// variables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')

// eventos
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto)
}

// clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        console.log(this.gastos);
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }
    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div')
        divMensaje.textContent = mensaje
        divMensaje.classList.add('text-center', 'alert')
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }
        formulario.insertBefore(divMensaje, formulario.children[0])
        // document.querySelector('.primario').insertBefore(divMensaje, formulario)
        setTimeout(() => {
            divMensaje.remove()
        }, 1000);
    }
}
//instance
let presupuesto
const ui = new UI()



//functions
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('cual es tu presupuesto?')

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto(e) {
    e.preventDefault()
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('ambos campos son obligatorios', 'error')
        return
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('cantidad no valida', 'error')
        return
    }
    // generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    presupuesto.nuevoGasto(gasto)
    //cuando es correcto
    ui.imprimirAlerta('gasto agregado correctamente')
    //reinicia formulario
    formulario.reset()
}