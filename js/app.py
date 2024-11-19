from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

# Configuração do banco de dados
DB_HOST = "localhost"
DB_NAME = "seu_banco"
DB_USER = "seu_usuario"
DB_PASSWORD = "sua_senha"

def connect_db():
    """Função para conectar ao banco de dados PostgreSQL"""
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

@app.route('/login', methods=['POST'])
def login():
    """Endpoint para autenticação"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Username e password são obrigatórios"}), 400

    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Consulta para validar o login
        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return jsonify({"success": True, "message": "Login bem-sucedido!"}), 200
        else:
            return jsonify({"success": False, "message": "Usuário ou senha inválidos"}), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
