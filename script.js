/* ================= PARTICLE SYSTEM ================= */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
const particleCount = 60;

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.color = Math.random() > 0.5 ? '#00ff88' : '#7000ff';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
        // Connections
        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();


/* ================= ANTIGRAVITY ENGINE ================= */
const elements = document.querySelectorAll("[data-depth]");
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener("mousemove", e => {
    mx = e.clientX - window.innerWidth / 2;
    my = e.clientY - window.innerHeight / 2;
});

function animateAntigravity() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;

    elements.forEach(el => {
        const d = parseFloat(el.getAttribute('data-depth')) || 20;
        const x = -cx / (1000 / d); // Smoother divisor
        const y = -cy / (1000 / d);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    requestAnimationFrame(animateAntigravity);
}
animateAntigravity();

/* ================= GITHUB FETCH ================= */
// Using a default user or error handling if blank
const USERNAME = 'basil-eldhose'; // Placeholder, user can change

fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated`)
    .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
    })
    .then(data => {
        const container = document.getElementById("github-projects");
        container.innerHTML = ''; // Clear placeholder

        const list = Array.isArray(data) ? data : [];

        if (list.length === 0) {
            // If valid user but no repos, or empty array, fall through to mock might be better?
            // But usually empty array means just no repos.
            // Let's force error to trigger mock data if list is empty for this demo
            throw new Error("No repos found, triggering mock");
        }

        list.slice(0, 4).forEach(repo => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-depth", "25");

            card.innerHTML = `
        <div class="card-glow"></div>
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description provided."}</p>
        <div style="margin-top:15px; font-size:0.8rem; color:#666;">
          ⭐ ${repo.stargazers_count} • 🔠 ${repo.language || "N/A"}
        </div>
      `;
            container.appendChild(card);
        });
    })
    .catch(err => {
        console.log("Fetching failed or no repos, using mock data:", err);

        // Fallback to mock data
        const mockRepos = [
            { name: "security-scanner", description: "Automated vulnerability scanner for web applications.", stargazers_count: 128, language: "Python" },
            { name: "packet-sniffer", description: "Network traffic analysis tool for security auditing.", stargazers_count: 85, language: "C++" },
            { name: "auth-guard", description: "JWT-based authentication middleware with rate limiting.", stargazers_count: 240, language: "JavaScript" },
            { name: "zero-trust-proxy", description: "Implementation of zero trust architecture principles.", stargazers_count: 95, language: "Go" },
        ];

        const container = document.getElementById("github-projects");
        container.innerHTML = '';

        mockRepos.forEach(repo => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-depth", "25");

            card.innerHTML = `
        <div class="card-glow"></div>
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description provided."}</p>
        <div style="margin-top:15px; font-size:0.8rem; color:#666;">
          ⭐ ${repo.stargazers_count} • 🔠 ${repo.language || "N/A"}
        </div>
      `;
            container.appendChild(card);
        });

    });

/* ================= SPOTIFY SYNC ================= */
// 🚨 FILL THESE IN FROM THE SETUP GUIDE 🚨
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN_HERE';

async function getAccessToken() {
    const basic = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN
        })
    });
    return response.json();
}

async function getNowPlaying() {
    try {
        const { access_token } = await getAccessToken();
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.status === 204 || response.status > 400) {
            return null; // Nothing playing or error
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching Spotify data:", error);
        return null;
    }
}

let currentTrackId = '0VjIjW4GlUZAMYd2vXMi3b'; // Default: Blinding Lights

async function updateSpotifyPlayer() {
    if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        console.log("Spotify credentials not set. Skipping sync.");
        return;
    }

    const data = await getNowPlaying();

    if (data && data.item && data.item.id) {
        const newTrackId = data.item.id;

        if (newTrackId !== currentTrackId) {
            console.log(`Track changed: ${data.item.name} by ${data.item.artists[0].name}`);
            currentTrackId = newTrackId;

            // Update iframe src
            const iframe = document.querySelector('iframe[src*="spotify.com"]');
            if (iframe) {
                iframe.src = `https://open.spotify.com/embed/track/${newTrackId}?utm_source=generator&theme=0`;
            }
        }
    }
}

// Check every 30 seconds
setInterval(updateSpotifyPlayer, 30000);
// Check immediately on load
updateSpotifyPlayer();


