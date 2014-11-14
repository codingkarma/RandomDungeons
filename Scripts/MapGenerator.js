var RoomType = {
    Normal: 0,
    Enterance: 1,
    Boss: 2
};
var TileType = {
    Floor: 0,
    Wall: 1,
    Door: 2,
    Pillar: 3
};

var MapHeight = 10;
var MapWidth = 10;
var RoomHeight = 10;
var RoomWidth = 10;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function GenerateRoom(options)
{
	var room = {};
	if(options && options.type)
	{
		room.type = options.type;
	}
	else
	{
		room.type = getRandomInt(0,3);
	}
	room.tiles = [];

	for(i = 0; i < 100; i++)
	{
		room.tiles[i] = {};
		room.tiles[i].type = getRandomInt(0,4);
		room.tiles[i].col = i % RoomWidth;
		room.tiles[i].row = Math.floor(i/RoomWidth)
	}
	return room;
}
function GenerateMap()
{
    var map = {};
    map.rooms = [];

    var options = {type: 1};
    map.rooms.push(GenerateRoom(options));
    map.rooms[0].col = MapWidth / 2;
    map.rooms[0].row = MapHeight;

    return map;
}

var map = GenerateMap();
alert(JSON.stringify(map));