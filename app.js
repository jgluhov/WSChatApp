(function (window, document) {
    'use strict';
    var socket,
        userForm,
        usernameFormGroup,
        chatContent,
        chatContentElement,
        chatForm;

    socket = new WebSocket('ws://localhost:8081');
    chatContent = new ChatContent('.chat-content');

    socket.onmessage = function (e) {
        var message;

        message  = JSON.parse(e.data);
    };

    //------------------------------------------------------------

    chatForm = document.forms.chatForm;

    chatForm.submit.addEventListener('click', function (e) {
        var message,
            username;

        e.preventDefault();
        e.stopPropagation();

        message = chatForm.message.value;
        username = userForm.username.value;

        if(_.isEmpty(username)) {
            usernameErrorHandler();
            return;
        }

        socket.send(JSON.stringify({username: username, message: message}));
    });

    //------------------------------------------------------------
    
    function ChatContent(element) {
        chatContentElement = document.querySelector(element);

        this.appendMessage = function (message) {

        };

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

    window.addEventListener('load', function (e) {
        var username;

        username = window.localStorage.getItem('username');

        if(!_.isNull(username)) {
            userForm.username.value = username;
            userForm.username.setAttribute('disabled', 'disabled');
        }
    });

    //------------------------------------------------------------

})(window, document);