# MyPortfolio_Rohith171801

A personal portfolio web application built with Flask to showcase skills, projects, and provide a contact point.

## Features

- **Dynamic Greeting**: The homepage greets users with "Good Morning", "Good Afternoon", or "Good Evening" based on the time in India (IST).
- **Responsive Design**: Uses HTML templates and static assets for a modern portfolio look.
- **Environment-based Configuration**: Secure configuration using `.env`.
- **Easy Deployment**: Ready for deployment on Vercel or any WSGI-compatible platform.

## Demo

> [Live Demo Link (if available)](https://your-demo-url)

## Getting Started

### Prerequisites

- Python 3.8+
- [pip](https://pip.pypa.io/en/stable/)
- (Recommended) [virtualenv](https://virtualenv.pypa.io/en/latest/)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/171801rohith/MyPortfolio_Rohith171801.git
   cd MyPortfolio_Rohith171801
   ```

2. **Create a virtual environment (optional but recommended)**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   - Copy `.env.example` (if exists) to `.env` and fill in the required values.
   - At minimum, set a `SECRET_KEY` for Flask sessions.

5. **Run the application**
   ```sh
   python app.py
   ```
   The app will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Project Structure

```
.
├── app.py                # Main Flask application
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (not tracked in git)
├── static/               # Static files (CSS, JS, images)
├── templates/
│   └── layout.html       # Main HTML template
├── vercel.json           # Configuration for Vercel deployment
└── venv/                 # Virtual environment (not tracked in git)
```

## Customization

- Edit `templates/layout.html` to customize the portfolio content, sections, and styling.
- Add your own static assets (CSS, JS, images) in the `static/` directory.

## Dependencies

Key packages (see `requirements.txt` for details):
- Flask
- python-dotenv
- pytz
- Jinja2
- WTForms

## Deployment

The repository includes a `vercel.json` file for easy deployment to [Vercel](https://vercel.com/).
You can also deploy to any platform that supports Python and WSGI.

## License

[MIT License](LICENSE)  <!-- Update if your repo uses a different license -->

## Author

**Rohith (171801rohith)**  
[GitHub Profile](https://github.com/171801rohith)

---

*Feel free to fork and adapt this portfolio to your own needs!*
