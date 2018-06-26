import 'jsdom-global/register';
import * as React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import Board from './Board';
import {createBoard} from '../../boardUtils';

import * as sCell from '../Cell/cell.scss';
import {Point} from '../Cell/Cell';

const getMinedBoard = (mines: Point[]) => {
    return getCustomBoard({rows: 3, cols: 3, mines});
};

function getCustomBoard(parameters: { rows: number, cols: number, mines: Point[], results?: any, active?: boolean}) {
    let {rows, cols, mines, results, active = true} = parameters;
    const board = createBoard(rows, cols, mines);
    return (
        <Board
            initialBoard={board}
            onWin={() => {if (results) {results.didWin = true; }}}
            onLose={() => {if (results) {results.didLose = true; }}}
            active={active}
        />
    );
}

const getTestBoard = (rows: number, cols: number, results: any = {}) => {
    return getCustomBoard({rows, cols, mines: [{x: 0, y: 0}], results});
};

function mountAndAttach(component) {
    return mount(component, {attachTo: document.createElement('div')}
    );
}

describe('Board', () => {
    let wrapper;

    afterEach(() => wrapper.detach());

    it('should have rows * cols cells', () => {
        wrapper = mountAndAttach(getTestBoard(4, 4));
        expect(wrapper.find('[data-hook="cell"]').length).to.eq(16);
    });
    it( 'should run onLose on mine click', () => {
        const result = {didWin: false, didLose: false};
        wrapper = mountAndAttach(getTestBoard(4, 4, result));
        const mine = wrapper.find('[data-hook="cell"]').at(0);
        mine.simulate('click');
        expect(mine.hasClass('isRevealed'), 'Mine should be revealed').to.be.true;
        expect(result.didLose, 'should run didLose').to.be.true;
        expect(result.didWin, 'should not run didWin').to.be.false;
    });
    it( 'should run onWin on all non-mine clicks', () => {
        const result = {didWin: false, didLose: false};
        wrapper = mountAndAttach(getTestBoard(4, 4, result));
        const cells = wrapper.find('[data-hook="cell"]');
        cells.slice(1).forEach((cellWrapper) => {
                cellWrapper.simulate('click');
        });
        expect(result.didLose).to.be.false;
        expect(result.didWin).to.be.true;
    });
    it('a click reveals a cell', () => {
        wrapper = mountAndAttach(getTestBoard(4, 4));
        const cells = wrapper.find('[data-hook="cell"]');
        const nonMineCell = cells.at(1);
        nonMineCell.simulate('click');
        expect(nonMineCell.hasClass(sCell.isRevealed)).to.be.true;
    });
    it('a cell\'s value is the number of mines around it', () => {
        wrapper = mountAndAttach(getMinedBoard([{x: 0, y: 0}, {x: 2, y: 2}, {x: 0, y: 1}]));
        const cells = wrapper.find('[data-hook="cell"]');
        const nonMineCell = cells.at(4); // this is cell in the middle, 1,1
        nonMineCell.simulate('click');
        const value = Number(nonMineCell.text());
        expect(value).is.equal(3);
    });
    it('reveal surrounding on a zero', () => {
        wrapper = mountAndAttach(getCustomBoard({rows: 6, cols: 6, mines: []}));
        const cells = wrapper.find('[data-hook="cell"]');
        cells.first().simulate('click');
        expect(cells.every(`.${sCell.isRevealed}`), 'all cells should be revealed').to.be.true;
    });
    it('dont reveal surrounding when revealing a non-zero', () => {
        wrapper = mountAndAttach(getCustomBoard({rows: 3, cols: 3, mines: [{x: 0, y: 0}]}));
        const cells = wrapper.find('[data-hook="cell"]');
        cells.at(1).simulate('click');
        expect(Number(cells.at(1).text())).to.be.equal(1);
        expect(cells.at(0).hasClass(sCell.isRevealed), 'mine should not be revealed').to.be.false;
        expect(cells.at(1).hasClass(sCell.isRevealed), 'clicked cell should be revealed').to.be.true;
        expect(cells.slice(2).find(`.${sCell.isRevealed}`).exists(), 'other cells should not be revealed').to.be.false;
    });
    it('stop revealing cells if active is false', () => {
        let board = getCustomBoard({rows: 3, cols: 3, mines: [{x: 0, y: 0}]});
        wrapper = mountAndAttach(board);
        const cells = wrapper.find('[data-hook="cell"]');
        cells.at(0).simulate('click');
        wrapper.setProps({active: false});
        cells.at(1).simulate('click');
        expect(cells.at(0).hasClass(sCell.isRevealed), 'mine should be revealed').to.be.true;
        expect(cells.slice(1).find(`.${sCell.isRevealed}`).exists(), 'other cells should not be revealed').to.be.false;
    });
});
