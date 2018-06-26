import * as React from 'react';
import * as classnames from 'classnames';

import * as s from './cell.scss';

export type Point = {x: number, y: number};
export type CellType = {isMine: boolean, x: number, y: number, isRevealed: boolean, value?: number};

type CellProps = {point: Point; isMine: boolean, onClick: (point: Point) => void, isRevealed: boolean, value?: number};

export default class Cell extends React.Component<CellProps, null> {
    render() {
        const {point, isMine, isRevealed, value} = this.props;
        return (
        <div
            className={classnames(s.cell, {[s.isMine]: isMine, [s.isRevealed]: isRevealed})}
            data-isMine={true}
            data-hook="cell"
            onClick={(e) => this.props.onClick(point)}
        >
            {value}
        </div>
        );
    }
}
