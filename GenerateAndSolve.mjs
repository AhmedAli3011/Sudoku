function solveSudoku(board){
    return checkValid(board)&&trySolve(board)
}
function trySolve(board,row=0,col=0){
    if(row>8||col>8)
        return true
    // calcualate new cell position
    var nc =col
    var nr = row
    if(col===8){
     nr=  row+1
     nc=0
    }
     else{
       nc=  col+1
    }
    //////
    if(board[row][col]===0){
        Loop:
        for(let i =1;i<=9;i++){
            //check row
            if(board[row].includes(i))
                continue
            //check column
            for(let j =0;j<9;j++)
            {
                if(board[j][col]===i)
                    continue Loop
            }
            //check square
            let found = false
            board.slice(row-row%3,row-row%3+3).forEach(function(elem){
               if(elem.slice(col-col%3,col-col%3+3).includes(i))
                 found=true})
            if(found)
                continue
          // go to the next cell
          board[row][col]=i
          state=  trySolve(board,nr,nc)
          if(state)
            return true
          else
          board[row][col]=0
        }
        return false
    }
  return trySolve(board,nr,nc)
}

function checkValid(board){
    let problem = false
    board.forEach(function(row,rindex){
        row.forEach(function(cell,cindex){
               if(cell===0||problem)
                return
                //check row
                for(let j =0;j<9;j++)
                    {
                        if(j!=cindex&&board[rindex][j]===cell)
                            problem=true
                    }
                //check column
                for(let j =0;j<9;j++)
                {if(j!=rindex&&board[j][cindex]===cell)
                        problem=true
                }
                //check square
                board[rindex][cindex]=-cell
                board.slice(rindex-rindex%3,rindex-rindex%3+3).forEach(function(elem){
                   if(elem.slice(cindex-cindex%3,cindex-cindex%3+3).includes(cell))
                     problem=true})
                   board[rindex][cindex]=-board[rindex][cindex]
        })})
    return !problem
}


board =[
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],

]
if(solveSudoku(board))
    console.table (board)
else
   console.log("cannot be solved")