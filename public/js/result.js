const user = JSON.parse(sessionStorage.getItem('user'));
if(!user){
    window.location.href = 'index.html';
}

document.querySelector('.user-name').innerHTML = user.username;
document.querySelector('.user-age').innerHTML = user.age;
const mainBox = document.querySelector('.main-box');

const userResult = JSON.parse(sessionStorage.getItem('results'));

async function fetchQuestions(){
    try{
        const res = await fetch(`http://localhost:8080/testData`);
        const data = await res.json();
        return data.testData;
    } catch(err) {
        console.log(err);
    }
}

async function verifyAns(quesId, answer){
    try{
        const res = await fetch('http://localhost:8080/verify',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "queId": quesId,
                "ans": answer
            })
        });
        const data = await res.json();
        return data.isCorrect;
    } catch(err) {
        console.log(err);
    }
}
async function allAnswers(){
    try{
        const res = await fetch(`http://localhost:8080/allAnswers`);
        const data = await res.json();
        return data.answers;
    } catch(err) {
        console.log(err);
    }
}

function showQuestion(question, correctAnswer, userAnswer) {
    const div = document.createElement('div');
    div.classList.add('question');
    div.setAttribute('id', `quest-${question.id}`);

    const optionHTML = question.options.map((opt, idx) => {
        let iconClass = 'fa-regular fa-circle';
        let style = '';

        if (opt === correctAnswer) {
            style = 'color:rgb(103, 236, 134);';
            if (opt === userAnswer) {
                iconClass = 'fa-solid fa-circle-check';
            } else {
                iconClass = 'fa-regular fa-circle-check';
            }
        } else if (opt === userAnswer) {
            style = 'color:rgb(228, 63, 77);';
            iconClass = 'fa-solid fa-circle-xmark';
        }

        return `
            <label for="${String.fromCharCode(65 + idx)}-${question.id}" style="${style}">
                <i class="${iconClass}"></i> ${opt}
            </label>`;
    }).join('');

    div.innerHTML = `
        <p id="${question.id}" class="que">Que ${question.id}: ${question.que}</p>
        <div class="options">
            ${optionHTML}
        </div>
    `;
    mainBox.appendChild(div);
}


// function showQuestion(question, correctAnswer, userAnswer) {
//     const div = document.createElement('div');
//     div.classList.add('question');
//     div.setAttribute('id', `quest-${question.id}`);
//     div.innerHTML = `
//         <p id="${question.id}" class="que">Que ${question.id}: ${question.que}</p>
//         <div class="options">
//             <label for="A-${question.id}"><i class="fa-regular fa-circle"></i> ${question.options[0]}</label>
//             <label for="B-${question.id}"><i class="fa-regular fa-circle"></i> ${question.options[1]}</label>
//             <label for="C-${question.id}"><i class="fa-regular fa-circle"></i> ${question.options[2]}</label>
//             <label for="D-${question.id}"><i class="fa-regular fa-circle"></i> ${question.options[3]}</label>
//         </div>
//     `;
//     mainBox.appendChild(div);
// }

let results = [];
let marks = 0;
const total = userResult.length;
document.addEventListener('DOMContentLoaded', async () => {
    for(let i=0; i<userResult.length; i++){
        let obj = {
            id: userResult[i].id,
            isCorrect: await verifyAns(userResult[i].id, userResult[i].answer)
        }
        results.push(obj);
        if(obj.isCorrect === true){
            marks++;
        }
    }
    console.log(`${marks}/${total}`);
    document.querySelector('.marks').innerText = `${marks} / ${total}`;

    const questions = await fetchQuestions();
    const correctAnswers = await allAnswers();
    
    for(let i=0; i<questions.length; i++){
        showQuestion(questions[i],correctAnswers[i].ans, userResult[i].answer);
    }
})