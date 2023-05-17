
let el = document.querySelector('#header')

let res = '';
const names = [];
function makeFunction(){
  const name = `func${Math.random().toString().substring(2)}`;
  const operations = '+-*/%';
  const op = Math.floor(Math.random()*5);
  let text =  `function ${name} (...${String.fromCharCode('a'.charCodeAt(0)+Math.floor(Math.random()*26))}) 
{
  result = ${Math.random()*50};
`;
  for(let i = 0; i < Math.random()*10; i++){
    text += `  result = result ${operations[Math.floor(Math.random()*operations.length)]} ${names[Math.floor(Math.random()*names.length)]}();\n`;
  }
  text+='  return result;\n}\n\n';
  names.push(name);
  return text;
}

const expectedPages = 10;
const linesPerPage = 50;
const linesPerFunction = 7;
const numFunctions = Math.floor(expectedPages*linesPerPage/linesPerFunction);
for(let i = 0; i < numFunctions; i++){
  res+= makeFunction();
}

console.log(res);
navigator.clipboard.writeText(res);