import random

from flask import Flask, current_app, render_template, request

from data.file import FileTilePoolDB
from data.persistence import TilePoolDB, tile_to_dict
from game.game import Board
from images import LocalImageManager, LocalReferenceCounts

from . import image_routes, tilepool_routes


def create_app() -> Flask:
    app = Flask(__name__)

    app.config["DB"] = FileTilePoolDB("tiles")
    app.config["IMAGES"] = LocalImageManager("images", LocalReferenceCounts("counts"))

    @app.route("/")
    def index():
        return render_template("index.html")

    app.register_blueprint(tilepool_routes.bp)
    app.register_blueprint(image_routes.bp)

    @app.route("/bingocard/<tilepoolId>")
    def generate_card(tilepoolId: str):
        try:
            size = int(request.args.get("size", 5))
            seed = int(request.args.get("seed", random.randint(0, 1 << 16)))
        except (ValueError, TypeError):
            return "Invalid input or request parameters", 400

        db = current_app.config["DB"]
        if not isinstance(db, TilePoolDB):
            return "internal server error", 500

        if (result := db.get_tile_pool(tilepoolId)) is None:
            return "Tile pool not found", 404

        pool = result["tiles"]

        # excluded_tags = request.args.get("excluded_tags")
        board = Board(pool, size=size, free_square=pool.free is not None, seed=seed)
        board.id = str(seed)
        return {
            "id": board.id,
            "size": board.size,
            "grid": [tile_to_dict(tile) for row in board.board for tile in row],
        }

    return app
