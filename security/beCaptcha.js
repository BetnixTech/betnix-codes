// Prevent tampering by freezing key variables
const freezeProtection = () => {
  Object.freeze(window); // Freeze the window object to prevent tampering
  Object.freeze(document); // Prevent changes to the document object
  // You can add more objects to freeze for additional security
};

// Override console methods to block logging and debugging
const blockConsoleLogs = () => {
  if (typeof console !== "undefined") {
    console.log = function() {};
    console.debug = function() {};
    console.info = function() {};
    console.warn = function() {};
    console.error = function() {};
  }
};

// Prevent window reloading and closing
const blockReloadOrClose = () => {
  window.onbeforeunload = function () {
    return 'You cannot leave this page without completing the CAPTCHA.';
  };
};

// Prevent inspection or tampering via the developer console
const detectDevTools = () => {
  let devToolsOpened = false;

  // Monitor the window size differences caused by DevTools
  setInterval(() => {
    const isDevToolsOpen =
      window.outerWidth - window.innerWidth > 100 ||
      window.outerHeight - window.innerHeight > 100;
    if (isDevToolsOpen && !devToolsOpened) {
      devToolsOpened = true;
      alert('Developer Tools detected! Please close them to continue.');
      window.location.reload(); // Reload the page to prevent further tampering
    }
  }, 1000); // Check every second
};

let lastX = null;
let lastY = null;
let lastTime = null;
let straightMovementThreshold = 200; // Distance in pixels considered as a straight movement
let speedThreshold = 0.5; // Distance per millisecond considered too fast (for speed detection)
let moveCount = 0; // To count unnatural straight movements
let feedbackMessage = document.getElementById('feedback');

// If CAPTCHA is solved, set this flag to true
let captchaSolved = false;

window.onload = () => {
  freezeProtection(); // Prevent tampering with key objects
  blockConsoleLogs(); // Disable console logs to hinder debugging
  blockReloadOrClose(); // Prevent page reload or closure without solving CAPTCHA
  detectDevTools(); // Detect developer tools
  
  // Check if CAPTCHA was already solved in this session
  if (sessionStorage.getItem("captchaSolved") === "true") {
    captchaSolved = true;
    document.getElementById("nextPageBtn").style.display = "block";
  }

  // If CAPTCHA hasn't been solved, prevent page navigation
  if (!captchaSolved) {
    blockNavigation();
  }
  
  // Block developer tools actions like F12, Ctrl+Shift+I, Ctrl+U
  disableDevTools();
};

// Block the right-click context menu
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  alert('Right-click is disabled to prevent inspection.');
});

// Block keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Block "Ctrl + U" for "View Source"
  if (event.ctrlKey && event.key === 'u') {
    event.preventDefault();
    alert('View Source is disabled.');
  }

  // Block "F12" (DevTools)
  if (event.key === 'F12') {
    event.preventDefault();
    alert('Developer tools are disabled.');
  }

  // Block "Ctrl + Shift + I" for Developer Tools
  if (event.ctrlKey && event.shiftKey && event.key === 'I') {
    event.preventDefault();
    alert('Developer tools are disabled.');
  }
});

// Block navigation if CAPTCHA is not solved
function blockNavigation() {
  // Intercept all link clicks
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      alert('Please complete the CAPTCHA before navigating.');
    });
  });

  // Disable back navigation via history
  window.onbeforeunload = function() {
    return 'You must complete the CAPTCHA before leaving the page.';
  };
}

// Prevent DevTools (Console) and tampering attempts
function disableDevTools() {
  // Detect if the user has opened DevTools (inspect element)
  let devToolsOpened = false;

  setInterval(() => {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
      devToolsOpened = true;
    }

    if (devToolsOpened) {
      alert('Developer tools detected! Please close them to continue.');
      // Optionally, reload or redirect the page
      window.location.reload();
    }
  }, 1000); // Check every second
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
  let currentX = e.clientX;
  let currentY = e.clientY;
  let currentTime = Date.now();

  if (lastX !== null && lastY !== null && lastTime !== null) {
    // Calculate the distance moved since the last position
    let dx = Math.abs(currentX - lastX);
    let dy = Math.abs(currentY - lastY);

    // Calculate time difference (in milliseconds)
    let dt = (currentTime - lastTime) / 1000; // Time in seconds

    // Check if movement is too straight and too fast (bot-like)
    if (dx > dy && dx > straightMovementThreshold) {
      moveCount++;
    } else {
      moveCount = 0; // Reset if the movement is irregular
    }

    // Check for suspicious speed (if the user moves the mouse too fast)
    let speed = (dx + dy) / dt; // Speed = distance / time
    if (speed > speedThreshold) {
      feedbackMessage.textContent = "Suspiciously fast movement detected. Please verify you're human.";
      askQuestion("You're moving too quickly. Can you solve a question to prove you're human?");
    }

    // If 3 straight movements are detected
    if (moveCount >= 3) {
      feedbackMessage.textContent = "Unusual movement detected! Please verify you're human.";
      askQuestion();
    }
  }

  // Update last known position and time
  lastX = currentX;
  lastY = currentY;
  lastTime = currentTime;
});

// Function to ask a CAPTCHA question or close the tab if the behavior is unnatural
function askQuestion(message = "Your mouse movement seems robotic. Please answer this question to proceed.") {
  let response = confirm(message + "\nDo you want to answer a question or close the page?");

  if (response) {
    // Trigger a multiple-choice CAPTCHA question
    let userAnswer = prompt("Which of these is the largest number?\n1. 42\n2. 101\n3. 1000");
    if (userAnswer === "3") {
      alert("Correct! You're human.");
      captchaSolved = true;
      sessionStorage.setItem("captchaSolved", "true");
      document.getElementById("nextPageBtn").style.display = "block"; // Show the proceed button
    } else {
      alert("Incorrect answer. Closing the page...");
      window.close(); // This will attempt to close the tab.
    }
  } else {
    // If the user chooses to close, we do it automatically
    alert("Closing the page due to suspicious behavior.");
    window.close(); // This will attempt to close the tab.
  }
}

// Submit CAPTCHA when user clicks "Proceed"
function submitCaptcha() {
  if (!captchaSolved) {
    alert('Please complete the CAPTCHA before proceeding.');
    return;
  }

  // Redirect to another page
  window.location.href = 'nextpage.html'; // Replace with the next page URL
}
