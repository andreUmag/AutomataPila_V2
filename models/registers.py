from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy                                                    
from config.db import app

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Registers(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    word = db.Column(db.String(300), nullable=False)
      
    def __init__(self, word): 
        self.word = word
        
class RegistersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Registers

register_schema = RegistersSchema()
registers_schema = RegistersSchema(many=True)

with app.app_context():
    db.create_all()