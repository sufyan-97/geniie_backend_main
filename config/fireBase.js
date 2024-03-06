let admin = require("firebase-admin")
const SystemApp = require("../src/app/SqlModels/SystemApp");

let fireBaseAdmins = {}

function fireBase() {
  return new Promise((resolve, reject) => {
    SystemApp.findAll({
      where: {
        deleteStatus: false
      }
    }).then(data => {
      // console.log(data);
      if (data && data.length) {
        data.map(item => {
          let slug = item.slug
          let fireBaseJson = JSON.parse(item.fireBaseToken);
          let fireBaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(fireBaseJson),
            //   databaseURL: "https://sample-project-e1a84.firebaseio.com"
          }, slug)
          fireBaseAdmins[slug] = fireBaseAdmin
        })
        resolve(fireBaseAdmins)
      } else {
        resolve({})
      }
    }).catch(error => {
      console.log(error);
      resolve({})
    })
  })

}

module.exports = fireBase()