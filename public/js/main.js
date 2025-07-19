const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')
const resubmitOrder = document.querySelectorAll('.resubmit-order')

Array.from(resubmitOrder).forEach((el)=>{
    el.addEventListener('click', submitOldOrder)
})

async function submitOldOrder(){
    const todoId = this.parentNode.dataset.id
    const oldOrder = this.parentNode.querySelector('.prev-order p').textContent;
    const oldNotes = this.parentNode.querySelector('.prev-notes p').textContent;
    const hasOrdered = this.parentNode.querySelector('#hasOrdered').value;
    try{
        if (hasOrdered){
            const response = await fetch('orders/resubmitOrder', {
                method: 'post',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'userOrderChanges': oldOrder,
                    'notesChanges': oldNotes,
                })
            })
            location.reload()
        }else{
            console.log('resubmitting order')
            const response = await fetch('orders/resubmitOrder', {
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