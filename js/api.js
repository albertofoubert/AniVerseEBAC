// URL de la API
const URL_API = 'https://kitsu.io/api/edge';

// Datos del anime
function convertirAnime(registro) {
    const datos = registro.attributes;
    return {
        id: registro.id,
        title: datos.canonicalTitle || datos.titles?.en || 'Sin título',
        title_japanese: datos.titles?.ja_jp,
        images: { jpg: { image_url: datos.posterImage?.medium || datos.posterImage?.original } },
        score: datos.averageRating == null ? null : Number(datos.averageRating) / 10,
        synopsis: datos.synopsis || datos.description,
        episodes: datos.episodeCount,
        type: datos.subtype,
        status: datos.status,
        year: datos.startDate?.slice(0, 4),
        ageRating: datos.ageRating,
        episodeLength: datos.episodeLength,
        slug: datos.slug
    };
}

async function consultarAPI(endpoint, parametros = {}) {
    if (typeof axios === 'undefined') {
        throw new Error('Axios no se cargó');
    }
    // Petición a la API
    const respuesta = await axios.get(URL_API + endpoint, {
        params: parametros,
        timeout: 20000,
        headers: { Accept: 'application/vnd.api+json' }
    });
    const cuerpo = respuesta.data;
    // Regresar los datos
    return {
        data: Array.isArray(cuerpo.data) ? cuerpo.data.map(convertirAnime) : convertirAnime(cuerpo.data),
        pagination: { has_next_page: Boolean(cuerpo.links?.next) }
    };
}

// Mostrar errores
function mensajeError(error) {
    console.error('Error en AniVerse:', error);
    if (typeof axios === 'undefined') return 'No se cargó Axios. Comprueba el CDN o recarga la página.';
    if (error.response?.status === 429) return 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.';
    if (error.response?.status === 404) return 'No se encontró este anime.';
    if (error.response?.status) return 'Kitsu respondió con un error HTTP ' + error.response.status + '.';
    if (error.code === 'ECONNABORTED') return 'Kitsu tardó demasiado en responder. Intenta nuevamente.';
    if (error.code === 'ERR_NETWORK') return 'No se pudo comunicar con Kitsu. Revisa la consola del navegador.';
    return 'Ocurrió un error al cargar los datos. Revisa la consola del navegador.';
}
