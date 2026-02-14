# Basil Eldhose - Security Engineer Portfolio

A modern, defensive-security themed portfolio website featuring:
- **Antigravity Visuals**: Interactive particle system and 3D tilt effects.
- **Glassmorphism Design**: Sleek, dark-mode UI with frosted glass cards.
- **Robust Data Handling**: Automatically fetches GitHub repositories, with a smart fallback to mock data if the API limit is reached or the username is invalid.

## Project Structure

- `index.html`: Main structure and content.
- `style.css`: Visual styling, animations, and responsive design.
- `script.js`: Particle engine, antigravity tilt logic, and GitHub API integration.

## How to Run Locally

1.  Open the folder in VS Code or any terminal.
2.  Run a local server (e.g., using Python):
    ```bash
    python -m http.server 8000
    ```
3.  Open `http://localhost:8000` in your browser.

## Customization

- **Profile Image**: Replace `https://ui-avatars.com/...` in `index.html` with your own `profile.jpg`.
- **GitHub Projects**: Search for `const USERNAME = 'basil-eldhose';` in `script.js` and update it to your actual GitHub username.
