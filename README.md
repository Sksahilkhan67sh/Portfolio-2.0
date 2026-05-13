# Sahil Khan — Portfolio Website

A production-ready personal portfolio built with Python Flask + Jinja2.

## Stack
- **Backend**: Python Flask
- **Templates**: Jinja2
- **Frontend**: Vanilla HTML/CSS/JS (no framework dependencies)
- **Fonts**: Syne + DM Sans + DM Mono (Google Fonts)

## Local Development

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run development server
python app.py

# 3. Open http://localhost:5000
```

## Project Structure

```
portfolio/
├── app.py              # Flask routes
├── data.py             # All portfolio content (edit this to update site)
├── requirements.txt
├── Procfile            # For Render deployment
├── templates/
│   └── index.html      # Main Jinja2 template
└── static/
    ├── css/style.css   # All styles
    └── js/main.js      # Interactivity (typing, scroll reveal, form)
```

## Updating Content

All portfolio content lives in **`data.py`**. Edit the `portfolio` dictionary to:
- Change personal info, links, summary
- Add/remove experience entries
- Add/remove projects and their tech stacks
- Update skills categories
- Add education entries

No template changes needed for content updates.

## Deployment

### Render (recommended)
1. Push to GitHub
2. New Web Service → connect repo
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`

### PythonAnywhere
1. Upload files via Files tab
2. Set WSGI file to point to `app.py`
3. Reload web app

## Resume
Replace `resume_url` in `data.py` with the path to your resume PDF in `static/` or a hosted URL.
```python
"resume_url": "/static/resume.pdf"  # or external URL
```
