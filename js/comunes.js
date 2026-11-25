// Funciones compartidas
const CLAVE_FAVORITOS = 'aniverse-kitsu-favoritos';

function leerFavoritos() {
    // Leer favoritos
    try {
        const lista = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) || '[]');
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        return [];
    }
}

function guardarFavoritos(lista) {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
}

function asignarPortada(imagen, anime) {
    imagen.alt = 'Portada de ' + anime.title;
    imagen.src = anime.images?.jpg?.image_url || 'assets/sin-portada.svg';
    // Imagen de respaldo
    imagen.addEventListener('error', () => {
        imagen.src = 'assets/sin-portada.svg';
    }, { once: true });
}

function crearTarjeta(anime, alEliminar) {
    // Crear tarjeta
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';
    const imagen = document.createElement('img');
    imagen.loading = 'lazy';
    asignarPortada(imagen, anime);
    const contenido = document.createElement('div');
    contenido.className = 'tarjeta-contenido';
    const titulo = document.createElement('h3');
    titulo.textContent = anime.title;
    const puntuacion = document.createElement('p');
    puntuacion.textContent = 'Puntuación: ' + (anime.score ?? 'Sin datos');
    const enlace = document.createElement('a');
    enlace.className = 'boton';
    enlace.href = 'anime.html?id=' + encodeURIComponent(anime.id);
    enlace.textContent = 'Ver detalles';
    contenido.append(titulo, puntuacion, enlace);
    // Botón de eliminar
    if (alEliminar) {
        const boton = document.createElement('button');
        boton.textContent = 'Eliminar';
        boton.addEventListener('click', () => alEliminar(anime.id));
        contenido.append(boton);
    }
    tarjeta.append(imagen, contenido);
    return tarjeta;
}

// Mostrar tarjetas
function mostrarTarjetas(contenedor, animes, alEliminar) {
    contenedor.replaceChildren();
    animes.forEach(anime => {
        contenedor.append(crearTarjeta(anime, alEliminar));
    });
}
