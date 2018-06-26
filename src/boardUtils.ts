import {CellType, Point} from './components/Cell/Cell';
import {BoardType} from './components/Board/Board';
const chance = require('chance')();

export function createBoard(rows: number, cols: number, mines?: Array<Point>) {
    const board = [];
    for (let x = 0; x < rows; x++) {
        const row = [];
        for (let y = 0; y < cols; y++) {
            const isMine = !mines ? false : mines.some(point => point.x === x && point.y === y);
            const cell: CellType = {x, y, isMine, isRevealed: false};
            row.push(cell);
        }
        board.push(row);
    }
    return board;
}

const aPoint = (x, y) => ({x, y});
const pointsEqual = (p1: Point, p2: Point): boolean => p1.x === p2.x && p1.y === p2.y;
const isInBoardBoundaries = board => ({x, y}) => {
    return x >= 0 && y >= 0 && x < board.length && y < board[0].length;
};

function getAdjPoints(board: BoardType, point: Point) {
    const {x, y} = point;
    const candidates = [
        aPoint(x - 1, y - 1),
        aPoint(x - 1, y    ),
        aPoint(x - 1, y + 1),
        aPoint(x    , y - 1),
        aPoint(x    , y + 1),
        aPoint(x + 1, y - 1),
        aPoint(x + 1, y    ),
        aPoint(x + 1, y + 1)
    ];
    return candidates.filter(isInBoardBoundaries(board));
}

export function revealCell (board: BoardType, {x, y}: Point) {
    //assumes cell is not mine
    const cell = board[x][y];
    if (cell.isRevealed) {
        return;
    }
    cell.isRevealed = true;
    cell.value = cellValue(board, {x, y});
    if (cell.value === 0) {
        getAdjPoints(board, {x, y}).map((adjPoint) => {
            if (!board[adjPoint.x][adjPoint.y].isRevealed) {
                   revealCell(board, adjPoint);
            }
        });
    }
}

export function cellValue(board: BoardType , point: Point): number {
    const adjPoints = getAdjPoints(board, point);
    return adjPoints.reduce((sum, {x, y}) => {
        return board[x][y].isMine ? sum + 1 : sum;
    }, 0);
}

export function getRandomMines(minesNumber: number, rows: number, cols: number): Point[] {
    let mines = [];
    while (minesNumber) {
        const x = chance.natural({max: rows});
        const y = chance.natural({max: cols});
        if (!mines.some((inList) => pointsEqual(inList, {x, y}))) {
            mines.push({x, y});
            minesNumber -= 1;
        }
    }
    return mines;
}
