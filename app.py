from flask import Flask, render_template
import time

app = Flask(__name__)
app.config["SECRET_KEY"] = (
    "8f3a7d9b2c6e4f1a9b3c8d7e6f5a4b2c1d0e9f8a7c6b5d4e3f2a1b0c9d8e7f6g"
)


def greet():
    timeIs = time.strftime("%H")
    if int(timeIs) > 16:
        return "Evening "
    if int(timeIs) > 12:
        return "Afternoon "
    else:
        return "Morning "


@app.route("/")
def home():
    return render_template("layout.html", greeting=greet())


if __name__ == "__main__":
    app.run()