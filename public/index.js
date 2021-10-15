const uid = 1;

$('document').ready(() => {

    //setInterval(() => {$.post('repeat/5', (res) => {console.log(res);});}, 500);

    $('#loginButton').on('click', () =>{
        $('#loginFailure').hide();
        $.post(`login/${$('#email').val()}/${$('#password').val()}`, null, (res) => {
            if(res['uid']) loginSuccess();
            else loginFailure();
        });
    });

    $('#resetButton').on('click', () => {
        $('#login-pass').slideUp(() => {$('#login-reset').slideDown();});
        $.post(`reset/${$('#email').val()}`);
    });

    $('#resetEnter').on('click', () => {
        $.post(`enterReset/${$('#email').val()}/${$('#password').val()}/${$('#resetCode').val()}`, (res) => {

        });
    });

});

const loginSuccess = () => {
    $('#login').slideToggle(() => {
        $.post(`servers/${uid}`, null, (res) => {
            for(item in res) {
                let newTag = document.createElement('button');
                newTag.id = res[item]['server_id'];
                newTag.innerText = res[item]['server_name'];
                $('#servers').append(newTag);
                $('#servers').append(document.createElement('hr'));
                $(`#${newTag.id}`).on('click', () => {
                    console.log(newTag.innerText);
                });
            }
            $('#servers').slideToggle();
        });
    });
};

const loginFailure = () => {
    $('#loginFailure').show();
};