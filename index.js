const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3001
const app = express()

app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    
    const index = orders.findIndex(order => order.id === id)
    
    if(index < 0){
        return response.status(404).json({error: "Order nothing found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()

}

const checkMethodURL = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)
    next()
}

app.get('/orders', checkMethodURL, (request, response) => {
  
    return response.json(orders) 
})

app.post('/orders', checkMethodURL, (request, response) => {
    const {order, clienteName, price, status} = request.body

    const clienteOrder = { id: uuid.v4(), order, clienteName, price, status: "Em preparação" }

    orders.push(clienteOrder)

    return response.status(201).json(clienteOrder)
})

app.put('/orders/:id', checkOrderId, checkMethodURL, (request, response) => {
    const { order, clienteName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order, clienteName, price, status }
    
    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, checkMethodURL, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()
})

app.patch('/orders/:id', checkOrderId, checkMethodURL, (request, response) => {
    const index = request.orderIndex

    const order = orders[index]
    order.status = "Pronto"

    return response.json(order)
})



app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})