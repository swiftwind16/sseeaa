from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, UTC
import json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token

def group_by_country(warehouses):
    grouped = {}
    for w in warehouses:
        country = w.country
        if country not in grouped:
            grouped[country] = []
        warehouse_data = {
            'id': w.warehouse_id,
            'name': w.name,
            'location': f'{w.country}·{w.city}'.encode('utf-8').decode('utf-8'),
            'price': float(w.price),
            'created_at': w.created_at.isoformat()
        }
        grouped[country].append(warehouse_data)
    return grouped

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False  # This will allow UTF-8 characters in JSON response

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sseeaa_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = True  # Enable debug mode
db = SQLAlchemy(app)

# Models
class Warehouse(db.Model):
    __tablename__ = 'warehouses'
    warehouse_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

class MerchantRequest(db.Model):
    __tablename__ = 'merchant_requests'
    request_id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.String(255), nullable=False)
    warehouse_name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

class MatchedWarehouse(db.Model):
    __tablename__ = 'matched_warehouses'
    match_id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('merchant_requests.request_id'))
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.warehouse_id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

class Merchant(db.Model):
    __tablename__ = 'merchants'
    merchant_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
jwt = JWTManager(app)

# Routes
@app.route('/', methods=['GET'])
def hello():
    try:
        return jsonify({"message": "Hello, API is working!"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/warehouses', methods=['GET'])
def get_warehouses():
    try:
        name = request.args.get('name', '')
        country = request.args.get('country', '')
        print(f"Searching for warehouse name: {name}, country: {country}")

        # Query database for exact name match
        query = Warehouse.query
        if name:
            query = query.filter(Warehouse.name == name)
        if country:
            query = query.filter(Warehouse.country == country)
            
        filtered_warehouses = query.all()
        print(f"Found warehouses: {filtered_warehouses}")

        # If country is specified, return array of warehouses
        if country:
            result = [{
                'id': w.warehouse_id,
                'name': w.name,
                'location': f'{w.country}·{w.city}'.encode('utf-8').decode('utf-8'),
                'price': float(w.price),
                'created_at': w.created_at.isoformat()
            } for w in filtered_warehouses]
            return jsonify(result)
            
        # Otherwise, group by country
        if filtered_warehouses:
            grouped_results = group_by_country(filtered_warehouses)
            return jsonify(grouped_results)
            
        return jsonify({})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/requests', methods=['POST'])
def create_request():
    data = request.json
    merchant_request = MerchantRequest(
        merchant_id=data['merchant_id'],
        warehouse_name=data['warehouse_name']
    )
    db.session.add(merchant_request)
    db.session.commit()
    
    # Simple matching algorithm based on warehouse name
    matched_warehouse = Warehouse.query.filter_by(name=data['warehouse_name']).first()
    if matched_warehouse:
        match = MatchedWarehouse(
            request_id=merchant_request.request_id,
            warehouse_id=matched_warehouse.warehouse_id
        )
        db.session.add(match)
        db.session.commit()
        
    return jsonify({'message': 'Request created successfully'})

@app.route('/api/requests/<merchant_id>', methods=['GET'])
def get_merchant_requests(merchant_id):
    requests = MerchantRequest.query.filter_by(merchant_id=merchant_id).all()
    return jsonify([{
        'id': r.request_id,
        'warehouse_name': r.warehouse_name,
        'status': r.status,
        'created_at': r.created_at.isoformat()
    } for r in requests])

@app.route('/api/warehouses/<int:warehouse_id>', methods=['GET'])
def get_warehouse_detail(warehouse_id):
    try:
        warehouse = Warehouse.query.filter_by(warehouse_id=warehouse_id).first()
        if warehouse:
            return jsonify({
                'id': warehouse.warehouse_id,
                'name': warehouse.name,
                'location': f'{warehouse.country}·{warehouse.city}',
                'price': float(warehouse.price),
                'created_at': warehouse.created_at.isoformat(),
                'status': '待确认'  # This would come from your business logic
            })
        return jsonify({'error': 'Warehouse not found'}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_search_history():
    try:
        requests = db.session.query(
            MerchantRequest,
            MatchedWarehouse,
            Warehouse
        ).join(
            MatchedWarehouse,
            MerchantRequest.request_id == MatchedWarehouse.request_id
        ).join(
            Warehouse,
            MatchedWarehouse.warehouse_id == Warehouse.warehouse_id
        ).order_by(
            MerchantRequest.created_at.desc()
        ).all()
        
        return jsonify([{
            'request_id': r.request_id,
            'warehouse_name': r.warehouse_name,
            'created_at': r.created_at.isoformat(),
            'matched_warehouse': {
                'warehouse_id': w.warehouse_id,
                'name': w.name,
                'location': f'{w.country}·{w.city}',
                'price': float(w.price)
            }
        } for r, m, w in requests])
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        if Merchant.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        if Merchant.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        merchant = Merchant(
            username=data['username'],
            email=data['email'],
            company_name=data.get('company_name'),
            phone=data.get('phone')
        )
        merchant.set_password(data['password'])
        
        db.session.add(merchant)
        db.session.commit()
        
        return jsonify({'message': 'Signup successful'}), 201

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        merchant = Merchant.query.filter_by(username=data['username']).first()
        
        if merchant and merchant.check_password(data['password']):
            access_token = create_access_token(identity=merchant.merchant_id)
            return jsonify({
                'access_token': access_token,
                'merchant_id': merchant.merchant_id,
                'username': merchant.username
            })
            
        return jsonify({'error': 'Invalid username or password'}), 401

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 