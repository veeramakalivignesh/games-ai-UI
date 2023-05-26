import Header from "./Header";
import Footer from "./Footer";
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <>
            <Header />
            <div className="p-1 text-left" style={{ marginTop: "50px", marginLeft: "200px", marginRight: "200px" }}>
                <h2>Games AI</h2>
                <p>
                    Bored and wanna play against an AI? You are in the right place.
                    Here is a strategy game that could tease your brain. Happy play time!
                </p>
                <p>
                    P.S -  More games to come :P
                </p>
                <br />
                <h2>Game of Cannons</h2>
                <p>
                    The objective of the game is to attack the Townhalls of the Opponent player,
                    keeping your own Townhalls safe. The player who eliminates two of the Opponent’s
                    Townhalls is declared the winner.
                </p>
                <h3>Start of Game</h3>
                <center>
                    <br />
                    <img
                        src="images/cannon_board.png"
                        alt="Cannon Board"
                        width="400"
                        height="400"
                    />
                </center>
                <br />
                <p>
                    The game is played on a 8X8 board. At the start of the game, each player has
                    a fleet of 12 soldiers (represented by rings), placed in groups of three and
                    a set of four Townhalls (represented by solid squares), placed in alternative
                    blocks at the last row. The Townhalls shall remain stationary. A line (orthogonal or diagnol)
                    of three consecutive soldiers is termed a cannon, which is capable of ”shooting”.
                </p>
                <p>
                    There are two kinds of moves - Soldier moves and Cannon moves. Black moves first. At each turn,
                    the player must make either of these moves. Passing is not allowed (although one could make empty cannon shots).
                </p>
                <p>
                    P.S - The board dimensions can be increased incase you are looking to spice things up!
                </p>
                <h3>Soldier Moves</h3>
                <p>
                    A soldier is capable of the following moves:
                    <ul>
                        <li>
                            <b>Soldier Movement</b> - May move to an adjacent (orthogonal or diagonal) forward empty point.
                            <center>
                                <br />
                                <img
                                    src="images/soldier_move_0.png"
                                    alt="Soldier Move"
                                    width="200"
                                    height="200"
                                />
                            </center>
                            <br />
                        </li>
                        <li>
                            <b>Soldier Capture</b> - Can capture an adjacent (orthogonal or diagonal) forward or sideways opponent piece.
                            A captured soldier is removed from the game board.
                            <center>
                                <br />
                                <img
                                    src="images/soldier_move_1.png"
                                    alt="Soldier Capture"
                                    width="200"
                                    height="200"
                                />
                            </center>
                            <br />
                        </li>
                        <li>
                            <b>Soldier Retreat</b> - Retreat backwards (orthogonal or diagonal) two blocks if it is adjacent to an enemy soldier.
                            Capturing is allowed while retreating.
                            <center>
                                <br />
                                <img
                                    src="images/soldier_move_2.png"
                                    alt="Soldier Retreat"
                                    width="200"
                                    height="200"
                                />
                            </center>
                            <br />
                        </li>
                    </ul>
                </p>
                <h3>Cannon Moves</h3>
                <p>
                    A cannon is capable of the following moves:
                    <ul>
                        <li>
                            <b>Cannon Shot</b> - May make a non-move capture two or three positions in line with the group as
                            long as the position immediately in front of the cannon is not occupied. A cannon shot can
                            eliminate a soldier as well as a Townhall from the game.
                            <center>
                                <br />
                                <img
                                    src="images/cannon_bomb.png"
                                    alt="Cannon Shot"
                                    width="300"
                                    height="300"
                                />
                            </center>
                            <br />
                        </li>
                        <li>
                            <b>Cannon Movement</b> - It may also shift along its length in either direction without capturing.
                            <center>
                                <br />
                                <img
                                    src="images/cannon_move.png"
                                    alt="Cannon Move"
                                    width="300"
                                    height="300"
                                />
                            </center>
                            <br />
                        </li>
                    </ul>
                </p>
                <center>
                    <Link to="/cannon">
                        <button className='button-common'> Play </button>
                    </Link>
                </center>
                <br />
            </div>
            <Footer />
        </>
    );
}