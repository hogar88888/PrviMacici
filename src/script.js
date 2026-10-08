const rjecnikPrijevoda = {
    hr: {
        "lang-menu-onama": "O NAMA",
        "lang-menu-koncerti": "KONCERTI",
        "lang-menu-mediji": "MEDIJI",
        "lang-menu-galerija": "FOTO/VIDEO",
        "lang-menu-kontakt": "KONTAKT"
    },
    en: {
        "lang-menu-onama": "ABOUT US",
        "lang-menu-koncerti": "GIGS",
        "lang-menu-mediji": "MEDIA",
        "lang-menu-galerija": "PHOTOS",
        "lang-menu-kontakt": "CONTACT"
    },
    de: {
        "lang-menu-onama": "ÜBER UNS",
        "lang-menu-koncerti": "KONZERTE",
        "lang-menu-mediji": "MEDIEN",
        "lang-menu-galerija": "GALERIE",
        "lang-menu-kontakt": "KONTAKT"
    },
    hu: {
        "lang-menu-onama": "RÓLUNK",
        "lang-menu-koncerti": "KONCERTEK",
        "lang-menu-mediji": "MÉDIA",
        "lang-menu-galerija": "FOTÓK",
        "lang-menu-kontakt": "KAPCSOLAT"
    }
};


const rijeciPjesme = {
    'pocetna': 'moj',
    'koncerti': 'mozak',
    'mediji': 'puca',
    'galerija': 'u',
    'kontakt': 'mom',
    'admin': 'tijelu'
};

window.promijeniJezik = function(kodJezika) {
    const prijevodi = rjecnikPrijevoda[kodJezika];
    if (!prijevodi) return;

    for (const id in prijevodi) {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = prijevodi[id];
        }
    }
    localStorage.setItem('die_hausers_lang', kodJezika);
    console.log("Jezik promijenjen na: " + kodJezika);
};

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.cassette-btn').forEach(b => b.classList.remove('active'));
    
    const targetContent = document.getElementById(tabId);
    const targetButton = document.getElementById('btn-' + tabId);
    
    if (targetContent) targetContent.classList.add('active');
    if (targetButton) targetButton.classList.add('active');

    
    const podnaslovElement = document.getElementById('lang-podnaslov');
    if (podnaslovElement && rijeciPjesme[tabId]) {
        let rijec = rijeciPjesme[tabId];
        
        if (tabId === 'galerija') {
            const trenutniJezik = localStorage.getItem('die_hausers_lang') || 'hr';
            if (trenutniJezik === 'en' || trenutniJezik === 'de') rijec = 'in';
            else if (trenutniJezik === 'hu') rijec = 'a';
            else rijec = 'u';
        }
        podnaslovElement.innerText = rijec;
    }

    
    const audio = document.getElementById('pozadinska-muzika');
    if (audio) {
        if (tabId === 'mediji') {
            audio.pause();
        } else {
            audio.play().catch(err => {
                audio.src = "./src/muzika1.wav.wav";
                audio.play().catch(e => console.log("Lokalna blokada zvuka s diska."));
            });
        }
    }
};

const pocetniKoncerti = [
    { id: "1", datum: "19.06.", klub: "Sibir Album Release", grad: "Online / PDV Records" },
    { id: "2", datum: "25.06.", klub: "FRAN Fest (Promocija)", grad: "Draž (Baranja)" },
    { id: "3", datum: "12.08.", klub: "Klub Exit (Podrum)", grad: "Osijek" },
    { id: "4", datum: "05.09.", klub: "Underground Sessions", grad: "Zagreb" }
];

let koncerti = JSON.parse(localStorage.getItem('die_hausers_gigs')) || pocetniKoncerti;

function prikaziKoncerte() {
    const tablicaJavno = document.getElementById('tablica-koncerata-javno');
    const tablicaAdmin = document.getElementById('tablica-koncerata-admin');
    
    if (!tablicaJavno || !tablicaAdmin) return;

    tablicaJavno.innerHTML = '';
    tablicaAdmin.innerHTML = '';

    koncerti.forEach(koncert => {
        tablicaJavno.innerHTML += `<tr><td>${koncert.datum}</td><td>${koncert.klub}</td><td>${koncert.grad}</td></tr>`;
        tablicaAdmin.innerHTML += `<tr><td>${koncert.datum}</td><td>${koncert.klub}</td><td>${koncert.grad}</td><td>
            <button onclick="pokreniUredi('${koncert.id}')" style="background:#ffcc00; border:none; padding:5px 10px; cursor:pointer; font-weight:bold; border-radius:3px; margin-right:5px;">Uredi</button>
            <button onclick="obrisiKoncert('${koncert.id}')" style="background:#ff3333; color:#fff; border:none; padding:5px 10px; cursor:pointer; font-weight:bold; border-radius:3px;">Obriši</button>
        </td></tr>`;
    });

    localStorage.setItem('die_hausers_gigs', JSON.stringify(koncerti));
}

document.addEventListener('DOMContentLoaded', () => {
    prikaziKoncerte();
    
    const spremljeniJezik = localStorage.getItem('die_hausers_lang') || 'hr';
    promijeniJezik(spremljeniJezik);

    const forma = document.getElementById('crud-forma');
    if (forma) {
        forma.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('koncert-id').value;
            let datumRaw = document.getElementById('crud-datum').value;
            const klub = document.getElementById('crud-klub').value;
            const grad = document.getElementById('crud-grad').value;

            let datumKonacni = datumRaw;
            if (datumRaw.includes('-')) {
                const dijelovi = datumRaw.split('-');
                datumKonacni = `${dijelovi}.${dijelovi}.`;
            }

            if (id) {
                const indeks = koncerti.findIndex(k => k.id === id);
                if (indeks !== -1) koncerti[indeks] = { id, datum: datumKonacni, klub, grad };
                const gumb = document.getElementById('crud-gumb-potvrdi');
                if (gumb) gumb.innerText = "Dodaj Koncert";
            } else {
                koncerti.push({ id: Date.now().toString(), datum: datumKonacni, klub, grad });
            }

            forma.reset();
            document.getElementById('koncert-id').value = '';
            prikaziKoncerte();
            alert('Uspješno spremljeno!');
        });
    }
});

window.pokreniUredi = function (id) {
    const koncert = koncerti.find(k => k.id === id);
    if (koncert) {
        document.getElementById('koncert-id').value = koncert.id;
        document.getElementById('crud-klub').value = koncert.klub;
        document.getElementById('crud-grad').value = koncert.grad;
        
        const gumb = document.getElementById('crud-gumb-potvrdi');
        if (gumb) gumb.innerText = "Spremi izmjene";
        window.scrollTo(0, document.body.scrollHeight);
    }
};

window.obrisiKoncert = function (id) {
    if (confirm('Briši?')) {
        koncerti = koncerti.filter(k => k.id !== id);
        prikaziKoncerte();
    }
};
