//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require("sequelize");

// Modals
const Country = require("../SqlModels/Country");
const State = require("../SqlModels/State");
const City = require("../SqlModels/City");
const Currency = require("../SqlModels/Currency");

exports.getOurRegions = async function (req, res) {
	Country.findAll({
		userDefined: "USer",
		where: {
			status: true,
		},
		include: [
			{
				model: State,
				where: {
					status: true,
				},
				include: [
					{
						model: City,
						where: {
							status: true,
						},
						required: false,
					},
				],
				required: false,
			},
			{
				model: Currency,
				required: false,
				attributes: ["currencyCode"],
			},
		],
	})
		.then((data) => {
			if (data && data.length) {
				let dataToSend = [];

				data.map((item) => {
					item = item.toJSON();
					// console.log(item);
					item.currencyCode = item.currency?.currencyCode;
					delete item.currency;
					dataToSend.push(item);
				});

				return res.send({
					message: "Data fetched successfully.",
					data: dataToSend,
				});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};

exports.getAllCountries = async function (req, res) {
	Country.findAll({
		where: {
			status: false,
		},
	})
		.then((data) => {
			if (data && data.length) {
				return res.send({
					message: "Data fetched successfully.",
					data: data,
				});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};

exports.getAllCountryStates = async function (req, res) {
	let countryId = req.params.countryId;
	Country.findOne({
		where: {
			id: countryId,
		},
	})
		.then((country) => {
			if (country) {
				State.findAll({
					where: {
						countryId: countryId,
						status: false,
					},
				})
					.then((data) => {
						if (data && data.length) {
							return res.send({
								message: "Data fetched successfully.",
								data: data,
							});
						} else {
							return res.send({
								message: "No data found.",
								data: [],
							});
						}
					})
					.catch((err) => {
						console.log(err);
						return respondWithError(req, res, '', null, 500)
					});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};

exports.getAllStateCities = async function (req, res) {
	let countryId = req.params.countryId;
	let stateId = req.params.stateId;
	Country.findOne({
		where: {
			id: countryId,
		},
	})
		.then((country) => {
			if (country) {
				State.findOne({
					where: {
						countryId: countryId,
						id: stateId,
					},
				})
					.then((state) => {
						if (state) {
							City.findAll({
								where: { stateId: stateId, status: false },
							})
								.then((data) => {
									if (data && data.length) {
										return res.send({
											message:
												"Data fetched successfully.",
											data: data,
										});
									} else {
										return res.send({
											message: "No data found.",
											data: [],
										});
									}
								})
								.catch((err) => {
									console.log(err);
									return respondWithError(req, res, '', null, 500)
								});
						} else {
							return res.send({
								message: "No data found.",
								data: [],
							});
						}
					})
					.catch((err) => {
						console.log(err);
						return respondWithError(req, res, '', null, 500)
					});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};
exports.getAllCurrencies = async function (req, res) {
	Currency.findAll({
		where: {
			currencyType: 'forex',
			status: true,
		},
	})
		.then((data) => {
			if (data && data.length) {
				// return
				return res.send({
					message: "Data fetched successfully.",
					data: data,
				});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};

exports.updateCountries = async function (req, res) {
	let ids = req.body.ids;
	let status = req.body.status;
	Country.findAll({
		where: {
			id: {
				[Op.in]: ids,
			},
		},
		include: {
			model: State,
			where: { status: true },
			required: false,
		},
	})
		.then((data) => {
			if (data && data.length) {
				data.map(async (item) => {
					item.status = status;
					if (status == "false" && item.states.length) {
						State.update(
							{ status: false },
							{ where: { countryId: item.id } }
						);
						let stateIds = item.states.map((item) => item.id);
						City.update(
							{ status: false },
							{ where: { stateId: { [Op.in]: stateIds } } }
						);
					}
					await item.save();
				});
				return res.send({
					message: "Data Updated successfully.",
					data: data,
				});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};

exports.updateCountryStates = async function (req, res) {
	let ids = req.body.ids;
	let status = req.body.status;
	let countryId = req.params.countryId;

	Country.findOne({
		where: {
			id: countryId,
		},
		include: [
			{
				model: State,
				where: {
					id: {
						[Op.in]: ids,
					},
				},
			},
		],
	})
		.then((data) => {
			if (data) {
				if (data.states) {
					data.states.map(async (item) => {
						item.status = status;
						if (status == "false") {
							City.update(
								{ status: false },
								{ where: { stateId: item.id } }
							);
						}
						await item.save();
					});
				}
				return res.send({
					message: "Data Added successfully.",
					data: data,
				});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};

exports.updateCountryStateCities = async function (req, res) {
	let ids = req.body.ids;
	let status = req.body.status;
	let countryId = req.params.countryId;
	let stateId = req.params.stateId;

	Country.findOne({
		where: {
			id: countryId,
		},
		include: [
			{
				model: State,
				where: {
					id: stateId,
				},
				include: [
					{
						model: City,
						where: {
							id: {
								[Op.in]: ids,
							},
						},
					},
				],
			},
		],
	})
		.then((data) => {
			if (data) {
				if (data.states) {
					if (data.states[0]) {
						data.states[0].cities.map(async (item) => {
							item.status = status;
							await item.save();
						});
					}
				}
				return res.send({
					message: "Data Added successfully.",
					data: data,
				});
			} else {
				return res.send({
					message: "No data found.",
					data: [],
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		});
};
