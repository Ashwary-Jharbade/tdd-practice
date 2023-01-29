class RoverUtil {
	_commandRegex = /^(N|F|B|R|L)\|(-?\d{1,}(.\d{1,})?,){2}(E|W|N|S)$/;
	_getformattedCommand(coor, commandCoor) {
		const currentCoor = coor.split("|")[1].split(",");
		const inputCoor = commandCoor.split("|")[1].split(",");
		const data = {
			"currentCoor": { x: parseInt(currentCoor[0].trim()), y: parseInt(currentCoor[1].trim()), d: currentCoor[2].trim() },
			"inputCoor": { x: parseInt(inputCoor[0].trim()), y: parseInt(inputCoor[1].trim()), d: inputCoor[2].trim() },
		}
		return data;
	}
	_isValidRoverCommandList(commandList) {
		const len = commandList.length;
		for (let i = 0; i < len; i++) {
			if (!this._commandRegex.test(commandList[i])) {
				return false;
			}
		}
		return true;
	}
	_isValidRoverCommand(command) {
		return this._commandRegex.test(command);
	}
	_isValidRoverNavigationCommand(command) {
		return this._commandRegex.test(command);
	}
}
class Rover extends RoverUtil {
	#coors;
	#commandList;
	#status;
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
	getCoors() {
		return this.#coors;
	}
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
						this.forward(command);
						break;
					case "B":
						this.backward(command);
						break;
					case "R":
						this.right(command);
						break;
					case "L":
						this.left(command);
				}
			}
		} else {
			console.log("Alert! Invalid navigation commands")
		}
	}
	moveForward() {}
	forward(command) {
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
				this.moveForward();
			} else {
				this.#status = false;
				console.log(`Invalid forward command: ${command}`);
			}
		} else {
			this.#status = false;
			console.log(`Invalid forward command: ${command}`);
		}
	}
	moveBackward() {}
	backward(command) {
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
			this.moveBackward();
		} else {
			this.#status = false;
			console.log(`Invalid backward command: ${command}`);
		}
	}
	moveLeft() {}
	left(command) {
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
			this.moveLeft();
		} else {
			this.#status = false;
			console.log(`Invalid left command: ${command}`);
		}
	}
	moveRight() {}
	right(command) {
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
			this.moveRight();
		} else {
			this.#status = false;
			console.log(`Invalid right command: ${command}`);
		}
	}

}
try {
	const commandList = [
		"F|1,0,E",
		"F|3,0,W",
		"F|3,0,E",
		"F|4,0,E",
		"B|2,0,E"
	];
	const rov = new Rover("N|0,0,E", commandList);
	rov.move();
} catch (error) {
	console.log(error);
}
