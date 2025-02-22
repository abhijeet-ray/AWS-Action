document.addEventListener("DOMContentLoaded", function() {
  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark");
      darkModeToggle.textContent = "Light Mode";
    }
    darkModeToggle.addEventListener("click", function() {
      document.body.classList.toggle("dark");
      if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "Light Mode";
      } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "Dark Mode";
      }
    });
  }

  // Schedule form on home page
  const scheduleForm = document.getElementById("scheduleForm");
  if (scheduleForm) {
    scheduleForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const profile = document.getElementById("profile").value;
      const experience = document.getElementById("experience").value;
      window.location.href = `interview.html?profile=${encodeURIComponent(profile)}&experience=${encodeURIComponent(experience)}`;
    });
  }

  // Interview page
  if (document.getElementById("questionBox")) {
    setupInterview();
  }

  // Result page
  if (document.getElementById("finalScore")) {
    displayResults();
  }
});

// Parse URL parameters to get the profile and experience values
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    profile: params.get("profile") || "General",
    experience: params.get("experience") || "Entry"
  };
}

// Async function to fetch a generated interview question from the backend API
async function fetchQuestion() {
  const { profile, experience } = getQueryParams();
  
  try {
    const response = await fetch("http://127.0.0.1:8000/generate-question/", {
      method: "POST",  // Ensure we use POST
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ profile, experience })
    });
    
    if (!response.ok) {
      console.error("HTTP error: " + response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.question;
  } catch (error) {
    console.error("Error fetching question:", error);
    return "Sorry, we couldn't generate a question at this time.";
  }
}

// Function to set up the interview flow, fetching and displaying questions
function setupInterview() {
  const videoPreview = document.getElementById("videoPreview");
  const questionBox = document.getElementById("questionBox");
  const nextQuestionBtn = document.getElementById("nextQuestion");
  const endInterviewBtn = document.getElementById("endInterview");

  let mediaStream;

  // Access user's media devices (video/audio)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(function(stream) {
        mediaStream = stream;
        videoPreview.srcObject = stream;
      })
      .catch(function(err) {
        console.error("Error accessing media devices:", err);
      });
  }

  // Update the question on the page
  async function updateQuestion() {
    const question = await fetchQuestion();
    questionBox.textContent = question;
    speakText(question);
  }

  // Use Web Speech API to speak the question aloud
  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }

  // Event listener for "Next Question" button
  nextQuestionBtn.addEventListener("click", async function() {
    await updateQuestion();
  });

  // Event listener for "End Interview" button
  endInterviewBtn.addEventListener("click", function() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    const score = Math.floor(Math.random() * 100);
    window.location.href = `result.html?score=${score}`;
  });

  // Load the first question when the page loads
  updateQuestion();
}

// Run the setup when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("questionBox")) {
    setupInterview();
  }
});


// Display results on the result page
function displayResults() {
  const params = new URLSearchParams(window.location.search);
  const score = params.get("score") || "N/A";
  document.getElementById("finalScore").textContent = `Your Score: ${score}%`;
  document.getElementById("feedbackMessage").textContent = "Great job on completing the interview! Here's a breakdown of your performance.";
  document.getElementById("strengths").textContent = "Excellent communication and strong analytical skills.";
  document.getElementById("improvements").textContent = "Enhance technical depth and clarity in explanations.";
  document.getElementById("homeButton").addEventListener("click", function() {
    window.location.href = "index.html";
  });
}



// // script.js

// document.addEventListener("DOMContentLoaded", function() {
//   // Step 1: Handle form submission on index.html
//   const form = document.getElementById("scheduleForm");
//   if (form) {
//       form.addEventListener("submit", function(e) {
//           e.preventDefault();
//           const profile = document.getElementById("profile").value;
//           const experience = document.getElementById("experience").value;
//           window.location.href = `interview.html?profile=${encodeURIComponent(profile)}&experience=${encodeURIComponent(experience)}`;
//       });
//   }

//   // Step 2: If on the interview page, start the interview
//   if (window.location.pathname.includes("interview.html")) {
//       setupInterview();
//   }
// });

// // Step 3: Fetch interview question from the backend
// async function fetchQuestion(profile, experience) {
//   try {
//       const response = await fetch("http://localhost:5000/api/generate-question", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ profile, experience })
//       });
//       const data = await response.json();
//       return data.question;
//   } catch (error) {
//       console.error("Error fetching question:", error);
//       return "Error loading question.";
//   }
// }

// // Step 4: Evaluate answer via backend API
// async function evaluateAnswer(answer) {
//   try {
//       const response = await fetch("http://localhost:5000/api/evaluate-answer", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ answer })
//       });
//       const data = await response.json();
//       return data; // { score, feedback }
//   } catch (error) {
//       console.error("Error evaluating answer:", error);
//       return { score: 0, feedback: "Evaluation error." };
//   }
// }

