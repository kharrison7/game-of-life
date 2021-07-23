function gameRun() {
    return {
        requestId: null,
        width: null,
        height: null,
        ctx: null,
        squareSize: 10,
        grid: [],
        gridWidth: null,
        gridHeight: null,
        startButton: 'Start',
        isAlive(cell) {
            return this.grid[cell.y][cell.x] === 1;
        },
        getSurroundingCells(x, y) {
            let surround = [];
            //for each row, top, middle, and bottom
            if (y > 0) {
                for (let cellX = x - 1; cellX <= x + 2; cellX++) {
                    if (0 < x < this.gridWidth - 1) {
                        surround.push({'x': cellX, 'y': y - 1});
                    }
                }
            }
            if (x > 0) {
                surround.push({'x': x - 1, 'y': y})
            }
            if (x < this.gridWidth - 1) {
                surround.push({'x': x + 1, 'y': y});
            }
            if (y < this.gridHeight - 1) {
                for (let cellX = x - 1; cellX <= x + 2; cellX++) {
                    if (0 < x < this.gridWidth - 1) {
                        surround.push({'x': cellX, 'y': y + 1});
                    }
                }
            }
            return surround;
        },
        getLiveSurround(x, y) {
            let count = 0;
            let surround = this.getSurroundingCells(x, y);
            for (neighbour of surround) {
                if (this.isAlive(neighbour)) {
                    count++;
                }
            }
            return count;
        },
        generate() {
            let x = 0;
            let y = 0;
            for (row of this.grid) {
                for (col of row) {
                    let livesurround = this.getLiveSurround(x, y);
                    if (col === 1) {
                        if (livesurround < 2 || livesurround > 3) {
                            this.grid[y][x] = 0;
                        }
                    } else if (livesurround === 3) {
                        this.grid[y][x] = 1;
                    }
                    x += 1;
                }
                x = 0;
                y = y + 1;
            }
        },
        step() {
            this.generate();
            this.drawGrid();
        },
        drawBlock(x, y, value) {
            let startX = x * this.squareSize;
            let startY = y * this.squareSize;
            let colour = value === 1 ? 'rgb(0,94,255)' : 'rgb(40,40,40)';
            this.ctx.fillStyle = colour;
            this.ctx.fillRect(startX, startY, this.squareSize, this.squareSize);
        },
        drawGrid() {
            let x = 0;
            let y = 0;
            for (row of this.grid) {
                for (col of row) {
                    this.drawBlock(x, y, col);
                    x += 1;
                }
                x = 0;
                y += 1;
            }
        },
        seedCells(qty) {
            for (let i = 0; i < qty; i++) {
                let randX = Math.floor(Math.random() * (this.gridWidth - 1));
                let randY = Math.floor(Math.random() * (this.gridHeight - 1));
                this.grid[randY][randX] = 1;
            }
        },
        setupGrid() {
            this.grid = Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0));
        },
        run() {
            this.requestId = window.requestAnimationFrame(() => this.run());
            this.step();
        },
        stop() {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = null;
            this.startButton = 'Start';
        },
        toggleStart() {
            if (this.requestId) {
                this.stop();
            } else {
                this.startButton = 'Stop';
                this.run();
            }
        },
        setupCanvas() {
            let c = document.querySelector('canvas');
            this.width = c.clientWidth;
            this.height = c.clientHeight;
            if (c.width !== this.width || c.height !== this.height) {
                c.width = this.width;
                c.height = this.height;
            }
            this.ctx = c.getContext('2d');
            this.gridWidth = this.width / this.squareSize;
            this.gridHeight = this.height / this.squareSize;
        },
        reset() {
            this.stop();
            this.setupGrid();
            this.seedCells(200); //set up the number of live cells
            this.drawGrid();
        },
        initialise() {
            this.setupCanvas();
            this.reset();
        }
    };
}