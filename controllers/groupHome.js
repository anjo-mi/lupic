const Restaurant = require('../models/Restaurant')
const Group = require('../models/Group')
const User = require('../models/User')
const Reset = require('../helpers/groupReset')

module.exports = {
    getRestaurants: async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).populate([
                {
                path: 'group',
                populate: [
                    {path: 'selection'},
                    {path: 'selector'},
                    {path: 'restaurants'},
                    {path: 'orders'},
                    {path: 'members'},
                ]
                },
                {path: 'order'}
            ])
            if (!user.group) return res.redirect('/groups');
            
            
            let {
                order,
                group: {
                    _id: groupId,
                    members,
                    restaurants: groupRestaurants,
                    adminId,
                    selection,
                    selector,
                    orders,
                    lastUpdated,
                    selectorIndex
                }
            } = user

            if (!lastUpdated || lastUpdated.toDateString() !== new Date().toDateString()){
                await Reset.clearOrders(groupId);
                const updatedGroup = await Reset.getNextSelector(groupId, selectorIndex, members);
                selection = updatedGroup.selection;
                selector = updatedGroup.selector;
                orders = updatedGroup.orders;
            }


            const restItems = await Restaurant.find()
            const groupsRestIds = new Set(
                groupRestaurants.map(rest => rest._id.toString())
            );
            const otherRests = restItems.filter(rest => !groupsRestIds.has(rest._id.toString()));

            const isAdmin = adminId === req.user.id;
            const isSelector = selector._id.toString() === user._id.toString();

            const orderedToday = order.createdAt.toDateString() === new Date().toDateString();

            res.render('groupHome.ejs', {
                otherRests,
                groupRestaurants,
                isAdmin,
                selection,
                isSelector,
                orders,
                members,
                orderedToday,
                order,
                user
            })
        }catch(err){
            console.log(err)
        }
    },
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
    addExistingRestaurant: async (req, res)=>{
        try{
            await Group.findOneAndUpdate(
                {_id:req.user.group},
                {$addToSet: {restaurants: req.body.restId}}
            )
            console.log('Pre-existing Restaurant Added to Group')
            res.redirect('/groupHome')
        }catch(err){
            console.log(err)
        }
    },
    submitChoice: async (req,res) =>{
        try{
            const group = await Group.findOneAndUpdate(
                {_id:req.user.group},
                {selection:req.body.restId}
            )
            console.log('group selection marked')
            res.redirect('/orders')
        }catch(err){
            console.log(err)
        }
    },
    
    deleteRestaurant: async (req, res)=>{
        try{
            const user = await User.findById(req.user.id);

            const restIds = Array.isArray(req.body.restId) ? req.body.restId : [req.body.restId]

            const group = await Group.findByIdAndUpdate(
                user.group,
                {$pull: {restaurants: {$in: restIds}}},
                {new: true},
            )
            console.log('Deleted Restaurant(s)')
            res.redirect(`/groupHome`)
        }catch(err){
            console.log(err)
        }
    }
}   