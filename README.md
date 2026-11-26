# Mohamed Ezz — portfolio

Static site, no dependencies. Upload everything in this folder to GitHub Pages, Vercel or any static host.

## Preview locally
    python3 -m http.server
Then open http://localhost:8000 (double-clicking index.html will not follow folder links).

## Edit
- Text (English and Arabic) lives in `build.py`. After editing, run `python3 build.py`. Do not edit the generated HTML files by hand.
- Resume: save your CV as `assets/resume.pdf` and run `python3 build.py`. The resume button and icon then appear.
- Colours and layout: `css/style.css`. Background scene: `js/scene.js`. Motion: `js/motion.js` and `js/main.js`.
