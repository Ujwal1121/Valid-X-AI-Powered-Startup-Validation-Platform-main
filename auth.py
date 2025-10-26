# auth.py - User Authentication Functions for Validex

import bcrypt
from database import get_db_connection, close_db_connection

def hash_password(password):
    """
    Hash a password using bcrypt.
    Returns hashed password as string.
    """
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password, hashed_password):
    """
    Verify a password against its hash.
    Returns True if password matches, False otherwise.
    """
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def register_user(name, email, password):
    """
    Register a new user in the database.
    Returns: (success: bool, message: str, user_id: int or None)
    """
    connection = get_db_connection()
    
    if not connection:
        return False, "Database connection failed", None
    
    try:
        cursor = connection.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            close_db_connection(connection)
            return False, "Email already registered", None
        
        # Hash the password
        hashed_pwd = hash_password(password)
        
        # Insert new user
        insert_query = """
            INSERT INTO users (name, email, password) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (name, email, hashed_pwd))
        connection.commit()
        
        user_id = cursor.lastrowid
        
        cursor.close()
        close_db_connection(connection)
        
        print(f"✅ User registered successfully: {email}")
        return True, "Registration successful", user_id
        
    except Exception as e:
        print(f"❌ Registration error: {e}")
        if connection:
            connection.rollback()
            close_db_connection(connection)
        return False, f"Registration failed: {str(e)}", None

def login_user(email, password):
    """
    Authenticate a user.
    Returns: (success: bool, message: str, user_data: dict or None)
    """
    connection = get_db_connection()
    
    if not connection:
        return False, "Database connection failed", None
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get user by email
        cursor.execute(
            "SELECT id, name, email, password FROM users WHERE email = %s", 
            (email,)
        )
        user = cursor.fetchone()
        
        cursor.close()
        close_db_connection(connection)
        
        if not user:
            return False, "Invalid email or password", None
        
        # Verify password
        if verify_password(password, user['password']):
            # Remove password from user data before returning
            user_data = {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
            print(f"✅ User logged in successfully: {email}")
            return True, "Login successful", user_data
        else:
            return False, "Invalid email or password", None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        if connection:
            close_db_connection(connection)
        return False, f"Login failed: {str(e)}", None

def get_user_by_id(user_id):
    """
    Get user information by user ID.
    Returns: user_data dict or None
    """
    connection = get_db_connection()
    
    if not connection:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, name, email, created_at FROM users WHERE id = %s", 
            (user_id,)
        )
        user = cursor.fetchone()
        
        cursor.close()
        close_db_connection(connection)
        
        return user
        
    except Exception as e:
        print(f"❌ Error fetching user: {e}")
        if connection:
            close_db_connection(connection)
        return None
