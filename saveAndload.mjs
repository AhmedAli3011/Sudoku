import fs from "node:fs"
import path from "node:path"
export function save(board,nameOfFile) 
{ 
    try{
    fs.writeFileSync(`./Saved_Games/${nameOfFile}`,JSON.stringify(board),{  encoding: 'utf-8',flag: 'wx'})
    console.log("Saving Completed!!!")
    return true
    }
    catch(error)
    {  
       if(error.code === 'EEXIST')
        console.log("File already Exists") 
       else
        console.log("Saving Failed!!!")
      return false
    }
}
export function load(nameOfFile)
{
    try{
        console.log("Loading Started")
        let board =fs.readFileSync(`./Saved_Games/${nameOfFile}`,{encoding:"utf-8"}).toString("utf-8")
        console.log("Loading Completed!!!")
        return JSON.parse(data)
        }
        catch(error)
        {
          console.log("Loading Failed!!!")
          return 
        }

}
