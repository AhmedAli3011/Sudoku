import rd from 'readline'
import {
    solveSudoku,
    generateNewSudoku
} from './GenerateAndSolve.mjs';
import {save,load} from "./saveAndload.mjs"
export function gamePlay(board, undoStack = [], redoStack = []) {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    const readline = rd.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    draw(board)

    function recursiceReadLine(readline, board) {
        readline.question("", ans => {


            ans = ans.trim().replace(/\s{2,}/g, ' ').split(" ");
            switch (ans[0].toLowerCase()) {
                case 'p':

                    if (addCell(board, +(ans[1] ?? 0), +(ans[2] ?? 0), +(ans[3] ?? 0), undoStack, redoStack, false)) {
                        readline.close()
                        return gamePlay(board, undoStack, redoStack)
                    } else
                        return recursiceReadLine(readline, board)
                case 'd':

                    if (deleteCell(board, +ans[1], +ans[2], undoStack, redoStack, false)) {
                        readline.close()
                        return gamePlay(board, undoStack, redoStack)
                    } else return recursiceReadLine(readline, board)
                case "s":
                   
                    if(ans[1]!=undefined)
                        save(board,ans[1]) 
                    else
                    console.log("File Name Not Defined")
                    
                    return recursiceReadLine(readline, board)
                case "u":
                    if (undo(board, undoStack, redoStack)) {
                        readline.close()
                        return gamePlay(board, undoStack, redoStack)
                    } else {
                        return recursiceReadLine(readline, board)
                    }

                    case "r":
                        if (redo(board, undoStack, redoStack)) {
                            readline.close()
                            return gamePlay(board, undoStack, redoStack)
                        } else {
                            return recursiceReadLine(readline, board)
                        }
                        case "solve":
                            undoStack.push("s")
                            if (solveSudoku(board, undoStack)) {
                                undoStack.push('s')
                                readline.close()
                                return gamePlay(board, undoStack, redoStack)
                            } else {
                                undoStack.pop()

                                return recursiceReadLine(readline, board)
                            }

                            case "rt":
                                resetTime()
                                break;
                            case "new":
                                let newboard = generateNewSudoku()
                                readline.close()
                                return gamePlay(newboard)





                            case "b":
                                return main()


                            default:
                                console.log("Invalid Input")
                                return recursiceReadLine(readline, board)


            }




        })


    }
    return recursiceReadLine(readline, board)



}

function addCell(board, value, row, col, undoStack, redoStack, asUndo) {
    if (row < 1 || row > 9 || col < 1 || col > 9) {
        console.log("Enter valid Position")
        return false

    }
    if (!board[row - 1][col - 1].updatable) {
        console.log("intial cell cannot be updated")
        return false
    }
    if (value < 1 || value > 9) {
        console.log("Enter Valid Value")
        return false
    }

    if (board[row - 1][col - 1].value === value) {
        console.log("same value")
        return false
    }


    if (board[row - 1].slice(0, col - 1).concat(board[row - 1].slice(col)).map(elem => elem.value).includes(value)) {
        console.log(`ROW ${row} contains value ${value}`)
        return false
    }

    //check column
    for (let j = 0; j < 9; j++) {
        if (j != row - 1 && board[j][col - 1].value === value) {
            console.log(`COLUMN ${col} contains value ${value}`)
            return false
        }

    }
    //check square
    let found = false
    board.slice(row - 1 - (row - 1) % 3, row - 1 - (row - 1) % 3 + 3).forEach(function (elem) {


        if (elem.slice((col - 1) - (col - 1) % 3, (col - 1) - (col - 1) % 3 + 3).includes(value))
            found = true
    })
    if (found) {
        console.log(`small square contains value ${value}`)
        return false
    }
    if (!asUndo) {
        undoStack.push([row - 1, col - 1, board[row - 1][col - 1].value])
        redoStack.length = 0
    }
    board[row - 1][col - 1].value = value
    return true

}

function deleteCell(board, row, col, undoStack, redoStack, asUndo) {
    if (row < 1 || row > 9 || col < 1 || col > 9) {
        console.log("Enter valid Position")
        return false
    }
    if (!board[row - 1][col - 1].updatable) {
        console.log("cannot delete  intial cell")
        return false

    }


    if (board[row - 1][col - 1].value === 0) {
        console.log("already empty cell")
        return false
    }
    if (!asUndo) {
        undoStack.push([row - 1, col - 1, board[row - 1][col - 1].value])
        redoStack.length = 0
    }


    board[row - 1][col - 1].value = 0

    return true


}

