import * as React from 'react';
import {translate, InjectedTranslateProps} from 'react-i18next';

import * as s from './App.scss';
import * as PropTypes from 'prop-types';
import Board from '../Board/Board';

interface AppProps extends InjectedTranslateProps {
    board: Array<Array<any>>;
}

class App extends React.Component<AppProps, { gameState: string, gameActive: boolean}> {
    static propTypes = {
        t: PropTypes.func
    };

    constructor() {
        super();
        this.state = {gameState: 'In progress', gameActive: true};
    }

    render() {
        const board = this.props.board;
        const {gameState, gameActive} = this.state;
        return (
            <div className={s.root}>
                <div className="game-area" data-hook="game-area">
                    <div id={s.gameState} data-status>{gameState}</div>
                    <Board
                        initialBoard={board}
                        onWin={() => this.setState({gameState: 'You win', gameActive: false})}
                        onLose={() => this.setState({gameState: 'You lose', gameActive: false})}
                        active={gameActive}
                    />
                </div>
            </div>
        );
    }
}

export default translate(null, {wait: true})(App);
