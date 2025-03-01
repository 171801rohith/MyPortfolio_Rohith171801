from flask import Flask, render_template
from datetime import datetime
from dotenv import load_dotenv
import pytz
import os

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")


def greet():
    ist = pytz.timezone("Asia/Kolkata")
    hour = datetime.now(ist).hour
    if hour >= 17:
        return "Evening"
    elif hour >= 12:
        return "Afternoon"
    else:
        return "Morning"


@app.route("/")
def home():
    return render_template("layout.html", greeting=greet())


if __name__ == "__main__":
    app.run(debug=True)
