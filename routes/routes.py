from flask import blueprints, request, jsonify
from models.registers import Registers, register_schema, registers_schema, db

registers_routes = blueprints.Blueprint("register", __name__)

@registers_routes.route('/get', methods=['GET'])
def get_register():
    register=Registers.query.all()
    return jsonify(registers_schema.dump(register))