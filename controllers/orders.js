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
            
            const allUserOrders = await Order.find({user:req.user.id});

            let orderHistory;
            if (allUserOrders.length && selection){
                orderHistory = allUserOrders.filter(order => order.restaurant.toString() === selection._id.toString());
                if (orderHistory.length) orderHistory = orderHistory.reverse();
            }

            if (selection){
                restaurants = restaurants.filter(rest => rest._id.toString() !== selection._id.toString())
            }
            let lastOrderDateString;
            if (allUserOrders.length){
                lastOrderDateString = orderHistory[0].createdAt.toDateString();
            }

            let hasOrdered = new Date().toDateString() === lastOrderDateString;
            console.log({hasOrdered, lastOrderDateString})

            const isSelector = req.user.id.toString() === selector._id.toString();

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
            if (req.body.isSelector === 'true'){
                res.redirect('/placement')
            }else{
                res.redirect('/orders')
            }
        }catch(err){
            console.log(err)
        }
    },
    resubmitOrder: async(req,res) => {
        try{
            const user = await User.findById(req.user.id).populate('group')

            const order = await Order.create({
                user: user._id,
                group: user.group._id,
                restaurant: user.group.selection,
                order: req.body.userOrderChanges,
                notes: req.body.notesChanges,
                createdAt: Date.now()
            })
            await Group.findByIdAndUpdate(user.group._id, {$pull: {orders: user.order}})
            await Group.findByIdAndUpdate(user.group._id, {$addToSet: {orders: order._id}})

            await User.findByIdAndUpdate(req.user.id, {order: order._id})

            console.log('users order id is updated')
            if (req.body.isSelector === 'true'){
                res.redirect('/placement')
            }else{
                res.redirect('/orders')
            }
        }catch(err){
            console.log(err)
        }
    },
    changeOrder: async (req,res) =>{
        try{
            const user = await User.findById(req.user.id).populate('group')

            const order = await Order.create({
                user: user._id,
                group: user.group._id,
                restaurant: user.group.selection,
                order: req.body.userOrderChanges,
                notes: req.body.notesChanges,
                createdAt: Date.now()
            })
            await Group.findByIdAndUpdate(user.group._id, {$pull: {orders: user.order}})
            await Group.findByIdAndUpdate(user.group._id, {$addToSet: {orders: order._id}})

            await User.findByIdAndUpdate(req.user.id, {order: order._id})

            console.log('users order id is updated')
            if (req.body.isSelector === 'true'){
                res.redirect('/placement')
            }else{
                res.redirect('/orders')
            }
        }catch(err){
            console.log(err)
        }
    },
}  