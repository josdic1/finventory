from app import app, db, bcrypt, User, Category, Idea
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
            'Work',
            'Personal',
            'Learning',
            'Health',
            'Finance',
            'Travel',
            'Hobbies',
            'Side Projects',
            'Home',
            'Social'
        ]
        
        categories = []
        for name in category_names:
            cat = Category(name=name)
            categories.append(cat)
            db.session.add(cat)
        
        db.session.commit()
        
        # Rack and bin options
        racks = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1']
        bins = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        
        # Create ideas
        print("Creating ideas...")
        idea_names = [
            'Build a mobile app',
            'Learn Spanish',
            'Start morning routine',
            'Create a budget spreadsheet',
            'Plan trip to Japan',
            'Learn to play guitar',
            'Start a blog',
            'Organize garage',
            'Join a book club',
            'Try meal prepping',
            'Learn Python',
            'Start investing',
            'Plan a camping trip',
            'Build a website',
            'Start journaling',
            'Learn photography',
            'Create a portfolio',
            'Start running regularly',
            'Learn to cook Thai food',
            'Renovate the kitchen'
        ]
        
        users = [josh, dor]
        
        for name in idea_names:
            idea = Idea(
                name=name,
                rack=random.choice(racks),
                bin=random.choice(bins),
                category_id=random.choice(categories).id,
                user_id=random.choice(users).id
            )
            db.session.add(idea)
        
        db.session.commit()
        
        print("✅ Seeding complete!")
        print(f"   - 2 users created")
        print(f"   - {len(categories)} categories created")
        print(f"   - {len(idea_names)} ideas created")
        
        # Verify database location
        print(f"\n📁 Database location: server/app.db")

if __name__ == '__main__':
    seed_data()