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

//height and width seem to be backwards? from col and row
var RoomHeight = 11;
var RoomWidth = 13;
var TileWidth = 10;

function getRandomInt(min, max) {
	max++; //makes max inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomIntFromArray(array) {
	var max=array.length;
	var min=0;
	if (array == undefined) {
		return -1;
	}
	else {
		return array[Math.floor(Math.random() * (max - min)) + min];
	}
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
		else if(i < Math.ceil(room.width * room.height)/2)
		{
			if(getRandomInt(0,1) == 0)
			{
				room.tiles[i].type = TileType.Floor;
			}
			else
			{
				room.tiles[i].type = getRandomInt(1,3);
			}
			
		}
		else
		{
			reflectionRow = room.height - room.tiles[i].row - 1;
			reflectionCol = room.width - room.tiles[i].col - 1;

			// console.log('i:' + i);
			// console.log('x,y:' + reflectionCol + ',' + reflectionRow);
			// console.log('guessAtReflecti:' + (reflectionRow * room.width + reflectionCol));
			room.tiles[i].type = room.tiles[(reflectionRow * room.width + reflectionCol)].type;
		}
		room.tiles[i].width = TileWidth;
	}
	return room;
}

function GenerateBranch(map, startCol, startRow)
{
	var prevCol = startCol;
	var prevRow = startRow;
	var prevDoorCol = 0;
	var prevDoorRow = 0;
	var starDoorCol = 0;
	var starDoorRow = 0;
	//check which rooms are available
	var checkRoom = [];
	if (startRow-1 >= 0) {
		checkRoom.push(0);
	}
	if (startCol+1 <= map.width-1) {
		checkRoom.push(1);
	}
	if (startRow+1 <= map.height-1) {
		checkRoom.push(2);
	}
	if (startCol-1 >= 0) {
		checkRoom.push(3);
	}
	//randomly choose which direction to go
	var decision = getRandomIntFromArray(checkRoom);
	switch(decision) 
	{
		//clockwise check starting "north"
		case -1:
			return;
		case 0:
			startRow--;
			//choose random door north
			prevDoorCol=getRandomInt(1,map.rooms[prevRow * map.width + prevCol].width-2);
			prevDoorRow=0;
			startDoorCol=prevDoorCol;
			startDoorRow=map.rooms[startRow * map.width + startCol].height-1;
			break;
		case 1:
			startCol++;
			//choose random door east
			prevDoorCol=map.rooms[prevRow * map.width + prevCol].width-1;
			prevDoorRow=getRandomInt(1,map.rooms[prevRow * map.width + prevCol].height-2);
			startDoorCol=0;
			startDoorRow=prevDoorRow;
			break;
		case 2:
			startRow++;
			//choose random door south
			prevDoorCol=getRandomInt(1,map.rooms[prevRow * map.width + prevCol].width-2);
			prevDoorRow=map.rooms[prevRow * map.width + prevCol].height-1;
			startDoorCol=prevDoorCol;
			startDoorRow=0;
			break;
		case 3:
			//choose random door west
			startCol--;
			prevDoorCol=0;
			prevDoorRow=getRandomInt(1,map.rooms[prevRow * map.width + prevCol].height-2);
			startDoorCol=map.rooms[startRow * map.width + startCol].width-1;
			startDoorRow=prevDoorRow;
			break;
	}
	//check to see if it is in within bounds
	if(map.rooms[startRow * map.width + startCol].type != RoomType.Empty )
	{
		return;
	}
	else
	{
		var options = {type: RoomType.Normal, height: RoomHeight, width: RoomWidth};
		map.rooms[startRow * map.width + startCol] = GenerateRoom(options);
    	map.rooms[startRow * map.width + startCol].col = startCol;
    	map.rooms[startRow * map.width + startCol].row = startRow;
		//create door between the existing and generated room
		//previous room
		map.rooms[prevRow * map.width + prevCol].tiles[prevDoorRow * map.rooms[prevRow * map.width + prevCol].width + prevDoorCol].type=TileType.Door;
		//new room
		map.rooms[startRow * map.width + startCol].tiles[startDoorRow * map.rooms[startRow * map.width + startCol].width + startDoorCol].type=TileType.Door;
		GenerateBranch(map, startCol, startRow);
	}
	return;
}

function GenerateDoors(map) {
	for (var i = 0; i < map.height * map.width; i++) {
		//check if the room is a perimeter room
		if (map.rooms[i].col == 0 || map.rooms[i].row == 0 || map.rooms[i].col == map.width-1 || map.rooms[i].row == map.height-1) {
			
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
    var entranceCol = Math.floor(map.width/2);
    var entranceRow = map.height-1;
    var options = {type: RoomType.Entrance, height: RoomHeight, width: RoomWidth};
    map.rooms[entranceRow * map.width + entranceCol] = GenerateRoom(options);
	map.rooms[entranceRow * map.width + entranceCol].col =entranceCol;
	map.rooms[entranceRow * map.width + entranceCol].row = entranceRow;
	map.entranceCol=entranceCol;
	map.entranceRow=entranceRow;

    GenerateBranch(map, entranceCol, entranceRow);
	
	//Generate doors
	// GenerateDoors(map);

    return map;
}