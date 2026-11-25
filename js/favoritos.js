const contenedor = document.querySelector('#favoritos');
const estado = document.querySelector('#estado-favoritos');

// Eliminar anime
function eliminarFavorito(id) {
    const favoritos = leerFavoritos();
    try {
        guardarFavoritos(favoritos.filter(anime => anime.id !== id));
        cargarFavoritos();
    } catch (error) {
        estado.textContent = 'No se pudo actualizar la lista.';
    }
}

// Mostrar favoritos
function cargarFavoritos() {
    const favoritos = leerFavoritos();
    estado.textContent = favoritos.length ? 'Animes guardados: ' + favoritos.length : 'Todavía no tienes favoritos. Explora el catálogo y guarda un anime.';
    mostrarTarjetas(contenedor, favoritos, eliminarFavorito);
}
cargarFavoritos();
