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
# # Model
# # -------------------------------------------------
# class User(db.Model):
#     __tablename__ = 'users'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), unique=True, nullable=False)
#     _password_hash = db.Column(db.String(128), nullable=False)

#     # User has many products
#     products = db.relationship('Product', back_populates='user', cascade='all, delete-orphan')
    
#     # User has many categories THROUGH products (many-to-many via Product table)
#     categories = db.relationship('Category', 
#                                 secondary='products',  # Product is the join table!
#                                 primaryjoin='User.id == Product.user_id',
#                                 secondaryjoin='Product.category_id == Category.id',
#                                 back_populates='users',
#                                 viewonly=True)  

#     @property
#     def password_hash(self):
#         raise AttributeError('password is not readable')

#     @password_hash.setter
#     def password_hash(self, password):
        
#         self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

#     def authenticate(self, password):
#         return bcrypt.check_password_hash(self._password_hash, password)
    
#     def __repr__(self):
#         return '<User %r>' % self.name
    
# class Category(db.Model):
#     __tablename__ = 'categories'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), unique=True, nullable=False)

#     # Change backref to back_populates to match their pattern
#     products = db.relationship('Product', back_populates='category', cascade='all, delete-orphan')

#     users = db.relationship('User',
#                            secondary='products',
#                            primaryjoin='Category.id == Product.category_id',
#                            secondaryjoin='Product.user_id == User.id',
#                            back_populates='categories',
#                            viewonly=True)

#     def __repr__(self):
#         return '<Category %r>' % self.name
    
# class Product(db.Model):
#     __tablename__ = 'products'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), unique=True, nullable=False)
#     rack = db.Column(db.String(80), nullable=True)
#     bin = db.Column(db.String(80), nullable=True)
#     category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
#     user = db.relationship('User', back_populates='products')
#     category = db.relationship('Category', back_populates='products')

#     def __repr__(self):
#         return '<Product %r>' % self.name 


# # ------------------------------

# # Schema
# # -------------------------------------------------
# class UserSchema(ma.SQLAlchemyAutoSchema):
#     class Meta:
#         model = User
#         load_instance = True
#         exclude = ('_password_hash',)

#     id = ma.auto_field()
#     name = ma.auto_field()
#     categories = ma.Method("get_categories")

#     def get_categories(self, user):
#         result = []
#         for cat in user.categories:
#             products = Product.query.filter_by(user_id=user.id, category_id=cat.id).all()
#             result.append({
#                 "id": cat.id,
#                 "name": cat.name,
#                 "products": ProductSchema(many=True).dump(products)
#             })
#         return result

# user_schema = UserSchema()
# users_schema = UserSchema(many=True)

# class CategorySchema(ma.SQLAlchemyAutoSchema):
#     class Meta:
#         model = Category
#         load_instance = True

#     id = ma.auto_field()
#     name = ma.auto_field()

# category_schema = CategorySchema()  
# categories_schema = CategorySchema(many=True)

# class ProductSchema(ma.SQLAlchemyAutoSchema):
#     class Meta:
#         model = Product
#         load_instance = True

#     id = ma.auto_field()
#     name = ma.auto_field()
#     rack = ma.auto_field()
#     bin = ma.auto_field()
#     category_id = ma.auto_field()
#     user_id = ma.auto_field()

# product_schema = ProductSchema()
# products_schema = ProductSchema(many=True)

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