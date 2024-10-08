from backend import create_app
from dotenv import load_dotenv

load_dotenv()

backend = create_app()

@backend.route("/")
def hello():
    print("hello")

if __name__ == '__main__':
    backend.run(port=3000,debug=True)