from pathlib import Path
import sys


class RelativePath:
    @staticmethod
    def resource_path(relative_path: Path):
        base_path = Path(getattr(sys, '_MEIPASS', Path.cwd()))
        return base_path / relative_path 