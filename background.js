// Background script for handling the screenshot command
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "take-screenshot") {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        console.error('No active tab found');
        return;
      }

      // Capture the visible area of the tab
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
        format: 'png'
      });

      // Inject script to copy to clipboard
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyImageToClipboard,
        args: [dataUrl]
      });

    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  }
});

// Function to be injected into the page
function copyImageToClipboard(dataUrl) {
  // Convert data URL to blob
  fetch(dataUrl)
    .then(response => response.blob())
    .then(blob => {
      // Copy blob to clipboard
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]).then(() => {
        // Show success notification
        showNotification('Screenshot copied to clipboard!', 'success');
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        showNotification('Failed to copy screenshot', 'error');
      });
    })
    .catch(err => {
      console.error('Error processing image:', err);
      showNotification('Error processing screenshot', 'error');
    });
}

// Add permission for tab capture
chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Screenshot extension installed');
});