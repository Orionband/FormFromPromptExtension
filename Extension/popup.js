document.addEventListener('DOMContentLoaded', function () {
  const userPromptTextarea = document.getElementById('user-prompt');
  const sendToAiButton = document.getElementById('send-to-ai');
  const aiStatusDiv = document.getElementById('ai-status');
  const quizDataOutputTextarea = document.getElementById('quiz-data-output'); // Used to get the AI's JSON output
  const sendToGoogleScriptButton = document.getElementById('send-to-google-script');
  const scriptResponseDiv = document.getElementById('script-response');

  // Make sure you have these input fields in your popup.html
  const quizTitleInput = document.getElementById('quiz-title');
  const quizDescriptionInput = document.getElementById('quiz-description');
  const quizFolderInput = document.getElementById('quiz-folder');


  // --- CONFIGURATION ---
  const OPENROUTER_API_KEY = "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"; // YOUR API KEY
  const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUaGc3SZ1g89PgfLIeFIUfnJb32eENx0uLVTJixEgaTiCFodzcGQ_c7rMlrm5Vyrilpw/exec"; // YOUR SCRIPT URL

  sendToAiButton.addEventListener('click', async () => {
    // Disable button to prevent multiple clicks
    sendToAiButton.disabled = true;
    aiStatusDiv.textContent = "Sending to AI... Please wait.";
    quizDataOutputTextarea.value = "";
    sendToGoogleScriptButton.style.display = 'none';
    scriptResponseDiv.textContent = "";

    const promptText = userPromptTextarea.value.trim();
    if (!promptText) {
      aiStatusDiv.textContent = "Please enter some content or instructions for the AI.";
      sendToAiButton.disabled = false; // Re-enable button
      return;
    }

    try {
      const fullPrompt = `
        Based on the following input, generate a VALID JSON string representing an array of objects suitable for a Google Apps Script quiz creator.
        Each object in the array must represent a single question and have these exact properties (keys must be double-quoted):
        - "questionText": String (The question itself)
        - "choices": Array of strings (The answer options)
        - "correctAnswers": Array of strings (The exact text of the correct answer(s). One string for Multiple Choice, multiple for Checkbox)
        - "points": Number (The point value)

        The entire output must be ONLY this JSON array string, starting with '[' and ending with ']'.
        Do NOT include any other text, explanations, or markdown backticks (like \`\`\`json) around the array.
        If the input implies multiple choice, "correctAnswers" should have one item.
        If the input implies checkboxes (select multiple), "correctAnswers" can have multiple items.
        All string values within the JSON (for questionText, choices, correctAnswers) must be properly escaped if they contain special characters like quotes or backslashes.

        Example of the EXACT desired JSON output format:
        [
          {
            "questionText": "Which statement describes the use of powerline networking technology?",
            "choices": [
              "A device connects to an existing home LAN using an adapter and an existing electrical outlet.",
              "New “smart” electrical cabling is used to extend an existing home LAN.",
              "Wireless access points use powerline adapters to distribute data through the home LAN.",
              "A home LAN is installed without the use of physical cabling."
            ],
            "correctAnswers": ["A device connects to an existing home LAN using an adapter and an existing electrical outlet."],
            "points": 5
          },
          {
            "questionText": "Which three steps must be completed to manually connect an Android or IOS device to a secured wireless network?",
            "choices": [
              "Change the MAC address.",
              "Set the IP address.",
              "Enter the network SSID.",
              "Activate the Bluetooth antenna.",
              "Input the authentication password.",
              "Choose the correct security type."
            ],
            "correctAnswers": [
              "Enter the network SSID.",
              "Input the authentication password.",
              "Choose the correct security type."
            ],
            "points": 5
          }
        ]

        User input:
        ---
        ${promptText}
        ---

        Generate the QUIZ_DATA JSON array string now:
      `;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-3.5-turbo",
          "messages": [
            { "role": "user", "content": fullPrompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      let aiGeneratedText = data.choices[0]?.message?.content.trim();

      if (aiGeneratedText) {
        const jsonRegex = /\[[\s\S]*\]/;
        const match = aiGeneratedText.match(jsonRegex);
        if (match && match[0]) {
          aiGeneratedText = match[0];
        } else {
          throw new Error("AI did not return a recognizable array structure. Check the AI's response and your prompt.");
        }

        try {
          JSON.parse(aiGeneratedText); // Validate JSON
          quizDataOutputTextarea.value = aiGeneratedText;
          aiStatusDiv.textContent = "AI processing complete. Review the data below and fill in Quiz Details if needed.";
          sendToGoogleScriptButton.style.display = 'block';
        } catch (e) {
          quizDataOutputTextarea.value = "Error: AI output was not valid JSON.\n" + aiGeneratedText;
          aiStatusDiv.textContent = "Error: AI output was not valid JSON. " + e.message;
          sendToGoogleScriptButton.style.display = 'none';
        }
      } else {
        aiStatusDiv.textContent = "AI returned no content.";
      }
    } catch (error) {
      console.error("Error calling OpenRouter AI:", error);
      aiStatusDiv.textContent = "Error communicating with AI: " + error.message;
      quizDataOutputTextarea.value = "Failed to get data from AI.";
      sendToGoogleScriptButton.style.display = 'none';
    } finally {
      sendToAiButton.disabled = false; // Re-enable button
    }
  });

  sendToGoogleScriptButton.addEventListener('click', async () => {
    // Disable button
    sendToGoogleScriptButton.disabled = true;
    scriptResponseDiv.textContent = "Sending data to Google Apps Script... Please wait.";

    // Get the AI-generated JSON string from the textarea
    const aiGeneratedJsonString = quizDataOutputTextarea.value;
    if (!aiGeneratedJsonString) {
        scriptResponseDiv.textContent = "No quiz data generated by AI.";
        sendToGoogleScriptButton.disabled = false; // Re-enable
        return;
    }

    let parsedQuizData;
    try {
        parsedQuizData = JSON.parse(aiGeneratedJsonString); // Parse it into a JavaScript array
    } catch (e) {
        scriptResponseDiv.textContent = "Error: The AI-generated data is not valid JSON. Cannot send.";
        sendToGoogleScriptButton.disabled = false; // Re-enable
        return;
    }

    // Get values from the input fields. Ensure these IDs match your HTML.
    const quizTitle = quizTitleInput.value.trim() || "AI Generated Quiz (Default)";
    const quizDescription = quizDescriptionInput.value.trim() || "Generated by AI Chrome Extension";
    const quizFolder = quizFolderInput.value.trim() || "Generated AI Quizzes";

    const payload = {
        quizData: parsedQuizData, // Send the actual JavaScript array (will be stringified by JSON.stringify below)
        title: quizTitle,
        description: quizDescription,
        folderName: quizFolder
    };

    try {
      const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          "Content-Type": "application/json;charset=utf-8", // Sending a JSON payload
        },
        body: JSON.stringify(payload) // Send the whole payload object as a JSON string
      });

      const responseText = await response.text();
      // It's good to log raw response for debugging if issues persist
      // console.log("Raw Apps Script Response:", responseText);

      try {
        const result = JSON.parse(responseText);
        if (result.status === "success") {
          scriptResponseDiv.innerHTML = `Google Apps Script: ${result.message}<br>
                                         Quiz ID: ${result.formId}<br>
                                         Edit URL: <a href="${result.editUrl}" target="_blank">${result.editUrl}</a><br>
                                         Published URL: <a href="${result.publishedUrl}" target="_blank">${result.publishedUrl}</a>`;
        } else {
          scriptResponseDiv.textContent = `Google Apps Script Error: ${result.message || 'Unknown error from script.'}`;
        }
      } catch (e) {
        console.error("Could not parse Apps Script response as JSON:", e, "\nRaw response was:", responseText);
        scriptResponseDiv.textContent = "Received non-JSON response from Apps Script. Check console. Raw: " + responseText.substring(0, 200) + "...";
      }

    } catch (error) {
      console.error("Error calling Google Apps Script:", error);
      scriptResponseDiv.textContent = "Error communicating with Google Apps Script: " + error.message;
    } finally {
        sendToGoogleScriptButton.disabled = false; // Re-enable button
    }
  });
});