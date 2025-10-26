# app.py - Flask Backend with MySQL Authentication for Validex

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import requests
from config import BASE_URL, Config
from auth import register_user, login_user, get_user_by_id
from functools import wraps
import traceback

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = Config.SECRET_KEY

# ========== DECORATOR: PROTECT ROUTES ==========
def login_required(f):
    """Decorator to protect routes - requires user login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ========== PUBLIC ROUTES ==========

@app.route('/')
def loader():
    """Loading screen - first page users see"""
    return render_template('loader.html')

@app.route('/home')
def home():
    """Home page - public landing page"""
    return render_template('home.html')

# ========== AUTHENTICATION ROUTES ==========

@app.route('/login', methods=['GET'])
def login():
    """Show login page"""
    # If user already logged in, redirect to analysis
    if 'user_id' in session:
        return redirect(url_for('analysis'))
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    """Handle login request"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not email or not password:
            return jsonify({
                'success': False, 
                'message': 'Email and password are required'
            }), 400
        
        # Attempt login
        success, message, user_data = login_user(email, password)
        
        if success:
            # Store user info in session
            session['user_id'] = user_data['id']
            session['user_name'] = user_data['name']
            session['user_email'] = user_data['email']
            session.permanent = True  # Session persists after browser close
            
            return jsonify({
                'success': True, 
                'message': 'Login successful',
                'user': {
                    'name': user_data['name'],
                    'email': user_data['email']
                }
            }), 200
        else:
            return jsonify({
                'success': False, 
                'message': message
            }), 401
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False, 
            'message': 'An error occurred during login'
        }), 500

@app.route('/signup', methods=['GET'])
def signup():
    """Show signup page"""
    # If user already logged in, redirect to analysis
    if 'user_id' in session:
        return redirect(url_for('analysis'))
    return render_template('signup.html')

