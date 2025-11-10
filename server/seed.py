from app import app, db, bcrypt, User, Category, Product
import random

def seed_data():
    with app.app_context():
        # Clear existing data
        print("Clearing database...")
        db.drop_all()
        db.create_all()
        
        # Create users
        print("Creating users...")
        josh = User(name='josh')
        josh.password_hash = '1111'
        
        dor = User(name='dor')
        dor.password_hash = '1111'
        
        db.session.add_all([josh, dor])
        db.session.commit()
        
        # Create categories
        print("Creating categories...")
        category_names = [
            'Electronics',
            'Office Supplies',
            'Tools',
            'Clothing',
            'Books',
            'Sporting Goods',
            'Kitchen',
            'Furniture',
            'Automotive',
            'Garden'
        ]
        
        categories = {}
        for name in category_names:
            cat = Category(name=name)
            categories[name] = cat
            db.session.add(cat)
        
        db.session.commit()
        
        # Rack and bin options
        racks = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1']
        bins = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        
        # Create products by category
        print("Creating products...")
        
        products_by_category = {
            'Electronics': [
                'Wireless Mouse',
                'USB-C Cable',
                'Bluetooth Headphones',
                'Phone Charger',
                'Laptop Stand',
                'HDMI Cable',
                'Webcam',
                'Power Bank',
                'LED Desk Lamp',
                'Bluetooth Speaker'
            ],
            'Office Supplies': [
                'Ballpoint Pens (Box of 12)',
                'Yellow Legal Pads',
                'Stapler',
                'Paper Clips (Box)',
                'Sticky Notes',
                'File Folders',
                'Desk Organizer',
                'Whiteboard Markers',
                'Scissors',
                'Tape Dispenser'
            ],
            'Tools': [
                'Cordless Drill',
                'Socket Set',
                'Hammer',
                'Screwdriver Set',
                'Tape Measure',
                'Level',
                'Utility Knife',
                'Pliers',
                'Adjustable Wrench',
                'Flashlight'
            ],
            'Clothing': [
                'Safety Vests',
                'Work Gloves',
                'Steel Toe Boots',
                'Baseball Caps',
                'Rain Jackets',
                'Cargo Pants',
                'T-Shirts (White)',
                'Hooded Sweatshirt',
                'Winter Jacket',
                'Work Coveralls'
            ],
            'Books': [
                'Python Programming Guide',
                'Project Management Handbook',
                'Inventory Management 101',
                'Leadership Principles',
                'Excel for Business',
                'Supply Chain Basics',
                'Time Management',
                'Communication Skills',
                'SQL Fundamentals',
                'Warehouse Operations Manual'
            ],
            'Sporting Goods': [
                'Basketball',
                'Soccer Ball',
                'Yoga Mat',
                'Resistance Bands',
                'Jump Rope',
                'Tennis Racket',
                'Bicycle Helmet',
                'Water Bottle',
                'Gym Bag',
                'Running Shoes'
            ],
            'Kitchen': [
                'Coffee Maker',
                'Microwave',
                'Toaster',
                'Blender',
                'Dish Soap',
                'Paper Towels',
                'Coffee Mugs (Set of 6)',
                'Plastic Food Containers',
                'Cutlery Set',
                'Dish Rack'
            ],
            'Furniture': [
                'Office Chair',
                'Folding Table',
                'File Cabinet',
                'Bookshelf',
                'Standing Desk',
                'Storage Cabinet',
                'Desk Lamp',
                'Rolling Cart',
                'Ergonomic Stool',
                'Conference Table'
            ],
            'Automotive': [
                'Motor Oil (5W-30)',
                'Windshield Wipers',
                'Car Battery',
                'Jumper Cables',
                'Tire Pressure Gauge',
                'Air Freshener',
                'Microfiber Towels',
                'Floor Mats',
                'First Aid Kit',
                'Emergency Roadside Kit'
            ],
            'Garden': [
                'Garden Hose',
                'Pruning Shears',
                'Watering Can',
                'Garden Gloves',
                'Potting Soil (20lb)',
                'Plant Fertilizer',
                'Rake',
                'Shovel',
                'Wheelbarrow',
                'Seed Packets'
            ]
        }
        
        users = [josh, dor]
        
        for category_name, product_names in products_by_category.items():
            for product_name in product_names:
                product = Product(
                    name=product_name,
                    rack=random.choice(racks),
                    bin=random.choice(bins),
                    category_id=categories[category_name].id,
                    user_id=random.choice(users).id
                )
                db.session.add(product)
        
        db.session.commit()
        
        total_products = sum(len(products) for products in products_by_category.values())
        
        print("✅ Seeding complete!")
        print(f"   - 2 users created")
        print(f"   - {len(categories)} categories created")
        print(f"   - {total_products} products created")
        
        # Show sample distribution
        print("\n📦 Products per category:")
        for cat_name in category_names:
            count = len(products_by_category[cat_name])
            print(f"   - {cat_name}: {count} products")
        
        print(f"\n📁 Database location: server/app.db")

if __name__ == '__main__':
    seed_data()