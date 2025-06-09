const Group = require('../models/Group')

module.exports = {
	getNextSelector: async (groupId,index,members) =>{
		try{
			if (index === members.length - 1){
				index = -1;
			}
			const group = await Group.findByIdAndUpdate(groupId, {
				selector: members[index + 1],
				selectorIndex: index + 1,
				selection: null,
				lastUpdated: new Date(),
			}, {new:true})
			console.log('next member selected')
			return group;
		}catch(err){
			console.log(err);
		}
	},
	clearOrders: async (groupId) => {
		try{
			const group = await Group.findById(groupId).populate('orders')
			const missedOrdersIds = group.orders
				.filter(order => !order.placed)
				.map(order => order._id);
			await Group.findByIdAndUpdate(groupId, {
				$addToSet: 
				{missedOrders: {$each:missedOrdersIds}},
				$set: {orders: []}
			})
			console.log('orders cleared')
		}catch(err){
			console.log(err)
		}
	}
}