// // Step 5: Setup Interview Page Functionality
// async function setupInterview() {
//   const videoPreview = document.getElementById("videoPreview");
//   const questionBox = document.getElementById("questionBox");
//   const nextQuestionBtn = document.getElementById("nextQuestion");
//   const endInterviewBtn = document.getElementById("endInterview");
//   const aiAvatar = document.getElementById("aiAvatar");

//   // Get profile and experience from URL parameters
//   const urlParams = new URLSearchParams(window.location.search);
//   const profile = urlParams.get("profile") || "DevOps";
//   const experience = urlParams.get("experience") || "Entry";

//   // Set up media (camera & mic)
//   let mediaStream;
//   try {
//       mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       videoPreview.srcObject = mediaStream;
//   } catch (error) {
//       console.error("Error accessing media devices:", error);
//   }

//   // AI Voice Output Function
//   function speakText(text) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.volume = 1;
//       utterance.pitch = 1.2;
//       utterance.rate = 1;
//       speechSynthesis.speak(utterance);

//       // Make AI avatar "speak"
//       aiAvatar.src = "assets/ai-speaking.gif"; 
//       setTimeout(() => aiAvatar.src = "assets/ai-avatar.png", 3000);
//   }

//   let currentQuestion = "";

//   // Function to display a fetched question
//   async function displayQuestion() {
//       currentQuestion = await fetchQuestion(profile, experience);
//       questionBox.textContent = currentQuestion;
//       speakText(currentQuestion);
//   }

//   // Next Question Button Click - Fetch a New Question
//   nextQuestionBtn.addEventListener("click", async function() {
//       await displayQuestion();
//   });

//   // End Interview Button Click - Evaluate the Answer
//   endInterviewBtn.addEventListener("click", async function() {
//       if (mediaStream) {
//           mediaStream.getTracks().forEach(track => track.stop());
//       }
//       const userAnswer = "User's answer placeholder";  // Replace this with actual user input
//       const evaluation = await evaluateAnswer(userAnswer);
//       window.location.href = `results.html?score=${evaluation.score}&feedback=${encodeURIComponent(evaluation.feedback)}`;
//   });

//   // Start interview with the first question
//   await displayQuestion();
// }









// // script.js

// document.addEventListener("DOMContentLoaded", function() {
//   // Check if we're on the landing page (index.html) with the schedule form
//   const form = document.getElementById("scheduleForm");
//   if (form) {
//     form.addEventListener("submit", function(e) {
//       e.preventDefault(); // Prevent default form submission
//       const profile = document.getElementById("profile").value;
//       const experience = document.getElementById("experience").value;
//       // Redirect to interview page with URL parameters
//       window.location.href = `interview.html?profile=${encodeURIComponent(profile)}&experience=${encodeURIComponent(experience)}`;
//     });
//   }

//   // If on the interview page, set up the interview flow
//   if (window.location.pathname.includes("interview.html")) {
//     setupInterview();
//   }
// });

// // Function to fetch a dynamic question from the backend API
// async function fetchQuestion(profile, experience) {
//   try {
//     const response = await fetch("http://localhost:5000/api/generate-question", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ profile, experience })
//     });
//     const data = await response.json();
//     return data.question;
//   } catch (error) {
//     console.error("Error fetching question:", error);
//     return "Error loading question.";
//   }
// }

// // Function to evaluate the answer via backend API (dummy implementation)
// async function evaluateAnswer(answer) {
//   try {
//     const response = await fetch("http://localhost:5000/api/evaluate-answer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ answer })
//     });
//     const data = await response.json();
//     return data; // Expected data: { score, feedback }
//   } catch (error) {
//     console.error("Error evaluating answer:", error);
//     return { score: 0, feedback: "Evaluation error." };
//   }
// }

// // Interview setup function connecting media, dynamic questions, and API calls
// async function setupInterview() {
//   const videoPreview = document.getElementById("videoPreview");
//   const questionBox = document.getElementById("questionBox");
//   const nextQuestionBtn = document.getElementById("nextQuestion");
//   const endInterviewBtn = document.getElementById("endInterview");

//   // Get profile and experience from URL parameters
//   const urlParams = new URLSearchParams(window.location.search);
//   const profile = urlParams.get("profile") || "DevOps";
//   const experience = urlParams.get("experience") || "Entry";

//   // Set up the camera and microphone
//   let mediaStream;
//   try {
//     mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     videoPreview.srcObject = mediaStream;
//   } catch (error) {
//     console.error("Error accessing media devices:", error);
//   }

//   // Function to use Speech Synthesis for question voice-out
//   function speakText(text) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.volume = 1;
//     utterance.pitch = 1.2;
//     utterance.rate = 1;
//     speechSynthesis.speak(utterance);
//   }

//   let currentQuestion = "";
  
