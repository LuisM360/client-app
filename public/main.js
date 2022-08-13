const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')


deleteButton.addEventListener('click', _ =>{
    fetch('/clients', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: document.querySelector('#nameForDelete').value
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(response => {
        if (response === 'No client to delete'){
            messageDiv.textContent = 'No client to delete'
        } else {
            window.location.reload(true)
        }
    })
    .catch(console.error)
})