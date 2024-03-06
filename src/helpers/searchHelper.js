
const { Op } = require('sequelize')
const recentSearch = require("../app/SqlModels/RecentSearch");

const fs = require('fs');
const path = require('path');

module.exports = {


    search: async function (model = null, request, col = null) {

        let uid = request.user ? request.user.id : ''
        let params = request.query;
        let search = params.search ? params.search : null

        let lang = request.header('Accept-Language');
        lang = lang ? lang : 'en';
        let key = {}

        return new Promise((resolve, reject) => {

            if (model) {

                this.addSearch(search, model.name, uid)

                fs.readFile(path.join(__dirname, `./../i18n/${lang}.json`), function (err, resp) {
                    if (resp) {
                        key = JSON.parse(resp);
                        if (Object.keys(key).length) {
                            var filter = key.filter(vl => vl.value.includes(search))

                            langSearch = filter.map(el => {
                                return el.key
                            })
                            langSearch = langSearch ? langSearch : [search];
                        }
                    }

                    if (col) {

                        let clause = {};
                        if (search) {
                            clause[`${col}`] = {
                                [Op.in]: langSearch ? langSearch : []
                            }
                        }

                        model.findAll({
                            where: { ...clause }
                        }).then(data => {

                            if (data && data.length) {
                                if (Object.keys(key).length) {

                                    data.map(el => {
                                        let lng = key.find(vl => vl.key.toLowerCase() == el[`${col}`].toLowerCase());
                                        el[`${col}`] = lng ? lng.value : el[`${col}`];
                                    })
                                }
                                resolve({ message: "Data succesffully fetched", data: data })
                            } else {
                                resolve({ message: "No record found", data: data })
                            }
                        }).catch(err => {
                            console.log(err);
                            return resolve({ message: "Internal server error" })
                        })
                    } else {

                        model.findAll().then(data => {

                            resolve((data && data.length) ? data : [])

                        }).catch(err => {
                            console.log(err);
                            return resolve({ messgae: 'Internal Server Error.' })
                        })

                    }
                })
            }
        })

    },

    addSearch: async function (search = '', module = '', uid = '') {

        if (search) {

            recentSearch.findOne({
                where: {
                    key: search,
                    location: module
                },
                attributes: ['id']
            }).then(res => {
                if (!res) {
                    let post = new recentSearch({ key: search, location: module, userId: uid })
                    post.save();

                }

            })
        }
    },

}