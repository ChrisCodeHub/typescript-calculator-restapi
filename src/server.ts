import express from 'express'
import path from 'path'
import * as _ from 'lodash'

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

interface CalculatorState {
  display: string;
  completedValue: null | number;
  operation: null | string;  
}


class BasicCalculator {

  private display : string = "";
  private currentValue : null | number =  null;
  private operation: string = "";
  private completedValue :number = 0;      // holds teh first completed number entered via keypad
  
  public getState(): CalculatorState{
    const calculatorState = {
      display : this.display,
      completedValue: this.completedValue,
      operation: this.operation,
    }
    console.log(`completed ${typeof(calculatorState.completedValue)}  ${calculatorState.completedValue}`)
    console.log(`${typeof(this.display)}  ${this.display}`)

    return calculatorState;
  }

  // when user wants to clear out all previous activities
  public reset():void{
      this.display = "";
      this.currentValue = null;
      this.operation = "";
      this.completedValue = 0;
  }

  // since we are a basic calculator everythiung is decimal
  // when we enter a number, if previous is null then all we have is the number
  // if we have previous entries then we need to add this one onto the end..
  // so shuffle up by 10 and add/
  public numberEntered(newEntry : number): void  { 
      if (this.currentValue === null){ 
        this.currentValue = newEntry;
      }
      else {        
        this.currentValue = (this.currentValue * 10) + newEntry;
      }

      console.log("currentValue:", this.currentValue, "type:", typeof this.currentValue);

      this.display = String(this.currentValue);
      console.log ('number input, now at ${currentValue}');
  }


  public operationSpecified(operationRequired : string): void {
    if (operationRequired === '=') {
      const finalResult = this.performCalculation()
      this.display = String(finalResult);
      this.completedValue = 0;
      this.currentValue = null;
    }
    else {
      this.operation = operationRequired;
      this.completedValue = (this.currentValue === null) ? 0 : this.currentValue;
      this.currentValue = null;
    }
  }

  private performCalculation(): number {
    let result: number = 0; 
    this.currentValue  = (this.currentValue ?? 0);    
    switch (this.operation){
      case ('+'): result = this.completedValue + this.currentValue
                  break;
      case ('-'): result = this.completedValue - this.currentValue
                  break;
      case ('*'): result = this.completedValue * this.currentValue
                  break;
      case ('/'): result = ((this.currentValue ?? 0) != 0) ? this.completedValue / this.currentValue 
                                                           : 0
                  break;
      default:    console.log(` not sure what to do with operation ->${this.operation}<-`)
                  break
    }

    return result;
  }
}

let basicCalculator = new BasicCalculator();

// GET calculator state
app.get('/api/calculator', (req, res) => {
  res.json(basicCalculator.getState());
});

// POST number input
// called every time that a user enters a new number in the keypad
app.post('/api/calculator/number', (req, res) => {
  let numberEntered = _.get(req.body, 'digit', 0);
  basicCalculator.numberEntered(numberEntered);
  res.json(basicCalculator.getState());
});

// POST operation (+, -, *, /)
// called every time that a user enters an operation in (+, -, *, /)
app.post('/api/calculator/operation', (req, res) => { 
  const requestBody = (req.body);
  const operationRequired : string = _.get(requestBody, "operation", "")
  basicCalculator.operationSpecified(operationRequired);
  res.json(basicCalculator.getState());
});

// POST equals
app.post('/api/calculator/equals', (req, res) => {
  const equalsPushed = basicCalculator.operationSpecified('=');
  res.json(basicCalculator.getState());
});

// POST clear
app.post('/api/calculator/clear', (req, res) => {
  console.log(` pressed clear /`);
  basicCalculator.reset();
  res.json(basicCalculator.getState());
});

// // Serve the HTML page
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   console.log(`accessed root /`);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Calculator server running on http://localhost:${PORT}`);
  console.log(`new version start clickings`);
});