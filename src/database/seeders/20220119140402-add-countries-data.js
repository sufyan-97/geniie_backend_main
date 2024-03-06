'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('countries', [
			{
				countryName: "Israel",
				dialCode: "+972",
				countryCode: "IL",
				status: true
			},
			{
				countryName: "Afghanistan",
				dialCode: "+93",
				countryCode: "AF",
				status: true
			},
			{
				countryName: "Albania",
				dialCode: "+355",
				countryCode: "AL",
				status: true
			},
			{
				countryName: "Algeria",
				dialCode: "+213",
				countryCode: "DZ",
				status: true
			},
			{
				countryName: "AmericanSamoa",
				dialCode: "+1 684",
				countryCode: "AS",
				status: true
			},
			{
				countryName: "Andorra",
				dialCode: "+376",
				countryCode: "AD",
				status: true
			},
			{
				countryName: "Angola",
				dialCode: "+244",
				countryCode: "AO",
				status: true
			},
			{
				countryName: "Anguilla",
				dialCode: "+1 264",
				countryCode: "AI",
				status: true
			},
			{
				countryName: "Antigua and Barbuda",
				dialCode: "+1268",
				countryCode: "AG",
				status: true
			},
			{
				countryName: "Argentina",
				dialCode: "+54",
				countryCode: "AR",
				status: true
			},
			{
				countryName: "Armenia",
				dialCode: "+374",
				countryCode: "AM",
				status: true
			},
			{
				countryName: "Aruba",
				dialCode: "+297",
				countryCode: "AW",
				status: true
			},
			{
				countryName: "Australia",
				dialCode: "+61",
				countryCode: "AU",
				status: true
			},
			{
				countryName: "Austria",
				dialCode: "+43",
				countryCode: "AT",
				status: true
			},
			{
				countryName: "Azerbaijan",
				dialCode: "+994",
				countryCode: "AZ",
				status: true
			},
			{
				countryName: "Bahamas",
				dialCode: "+1 242",
				countryCode: "BS",
				status: true
			},
			{
				countryName: "Bahrain",
				dialCode: "+973",
				countryCode: "BH",
				status: true
			},
			{
				countryName: "Bangladesh",
				dialCode: "+880",
				countryCode: "BD",
				status: true
			},
			{
				countryName: "Barbados",
				dialCode: "+1 246",
				countryCode: "BB",
				status: true
			},
			{
				countryName: "Belarus",
				dialCode: "+375",
				countryCode: "BY",
				status: true
			},
			{
				countryName: "Belgium",
				dialCode: "+32",
				countryCode: "BE",
				status: true
			},
			{
				countryName: "Belize",
				dialCode: "+501",
				countryCode: "BZ",
				status: true
			},
			{
				countryName: "Benin",
				dialCode: "+229",
				countryCode: "BJ",
				status: true
			},
			{
				countryName: "Bermuda",
				dialCode: "+1 441",
				countryCode: "BM",
				status: true
			},
			{
				countryName: "Bhutan",
				dialCode: "+975",
				countryCode: "BT",
				status: true
			},
			{
				countryName: "Bosnia and Herzegovina",
				dialCode: "+387",
				countryCode: "BA",
				status: true
			},
			{
				countryName: "Botswana",
				dialCode: "+267",
				countryCode: "BW",
				status: true
			},
			{
				countryName: "Brazil",
				dialCode: "+55",
				countryCode: "BR",
				status: true
			},
			{
				countryName: "British Indian Ocean Territory",
				dialCode: "+246",
				countryCode: "IO",
				status: true
			},
			{
				countryName: "Bulgaria",
				dialCode: "+359",
				countryCode: "BG",
				status: true
			},
			{
				countryName: "Burkina Faso",
				dialCode: "+226",
				countryCode: "BF",
				status: true
			},
			{
				countryName: "Burundi",
				dialCode: "+257",
				countryCode: "BI",
				status: true
			},
			{
				countryName: "Cambodia",
				dialCode: "+855",
				countryCode: "KH",
				status: true
			},
			{
				countryName: "Cameroon",
				dialCode: "+237",
				countryCode: "CM",
				status: true
			},
			{
				countryName: "Canada",
				dialCode: "+1",
				countryCode: "CA",
				status: true
			},
			{
				countryName: "Cape Verde",
				dialCode: "+238",
				countryCode: "CV",
				status: true
			},
			{
				countryName: "Cayman Islands",
				dialCode: "+ 345",
				countryCode: "KY",
				status: true
			},
			{
				countryName: "Central African Republic",
				dialCode: "+236",
				countryCode: "CF",
				status: true
			},
			{
				countryName: "Chad",
				dialCode: "+235",
				countryCode: "TD",
				status: true
			},
			{
				countryName: "Chile",
				dialCode: "+56",
				countryCode: "CL",
				status: true
			},
			{
				countryName: "China",
				dialCode: "+86",
				countryCode: "CN",
				status: true
			},
			{
				countryName: "Christmas Island",
				dialCode: "+61",
				countryCode: "CX",
				status: true
			},
			{
				countryName: "Colombia",
				dialCode: "+57",
				countryCode: "CO",
				status: true
			},
			{
				countryName: "Comoros",
				dialCode: "+269",
				countryCode: "KM",
				status: true
			},
			{
				countryName: "Congo",
				dialCode: "+242",
				countryCode: "CG",
				status: true
			},
			{
				countryName: "Cook Islands",
				dialCode: "+682",
				countryCode: "CK",
				status: true
			},
			{
				countryName: "Costa Rica",
				dialCode: "+506",
				countryCode: "CR",
				status: true
			},
			{
				countryName: "Croatia",
				dialCode: "+385",
				countryCode: "HR",
				status: true
			},
			{
				countryName: "Cuba",
				dialCode: "+53",
				countryCode: "CU",
				status: true
			},
			{
				countryName: "Cyprus",
				dialCode: "+537",
				countryCode: "CY",
				status: true
			},
			{
				countryName: "Czech Republic",
				dialCode: "+420",
				countryCode: "CZ",
				status: true
			},
			{
				countryName: "Denmark",
				dialCode: "+45",
				countryCode: "DK",
				status: true
			},
			{
				countryName: "Djibouti",
				dialCode: "+253",
				countryCode: "DJ",
				status: true
			},
			{
				countryName: "Dominica",
				dialCode: "+1 767",
				countryCode: "DM",
				status: true
			},
			{
				countryName: "Dominican Republic",
				dialCode: "+1 849",
				countryCode: "DO",
				status: true
			},
			{
				countryName: "Ecuador",
				dialCode: "+593",
				countryCode: "EC",
				status: true
			},
			{
				countryName: "Egypt",
				dialCode: "+20",
				countryCode: "EG",
				status: true
			},
			{
				countryName: "El Salvador",
				dialCode: "+503",
				countryCode: "SV",
				status: true
			},
			{
				countryName: "Equatorial Guinea",
				dialCode: "+240",
				countryCode: "GQ",
				status: true
			},
			{
				countryName: "Eritrea",
				dialCode: "+291",
				countryCode: "ER",
				status: true
			},
			{
				countryName: "Estonia",
				dialCode: "+372",
				countryCode: "EE",
				status: true
			},
			{
				countryName: "Ethiopia",
				dialCode: "+251",
				countryCode: "ET",
				status: true
			},
			{
				countryName: "Faroe Islands",
				dialCode: "+298",
				countryCode: "FO",
				status: true
			},
			{
				countryName: "Fiji",
				dialCode: "+679",
				countryCode: "FJ",
				status: true
			},
			{
				countryName: "Finland",
				dialCode: "+358",
				countryCode: "FI",
				status: true
			},
			{
				countryName: "France",
				dialCode: "+33",
				countryCode: "FR",
				status: true
			},
			{
				countryName: "French Guiana",
				dialCode: "+594",
				countryCode: "GF",
				status: true
			},
			{
				countryName: "French Polynesia",
				dialCode: "+689",
				countryCode: "PF",
				status: true
			},
			{
				countryName: "Gabon",
				dialCode: "+241",
				countryCode: "GA",
				status: true
			},
			{
				countryName: "Gambia",
				dialCode: "+220",
				countryCode: "GM",
				status: true
			},
			{
				countryName: "Georgia",
				dialCode: "+995",
				countryCode: "GE",
				status: true
			},
			{
				countryName: "Germany",
				dialCode: "+49",
				countryCode: "DE",
				status: true
			},
			{
				countryName: "Ghana",
				dialCode: "+233",
				countryCode: "GH",
				status: true
			},
			{
				countryName: "Gibraltar",
				dialCode: "+350",
				countryCode: "GI",
				status: true
			},
			{
				countryName: "Greece",
				dialCode: "+30",
				countryCode: "GR",
				status: true
			},
			{
				countryName: "Greenland",
				dialCode: "+299",
				countryCode: "GL",
				status: true
			},
			{
				countryName: "Grenada",
				dialCode: "+1 473",
				countryCode: "GD",
				status: true
			},
			{
				countryName: "Guadeloupe",
				dialCode: "+590",
				countryCode: "GP",
				status: true
			},
			{
				countryName: "Guam",
				dialCode: "+1 671",
				countryCode: "GU",
				status: true
			},
			{
				countryName: "Guatemala",
				dialCode: "+502",
				countryCode: "GT",
				status: true
			},
			{
				countryName: "Guinea",
				dialCode: "+224",
				countryCode: "GN",
				status: true
			},
			{
				countryName: "Guinea-Bissau",
				dialCode: "+245",
				countryCode: "GW",
				status: true
			},
			{
				countryName: "Guyana",
				dialCode: "+595",
				countryCode: "GY",
				status: true
			},
			{
				countryName: "Haiti",
				dialCode: "+509",
				countryCode: "HT",
				status: true
			},
			{
				countryName: "Honduras",
				dialCode: "+504",
				countryCode: "HN",
				status: true
			},
			{
				countryName: "Hungary",
				dialCode: "+36",
				countryCode: "HU",
				status: true
			},
			{
				countryName: "Iceland",
				dialCode: "+354",
				countryCode: "IS",
				status: true
			},
			{
				countryName: "India",
				dialCode: "+91",
				countryCode: "IN",
				status: true
			},
			{
				countryName: "Indonesia",
				dialCode: "+62",
				countryCode: "ID",
				status: true
			},
			{
				countryName: "Iraq",
				dialCode: "+964",
				countryCode: "IQ",
				status: true
			},
			{
				countryName: "Ireland",
				dialCode: "+353",
				countryCode: "IE",
				status: true
			},
			{
				countryName: "Israel",
				dialCode: "+972",
				countryCode: "IL",
				status: true
			},
			{
				countryName: "Italy",
				dialCode: "+39",
				countryCode: "IT",
				status: true
			},
			{
				countryName: "Jamaica",
				dialCode: "+1 876",
				countryCode: "JM",
				status: true
			},
			{
				countryName: "Japan",
				dialCode: "+81",
				countryCode: "JP",
				status: true
			},
			{
				countryName: "Jordan",
				dialCode: "+962",
				countryCode: "JO",
				status: true
			},
			{
				countryName: "Kazakhstan",
				dialCode: "+7 7",
				countryCode: "KZ",
				status: true
			},
			{
				countryName: "Kenya",
				dialCode: "+254",
				countryCode: "KE",
				status: true
			},
			{
				countryName: "Kiribati",
				dialCode: "+686",
				countryCode: "KI",
				status: true
			},
			{
				countryName: "Kuwait",
				dialCode: "+965",
				countryCode: "KW",
				status: true
			},
			{
				countryName: "Kyrgyzstan",
				dialCode: "+996",
				countryCode: "KG",
				status: true
			},
			{
				countryName: "Latvia",
				dialCode: "+371",
				countryCode: "LV",
				status: true
			},
			{
				countryName: "Lebanon",
				dialCode: "+961",
				countryCode: "LB",
				status: true
			},
			{
				countryName: "Lesotho",
				dialCode: "+266",
				countryCode: "LS",
				status: true
			},
			{
				countryName: "Liberia",
				dialCode: "+231",
				countryCode: "LR",
				status: true
			},
			{
				countryName: "Liechtenstein",
				dialCode: "+423",
				countryCode: "LI",
				status: true
			},
			{
				countryName: "Lithuania",
				dialCode: "+370",
				countryCode: "LT",
				status: true
			},
			{
				countryName: "Luxembourg",
				dialCode: "+352",
				countryCode: "LU",
				status: true
			},
			{
				countryName: "Madagascar",
				dialCode: "+261",
				countryCode: "MG",
				status: true
			},
			{
				countryName: "Malawi",
				dialCode: "+265",
				countryCode: "MW",
				status: true
			},
			{
				countryName: "Malaysia",
				dialCode: "+60",
				countryCode: "MY",
				status: true
			},
			{
				countryName: "Maldives",
				dialCode: "+960",
				countryCode: "MV",
				status: true
			},
			{
				countryName: "Mali",
				dialCode: "+223",
				countryCode: "ML",
				status: true
			},
			{
				countryName: "Malta",
				dialCode: "+356",
				countryCode: "MT",
				status: true
			},
			{
				countryName: "Marshall Islands",
				dialCode: "+692",
				countryCode: "MH",
				status: true
			},
			{
				countryName: "Martinique",
				dialCode: "+596",
				countryCode: "MQ",
				status: true
			},
			{
				countryName: "Mauritania",
				dialCode: "+222",
				countryCode: "MR",
				status: true
			},
			{
				countryName: "Mauritius",
				dialCode: "+230",
				countryCode: "MU",
				status: true
			},
			{
				countryName: "Mayotte",
				dialCode: "+262",
				countryCode: "YT",
				status: true
			},
			{
				countryName: "Mexico",
				dialCode: "+52",
				countryCode: "MX",
				status: true
			},
			{
				countryName: "Monaco",
				dialCode: "+377",
				countryCode: "MC",
				status: true
			},
			{
				countryName: "Mongolia",
				dialCode: "+976",
				countryCode: "MN",
				status: true
			},
			{
				countryName: "Montenegro",
				dialCode: "+382",
				countryCode: "ME",
				status: true
			},
			{
				countryName: "Montserrat",
				dialCode: "+1664",
				countryCode: "MS",
				status: true
			},
			{
				countryName: "Morocco",
				dialCode: "+212",
				countryCode: "MA",
				status: true
			},
			{
				countryName: "Myanmar",
				dialCode: "+95",
				countryCode: "MM",
				status: true
			},
			{
				countryName: "Namibia",
				dialCode: "+264",
				countryCode: "NA",
				status: true
			},
			{
				countryName: "Nauru",
				dialCode: "+674",
				countryCode: "NR",
				status: true
			},
			{
				countryName: "Nepal",
				dialCode: "+977",
				countryCode: "NP",
				status: true
			},
			{
				countryName: "Netherlands",
				dialCode: "+31",
				countryCode: "NL",
				status: true
			},
			{
				countryName: "Netherlands Antilles",
				dialCode: "+599",
				countryCode: "AN",
				status: true
			},
			{
				countryName: "New Caledonia",
				dialCode: "+687",
				countryCode: "NC",
				status: true
			},
			{
				countryName: "New Zealand",
				dialCode: "+64",
				countryCode: "NZ",
				status: true
			},
			{
				countryName: "Nicaragua",
				dialCode: "+505",
				countryCode: "NI",
				status: true
			},
			{
				countryName: "Niger",
				dialCode: "+227",
				countryCode: "NE",
				status: true
			},
			{
				countryName: "Nigeria",
				dialCode: "+234",
				countryCode: "NG",
				status: true
			},
			{
				countryName: "Niue",
				dialCode: "+683",
				countryCode: "NU",
				status: true
			},
			{
				countryName: "Norfolk Island",
				dialCode: "+672",
				countryCode: "NF",
				status: true
			},
			{
				countryName: "Northern Mariana Islands",
				dialCode: "+1 670",
				countryCode: "MP",
				status: true
			},
			{
				countryName: "Norway",
				dialCode: "+47",
				countryCode: "NO",
				status: true
			},
			{
				countryName: "Oman",
				dialCode: "+968",
				countryCode: "OM",
				status: true
			},
			{
				countryName: "Pakistan",
				dialCode: "+92",
				countryCode: "PK",
				status: true
			},
			{
				countryName: "Palau",
				dialCode: "+680",
				countryCode: "PW",
				status: true
			},
			{
				countryName: "Panama",
				dialCode: "+507",
				countryCode: "PA",
				status: true
			},
			{
				countryName: "Papua New Guinea",
				dialCode: "+675",
				countryCode: "PG",
				status: true
			},
			{
				countryName: "Paraguay",
				dialCode: "+595",
				countryCode: "PY",
				status: true
			},
			{
				countryName: "Peru",
				dialCode: "+51",
				countryCode: "PE",
				status: true
			},
			{
				countryName: "Philippines",
				dialCode: "+63",
				countryCode: "PH",
				status: true
			},
			{
				countryName: "Poland",
				dialCode: "+48",
				countryCode: "PL",
				status: true
			},
			{
				countryName: "Portugal",
				dialCode: "+351",
				countryCode: "PT",
				status: true
			},
			{
				countryName: "Puerto Rico",
				dialCode: "+1 939",
				countryCode: "PR",
				status: true
			},
			{
				countryName: "Qatar",
				dialCode: "+974",
				countryCode: "QA",
				status: true
			},
			{
				countryName: "Romania",
				dialCode: "+40",
				countryCode: "RO",
				status: true
			},
			{
				countryName: "Rwanda",
				dialCode: "+250",
				countryCode: "RW",
				status: true
			},
			{
				countryName: "Samoa",
				dialCode: "+685",
				countryCode: "WS",
				status: true
			},
			{
				countryName: "San Marino",
				dialCode: "+378",
				countryCode: "SM",
				status: true
			},
			{
				countryName: "Saudi Arabia",
				dialCode: "+966",
				countryCode: "SA",
				status: true
			},
			{
				countryName: "Senegal",
				dialCode: "+221",
				countryCode: "SN",
				status: true
			},
			{
				countryName: "Serbia",
				dialCode: "+381",
				countryCode: "RS",
				status: true
			},
			{
				countryName: "Seychelles",
				dialCode: "+248",
				countryCode: "SC",
				status: true
			},
			{
				countryName: "Sierra Leone",
				dialCode: "+232",
				countryCode: "SL",
				status: true
			},
			{
				countryName: "Singapore",
				dialCode: "+65",
				countryCode: "SG",
				status: true
			},
			{
				countryName: "Slovakia",
				dialCode: "+421",
				countryCode: "SK",
				status: true
			},
			{
				countryName: "Slovenia",
				dialCode: "+386",
				countryCode: "SI",
				status: true
			},
			{
				countryName: "Solomon Islands",
				dialCode: "+677",
				countryCode: "SB",
				status: true
			},
			{
				countryName: "South Africa",
				dialCode: "+27",
				countryCode: "ZA",
				status: true
			},
			{
				countryName: "South Georgia and the South Sandwich Islands",
				dialCode: "+500",
				countryCode: "GS",
				status: true
			},
			{
				countryName: "Spain",
				dialCode: "+34",
				countryCode: "ES",
				status: true
			},
			{
				countryName: "Sri Lanka",
				dialCode: "+94",
				countryCode: "LK",
				status: true
			},
			{
				countryName: "Sudan",
				dialCode: "+249",
				countryCode: "SD",
				status: true
			},
			{
				countryName: "Suriname",
				dialCode: "+597",
				countryCode: "SR",
				status: true
			},
			{
				countryName: "Swaziland",
				dialCode: "+268",
				countryCode: "SZ",
				status: true
			},
			{
				countryName: "Sweden",
				dialCode: "+46",
				countryCode: "SE",
				status: true
			},
			{
				countryName: "Switzerland",
				dialCode: "+41",
				countryCode: "CH",
				status: true
			},
			{
				countryName: "Tajikistan",
				dialCode: "+992",
				countryCode: "TJ",
				status: true
			},
			{
				countryName: "Thailand",
				dialCode: "+66",
				countryCode: "TH",
				status: true
			},
			{
				countryName: "Togo",
				dialCode: "+228",
				countryCode: "TG",
				status: true
			},
			{
				countryName: "Tokelau",
				dialCode: "+690",
				countryCode: "TK",
				status: true
			},
			{
				countryName: "Tonga",
				dialCode: "+676",
				countryCode: "TO",
				status: true
			},
			{
				countryName: "Trinidad and Tobago",
				dialCode: "+1 868",
				countryCode: "TT",
				status: true
			},
			{
				countryName: "Tunisia",
				dialCode: "+216",
				countryCode: "TN",
				status: true
			},
			{
				countryName: "Turkey",
				dialCode: "+90",
				countryCode: "TR",
				status: true
			},
			{
				countryName: "Turkmenistan",
				dialCode: "+993",
				countryCode: "TM",
				status: true
			},
			{
				countryName: "Turks and Caicos Islands",
				dialCode: "+1 649",
				countryCode: "TC",
				status: true
			},
			{
				countryName: "Tuvalu",
				dialCode: "+688",
				countryCode: "TV",
				status: true
			},
			{
				countryName: "Uganda",
				dialCode: "+256",
				countryCode: "UG",
				status: true
			},
			{
				countryName: "Ukraine",
				dialCode: "+380",
				countryCode: "UA",
				status: true
			},
			{
				countryName: "United Arab Emirates",
				dialCode: "+971",
				countryCode: "AE",
				status: true
			},
			{
				countryName: "United Kingdom",
				dialCode: "+44",
				countryCode: "GB",
				status: true
			},
			{
				countryName: "United States",
				dialCode: "+1",
				countryCode: "US",
				status: true
			},
			{
				countryName: "Uruguay",
				dialCode: "+598",
				countryCode: "UY",
				status: true
			},
			{
				countryName: "Uzbekistan",
				dialCode: "+998",
				countryCode: "UZ",
				status: true
			},
			{
				countryName: "Vanuatu",
				dialCode: "+678",
				countryCode: "VU",
				status: true
			},
			{
				countryName: "Wallis and Futuna",
				dialCode: "+681",
				countryCode: "WF",
				status: true
			},
			{
				countryName: "Yemen",
				dialCode: "+967",
				countryCode: "YE",
				status: true
			},
			{
				countryName: "Zambia",
				dialCode: "+260",
				countryCode: "ZM",
				status: true
			},
			{
				countryName: "Zimbabwe",
				dialCode: "+263",
				countryCode: "ZW",
				status: true
			},
			{
				countryName: "land Islands",
				dialCode: "",
				countryCode: "AX",
				status: true
			},
			{
				countryName: "Antarctica",
				dialCode: null,
				countryCode: "AQ",
				status: true
			},
			{
				countryName: "Bolivia, Plurinational State of",
				dialCode: "+591",
				countryCode: "BO",
				status: true
			},
			{
				countryName: "Brunei Darussalam",
				dialCode: "+673",
				countryCode: "BN",
				status: true
			},
			{
				countryName: "Cocos (Keeling) Islands",
				dialCode: "+61",
				countryCode: "CC",
				status: true
			},
			{
				countryName: "Congo, The Democratic Republic of the",
				dialCode: "+243",
				countryCode: "CD",
				status: true
			},
			{
				countryName: "Cote d'Ivoire",
				dialCode: "+225",
				countryCode: "CI",
				status: true
			},
			{
				countryName: "Falkland Islands (Malvinas)",
				dialCode: "+500",
				countryCode: "FK",
				status: true
			},
			{
				countryName: "Guernsey",
				dialCode: "+44",
				countryCode: "GG",
				status: true
			},
			{
				countryName: "Holy See (Vatican City State)",
				dialCode: "+379",
				countryCode: "VA",
				status: true
			},
			{
				countryName: "Hong Kong",
				dialCode: "+852",
				countryCode: "HK",
				status: true
			},
			{
				countryName: "Iran, Islamic Republic of",
				dialCode: "+98",
				countryCode: "IR",
				status: true
			},
			{
				countryName: "Isle of Man",
				dialCode: "+44",
				countryCode: "IM",
				status: true
			},
			{
				countryName: "Jersey",
				dialCode: "+44",
				countryCode: "JE",
				status: true
			},
			{
				countryName: "Korea, Democratic People's Republic of",
				dialCode: "+850",
				countryCode: "KP",
				status: true
			},
			{
				countryName: "Korea, Republic of",
				dialCode: "+82",
				countryCode: "KR",
				status: true
			},
			{
				countryName: "Lao People's Democratic Republic",
				dialCode: "+856",
				countryCode: "LA",
				status: true
			},
			{
				countryName: "Libyan Arab Jamahiriya",
				dialCode: "+218",
				countryCode: "LY",
				status: true
			},
			{
				countryName: "Macao",
				dialCode: "+853",
				countryCode: "MO",
				status: true
			},
			{
				countryName: "Macedonia, The Former Yugoslav Republic of",
				dialCode: "+389",
				countryCode: "MK",
				status: true
			},
			{
				countryName: "Micronesia, Federated States of",
				dialCode: "+691",
				countryCode: "FM",
				status: true
			},
			{
				countryName: "Moldova, Republic of",
				dialCode: "+373",
				countryCode: "MD",
				status: true
			},
			{
				countryName: "Mozambique",
				dialCode: "+258",
				countryCode: "MZ",
				status: true
			},
			{
				countryName: "Palestinian Territory, Occupied",
				dialCode: "+970",
				countryCode: "PS",
				status: true
			},
			{
				countryName: "Pitcairn",
				dialCode: "+872",
				countryCode: "PN",
				status: true
			},
			{
				countryName: "Réunion",
				dialCode: "+262",
				countryCode: "RE",
				status: true
			},
			{
				countryName: "Russia",
				dialCode: "+7",
				countryCode: "RU",
				status: true
			},
			{
				countryName: "Saint Barthélemy",
				dialCode: "+590",
				countryCode: "BL",
				status: true
			},
			{
				countryName: "Saint Helena, Ascension and Tristan Da Cunha",
				dialCode: "+290",
				countryCode: "SH",
				status: true
			},
			{
				countryName: "Saint Kitts and Nevis",
				dialCode: "+1 869",
				countryCode: "KN",
				status: true
			},
			{
				countryName: "Saint Lucia",
				dialCode: "+1 758",
				countryCode: "LC",
				status: true
			},
			{
				countryName: "Saint Martin",
				dialCode: "+590",
				countryCode: "MF",
				status: true
			},
			{
				countryName: "Saint Pierre and Miquelon",
				dialCode: "+508",
				countryCode: "PM",
				status: true
			},
			{
				countryName: "Saint Vincent and the Grenadines",
				dialCode: "+1 784",
				countryCode: "VC",
				status: true
			},
			{
				countryName: "Sao Tome and Principe",
				dialCode: "+239",
				countryCode: "ST",
				status: true
			},
			{
				countryName: "Somalia",
				dialCode: "+252",
				countryCode: "SO",
				status: true
			},
			{
				countryName: "Svalbard and Jan Mayen",
				dialCode: "+47",
				countryCode: "SJ",
				status: true
			},
			{
				countryName: "Syrian Arab Republic",
				dialCode: "+963",
				countryCode: "SY",
				status: true
			},
			{
				countryName: "Taiwan, Province of China",
				dialCode: "+886",
				countryCode: "TW",
				status: true
			},
			{
				countryName: "Tanzania, United Republic of",
				dialCode: "+255",
				countryCode: "TZ",
				status: true
			},
			{
				countryName: "Timor-Leste",
				dialCode: "+670",
				countryCode: "TL",
				status: true
			},
			{
				countryName: "Venezuela, Bolivarian Republic of",
				dialCode: "+58",
				countryCode: "VE",
				status: true
			},
			{
				countryName: "Viet Nam",
				dialCode: "+84",
				countryCode: "VN",
				status: true
			},
			{
				countryName: "Virgin Islands, British",
				dialCode: "+1 284",
				countryCode: "VG",
				status: true
			},
			{
				countryName: "Virgin Islands, U.S.",
				dialCode: "+1 340",
				countryCode: "VI",
				status: true
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
