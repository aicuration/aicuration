import psycopg2

# Database connection
conn = psycopg2.connect(
    host='localhost',
    database='gwangju_tour',
    user='postgres',
    password='1234',
    port='5432'
)

cursor = conn.cursor()

try:
    # Check current routes
    cursor.execute("SELECT COUNT(*) FROM user_routes")
    route_count = cursor.fetchone()[0]
    print(f"Current routes: {route_count}")
    
    if route_count > 0:
        # Delete all routes
        cursor.execute("DELETE FROM user_routes")
        deleted_count = cursor.fetchone()[0] if cursor.rowcount > 0 else 0
        print(f"Deleted {cursor.rowcount} routes")
        
        # Commit changes
        conn.commit()
        
        # Verify deletion
        cursor.execute("SELECT COUNT(*) FROM user_routes")
        remaining_routes = cursor.fetchone()[0]
        print(f"Remaining routes: {remaining_routes}")
    else:
        print("No routes to delete")
        
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()
    print("Done")






