import { useState } from "react";

class Node {
    constructor(val, prev, id) {
        this.val = val;
        this.prev = prev;
        this.id = id
    }
}

function Square({ value, onSquareClick, selected }) {
    return (
        <button 
            className={`square ${selected ? 'selected' : ''}`} 
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (isXNext(squares)) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winningLine = calculateWinner(squares);
    let status;
    if (winningLine) {
        const winner = squares[winningLine[0]];
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (isXNext(squares) ? "X" : "O");
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square
                    value={squares[0]}
                    onSquareClick={() => handleClick(0)}
                    selected={winningLine && winningLine.includes(0)}
                />
                <Square
                    value={squares[1]}
                    onSquareClick={() => handleClick(1)}
                    selected={winningLine && winningLine.includes(1)}
                />
                <Square
                    value={squares[2]}
                    onSquareClick={() => handleClick(2)}
                    selected={winningLine && winningLine.includes(2)}
                />
            </div>
            <div className="board-row">
                <Square
                    value={squares[3]}
                    onSquareClick={() => handleClick(3)}
                    selected={winningLine && winningLine.includes(3)}
                />
                <Square
                    value={squares[4]}
                    onSquareClick={() => handleClick(4)}
                    selected={winningLine && winningLine.includes(4)}
                />
                <Square
                    value={squares[5]}
                    onSquareClick={() => handleClick(5)}
                    selected={winningLine && winningLine.includes(5)}
                />
            </div>
            <div className="board-row">
                <Square
                    value={squares[6]}
                    onSquareClick={() => handleClick(6)}
                    selected={winningLine && winningLine.includes(6)}
                />
                <Square
                    value={squares[7]}
                    onSquareClick={() => handleClick(7)}
                    selected={winningLine && winningLine.includes(7)}
                />
                <Square
                    value={squares[8]}
                    onSquareClick={() => handleClick(8)}
                    selected={winningLine && winningLine.includes(8)}
                />
            </div>
        </>
    );
}

export default function Game() {
    const [nextNodeId, setNextNodeId] = useState(0);
    const [branches, setBranches] = useState([new Node(Array(9).fill(null), null, nextNodeId)]);
    const [currentNode, setCurrentNode] = useState(branches[0]);

    function findNode(branches, nodeId) {
        for (const branch of branches) {
            let curr = branch;

            while (curr) {
                if (curr.id === nodeId) {
                    return curr;
                }

                curr = curr.prev;
            }
        }

        return null;
    }

    function handlePlay(nextSquares) {
        const newId = nextNodeId + 1;
        const newNode = new Node(nextSquares, currentNode, newId);
        const branchHead = branches.find((branchHead) => branchHead.id === currentNode.id);

        // update the branch head when inserting a new node while on a branch head
        if (branchHead) {
            const newBranches = [];
            for (const branch of branches) {
                if (branch === branchHead) {
                    newBranches.push(newNode);
                }
                else {
                    newBranches.push(branch)
                }
            }
            setBranches(newBranches);
        }
        else { // make a new branch when inserting a new node in the middle of a branch
            setBranches([...branches, newNode]);
        }

        setNextNodeId(newId);
        setCurrentNode(newNode);
    }

    function jumpTo(nodeId) {
        const node = findNode(branches, nodeId);
        setCurrentNode(node);
    }

    // get all moves by going through each branch head until the end of the list
    const branchMoves = branches.map((branch) => {
        const moves = [];
        let curr = branch;
        while (curr) {
            const nodeId = curr.id;
            let description;
            if (nodeId > 0) {
                description = "Go to move #" + nodeId;
            } else {
                description = "Go to game start";
            }
            moves.push(
                <li key={nodeId} className={currentNode.id === nodeId ? "selected" : ""}>
                    <button onClick={() => jumpTo(nodeId)}>{description}</button>
                </li>
            );
            curr = curr.prev;
        }
        
        return moves.reverse();
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={currentNode.val}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                {branchMoves.map((branch, index) => (
                    <div key={index}>
                        <h3>Branch #{index + 1}</h3>
                        <ol>{branch}</ol>
                    </div>
                ))};
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return lines[i];
        }
    }
    return null;
}

function isXNext(squares) {
    let xCount = 0;
    let oCount = 0;

    for (const c of squares) {
        if (c === "X") {
            xCount++;
        }
        else if (c === "O") {
            oCount++;
        }
    }

    return xCount - oCount === 0;
}
