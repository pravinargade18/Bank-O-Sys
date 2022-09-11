'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


const displayMovements = function(movements) {

    containerMovements.innerHTML='';

    movements.forEach(function(mov,i){
      const type=mov>0?'deposit':'withdrawal';

        const html = 
        `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin',html);
        //This method is used to insert the elements inside container it takes two arguments first->where to insert ,second->what to insert

    });
}


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `Rs.${acc.balance}`;
};


const calcDisplaySummary = function (acc) {
      const income=acc.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0);
      labelSumIn.textContent=`Rs.${income}`;

      const out= acc.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0);
      labelSumOut.textContent=`Rs.${Math.abs(out)}`;
      const interest=acc.movements.map(deposit=>(deposit*acc.interestRate)/100).filter(deposit=>deposit>=1).reduce((acc,int)=>acc+int,0)
      labelSumInterest.textContent=`Rs.${interest}`
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
  displayMovements(acc.movements);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
}

let currentAccount;

btnLogin.addEventListener('click', (event) =>{
  event.preventDefault(); // prevent default behaviour of submitting the form 

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;

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
  const amount = Number(inputTransferAmount.value);

  const recieversAccount = accounts.find(acc=>acc.username===inputTransferTo.value);
  inputTransferTo.value='';
  inputTransferAmount.value='';

  if(amount>0 && currentAccount.balance>=amount && recieversAccount && currentAccount.username!==recieversAccount?.username){
    //  doing the transfer
      currentAccount.movements.push(-amount);
      recieversAccount.movements.push(amount);

      updateUI(currentAccount);
  }
})


btnLoan.addEventListener('click', function(event){
    event.preventDefault();
    const loan = Number(inputLoanAmount.value);
       
    inputLoanAmount.value = '';

    if(loan>0 && currentAccount.movements.some(mov=>mov>=loan*0.1)){
      currentAccount.movements.push(loan);
       updateUI(currentAccount);

    }
    
})

btnClose.addEventListener('click',(event) =>{
    event.preventDefault();

    if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
        const index = accounts.findIndex(
          acc => acc.username === currentAccount.username
        );
        console.log(index);
          accounts.splice(index, 1);  // to delete the object with that username and pin

        containerApp.style.opacity=0; 
    }
    inputCloseUsername.value = inputCloseUsername.value = '';

})




