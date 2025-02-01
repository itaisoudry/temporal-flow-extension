function addButtonsToWorkflows() {
  console.log("Running addButtonsToWorkflows");

  // Get the current namespace from the URL
  const namespace = window.location.pathname.split("/")[2];
  console.log("Namespace:", namespace);

  // Find all workflow rows using data-testid
  const workflowRows = document.querySelectorAll(
    'tr[data-testid="workflows-summary-configurable-table-row"]'
  );
  console.log("Found workflow rows:", workflowRows.length);

  workflowRows.forEach((row, index) => {
    // Check if button already exists to prevent duplicates
    if (row.querySelector(".temporal-custom-button")) {
      return;
    }

    // Get the workflow ID from cell 4 (index 3) which contains the workflow name link
    const cells = row.querySelectorAll("td.workflows-summary-table-body-cell");
    const workflowLink = cells[4]?.querySelector("a");
    const workflowId = workflowLink?.textContent?.trim();

    console.log(`Row ${index} workflow ID:`, workflowId);

    if (workflowId) {
      // Create button
      const button = document.createElement("button");
      button.className =
        "temporal-custom-button relative flex w-fit items-center justify-center border gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow focus-visible:outline-none focus-visible:border-inverse focus-visible:ring-2 whitespace-nowrap no-underline h-8 text-xs px-1.5 py-1";

      // Add magnifying glass icon and text
      button.innerHTML = `
        <span class="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
          </svg>
        </span>
      `;

      button.style.cssText = `
        margin-left: 6px;
        border-radius: 4px;
        border: 1px solid rgb(203 213 225);
        background: transparent;
        cursor: pointer;
        color: inherit;
        font-family: inherit;
        display: inline-flex;
        align-items: center;
        min-width: 45px;
        max-width: 70px;
        transition: all 0.2s;
        padding: 0 6px;
      `;

      // Add hover styles with a more subtle background color
      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "rgba(226, 232, 240, 0.6)"; // More subtle gray with some transparency
      });

      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "transparent";
      });

      // Add click handler
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const url = `https://itaisoudry.github.io/temporal-flow-web/?id=${encodeURIComponent(
          workflowId
        )}&namespace=${encodeURIComponent(namespace)}`;
        window.open(url, "_blank");
      });

      // Find the target cell and its content
      const targetCell = row.querySelector("td:nth-child(2)");
      const buttonContainer = targetCell?.querySelector(".wrapper");

      if (buttonContainer) {
        // Create a wrapper div similar to the existing button
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className =
          "wrapper group relative inline-block svelte-nyff2a";
        buttonWrapper.style.marginLeft = "4px";

        buttonWrapper.appendChild(button);
        buttonContainer.parentNode.insertBefore(
          buttonWrapper,
          buttonContainer.nextSibling
        );
        console.log(`Added button to row ${index}`);
      } else {
        console.log(`Could not find button container in row ${index}`);
      }
    }
  });
}

// Function to check if the table exists and start observing
function initializeObserver() {
  console.log("Initializing observer");

  // Wait for the content to be ready
  const waitForContent = setInterval(() => {
    const workflowRows = document.querySelectorAll(
      'tr[data-testid="workflows-summary-configurable-table-row"]'
    );
    console.log("Checking for workflow rows:", workflowRows.length);

    if (workflowRows.length > 0) {
      clearInterval(waitForContent);
      console.log("Content found, setting up observer");

      // Set up the MutationObserver
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            console.log("Mutation detected:", mutation.type);
            addButtonsToWorkflows();
          }
        }
      });

      // Find a stable parent element to observe
      const tableWrapper = document.querySelector(".paginated-table-wrapper");
      if (tableWrapper) {
        observer.observe(tableWrapper, {
          childList: true,
          subtree: true,
        });
        console.log("Observer set up on table wrapper");

        // Initial run
        addButtonsToWorkflows();
      } else {
        console.log("Could not find table wrapper");
      }
    }
  }, 1000);
}

// Start the initialization
console.log("Script starting");
initializeObserver();
