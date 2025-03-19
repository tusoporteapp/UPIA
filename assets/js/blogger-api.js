const apiKey = 'AIzaSyC2gil5B_kl_qRxDtmon8qJ4TdAAHZs4D0'; // Reemplaza con tu API Key de Blogger
const blogId = '6451391688138110772'; // Reemplaza con el ID de tu blog
const maxPosts = 500; // Número máximo de posts a mostrar
const container = document.querySelector('.row.row-cols-1');
const searchInput = document.querySelector('input[type="text"]');

async function fetchPosts() {
    try {
        const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${maxPosts}`);
        const data = await response.json();
        renderPosts(data.items);
    } catch (error) {
        console.error('Error fetching Blogger posts:', error);
    }
}

function renderPosts(posts) {
    container.innerHTML = ''; // Limpiar contenido previo
    posts.forEach(post => {
        const postHTML = `
            <div class="col mb-4">
                <div>
                    <a href="#" onclick="openModal('${post.id}')">
                        <img class="rounded img-fluid shadow w-100 fit-cover" src="${getImageFromPost(post)}" style="height: 250px;" />
                    </a>
                    <div class="py-4">
                        <span class="badge bg-primary mb-2">${getLabels(post)}</span>
                        <h4 class="fw-bold">${post.title}</h4>
                        <p class="text-muted">${truncateText(post.content, 100)}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += postHTML;
    });
}

function getImageFromPost(post) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const img = tempDiv.querySelector('img');
    return img ? img.src : 'products/default.jpg'; // Imagen por defecto si no hay imagen en el post
}

function getLabels(post) {
    return post.labels ? post.labels[0] : 'Sin categoría';
}

function truncateText(text, length) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const cleanText = tempDiv.textContent || tempDiv.innerText || "";
    return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText;
}

function openModal(postId) {
    fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}`)
        .then(response => response.json())
        .then(post => {
            document.querySelector('.modal-title').innerText = post.title;
            document.querySelector('.modal-body').innerHTML = post.content;
            new bootstrap.Modal(document.getElementById('modal-1')).show();
        })
        .catch(error => console.error('Error fetching post:', error));
}

// Función para filtrar los posts
document.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const posts = document.querySelectorAll('.col.mb-4');
    posts.forEach(post => {
        const title = post.querySelector('h4').innerText.toLowerCase();
        const category = post.querySelector('.badge').innerText.toLowerCase();
        post.style.display = (title.includes(searchTerm) || category.includes(searchTerm)) ? 'block' : 'none';
    });
});

document.addEventListener('DOMContentLoaded', fetchPosts);
