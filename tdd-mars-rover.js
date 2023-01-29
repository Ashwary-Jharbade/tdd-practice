class RoverUtil {
	// Regular expression for command validation check
	_commandRegex = /^(N|F|B|R|L)\|(-?\d{1,}(.\d{1,})?,){2}(E|W|N|S)$/;
	/**
	 * @method - Method to convert rover commands into structured data
	 * @param1 - coor parameter of type string represents current coordinates of rover
	 * @param2 - commandCoor parameter of type string represents input/destination coordinate of rover 
	 * @return - Method returns a strtuctred object for data accessibility 
	 * */
	_getformattedCommand(coor, commandCoor) {
		const currentCoor = coor.split("|")[1].split(",");
		const inputCoor = commandCoor.split("|")[1].split(",");
		const data = {
			"currentCoor": { x: parseInt(currentCoor[0].trim()), y: parseInt(currentCoor[1].trim()), d: currentCoor[2].trim() },
			"inputCoor": { x: parseInt(inputCoor[0].trim()), y: parseInt(inputCoor[1].trim()), d: inputCoor[2].trim() },
		}
		return data;
	}
	/**
	 * @method - Method to check rover command list
	 * @param1 - commandList parameter of type Array of strings represents list of coordinates needed to move rover
	 * @return - Method returns a boolean value as a response of data provided 
	 * */
	_isValidRoverCommandList(commandList) {
		const len = commandList.length;
		for (let i = 0; i < len; i++) {
			if (!this._commandRegex.test(commandList[i])) {
				return false;
			}
		}
		return true;
	}
	/**
	 * @method - Method to check rover command
	 * @param1 - command parameter of type string represents rover geo coordinate
	 * @return - Method returns a boolean value with respect to structure of command 
	 * */
	_isValidRoverCommand(command) {
		return this._commandRegex.test(command);
	}
}
class Rover extends RoverUtil {
	// Member variable to represents current geo coordinate of rover
	#coors;
	// Member variable to represents list of geo coordinate to move rover
	#commandList;
	// Member variable to halt the movement of rover in case of bad command
	#status;
	/**
	 * @method - Default parameterised constructor to intiantiate Rover class instance 
	 * @param1 - initialPos parameter of type string represents starting rover geo coordinate
	 * @param2 - commands parameter of type Array of strings represents list of coordinates needed to move rover
	 * */
	constructor(initialPos = "N|0,0,E", commands = []) {
		super();
		if (this._isValidRoverCommand(initialPos)) {
			this.#coors = initialPos;
		} else {
			throw new Error("Invalid initial position.")
		}
		if (Array.isArray(commands)) {
			this.#commandList = commands;
		} else {
			throw new Error("Invalid argument, argument two should be an Array.")
		}
		this.#status = true;
	}
	/**
	 * @method - Method to get the current geo coordinate of rover  
	 * @return - Method returns current geo coordinate of rover string value 
	 * */
	getCoors() {
		return this.#coors;
	}
	// Functionality to call rover methods based on command flags
	move() {
		if (this._isValidRoverCommandList(this.#commandList)) {
			const len = this.#commandList.length;
			for (let i = 0; i < len; i++) {
				const command = this.#commandList[i];
				if (!this.#status) {
					break;
				}
				switch(command[0]) {
					case "F":
						this.#forward(command);
						break;
					case "B":
						this.#backward(command);
						break;
					case "R":
						this.#right(command);
						break;
					case "L":
						this.#left(command);
				}
			}
		} else {
			console.log("Alert! Invalid navigation commands")
		}
	}
	// Method to trigger rover functionalites to move rover in forward direction
	#moveForward() {}
	/**
	 * @method - Method to prompt, determine and move rover movement in forward direction 
	 * @param1 - command parameter of type string represents input coordinates of rover
	 * */
	#forward(command) {
		const { currentCoor, inputCoor } = this._getformattedCommand(this.#coors, command);
		if (currentCoor.d === inputCoor.d) {
			let res = false;
			switch(inputCoor.d) {
				case "N":
					res = inputCoor.y > currentCoor.y && inputCoor.x === currentCoor.x;
					break;
				case "E":
					res = inputCoor.x > currentCoor.x && inputCoor.y === currentCoor.y;
					break;
				case "W":
					res = inputCoor.y < currentCoor.y && inputCoor.x === currentCoor.x;
					break;
				default:
					res = inputCoor.x < currentCoor.x && inputCoor.y === currentCoor.y;
			}
			if (res) {
				this.#coors = command;
				this.#moveForward();
			} else {
				this.#status = false;
				console.log(`Invalid forward command: ${command}`);
			}
		} else {
			this.#status = false;
			console.log(`Invalid forward command: ${command}`);
		}
	}
	// Method to trigger rover functionalites to move rover in backward direction
	#moveBackward() {}
	/**
	 * @method - Method to prompt, determine and move rover movement in backward direction 
	 * @param1 - command parameter of type string represents input coordinates of rover
	 * */
	#backward(command) {
		const { currentCoor, inputCoor } = this._getformattedCommand(this.#coors, command);
		let res = false;
		switch(inputCoor.d) {
			case "N":
				res = inputCoor.y >= currentCoor.y && inputCoor.x === currentCoor.x && currentCoor.d === "S";
				break;
			case "E":
				res = inputCoor.x >= currentCoor.x && inputCoor.y === currentCoor.y && currentCoor.d === "W";
				break;
			case "W":
				res = inputCoor.x <= currentCoor.x && inputCoor.y === currentCoor.y && currentCoor.d === "E";
				break;
			default:
				res = inputCoor.y <= currentCoor.y && inputCoor.x === currentCoor.x && currentCoor.d === "N";
		}
		if (res) {
			this.#coors = command;
			this.#moveBackward();
		} else {
			this.#status = false;
			console.log(`Invalid backward command: ${command}`);
		}
	}
	// Method to trigger rover functionalites to move rover in left direction
	#moveLeft() {}
	/**
	 * @method - Method to prompt, determine and move rover movement in left direction 
	 * @param1 - command parameter of type string represents input coordinates of rover
	 * */
	#left(command) {
		const { currentCoor, inputCoor } = this._getformattedCommand(this.#coors, command);
		let res = false;
		switch(currentCoor.d) {
			case "N":
				res = inputCoor.x <= currentCoor.x && inputCoor.y === currentCoor.y && inputCoor.d === "W";
				break;
			case "E":
				res = inputCoor.y >= currentCoor.y && inputCoor.x === currentCoor.x && inputCoor.d === "N";
				break;
			case "W":
				res = inputCoor.y <= currentCoor.y && inputCoor.x === currentCoor.x && inputCoor.d === "S";
				break;
			default:
				res = inputCoor.x >= currentCoor.x && inputCoor.y === currentCoor.y && inputCoor.d === "E";
		}
		if (res) {
			this.#coors = command;
			this.#moveLeft();
		} else {
			this.#status = false;
			console.log(`Invalid left command: ${command}`);
		}
	}
	// Method to trigger rover functionalites to move rover in right direction
	#moveRight() {}
	/**
	 * @method - Method to prompt, determine and move rover movement in right direction 
	 * @param1 - command parameter of type string represents input coordinates of rover
	 * */
	#right(command) {
		const { currentCoor, inputCoor, outputCoor } = this._getformattedCommand(this.#coors, command);
		let res = false;
		switch(currentCoor.d) {
			case "N":
				res = inputCoor.x >= currentCoor.x && inputCoor.y === currentCoor.y && inputCoor.d === "E";
				break;
			case "E":
				res = inputCoor.y <= currentCoor.y && inputCoor.x === currentCoor.x && inputCoor.d === "S";
				break;
			case "W":
				res = inputCoor.y >= currentCoor.y && inputCoor.x === currentCoor.x && inputCoor.d === "N";
				break;
			default:
				res = inputCoor.x <= currentCoor.x && inputCoor.y === currentCoor.y && inputCoor.d === "W";
		}
		if (res) {
			this.#coors = command;
			this.#moveRight();
		} else {
			this.#status = false;
			console.log(`Invalid right command: ${command}`);
		}
	}

}
try {
	// List of commands to move rover from initial point to destination
	const commandList = [
		"F|1,0,E",
		"F|2,0,E",
		"L|2,1,N",
		"F|2,2,N",
		"R|4,2,E",
		"R|2,1,E",
		"F|2,1,E",
		"F|-1,-2,S",
		"F|-1,-1,S",
		"F|-1,-1,N",
		"F|-1,-14,W",
		"F|-2,-12,W",
		"F|-1,-14,W",
		"F|0,12,N",
		"F|10,12,N",
		"F|-1,-12,N",
		"F|-1,-8,N",
		"F|-1,-12,N",
		"F|-1,-8,N"
	];
	// Creating instance of Rover class with rover stating geo loaction and list of commands for navigation
	const rov = new Rover("N|0,0,E", commandList);
	// Calling Rover class move method to start rover movements
	rov.move();
} catch (error) {
	console.log(error);
}
