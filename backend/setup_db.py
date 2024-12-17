from app import app, db, Warehouse
from datetime import datetime, UTC

def init_db():
    with app.app_context():
        # Create tables
        db.create_all()

        # Add test warehouses
        test_warehouses = [
            Warehouse(
                name='warehouseA',
                city='洛杉矶',
                country='美国',
                price=99.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseA',
                city='纽约',
                country='美国',
                price=89.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseA',
                city='新泽西',
                country='美国',
                price=109.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseA',
                city='悉尼',
                country='澳大利亚',
                price=89.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseA',
                city='悉尼',
                country='澳大利亚',
                price=79.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseA',
                city='悉尼',
                country='澳大利亚',
                price=99.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseB',
                city='洛杉矶',
                country='美国',
                price=109.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseB',
                city='纽约',
                country='美国',
                price=119.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseB',
                city='洛杉矶',
                country='美国',
                price=99.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseB',
                city='墨尔本',
                country='澳大利亚',
                price=79.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseB',
                city='墨尔本',
                country='澳大利亚',
                price=89.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseB',
                city='墨尔本',
                country='澳大利亚',
                price=69.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseC',
                city='旧金山',
                country='美国',
                price=119.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseC',
                city='旧金山',
                country='美国',
                price=129.99,
                created_at=datetime.now(UTC)
            ),
            Warehouse(
                name='warehouseC',
                city='旧金山',
                country='美国',
                price=109.99,
                created_at=datetime.now(UTC)
            )
        ]

        db.session.add_all(test_warehouses)
        db.session.commit()

        print("Database initialized with test warehouses:")
        warehouses = Warehouse.query.all()
        for w in warehouses:
            print(f"ID: {w.warehouse_id}, Name: {w.name}, Location: {w.city}, {w.country}, Price: ${w.price}")

if __name__ == '__main__':
    init_db()