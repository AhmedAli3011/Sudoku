import rd from 'readline'
import { gamePlay } from './GamePlay.mjs';
import { generateNewSudoku } from './GenerateAndSolve.mjs';




function main(){
    const readline = rd.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      process.stdout.write("\u001b[2J\u001b[0;0H");
      readline.question(drawMainMenu(), ans => {
        ans=ans.trim()
        
        switch (ans) {
           case "1":
            let sudokuBoard =  generateNewSudoku()
            gamePlay(sudokuBoard)
            break
           case "2":
            //LoadMenu() 
            console.log("Load Menu")
            break
           case "3":
            readline.close()
            console.log("Game Closed")
            return
           default:
            main()
        }
        
      });

}



function drawMainMenu() {
    return "##################AHMED`S SUDOKU##################\n\n1-New Game\n\n2-Load Game\n\n3-Exit\n\nEnter Valid Input (1,2,3):"
}

main()
