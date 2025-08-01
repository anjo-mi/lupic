const Group = require('../models/Group')
const Order = require('../models/Order')
const User = require('../models/User')

module.exports = {
    getGroups: async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).populate([
                {
                    path: 'group',
                    populate: [
                        {path: 'selection'},
                        {path: 'selector'},
                        {path: 'restaurants'},
                    ]
                },
                {path: 'order'}
            ])
            const allGroups = await Group.find();
            
            const selection = user.group ? user.group.selection : null;
            const selector = user.group ? user.group.selector : null;
            const restaurants = user.group ? user.group.restaurants : null;
            const order = user.order ? user.order : null;
            // const {
            //     group: {
            //         selection,
            //         selector,
            //         restaurants
            //     },
            //     order
            // } = user;

            const orderedToday = order ? order.createdAt.toDateString() === new Date().toDateString() : false;
            const isSelector = selector ? selector._id.toString() === user._id.toString(): false;
            const group = user.group || null;

            console.log({restaurants,user,group})

            res.render('groups.ejs', {
                groups: allGroups,
                user,
                selection: selection || null,
                restaurants,
                isSelector,
                group,
                order,
                orderedToday,
                selector
            });
        }catch(err){
            console.log(err)
        }
    },
    createGroup: async (req, res)=>{
        try{
            const group = await Group.create({
                name: req.body.groupName,
                adminId: req.user.id,
                members: [req.user.id],
                restaurants: [],
            })
            if (!group) return res.status(404).json(`error creating group`)
            const user = await User.findOneAndUpdate(
                {_id:req.user.id},
                { group: group._id },
                {new:true}
            )
            if (!user) return res.status(404).json(`you may need to separately join the group now, the user's groups were not updated`)
            console.log(`${req.body.groupName} has been created, and ${req.user.userName} is now an administrator and member of it!`)
            res.redirect('/groupHome')
        }catch(err){
            console.log(err)
        }
    },
    joinGroup: async (req, res)=>{
        try{
            const updatedGroup = await Group.findOneAndUpdate(
                {_id:req.body.groupId},
                {$addToSet: {members: req.user.id}},
                {new:true}
            )
            if (!updatedGroup) return res.status(404).json(`you may need to repeat the operation, the group was not updated to reflect a new member`)
            const user = await User.findOneAndUpdate(
                {_id:req.user.id},
                { group: req.body.groupId },
                {new:true}
            )
            if (!user) return res.status(404).json(`you may need to repeat the operation, the user's groups were not successfully updated`)
            console.log('User has joined a new group!')
            res.redirect('/groupHome')
        }catch(err){
            console.log(err)
        }
    },
    removeMember: async (req, res)=>{
        try{
            await Group.findOneAndUpdate(
                {_id:req.body.groupId},
                {$pull: {members: req.user.id}}
            )
            console.log('User has left their group!')
            res.json('User has left their group!')
        }catch(err){
            console.log(err)
        }
    },
}   