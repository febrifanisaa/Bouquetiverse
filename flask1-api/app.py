from flask import Flask, render_template, request, jsonify
import pymysql
import os
import time
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    return pymysql.connect(
        host=os.environ.get('MYSQL_HOST', 'localhost'),
        user=os.environ.get('MYSQL_USER', 'bouquetiverse'),
        password=os.environ.get('MYSQL_PASSWORD', 'password'),
        db=os.environ.get('MYSQL_DB', 'bouquetiverse'),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/connection-check', methods=['GET'])
def connection_check():
    try:
        # Test database connection
        connection = get_db_connection()
        connection.close()
        return jsonify({'status': 'connected', 'message': 'Database connected successfully'})
    except Exception as e:
        return jsonify({'status': 'disconnected', 'message': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.json
        
        # Get current time for consistency
        current_time = datetime.now()
        timestamp = int(time.time() * 1000)
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO orders (product, name, email, phone, address, date, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['product'],
                data['name'],
                data['email'],
                data['phone'],
                data['address'],
                current_time,
                timestamp
            ))
            connection.commit()
        connection.close()
        
        return jsonify({'status': 'success', 'message': 'Order created successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        data = request.json
        
        # Get current time for consistency
        current_time = datetime.now()
        timestamp = int(time.time() * 1000)
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO messages (name, email, phone, message, date, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['name'],
                data['email'],
                data['phone'],
                data['message'],
                current_time,
                timestamp
            ))
            connection.commit()
        connection.close()
        
        return jsonify({'status': 'success', 'message': 'Message created successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM orders ORDER BY timestamp DESC"
            cursor.execute(sql)
            orders = cursor.fetchall()
            
            # Format date for client-side display
            for order in orders:
                if isinstance(order['date'], datetime):
                    order['date'] = order['date'].strftime('%Y-%m-%d %H:%M:%S')
                elif isinstance(order['date'], str):  # In case it's already a string
                    pass  # Don't format again if it's a string
                else:
                    order['date'] = str(order['date'])  # Ensure all formats are strings
                
        connection.close()
        return jsonify({'status': 'success', 'data': orders})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/api/orders/<int:id>', methods=['PUT'])
def update_order(id):
    try:
        data = request.json
        current_time = datetime.now()
        timestamp = int(time.time() * 1000)

        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
            UPDATE orders
            SET name = %s,
                email = %s,
                phone = %s,
                address = %s,
                product = %s,
                status = %s,
                date = %s,
                timestamp = %s
            WHERE id = %s
            """
            cursor.execute(sql, (
                data['name'],
                data['email'],
                data['phone'],
                data['address'],
                data['product'],
                data['status'],
                current_time,
                timestamp,
                id
            ))
            connection.commit()
        connection.close()

        return jsonify({'status': 'success', 'message': 'Order updated successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        connection = get_db_connection()  # Establish the database connection
        with connection.cursor() as cursor:
            sql = "SELECT * FROM messages ORDER BY timestamp DESC"  # Query to fetch messages ordered by timestamp
            cursor.execute(sql)  # Execute the query
            messages = cursor.fetchall()  # Fetch all the messages
            
            # Format the 'date' field for client-side display
            for message in messages:
                if isinstance(message['date'], datetime):  # If date is a datetime object
                    message['date'] = message['date'].strftime('%Y-%m-%d %H:%M:%S')  # Format date
                elif isinstance(message['date'], str):  # If date is already a string
                    pass  # No need to format
                else:
                    message['date'] = str(message['date'])  # Convert date to string
                
        connection.close()  # Close the connection
        return jsonify({'status': 'success', 'data': messages})  # Return the data as a JSON response
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500  # Error handling for any exception

    
@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Ensure you're deleting the right record
            sql = "DELETE FROM orders WHERE id = %s"
            cursor.execute(sql, (order_id,))
            connection.commit()

            if cursor.rowcount == 0:
                # If no rows were deleted, return an error message
                return jsonify({'status': 'error', 'message': 'Order not found'}), 404

            return jsonify({'status': 'success', 'message': 'Order deleted successfully'})

    except Exception as e:
        # If there's an error, log it and return a meaningful response
        print(f"Error deleting order: {str(e)}")
        return jsonify({'status': 'error', 'message': 'An error occurred while deleting the order'}), 500

    finally:
        if connection and not connection._closed:
            connection.close()  # Ensure the connection is always closed only if it's open)  # Ensure the connection is always closed




@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = "SELECT * FROM orders WHERE id = %s"
            cursor.execute(sql, (order_id,))
            order = cursor.fetchone()

            if order:
                order['date'] = order['date'].strftime('%Y-%m-%d %H:%M:%S')  # Ensure date is formatted
                return jsonify({'status': 'success', 'data': order})
            else:
                return jsonify({'status': 'error', 'message': 'Order not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if connection:
            connection.close()  # Ensure connection is closed


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')