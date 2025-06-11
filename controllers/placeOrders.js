const Restaurant = require('../models/Restaurant')
const Group = require('../models/Group')
const User = require('../models/User')
const Order = require('../models/Order')

module.exports = {
    getGroupOrders: async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).populate({
                path: 'group',
                populate: [
                    {path: 'selection'},
                    {path: 'selector'},
                    {path: 'orders'},
                    {path: 'members'},
                ]
            });
            const {selection, selector, orders, members} = user.group || {};
            const isSelector = req.user.id.toString() === user.group.selector._id.toString();
            let allOrdersSubmitted = false;
            if (orders.length === members.length) allOrdersSubmitted = true;
            // console.log({isSelector, hasOrdered, selection, selector})
            res.render('placeOrders.ejs', {
                orders,
                selector,
                selection,
                isSelector,
                allOrdersSubmitted,
            })
        }catch(err){
            console.log(err)
        }
    },

    // this is now sorta real
    placeOrders: async (req, res)=>{
        try{
            const orderIds = Array.isArray(req.body.orderId) ? req.body.orderId : [req.body.orderId];
            const user = await User.findById(req.user.id);

            orderIds.forEach(async (el) => {
                await Order.findByIdAndUpdate(
                    el,
                    {$set: {placed: true}}
                )
            })

            console.log('The marked orders have been placed!')
            // maybe change this to placeOrders???
            res.redirect('/groupHome')
        }catch(err){
            console.log(err)
        }
    },
    // not real
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
    // not real
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
    // not real
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