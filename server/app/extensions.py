from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow

# Initialize extensions globally
# They will be bound to the application later in create_app using init_app()
db = SQLAlchemy()
bcrypt = Bcrypt()
ma = Marshmallow()