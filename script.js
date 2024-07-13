import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { API_KEY } from "./secret.js";
import * as Components from "./components.js";
import { generatePromptForQuestion } from "./prompt.js";
import { generatePromptForFact } from "./prompt.js";

let questions = [];
let options = [];
let correctAnswers = [];
let currentQuestionIndex = 0;
let score = 0;

let topic;
Components.play.addEventListener("click", function () {
  Components.menu.classList.add("hidden");
  Components.playmenu.classList.remove("hidden");
});

let topicofquiz;

// This funtion is used to get the prompt and seperate question and
// options from it into questions and options vector
async function questionsFromTopic() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = generatePromptForQuestion(topicofquiz);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();

  // Split the response into questions, options, and correct answers
  const [questionsText, optionsText, correctOptionsText] = text
    .split("##")
    .slice(1);

  // Parse questions
  questionsText.split("\n").forEach((line) => {
    const match = line.match(/^\d+\.\s*(.*)$/);
    if (match) {
      questions.push(match[1].trim());
    }
  });

  // Parse options
  optionsText.split("\n").forEach((line) => {
    const match = line.match(/^\d+\.\s*(.*)$/);
    if (match) {
      const opts = match[1].trim().split(/\s{2,}/); // Split by 2 or more spaces
      options.push(opts);
    }
  });

  // Parse correct answers
  correctOptionsText.split("\n").forEach((line) => {
    const match = line.match(/^\d+\.\s*(.*)$/);
    if (match) {
      correctAnswers.push(match[1].trim());
    }
  });
}

function quizStart() {
  // Hide menu and show question box
  Components.playmenu.classList.add("hidden");
  Components.questionbox.classList.remove("hidden");

  // Display the first question and options
  displayQuestion(currentQuestionIndex);
}

function displayQuestion(index) {
  // Display question text
  Components.questionTextElement.textContent = questions[index];

  // Display options
  Components.option1text.textContent = options[index][0];
  Components.option2text.textContent = options[index][1];
  Components.option3text.textContent = options[index][2];
  Components.option4text.textContent = options[index][3];
}

// Initialize selectdButton to an empty string
let selectedOption = "";

// Array to map indices to letters
const letters = ["A", "B", "C", "D"];

Components.optionButtons.forEach((optionButton, index) => {
  optionButton.addEventListener("click", function () {
    // Reset all option buttons background color to default (#324041)
    Components.optionButtons.forEach((btn) => {
      btn.style.backgroundColor = "#324041";
    });

    // Set the background color of the clicked option button to #0f1819
    optionButton.style.backgroundColor = "#0f1819";

    // Update selectdButton to the corresponding letter
    selectedOption = "";
    selectedOption = letters[index];
  });
});

Components.nextButton.addEventListener("click", () => {
  //if any button is selected then check if it is correct and etc
  if (selectedOption.length > 0) {
    if (selectedOption[0] == correctAnswers[currentQuestionIndex][0]) {
      score++;
    } else {
      score--;
    }
    selectedOption = "";
  }
  // Move to the next question
  Components.optionButtons.forEach((btn) => {
    btn.style.backgroundColor = "#324041";
  });

  currentQuestionIndex++;

  // Check if all questions have been answered
  if (currentQuestionIndex < questions.length) {
    // Display the next question
    displayQuestion(currentQuestionIndex);
  } else {
    // Show quiz results when all questions are answered
    showResults();
  }
});

function showResults() {
  // Hide question box and show results or next steps
  Components.questionbox.classList.add("hidden");

  // Display final score or any other results/next steps
  Components.resultElement.classList.remove("hidden");
  Components.resultText.textContent = `You have scored: ${score}/5.`;
}

// Check is topic is entered properly
Components.topicEnterButton.addEventListener("click", async function () {
  topic = Components.topicInput.value;

  if (topic.trim() === "") {
    Components.topicInput.placeholder = "No Topic";
  } else {
    topicofquiz = Components.quizTopic.value;
    await questionsFromTopic();

    Components.playmenu.classList.add("hidden");
    quizStart();
  }
});

// Add event listener to each back button
Components.backButtons.forEach((backButton) => {
  backButton.addEventListener("click", function () {
    location.reload();
  });
});

Components.guide.addEventListener("click", function () {
  Components.menu.classList.add("hidden");
  Components.guidemenu.classList.remove("hidden");
});

Components.shareButton.addEventListener("click", function () {
  Components.sharePopup.classList.remove("hidden");
});

Components.closePopup.addEventListener("click", function () {
  Components.sharePopup.classList.add("hidden");
});

// Copy link in share pop-up
Components.copyLinkButton.addEventListener("click", function () {
  const dummy = document.createElement("input");
  const text = window.location.href;
  document.body.appendChild(dummy);
  navigator.clipboard.writeText(text);
  document.body.removeChild(dummy);
  alert("Copied the link: " + text);
});

// On clicking about me
Components.aboutMe.addEventListener("click", function () {
  if (Components.aboutMeDiv.classList.contains("hidden")) {
    Components.aboutMeDiv.classList.remove("hidden");
    Components.menu.classList.add("hidden");
  } else {
    Components.aboutMeDiv.classList.add("hidden");
  }
});

Components.homeButton.addEventListener("click", function () {
  location.reload();
});

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = generatePromptForFact();
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const funFactBox = document.querySelector(".fun-fact-text");
  funFactBox.innerHTML = text;
}

await run();
