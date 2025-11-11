# # app.py
# from flask import Flask, session, jsonify, request, render_template_string, url_for, redirect
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_marshmallow import Marshmallow
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# # -------------------------------------------------
# # Configuration
# # -------------------------------------------------
# app.config['SECRET_KEY'] = 'change-me-to-a-random-string'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# # -------------------------------------------------
# # Extensions
# # -------------------------------------------------
# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)
# ma = Marshmallow(app)



# # -------------------------------------------------
# # Create DB (run once)
# # -------------------------------------------------
# with app.app_context():
#     db.create_all()


# # -------------------------------------------------
# # Routes (API)
# # -------------------------------------------------

# # Auth #
# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
#     if not data or 'name' not in data or 'password' not in data:
#         return jsonify({"error": "name & password required"}), 400
#     if User.query.filter_by(name=data['name']).first():
#         return jsonify({"error": "Username taken"}), 409
#     user = User(name=data['name'])
#     user.password_hash = data['password']
#     db.session.add(user)
#     db.session.commit()
#     return user_schema.dump(user), 201

# @app.route('/login', methods=['POST'])
# def login():
    
#     data = request.get_json()
#     if not data or 'name' not in data or 'password' not in data:
#         return jsonify({"error": "name & password required"}), 400
#     user = User.query.filter_by(name=data['name']).first()
#     if user and user.authenticate(data['password']):
#         session['user_id'] = user.id
#         session['name'] = user.name
#         return user_schema.dump(user), 200
#     return jsonify({"error": "Invalid credentials"}), 401

# @app.route('/logout', methods=['POST'])
# def logout():
#     session.clear()
#     return jsonify({"message": "Logout successful"}), 200

# @app.route('/profile')
# def profile():
#     if 'user_id' not in session:
#         return jsonify({"error": "Login required"}), 401
#     user = User.query.get(session['user_id'])
#     return jsonify(user_schema.dump(user))

# @app.route('/check_session')
# def check_session():
#     if 'user_id' in session:
#         user = User.query.get(session['user_id'])
#         return jsonify({
#             "logged_in": True,
#             "user": user_schema.dump(user)
#         })
#     return jsonify({"logged_in": False})

# # Categories #
# @app.route('/categories/', methods=['GET'])
# def get_categories():
#     categories = Category.query.all()
#     return jsonify(categories_schema.dump(categories))


# # Products  #
# @app.route('/products/new', methods=['POST'])
# def create_product():
#     # Check if logged in
#     if 'user_id' not in session:
#         return jsonify({"error": "Login required"}), 401
    
#     data = request.get_json()
#     if not data or 'name' not in data or 'category_id' not in data:
#         return jsonify({"error": "name & category_id required"}), 400
    
#     new_product = Product(
#         name=data['name'], 
#         rack=data.get('rack'),
#         bin=data.get('bin'), 
#         category_id=data['category_id'], 
#         user_id=session['user_id']  # Always use logged-in user's ID
#     )
#     db.session.add(new_product)
#     db.session.commit()
#     return product_schema.dump(new_product), 201

# @app.route('/products/<int:id>/edit', methods=['PATCH'])
# def update_product(id):
#     # Check if logged in
#     if 'user_id' not in session:
#         return jsonify({"error": "Login required"}), 401
    
#     # Get product ONLY if it belongs to logged-in user
#     product = Product.query.filter_by(id=id, user_id=session['user_id']).first()
#     if not product:
#         return jsonify({"error": "Product not found"}), 404
    
#     data = request.get_json()
#     if not data or 'name' not in data:
#         return jsonify({"error": "name is required"}), 400
    
#     product.name = data['name']
    
#     if 'rack' in data:
#         product.rack = data['rack']
#     if 'bin' in data:
#         product.bin = data['bin']
    
#     db.session.commit()
#     return product_schema.dump(product), 200

# @app.route('/products/<int:id>', methods=['DELETE'])
# def delete_product(id):
#     # Check if logged in
#     if 'user_id' not in session:
#         return jsonify({"error": "Login required"}), 401
    
#     # Get product ONLY if it belongs to logged-in user
#     product = Product.query.filter_by(id=id, user_id=session['user_id']).first()
#     if not product:
#         return jsonify({"error": "Product not found"}), 404
    
#     db.session.delete(product)
#     db.session.commit()
#     return jsonify({"message": "Product deleted"}), 200


# @app.route('/')
# def index():
#     if 'user_id' in session:
#         user = User.query.get(session['user_id'])
#         session['name'] = user.name
#     return render_template_string('<h1>Hello, {{ name }}!</h1>', name=session.get('name', 'world'))

# # -------------------------------------------------
# # Run
# # -------------------------------------------------
# if __name__ == '__main__':
#     app.run(port=5555, debug=True)