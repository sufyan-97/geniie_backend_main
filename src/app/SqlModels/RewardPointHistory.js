// Libraries
const Sequelize = require('sequelize');

// Configs
const { sequelize_conn } = require('../../../config/database');


const RewardPointHistory = sequelize_conn.define('reward_point_history', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER, allowNull: false },
    relevantId: { type: Sequelize.INTEGER, allowNull: false },
    type: { type: Sequelize.STRING, allowNull: false },
    points: { type: Sequelize.INTEGER, allowNull: false },
    data: { type: Sequelize.TEXT },
}, {
    timestamps: true,
    freezeTableName: true,
    hooks: {
        afterFind: async function (rewardHistory, options) {
            if (rewardHistory && rewardHistory.length > 0) {
                rewardHistory.map(item => {
                    try {
                        if (item.data) {
                            item.data = JSON.parse(item.data)
                        }
                    } catch (error) {
                        console.log(error);
                    }
                })
            } else if (rewardHistory && Object.keys(rewardHistory).length > 0) {
                try {
                    if (rewardHistory.data) {
                        rewardHistory.data = JSON.parse(rewardHistory.data)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
},
)

module.exports = RewardPointHistory;