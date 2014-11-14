var RoomType = {
    Entrance: 0,
    Normal: 1,
    Boss: 2,
    Empty: 3
};
var TileType ={
    Wall: 0,
    Floor: 1,
    Pillar: 2,
	Fire: 3,
    Door: 4
};
var bjsTileType =[
	{name: "Wall",diffuseColor: new BABYLON.Color3(0.1, 0.1, 0.1), scale: new BABYLON.Vector3(10, 30, 10)},
	{name: "Floor",diffuseColor: new BABYLON.Color3(0.5, 0.5, 0.5), scale: new BABYLON.Vector3(10, 0.2, 10)},
	{name: "Pillar",diffuseColor: new BABYLON.Color3(.1, 0.5, 0.1), scale: new BABYLON.Vector3(10, 30, 10)},
	{name: "Fire",diffuseColor: new BABYLON.Color3(.5, 0.1, 0.1), scale: new BABYLON.Vector3(10, 0.2, 10)},
	{name: "Door",diffuseColor: new BABYLON.Color3(.7, 0.7, 0.7), scale: new BABYLON.Vector3(10, 0.2, 10)}
];

//height and width seem to be backwards? from col and row
var RoomHeight = 15;
var RoomWidth = 13;
var TileWidth = 10;

function getRandomInt(min, max) {
	max++; //makes max inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}
function GenerateRoom(options)
{
	var settings = $.extend({
			type: getRandomInt(1,3),
			width: 13,
			height: 15
		},options||{});


	var room = {};
	room.type = settings.type;
	room.width = settings.width;
	room.height = settings.height;

	room.tiles = [];

	for(var i = 0; i < room.width * room.height; i++)
	{
		room.tiles[i] = {};
		room.tiles[i].col = i % room.width;
		room.tiles[i].row = Math.floor(i/room.width)
		//ensure outer perimeter are walls
		if (room.tiles[i].col == 0 || room.tiles[i].row == 0 || room.tiles[i].col == room.width-1 || room.tiles[i].row == room.height-1) {
			room.tiles[i].type=TileType.Wall;
		}
		//make perimeter just inside walls all floors (this can change)
		else if (room.tiles[i].col == 1 || room.tiles[i].row == 1 || room.tiles[i].col == room.width-2 || room.tiles[i].row == room.height-2) {
			room.tiles[i].type=TileType.Floor;
		}
		else {
			room.tiles[i].type = getRandomInt(1,3);
		}
		room.tiles[i].width = TileWidth;
	}
	return room;
}

function GenerateBranch(map, startCol, startRow)
{
	if(map.rooms[startRow * map.width + startCol].type != RoomType.Empty)
	{
		return;
	}
	else
	{
		map.rooms[startRow * map.width + startCol] = GenerateRoom();
		var decision = getRandomInt(0,3);

		switch(decision) 
		{
			case 0:
				GenerateBranch(map, startCol--, startRow);
				break;
			case 1:
				GenerateBranch(map, startCol, startRow--);
				break;
			case 2:
				GenerateBranch(map, startCol++, startRow);
				break;
			case 3:
				GenerateBranch(map, startCol, startRow++);
				break;
		}
	}
}

function GenerateMap(mapHeight,mapWidth)
{
    var map = {};
    map.rooms = [];
	map.height = mapHeight;
	map.width = mapWidth;
	
	//initialize Rooms
    for(var i = 0; i < map.height * map.width; i++)
    {
    	var options = {type: RoomType.Empty, height: RoomHeight, width: RoomWidth}
    	var room = GenerateRoom(options);
    	room.col = i % map.width;
    	room.row = Math.floor(i/map.width);
    	room.type = RoomType.Empty;

    	map.rooms[room.row * map.width + room.col] = room;
    }
	
	//create a single room as an entrance
    entranceCol = Math.floor(map.width/2);
    entranceRow = map.height-1;
    var options = {type: RoomType.Entrance, height: RoomHeight, width: RoomWidth};
    map.rooms[entranceRow * map.width + entranceCol] = GenerateRoom(options);

    GenerateBranch(map, entranceCol, entranceRow - 1);

    return map;
}