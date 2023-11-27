import { _SEED } from '../game/config';
import Game from '../game/game';
import React, { useRef, useEffect } from 'react';

type Props = {};

export default (props: Props) => {
    const mainRef = useRef(null);

    useEffect(() => {
        if (mainRef.current) {
            new Game(mainRef.current, _SEED);
        }
    }, [mainRef]);

    return (
        <main ref={mainRef} className="game">
            {/* Your content inside the main element */}
        </main>
    );
};