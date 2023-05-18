import { GET } from "./api.js";

const cE = (type) => document.createElement(type);
const qS = (element) => document.querySelector(element);

const bodyEl = document.body;
const wrapperEl = cE('div');
wrapperEl.className = "wrapperEl";

const welcomeScreeEl = cE ('div');
welcomeScreeEl.className = 'welcome-screen';
welcomeScreeEl.textContent = 'Manage your appointments easily';
bodyEl.appendChild(welcomeScreeEl);

welcomeScreeEl.style.opacity = 0;
welcomeScreeEl.style.transition = 'opacity 1s ease-in-out';
setTimeout(() => {
  welcomeScreeEl.style.opacity = 1;
}, 100);

setTimeout(() => {
  welcomeScreeEl.style.opacity = 0;
  setTimeout(() => {
    bodyEl.removeChild(welcomeScreeEl);
  }, 1000);
}, 3000);

const dateEl = cE('div');
dateEl.className = "date";
wrapperEl.appendChild(dateEl);

setInterval(() => {
  const currentDate = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const dateString = currentDate.toLocaleDateString( 'en-US', options); 
  dateEl.textContent = `Today's ${dateString}`;
}, 1000);

const highPriorityEl = cE('div');
highPriorityEl.className = "high-priority";
const highPriorityTitleEl = cE('h2');
highPriorityTitleEl.className = "highPriorityName";
highPriorityTitleEl.textContent = "Appuntamenti ad alta priorità";
const highPriorityCardEl = cE('div');
highPriorityCardEl.className= "highPriorityCard";
highPriorityEl.append(highPriorityTitleEl, highPriorityCardEl);
highPriorityEl.style.display = 'block';
wrapperEl.appendChild(highPriorityEl);

const importantEl = cE('div');
importantEl.className = "important";
const importantTitleEl = cE('h2');
importantTitleEl.className = "importantName";
importantTitleEl.textContent = "Appuntamenti importanti";
const importantCardEl = cE('div');
importantCardEl.className = "importantCard";
importantEl.append(importantTitleEl, importantCardEl);
importantEl.style.display = 'block';
wrapperEl.appendChild(importantEl);

const lowPriorityEl = cE('div');
lowPriorityEl.className = "low-priority";
const lowPriorityTitleEl = cE('h2');
lowPriorityTitleEl.className = "lowPriorityName";
lowPriorityTitleEl.textContent = "Appuntamenti a bassa priorità";
const lowPriorityCardEl = cE('div');
lowPriorityCardEl.className = "lowPriorityCard";
lowPriorityEl.append(lowPriorityTitleEl, lowPriorityCardEl);
lowPriorityEl.style.display = 'block';
wrapperEl.appendChild(lowPriorityEl);

const priorityFilterEl = qS('#priorityFilter');
priorityFilterEl.addEventListener('change', (e) => {
  const selectedPriority = e.target.value;
  filterAppointments(selectedPriority);

  btnEl.textContent = "Mostra completati";
  const completedCards = document.querySelectorAll(".card_completed");
  completedCards.forEach((card) => {
    card.style.display = "none";
  });

});

function filterAppointments(selectedPriority) {
  const allAppointments = wrapperEl.querySelectorAll('.card');

  allAppointments.forEach((appointment) => {
    appointment.style.display = 'none';
  });

  let filterAppointments;

  if (selectedPriority === 'high') {
    filterAppointments = wrapperEl.querySelectorAll('.high-priority .card');
    highPriorityEl.style.display='block';
    importantEl.style.display = 'none';
    lowPriorityEl.style.display = 'none';
  } else if (selectedPriority === 'important') {
    filterAppointments = wrapperEl.querySelectorAll('.important .card');
    highPriorityEl.style.display='none';
    importantEl.style.display = 'block';
    lowPriorityEl.style.display = 'none';
  } else if (selectedPriority === 'low') {
    filterAppointments = wrapperEl.querySelectorAll('.low-priority .card');
    highPriorityEl.style.display='none';
    importantEl.style.display = 'none';
    lowPriorityEl.style.display = 'block';
  } else {
    filterAppointments = allAppointments;
    highPriorityEl.style.display='block';
    importantEl.style.display = 'block';
    lowPriorityEl.style.display = 'block';
  }

  filterAppointments.forEach((appointment) => {
    appointment.style.display = 'block';
  });
  };

const headerEl = qS('header');
const btnEl = cE('button');
btnEl.className = "completed_button";
btnEl.textContent = "Mostra completati";
headerEl.appendChild(btnEl);


const cardEl = (data) => {
    const cardBoxEl = cE('div');
    const cardTitleEl = cE('h3');
    const cardStatusEl = cE('p');
    const priorityEl = cE('p');
    const deleteBtnEl = cE('button');

    cardBoxEl.className = "card";
    cardTitleEl.className = "title";
    cardStatusEl.className = "status";
    priorityEl.className = "priority";
    deleteBtnEl.className = "deleteBtn";

    const maxTitleLength = 45;

    const cuttedTitle = data.title.length > maxTitleLength
    ? data.title.substring(0, maxTitleLength) + '...'
    : data.title;

    cardTitleEl.textContent = cuttedTitle.charAt(0).toUpperCase() + cuttedTitle.slice(1);
    cardStatusEl.textContent = "Completed: " + data.completed;
    priorityEl.textContent = "Priority: " + data.priority;
    deleteBtnEl.textContent = "done";

    if (data.completed === true) {
        cardBoxEl.classList.add("card_completed");
    }

    cardBoxEl.classList.add("priority-" +data.priority);

    deleteBtnEl.addEventListener("click", () => {
      deleteCard(cardBoxEl);
    });

    cardBoxEl.append(cardTitleEl, cardStatusEl, priorityEl, deleteBtnEl);

    return cardBoxEl;
};

GET("todos")
  .then((data) => {
    data = data.map((item) => ({
      ...item,
      priority: Math.floor(Math.random() * 6),
    }));

    return data;
  })
  .then((data) => {
    data.reverse().map((item) => {
      if (item.priority >=4) {
        highPriorityCardEl.appendChild(cardEl(item));
      } else if (item.priority >=2 && item.priority <= 3) {
        importantCardEl.appendChild(cardEl(item));
      } else {
        lowPriorityCardEl.appendChild(cardEl(item));
      };
    });
  });
btnEl.addEventListener("click", () => {
  const highPriorityCompletedCards = highPriorityCardEl.querySelectorAll(".card_completed");
  const importantCompletedCards = importantCardEl.querySelectorAll(".card_completed");
  const lowPriorityCompletedCards = lowPriorityCardEl.querySelectorAll(".card_completed");

  if (btnEl.textContent === "Mostra completati") {
    btnEl.textContent = "Mostra tutti";

    highPriorityCompletedCards.forEach((card) => {
      card.style.display = "block";
    });

    importantCompletedCards.forEach((card) => {
      card.style.display = "block";
    });

    lowPriorityCompletedCards.forEach((card) => {
      card.style.display = "block";
    });
  } else {
    btnEl.textContent = "Mostra completati";

    highPriorityCompletedCards.forEach((card) => {
      card.style.display = "none";
    });

    importantCompletedCards.forEach((card) => {
      card.style.display = "none";
    });

    lowPriorityCompletedCards.forEach((card) => {
      card.style.display = "none";
    });
  }
});

  

  const deleteCard = (cardEl) => {
    cardEl.remove();
  };
bodyEl.appendChild(wrapperEl);

console.log('00000', highPriorityEl);