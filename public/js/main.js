const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')
const resubmitOrder = document.querySelectorAll('.resubmit-order')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

Array.from(resubmitOrder).forEach((el)=>{
    el.addEventListener('click', submitOldOrder)
})

async function submitOldOrder(){
    console.log('trying to submit old order')
    const todoId = this.parentNode.dataset.id
    const oldOrder = this.parentNode.querySelector('.prev-order p').textContent;
    const oldNotes = this.parentNode.querySelector('.prev-notes p').textContent;
    const hasOrdered = this.parentNode.querySelector('#hasOrdered').value;
    try{
        console.log({oldOrder, oldNotes})
        if (hasOrdered){
            const response = await fetch('orders/changeOrder', {
                method: 'post',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'userOrderChanges': oldOrder,
                    'notesChanges': oldNotes,
                })
            })
            location.reload()
        }else{
            const response = await fetch('orders/submitOrder', {
                method: 'post',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'userOrder': oldOrder,
                    'notes': oldNotes,
                })
            })
            location.reload()
        }
    }catch(err){
        console.log(err)
    }
}
async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

function toggleForm(event) {
            const container = event.target.closest('.form-container');
            container.classList.toggle('expanded');
        }

document.addEventListener('click', function(event) {
            const containers = document.querySelectorAll('.form-container');
            containers.forEach(container => {
                if (!container.contains(event.target) && container.classList.contains('expanded')) {
                    container.classList.remove('expanded');
                }
            });
        });