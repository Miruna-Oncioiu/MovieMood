# 🎬 MovieMood

**MovieMood** este un proiect personal, care îmbină pasiunea pentru filme cu cea pentru programare. 
Este o aplicație web full-stack care oferă recomandări de filme în funcție de **starea de spirit**, 
**preferințele de gen** sau **actorii favoriți**. Proiectul folosește API-ul 
[TMDb](https://www.themoviedb.org/documentation/api) pentru a prelua date în timp real despre filme, 
inclusiv afișe, ratinguri, actori și filme în trend.

---

## 🌟 Funcționalități
- 🔐 Autentificare / Creare cont (logică simplificată pe client)
- 😊 Recomandări de filme în funcție de **stare**
- 🔎 Căutare filme după titlu sau numele actorului
- 🎯 Gestionarea unei **liste de vizionat** și **filme deja văzute**
- 🔥 Vizualizare filme populare în săptămâna curentă
- 🌙 Mod **dark** și **light**
- 💻 Interfață responsivă, curată, construită cu JavaScript simplu

---

## 🛠️ Tehnologii folosite

### Frontend
- HTML, CSS, JavaScript (Vanilla)
- Suport pentru dark mode
- Layout adaptabil pe desktop și mobil

### Backend
- Python (FastAPI)
- API-uri REST pentru watchlist, căutare și starea filmelor

### Alte unelte
- TMDb API pentru date despre filme
- Git & GitHub pentru controlul versiunilor

---

## 📦 Cum rulezi aplicația local

1. **Clonează proiectul:**
   git clone https://github.com/username/moviemood.git
   cd moviemood

2. **Rulează backend-ul cu FastAPI:**
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    uvicorn main:app --reload
   
4. **Ruleaza frontend-ul**
   npm run dev
