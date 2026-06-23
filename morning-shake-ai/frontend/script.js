const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const loadingIndicator = document.getElementById("loadingIndicator");

async function askAI() {
  const prompt = questionInput.value.trim();

  if (!prompt) {
    aiResponse.textContent = "Please type a protein shake or nutrition question first.";
    questionInput.focus();
    return;
  }

  setLoading(true);
  aiResponse.textContent = "";

  try {
    const response = await fetch("http://localhost:3000/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The AI assistant could not answer right now.");
    }

    aiResponse.textContent = data.answer;
  } catch (error) {
    aiResponse.textContent = `Sorry, something went wrong: ${error.message}`;
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  askButton.disabled = isLoading;
  askButton.textContent = isLoading ? "Asking..." : "Ask AI";
  loadingIndicator.classList.toggle("hidden", !isLoading);
}

askButton.addEventListener("click", askAI);

questionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    askAI();
  }
});
