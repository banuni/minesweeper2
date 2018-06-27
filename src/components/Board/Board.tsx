import * as React from 'react';
import Cell, {CellType} from '../Cell/Cell';
import {revealCell} from '../../boardUtils';

export type BoardType = Array < Array < CellType >>;

export default class Board extends React.Component<{initialBoard: BoardType, onWin: Function, onLose: Function, active?: boolean}, {board: BoardType}> {
    constructor(props) {
        super(props);
        this.state = {board: props.initialBoard};
        this.onCellClick = this.onCellClick.bind(this);
    }
    callOnWinIfNeeded() {
        let didWin = true;
        this.state.board.map(row => {
            row.map(cell => {
                if (!cell.isMine && !cell.isRevealed) {
                    didWin = false;
                }
            });
        });
        if (didWin) {
            this.props.onWin();
        }
    }

    onCellClick(point) {
        const {board} = this.state;
        const {active} = this.props;
        if (!active) {
            return;
        }
        const cell = board[point.x][point.y];
        if (cell.isMine) {
            this.props.onLose();
            cell.isRevealed = true;
        } else {
            revealCell(board, point);
        }
        this.setState({board}, this.callOnWinIfNeeded);
    }

    render() {
        const {board} = this.state;
        return <div>
            {board.map((row, x) =>
                <div key={x} className="row">
                    {row.map((cell, y) => (
                        <Cell
                            key={y}
                            point={{x, y}}
                            isMine={cell.isMine}
                            isRevealed={cell.isRevealed}
                            value={cell.value}
                            onClick={this.onCellClick}
                        />
                    ))}
                </div>
            )}
        </div>;
    }
}
