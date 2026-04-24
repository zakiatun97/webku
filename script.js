let wisataData = [];

// 1. Fetch & Load Data
async function loadWisataData() {
    try {
        const response = await fetch('wisata.json');
        wisataData = await response.json();
        renderCards(wisataData);
    } catch (error) {
        console.error("Gagal memuat data wisata:", error);
        // Fallback UI jika file tidak ditemukan
        document.getElementById('wisataGrid').innerHTML = '<p>Maaf, data tidak dapat dimuat.</p>';
    }
}

// 2. Render Cards dengan Struktur Modern
function renderCards(data) {
    const grid = document.getElementById('wisataGrid');
    grid.innerHTML = ''; 

    if (data.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Destinasi tidak ditemukan.</p>';
        return;
    }

    data.forEach(item => {
        const card = `
            <article class="card">
                <div class="card-img-wrapper">
                    <img src="gambar/${item.gambar}" alt="${item.nama}" onerror="this.src='https://via.placeholder.com/400x250?text=Gambar+Tidak+Ada'">
                </div>
                <div class="card-body">
                    <span class="category-tag">${item.kategori.toUpperCase()}</span>
                    <h3>${item.nama}</h3>
                    <p>${item.deskripsi}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <span style="font-weight: 700; color: #2c3e50;">Rp ${item.harga_tiket.toLocaleString('id-ID')}</span>
                        <span style="font-size: 0.85rem; color: #f1c40f;">⭐ ${item.rating}</span>
                    </div>
                </div>
            </article>
        `;
        grid.innerHTML += card;
    });
}

// 3. Search real-time
document.getElementById('searchBar').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = wisataData.filter(item => 
        item.nama.toLowerCase().includes(keyword) || 
        item.lokasi.toLowerCase().includes(keyword)
    );
    renderCards(filtered);
});

// 4. Filter Button Logic
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        if (category === 'all') {
            renderCards(wisataData);
        } else {
            const filtered = wisataData.filter(item => item.kategori === category);
            renderCards(filtered);
        }
    });
});

// 5. Mobile Navbar (Hamburger) Logic
const initNavbar = () => {
    const burger = document.querySelector('#mobile-menu');
    const nav = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav Menu
        nav.classList.toggle('nav-active');
        
        // Animasi Burger ke X
        burger.classList.toggle('toggle');

        // Nav Item Animation (Fade In)
        navItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when clicking links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });
}

// 6. Form Validation
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama || !email || !pesan) {
        showFeedback("Semua kolom wajib diisi!", "error");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        showFeedback("Format email tidak valid!", "error");
        return;
    }

    showFeedback("Terima kasih, pesan Anda telah terkirim!", "success");
    e.target.reset();
});

function showFeedback(message, type) {
    // Menggunakan alert sederhana namun fungsional untuk LKS
    // Bisa dikembangkan menjadi Custom Modal jika waktu cukup
    alert(message);
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    loadWisataData();
    initNavbar();
});