const uid = 1;

$('document').ready(() => {

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
    });

});