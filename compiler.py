from pathlib import Path
import os
from shutil import rmtree

if __name__ == "__main__":
    root_path = Path(__file__).parent
    os.chdir(root_path)
    os.system(
        "pyinstaller --clean --onefile --name server-remote-control "
        "--icon client-remote-control/dist/favicon.png "
        "--add-data client-remote-control/dist;client-remote-control/dist "
        "back-remote-control/Flask.py"
    )
    rmtree("build", ignore_errors=True)
    os.remove("server-remote-control.spec")
    exe_folder = root_path / Path("dist")
    print(f"Built in {exe_folder}")