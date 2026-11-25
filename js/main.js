// Cargar animes
async function cargarSeccion(endpoint, parametros, id, idEstado) {
    const contenedor = document.querySelector('#' + id);
    const estado = document.querySelector('#' + idEstado);
    try {
        const respuesta = await consultarAPI(endpoint, parametros);
        mostrarTarjetas(contenedor, respuesta.data.slice(0, 6));
        estado.textContent = respuesta.data.length ? '' : 'No hay animes disponibles.';
    } catch (error) {
        estado.textContent = mensajeError(error);
    }
}

async function iniciar() {
    // Consultar las dos listas
    await cargarSeccion('/anime', { sort: 'popularityRank', 'page[limit]': 6, 'filter[ageRating]': 'G,PG,R' }, 'populares', 'estado-populares');
    await cargarSeccion('/trending/anime', { limit: 6 }, 'temporada', 'estado-temporada');
}
iniciar();
