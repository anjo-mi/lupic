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
                    {path: 'orders',
                     populate:'user'},
                    {path: 'members'},
                ]
            });
            const {selection, selector, orders, members} = user.group || {};
            const isSelector = req.user.id.toString() === user.group.selector._id.toString();
            let allOrdersSubmitted = false;
            if (orders.length === members.length) allOrdersSubmitted = true;
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

            const group = await Group.findById(user.group).populate('orders');
            const unordered = group.orders.filter(order => !order.placed && order.createdAt.toDateString() === new Date().toDateString());
            const remainingOrders = unordered.length > 0;
            console.log(group.orders, {unordered, remainingOrders})
            console.log('The marked orders have been placed!')
            if (remainingOrders) res.redirect('/placement')
            else res.redirect('/groups')
        }catch(err){
            console.log(err)
        }
    },
}  