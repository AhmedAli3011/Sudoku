import { pathToFileURL } from 'url';
import rd from 'readline'

const filePath = 'E:/Sudoku/GamePlay.mjs';
const fileUrl = pathToFileURL(filePath).href;

const module = await import(fileUrl); 

const { gamePlay } = module;



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
            let sudokuBoard = [
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
