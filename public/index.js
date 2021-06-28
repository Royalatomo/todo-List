// jshint esversion: 6

// Removes task(from Html) and returns data to backend.. (Trash Icon Remove)
addEvent = (callingElement, url) => {

    // Removes the callingElemnt's parent box
    callingElement.parentElement.remove();
    
    // Gives Task to remove to backend (also removes indentation)
    let rmWord = callingElement.parentElement.children[1].innerText.trim();

    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    // open a connection
    xhr.open("POST", url, true);
    // Set the Data-Parse Header to rmWord
    xhr.setRequestHeader("Data-Parse", `${rmWord}`);

    // Sending Data-Parse Header with the request
    xhr.send();
};


// Removes task(from Html) and returns data to backend.. (Check Box Icon Remove) ---
// Give some second for the animation of cutting ---
checkEvent = (callingElement, url) => {

    // Gets the current sub directory from ejs Html element "p"
    let title = document.getElementById('title-giver').innerText;
     // remove element "p" from html after getting data
    document.getElementById('title-giver').remove();


    // Gives 0.5s for animation
    setTimeout(() => {
        
        // Remove the task
        addEvent(callingElement, `/${title}${url}`);
    }, 500);
};