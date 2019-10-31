from flask import Flask
from flask_cors import CORS

def create_app():
  app = Flask(__name__)
  CORS(app)

  from .views.clue import clue
  app.register_blueprint(clue)

  from .views.cell import cell
  app.register_blueprint(cell)

  from .views.solution import solution
  app.register_blueprint(solution)

  return app