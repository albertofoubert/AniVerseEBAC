const formulario = document.querySelector('.buscador');
const busqueda = document.querySelector('#busqueda');
const resultados = document.querySelector('#resultados');
const estado = document.querySelector('#estado-resultados');
const anterior = document.querySelector('#anterior');
const siguiente = document.querySelector('#siguiente');
const indicador = document.querySelector('#pagina');
// Obtener búsqueda
let termino = new URLSearchParams(window.location.search).get('q') || '';
let pagina = 1;
let cargando = false;
let haySiguiente = false;
busqueda.value = termino;

// Buscar animes
async function cargarResultados() {
    if (cargando) return;
    cargando = true;
    anterior.disabled = true;
    siguiente.disabled = true;
    busqueda.disabled = true;
    formulario.querySelector('button').disabled = true;
    resultados.replaceChildren();
    estado.textContent = 'Buscando animes...';
    document.querySelector('#titulo-resultados').textContent = termino ? 'Resultados para: ' + termino : 'Catálogo de anime';
    haySiguiente = false;
    try {
        const parametros = { 'page[offset]': (pagina - 1) * 12, 'page[limit]': 12, 'filter[ageRating]': 'G,PG,R' };
        if (termino) parametros['filter[text]'] = termino;
        else { parametros.sort = 'popularityRank'; }
        const respuesta = await consultarAPI('/anime', parametros);
        mostrarTarjetas(resultados, respuesta.data);
        estado.textContent = respuesta.data.length ? '' : 'No encontramos animes con ese nombre.';
        haySiguiente = respuesta.pagination?.has_next_page === true;
    } catch (error) {
        estado.textContent = mensajeError(error);
    } finally {
        // Actualizar botones
        indicador.textContent = 'Página ' + pagina;
        anterior.disabled = pagina <= 1;
        siguiente.disabled = !haySiguiente;
        busqueda.disabled = false;
        formulario.querySelector('button').disabled = false;
        cargando = false;
    }
}
formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    if (cargando) return;
    termino = busqueda.value.trim();
    pagina = 1;
    const url = new URL(window.location.href);
    if (termino) url.searchParams.set('q', termino);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    cargarResultados();
});
anterior.addEventListener('click', () => {
    if (!cargando && pagina > 1) { pagina--; cargarResultados(); }
});
siguiente.addEventListener('click', () => {
    if (!cargando && haySiguiente) { pagina++; cargarResultados(); }
});
cargarResultados();
