let uid = 1;
let currServer;
let msgUpdate;

$('document').ready(() => {

    login();

    $(window).on('hashchange ready', function( e ) {
        initGetMessages();
        currServer = +(window.location.hash.substring(1));
        clearInterval(msgUpdate);
        if(window.location.hash.length < 2) {
            $('#messages').slideUp();
            return;
        };
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

    $('#regButton').on('click', () => {
        register();
    });

    $('#resetButton').on('click', () => {
        $.post(`reset/${$('#email').val()}`);
    });

    $('#logoutButton').on('click', () => {
        logout();
    });

    $('#sendButton').on('click', () => {
        $.post(`newMsg/${$('#msgInputBox').val()}/${currServer}/${uid}`);
        setTimeout(() => {$('html, body').scrollTop($(document).height(), 'slow');}, 500);
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
            return;
        }
        $.post(`/newServer/${uid}/${serverName}`, null, (res) => {
            location.reload();
        });
    });

    $('#joinSubmit').on('click', () => {
        const scode = $('#joinInput').val();
        $.post(`/joinServer/${uid}/${scode}`, (res) => {
            location.reload();
        });
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
    const server_num = window.location.hash.substring(1);
    $.post(`/getMessages/${uid}/${server_num}`, null, res => {
        if(res == 'nm') return;
        $('#messages').html(`<h3>${res['server_name']}: ${server_num}</h3><hr>`);
        $('#messages').slideDown();
        for(datum in res['data']) {
            let d = (res['data'][datum]);
            $('#messages').append(makeMessage(d['message'],d['username'],d['message_date'],d['edited']));
            $('#messages').append('<hr>');
        }
        setTimeout(() => {$('html, body').scrollTop($(document).height(), 'slow');}, 500);
        getPeople();
    });
};

const initGetMessages = () => { // this is the initial call for when a server is loaded
    const server_num = window.location.hash.substring(1);
    $.post(`/initGetMessages/${uid}/${server_num}`, null, res => {
        $('#messages').html('');
        $('#messages').html(`<h3>${res['server_name']}: ${server_num}</h3><hr>`);
        $('#messages').slideDown();
        for(datum in res['data']) {
            let d = (res['data'][datum]);
            $('#messages').append(makeMessage(d['message'],d['username'],d['message_date'],d['edited']));
            $('#messages').append('<hr>');
        }
        setTimeout(() => {$('html, body').scrollTop($(document).height(), 'slow');}, 500);
        getPeople();
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

const getPeople = () => {
    $.post(`getPeople/${currServer}`, null, (res) => {
        console.log(res);
        $('#peopleList').html('');
        for(item in res) {
            $('#peopleList').append(createPerson(res[item]['username'], res[item]['uid'], res[item]['role']));
        }
        // dropdown-item
    });
};

const createPerson = (username, user_id, role) => {
    if(user_id==uid) return;
    let newTag = document.createElement('div');
    let name = document.createElement('a');
    let changeRole = document.createElement('a');
    let divider = document.createElement('div');
    name.innerText = `${username} : ${role}`;
    name.classList.add('dropdown-item');
    changeRole.classList.add('dropdown-item');
    changeRole.innerText = (role == 'admin') ? 'Role -> User' : 'Role -> Admin';
    divider.classList.add('dropdown-divider');
    newTag.append(name);
    changeRole.addEventListener('click', () => {
        $.post(`/changeRole/${user_id}/${+(window.location.hash.substring(1))}`, null, (res) => {
            getPeople();
        });
    });
    $.post(`/getRole/${uid}/${currServer}`, null, (res) => {
        console.log(res);
        if(res['role'] == 'admin') newTag.append(changeRole);
        newTag.append(divider);
    });
    return newTag;
};

const register = () => {
    const email = $('#email').val();
    const pass = $('#password').val();
    $.post(`/register/${email}/${pass}`, (res) => {
        localStorage['email'] = email;
        localStorage['pass'] = pass;
        uid = res;
        login();
    });
};