var $authorizeButton = $('authorize-button');
var $signoutButton = $('signout-button');

/**
* On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
* Initializes the API client library and sets up sign-in state
* listeners
    */
function initClient() {
    gapi.client.init(config).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        $authorizeButton.click(handleAuthClick);
        $signoutButton.click(handleSignoutClick)
    });
}

/**
 * Called when the signed in status changes, to update the UI
 * appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        $authorizeButton.css('display', 'none');
        $signoutButton.css('display', 'block');
        listLabels();
        listMessages('me', '', (messages) => {
            getMessage('me', messages[0].id, (result) => {
                for (i = 0; i < result.payload.headers.length; i++) {
                    const header = result.payload.headers[i];
                    if (header.name === 'From') {
                        console.log(header.value);
                    }
                }
            });
        });
    } else {
        $authorizeButton.css('display', 'block');
        $signoutButton.css('display', 'none');
    }
}

/**
 * Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 * Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/** 
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
function listLabels() {
    gapi.client.gmail.users.labels.list({
        'userId': 'me'
    }).then(function(response) {
        var labels = response.result.labels;
        appendPre('Labels');

        if (labels && labels.length > 0) {
            for (i = 0; i < labels.length; i++) {
                var label = labels[i];
                appendPre(label.name);
            }
        } else {
            appendPre('No Labels found.');
        }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 * 
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Retrieve Messages in user's mailbox matching query.
 * 
 * @param {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param {String} query String used to filter the Messages listed.
 * @param {Function} callback Function to call  when the request is complete.
 */
function listMessages(userId, query, callback) {
    var getPageOfMessages = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.messages);
            var nextPageToken = resp.nextPageToken;

            if (nextPageToken) {
                request = gapi.client.gmail.users.messages.list({
                    'userId': userId,
                    'pageToken': nextPageToken,
                    'q': query
                });
                getPageOfMessages(request, result);
            } else {
                callback(result);
            }
        });
    }

    var initialRequest = gapi.client.gmail.users.messages.list({
        'userId': userId,
        'q': query
    });

    getPageOfMessages(initialRequest, []);
}

/**
 * Get Message with given ID.
 * 
 * @param {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param {String} messageId ID of Message to get.
 * @param {Function} callback Function to call when the request is complete.
 */
function getMessage(userId, messageId, callback) {
    var request = gapi.client.gmail.users.messages.get({
        'userId': userId,
        'id': messageId
    });
    request.execute(callback);
}