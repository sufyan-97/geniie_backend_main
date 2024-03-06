// Libraries
const { Queue, Worker, QueueScheduler } = require('bullmq')

// Config
const redisClient = require('../../config/redis');

// Custom Libraries
const { sendEmailV2 } = require('./email')


const redisConfiguration = {
	connection: redisClient
}

const emailWorker = new Worker('emailWorker', function (job) {
	const { subject, message, to, template, templateData, isTemplateAttachment, attachmentFiles } = job.data;
	return new Promise((resolve, reject) => {
		sendEmailV2(subject, message, to, template ? template : null, templateData ? templateData : {}, isTemplateAttachment ? isTemplateAttachment : null, attachmentFiles ? attachmentFiles : []).then((emailResponse) => {
			return resolve(emailResponse)
		}).catch((error) => {
			return reject(error)
		})
	})
}, redisConfiguration);

emailWorker.on('completed', job => {
	console.info(`${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
	console.error(`${job.id} has failed with ${err.message}`);
});


module.exports = new Queue('emailWorker', redisConfiguration);