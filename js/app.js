// Variables y selectores ///////////////
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
const gastosTotales = document.querySelector('.list-group');


// Eventos/////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    preguntarPresupuesto()
    formulario.addEventListener('submit', agregarGasto);
});


// Clases /////////////////////////
class Presupuesto {
    constructor(presupuesto, restante) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter((gasto) => gasto.id !== id)
        this.calcularRestante();
    }
}

class UI {

    insertarPresupuesto(cantidades) {

        const { presupuesto, restante } = cantidades
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divM = document.createElement('div');
        divM.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divM.classList.add('alert-danger');
        } else {
            divM.classList.add('alert-success');
        }
        divM.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divM, formulario);

        setTimeout(() => {
            divM.remove();
        }, 2000);
    }

    mostrarGastos(gastos) {
        this.limpiarHTML();

        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id;
            li.innerHTML = `${nombre} <span class=" badge badge-primary badge-pill"> $ ${cantidad} </span>`;
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');

            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            btnBorrar.textContent = 'Borrar X';
            li.appendChild(btnBorrar);
            gastoListado.appendChild(li);

        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }


    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto de se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instancias
const ui = new UI();
let presupuesto = new Presupuesto();


// Funciones //////////////////////////////

function preguntarPresupuesto() {

    Swal.fire({
        title: '¿Cual es tu presupuesto?',
        input: 'text',
        inputPlaceholder: 'Escribe tu presupuesto'
    })

    const boton = document.querySelector('.swal2-actions button');

    boton.addEventListener('click', () => {
        const presupuestoUsuario = document.querySelector('.swal2-input').value;

        if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
            window.location.reload()
        }

        presupuesto = new Presupuesto(presupuestoUsuario);
        ui.insertarPresupuesto(presupuesto);
    })
}

function agregarGasto(e) {
    e.preventDefault();

    // Leer datos
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;

    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    const gasto = { nombre, cantidad, id: Date.now() }
    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Guardado');
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    formulario.reset()
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
