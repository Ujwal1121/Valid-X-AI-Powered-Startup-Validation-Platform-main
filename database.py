# database.py - Database Connection Manager for Validex

import mysql.connector
from mysql.connector import Error
from config import Config

def get_db_connection():
    """
    Create and return a database connection.
    Returns None if connection fails.
    """
    try:
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE
        )
        
        if connection.is_connected():
            print("✅ MySQL Database connected successfully")
            return connection
            
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        return None

def close_db_connection(connection):
    """
    Close database connection safely.
    """
    if connection and connection.is_connected():
        connection.close()
        print("✅ MySQL connection closed")
