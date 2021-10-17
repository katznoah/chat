let uid = 1;
let currServer;
let msgUpdate;

$('document').ready(() => {

    login();

    $(window).on('hashchange ready', function( e ) {
        initGetMessages();
        currServer = +(window.location.hash.substring(1));
        clearInterval(msgUpdate);
        if(window.location.hash.length < 2) return;
        msgUpdate = setInterval(() => {getMessages()}, 1000);
    });

    $('#getter').on('click', () => {
        const myParams = new URLSearchParams(window.location.search);
        myParams.set('name', 'yourname');
        window.location.search = myParams;
    });

    $('#loginButton').on('click', () =>{
        login();
    });

    $('#resetButton').on('click', () => {
        $.post(`reset/${$('#email').val()}`);
    });

    $('#logoutButton').on('click', () => {
        logout();
    });

    $('#sendButton').on('click', () => {
        $.post(`newMsg/${$('#msgInputBox').val()}/${currServer}/${uid}`);
    });

    $('#msgInput').on('keypress', (key) => {
        if(key.keyCode != 13) return;
        $.post(`newMsg/${$('#msgInputBox').val()}/${currServer}/${uid}`);
    });

    $('#createSubmit').on('click', () => {
        $('#newServer').slideToggle();
    });

    $('#submitNewServer').on('click', () => {
        const serverName = $('#newServerName').val();
        if(!serverName) {
            $('#newServerFailure').slideDown(() => {setTimeout(() => {$('#newServerFailure').sldeUp();},2000);});
        }
    });

});

const login = () => {
    $('#loginFailure').hide();
    let email = localStorage['email'];
    let pass = localStorage['pass'];
    if(!email || !pass) {
        email = $('#email').val();
        pass = $('#password').val();
    }
    $.post(`login/${email}/${pass}`, null, (res) => {
        uid = (res);
        if(res) {
            loginSuccess(email);
            localStorage['email'] = email;
            localStorage['pass'] = pass;
        }
        if(!($('#email').val() && $('#password').val())) return;
        loginFailure();
    });
}

const loginSuccess = (email) => {
    $('#login').slideToggle(() => {
        $.post(`servers/${uid}`, null, (res) => {
            $('#servers').html('');
            for(item in res) {
                let newTag = document.createElement('a');
                newTag.id = res[item]['server_id'];
                newTag.innerText = res[item]['server_name'];
                newTag.classList.add('dropdown-item');
                newTag.classList.add('server');
                $('#servers').append(newTag);
                $(`#${newTag.id}`).on('click', () => {
                    location.href='/#';
                    setTimeout(() => {location.href=`/#${newTag.id}`;}, 100);
                    $('#peopleList').html();
                });
            }
            $('#nameDisplay').html(email);
            $('#navBar').slideToggle();
            $('#msgInput').slideToggle(() => {
                if(+(window.location.hash.substring(1))) {
                    initGetMessages();
                    currServer = +(window.location.hash.substring(1));
                    clearInterval(msgUpdate);
                    if(window.location.hash.length < 2) return;
                    msgUpdate = setInterval(() => {getMessages()}, 1000);
                }
            });
        });
    });
};

const renderServers = () => {
    $.post(`servers/${uid}`, null, (res) => {
        $('#servers').html('');
        for(item in res) {
            let newTag = document.createElement('a');
            newTag.id = res[item]['server_id'];
            newTag.innerText = res[item]['server_name'];
            newTag.classList.add('dropdown-item');
            $('#servers').append(newTag);
            $(`#${newTag.id}`).on('click', () => {
                location.href='/#';
                setTimeout(() => {location.href=`/#${newTag.id}`;}, 100);
            });
        }
    });
};

const loginFailure = () => { // this handles what happens when the login has failed
    $('#loginFailure').show();
};

const getMessages = () => { // this is called in a loop, and checks if there has been a modification to the data before re-rendering
    $.post(`/getMessages/${uid}/${window.location.hash.substring(1)}`, null, res => {
        if(res == 'nm') return;
        $('#messages').html(`<h3>${res['server_name']}</h3><hr>`);
        $('#messages').slideDown();
        for(datum in res['data']) {
            let d = (res['data'][datum]);
            $('#messages').append(makeMessage(d['message'],d['username'],d['message_date'],d['edited']));
            $('#messages').append('<hr>');
        }
    });
};

const initGetMessages = () => { // this is the initial call for when a server is loaded
    $.post(`/initGetMessages/${uid}/${window.location.hash.substring(1)}`, null, res => {
        $('#messages').html('');
        $('#messages').html(`<h3>${res['server_name']}</h3><hr>`);
        $('#messages').slideDown();
        for(datum in res['data']) {
            let d = (res['data'][datum]);
            $('#messages').append(makeMessage(d['message'],d['username'],d['message_date'],d['edited']));
            $('#messages').append('<hr>');
        }
        setTimeout(() => {$('html, body').scrollTop($(document).height(), 'slow');}, 500);
    });
};

const logout = () => {
    $.post(`logout/${uid}`);
    uid = 1;
    localStorage.removeItem('email');
    localStorage.removeItem('pass');
    location.href = '/';
}

const makeMessage = (msg, un, ts, e) => {
    console.log(e);
    let newTag = document.createElement('li');
    let username = document.createElement('p');
    let message = document.createElement('p');
    let timestamp = document.createElement('p');
    let edited = document.createElement('p');
    let editField = document.createElement('input');
    editField.classList.add('hidden');
    editField.placeholder = 'edit your message';
    newTag.classList.add('message');
    setTimeout(() => {
        newTag.classList.add('messageA');
        newTag.addEventListener('click', () => {
            if(editField.classList.contains('hidden'))
                editField.classList.remove('hidden');
        });
    }, 2000);
    editField.addEventListener('keypress', (key) => {
        let newMsg = editField.value;
        newMsg = newMsg ? newMsg : ' ';
        if(key.keyCode == 13) {
            $.post(`updateMsg/${newMsg}/${ts}`, () => {
                editField.classList.add('hidden');
            });
        }
    });
    message.innerText = msg;
    username.innerText = un;
    timestamp.innerText = ts;
    edited.innerText = e;
    newTag.append(username, message, timestamp, edited, editField);
    return newTag;
}