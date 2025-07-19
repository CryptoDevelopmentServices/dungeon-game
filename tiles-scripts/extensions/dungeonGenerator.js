/// <reference types="@mapeditor/tiled-api" />

const TILE_WALL = 0;
const TILE_MOSSY = 1;
const TILE_FLOOR = 2;
const TILE_CRACKED = 3;

let layerEdit = null;

function placeFloorWithLogic(x, y, map, tileset, tileLayer, isCorridor = false) {
    let tileToSet;
    if (isCorridor) {
        tileToSet = tileset.tile(TILE_CRACKED);
    } else {
        let nearWall = false;
        const offsets = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [1, -1], [-1, 1], [1, 1]
        ];
        for (const [dx, dy] of offsets) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < map.width && ny < map.height) {
                const tile = tileLayer.cellAt(nx, ny)?.tile;
                if (tile && tile.id === TILE_WALL) {
                    nearWall = true;
                    break;
                }
            }
        }
        tileToSet = tileset.tile(nearWall ? TILE_MOSSY : TILE_FLOOR);
    }

    if (!tileToSet) {
        tiled.alert(`Tile ID not found in tileset.`);
        return;
    }

    layerEdit.setTile(x, y, tileToSet);
}

function getOrCreateObjectLayer(map, name) {
    for (let i = 0; i < map.layerCount; i++) {
        const layer = map.layerAt(i);
        if (layer.isObjectLayer && layer.name === name) {
            return layer;
        }
    }
    const newLayer = new ObjectGroup(name);
    map.addLayer(newLayer);
    return newLayer;
}

function clearObjectLayer(layer) {
    while (layer.objectCount > 0) {
        layer.removeObject(layer.objectAt(0));
    }
}

function generateDungeon(map, tileLayer, roomCount = 10, roomMin = 5, roomMax = 10) {
    const width = map.width;
    const height = map.height;
    const tileset = map.tilesets[0];
    if (!tileset) {
        tiled.alert("No tileset found in map!");
        return;
    }

    layerEdit = tileLayer.edit();

    const lootLayer = getOrCreateObjectLayer(map, "Loot");
    const collisionLayer = getOrCreateObjectLayer(map, "Collisions");
    const enemyLayer = getOrCreateObjectLayer(map, "Enemies");

    for (const layer of [lootLayer, collisionLayer, enemyLayer]) {
        clearObjectLayer(layer);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            layerEdit.setTile(x, y, tileset.tile(TILE_WALL));
        }
    }

    const rooms = [];

    function createRoom(x, y, w, h) {
        for (let ry = y; ry < y + h; ry++) {
            for (let rx = x; rx < x + w; rx++) {
                if (rx >= 0 && ry >= 0 && rx < width && ry < height) {
                    placeFloorWithLogic(rx, ry, map, tileset, tileLayer);
                }
            }
        }

        if (Math.random() < 0.2) {
            const lootX = x + Math.floor(Math.random() * w);
            const lootY = y + Math.floor(Math.random() * h);
            const types = ["coin", "armor", "weapon"];
            const type = types[Math.floor(Math.random() * types.length)];

            const obj = new MapObject();
            obj.name = type;
            obj.type = "loot";
            obj.x = lootX * map.tileWidth;
            obj.y = lootY * map.tileHeight;
            obj.width = map.tileWidth;
            obj.height = map.tileHeight;
            obj.setProperty("itemType", type);
            lootLayer.addObject(obj);
        }
    }

    function createCorridor(x1, y1, x2, y2) {
        let cx = x1;
        let cy = y1;
        while (cx !== x2) {
            placeFloorWithLogic(cx, cy, map, tileset, tileLayer, true);
            cx += cx < x2 ? 1 : -1;
        }
        while (cy !== y2) {
            placeFloorWithLogic(cx, cy, map, tileset, tileLayer, true);
            cy += cy < y2 ? 1 : -1;
        }
    }

    for (let i = 0; i < roomCount; i++) {
        const w = Math.floor(Math.random() * (roomMax - roomMin + 1)) + roomMin;
        const h = Math.floor(Math.random() * (roomMax - roomMin + 1)) + roomMin;
        const x = Math.floor(Math.random() * (width - w - 1));
        const y = Math.floor(Math.random() * (height - h - 1));

        const newRoom = { x, y, w, h, centerX: x + Math.floor(w / 2), centerY: y + Math.floor(h / 2) };

        let failed = false;
        for (const other of rooms) {
            const overlap = !(x + w < other.x || x > other.x + other.w || y + h < other.y || y > other.y + other.h);
            if (overlap) {
                failed = true;
                break;
            }
        }

        if (!failed) {
            createRoom(x, y, w, h);
            if (rooms.length > 0) {
                const prev = rooms[rooms.length - 1];
                createCorridor(newRoom.centerX, newRoom.centerY, prev.centerX, prev.centerY);
            }
            rooms.push(newRoom);
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = tileLayer.cellAt(x, y)?.tile;
            if (tile && tile.id === TILE_WALL) {
                const obj = new MapObject();
                obj.x = x * map.tileWidth;
                obj.y = y * map.tileHeight;
                obj.width = map.tileWidth;
                obj.height = map.tileHeight;
                collisionLayer.addObject(obj);
            }
        }
    }

    layerEdit.apply();

    for (const room of rooms) {
        const numEnemies = Math.floor(Math.random() * 3);
        for (let i = 0; i < numEnemies; i++) {
            const ex = room.x + Math.floor(Math.random() * room.w);
            const ey = room.y + Math.floor(Math.random() * room.h);
            const enemy = new MapObject();
            enemy.name = "enemy";
            enemy.type = "enemy";
            enemy.gid = 1;
            enemy.x = ex * map.tileWidth;
            enemy.y = ey * map.tileHeight;
            enemy.width = map.tileWidth;
            enemy.height = map.tileHeight;
            enemyLayer.addObject(enemy);
        }
    }

    tiled.alert("✅ Dungeon generated successfully!");
}

// Menu hook
tiled.registerAction("generateDungeon", function () {
    const map = tiled.activeAsset;
    if (!(map && map.isTileMap)) {
        tiled.alert("No active tile map!");
        return;
    }
    const layer = map.currentLayer;
    if (!layer || !layer.isTileLayer) {
        tiled.alert("Please select a tile layer.");
        return;
    }
    generateDungeon(map, layer);
});

tiled.extendMenu("Map", [
    { action: "generateDungeon", before: "MapProperties" }
]);

tiled.assetOpened.connect((asset) => {
    if (!(asset && asset.isTileMap)) return;

    const map = asset;
    const layer = map.layerAt(0);
    if (layer?.isTileLayer && layer.name === "Floor") {
        const isEmpty = [...Array(map.height).keys()].every(y =>
            [...Array(map.width).keys()].every(x =>
                !layer.cellAt(x, y)?.tile
            )
        );

        if (isEmpty) {
            tiled.log("🧱 Generating dungeon because map is empty...");
            generateDungeon(map, layer);
        }
    }
});
