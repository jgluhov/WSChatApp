(function (window, document, moment, _) {
    'use strict';
    var socket,
        userForm,
        usernameFormGroup,
        chatContent,
        usersCountElement,
        chatContentElement,
        chatForm;

    socket = new WebSocket('ws://localhost:8081');
    chatContent = new ChatContent('.chat-content');
    usersCountElement = document.querySelector('.users-count');

    socket.onopen = function () {
        socket.send(JSON.stringify({type: 'users count'}));
    };
    
    socket.onmessage = function (e) {
        var message;

        message  = JSON.parse(e.data);

        switch (message.type) {
            case 'chat message': chatContent.appendMessage(message); break;
            case 'users count': updateUsersCount(message); break;
        }

    };

    //------------------------------------------------------------

    chatForm = document.forms.chatForm;

    chatForm.submit.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if(_.isEmpty(userForm.username.value)) {
            usernameErrorHandler();
            return;
        }

        if(_.isEmpty(chatForm.message.value)) {
            return;
        }

        socket.send(JSON.stringify({
            type: 'chat message',
            message: {
                username: userForm.username.value,
                body: chatForm.message.value
            }
        }));

        chatForm.message.value = null;
    });

    //------------------------------------------------------------
    
    function ChatContent(element) {
        chatContentElement = document.querySelector(element);

        this.appendMessage = function (data) {
            var messageElement,
                datetime,
                childNodes;

            messageElement = createMessageElement();

            childNodes = messageElement.childNodes;

            datetime = new Date();
            childNodes[0].setAttribute('datetime', datetime.toUTCString());
            childNodes[0].textContent = moment(datetime).format('MMMM Do YYYY, h:mm:ss a');

            childNodes[1].textContent = data.message.username + ':';
            childNodes[2].textContent = data.message.body;

            chatContentElement.appendChild(messageElement);
        };

        function createMessageElement() {
            var messageElement,
                dateElement,
                titleElement,
                bodyElement;

            messageElement = document.createElement('div');
            dateElement = document.createElement('time');

            titleElement = document.createElement('span');
            titleElement.classList.add('message-title');
            bodyElement = document.createElement('span');
            bodyElement.classList.add('message-body');

            messageElement.appendChild(dateElement);
            messageElement.appendChild(titleElement);
            messageElement.appendChild(bodyElement);
            messageElement.classList.add('message');

            return messageElement;
        }

    }

    //------------------------------------------------------------

    userForm = document.forms.userForm;

    usernameFormGroup = userForm.querySelector('.form-group');

    userForm.username.addEventListener('change', function () {
        _.isEmpty(userForm.username.value) ?
            usernameErrorHandler() : usernameDefaultHandler();
    });

    userForm.username.addEventListener('keypress', function () {
        usernameDefaultHandler();
    });

    userForm.submit.addEventListener('click', function (e) {
        var username;

        e.preventDefault();
        e.stopPropagation();

        username = userForm.username.value;

        if(_.isEmpty(username)) {
            usernameErrorHandler();
            return;
        }

        window.localStorage.setItem('username', username);
        userForm.username.setAttribute('disabled', 'disabled');
    });

    userForm.addEventListener('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();

        userForm.username.value = null;
        localStorage.removeItem('username');
        userForm.username.removeAttribute('disabled');
    });

    function usernameErrorHandler() {
        userForm.username.placeholder = 'Enter your name!';
        usernameFormGroup.classList.add('has-error');
    }

    function usernameDefaultHandler() {
        userForm.username.placeholder = 'Your name';
        usernameFormGroup.classList.remove('has-error');
    }

    //------------------------------------------------------------

    window.addEventListener('load', function () {
        var username;

        username = window.localStorage.getItem('username');

        if(!_.isNull(username)) {
            userForm.username.value = username;
            userForm.username.setAttribute('disabled', 'disabled');
        }
    });

    //------------------------------------------------------------

    function updateUsersCount(message) {
        usersCountElement.textContent = message.count;
    }

})(window, document, moment, _);