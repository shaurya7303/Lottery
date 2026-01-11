from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import re
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config["SECRET_KEY"]


def get_db():
    return sqlite3.connect(
        app.config["DATABASE"],
        timeout=10,
        check_same_thread=False
    )


def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email)


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_email" not in session:
            flash("Please login first", "error")
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        attempts = session.get("login_attempts", 0)
        if attempts >= 5:
            flash("Too many login attempts. Try again later.", "error")
            return redirect(url_for("login"))

        with get_db() as db:
            cursor = db.cursor()
            cursor.execute(
                "SELECT password FROM users WHERE email = ?", (email,)
            )
            user = cursor.fetchone()

        if user and check_password_hash(user[0], password):
            session.clear()
            session["user_email"] = email
            flash("Login successful 🎉", "success")
            return redirect(url_for("dashboard"))
        else:
            session["login_attempts"] = attempts + 1
            flash("Invalid email or password", "error")

    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.form

    
        if not all(data.values()):
            flash("All fields are required", "error")
            return redirect(url_for("register"))

       
        if not is_valid_email(data["email"]):
            flash("Please enter a valid email (example@gmail.com)", "error")
            return redirect(url_for("register"))

       
        if len(data["password"]) < 8:
            flash("Password must be at least 8 characters", "error")
            return redirect(url_for("register"))

        
        if data["password"] != data["confirm_password"]:
            flash("Passwords do not match", "error")
            return redirect(url_for("register"))

        with get_db() as db:
            cursor = db.cursor()

        
            cursor.execute(
                "SELECT id FROM users WHERE email = ?", (data["email"],)
            )
            if cursor.fetchone():
                flash("Email already registered", "error")
                return redirect(url_for("register"))

            hashed_password = generate_password_hash(data["password"])
            cursor.execute("""
                INSERT INTO users (first_name, last_name, email, phone, password)
                VALUES (?, ?, ?, ?, ?)
            """, (
                data["first_name"],
                data["last_name"],
                data["email"],
                data["phone"],
                hashed_password
            ))

        flash("Registration successful. Please login.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")




@app.route("/logout")
def logout():
    session.clear()
    flash("Logged out successfully", "success")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
