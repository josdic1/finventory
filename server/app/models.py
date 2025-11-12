from .extensions import db, ma, bcrypt

# -------------------------------------------------
# Model
# -------------------------------------------------
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    # User has many products
    products = db.relationship('Product', back_populates='user', cascade='all, delete-orphan')
    
    # User has many categories THROUGH products (many-to-many via Product table)
    categories = db.relationship('Category', 
                                secondary='products',  # Product is the join table!
                                back_populates='users',
                                viewonly=True)  

    @property
    def password_hash(self):
        raise AttributeError('password is not readable')

    @password_hash.setter
    def password_hash(self, password):
        
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def __repr__(self):
        return '<User %r>' % self.name
    
class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    # Change backref to back_populates to match pattern
    products = db.relationship('Product', back_populates='category', cascade='all, delete-orphan')

    users = db.relationship('User',
                           secondary='products',
                           back_populates='categories',
                           viewonly=True)

    def __repr__(self):
        return '<Category %r>' % self.name
    
class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    rack = db.Column(db.String(80), nullable=True)
    bin = db.Column(db.String(80), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    user = db.relationship('User', back_populates='products')
    category = db.relationship('Category', back_populates='products')

    def __repr__(self):
        return '<Product %r>' % self.name 


# ------------------------------

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
            products = Product.query.filter_by(user_id=user.id, category_id=cat.id).all()
            result.append({
                "id": cat.id,
                "name": cat.name,
                "products": ProductSchema(many=True).dump(products)
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

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    rack = ma.auto_field()
    bin = ma.auto_field()
    category_id = ma.auto_field()
    user_id = ma.auto_field()

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
