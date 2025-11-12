#!/usr/bin/env python3
"""
Seed file for the Inventory Management System
Run this file to populate the database with sample data
"""

import random
from app import create_app
from app.extensions import db
from app.models import User, Category, Product

def seed_database():
    """Populate the database with sample data"""
    
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create Categories
        print("Creating categories...")
        categories = [
            Category(name="Electronics"),
            Category(name="Hand Tools"),
            Category(name="Power Tools"),
            Category(name="Office Supplies"),
            Category(name="Fasteners"),
            Category(name="Safety Equipment"),
            Category(name="Plumbing"),
            Category(name="Electrical"),
            Category(name="Automotive"),
            Category(name="Gardening"),
        ]
        
        for category in categories:
            db.session.add(category)
        
        db.session.commit()
        print(f"✓ Created {len(categories)} categories")
        
        # Create Users
        print("Creating users...")
        josh = User(name="josh")
        josh.password_hash = "1111"
        
        dor = User(name="dor")
        dor.password_hash = "1111"
        
        db.session.add_all([josh, dor])
        db.session.commit()
        print(f"✓ Created 2 users (password for all: '1111')")
        
        # Get categories from DB (to get their IDs)
        cat_dict = {cat.name: cat for cat in Category.query.all()}
        
        # Generate random rack/bin combinations
        def random_rack():
            return f"{random.choice(['A', 'B', 'C', 'D', 'E', 'F', 'G'])}{random.randint(1, 9)}"
        
        def random_bin():
            return f"{random.choice(['A', 'B', 'C', 'D', 'E', 'F', 'G'])}{random.randint(1, 9)}"
        
        # Create 20 Products - mix between Josh and Dor
        print("Creating products...")
        products_data = [
            # Josh's products (10)
            ("Wireless Mouse", "Electronics", josh.id),
            ("Torque Wrench", "Hand Tools", josh.id),
            ("Cordless Drill", "Power Tools", josh.id),
            ("Paper Shredder", "Office Supplies", josh.id),
            ("Hex Bolts M8", "Fasteners", josh.id),
            ("Safety Vest", "Safety Equipment", josh.id),
            ("PVC Pipe Cutter", "Plumbing", josh.id),
            ("Wire Strippers", "Electrical", josh.id),
            ("Jumper Cables", "Automotive", josh.id),
            ("Pruning Shears", "Gardening", josh.id),
            
            # Dor's products (10)
            ("USB-C Hub", "Electronics", dor.id),
            ("Socket Set", "Hand Tools", dor.id),
            ("Angle Grinder", "Power Tools", dor.id),
            ("Label Maker", "Office Supplies", dor.id),
            ("Wood Screws", "Fasteners", dor.id),
            ("Hard Hat", "Safety Equipment", dor.id),
            ("Pipe Wrench", "Plumbing", dor.id),
            ("Multimeter", "Electrical", dor.id),
            ("Oil Filter Wrench", "Automotive", dor.id),
            ("Garden Hose", "Gardening", dor.id),
        ]
        
        products = []
        for name, category_name, user_id in products_data:
            product = Product(
                name=name,
                rack=random_rack(),
                bin=random_bin(),
                category_id=cat_dict[category_name].id,
                user_id=user_id
            )
            products.append(product)
            db.session.add(product)
        
        db.session.commit()
        print(f"✓ Created {len(products)} products")
        
        # Print summary
        josh_count = Product.query.filter_by(user_id=josh.id).count()
        dor_count = Product.query.filter_by(user_id=dor.id).count()
        
        print("\n" + "="*60)
        print("DATABASE SEEDED SUCCESSFULLY!")
        print("="*60)
        print("\nUsers created:")
        print(f"  - josh (password: 1111) - {josh_count} products")
        print(f"  - dor (password: 1111) - {dor_count} products")
        print("\nCategories created:")
        for cat in categories:
            count = Product.query.filter_by(category_id=cat.id).count()
            print(f"  - {cat.name}: {count} product(s)")
        print(f"\nTotal: {Product.query.count()} products")
        print("="*60)

if __name__ == '__main__':
    seed_database()