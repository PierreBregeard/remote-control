import flask
from flask_cors import CORS
from pathlib import Path
from PC import PC
from ResourcePath import RelativePath
from os import chdir


chdir(Path(__file__).parent.parent)
static_folder = RelativePath.resource_path(
    Path("client-remote-control/dist")
)
app = flask.Flask(__name__, static_folder=static_folder)
CORS(app)

@app.route("/ping")
def ping():
    return ""

@app.route("/set_volume")
def set_volume():
    vol = flask.request.args.get("vol", -1, int)
    PC.set_volume(vol)
    return ""

@app.route("/press_key")
def press_key():
    key = flask.request.args.get("key", "", str)
    if key == "next_track":
        PC.next_track()
    elif key == "previous_track":
        PC.previous_track()
    elif key == "pp_media":
        PC.pp_media()
    return ""

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path and (Path(static_folder) / Path(path)).exists():
        return flask.send_from_directory(app.static_folder, path)
    else:
        return flask.send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    import socket

    def get_ipv4_address():
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ipv4_address = s.getsockname()[0]
        s.close()
        return ipv4_address
    
    app.run(get_ipv4_address())
