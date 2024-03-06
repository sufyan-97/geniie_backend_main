'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('currencies', [
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Leke",
				currencyCode: "ALL",
				currencySymbol: "Lek",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "US Dollar",
				currencyCode: "USD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Afghanis",
				currencyCode: "AFN",
				currencySymbol: "؋",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "ARS",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Guilders",
				currencyCode: "AWG",
				currencySymbol: "ƒ",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "AUD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "New Manats",
				currencyCode: "AZN",
				currencySymbol: "ман",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "BSD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "BBD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rubles",
				currencyCode: "BYR",
				currencySymbol: "p.",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "Euro",
				currencyCode: "EUR",
				currencySymbol: "€",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "BZD",
				currencySymbol: "BZ$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "BMD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Bolivianos",
				currencyCode: "BOB",
				currencySymbol: "$b",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Convertible Marka",
				currencyCode: "BAM",
				currencySymbol: "KM",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pula",
				currencyCode: "BWP",
				currencySymbol: "P",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Leva",
				currencyCode: "BGN",
				currencySymbol: "лв",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Reais",
				currencyCode: "BRL",
				currencySymbol: "R$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "GBP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "BND",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Riels",
				currencyCode: "KHR",
				currencySymbol: "៛",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "Dollars",
				currencyCode: "CAD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "KYD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "CLP",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "Yuan Renminbi",
				currencyCode: "CNY",
				currencySymbol: "¥",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "COP",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Colón",
				currencyCode: "CRC",
				currencySymbol: "₡",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Kuna",
				currencyCode: "HRK",
				currencySymbol: "kn",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "CUP",
				currencySymbol: "₱",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Koruny",
				currencyCode: "CZK",
				currencySymbol: "Kč",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Kroner",
				currencyCode: "DKK",
				currencySymbol: "kr",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "DOP ",
				currencySymbol: "RD$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "XCD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "EGP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Colones",
				currencyCode: "SVC",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "FKP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "FJD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Cedis",
				currencyCode: "GHC",
				currencySymbol: "¢",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "GIP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Quetzales",
				currencyCode: "GTQ",
				currencySymbol: "Q",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "GGP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "GYD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Lempiras",
				currencyCode: "HNL",
				currencySymbol: "L",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "Dollars",
				currencyCode: "HKD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Forint",
				currencyCode: "HUF",
				currencySymbol: "Ft",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Kronur",
				currencyCode: "ISK",
				currencySymbol: "kr",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupees",
				currencyCode: "INR",
				currencySymbol: "Rp",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupiahs",
				currencyCode: "IDR",
				currencySymbol: "Rp",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rials",
				currencyCode: "IRR",
				currencySymbol: "﷼",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "IMP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "New Shekels",
				currencyCode: "ILS",
				currencySymbol: "₪",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "JMD",
				currencySymbol: "J$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Yen",
				currencyCode: "JPY",
				currencySymbol: "¥",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "JEP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Tenge",
				currencyCode: "KZT",
				currencySymbol: "лв",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Won",
				currencyCode: "KPW",
				currencySymbol: "₩",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Won",
				currencyCode: "KRW",
				currencySymbol: "₩",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Soms",
				currencyCode: "KGS",
				currencySymbol: "лв",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Kips",
				currencyCode: "LAK",
				currencySymbol: "₭",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Lati",
				currencyCode: "LVL",
				currencySymbol: "Ls",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "LBP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "LRD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Switzerland Francs",
				currencyCode: "CHF",
				currencySymbol: "CHF",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Litai",
				currencyCode: "LTL",
				currencySymbol: "Lt",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Denars",
				currencyCode: "MKD",
				currencySymbol: "ден",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Ringgits",
				currencyCode: "MYR",
				currencySymbol: "RM",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupees",
				currencyCode: "MUR",
				currencySymbol: "₨",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "MXN",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Tugriks",
				currencyCode: "MNT",
				currencySymbol: "₮",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Meticais",
				currencyCode: "MZN",
				currencySymbol: "MT",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "NAD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupees",
				currencyCode: "NPR",
				currencySymbol: "₨",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Guilders",
				currencyCode: "ANG",
				currencySymbol: "ƒ",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "NZD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Cordobas",
				currencyCode: "NIO",
				currencySymbol: "C$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Nairas",
				currencyCode: "NGN",
				currencySymbol: "₦",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Krone",
				currencyCode: "NOK",
				currencySymbol: "kr",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rials",
				currencyCode: "OMR",
				currencySymbol: "﷼",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupees",
				currencyCode: "PKR",
				currencySymbol: "₨",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Balboa",
				currencyCode: "PAB",
				currencySymbol: "B/.",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Guarani",
				currencyCode: "PYG",
				currencySymbol: "Gs",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Nuevos Soles",
				currencyCode: "PEN",
				currencySymbol: "S/.",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "PHP",
				currencySymbol: "Php",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Zlotych",
				currencyCode: "PLN",
				currencySymbol: "zł",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rials",
				currencyCode: "QAR",
				currencySymbol: "﷼",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "New Lei",
				currencyCode: "RON",
				currencySymbol: "lei",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rubles",
				currencyCode: "RUB",
				currencySymbol: "руб",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "SHP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Riyals",
				currencyCode: "SAR",
				currencySymbol: "﷼",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dinars",
				currencyCode: "RSD",
				currencySymbol: "Дин.",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupees",
				currencyCode: "SCR",
				currencySymbol: "₨",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "SGD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "SBD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Shillings",
				currencyCode: "SOS",
				currencySymbol: "S",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rand",
				currencyCode: "ZAR",
				currencySymbol: "R",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rupees",
				currencyCode: "LKR",
				currencySymbol: "₨",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Kronor",
				currencyCode: "SEK",
				currencySymbol: "kr",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "SRD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pounds",
				currencyCode: "SYP",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "New Taiwan Dollar",
				currencyCode: "TWD",
				currencySymbol: "NT$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Baht",
				currencyCode: "THB",
				currencySymbol: "฿",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "TTD",
				currencySymbol: "TT$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Lira",
				currencyCode: "TRY",
				currencySymbol: "₺",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Liras",
				currencyCode: "TRL",
				currencySymbol: "£",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Dollars",
				currencyCode: "TVD",
				currencySymbol: "$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Hryvnia",
				currencyCode: "UAH",
				currencySymbol: "₴",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Pesos",
				currencyCode: "UYU",
				currencySymbol: "$U",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Sums",
				currencyCode: "UZS",
				currencySymbol: "лв",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Bolivares Fuertes",
				currencyCode: "VEF",
				currencySymbol: "Bs",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 1,
				currencyName: "Dong",
				currencyCode: "VND",
				currencySymbol: "₫",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Rials",
				currencyCode: "YER",
				currencySymbol: "﷼",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "forex",
				enable: 0,
				currencyName: "Zimbabwe Dollars",
				currencyCode: "ZWD",
				currencySymbol: "Z$",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "crypto",
				enable: 1,
				currencyName: "Bitcoin",
				currencyCode: "BTC",
				currencySymbol: "฿",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "crypto",
				enable: 1,
				currencyName: "Bitcoin Cash",
				currencyCode: "BCH",
				currencySymbol: "BCH",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "crypto",
				enable: 1,
				currencyName: "Litecoin\r\n",
				currencyCode: "LTC",
				currencySymbol: "Ł",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "crypto",
				enable: 1,
				currencyName: "Tether USD (Omni layer)",
				currencyCode: "USDT",
				currencySymbol: "₮",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "crypto",
				enable: 1,
				currencyName: "Ripple",
				currencyCode: "XRP",
				currencySymbol: "x",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			},
			{
				currencyType: "crypto",
				enable: 1,
				currencyName: "Ethereum",
				currencyCode: "ETH",
				currencySymbol: "Ξ\r\n",
				currencyUnicode: null,
				currencyHexcode: null,
				currencyHtmlSymbol: null
			}
		])
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
