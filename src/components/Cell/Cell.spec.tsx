import 'jsdom-global/register';
import * as React from 'react';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {mount} from 'enzyme';
import Cell from './Cell';

import * as s from './cell.scss';

function getCell({point = {x: 0, y: 0}, isMine = false, isRevealed = false, onClick = () => {/**/}}) {
    return (
        <Cell
            point={point}
            isMine={isMine}
            isRevealed={isRevealed}
            onClick={onClick}
        />
    );
}

function mountAndAttach(cell) {
    return mount(cell, {attachTo: document.createElement('div')});
}

describe('Cell', () => {
    let wrapper;

    afterEach(() => wrapper.detach());

    it('revealed non-mine should have class revealed', () => {
        wrapper = mountAndAttach(getCell({isRevealed: true}));
        expect(wrapper.hasClass(s.isRevealed)).to.be.true;
    });
    it('revealed mine should have class revealed', () => {
        wrapper = mountAndAttach(getCell({isRevealed: true, isMine: true}));
        expect(wrapper.hasClass(s.isRevealed)).to.be.true;
    });
    it('unrevealed should NOT have class revealed', () => {
        wrapper = mountAndAttach(getCell({isRevealed: false}));
        expect(wrapper.hasClass(s.isRevealed)).to.be.false;
    });
    it('unrevealed mine should  NOT have class revealed', () => {
        wrapper = mountAndAttach(getCell({isRevealed: false, isMine: true}));
        expect(wrapper.hasClass(s.isRevealed)).to.be.false;
    });
    it('onClick should be called on click', () => {
        const cellClickSpy = sinon.spy();
        wrapper = mountAndAttach(getCell({isRevealed: false, isMine: true, onClick: cellClickSpy}));
        wrapper.simulate('click');
        expect(cellClickSpy).to.have.been.called;
    });
});
