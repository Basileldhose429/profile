/* ================= BOOT SEQUENCE ================= */
document.addEventListener("DOMContentLoaded", () => {
  const bootText = document.getElementById("boot-text");
  const bootScreen = document.getElementById("boot-screen");
  
  const lines = [
    "BIOS check... OK",
    "Loading kernel... OK",
    "Mounting file systems... OK",
    "Starting network interfaces... eth0 UP",
    "Establishing secure tunnel...",
    "Connection established.",
    "Bypassing firewall... SUCCESS",
    "Accessing mainframe... ",
    "Welcome, basil_eldhose."
  ];

  let currentLine = 0;
  
  function typeLine() {
    if (currentLine < lines.length) {
      bootText.innerHTML += lines[currentLine] + "<br>";
      currentLine++;
      setTimeout(typeLine, Math.random() * 200 + 100);
    } else {
      setTimeout(() => {
        bootScreen.style.transition = "opacity 0.8s ease";
        bootScreen.style.opacity = "0";
        setTimeout(() => {
          bootScreen.style.display = "none";
          document.body.classList.remove("booting");
        }, 800);
      }, 500);
    }
  }

  // Start sequence
  document.body.classList.add("booting");
  setTimeout(typeLine, 500);
});

/* ================= MATRIX RAIN ================= */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
const charArray = chars.split("");

const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff41";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = charArray[Math.floor(Math.random() * charArray.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 33);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


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
const USERNAME = 'Basileldhose429';

fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated`)
  .then(res => {
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return res.json();
  })
  .then(data => {
    const container = document.getElementById("github-projects");
    container.innerHTML = '';

    const list = Array.isArray(data) ? data : [];
    if (list.length === 0) throw new Error("No repos found");

    list.slice(0, 4).forEach(repo => {
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.className = "pj-card";
      
      card.innerHTML = `
        <div class="pj-title">${repo.name}</div>
        <div class="pj-desc">${repo.description || "No description provided."}</div>
        <div class="pj-meta">
          <span>[Lang: ${repo.language || "N/A"}]</span>
          <span>[Stars: ${repo.stargazers_count}]</span>
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    console.log("GitHub API fallback:", err);
    // Mock data
    const mockRepos = [
      { name: "security-scanner", description: "Automated vulnerability scanner for web applications.", stargazers_count: 128, language: "Python" },
      { name: "packet-sniffer", description: "Network traffic analysis tool for security auditing.", stargazers_count: 85, language: "C" },
      { name: "auth-guard", description: "JWT-based authentication middleware with rate limiting.", stargazers_count: 240, language: "Go" },
      { name: "zero-trust-proxy", description: "Implementation of zero trust architecture principles.", stargazers_count: 95, language: "Rust" },
    ];

    const container = document.getElementById("github-projects");
    container.innerHTML = '';

    mockRepos.forEach(repo => {
      const card = document.createElement("a");
      card.href = "#";
      card.className = "pj-card";
      
      card.innerHTML = `
        <div class="pj-title">${repo.name}</div>
        <div class="pj-desc">${repo.description || "No description provided."}</div>
        <div class="pj-meta">
          <span>[Lang: ${repo.language || "N/A"}]</span>
          <span>[Stars: ${repo.stargazers_count}]</span>
        </div>
      `;
      container.appendChild(card);
    });
  });

/* ================= AUDIO PLAYER ================= */
const bgAudio = document.getElementById("bgAudio");
const playBtn = document.getElementById("audioPlayBtn");
const volBtn = document.getElementById("audioVolBtn");
const progressBar = document.getElementById("audioProgressBar");
const progressWrap = document.getElementById("audioProgressWrap");

let isPlaying = false;

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgAudio.pause();
    playBtn.innerText = "[ PLAY ]";
  } else {
    bgAudio.play().catch(e => console.log("Audio play failed:", e));
    playBtn.innerText = "[ PAUSE ]";
  }
  isPlaying = !isPlaying;
});

volBtn.addEventListener("click", () => {
  bgAudio.muted = !bgAudio.muted;
  volBtn.innerText = bgAudio.muted ? "VOL:OFF" : "VOL:ON";
  volBtn.style.color = bgAudio.muted ? "#555" : "var(--green)";
});

bgAudio.addEventListener("timeupdate", () => {
  const percent = (bgAudio.currentTime / bgAudio.duration) * 100;
  progressBar.style.width = percent + "%";
});

progressWrap.addEventListener("click", (e) => {
  const rect = progressWrap.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  bgAudio.currentTime = percent * bgAudio.duration;
});
