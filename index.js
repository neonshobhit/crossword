const div = document.getElementById("starter");

localStorage.setItem("ans", "R29saSBiZXRhIG1hc3RpIG5haGk=");
let totalSuccess = 0, totalQuestions = 0;
const dburl = "https://ojgpfyvzsainptwajlci.supabase.co/rest/v1/"
const header = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3BmeXZ6c2FpbnB0d2FqbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4MjcxMzAsImV4cCI6MTk3MzQwMzEzMH0.-8ipKols5RVwoxi_g5rxY5Z4tWHC4wDZIaSvjtGfw-g",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3BmeXZ6c2FpbnB0d2FqbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4MjcxMzAsImV4cCI6MTk3MzQwMzEzMH0.-8ipKols5RVwoxi_g5rxY5Z4tWHC4wDZIaSvjtGfw-g"
}
const slackUrl = 'https://ojgpfyvzsainptwajlci.functions.supabase.co/slackmsg', slackAuth = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3BmeXZ6c2FpbnB0d2FqbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4MjcxMzAsImV4cCI6MTk3MzQwMzEzMH0.-8ipKols5RVwoxi_g5rxY5Z4tWHC4wDZIaSvjtGfw-g'
function jsonToForm(json) {
var formBody = [];
for (var property in json) {
  var encodedKey = encodeURIComponent(property);
  var encodedValue = encodeURIComponent(json[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");
return formBody
}

fetch(slackUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': slackAuth
  },
  body: JSON.stringify({
    "msg": "dsnclksndflksdsd",
  })
}).then(async e => {
console.log(await e.json())
}).catch(console.log)

async function login () {
  const inp = document.getElementById("loginText")
  if (inp.value.toUpperCase() === "SHOBHIT") {
    
    const resp = await fetch(dburl+'cards?select=*&type=eq.LOGIN&status=eq.OPEN&refId=eq.1', {
      method: 'GET',
      headers: header
    })

    const ress = await resp.json()
    let res = {}
    if (ress.length > 0) {
      res = ress[0]
      await fetch(dburl+'cards?id=eq.'+res.id, {
        method: 'PATCH',
        headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
        body: JSON.stringify({...res, status: 'AVAILED'})
      })

      let msg = '*Successfully logged in!*\n Here is your gift card!:tada:\n' + '*' +res.num + '*/*' + res.pin + '*'
        await fetch(slackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': slackAuth
          },
          body: JSON.stringify({
            "msg": msg,
          })
    }).then(async e => {
      console.log(await e.json())
    }).catch(console.log)

    }

    await fetch(dburl+'configs?key=eq.state', {
      method: 'PATCH',
      headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
      body: JSON.stringify({value: 'CROSSWORD'})
    })

    document.getElementById("login").style.display = "none"
    document.getElementById("mainFrame").removeAttribute("style")
  } else {
    inp.value = ""
  }

}

for (let i = 0; i < 13; ++i) {
  for (let j = 0; j < 13; ++j) {
    div.innerHTML += `<input style="background-color:black;" type="text" class="inputbox" id="i${
      i + 1
    }j${j + 1}" maxlength="1"onkeyup="checkSuccess(event, ${[
      i + 1,
      j + 1,
    ]})" autocomplete="off"></input>`;
  }
  div.innerHTML += "<br>";
}

const direction = {
  1: "TOP_DOWN",
  2: "RIGHT_LEFT",
  3: "BOTTOM_UP",
};
let questions = {};
const xAxis = {};
const yAxis = {};

const finalColor = async () => {
  let toHighlight = [[[4,7], [10,7]], [[7,3], [7,7]], [[9,6], [9,9]], [[4,8], [6,8]]]
  for (let i=0; i<toHighlight.length; ++i) {
    const [start, end] = toHighlight[i]
    for (let j=start[0]; j<=end[0]; ++j) {
      for (let k=start[1]; k<=end[1]; ++k) {
        document.getElementById(`i${j}j${k}`).style.backgroundColor = "green"
      }
    }
  }

  document.getElementById('submit').style.removeProperty('display')
  // PASSWORD
  await fetch(dburl+'configs?key=eq.state', {
    method: 'PATCH',
    headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
    body: JSON.stringify({value: 'PASSWORD'})
  })
}

