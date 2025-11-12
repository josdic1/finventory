# finventory: A Product Inventory Manager

A full-stack product inventory application built with React and Flask for my phahse-4 final, hence the name 'finventory'. Users can manage their personal inventory with products organized by categories.

## Installation
### SERVER (backend)


```python # Clone and navigate to project
git clone <your-repo-url>
cd finventory

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database
python seed.py

# Run Flask server
python app.py
```

```python #
**Backend Dependencies (requirements.txt):**
blinker==1.9.0
click==8.3.0
Flask==3.1.2
flask-marshmallow==1.3.0
Flask-SQLAlchemy==3.1.1
itsdangerous==2.2.0
Jinja2==3.1.6
MarkupSafe==3.0.3
marshmallow==4.0.1
marshmallow-sqlalchemy==1.4.2
SQLAlchemy==2.0.44
typing_extensions==4.15.0
Werkzeug==3.1.3
```

### CLIENT (frontend)

```python 
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

```python # 
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "formik": "^2.x",
    "yup": "^1.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "eslint": "^8.x"
  }
}
```
## Usage

```python
# Login with seed data credentials
username: 'josh'
password: '1111'

# OR
username: 'dor'
password: '1111'
```
```javascript View products grouped by category
// Home page displays your inventory organized by category

// Add a product
Click "Add Product" → Enter product name → Select category → Submit

// Create custom category
Click "Add New Category" → Enter category name → Submit

// Edit a product
Click product "Edit" button → Update details → Submit

// Delete a product
Click product "Delete" button → Confirm deletion
```

## API Endpoints
```python # 
POST   /login              # User login
POST   /logout             # User logout
GET    /check_session      # Verify session
GET    /categories         # Get all categories
POST   /categories/new     # Create category
POST   /products/new       # Create product
PATCH  /products/:id/edit  # Update product
DELETE /products/:id       # Delete product
```
## Tech Stack
**Frontend**: React 18, React Router, Formik, Yup, Context API, Vite.  
**Backend**: Flask 3.1, SQLAlchemy 2.0, Flask-Marshmallow, Werkzeug.  
**Database**: SQLite


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
