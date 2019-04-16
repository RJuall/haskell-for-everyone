(function(){
    // form elements
    let formElem = null,
        nameElem = null,
        emailElem = null;

    // form on submit 
    let onSubmit = evt => {
        // don't load new page, use ajax
        evt.preventDefault();        

        // get form field values
        let name = nameElem.value,
            email = emailElem.value,
            comment = commentElem.value;

        // ajax post url
        let postUrl = window.location.origin + "/contact/submit";

        // post request setup 
        let postOpts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, comment})
        };

        // clear form
        nameElem.value = "";
        emailElem.value = "";
        commentElem.value = "";

        // make the request 
        fetch(postUrl, postOpts).then(response => {
            response.text().then(text => alert(text));
        });
    };

    // when page loads... setup form listeners
    window.addEventListener("load", evt => {
        // find form elements
        formElem = document.querySelector("#contact");
        nameElem = document.querySelector("#nameField")
        emailElem = document.querySelector("#emailField");
        commentElem = document.querySelector("#commentField");

        // attach on submit listener 
        formElem.onsubmit = onSubmit;
    });
})();