const success = async (questions, i) => {
  const question = questions[i]
  const [start, end] = question.loc;
  // console.log(start);
  if (question.type === 2) {
    for (let i = 0; i < question.length; ++i) {
      const el = document.getElementById(`i${start[0]}j${start[1] + i}`);
      el.setAttribute("disabled", "true");
      question.color = "blue";
      el.style.backgroundColor = "blue";
    }
  } else if (question.type === 1) {
    for (let i = 0; i < question.length; ++i) {
      const el = document.getElementById(`i${start[0] + i}j${start[1]}`);
      el.setAttribute("disabled", "true");
      question.color = "blue";
      el.style.backgroundColor = "blue";
    }
  } else if (question.type === 3) {
    for (let i = 0; i < question.length; ++i) {
      const el = document.getElementById(`i${end[0] + i}j${end[1]}`);
      el.setAttribute("disabled", "true");
      el.style.backgroundColor = "blue";
      question.color = "blue";
    }
  }

  // console.log(i)
  document.getElementById('ques'+i).style.color = "blue"
  console.log(totalQuestions, totalSuccess)
  if (++totalSuccess === totalQuestions) {
    finalColor()
  };
  for (let z in questions) {
        await fetch(dburl+'questions?id=eq.'+questions[z].id, {
      method: 'PATCH',
      headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
      body: JSON.stringify(questions[z])
    })
  }
  if (!question.solved) {
    question.solved = true
    // todo: uncomment
    await fetch(dburl+'questions?id=eq.'+question.id, {
      method: 'PATCH',
      headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
      body: JSON.stringify(question)
    })
    const resp = await fetch(dburl+'cards?select=*&type=eq.QUESTION&status=eq.OPEN&refId=eq.'+ question.qId, {
      method: 'GET',
      headers: header
    })

    const ress = await resp.json()
    let res = {}
    if (ress.length > 0) {
      res = ress[0]
      console.log(res)
      await fetch(dburl+'cards?id=eq.'+res.id, {
        method: 'PATCH',
        headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
        body: JSON.stringify({...res, status: 'AVAILED'})
      })
    }
    else {
      res = {
        amount: 0,
        num: 'Better Luck Next time',
        pin: ':middle_finger:'
      }
    }

    let msg = 'Answered question:\n*' + question.ques + '*\nwith answer:\n*' + question.ans + '*\n Here is your gift card of Rs. ' + res.amount + '!:tada:\n*'
      + res.num + "*/*" + res.pin + '*'
      await fetch(slackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': slackAuth
        },
        body: {
          "msg": msg,
        }
      })

  }
};
const highlightOnHover = (questionId, bool) => {
  const question = questions[questionId];
  
  // console.log("Success");
  const [start, end] = question.loc;
  // console.log(start);
  const color = bool ? "yellow" : question.color;
  if (question.type === 2) {
    for (let i = 0; i < question.length; ++i) {
      const el = document.getElementById(`i${start[0]}j${start[1] + i}`);
      const isDisabled = el.getAttribute("disabled");
      el.style.backgroundColor = isDisabled && !bool ? "blue" : color;
    }
  } else if (question.type === 1) {
    for (let i = 0; i < question.length; ++i) {
      const el = document.getElementById(`i${start[0] + i}j${start[1]}`);
      const isDisabled = el.getAttribute("disabled");
      el.style.backgroundColor = isDisabled && !bool ? "blue" : color;
    }
  } else if (question.type === 3) {
    for (let i = 0; i < question.length; ++i) {
      const el = document.getElementById(`i${end[0] + i}j${end[1]}`);
      const isDisabled = el.getAttribute("disabled");
      el.style.backgroundColor = isDisabled && !bool ? "blue" : color;
    }
  }
};
const shiftFocus = (i, j, code) => {
  if (code === 37) {
    if (j !== 1) document.getElementById(`i${i}j${--j}`).focus();
  } else if (code === 38) {
    if (i !== 1) document.getElementById(`i${--i}j${j}`).focus();
  } else if (code === 39) {
    if (j !== 13) document.getElementById(`i${i}j${++j}`).focus();
  } else if (code === 40) {
    if (i !== 13) document.getElementById(`i${++i}j${j}`).focus();
  }
};
function isLetter(str) {
  try {
    return str.length === 1 && str.match(/[a-z]/i);
  } catch (e) {
    return false;
  }
}
const checkSuccess = (event, ...loc) => {
  let [i, j] = loc;
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    return shiftFocus(i, j, event.keyCode);
  }
  if (!isLetter(event.key)) return;
  // console.log(event.code)

  let possibleQuesIdsXAxis = xAxis[i];
  let possibleQuesIdsYAxis = yAxis[j];

  let possibleQues = [];
  for (let l in possibleQuesIdsXAxis) {
    if (possibleQuesIdsYAxis[l]) possibleQues.push(l);
  }

  for (let l of possibleQues) {
    // console.log(l)
    const loc = questions[l].loc;
    const val = document.getElementById(`i${i}j${j}`).value.toUpperCase();
    if (questions[l].type === 2) {
      // console.log(j, i)
      if (j >= loc[0][1] && j <= loc[1][1]) {
        // console.log(val+'a')
        // console.log(loc[0][1] + j - 2)
        const ind = j - loc[0][1];
        // console.log(ind)
        let enteredString = questions[l].entered;
        questions[l].entered =
          enteredString.substring(0, ind) +
          val +
          enteredString.substring(ind + 1);
        // console.log(questions[l]);
      }
    } else if (questions[l].type === 1) {
      if (i >= loc[0][0] && i <= loc[1][0]) {
        // console.log(val+'a')
        // console.log(loc[0][1] + j - 2)
        const ind = i - loc[0][0];
        // console.log(ind)
        let enteredString = questions[l].entered;
        questions[l].entered =
          enteredString.substring(0, ind) +
          val +
          enteredString.substring(ind + 1);
        // console.log(questions[l]);
      }
    } else if (questions[l].type === 3) {
      if (i >= loc[1][0] && i <= loc[0][0]) {
        // console.log(val+'a')
        // console.log(loc[0][1] + j - 2)
        const ind = loc[1][0] - i + questions[l].length - 1;
        let enteredString = questions[l].entered;
        questions[l].entered =
          enteredString.substring(0, ind) +
          val +
          enteredString.substring(ind + 1);
        // console.log(questions[l]);
      }
    }

    if (questions[l].entered === questions[l].ans) {
      success(questions, l);
    }
  }
};
const run = async () => {
  // totalQuestions
  const confQStream = await fetch(dburl+'configs?select=*&key=eq.totalQuestions', {
    method: 'GET',
    headers: header
  })
  const confQArr = await confQStream.json()
  if (confQArr.length === 0) return;
  totalQuestions = +confQArr[0].value

  const confStream = await fetch(dburl+'configs?select=*&key=eq.state', {
    method: 'GET',
    headers: header
  })
  const confArr = await confStream.json()
  if (confArr.length === 0) return;
  const state = confArr[0].value
  if (state === 'CROSSWORD' || state === 'PASSWORD') {
    document.getElementById("mainFrame").removeAttribute("style")
    document.getElementById("login").style.display = "none"
  } else if (state === 'CARDS' || state === 'DONE') {
    return alert("Ho gya idhar!")
  }

  const date = 25 // new Date().getDate()
  const resp = await fetch(dburl+'questions?select=*&date=lt.'+date, {
    method: 'GET',
    headers: header
  })
  const questionsArr = await resp.json()
  for (let i=0; i<questionsArr.length; ++i) {
    questions[questionsArr[i].qId] = questionsArr[i]
  }

  const strings = {};

  for (let i in questions) {
    // ++totalQuestions;
    const ques = questions[i];
    const [start, _] = ques.loc;

    if (strings[`i${start[0]}j${start[1]}`]) {
      strings[`i${start[0]}j${start[1]}`].push({ ...ques, id: i });
    } else {
      strings[`i${start[0]}j${start[1]}`] = [{ ...ques, id: i }];
    }
  }


  for (let x in strings) {
    let [i, j] = x.substring(1).split("j");
    i = +i;
    j = +j;
    const ob = strings[x];
    // console.log(x, ob);
    // console.log(i, j);
    for (let z in ob) {
      let obj = ob[z];
      let a = i,
        b = j,
        element = document.getElementById(`i${a}j${b}`);
      // console.log(obj);
      // console.log(element);
      if (element.value === " ") {
        // console.log("insde");
        element.value = "";
      }
      if (obj.id == 5) {
        // console.log("OBJ3", obj);
      }
      if (a == 6 && b == 3) {
        // console.log("OBJ", obj);
        // console.log("OBJ2", element);
      }
      // console.log(document.getElementById(`i${a}j${b}`))
      const placeholder = element.getAttribute("placeholder");
      if (!placeholder) {
        element.setAttribute("placeholder", obj.id + "");
      } else {
        element.setAttribute("placeholder", placeholder + "," + obj.id);
      }
      if (obj.type === 2) {
        let ind = 0;
        // console.log("pndskcn")
        // console.log(obj)
        for (; ind < obj.length; ++b, ++ind) {
          const el = document.getElementById(`i${a}j${b}`);
          // console.log(el.value.length);
          // console.log(a, b, obj.color);
          el.style.backgroundColor = obj.color;
          if (obj.entered[ind] === " " && el.value === " ") {
            el.value = "";
          } else {
            el.value = obj.entered[ind] === " " ? el.value : obj.entered[ind];
          }
        }
      } else if (obj.type === 1) {
        let ind = 0;
        for (; ind < obj.length; ++a, ++ind) {
          // console.log(obj, a, b)
          const el = document.getElementById(`i${a}j${b}`);
          // console.log(el.value.length);
          // console.log(a, b, obj.color);
          el.style.backgroundColor = obj.color;
          if (obj.entered[ind] === " ") obj.entered[ind] = "";
          if (obj.entered[ind] === " " && el.value === " ") {
            el.value = "";
          } else {
            el.value = obj.entered[ind] === " " ? el.value : obj.entered[ind];
          }
          // document.getElementById(`i${a}j${b}`).value = obj.entered[ind++];
        }
      } else if (obj.type === 3) {
        let ind = 0;
        for (; ind < obj.length; --a, ++ind) {
          const el = document.getElementById(`i${a}j${b}`);
          // console.log(el.value.length, el.value);
          // console.log(a, b, obj.color);
          el.style.backgroundColor = obj.color;
          if (obj.entered[ind] === " ") obj.entered[ind] = "";
          if (obj.entered[ind] === " " && el.value === " ") {
            el.value = "";
          } else {
            el.value = obj.entered[ind] === " " ? el.value : obj.entered[ind];
          }
        }
      }
    }
  }


  for (let x in strings) {
    let [i, j] = x.substring(1).split("j");
    i = +i;
    j = +j;
    const ob = strings[x];
    for (let z in ob) {
      let obj = ob[z];
      let a = i,
        b = j;

      if (obj.type === 2) {
        let ind = 0;
        for (; ind++ < obj.length; ++b) {
          // console.log(b)
          yAxis[b] = { ...yAxis[b] };
          yAxis[b][obj.id] = true;
          // if (yAxis[b]) yAxis[b].push(obj.id);
          // else yAxis[b] = [obj.id];
        }
        xAxis[a] = { ...xAxis[a] };
        xAxis[a][obj.id] = true;
        // if (xAxis[a]) xAxis[a].push(obj.id);
        // else xAxis[a] = [obj.id];
      } else if (obj.type === 1) {
        let ind = 0;
        for (; ind++ < obj.length; ++a) {
          // console.log(b)
          xAxis[a] = { ...xAxis[a] };
          xAxis[a][obj.id] = true;
          // if (xAxis[a]) xAxis[a].push(obj.id);
          // else xAxis[a] = [obj.id];
        }
        yAxis[b] = { ...yAxis[b] };
        yAxis[b][obj.id] = true;
        // if (yAxis[b]) yAxis[b].push(obj.id);
        // else yAxis[b] = [obj.id];
      } else if (obj.type === 3) {
        let ind = 0;
        for (; ind++ < obj.length; --a) {
          // console.log(b)
          // if (xAxis[a]) xAxis[a].push(obj.id);
          // else xAxis[a] = [obj.id];
          xAxis[a] = { ...xAxis[a] };
          xAxis[a][obj.id] = true;
        }
        yAxis[b] = { ...yAxis[b] };
        yAxis[b][obj.id] = true;
        // if (yAxis[b]) yAxis[b].push(obj.id);
        // else yAxis[b] = [obj.id];
      }
    }
  }

  
  for (let i in questions) {
    const ques = questions[i];
    // console.log(i)
    const html = `<h4 style="margin:3px;" id="ques${i}" onmouseover="highlightOnHover(${i}, ${true})" onmouseout="highlightOnHover(${i}, ${false})">${i} ${
      ques.ques
    }</h4>`;
    document
    .getElementById(direction[ques.type])
    .insertAdjacentHTML("beforebegin", html);
  }
  
  for (let i in questions) {
    const ques = questions[i];
    if (ques.entered === ques.ans) {
      success(questions, i);
    }
  }
};

run();
