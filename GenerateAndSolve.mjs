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

class CellinGeneration{
    constructor(i,j){
        this.rowIndex=i
        this.colIndex=j
        this.value=0
        this.availableValuesNum=9
        this.availableValues=[true,true,true,true,true,true,true,true,true]

    }
}



 export function generateNewSudoku() {

    function fill(cells){
      let EmptyCells = cells.filter((elem)=>elem.value===0)
      if(EmptyCells.length===0){
        
        return true}
        let minAvailableValues = Math.min(...EmptyCells.map(elem=>elem.availableValuesNum))
        
        if(minAvailableValues===0)
        { 
          return false}

       let validCells = EmptyCells.filter((elem)=>elem.availableValuesNum===minAvailableValues)

        let chosenCell = validCells[Math.floor(Math.random() * validCells.length)];
        let array = chosenCell.availableValues.slice()

        while(true){
          let value = chosenCell.availableValues.indexOf(true)+1
          if(value===0){
            
            chosenCell.availableValues=array
            return false

          }
          chosenCell.value=value

         let  cellsChanged =[[false,false,false,false,false,false,false,false,false],
         [false,false,false,false,false,false,false,false,false],
         [false,false,false,false,false,false,false,false,false],
         [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false]
      ]
     
        

          EmptyCells.forEach(function(elem){
            
                 
            
            if(elem!=chosenCell){
                if(elem.rowIndex===chosenCell.rowIndex||elem.colIndex===chosenCell.colIndex||(elem.colIndex>=(chosenCell.colIndex-chosenCell.colIndex%3)&&elem.colIndex<(chosenCell.colIndex-chosenCell.colIndex%3+3)&&elem.rowIndex>=(chosenCell.rowIndex-chosenCell.rowIndex%3)&&elem.rowIndex<(chosenCell.rowIndex-chosenCell.rowIndex%3+3))){
                    elem.availableValuesNum=elem.availableValues[value-1]?elem.availableValuesNum-1:elem.availableValuesNum
                    if(elem.availableValues[value-1]){
                         
                        cellsChanged[elem.rowIndex][elem.colIndex]=true
                    }
                    
                    elem.availableValues[value-1]=false
    
                }
            }
            
            
          })
          
          if(fill(cells)){
            return true
          }
          else{
            chosenCell.value=0
           chosenCell.availableValues[value-1]=false
          
           EmptyCells.forEach(function(elem){
            if(cellsChanged[elem.rowIndex][elem.colIndex]){
              elem.availableValuesNum++
              elem.availableValues[value-1]=true
            }
                                       })


          


               }}


    }
  let   cells=[]
    for(let i =0;i<9;i++){
     
        for(let j =0;j<9;j++){
            cells.push(new CellinGeneration(i,j))
        }
        

    }
    fill(cells)
    function randn_bm() {
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
      return num
    }
    let deletedCellNum=Math.floor(randn_bm()*82)
    for(let i=0;i<deletedCellNum;i++){
      let row = Math.floor(Math.random()*9)
      let col = Math.floor(Math.random()*9)
      if(cells[row*9+col].value===0){
        i--
      }
      else{
        cells[row*9+col].value=0
      }
    }
   let  playingGrid=[]
    for(let i=0;i<9;i++){
      let temp=[]
      for(let j=0;j<9;j++){
        temp.push({
          value:cells[i*9+j].value,
          updatable:cells[i*9+j].value===0

        })
        
      }
      playingGrid.push(temp)
    }
    return playingGrid


}