//   // Function to display a question fetched from the backend
//   async function displayQuestion() {
//     currentQuestion = await fetchQuestion(profile, experience);
//     questionBox.textContent = currentQuestion;
//     speakText(currentQuestion);
//   }

//   // Button event to fetch a new question (for demonstration, you could call it multiple times)
//   nextQuestionBtn.addEventListener("click", async function() {
//     await displayQuestion();
//   });

//   // When the user finishes the interview, evaluate the answer and end the session
//   endInterviewBtn.addEventListener("click", async function() {
//     if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    
//     // For demonstration, we're sending a dummy answer. Replace this with the actual answer collected.
//     const evaluation = await evaluateAnswer("User's answer placeholder");
//     // Redirect to a results page (results.html) passing the score in the URL
//     window.location.href = `results.html?score=${evaluation.score}`;
//   });

//   // Start the interview by displaying the first question
//   await displayQuestion();
// }




// document.addEventListener("DOMContentLoaded", function() {
//     // Dark Mode Toggle
//     const darkModeToggle = document.getElementById("darkModeToggle");
//     if (darkModeToggle) {
//       if (localStorage.getItem("darkMode") === "enabled") {
//         document.body.classList.add("dark");
//         darkModeToggle.textContent = "Light Mode";
//       }
//       darkModeToggle.addEventListener("click", function() {
//         document.body.classList.toggle("dark");
//         if (document.body.classList.contains("dark")) {
//           localStorage.setItem("darkMode", "enabled");
//           darkModeToggle.textContent = "Light Mode";
//         } else {
//           localStorage.setItem("darkMode", "disabled");
//           darkModeToggle.textContent = "Dark Mode";
//         }
//       });
//     }
  
//     // Schedule form on home page
//     const scheduleForm = document.getElementById("scheduleForm");
//     if (scheduleForm) {
//       scheduleForm.addEventListener("submit", function(e) {
//         e.preventDefault();
//         const profile = document.getElementById("profile").value;
//         const experience = document.getElementById("experience").value;
//         window.location.href = `interview.html?profile=${encodeURIComponent(profile)}&experience=${encodeURIComponent(experience)}`;
//       });
//     }
  
//     // Interview page
//     if (document.getElementById("questionBox")) {
//       setupInterview();
//     }
  
//     // Result page
//     if (document.getElementById("finalScore")) {
//       displayResults();
//     }
//   });
  
//   function setupInterview() {
//     const videoPreview = document.getElementById("videoPreview");
//     const questionBox = document.getElementById("questionBox");
//     const nextQuestionBtn = document.getElementById("nextQuestion");
//     const endInterviewBtn = document.getElementById("endInterview");
  
//     const questions = [
//       "Tell me about a time you resolved a critical system outage.",
//       "How do you approach automating a deployment pipeline?",
//       "What are the key principles of DevOps?"
//     ];
  
//     let currentQuestionIndex = 0;
//     let mediaStream;
  
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then(function(stream) {
//           mediaStream = stream;
//           videoPreview.srcObject = stream;
//         })
//         .catch(function(err) {
//           console.error("Error accessing media devices:", err);
//         });
//     }
  
//     function speakText(text) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.volume = 1;
//       utterance.pitch = 1.2;
//       utterance.rate = 1;
//       speechSynthesis.speak(utterance);
//     }
  
//     function displayQuestion() {
//       if (currentQuestionIndex < questions.length) {
//         const currentQuestion = questions[currentQuestionIndex];
//         questionBox.textContent = currentQuestion;
//         speakText(currentQuestion);
  
//         if (currentQuestionIndex === questions.length - 1) {
//           nextQuestionBtn.classList.add("hidden");
//           endInterviewBtn.classList.remove("hidden");
//         }
//       }
//     }
  
//     nextQuestionBtn.addEventListener("click", function() {
//       currentQuestionIndex++;
//       displayQuestion();
//     });
  
//     endInterviewBtn.addEventListener("click", function() {
//       if (mediaStream) {
//         mediaStream.getTracks().forEach(track => track.stop());
//       }
//       const score = Math.floor(Math.random() * 100);
//       window.location.href = `result.html?score=${score}`;
//     });
  
//     displayQuestion();
//   }
  
//   function displayResults() {
//     const params = new URLSearchParams(window.location.search);
//     const score = params.get("score") || "N/A";
//     document.getElementById("finalScore").textContent = `Your Score: ${score}%`;
//     document.getElementById("feedbackMessage").textContent = "Great job on completing the interview! Here's a breakdown of your performance.";
//     document.getElementById("strengths").textContent = "Excellent communication and strong analytical skills.";
//     document.getElementById("improvements").textContent = "Enhance technical depth and clarity in explanations.";
    
//     document.getElementById("homeButton").addEventListener("click", function() {
//       window.location.href = "index.html";
//     });
//   }
  

