(function () {
    'use strict';
    var socket,
        userForm,
        usernameFormGroup,
        chatForm;

    socket = new WebSocket('ws://localhost:8081');

    socket.onmessage = function (e) {
        console.log(e);
    };

    chatForm = document.forms.chatForm;
    userForm = document.forms.userForm;

    usernameFormGroup = userForm.querySelector('.form-group');

    userForm.username.addEventListener('change', function () {
        _.isEmpty(userForm.username.value) ?
            usernameErrorHandler() : usernameDefaultHandler();
    });

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

        socket.send(message);
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

        userForm.username.setAttribute('disabled', 'disabled');
    });

    function usernameErrorHandler() {
        userForm.username.placeholder = 'Enter your name!';
        usernameFormGroup.classList.add('has-error');
    }

    function usernameDefaultHandler() {
        userForm.username.placeholder = 'Your name';
        usernameFormGroup.classList.remove('has-error');
    }

})();