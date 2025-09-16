const questionBank = [
    //Note: For answers. I used the indexes of correct option not the acc option
    {
        question: 'What currency is used in Thailand',
        options: ['Euro', 'Cedis', 'Baht', 'Yen'],
        answer: 2 
    },
    {
        question: 'How many legs does a spider have',
        options: [6,8,10,12],
        answer: 1
    },
    {
        question: 'Which drink is made from cocoa beans',
        options: ['Chocolate', 'Tea', 'Juice','Coffee'],
        answer: 0
    },
    {
        question: 'How do you say "egg" in Thai',
        options: ['Khaao', 'Gai', 'Khai', 'Plaa'],
        answer: 2
    },
    {
        question: 'Who Sang the song "Chicago"',
        options: ['Justin TimberLake', 'Micheal Jackson', 'Lady Gaga', 'Lin-Manuel Miranda'],
        answer: 1
    },
    {
        question: 'Who played Jack in Titanic?',
        options: ['Brad Pitt', 'Zac Efron', 'Tom Cruise', 'Leonardo DiCarprio'],
        answer: 3
    },
    {
        question: 'Which is the most successful Thai series',
        options: ['Girl from Nowhere', 'F4 Thailand: Boys over Flowers', 'Bad Buddy', 'Gap: The Series'],
        answer: 3
    },
    {
        question: 'Which Planet is known as the "Red Planet"',
        options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
        answer: 0
    },
    {
        question: "What is Nmasinachi's Favorite Asian Drama",
        options: ['The Loyal Pin', 'Queen of Tears', "What's wrong with Secretary Kim", 'My Demon'],
        answer: 1
    },
    {
        question: 'What is the capital of Thailand',
        options: ['Seoul', 'Phuket', 'Bangkok', 'Chiang Mai'],
        answer: 2
    }
];

//access required elements
let question = document.getElementById('question');
let homePageBox = document.querySelector('.homePageBox');
let quizBox = document.querySelector('.quizBox')
let optionBox = document.querySelector('.optionBox');
let restartBtn = document.getElementById('restartBtn');
let nextBtn = document.getElementById('nextBtn');
let backBtn = document.getElementById('backBtn')
let resultBox = document.querySelector('.resultBox');
let questionCounter = document.getElementById('questionCounter');
let timer = document.getElementById('timer')

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null
const userAnswers = []

//handle timer per question
let initialTime = 10;
let timeLeft;
let timerId;
timer.textContent = `${timeLeft}s`;
function startTimer(){
    timeLeft = initialTime;

    timerId = setInterval(() => {
        //update the timer being shown on the page
        timer.textContent = `${timeLeft}s`;
        //reduce timeLeft
        timeLeft--;
        //end timer
        if(timeLeft < 0){
            clearInterval(timerId);
            nextQuestion();
        }
    }, 1000)
}
//function to display question and options
function loadQuestion(){
    //clear previous timer and restart a new one
    timer.textContent = "0 s"
    clearInterval(timerId);
    startTimer();

    //remove homePage and display quiz
    homePageBox.style.display = 'none'
    quizBox.style.display = 'block'

    //display question
    let currentQuestion = questionBank[currentQuestionIndex];
    question.textContent = `${currentQuestionIndex+1}. ${currentQuestion.question}`;
    optionBox.innerHTML = ''; //clears previous options


    //display options. Loop and create button for each option
    currentQuestion.options.forEach((option, index) => {
        let btn = document.createElement('button');
        btn.className = "options";
        btn.textContent = option;

        //when user clicks an option...
        btn.addEventListener('click', () => {
            //If the user clicks an already selected option meaning they no longer want to choose it
            if(btn.classList.contains('selected')){
                btn.classList.remove('selected');
                selectedOption = null;
            }
            else{
                //first, loop through all options and remove highlight. In case user changes options so there won't be multiple highlighted options
                document.querySelectorAll('.options').forEach((opt) => {
                    opt.classList.remove('selected');
                });
                //add a higlight
                btn.classList.add('selected');
                selectedOption = index;
                nextBtn.disabled = false;// remove disabled feature when an option is selected
                if(currentQuestionIndex === 0){
                    nextBtn.style.display = 'block';
                }
            }

            userAnswers[currentQuestionIndex] = selectedOption
        })
        //reset nextBtnState
        nextBtn.disabled = true; //disable nextBtn for each new question
        if(currentQuestionIndex === 0){
            nextBtn.style.display = 'none'
            backBtn.style.display = 'none'
        }else if(currentQuestionIndex > 0){
            backBtn.style.display = 'block';
        }
        optionBox.append(btn);
    })
   
    questionCounter.textContent = `${currentQuestionIndex+1} of ${questionBank.length} questions`
}
//function to display home page
function homePage(){
    clearInterval(timerId);
    timer.textContent = "0s"
    homePageBox.innerHTML =`
        <p>Welcome!</p>
        <div class="startBtnBox">
            <button id="startBtn">Start Quiz!</button>
        </div>
    `
    let startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', loadQuestion)
}

//function to restart quiz
function restartQuiz(){
    //clear and reset everything
    clearInterval(timerId);
    timer.textContent = "0s"
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null
    nextBtn.disabled = true
    nextBtn.textContent = 'Next';

    //go back to home page
    homePageBox.style.display = 'block'
    quizBox.style.display = 'none';
    resultBox.style.display = 'none';
}
//restart btn function
restartBtn.addEventListener('click',  restartQuiz)

//Function to move to next question
function nextQuestion(){
    //update currentQuestionIndex and check if questions are done
    currentQuestionIndex++;
    if(currentQuestionIndex == questionBank.length - 1){
        nextBtn.textContent = 'Submit';
        loadQuestion();
    }
    else if(currentQuestionIndex < questionBank.length){
        loadQuestion();
    }
    else{  
        showResult();
    }
}
nextBtn.addEventListener('click', nextQuestion)

//function to go back to previous questiob
function previousQuestion(){
    currentQuestionIndex--;
    if(currentQuestionIndex >= 0){
        nextBtn.textContent = 'Next';
        loadQuestion()
    }
}
backBtn.addEventListener('click', previousQuestion)

//function to calculate score and sdisplay result
function showResult(){
    clearInterval(timerId);
    timer.textContent = "0s"
    userAnswers.forEach((ans, index) => {
        if(ans == questionBank[index].answer){
            score++;
            console.log(`Question ${index+1} - Correct`)
            console.log(`Answer - ${questionBank[index].options[questionBank[index].answer]}`)
        }else{
             console.log(`Question ${index+1} - Wrong`)
             console.log(`Answer - ${questionBank[index].options[questionBank[index].answer]}`)
        }
    })
    let percentage = (score / questionBank.length) * 100;
    let grade; let remark;
    if(percentage >= 80 && percentage <= 100){
        grade = 'A';;
        remark = "You sabi! One cold malt for you!😏";
    }else if (percentage >= 60 && percentage < 80){
        grade = 'B';
        remark = "Not bad sha but, shey o like spicy indomie?🤣";
    }else if (percentage < 60){
        grade = 'C';
        remark = "Cynthia Ofore! Go home!!😂";
    }

    quizBox.style.display = 'none';
    resultBox.style.display = 'block';
    resultBox.innerHTML =`
        <p>You Scored ${score}/${questionBank.length} (${percentage.toFixed(2)}%). Grade: ${grade}. ${remark}</p>
        <div class="playAgainBox">
            <button id="playAgainBtn">Play Again</button>
        </div>
    `
    let playAgainBtn = document.getElementById('playAgainBtn');
    playAgainBtn.addEventListener('click', restartQuiz)
}

homePage()