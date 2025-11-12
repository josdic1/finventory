#!/usr/bin/env python3
"""
Seed file for the Inventory Management System
Run this file to populate the database with sample data
"""

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
            Category(name="Tools"),
            Category(name="Office Supplies"),
            Category(name="Hardware"),
            Category(name="Safety Equipment"),
        ]
        
        for category in categories:
            db.session.add(category)
        
        db.session.commit()
        print(f"✓ Created {len(categories)} categories")
        
        # Create Users
        print("Creating users...")
        user1 = User(name="alice")
        user1.password_hash = "1111"
        
        user2 = User(name="bob")
        user2.password_hash = "1111"
        
        user3 = User(name="charlie")
        user3.password_hash = "1111"
        
        db.session.add_all([user1, user2, user3])
        db.session.commit()
        print(f"✓ Created 3 users (password for all: '1111')")
        
        # Get categories from DB (to get their IDs)
        electronics = Category.query.filter_by(name="Electronics").first()
        tools = Category.query.filter_by(name="Tools").first()
        office = Category.query.filter_by(name="Office Supplies").first()
        hardware = Category.query.filter_by(name="Hardware").first()
        safety = Category.query.filter_by(name="Safety Equipment").first()
        
        # Create Products for Alice
        print("Creating products for alice...")
        alice_products = [
            Product(name="Laptop", rack="A1", bin="B3", category_id=electronics.id, user_id=user1.id),
            Product(name="USB Cable", rack="A1", bin="B5", category_id=electronics.id, user_id=user1.id),
            Product(name="Screwdriver Set", rack="C2", bin="D1", category_id=tools.id, user_id=user1.id),
            Product(name="Stapler", rack="B3", bin="A2", category_id=office.id, user_id=user1.id),
            Product(name="Paper Clips", rack="B3", bin="A3", category_id=office.id, user_id=user1.id),
        ]
        
        for product in alice_products:
            db.session.add(product)
        
        # Create Products for Bob
        print("Creating products for bob...")
        bob_products = [
            Product(name="Monitor", rack="A2", bin="C1", category_id=electronics.id, user_id=user2.id),
            Product(name="Keyboard", rack="A2", bin="C2", category_id=electronics.id, user_id=user2.id),
            Product(name="Hammer", rack="D1", bin="E3", category_id=tools.id, user_id=user2.id),
            Product(name="Wrench", rack="D1", bin="E4", category_id=tools.id, user_id=user2.id),
            Product(name="Bolts", rack="E5", bin="F2", category_id=hardware.id, user_id=user2.id),
            Product(name="Screws", rack="E5", bin="F3", category_id=hardware.id, user_id=user2.id),
        ]
        
        for product in bob_products:
            db.session.add(product)
        
        # Create Products for Charlie
        print("Creating products for charlie...")
        charlie_products = [
            Product(name="Safety Goggles", rack="F1", bin="G2", category_id=safety.id, user_id=user3.id),
            Product(name="Hard Hat", rack="F1", bin="G3", category_id=safety.id, user_id=user3.id),
            Product(name="Drill", rack="D2", bin="E5", category_id=tools.id, user_id=user3.id),
            Product(name="Mouse", rack="A3", bin="C4", category_id=electronics.id, user_id=user3.id),
            Product(name="Notebook", rack="B4", bin="A5", category_id=office.id, user_id=user3.id),
            Product(name="Gloves", rack="F2", bin="G4", category_id=safety.id, user_id=user3.id),
            Product(name="Nails", rack="E6", bin="F4", category_id=hardware.id, user_id=user3.id),
        ]
        
        for product in charlie_products:
            db.session.add(product)
        
        db.session.commit()
        
        print(f"✓ Created {len(alice_products)} products for alice")
        print(f"✓ Created {len(bob_products)} products for bob")
        print(f"✓ Created {len(charlie_products)} products for charlie")
        
        # Print summary
        print("\n" + "="*50)
        print("DATABASE SEEDED SUCCESSFULLY!")
        print("="*50)
        print("\nUsers created:")
        print("  - alice (password: password123) - 5 products")
        print("  - bob (password: password123) - 6 products")
        print("  - charlie (password: password123) - 7 products")
        print("\nCategories created:")
        print(f"  - Electronics ({Product.query.filter_by(category_id=electronics.id).count()} products)")
        print(f"  - Tools ({Product.query.filter_by(category_id=tools.id).count()} products)")
        print(f"  - Office Supplies ({Product.query.filter_by(category_id=office.id).count()} products)")
        print(f"  - Hardware ({Product.query.filter_by(category_id=hardware.id).count()} products)")
        print(f"  - Safety Equipment ({Product.query.filter_by(category_id=safety.id).count()} products)")
        print(f"\nTotal: {Product.query.count()} products")
        print("="*50)

if __name__ == '__main__':
    seed_database()