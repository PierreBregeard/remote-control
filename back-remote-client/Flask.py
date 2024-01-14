import flask
from flask_cors import CORS

from PC import PC


app = flask.Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return ""

@app.route('/set_volume')
def set_volume():
    vol = flask.request.args.get("vol", -1, int)
    PC.set_volume(vol)
    return ""

@app.route('/press_key')
def press_key():
    key = flask.request.args.get("key", "", str)
    if key == "next_track":
        PC.next_track()
    elif key == "previous_track":
        PC.previous_track()
    elif key == "pp_media":
        PC.pp_media()

    return ""


if __name__ == '__main__':

    import socket

    def get_ipv4_address():
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ipv4_address = s.getsockname()[0]
        s.close()
        return ipv4_address
    
    app.run(get_ipv4_address())