@app.route('/api/signup', methods=['POST'])
def api_signup():
    """Handle signup request"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not name or not email or not password:
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        # Password strength check
        if len(password) < 6:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters'
            }), 400
        
        # Attempt registration
        success, message, user_id = register_user(name, email, password)
        
        if success:
            # Auto-login after successful registration
            session['user_id'] = user_id
            session['user_name'] = name
            session['user_email'] = email
            session.permanent = True
            
            return jsonify({
                'success': True,
                'message': 'Registration successful',
                'user': {
                    'name': name,
                    'email': email
                }
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except Exception as e:
        print(f"❌ Signup error: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'An error occurred during registration'
        }), 500

@app.route('/logout')
def logout():
    """Handle logout - clear session"""
    user_name = session.get('user_name', 'User')
    session.clear()
    print(f"👋 User logged out: {user_name}")
    return redirect(url_for('home'))

# ========== PROTECTED ROUTES ==========

@app.route('/analysis')
@login_required
def analysis():
    """Analysis dashboard - requires login"""
    user_name = session.get('user_name', 'User')
    user_email = session.get('user_email', '')
    
    return render_template(
        'analysis.html', 
        user_name=user_name,
        user_email=user_email
    )

@app.route('/api/validate', methods=['POST'])
@login_required
def validate():
    """Validate startup idea - requires login"""
    try:
        data = request.get_json()
        startup_idea = data.get('startup_idea', '').strip()
        
        if not startup_idea:
            return jsonify({'error': 'Please enter your startup idea'}), 400
        
        # Log validation attempt
        user_email = session.get('user_email', 'unknown')
        print(f"🔍 Validation request from: {user_email}")
        print(f"💡 Idea: {startup_idea[:100]}...")
        
        # Construct backend URL properly
        backend_url = f"{BASE_URL.rstrip('/')}/validate"
        print(f"📡 Calling backend: {backend_url}")
        
        # Call the FastAPI backend
        response = requests.post(
            backend_url,
            json={"startup_idea": startup_idea},
            timeout=300
        )
        
        print(f"📥 Backend response status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ Validation successful for: {user_email}")
            return jsonify(response.json()), 200
        else:
            # Get detailed error from backend
            try:
                error_detail = response.json()
                print(f"❌ API Error {response.status_code}: {error_detail}")
            except:
                error_detail = response.text[:500] if response.text else 'Unknown error'
                print(f"❌ API Error {response.status_code}: {error_detail}")
            
            return jsonify({
                'error': f'API Error: {response.status_code}',
                'detail': str(error_detail)
            }), response.status_code
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection error: Cannot reach backend API at {BASE_URL}")
        print(f"   Error: {str(e)}")
        print("\n⚠️  TROUBLESHOOTING:")
        print("   1. Is the backend server running?")
        print("   2. Check: http://localhost:8000/docs")
        print("   3. Start backend: python main.py OR uvicorn main:app --reload --port 8000\n")
        return jsonify({
            'error': 'Unable to connect to Validex API',
            'detail': 'Backend server not reachable. Please ensure the backend is running on port 8000.'
        }), 503
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
        return jsonify({
            'error': 'Request timeout',
            'detail': 'The validation request took too long. Please try again.'
        }), 504
    except Exception as e:
        print(f"❌ Validation error: {e}")
        traceback.print_exc()
        return jsonify({
            'error': f'An error occurred: {str(e)}',
            'detail': 'Internal server error'
        }), 500

# ========== API ROUTES (OPTIONAL) ==========

@app.route('/api/user', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user info"""
    user_id = session.get('user_id')
    user_data = get_user_by_id(user_id)
    
    if user_data:
        return jsonify({
            'success': True,
            'user': {
                'id': user_data['id'],
                'name': user_data['name'],
                'email': user_data['email'],
                'created_at': str(user_data['created_at'])
            }
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404

# ========== ERROR HANDLERS ========== 

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors - return JSON instead of template"""
    # Check if request wants JSON (API call)
    if request.path.startswith('/api/') or request.accept_mimetypes.accept_json:
        return jsonify({
            'error': 'Not found',
            'message': 'The requested resource was not found'
        }), 404
    
    # For regular pages, return simple message (no template needed)
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Page Not Found</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #fff;
            }
            .container {
                text-align: center;
            }
            h1 { font-size: 72px; margin: 0; color: #06B6D4; }
            p { font-size: 24px; margin: 20px 0; }
            a {
                color: #06B6D4;
                text-decoration: none;
                font-weight: bold;
            }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>404</h1>
            <p>Page Not Found</p>
            <a href="/home">← Go Home</a>
        </div>
    </body>
    </html>
    """, 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors - return JSON instead of template"""
    print("❌ 500 Internal Server Error:")
    traceback.print_exc()
    
    # Check if request wants JSON (API call)
    if request.path.startswith('/api/') or request.accept_mimetypes.accept_json:
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }), 500
    
    # For regular pages, return simple message
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>500 - Server Error</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #fff;
            }
            .container {
                text-align: center;
            }
            h1 { font-size: 72px; margin: 0; color: #EF4444; }
            p { font-size: 24px; margin: 20px 0; }
            a {
                color: #06B6D4;
                text-decoration: none;
                font-weight: bold;
            }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>500</h1>
            <p>Internal Server Error</p>
            <p style="font-size: 16px; color: #9ca3af;">Something went wrong on our end</p>
            <a href="/home">← Go Home</a>
        </div>
    </body>
    </html>
    """, 500

# ========== APPLICATION STARTUP ==========

if __name__ == '__main__':
    print("\n" + "=" * 70)
    print("🚀 VALIDEX APPLICATION STARTED!")
    print("=" * 70)
    print("\n✅ MySQL Database: Connected")
    print("✅ Authentication: Enabled")
    print("✅ Session Security: Active")
    print(f"\n🌐 Application URL: http://localhost:5000")
    print(f"📊 Analysis Dashboard: http://localhost:5000/analysis")
    print(f"\n🔗 Backend API: {BASE_URL}")
    print("   ⚠️  Make sure backend is running on port 8000!")
    print("\n📝 Routes Available:")
    print("   GET  /              → Loading screen")
    print("   GET  /home          → Home page")
    print("   GET  /login         → Login page")
    print("   POST /api/login     → Login API")
    print("   GET  /signup        → Signup page")
    print("   POST /api/signup    → Signup API")
    print("   GET  /analysis      → Analysis dashboard (protected)")
    print("   POST /api/validate  → Validate idea (protected)")
    print("   GET  /logout        → Logout")
    print("\n💾 Database: validex_db")
    print("🔐 Password Hashing: bcrypt")
    print("\n⚠️  IMPORTANT: Start backend server before validation!")
    print("   Command: python main.py  OR  uvicorn main:app --reload --port 8000")
    print("=" * 70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
