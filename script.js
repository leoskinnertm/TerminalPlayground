// Available commands and their corresponding functions
const commands = {
  help: showHelp,
  greet: greetUser,
  echo: echoMessage
};

// Command history
const commandHistory = [];
let commandIndex = 0;

// Autocomplete suggestions
const autocompleteSuggestions = Object.keys(commands);

// Function to execute the entered command
function executeCommand(command, params) {
  const output = document.getElementById("output");

  if (commands.hasOwnProperty(command)) {
    const response = commands[command](params);
    output.innerHTML += `<p>> ${command}${params ? " " + params : ""}</p><p>${response}</p>`;
  } else {
    output.innerHTML += `<p>> ${command}${params ? " " + params : ""}</p><p>Command not found</p>`;
  }

  output.scrollTop = output.scrollHeight;
}

// Handle user input
const commandInput = document.getElementById("commandInput");
let tabPressed = false; // Track if Tab key was pressed
commandInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const input = event.target;
    const inputText = input.value.trim();

    if (inputText) {
      const [command, ...paramsArray] = inputText.split(" ");
      const params = paramsArray.join(" ");

      // Add command to history
      commandHistory.push(inputText);
      commandIndex = commandHistory.length;

      executeCommand(command, params);
      input.value = "";
      hideAutocompletePreview();
    }
  } else if (event.key === "ArrowUp") {
    // Navigate command history backward
    if (commandIndex > 0) {
      commandIndex--;
      commandInput.value = commandHistory[commandIndex];
    }
  } else if (event.key === "ArrowDown") {
    // Navigate command history forward
    if (commandIndex < commandHistory.length - 1) {
      commandIndex++;
      commandInput.value = commandHistory[commandIndex];
    } else {
      commandIndex = commandHistory.length;
      commandInput.value = "";
    }
  } else if (event.key === "Tab") {
    // Autocomplete command
    event.preventDefault();

    if (!tabPressed) {
      tabPressed = true;

      const currentInput = event.target.value;
      const matchedSuggestions = autocompleteSuggestions.filter(suggestion =>
        suggestion.startsWith(currentInput)
      );

      if (matchedSuggestions.length === 1) {
        const autocompleteCommand = matchedSuggestions[0];
        showAutocompletePreview(autocompleteCommand);
      } else if (matchedSuggestions.length > 1) {
        const commonPrefix = findCommonPrefix(matchedSuggestions);
        showAutocompletePreview(commonPrefix);
      }
    } else {
      const autocompleteCommand = document.getElementById("autocompletePreview").textContent;
      if (autocompleteCommand) {
        commandInput.value = autocompleteCommand;
      }
    }
  } else {
    tabPressed = false; // Reset Tab key flag if another key is pressed
  }
});

// Find the common prefix among a list of strings
function findCommonPrefix(strings) {
  const sortedStrings = strings.sort();
  const firstString = sortedStrings[0];
  const lastString = sortedStrings[sortedStrings.length - 1];
  let i = 0;

  while (i < firstString.length && firstString.charAt(i) === lastString.charAt(i)) {
    i++;
  }

  return firstString.slice(0, i);
}

// Show the autocomplete preview
function showAutocompletePreview(command) {
  const preview = document.getElementById("autocompletePreview");
  preview.textContent = command;
}

// Hide the autocomplete preview
function hideAutocompletePreview() {
  const preview = document.getElementById("autocompletePreview");
  preview.textContent = "";
}

// Default greeting message
window.addEventListener("DOMContentLoaded", function() {
  const output = document.getElementById("output");
  const greeting = "Welcome to the terminal! Type 'help' to see the available commands.";
  output.innerHTML += `<p>${greeting}</p>`;
  output.scrollTop = output.scrollHeight;
});

// Command functions

// Show available commands
function showHelp() {
  let helpText = "Available commands: <br>";
  for (const command in commands) {
    helpText += ` - ${command}<br>`;
  }
  return helpText;
}

// Greet the user
function greetUser() {
  return "Hello! How can I assist you today?";
}

// Echo a message
function echoMessage(params) {
  return params;
}

// Draggable functionality
const terminal = document.getElementById("terminal");
const titleBar = document.getElementById("titleBar");
let isDragging = false;
let dragStartX;
let dragStartY;

titleBar.addEventListener("mousedown", startDragging);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", stopDragging);

function startDragging(event) {
  // Allow dragging only if the clicked element is the title bar
  if (event.target === titleBar || event.target.parentNode === titleBar) {
    isDragging = true;
    dragStartX = event.clientX - terminal.offsetLeft;
    dragStartY = event.clientY - terminal.offsetTop;
  }
}

function drag(event) {
  if (isDragging) {
    const newLeft = event.clientX - dragStartX;
    const newTop = event.clientY - dragStartY;

    terminal.style.left = newLeft + "px";
    terminal.style.top = newTop + "px";
  }
}

function stopDragging() {
  isDragging = false;
}