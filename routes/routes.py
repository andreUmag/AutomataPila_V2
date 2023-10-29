from flask import blueprints, request, jsonify
from models.registers import Registers, register_schema, registers_schema, db

registers_routes = blueprints.Blueprint("register", __name__)

@registers_routes.route('/get', methods=['GET'])
def get_register():
    register=Registers.query.all()
    return jsonify(registers_schema.dump(register))

@registers_routes.route('/post', methods=['POST'])
def create_register():
    try:
        data = request.get_json()
        db.session.add(Registers(**data))
        db.session.commit()
        return register_schema.jsonify(Registers(**data)),201
    except Exception as e:
        return jsonify({"error":"Error al crear el registro","details":str(e)}),400
    
@registers_routes.route('/delete/<id>', methods=['DELETE'])
def delete_comment(id):
    try:
        register = Registers.query.get(id)
        if not register:
            return jsonify({"error":"Error al encontrar el registro"}), 404
        
        db.session.delete(register)
        db.session.commit()
        
        return jsonify({"error":"Registro eliminado correctamente xd"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Error al eliminar el registro","details":str(e)}),500