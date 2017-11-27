const anyToJson = require('anytojson');
const fs = require('fs');

const csvFilePath = '.csv'; //path to the csv file
anyToJson.csv({path: csvFilePath}, function(csv) {
    let aux = csv.map(mergeKeys);
    
    const chunkSize = 1 //number of element on the array
    const groups = createGroupedArray(aux, chunkSize);

    let i = 1;
    groups.forEach(element => {
        let fileContent = forElasticsearch(element);
        let fileName = 'elastic/file' + i++ + '.json';
        writeFile(fileName, fileContent)
    });
    
});

// this func need to be change for each file
function mergeKeys(element) {
    element.test5 = [element.test3, element.test4];
    delete element.test3;
    delete element.test4;
    return element;
}

function createGroupedArray(array, chunkSize) {
    const groups = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        groups.push(array.slice(i, i+chunkSize));
    }
    return groups;
}

function forElasticsearch(array) {
    let fileContent = '';
    const index = JSON.stringify({index: {}})
    array.forEach(element => {
        fileContent += index + '\n'
        fileContent += JSON.stringify(element) + '\n';
    });
    return fileContent;
}

function writeFile(name, content) {
    fs.writeFile(name, content, function(err) {
        if(err) {
            console.log(err);
        }
    })
}
