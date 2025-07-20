const user = JSON.parse(sessionStorage.getItem('user'));
if(!user){
    window.location.href = 'index.html';
}

const results = [];
document.querySelector('.user-name').innerHTML = user.username;
document.querySelector('.user-age').innerHTML = `Age: ${user.age}`;

//------------------ fetch all questions -------------------
async function fetchQuestions(){
    try{
        const res = await fetch(`http://localhost:8080/testData`);
        const data = await res.json();
        return data.testData;
    } catch(err) {
        console.log(err);
    }
}

// ------------------ verify answers ------------------------
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
        console.log(data);
    } catch(err) {
        console.log(err);
    }
}
const testContainer = document.querySelector('.test-container');
const buttonBox = document.querySelector('.buttons');
const que = document.querySelector('.que');

// ---------- create side rado buttons ----------
function createRadioButton(id) {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.id = `que${id}`;
    radioInput.value = id;
    radioInput.name = 'question';

    const label = document.createElement('label');
    label.htmlFor = `que${id}`;
    label.textContent = id;

    label.appendChild(radioInput);
    buttonBox.appendChild(label);
}

function createQuestion(question){
    const div = document.createElement('div');
    div.classList.add('test-que');
    div.setAttribute('id', `question-${question.id}`);
    div.style.display = 'none';
    div.innerHTML = `
        <p id="${question.id}" class="que">Que ${question.id}: ${question.que}</p>
        <div class="options">
            <label for="A-${question.id}"> <input type="radio" id="A-${question.id}" value='${question.options[0]}' name="option"> ${question.options[0]}</label>
            <label for="B-${question.id}"> <input type="radio" id="B-${question.id}" value='${question.options[1]}' name="option"> ${question.options[1]}</label>
            <label for="C-${question.id}"> <input type="radio" id="C-${question.id}" value='${question.options[2]}' name="option"> ${question.options[2]}</label>
            <label for="D-${question.id}"> <input type="radio" id="D-${question.id}" value='${question.options[3]}' name="option"> ${question.options[3]}</label>
        </div>
    `;

    const button = document.createElement('button');
    button.setAttribute('id', 'save-ans');
    button.innerText = 'Save & Next';
    if(document.querySelector('#submit-test')){
        button.disabled = true;
    }
    button.addEventListener('click', async () => {
        try{
            const answers = div.querySelectorAll('input[name="option"]');
            let answer = null;
            for(let i=0; i<answers.length; i++){
                if(answers[i].checked){
                    answer = answers[i].value;
                }
            }
            if(answer === null){
                console.log('Please select one');
                return;
            }
            console.log(answer);
            const result = {id: question.id, answer: answer};
            results.push(result);
            console.log(results);

            const currentRadio = document.getElementById(`que${question.id}`);
            const radios = [...document.querySelectorAll('input[name="question"]')];
            const currentIndex = radios.findIndex(r => r === currentRadio);

            if (currentIndex !== -1 && currentIndex < radios.length - 1) {
                const nextRadio = radios[currentIndex + 1];
                nextRadio.checked = true;
                nextRadio.dispatchEvent(new Event('change'));
            } else {
                const submitBtn = document.createElement('button');
                submitBtn.innerText = 'Submit Test';
                submitBtn.setAttribute('id', 'submit-test');
                submitBtn.addEventListener('click', () => {
                    sessionStorage.setItem('results', JSON.stringify(results));
                    window.location.href = 'result.html';
                });
                if (!document.getElementById('submit-test')) {
                    div.appendChild(submitBtn);
                }
            }
        }
        catch(err){
            console.log(err);
        }
    })

    div.appendChild(button);
    testContainer.appendChild(div);
}

function showQuestions(questions) {
    const radioButtons = document.querySelectorAll('input[name="question"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.test-que').forEach(que => {
                que.style.display = 'none';
            });
            
            const selectedId = e.target.value;
            const questionDiv = document.getElementById(`question-${selectedId}`);
            if (questionDiv) {
                questionDiv.style.display = 'block';
            }
        });
    });
    
    if (questions.length > 0) {
        document.getElementById(`question-${questions[0].id}`).style.display = 'block';
        document.getElementById(`que${questions[0].id}`).checked = true;
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    try {
        const response = await fetchQuestions();
        response.forEach(element => {
            createRadioButton(element.id);
            createQuestion(element);
        });
        showQuestions(response);
    } catch(err) {
        console.log(err);
    }
});