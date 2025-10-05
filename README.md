
initialise and setup tooling
```bash
npm init -y

npm install -D typescript @types/node @types/express ts-node nodemon
npm install express
npm install lodash
npm install -D @types/lodash

```


transpile and run
```bash
npm run build
node ./dist/server.js
```



`index.html` was written by Claude.ai  
file is served from express app and makes a UI on 127.0.0.1:3000

```bash
interface CalculatorState {
  display: string,
  previousValue: null | number,
  operation: null | string,
  waitingForOperand: boolean
}
```

GET calculator state  /api/calculator
return CalculatorState as json

POST '/api/calculator/number'  send digit just entered in the body
return CalculatorState as json

POST '/api/calculator/operation send '+' '-' '*' '/' just entered in the body
return CalculatorState as json

POST '/api/calculator/equals'  sent when user presses '='
return CalculatorState as json