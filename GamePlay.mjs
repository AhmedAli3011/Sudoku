import rd from 'readline'
export function gamePlay(board,undoStack=[],redoStack=[]){
    process.stdout.write("\u001b[2J\u001b[0;0H");
    const readline = rd.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      draw(board)
      function recursiceReadLine(readline,board){
      readline.question("",ans => {
        
        
       ans = ans.trim().replace(/\s{2,}/g, ' ').split(" ");
       switch (ans[0].toLowerCase()) {
        case 'p':
            if(addCell(board,+(ans[1]??0),+(ans[2]??0),+(ans[3]??0),undoStack,redoStack,false))
                return gamePlay(board,undoStack,redoStack)
            else
            return recursiceReadLine(readline,board)
        case 'd':
           if(deleteCell(board,+ans[1],+ans[2],undoStack,redoStack,false))
              return  gamePlay(board,undoStack,redoStack)
            else return recursiceReadLine(readline,board)
        case "s":
            save(board)
            return recursiceReadLine(readline,board)
        case "u":
           if(undo(board,undoStack,redoStack))
            return gamePlay(board,undoStack,redoStack)
            else
            return recursiceReadLine(readline,board)
            
        case "r":
            if(redo(board,undoStack,redoStack))
            return gamePlay(board,undoStack,redoStack)
            else
            return recursiceReadLine(readline,board)
        case "solve":
            if(solveSudoku(board))
            return gamePlay(board,undoStack,redoStack)
            else
            return recursiceReadLine(readline,board)
            
        case "rt":
            resetTime()
            break;
        case "new":  
        let  newboard =   generateNewGame()
          return gamePlay(newboard,undoStack)

          
          
          
         
        case "b" :
          return  main()
            
            
        default:   
        console.log("Invalid Input")
          return  recursiceReadLine(readline,board)
                               

       }
      
       
       

      })
     
    
    }
   return recursiceReadLine(readline,board)
    

      
}

function addCell(board,value,row,col,undoStack,redoStack,asUndo){
    if(row<1||row>9||col<1||col>9){
        console.log("Enter valid Position")
        return false

    }
    if(value<1||value>9){
        console.log("Enter Valid Value")
        return false
    }
    if(board[row-1][col-1]===value)
        {console.log("same value")
        return false}
    // if(board[row-1][col]["updatable"]===false)
    // {
    //     console.log("cell cannot be updated")
    //     return false
    // }

    if(board[row-1].slice(0,col-1).concat(board[row-1].slice(col)).includes(value)){
        console.log(`ROW ${row} contains value ${value}`  )
        return false}
        
    //check column
    for(let j =0;j<9;j++)
    {
        if(j!=row-1&&board[j][col-1]===value){
            console.log(`COLUMN ${col} contains value ${value}`  )
        return false}
            
    }
    //check square
    let found = false
    board.slice(row-1-(row-1)%3,row-1-(row-1)%3+3).forEach(function(elem){
        
    
      if(elem.slice((col-1)-(col-1)%3,(col-1)-(col-1)%3+3).includes(value))
         found=true} )
    if(found){
        console.log(`small square contains value ${value}`)
        return false}
        if(!asUndo){
    undoStack.push([row-1,col-1,board[row-1][col-1]])
    redoStack.length=0}
    board[row-1][col-1]=value
    return true
        
}
function deleteCell(board,row,col,undoStack,redoStack,asUndo){
    if(row<1||row>9||col<1||col>9){
        console.log("Enter valid Position")
        return false

    }
    if(board[row-1][col-1]===0)
        {console.log("already empty cell")
        return false}
        if(!asUndo){
    undoStack.push([row-1,col-1,board[row-1][col-1]]) 
    redoStack.length=0} 
    
        
    board[row-1][col-1]=0
    
    return true


}
function undo(board,undoStack,redoStack){
    if(undoStack.length!=0){
        console.log(undoStack[undoStack.length-1])
        redoStack.push([undoStack[undoStack.length-1][0],undoStack[undoStack.length-1][1],board[undoStack[undoStack.length-1][0]][undoStack[undoStack.length-1][1]]])
      
    if(undoStack[undoStack.length-1][2]===0){
        deleteCell(board,undoStack[undoStack.length-1][0]+1,undoStack[undoStack.length-1][1]+1,undoStack,redoStack,true)
    }
    else{
        addCell(board,undoStack[undoStack.length-1][2],undoStack[undoStack.length-1][0]+1,undoStack[undoStack.length-1][1]+1,undoStack,redoStack,true)
    }
    undoStack.pop()
    console.log('undo Done')
    return true
}

console.log("cannot undo")
return false


}
function redo(board,undoStack,redoStack){
    if(redoStack.length!=0){
        undoStack.length=0
        if(redoStack[redoStack.length-1][2]===0){
            deleteCell(board,redoStack[redoStack.length-1][0]+1,redoStack[redoStack.length-1][0]+1,undoStack,redoStack,true)
        }
        else{
            addCell(board,redoStack[redoStack.length-1][2],redoStack[redoStack.length-1][0]+1,redoStack[redoStack.length-1][1]+1,undoStack,redoStack,true)
        }
        redoStack.pop()
        console.log('redo Done')
        return true

    }
    
        console.log("cannot redo")
        return false
    

}


function draw(board){
    process.stdout.write("\u001b[2J\u001b[0;0H")
    console.log("                                 SUDOKU                   ")
    let firstline = ("\x1b[90m \x1b[97m_______".repeat(9)+"")
    console.log(firstline)

    for(let i =0;i<9;i++){
       let  secondLine =("\x1b[97m|\x1b[90m       |       |       ".repeat(3)+"\x1b[97m|")
       let thirdLine=""
       for(let j =0;j<9;j++){
        if(j%3===0)
              thirdLine+=`\x1b[97m|\x1b[90m   ${board[i][j]}   `
            else
        thirdLine+=`|   ${board[i][j]}   `
       }
       thirdLine+="\x1b[97m|"
       
       console.log(secondLine)
       console.log(thirdLine)
       if(i%3===2)
       console.log("\x1b[97m|\x1b[97m_______\x1b[90m|\x1b[97m_______\x1b[90m|\x1b[97m_______".repeat(3)+"\x1b[97m|")
       else
       console.log("\x1b[97m|\x1b[90m_______|_______|_______".repeat(3)+"\x1b[97m|")







    }
    const readline = rd
    readline.cursorTo(process.stdout, 78, 10);
    process.stdout.write("Play: p (row) (col) (value)")
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
