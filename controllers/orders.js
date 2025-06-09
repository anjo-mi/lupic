const Restaurant = require('../models/Restaurant')
const Group = require('../models/Group')
const User = require('../models/User')
const Order = require('../models/Order')

module.exports = {
    getOrders: async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).populate({
                path: 'group',
                populate: [
                    {path: 'restaurants'},
                    {path: 'selection'},
                    {path: 'selector'},
                    {path: 'orders'},
                ]
            });
            let {restaurants = [], selection, selector, orders} = user.group || {};
            
            
            const allUserOrders = await Order.find({user:req.user.id})

            let orderHistory;
            // console.log({allUserOrders})
            if (allUserOrders.length && selection){
                orderHistory = allUserOrders.filter(order => order.restaurant.toString() === selection._id.toString());
            }
            if (orderHistory.length) orderHistory = orderHistory.reverse();

            // console.log({allUserOrders, selection})

            if (selection){
                restaurants = restaurants.filter(rest => rest._id.toString() !== selection._id.toString())
            }
            let lastOrderDateString;
            if (allUserOrders.length){
                lastOrderDateString = allUserOrders[allUserOrders.length - 1].createdAt.toDateString();
            }

            let hasOrdered = new Date().toDateString() === lastOrderDateString;

            const isSelector = req.user.id.toString() === selector._id.toString();


            // console.log({isSelector, hasOrdered, selection, selector})
            res.render('orders.ejs', {
                user,
                hasOrdered,
                isSelector,
                history: orderHistory,
                restaurants,
                selection,
                selector,
                orders
            })
        }catch(err){
            console.log(err)
        }
    },

    // this isnt real
    addNewRestaurant: async (req, res)=>{
        try{
            const newRest = await Restaurant.create({name: req.body.restaurantName, menu: req.body.restaurantURL, phone: req.body.restaurantPhone, address: req.body.address})
            await Group.findOneAndUpdate(
                {_id: req.user.group},
                {$addToSet:{restaurants: newRest._id}}
            )
            console.log('Restaurant has been added!')
            res.redirect('/groupHome')
        }catch(err){
            console.log(err)
        }
    },
    changeRestaurant: async (req, res)=>{
        try{
            await Group.findByIdAndUpdate(
                req.body.groupId,
                {$set: {selection: req.body.newSelection}}
            )
            console.log('new selection made')
            res.redirect('/orders')
        }catch(err){
            console.log(err)
        }
    },
    submitOrder: async (req,res) =>{
        try{
            console.log('running order submission')
            const user = await User.findById(req.user.id).populate('group')

            const order = await Order.create({
                user: user._id,
                group: user.group._id,
                restaurant: user.group.selection,
                order: req.body.userOrder,
                notes: req.body.notes,
                createdAt: Date.now()
            })
            await Promise.all([
                User.findByIdAndUpdate(user._id, {$set : {order: order._id}}),
                Group.findByIdAndUpdate(user.group._id, {$addToSet : {orders: order._id}})
            ])

            console.log('new order submitted to group')
            res.redirect('/orders')
        }catch(err){
            console.log(err)
        }
    },
    changeOrder: async (req,res) =>{
        try{
            console.log('running order change')
            const user = await User.findById(req.user.id).populate('group')

            const order = await Order.create({
                user: user._id,
                group: user.group._id,
                restaurant: user.group.selection,
                order: req.body.userOrderChanges,
                notes: req.body.notesChanges,
                createdAt: Date.now()
            })
            console.log('new order made')
            await Group.findByIdAndUpdate(user.group._id, {$pull: {orders: user.order}})
            await Group.findByIdAndUpdate(user.group._id, {$addToSet: {orders: order._id}})
            console.log('new order added to group, old removed')

            await User.findByIdAndUpdate(req.user.id, {order: order._id})

            console.log('users order id is updated')
            res.redirect('/orders')
        }catch(err){
            console.log(err)
        }
    },
    // this isnt real
    unmarkSelection: async (req, res)=>{
        try{
            await Restaurant.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    // this isnt real
    deleteRestaurant: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Restaurant.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Restaurant')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}  