const id = new URLSearchParams(window.location.search).get('id');
const estado = document.querySelector('#estado-detalle');
const botonGuardar = document.querySelector('#guardar');
const estadoFavorito = document.querySelector('#estado-favorito');
let animeActual;

function actualizarBoton() {
    const existe = leerFavoritos().some(anime => anime.id === animeActual.id);
    botonGuardar.textContent = existe ? 'Quitar de favoritos' : 'Guardar en favoritos';
}

// Mostrar información
function mostrarDetalle(anime) {
    asignarPortada(document.querySelector('#portada'), anime);
    document.querySelector('#titulo').textContent = anime.title;
    document.querySelector('#titulo-japones').textContent = anime.title_japanese || '';
    document.querySelector('#sinopsis').textContent = anime.synopsis || 'Sin sinopsis disponible.';
    const datos = {
        'Puntuación': anime.score,
        'Episodios': anime.episodes,
        'Tipo': anime.type,
        'Estado': anime.status,
        'Año': anime.year,
        'Clasificación por edad': anime.ageRating,
        'Duración por episodio (min)': anime.episodeLength
    };
    const lista = document.querySelector('#datos');
    Object.entries(datos).forEach(([nombre, valor]) => {
        const etiqueta = document.createElement('dt');
        etiqueta.textContent = nombre;
        const dato = document.createElement('dd');
        dato.textContent = valor ?? 'Sin datos';
        if (dato.textContent === '') dato.textContent = 'Sin datos';
        lista.append(etiqueta, dato);
    });
    const enlace = document.querySelector('#enlace-mal');
    enlace.href = 'https://kitsu.app/anime/' + encodeURIComponent(anime.slug || anime.id);
    enlace.hidden = false;
    document.querySelector('#detalle').hidden = false;
    actualizarBoton();
}

botonGuardar.addEventListener('click', () => {
    if (!animeActual) return;
    const favoritos = leerFavoritos();
    const existe = favoritos.some(anime => anime.id === animeActual.id);
    try {
        if (existe) {
            // Eliminar favorito
            guardarFavoritos(favoritos.filter(anime => anime.id !== animeActual.id));
            estadoFavorito.textContent = 'Anime eliminado de favoritos.';
        } else {
            // Guardar favorito
            favoritos.push({ id: animeActual.id, title: animeActual.title, score: animeActual.score, images: animeActual.images });
            guardarFavoritos(favoritos);
            estadoFavorito.textContent = 'Anime guardado en favoritos.';
        }
        actualizarBoton();
    } catch (error) {
        estadoFavorito.textContent = 'No se pudo guardar la lista en este navegador.';
    }
});

// Consultar anime
async function cargarDetalle() {
    if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
        estado.textContent = 'Selecciona un anime desde Inicio o Explorar.';
        return;
    }
    try {
        const respuesta = await consultarAPI('/anime/' + id);
        animeActual = respuesta.data;
        mostrarDetalle(animeActual);
        estado.textContent = '';
    } catch (error) {
        estado.textContent = mensajeError(error);
    }
}
cargarDetalle();
