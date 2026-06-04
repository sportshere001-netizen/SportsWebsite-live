// --- LOAD MORE NEWS FUNCTIONALITY ---
const extraNews = [
    {
        category: 'Tennis',
        badge: 'bg-warning text-dark',
        title: 'Wimbledon Finals Set',
        img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80',
        desc: 'Djokovic aims for another title as he faces the young challenger Alcaraz on Sunday.'
    },
    {
        category: 'Formula 1',
        badge: 'bg-danger',
        title: 'Monaco GP Highlights',
        img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80',
        desc: 'Rain causes chaos in the pits. Verstappen maintains lead despite strategy error.'
    },
    {
        category: 'Golf',
        badge: 'bg-success',
        title: 'The Masters Update',
        img: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80',
        desc: 'Tiger Woods makes the cut in a stunning comeback performance at Augusta.'
    }
];

function loadMoreNews() {
    const container = document.getElementById('news-container');
    const button = document.getElementById('loadBtn');
    
    button.innerHTML = 'Loading...';
    
    setTimeout(() => {
        extraNews.forEach(news => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-0 fade-in">
                    <div class="img-wrapper">
                        <img src="${news.img}" class="card-img-top" alt="${news.category}">
                    </div>
                    <div class="card-body">
                        <span class="badge ${news.badge} mb-2">${news.category}</span>
                        <h5 class="card-title">${news.title}</h5>
                        <p class="card-text text-muted">${news.desc}</p>
                        <a href="#" class="btn btn-outline-dark btn-sm stretched-link">Read Full Story</a>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
        button.style.display = 'none';
    }, 800);
}

// --- CONTACT FORM FUNCTIONALITY ---
function submitForm(event) {
    event.preventDefault(); 
    
    const nameInput = document.getElementById('firstName');
    const name = nameInput ? nameInput.value : 'User';
    const btn = event.target.querySelector('button');
    
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
        alert(`Thanks, ${name}! Your message has been sent successfully.`);
        event.target.reset();
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1500);
} 
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    
    if (path.includes("cricket.html")) {
        loadLiveScores("cricket", "cricket-scores-container");
    } else if (path.includes("football.html")) {
        loadLiveScores("football", "football-scores-container");
    } else if (path.includes("nba.html")) {
        loadLiveScores("nba", "nba-scores-container");
    }
});

async function loadLiveScores(sportType, targetElementId) {
    const container = document.getElementById(targetElementId);
    if (!container) return;

    container.innerHTML = `<div class="text-center my-4"><div class="spinner-border text-dark" role="status"></div><p class="mt-2 text-muted">Fetching real-time updates...</p></div>`;

    try {
        const response = await fetch(`/api/getScores?sport=${sportType}`);
        const result = await response.json();

        if (!result.matches || result.matches.length === 0) {
            container.innerHTML = `<div class="alert alert-light text-center">No live matches in progress right now.</div>`;
            return;
        }

        container.innerHTML = ""; 

        result.matches.slice(0, 3).forEach(match => {
            let cardHTML = "";

            if (sportType === "cricket") {
                cardHTML = `<div class="col-md-4 mb-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body"><span class="badge bg-danger mb-2">LIVE MATCH</span><h6 class="fw-bold text-dark">${match.name}</h6><p class="small text-muted mb-3">${match.status}</p><div class="bg-light p-2 rounded text-center fw-bold text-primary">${match.score && match.score[0] ? match.score[0].inning + ": " + match.score[0].r + "/" + match.score[0].w : "Match Starting"}</div></div></div></div>`;
            } else if (sportType === "football") {
                cardHTML = `<div class="col-md-4 mb-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body text-center"><span class="badge bg-success mb-2">${match.fixture.status.long}</span><div class="d-flex justify-content-between align-items-center my-2"><span class="fw-bold">${match.teams.home.name}</span><span class="badge bg-dark">${match.goals.home} - ${match.goals.away}</span><span class="fw-bold">${match.teams.away.name}</span></div><small class="text-muted">${match.league.name}</small></div></div></div>`;
            } else if (sportType === "nba") {
                cardHTML = `<div class="col-md-4 mb-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body text-center"><span class="badge bg-primary mb-2">${match.status}</span><div class="my-2"><h6 class="fw-bold">${match.home_team.full_name}: <span class="text-danger">${match.home_team_score}</span></h6><h6 class="fw-bold">${match.visitor_team.full_name}: <span class="text-danger">${match.visitor_team_score}</span></h6></div></div></div></div>`;
            }
            container.innerHTML += cardHTML;
        });
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger text-center">Failed to refresh match cards. Please try again.</div>`;
    }
}