/// <reference types="@mapeditor/tiled-api" />

const TILE_WALL = 0;
const TILE_MOSSY = 1;
const TILE_FLOOR = 2;
const TILE_CRACKED = 3;
// Remove TILE_ENEMY since enemies are objects now

function placeFloorWithLogic(layer, x, y, map, isCorridor = false) {
    if (isCorridor) {
        layer.setTile(x, y, TILE_CRACKED);
        return;
    }

    let nearWall = false;
    const offsets = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [1, -1], [-1, 1], [1, 1]
    ];
    for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < map.width && ny < map.height) {
            const tile = layer.tileAt(nx, ny);
            if (tile && tile.id === TILE_WALL) {
                nearWall = true;
                break;
            }
        }
    }

    layer.setTile(x, y, nearWall ? TILE_MOSSY : TILE_FLOOR);
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

function generateDungeon(map, tileLayer, roomCount = 10, roomMin = 5, roomMax = 10) {
    const width = map.width;
    const height = map.height;

    const lootLayer = getOrCreateObjectLayer(map, "Loot");
    const collisionLayer = getOrCreateObjectLayer(map, "Collisions");
    const enemyLayer = getOrCreateObjectLayer(map, "Enemies"); // Object layer for enemies

    // Fill map with walls & clear enemies
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            tileLayer.setTile(x, y, TILE_WALL);
        }
    }
    enemyLayer.clear(); // Remove all previous enemy objects

    const rooms = [];

    function createRoom(x, y, w, h) {
        for (let ry = y; ry < y + h; ry++) {
            for (let rx = x; rx < x + w; rx++) {
                if (rx >= 0 && ry >= 0 && rx < width && ry < height) {
                    placeFloorWithLogic(tileLayer, rx, ry, map);
                }
            }
        }

        if (Math.random() < 0.2) {
            const lootX = x + Math.floor(Math.random() * w);
            const lootY = y + Math.floor(Math.random() * h);
            const types = ["coin", "armor", "weapon"];
            const type = types[Math.floor(Math.random() * types.length)];
            const obj = lootLayer.addObject({
                name: type,
                type: "loot",
                x: lootX * map.tileWidth,
                y: lootY * map.tileHeight,
                width: map.tileWidth,
                height: map.tileHeight
            });
            obj.setProperty("itemType", type);
        }
    }

    function createCorridor(x1, y1, x2, y2) {
        let cx = x1;
        let cy = y1;
        while (cx !== x2) {
            placeFloorWithLogic(tileLayer, cx, cy, map, true);
            cx += cx < x2 ? 1 : -1;
        }
        while (cy !== y2) {
            placeFloorWithLogic(tileLayer, cx, cy, map, true);
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
            if (tileLayer.tileAt(x, y)?.id === TILE_WALL) {
                collisionLayer.addObject({
                    x: x * map.tileWidth,
                    y: y * map.tileHeight,
                    width: map.tileWidth,
                    height: map.tileHeight
                });
            }
        }
    }

    // Place enemies as objects in random rooms
    for (const room of rooms) {
        const numEnemies = Math.floor(Math.random() * 3); // 0 to 2 enemies per room
        for (let i = 0; i < numEnemies; i++) {
            const ex = room.x + Math.floor(Math.random() * room.w);
            const ey = room.y + Math.floor(Math.random() * room.h);

            enemyLayer.addObject({
                name: "enemy",
                type: "enemy",
                gid: 1,                 // firstgid of enemy tileset
                x: ex * map.tileWidth,
                y: ey * map.tileHeight,
                width: 32,             // tile width of enemy sprite
                height: 43             // tile height of enemy sprite
            });
        }
    }

    tiled.alert("💥 Dungeon generated with floors, loot, collisions, and enemies!");
}

// Expose globally
this.generateDungeon = generateDungeon;

tiled.registerAction("generateDungeon", function () {
    const map = tiled.activeAsset;
    if (!(map && map.isTileMap)) {
        tiled.alert("No active tile map!");
        return;
    }
    const layer = map.currentLayer;
    if (!layer || layer.isGroupLayer) {
        tiled.alert("Please select a tile layer.");
        return;
    }
    generateDungeon(map, layer);
});

tiled.extendMenu("Map", [
    { action: "generateDungeon", before: "MapProperties" }
]);
