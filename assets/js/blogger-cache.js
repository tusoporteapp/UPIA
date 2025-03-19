const CACHE_NAME = 'blogger-cache-v1';

async function fetchAndCachePosts() {
    try {
        const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${maxPosts}`);
        const data = await response.json();
        
        if (data.items) {
            localStorage.setItem(CACHE_NAME, JSON.stringify(data.items));
        }
        
        return data.items;
    } catch (error) {
        console.warn('No se pudo obtener datos en línea, cargando desde caché', error);
        return getCachedPosts();
    }
}

function getCachedPosts() {
    const cachedData = localStorage.getItem(CACHE_NAME);
    return cachedData ? JSON.parse(cachedData) : [];
}

async function updateCacheIfNeeded() {
    const cachedPosts = getCachedPosts();
    const latestPost = cachedPosts.length ? cachedPosts[0] : null;
    
    try {
        const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=1`);
        const data = await response.json();
        
        if (data.items && (!latestPost || data.items[0].id !== latestPost.id)) {
            console.log('Nuevo contenido detectado, actualizando caché');
            fetchAndCachePosts();
        } else {
            console.log('El caché está actualizado.');
        }
    } catch (error) {
        console.warn('Error al verificar nuevas publicaciones.', error);
    }
}

async function loadPosts() {
    const posts = getCachedPosts();
    renderPosts(posts);
    await updateCacheIfNeeded();
}

document.addEventListener('DOMContentLoaded', loadPosts);