function undo(board, undoStack, redoStack) {
    if (undoStack.length != 0) {
        let solve = false
        if (undoStack[undoStack.length - 1] === 's') {
            redoStack.push('s')
            undoStack.pop()
            solve = true
        }
        while (undoStack[undoStack.length - 1] != 's') {
            redoStack.push([undoStack[undoStack.length - 1][0], undoStack[undoStack.length - 1][1], board[undoStack[undoStack.length - 1][0]][undoStack[undoStack.length - 1][1]].value])

            if (undoStack[undoStack.length - 1][2] === 0) {
                deleteCell(board, undoStack[undoStack.length - 1][0] + 1, undoStack[undoStack.length - 1][1] + 1, undoStack, redoStack, true)
            } else {
                addCell(board, undoStack[undoStack.length - 1][2], undoStack[undoStack.length - 1][0] + 1, undoStack[undoStack.length - 1][1] + 1, undoStack, redoStack, true)
            }
            undoStack.pop()
            if (!solve)
                break
        }
        if (solve) {
            redoStack.push(undoStack.pop())
        }

        console.log('undo Done')
        return true
    }

    console.log("cannot undo")
    return false


}

function redo(board, undoStack, redoStack) {
    if (redoStack.length != 0) {
        let solve = false
        if (redoStack[redoStack.length - 1] === 's') {
            redoStack.pop()
            solve = true
        }
        while (redoStack[redoStack.length - 1] != 's') {
            if (redoStack[redoStack.length - 1][2] === 0) {
                deleteCell(board, redoStack[redoStack.length - 1][0] + 1, redoStack[redoStack.length - 1][0] + 1, undoStack, redoStack, true)
            } else {
                addCell(board, redoStack[redoStack.length - 1][2], redoStack[redoStack.length - 1][0] + 1, redoStack[redoStack.length - 1][1] + 1, undoStack, redoStack, true)
            }
            redoStack.pop()

            if (!solve)
                break
        }
        if (solve)
            redoStack.pop()

        console.log('redo Done')
        undoStack.length = 0
        return true

    }

    console.log("cannot redo")
    return false


}


function draw(board) {
    process.stdout.write("\u001b[2J\u001b[0;0H")
    console.log("                                 SUDOKU                   ")
    let firstline = ("\x1b[90m \x1b[97m_______".repeat(9) + "")
    console.log(firstline)

    for (let i = 0; i < 9; i++) {
        let secondLine = ("\x1b[97m|\x1b[90m       |       |       ".repeat(3) + "\x1b[97m|")
        let thirdLine = ""
        for (let j = 0; j < 9; j++) {
            if (j % 3 === 0)
                thirdLine += `\x1b[97m|${!board[i][j].updatable?'\x1b[97m':"\u001b[36m"}   ${board[i][j].value===0?' ':board[i][j].value}\x1b[90m   `
            else
                thirdLine += `|${!board[i][j].updatable?'\x1b[97m':"\u001b[36m"}   ${board[i][j].value===0?' ':board[i][j].value}\x1b[90m   `
        }
        thirdLine += "\x1b[97m|"

        console.log(secondLine)
        console.log(thirdLine)
        if (i % 3 === 2)
            console.log("\x1b[97m|\x1b[97m_______\x1b[90m|\x1b[97m_______\x1b[90m|\x1b[97m_______".repeat(3) + "\x1b[97m|")
        else
            console.log("\x1b[97m|\x1b[90m_______|_______|_______".repeat(3) + "\x1b[97m|")







    }
    const readline = rd
    readline.cursorTo(process.stdout, 78, 10);
    process.stdout.write("Play: p (value) (row) (col)")
    readline.cursorTo(process.stdout, 78, 12);
    process.stdout.write("Delete: d (row) (col) ")
    readline.cursorTo(process.stdout, 78, 14);
    process.stdout.write("Save: s")
    readline.cursorTo(process.stdout, 78, 16);
    process.stdout.write('Undo: u')
    readline.cursorTo(process.stdout, 78, 18);
    process.stdout.write('Redo: r')
    readline.cursorTo(process.stdout, 78, 20);
    process.stdout.write('Solve the board :solve')
    readline.cursorTo(process.stdout, 78, 22);
    process.stdout.write('Reset Time : rt')
    readline.cursorTo(process.stdout, 78, 24);
    process.stdout.write('Generate New Sudoku : new')
    readline.cursorTo(process.stdout, 0, 35);
    process.stdout.write('Enter Valid input:')
    console.log('')











}