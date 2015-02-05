Game.RoomType = {
    Entrance: 0,
    Normal: 1,
    Boss: 2,
    Empty: 3
};
Game.TileType ={
    Wall: 0,
    Floor: 1,
    Pillar: 2,
	Fire: 3,
    Door: 4
};
Game.doorObject = function() {
	this.mesh = {};
	this.pairedDoor = {};
	this.isOpen = false;
	this.frame = [];
}

//height and width seem to be backwards? from col and row
Game.RoomHeight = 11;
Game.RoomWidth = 17;
Game.TileWidth = 10;

Game.getRandomInt = function(min, max) {
	max++; //makes max inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}
Game.getRandomIntFromArray = function(array) {
	var max=array.length;
	var min=0;
	if (!array || array.length == 0) {
		return -1;
	}
	else {
		return array[Math.floor(Math.random() * (max - min)) + min];
	}
}
Game.GenerateRoom = function(options)
{
	var settings = $.extend({
			type: Game.getRandomInt(1,2),
			width: 13,
			height: 15
		},options||{});
	
	var room = {};
	room.type = settings.type;
	room.width = settings.width;
	room.height = settings.height;
	room.doors = [];

	room.tiles = [];
	for(var i = 0; i < room.width * room.height; i++)
	{
		room.tiles[i] = {};
		room.tiles[i].col = i % room.width;
		room.tiles[i].row = Math.floor(i/room.width)
		//ensure outer perimeter are walls
		if (room.tiles[i].col == 0 || room.tiles[i].row == 0 || room.tiles[i].col == room.width-1 || room.tiles[i].row == room.height-1) {
			room.tiles[i].type=Game.TileType.Wall;
		}
		//make perimeter just inside walls all floors (this can change)
		else if (room.tiles[i].col == 1 || room.tiles[i].row == 1 || room.tiles[i].col == room.width-2 || room.tiles[i].row == room.height-2) {
			room.tiles[i].type=Game.TileType.Floor;
		}
		else if(i < Math.ceil(room.width * room.height)/2)
		{
			if(Game.getRandomInt(0,1) == 0)
			{
				room.tiles[i].type = Game.TileType.Floor;
			}
			else
			{
				room.tiles[i].type = Game.getRandomInt(1,3);
			}
			
		}
		else
		{
			reflectionRow = room.height - room.tiles[i].row - 1;
			reflectionCol = room.width - room.tiles[i].col - 1;
			room.tiles[i].type = room.tiles[(reflectionRow * room.width + reflectionCol)].type;
		}
		room.tiles[i].width = Game.TileWidth;
	}
	return room;
}

Game.GenerateBranch = function(map, startCol, startRow)
{
	var prevCol = startCol;
	var prevRow = startRow;
	var prevDoorCol = 0;
	var prevDoorRow = 0;
	var starDoorCol = 0;
	var starDoorRow = 0;
	var branches = 0;
	
	// increase count and check max
	map.deepestRoom.currentCount++;
	if (map.deepestRoom.currentCount > map.deepestRoom.maxCount) {
		map.deepestRoom.maxCount = map.deepestRoom.currentCount;
	}

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
	//exit if no rooms available
	if(checkRoom.length == 0)
	{
		return;
	}
	
	//TO DO: Change according to difficulty
	branches = (Game.getRandomInt(1,checkRoom.length));
	
	for (var branchLoop = 0; branchLoop < branches; branchLoop++) {
		// reset startCol and startRow
		startCol = prevCol;
		startRow = prevRow;
		//randomly choose which direction to go
		if (checkRoom.length == 1) {
			var decision = checkRoom[0];
		}
		else {
			var decision = Game.getRandomIntFromArray(checkRoom);
		}
		switch(decision) 
		{
			case 0:
				startRow--;
				//choose random door north
				prevDoorCol=Game.getRandomInt(2,map.rooms[prevRow * map.width + prevCol].width-3);
				prevDoorRow=0;
				startDoorCol=prevDoorCol;
				startDoorRow=map.rooms[startRow * map.width + startCol].height-1;
				break;
			case 1:
				startCol++;
				//choose random door east
				prevDoorCol=map.rooms[prevRow * map.width + prevCol].width-1;
				prevDoorRow=Game.getRandomInt(2,map.rooms[prevRow * map.width + prevCol].height-3);
				startDoorCol=0;
				startDoorRow=prevDoorRow;
				break;
			case 2:
				startRow++;
				//choose random door south
				prevDoorCol=Game.getRandomInt(2,map.rooms[prevRow * map.width + prevCol].width-3);
				prevDoorRow=map.rooms[prevRow * map.width + prevCol].height-1;
				startDoorCol=prevDoorCol;
				startDoorRow=0;
				break;
			case 3:
				//choose random door west
				startCol--;
				prevDoorCol=0;
				prevDoorRow=Game.getRandomInt(2,map.rooms[prevRow * map.width + prevCol].height-3);
				startDoorCol=map.rooms[startRow * map.width + startCol].width-1;
				startDoorRow=prevDoorRow;
				break;
		}
		//check to see if it is in within bounds
		if(map.rooms[startRow * map.width + startCol].type != Game.RoomType.Empty )
		{
			return;
		}
		else
		{
			var options = {type: Game.RoomType.Normal, height: Game.RoomHeight, width: Game.RoomWidth};
			map.rooms[startRow * map.width + startCol] = Game.GenerateRoom(options);
			map.rooms[startRow * map.width + startCol].col = startCol;
			map.rooms[startRow * map.width + startCol].row = startRow;
			//create door between the existing and generated room
			//previous room
			var prevTileIndex = prevDoorRow * map.rooms[prevRow * map.width + prevCol].width + prevDoorCol;
			map.rooms[prevRow * map.width + prevCol].tiles[prevTileIndex].type=Game.TileType.Door;
			//new room
			var newTileIndex = startDoorRow * map.rooms[startRow * map.width + startCol].width + startDoorCol;
			map.rooms[startRow * map.width + startCol].tiles[newTileIndex].type=Game.TileType.Door;
			//associate the previous rooms door with the new rooms door by index
			var prevIndex = map.rooms[prevRow * map.width + prevCol].doors.push(new Game.doorObject()) - 1;
			map.rooms[prevRow * map.width + prevCol].tiles[prevTileIndex].doorIndex = prevIndex; // associate tile with door
			var newIndex = map.rooms[startRow * map.width + startCol].doors.push(new Game.doorObject()) - 1;
			map.rooms[startRow * map.width + startCol].tiles[newTileIndex].doorIndex = newIndex; // associate tile with door
			map.rooms[prevRow * map.width + prevCol].doors[prevIndex].pairedDoor = map.rooms[startRow * map.width + startCol].doors[newIndex];
			map.rooms[startRow * map.width + startCol].doors[newIndex].pairedDoor = map.rooms[prevRow * map.width + prevCol].doors[prevIndex];
			if (map.deepestRoom.currentCount == map.deepestRoom.maxCount) {
				map.deepestRoom.col = startCol;
				map.deepestRoom.row = startRow;
			}
			
			Game.GenerateBranch(map, startCol, startRow);
		}
		map.deepestRoom.currentCount--;
		checkRoom.splice(checkRoom.indexOf(decision),1);
	}
	return;
}

Game.GenerateDoors = function(map) {
	for (var i = 0; i < map.height * map.width; i++) {
		//check if the room is a perimeter room
		if (map.rooms[i].col == 0 || map.rooms[i].row == 0 || map.rooms[i].col == map.width-1 || map.rooms[i].row == map.height-1) {
			
		}
	}
}

Game.GenerateMap = function(mapHeight,mapWidth)
{
    var map = {};
    map.rooms = [];
	map.height = mapHeight;
	map.width = mapWidth;
	map.deepestRoom = {'row': 0, 'col': 0, 'currentCount': 0, 'maxCount': 0};
	
	//initialize Rooms
    for(var i = 0; i < map.height * map.width; i++)
    {
    	var options = {type: Game.RoomType.Empty, height: Game.RoomHeight, width: Game.RoomWidth}
    	var room = Game.GenerateRoom(options);
    	room.col = i % map.width;
    	room.row = Math.floor(i/map.width);
    	room.type = Game.RoomType.Empty;
		room.doors = [];

    	map.rooms[room.row * map.width + room.col] = room;
    }
	
	//create a single room as an entrance
    var entranceCol = Math.floor(map.width/2);
    var entranceRow = map.height-1;
    var options = {type: Game.RoomType.Entrance, height: Game.RoomHeight, width: Game.RoomWidth};
    map.rooms[entranceRow * map.width + entranceCol] = Game.GenerateRoom(options);
	map.rooms[entranceRow * map.width + entranceCol].col =entranceCol;
	map.rooms[entranceRow * map.width + entranceCol].row = entranceRow;
	map.rooms[entranceRow * map.width + entranceCol].doors = [];
	map.entranceCol=entranceCol;
	map.entranceRow=entranceRow;

    Game.GenerateBranch(map, entranceCol, entranceRow);
	
	//set Boss room
	map.rooms[map.deepestRoom.row * map.width + map.deepestRoom.col].type = Game.RoomType.Boss;
	
	//Generate doors
	// GenerateDoors(map);

    return map;
}