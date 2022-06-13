const d = document;
$table = d.querySelector(".crud-table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment();
let state = false;


/**
 * Esta función obtiene la información de la API y la muestra en la tabla
 */
const getAll = async () => {
    try {
        let res = await axios.get("http://localhost:3000/santos"),
            json = await res.data;

        const inputNombre = d.querySelector("#input-nombre");
        inputNombre.addEventListener("click", () => {
            if (!state) {
                json.sort(function (a, b) {
                    if (a.nombre > b.nombre) {
                        return 1;
                    }
                    if (a.nombre < b.nombre) {
                        return -1;
                    }
                    return 0;
                });

                $tbody = d.querySelector("tbody");
                $tbody.textContent = "";

                json.forEach(el => {
                    $template.querySelector(".name").textContent = el.nombre;
                    $template.querySelector(".constellation").textContent = el.constelacion;
                    $template.querySelector(".edit").dataset.id = el.id;
                    $template.querySelector(".edit").dataset.name = el.nombre;
                    $template.querySelector(".edit").dataset.constellation = el.constelacion;
                    $template.querySelector(".delete").dataset.id = el.id;

                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);

                });
                $table.querySelector("tbody").appendChild($fragment);
                state = true;
            } else {
                json.sort(function (a, b) {
                    if (b.nombre > a.nombre) {
                        return 1;
                    }
                    if (b.nombre < a.nombre) {
                        return -1;
                    }
                    return 0;
                });

                $tbody = d.querySelector("tbody");
                $tbody.textContent = "";

                json.forEach(el => {
                    $template.querySelector(".name").textContent = el.nombre;
                    $template.querySelector(".constellation").textContent = el.constelacion;
                    $template.querySelector(".edit").dataset.id = el.id;
                    $template.querySelector(".edit").dataset.name = el.nombre;
                    $template.querySelector(".edit").dataset.constellation = el.constelacion;
                    $template.querySelector(".delete").dataset.id = el.id;

                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);

                });
                $table.querySelector("tbody").appendChild($fragment);
                state = false;
            }
        })

        json.forEach(el => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".constellation").textContent = el.constelacion;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.constellation = el.constelacion;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);

        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
}


/**
 * Este evento carga el DOM y se llama a la función que llena la tabla con la información
 */
d.addEventListener("DOMContentLoaded", getAll);

/**
 * Este evento es cuando se da clic al botón del formulario, si el id del input que está oculto no tiene
 * información se realiza el método POST, es decir se crea un nuevo elemento, pero si el id del input que
 * está oculto si tiene información, lo que se hace es una actualización del registro.
 */
d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            //Create - POST
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                }
                res = await axios("http://localhost:3000/santos", options),
                    json = await res.data;

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        } else {
            //Update - PUT
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    })
                }
                res = await axios(`http://localhost:3000/santos/${e.target.id.value}`, options),
                    json = await res.data;

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});

/**
 * Este evento valida si se ha hecho clic en editar o eliminar y de acuerdo con esto ejecuta las funciones 
 * correspondientes.
 */
d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let isDelete = confirm(`¿Estás seguro de eliminar el Santo con id: ${e.target.dataset.id}?`);

        if (isDelete) {
            //Delete - DELETE
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                }
                res = await axios(`http://localhost:3000/santos/${e.target.dataset.id}`, options),
                    json = await res.data;

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                alert(`Error ${err.status}: ${message}`);
            }
        }
    }
});