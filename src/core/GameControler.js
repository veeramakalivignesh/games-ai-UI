import "./GameController.css"

export default function GameController({ gameLog: gameLog }) {
    console.log(gameLog)
    const gameLogComponent = [];
    let i = 0;
    for (let log of gameLog) {
        const textClassName = i % 2 ? 'game-log-text-white' : 'game-log-text-black';
        gameLogComponent.push(
            <input
                className={textClassName}
                type={"text"}
                value={log}
            />
        );
        i++;
    }

    return (
        <div style={{ verticalAlign: "middle" }}>
            <div className='game-log-title '>
                GAME LOG
            </div>
            <div className='game-log-box'>
                {gameLogComponent}
            </div>
            <div>
                <button className='button'> Start </button>
            </div>
            <div>
                <button className='button'> Replay </button>
            </div>
        </div>
    );
}