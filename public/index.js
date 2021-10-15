let uid = 1;

$('document').ready(() => {

    $('#loginButton').on('click', () =>{
        $('#loginFailure').hide();
        const email = $('#email').val();
        $.post(`login/${email}/${$('#password').val()}`, null, (res) => {
            uid = (res);
            if(res) loginSuccess();
            else loginFailure();
        });
    });

    $('#resetButton').on('click', () => {
        $.post(`reset/${$('#email').val()}`);
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