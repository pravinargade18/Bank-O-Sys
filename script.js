'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


const displayMovements = function(acc, sort=false) {

    containerMovements.innerHTML='';

    const movs=sort?acc.movements.slice().sort((a,b)=>a-b):acc.movements;
    // slice() is used to create copy of the movements array so that it'll not affect on the original array 


    movs.forEach(function(mov,i){
      const type=mov>0?'deposit':'withdrawal';
      const date=new Date(acc.movementsDates[i]);

      const day = `${date.getDate()}`.padStart(2, 0); //we need convert it into a string so that we can use padStart() with padStart we can add 0 if the month or date is single digit
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const year = date.getFullYear();
      const displayDate = `${day}/${month}/${year}`;


        const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin',html);
        //This method is used to insert the elements inside container it takes two arguments first->where to insert ,second->what to insert

    });
}


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `Rs.${acc.balance.toFixed(2)}`;
};


const calcDisplaySummary = function (acc) {
      const income=acc.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0);
      labelSumIn.textContent = `Rs.${income.toFixed(2)}`;

      const out= acc.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0);
      labelSumOut.textContent = `Rs.${Math.abs(out.toFixed(2))}`;
      const interest=acc.movements.map(deposit=>(deposit*acc.interestRate)/100).filter(deposit=>deposit>=1).reduce((acc,int)=>acc+int,0)
      labelSumInterest.textContent=`Rs.${interest.toFixed(2)}`
}



const createUsernames= function(accounts) {
	accounts.forEach(function(acc){
      acc.username = acc     //creating new property for each account
        .owner.toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join('');
	})
}
createUsernames(accounts);

const updateUI=(acc)=>{
  //display all the data for the currentAccount
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
}

let currentAccount;

// keep logged in  
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;




btnLogin.addEventListener('click', (event) =>{
  event.preventDefault(); // prevent default behaviour of submitting the form 

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin===+(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;


    //create current date and time
    const now = new Date();
    const date = `${now.getDate()}`.padStart(2, 0); //we need convert it into a string so that we can use padStart() with padStart we can add 0 if the month or date is single digit
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = now.getHours()%12;   //%12 to convert into 12 hours format
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
    labelDate.textContent = `${date}/${month}/${year}, ${hours}:${minutes}`;



    containerApp.style.opacity=100;
    
    // To clear the input fields 
    inputLoginUsername.value=inputLoginPin.value='';

    // To clear focus of the input field  
    inputLoginPin.blur();

    updateUI(currentAccount);

  }
})


btnTransfer.addEventListener('click',(event)=>{
  event.preventDefault();
  const amount = +(inputTransferAmount.value);  //+ is used to convert the string into a number

  const recieversAccount = accounts.find(acc=>acc.username===inputTransferTo.value);
  inputTransferTo.value='';
  inputTransferAmount.value='';

  if(amount>0 && currentAccount.balance>=amount && recieversAccount && currentAccount.username!==recieversAccount?.username){
    //  doing the transfer
      currentAccount.movements.push(-amount);
      recieversAccount.movements.push(amount);
      
      //  add transfer date 
      currentAccount.movementsDates.push(new Date().toISOString());
      recieversAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
  }
})


btnLoan.addEventListener('click', function(event){
    event.preventDefault();
    const loan = Math.floor(inputLoanAmount.value);
       
    inputLoanAmount.value = '';

    if(loan>0 && currentAccount.movements.some(mov=>mov>=loan*0.1)){
      currentAccount.movements.push(loan);

      // add date for loan
      currentAccount.movementsDates.push(new Date().toISOString());

       updateUI(currentAccount);

    }
    
})

btnClose.addEventListener('click',(event) =>{
    event.preventDefault();

    if(inputCloseUsername.value===currentAccount.username && +(inputClosePin.value)===currentAccount.pin){
        const index = accounts.findIndex(
          acc => acc.username === currentAccount.username
        );
        console.log(index);
          accounts.splice(index, 1);  // to delete the object with that username and pin

        containerApp.style.opacity=0; 
    }
    inputCloseUsername.value = inputCloseUsername.value = '';

})


let sorted=false;
btnSort.addEventListener('click',(event)=>{
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted=!sorted;
})




