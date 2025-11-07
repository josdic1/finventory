# app.py
from flask import Flask, session, jsonify, request, render_template_string, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# -------------------------------------------------
# Configuration
# -------------------------------------------------
app.config['SECRET_KEY'] = 'change-me-to-a-random-string'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# -------------------------------------------------
# Extensions
# -------------------------------------------------
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
ma = Marshmallow(app)

# -------------------------------------------------
# Model
# -------------------------------------------------
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    @property
    def categories(self):
        return db.session.query(Category)\
                     .join(Idea)\
                     .filter(Idea.user_id == self.id)\
                     .distinct()\
                     .all()

    @property
    def password_hash(self):
        raise AttributeError('password is not readable')

    @password_hash.setter
    def password_hash(self, password):
        
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    ideas = db.relationship('Idea', backref='category', lazy=True)

    def __repr__(self):
        return '<Category %r>' % self.name

class Idea(db.Model):
    __tablename__ = 'ideas'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __repr__(self):
        return '<Product %r>' % self.name 



# -------------------------------------------------
# Schema
# -------------------------------------------------
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('_password_hash',)

    id = ma.auto_field()
    name = ma.auto_field()
    categories = ma.Method("get_categories")

    def get_categories(self, user):
        result = []
        for cat in user.categories:
            ideas = Idea.query.filter_by(user_id=user.id, category_id=cat.id).all()
            result.append({
                "id": cat.id,
                "name": cat.name,
                "ideas": IdeaSchema(many=True).dump(ideas)
            })
        return result

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()

category_schema = CategorySchema()  
categories_schema = CategorySchema(many=True)

class IdeaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Idea
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    category_id = ma.auto_field()
    user_id = ma.auto_field()

idea_schema = IdeaSchema()
ideas_schema = IdeaSchema(many=True)


# -------------------------------------------------
# Create DB (run once)
# -------------------------------------------------
with app.app_context():
    db.create_all()


# -------------------------------------------------
# Routes (API)
# -------------------------------------------------

# Auth #
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or 'name' not in data or 'password' not in data:
        return jsonify({"error": "name & password required"}), 400
    if User.query.filter_by(name=data['name']).first():
        return jsonify({"error": "Username taken"}), 409
    user = User(name=data['name'])
    user.password_hash = data['password']
    db.session.add(user)
    db.session.commit()
    return user_schema.dump(user), 201

@app.route('/login', methods=['POST'])
def login():
    
    data = request.get_json()
    if not data or 'name' not in data or 'password' not in data:
        return jsonify({"error": "name & password required"}), 400
    user = User.query.filter_by(name=data['name']).first()
    if user and user.authenticate(data['password']):
        session['user_id'] = user.id
        session['name'] = user.name
        return user_schema.dump(user), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return jsonify({"error": "Login required"}), 401
    user = User.query.get(session['user_id'])
    return jsonify(user_schema.dump(user))

@app.route('/check_session')
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({
            "logged_in": True,
            "user": user_schema.dump(user)
        })
    return jsonify({"logged_in": False})

# Categories #

@app.route('/categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories))

@app.route('/categories/new', methods=['POST'])
def create_category():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "name required"}), 400
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({"error": "Category name taken"}), 409
    new_category = Category(name=data['name'])
    db.session.add(new_category)
    db.session.commit()
    return category_schema.dump(new_category), 201


# Ideas #
@app.route('/ideas/new', methods=['POST'])
def create_idea():
    data = request.get_json()
    if not data or 'name' not in data or 'category_id' not in data:
        return jsonify({"error": "name & category_id required"}), 400
    new_idea = Idea(name=data['name'], category_id=data['category_id'], user_id=session['user_id'])
    db.session.add(new_idea)
    db.session.commit()
    return idea_schema.dump(new_idea), 201

@app.route('/ideas/<int:id>/edit', methods=['PATCH'])
def update_idea(id):  
    data = request.get_json()
    if not data or 'name' not in data or 'category_id' not in data:
        return jsonify({"error": "name & category_id required"}), 400
    
    idea = Idea.query.get(id)
    if not idea:
        return jsonify({"error": "Idea not found"}), 404
    
    idea.name = data['name']
    idea.category_id = data['category_id']
    db.session.commit()
    return idea_schema.dump(idea), 200

@app.route('/ideas/<int:id>', methods=['DELETE'])
def delete_idea(id):
    idea = Idea.query.get(id)
    if not idea:
        return jsonify({"error": "Idea not found"}), 404
    db.session.delete(idea)
    db.session.commit()
    return jsonify({"message": "Idea deleted"}), 200


@app.route('/')
def index():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        session['name'] = user.name
    return render_template_string('<h1>Hello, {{ name }}!</h1>', name=session.get('name', 'world'))

# -------------------------------------------------
# Run
# -------------------------------------------------
# if __name__ == '__main__':
#     app.run(port=5555, debug=True)