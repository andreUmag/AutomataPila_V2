from flask import Flask, render_template
from routes.routes import registers_routes
from config.db import app

app.register_blueprint(registers_routes)

@app.route("/")
def index(): 
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
