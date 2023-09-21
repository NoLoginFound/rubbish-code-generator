const fs = require('fs')
function loadSplitLines(name){
	return fs.readFileSync(name, 'utf-8').split('\n').map(s => s.trim());
}
const verbs = loadSplitLines('verbs.txt');
const adjectives = loadSplitLines('adjectives.txt');
const nouns = loadSplitLines('nouns.txt');
function randInt(upperBoundExclusive){
	return Math.floor(Math.random()*upperBoundExclusive);
}
function rand(array){
	return array[randInt(array.length)];
}
function camelCase(parts){
	return parts.map( (part, index) => {
		if(index === 0){
			return part.toLowerCase();
		}else{
			return part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase();
		}
	}).join('')
}
function generateMeaningfulFunctionName(){
	const parts = [];
	if(Math.random() < 0.6){
		parts.push(rand(nouns));
	}
	
	if(parts.length > 0 && Math.random() < 0.3){
		parts.unshift(rand(adjectives));
	}
	
	if(Math.random() <.95 || parts.length === 0){
		parts.unshift(rand(verbs));
	}
	return camelCase(parts);
}
function generateFunctionName(){
	if(Math.random() < 0.05){
		return `func${Math.random().toString().substring(2)}`;
	}else{
		return generateMeaningfulFunctionName();
	}
}
function generateParamName(){
	if(Math.random()<0.05){
		return String.fromCharCode('a'.charCodeAt(0)+randInt(26));
	}else{
		const parts = [];
		if(Math.random()<0.05){
			parts.push(rand(adjectives));
		}
		parts.push(rand(nouns));
		return camelCase(parts);
	}
}

const functionNames = [];
const functionMaxParamUsed = [];
function generateFunctionCall(){
	if(functionNames.length === 0){
		return 'Math.random()';
	}
	const functionIndex = randInt(functionNames.length);
	const paramsNeeded = functionMaxParamUsed[functionIndex];
	const params = [];
	const genericParams = ['result', 'result*2','Math.random()', '(new Date()).getTime()', 'document.querySelectorAll(\'div\').length'];
	for(let i = 0; i < paramsNeeded; i++){
		if(Math.random() < 0.3){
			params.push(rand(genericParams));
		}else if (Math.random() < 0.05){
			params.push(generateFunctionCall());
		}else{
			params.push(randInt(100));
		}
	}
	return `${functionNames[functionIndex]}( ${params.join(', ')} )`
}

let res = '';

function makeFunction(){
  const name = generateFunctionName();
  const operations = '+-*/%';
  const op = Math.floor(Math.random()*5);
  const varArgsParamName = generateParamName();
  let text =  `function ${name} (...${varArgsParamName}) 
{
  result = ${Math.random()*50};
`;
  let maxParamsUsed = 0;
  for(let i = 0; i < Math.random()*10; i++){
    text += `  result = result ${rand(operations)} ${generateFunctionCall()}`;
	if(Math.random() < 0.4){
		const paramIndex = randInt(10);
		text += ` ${rand(operations)} ${varArgsParamName}[${paramIndex}]`;
		maxParamsUsed = Math.max(maxParamsUsed, paramIndex+1);
	}
	if(Math.random() < 0.05){
		text += ` ${rand(operations)} ${randInt(100)}`;
	}
	text += ';\n'
  }
  text+='  return result;\n}\n\n';
  functionNames.push(name);
  functionMaxParamUsed.push(maxParamsUsed);
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