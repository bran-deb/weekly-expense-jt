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
        this.calcularRestante()
    }
    calcularRestante() {
        //acumulamos todo en total y este sera igual a total += gasto.cantidad
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante()
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
        }, 2000);
    }
    mostrarGastos(gastos) {
        this.limpiarHTML()
        // iterar sobre los gastos
        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto
            //agregar el html del gasto
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'

            // nuevoGasto.setAttribute('data-id', id) antiguamente
            nuevoGasto.dataset.id = id  //nueva forma

            nuevoGasto.innerHTML = `${nombre}<span class="badge-primary badge-pill"> $ ${cantidad}</span>`
            // boton para borrar el gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.innerHTML = 'Borrar &times'//&times agrega la x del button
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)
            //agregar html
            gastoListado.appendChild(nuevoGasto)
        });
    }
    limpiarHTML() {
        while (gastoListado.firstChild)
            gastoListado.removeChild(gastoListado.firstChild)
    }
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante
    }
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj

        const restanteDiv = document.querySelector('.restante')

        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')
        }
        //si el total es cero o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true
        }
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
    //imprimir gastos
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)
    //reinicia formulario
    formulario.reset()
}
function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id)
    //elimina los gastos del HTML
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto)
}