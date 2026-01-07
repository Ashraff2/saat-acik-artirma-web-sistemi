const initialWatches = [
    { name: "Rolex Submariner", price: 15000, img: "1.jpg" },
    { name: "Omega Seamaster", price: 8500, img: "2.jpg" },
    { name: "Cartier Santos", price: 12000, img: "3.jpg" }
];

const path = window.location.pathname;
const pageName = path.split("/").pop();
const isAuthPage = pageName === "login.html" || pageName === "register.html";
const isLoggedIn = localStorage.getItem('userActive');

if (!isLoggedIn && !isAuthPage) {
    window.location.href = 'login.html';
}

function loginUser() {
    const name = document.getElementById('lName').value;
    const pass = document.getElementById('lPass').value;

    if (name === "ashraf" && pass === "1234") {
        localStorage.setItem('userActive', 'true');
        localStorage.setItem('currentUser', JSON.stringify({name: 'Ashraf', email: 'ashraf@kbu'}));
        window.location.href = 'index.html';
    } else {
        alert("Hata: Kullanıcı adı veya şifre yanlış!");
    }
}

function fakeRegister() {
    const name = document.getElementById('rName').value;
    const email = document.getElementById('rEmail').value;
    const pass = document.getElementById('rPass').value;

    if (name && email && pass) {
        localStorage.setItem('userActive', 'true');
        localStorage.setItem('currentUser', JSON.stringify({name: name, email: email}));
        alert("Kayıt Başarılı! Yönlendiriliyorsunuz...");
        window.location.href = 'index.html';
    } else {
        alert("Lütfen tüm alanları doldurun!");
    }
}

function logout() {
    if(confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        localStorage.removeItem('userActive');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

function getWatches() {
    let stored = localStorage.getItem('unifiedWatchList');
    if (!stored) {
        localStorage.setItem('unifiedWatchList', JSON.stringify(initialWatches));
        return initialWatches;
    }
    return JSON.parse(stored);
}

function saveWatches(watches) {
    localStorage.setItem('unifiedWatchList', JSON.stringify(watches));
}

document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    if(document.getElementById('watchGrid')) {
        renderGrid();
    }
    if(document.getElementById('profileName')) {
        loadProfile();
    }
});

function loadProfile() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
        document.getElementById('profileName').innerText = userData.name;
        document.getElementById('profileEmail').innerText = userData.email;
    }
}

function renderGrid(data = null) {
    const grid = document.getElementById('watchGrid');
    if (grid) {
        const watches = data || getWatches();
        
        if (watches.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%; color:#777;">Sonuç bulunamadı.</p>';
            return;
        }

        grid.innerHTML = watches.map((w, index) => `
            <div class="card">
                <img src="${w.img}" alt="${w.name}">
                <h3>${w.name}</h3>
                <p class="price">$${Number(w.price).toLocaleString()}</p>
                <button onclick="placeBid(${index}, ${w.price})">Teklif Ver</button>
                <button onclick="deleteWatch(${index})" class="del-btn">İlanı Sil</button>
            </div>
        `).join('');
    }
}

function searchWatches() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const allWatches = getWatches();
    const filtered = allWatches.filter(w => w.name.toLowerCase().includes(term));
    renderGrid(filtered);
}

function deleteWatch(index) {
    if(confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
        const watches = getWatches();
        watches.splice(index, 1);
        saveWatches(watches);
        renderGrid();
        const searchInput = document.getElementById('searchInput');
        if(searchInput) searchInput.value = '';
    }
}

function placeBid(index, currentPrice) {
    let bidAmount = prompt(`Mevcut Fiyat: $${currentPrice.toLocaleString()}\nLütfen teklifinizi girin:`);
    if (bidAmount === null) return;
    
    let numericBid = Number(bidAmount);

    if (!isNaN(numericBid) && numericBid > currentPrice) {
        const watches = getWatches();
        watches[index].price = numericBid;
        saveWatches(watches);
        alert(`Teklifiniz onaylandı: $${numericBid.toLocaleString()}`);
        renderGrid(); 
    } else {
        alert("Hata: Teklifiniz mevcut fiyattan yüksek olmalıdır!");
    }
}

function addWatch() {
    const name = document.getElementById('wName').value;
    const price = document.getElementById('wPrice').value;
    const fileInput = document.getElementById('wImage');
    
    if (name && price && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const watches = getWatches();
            watches.unshift({ name: name, price: Number(price), img: e.target.result });
            saveWatches(watches);
            alert('İlan başarıyla yayınlandı!');
            window.location.href = 'index.html';
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert('Lütfen tüm alanları doldurun!');
    }
}

function updateNav() {
    const nav = document.getElementById('nav-links');
    if(nav) {
        nav.innerHTML = `
            <a href="index.html">Ana Sayfa</a>
            <a href="sell.html" style="color:#e67e22; font-weight:bold;">+ İlan Ver</a>
            <a href="my-account.html">Hesabım</a>
        `;
    }
}