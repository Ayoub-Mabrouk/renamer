const path = require('path');
const fs = require('fs');
const { log } = require('console');

const folderPath = './files-to-rename';
const customFilePrefix = 'oo';
const separator = '-';

fs.readdir(folderPath, (error, files) => {
    if (error) {
        // Handle error here
        console.log(error);
    }

    const {length:filesCount} = files;

    if(filesCount>1){
        let renamedFilesCount = 0;
        const [{name:fileName1},{name:fileName2}] = [path.parse(files[0]),path.parse(files[1])];
        const startPattern = getStartCommonChars(fileName1,fileName2);
        const endPattern = getEndCommonChars(fileName1,fileName2);

        const regexPattern = new RegExp(`${startPattern}|${endPattern}`, 'g');

        for (const file of files) {
            const {name:fileName, ext:fileExtention} = path.parse(file);
            const newFileName = [customFilePrefix,fileName.replace(regexPattern,'')].filter(e=>e).join(separator)+fileExtention;
            const oldPath = path.join(__dirname, folderPath, file);
            const newPath = path.join(__dirname, folderPath, newFileName);
            
            try {
                fs.renameSync(oldPath, newPath);
                renamedFilesCount++;
            }catch (err) {
                console.error(`Error renaming file ${oldPath}:`, err);
            }
        }
        console.log(`${renamedFilesCount} from ${filesCount} files has changed successfully`);
        
    }else{
        console.log(`files should be more than 1 only ${filesCount} found`);
    }

    
});





function getStartCommonChars(str1,str2){

    let commonChars = [];

    for (let i = 0; i < str1.length; i++) {
        if(str1[i]==str2[i]){
            commonChars.push(str1[i]);
        }else{
            break;
        }
    }
    return commonChars.join``;
}

function getEndCommonChars(str1,str2){

    let commonChars = [];

    for (let i = str1.length-1; i >= 0; i--) {
        if(str1[i]==str2[i]){
            commonChars.push(str1[i]);
        }else{
            break;
        }
    }
    return commonChars.reverse().join``;
}