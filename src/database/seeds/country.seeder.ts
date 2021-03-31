import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import Country from '../entities/countries.entity';

// ======================================
//			Country Seeder
// ======================================
export default class CreateCountries implements Seeder {
	// ======================================
	//			Country Seeder
	// ======================================
	public async run(factory: Factory, connection: Connection): Promise<any> {
		await connection
			.createQueryBuilder()
			.insert()
			.into(Country)
			.values([
				{ code: 'AF', prefix: '+93', name: 'Afghanistan' },
				{ code: 'AL', prefix: '+355', name: 'Albania' },
				{ code: 'DZ', prefix: '+213', name: 'Algeria' },
				{ code: 'AS', prefix: '+1-684', name: 'American Samoa' },
				{ code: 'AD', prefix: '+376', name: 'Andorra' },
				{ code: 'AO', prefix: '+244', name: 'Angola' },
				{ code: 'AI', prefix: '+1-264', name: 'Anguilla' },
				{ code: 'AQ', prefix: '+672', name: 'Antarctica' },
				{
					code: 'AG',
					prefix: '+1-268',
					name: 'Antigua and/or Barbuda',
				},
				{ code: 'AR', prefix: '+54', name: 'Argentina' },
				{ code: 'AM', prefix: '+374', name: 'Armenia' },
				{ code: 'AW', prefix: '+297', name: 'Aruba' },
				{ code: 'AU', prefix: '+61', name: 'Australia' },
				{ code: 'AT', prefix: '+43', name: 'Austria' },
				{ code: 'AZ', prefix: '+994', name: 'Azerbaijan' },
				{ code: 'BS', prefix: '+1-242', name: 'Bahamas' },
				{ code: 'BH', prefix: '+973', name: 'Bahrain' },
				{ code: 'BD', prefix: '+880', name: 'Bangladesh' },
				{ code: 'BB', prefix: '+1-246', name: 'Barbados' },
				{ code: 'BY', prefix: '+375', name: 'Belarus' },
				{ code: 'BE', prefix: '+32', name: 'Belgium' },
				{ code: 'BZ', prefix: '+501', name: 'Belize' },
				{ code: 'BJ', prefix: '+229', name: 'Benin' },
				{ code: 'BM', prefix: '+1-441', name: 'Bermuda' },
				{ code: 'BT', prefix: '+975', name: 'Bhutan' },
				{ code: 'BO', prefix: '+591', name: 'Bolivia' },
				{ code: 'BA', prefix: '+387', name: 'Bosnia and Herzegovina' },
				{ code: 'BW', prefix: '+267', name: 'Botswana' },
				{ code: 'BV', prefix: '', name: 'Bouvet Island' },
				{ code: 'BR', prefix: '+55', name: 'Brazil' },
				{
					code: 'IO',
					prefix: '+246',
					name: 'British lndian Ocean Territory',
				},
				{ code: 'BN', prefix: '+673', name: 'Brunei Darussalam' },
				{ code: 'BG', prefix: '+359', name: 'Bulgaria' },
				{ code: 'BF', prefix: '+226', name: 'Burkina Faso' },
				{ code: 'BI', prefix: '+257', name: 'Burundi' },
				{ code: 'KH', prefix: '+855', name: 'Cambodia' },
				{ code: 'CM', prefix: '+237', name: 'Cameroon' },
				{ code: 'CA', prefix: '+1', name: 'Canada' },
				{ code: 'CV', prefix: '+238', name: 'Cape Verde' },
				{ code: 'KY', prefix: '+1-345', name: 'Cayman Islands' },
				{
					code: 'CF',
					prefix: '+236',
					name: 'Central African Republic',
				},
				{ code: 'TD', prefix: '+235', name: 'Chad' },
				{ code: 'CL', prefix: '+56', name: 'Chile' },
				{ code: 'CN', prefix: '+86', name: 'China' },
				{ code: 'CX', prefix: '+61', name: 'Christmas Island' },
				{ code: 'CC', prefix: '+61', name: 'Cocos (Keeling) Islands' },
				{ code: 'CO', prefix: '+57', name: 'Colombia' },
				{ code: 'KM', prefix: '+269', name: 'Comoros' },
				{ code: 'CK', prefix: '+682', name: 'Cook Islands' },
				{ code: 'CR', prefix: '+506', name: 'Costa Rica' },
				{ code: 'HR', prefix: '+385', name: 'Croatia (Hrvatska)' },
				{ code: 'CU', prefix: '+53', name: 'Cuba' },
				{ code: 'CY', prefix: '+357', name: 'Cyprus' },
				{ code: 'CZ', prefix: '+420', name: 'Czech Republic' },
				{ code: 'CG', prefix: '+599', name: 'Curacao' },
				{
					code: 'CD',
					prefix: '+243',
					name: 'Democratic Republic of Congo',
				},
				{ code: 'DK', prefix: '+45', name: 'Denmark' },
				{ code: 'DJ', prefix: '+253', name: 'Djibouti' },
				{ code: 'DM', prefix: '+1-767', name: 'Dominica' },
				{ code: 'DO', prefix: '+1-809', name: 'Dominican Republic' },
				{ code: 'TP', prefix: '+670', name: 'East Timor' },
				{ code: 'EC', prefix: '+593', name: 'Ecudaor' },
				{ code: 'EG', prefix: '+20', name: 'Egypt' },
				{ code: 'SV', prefix: '+503', name: 'El Salvador' },
				{ code: 'GQ', prefix: '+240', name: 'Equatorial Guinea' },
				{ code: 'ER', prefix: '+291', name: 'Eritrea' },
				{ code: 'EE', prefix: '+372', name: 'Estonia' },
				{ code: 'ET', prefix: '+251', name: 'Ethiopia' },
				{
					code: 'FK',
					prefix: '+500',
					name: 'Falkland Islands (Malvinas)',
				},
				{ code: 'FO', prefix: '+298', name: 'Faroe Islands' },
				{ code: 'FJ', prefix: '+679', name: 'Fiji' },
				{ code: 'FI', prefix: '+358', name: 'Finland' },
				{ code: 'FR', prefix: '+33', name: 'France' },
				{ code: 'FX', prefix: '', name: 'France, Metropolitan' },
				{ code: 'GF', prefix: '', name: 'French Guiana' },
				{ code: 'PF', prefix: '+689', name: 'French Polynesia' },
				{ code: 'TF', prefix: '', name: 'French Southern Territories' },
				{ code: 'GA', prefix: '+241', name: 'Gabon' },
				{ code: 'GM', prefix: '+220', name: 'Gambia' },
				{ code: 'GE', prefix: '+995', name: 'Georgia' },
				{ code: 'DE', prefix: '+49', name: 'Germany' },
				{ code: 'GH', prefix: '+233', name: 'Ghana' },
				{ code: 'GI', prefix: '+350', name: 'Gibraltar' },
				{ code: 'GR', prefix: '+30', name: 'Greece' },
				{ code: 'GL', prefix: '+299', name: 'Greenland' },
				{ code: 'GD', prefix: '+1-473', name: 'Grenada' },
				{ code: 'GP', prefix: '', name: 'Guadeloupe' },
				{ code: 'GU', prefix: '+1-671', name: 'Guam' },
				{ code: 'GT', prefix: '+502', name: 'Guatemala' },
				{ code: 'GN', prefix: '+224', name: 'Guinea' },
				{ code: 'GW', prefix: '+245', name: 'Guinea-Bissau' },
				{ code: 'GY', prefix: '+592', name: 'Guyana' },
				{ code: 'HT', prefix: '+509', name: 'Haiti' },
				{ code: 'HM', prefix: '', name: 'Heard and Mc Donald Islands' },
				{ code: 'HN', prefix: '+504', name: 'Honduras' },
				{ code: 'HK', prefix: '+852', name: 'Hong Kong' },
				{ code: 'HU', prefix: '+36', name: 'Hungary' },
				{ code: 'IS', prefix: '+354', name: 'Iceland' },
				{ code: 'IN', prefix: '+91', name: 'India' },
				{ code: 'ID', prefix: '+62', name: 'Indonesia' },
				{
					code: 'IR',
					prefix: '+98',
					name: 'Iran (Islamic Republic of)',
				},
				{ code: 'IQ', prefix: '+964', name: 'Iraq' },
				{ code: 'IE', prefix: '+353', name: 'Ireland' },
				{ code: 'IL', prefix: '+972', name: 'Israel' },
				{ code: 'IT', prefix: '+39', name: 'Italy' },
				{ code: 'CI', prefix: '+225', name: 'Ivory Coast' },
				{ code: 'JM', prefix: '+1-876', name: 'Jamaica' },
				{ code: 'JP', prefix: '+81', name: 'Japan' },
				{ code: 'JO', prefix: '+962', name: 'Jordan' },
				{ code: 'KZ', prefix: '+7', name: 'Kazakhstan' },
				{ code: 'KE', prefix: '+254', name: 'Kenya' },
				{ code: 'KI', prefix: '+686', name: 'Kiribati' },
				{
					code: 'KP',
					prefix: '',
					name: "Korea, Democratic People's Republic of",
				},
				{ code: 'KR', prefix: '', name: 'Korea, Republic of' },
				{ code: 'KW', prefix: '+965', name: 'Kuwait' },
				{ code: 'KG', prefix: '+996', name: 'Kyrgyzstan' },
				{
					code: 'LA',
					prefix: '+856',
					name: "Lao People's Democratic Republic",
				},
				{ code: 'LV', prefix: '+371', name: 'Latvia' },
				{ code: 'LB', prefix: '+961', name: 'Lebanon' },
				{ code: 'LS', prefix: '+266', name: 'Lesotho' },
				{ code: 'LR', prefix: '+231', name: 'Liberia' },
				{ code: 'LY', prefix: '+218', name: 'Libyan Arab Jamahiriya' },
				{ code: 'LI', prefix: '+423', name: 'Liechtenstein' },
				{ code: 'LT', prefix: '+370', name: 'Lithuania' },
				{ code: 'LU', prefix: '+352', name: 'Luxembourg' },
				{ code: 'MO', prefix: '+853', name: 'Macau' },
				{ code: 'MK', prefix: '+389', name: 'Macedonia' },
				{ code: 'MG', prefix: '+261', name: 'Madagascar' },
				{ code: 'MW', prefix: '+265', name: 'Malawi' },
				{ code: 'MY', prefix: '+60', name: 'Malaysia' },
				{ code: 'MV', prefix: '+960', name: 'Maldives' },
				{ code: 'ML', prefix: '+223', name: 'Mali' },
				{ code: 'MT', prefix: '+356', name: 'Malta' },
				{ code: 'MH', prefix: '+692', name: 'Marshall Islands' },
				{ code: 'MQ', prefix: '', name: 'Martinique' },
				{ code: 'MR', prefix: '+222', name: 'Mauritania' },
				{ code: 'MU', prefix: '+230', name: 'Mauritius' },
				{ code: 'TY', prefix: '+262', name: 'Mayotte' },
				{ code: 'MX', prefix: '+52', name: 'Mexico' },
				{
					code: 'FM',
					prefix: '+691',
					name: 'Micronesia, Federated States of',
				},
				{ code: 'MD', prefix: '+373', name: 'Moldova, Republic of' },
				{ code: 'MC', prefix: '+377', name: 'Monaco' },
				{ code: 'MN', prefix: '+976', name: 'Mongolia' },
				{ code: 'MS', prefix: '+1-664', name: 'Montserrat' },
				{ code: 'MA', prefix: '+212', name: 'Morocco' },
				{ code: 'MZ', prefix: '+258', name: 'Mozambique' },
				{ code: 'MM', prefix: '+95', name: 'Myanmar' },
				{ code: 'NA', prefix: '+264', name: 'Namibia' },
				{ code: 'NR', prefix: '+674', name: 'Nauru' },
				{ code: 'NP', prefix: '+977', name: 'Nepal' },
				{ code: 'NL', prefix: '+31', name: 'Netherlands' },
				{ code: 'AN', prefix: '+599', name: 'Netherlands Antilles' },
				{ code: 'NC', prefix: '+687', name: 'New Caledonia' },
				{ code: 'NZ', prefix: '+64', name: 'New Zealand' },
				{ code: 'NI', prefix: '+505', name: 'Nicaragua' },
				{ code: 'NE', prefix: '+227', name: 'Niger' },
				{ code: 'NG', prefix: '+234', name: 'Nigeria' },
				{ code: 'NU', prefix: '+683', name: 'Niue' },
				{ code: 'NF', prefix: '', name: 'Norfork Island' },
				{
					code: 'MP',
					prefix: '+1-670',
					name: 'Northern Mariana Islands',
				},
				{ code: 'NO', prefix: '+47', name: 'Norway' },
				{ code: 'OM', prefix: '+968', name: 'Oman' },
				{ code: 'PK', prefix: '+92', name: 'Pakistan' },
				{ code: 'PW', prefix: '+680', name: 'Palau' },
				{ code: 'PA', prefix: '+507', name: 'Panama' },
				{ code: 'PG', prefix: '+675', name: 'Papua New Guinea' },
				{ code: 'PY', prefix: '+595', name: 'Paraguay' },
				{ code: 'PE', prefix: '+51', name: 'Peru' },
				{ code: 'PH', prefix: '+63', name: 'Philippines' },
				{ code: 'PN', prefix: '+64', name: 'Pitcairn' },
				{ code: 'PL', prefix: '+48', name: 'Poland' },
				{ code: 'PT', prefix: '+351', name: 'Portugal' },
				{ code: 'PR', prefix: '+1-787', name: 'Puerto Rico' },
				{ code: 'QA', prefix: '+974', name: 'Qatar' },
				{ code: 'SS', prefix: '', name: 'Republic of South Sudan' },
				{ code: 'RE', prefix: '+262', name: 'Reunion' },
				{ code: 'RO', prefix: '+40', name: 'Romania' },
				{ code: 'RU', prefix: '+7', name: 'Russian Federation' },
				{ code: 'RW', prefix: '+250', name: 'Rwanda' },
				{ code: 'KN', prefix: '+1-869', name: 'Saint Kitts and Nevis' },
				{ code: 'LC', prefix: '+1-758', name: 'Saint Lucia' },
				{
					code: 'VC',
					prefix: '+1-784',
					name: 'Saint Vincent and the Grenadines',
				},
				{ code: 'WS', prefix: '+685', name: 'Samoa' },
				{ code: 'SM', prefix: '+378', name: 'San Marino' },
				{ code: 'ST', prefix: '+239', name: 'Sao Tome and Principe' },
				{ code: 'SA', prefix: '+966', name: 'Saudi Arabia' },
				{ code: 'SN', prefix: '+221', name: 'Senegal' },
				{ code: 'RS', prefix: '+381', name: 'Serbia' },
				{ code: 'SC', prefix: '+248', name: 'Seychelles' },
				{ code: 'SL', prefix: '+232', name: 'Sierra Leone' },
				{ code: 'SG', prefix: '+65', name: 'Singapore' },
				{ code: 'SK', prefix: '+421', name: 'Slovakia' },
				{ code: 'SI', prefix: '+386', name: 'Slovenia' },
				{ code: 'SB', prefix: '+677', name: 'Solomon Islands' },
				{ code: 'SO', prefix: '+252', name: 'Somalia' },
				{ code: 'ZA', prefix: '+27', name: 'South Africa' },
				{
					code: 'GS',
					prefix: '',
					name: 'South Georgia South Sandwich Islands',
				},
				{ code: 'ES', prefix: '+34', name: 'España' },
				{ code: 'LK', prefix: '+94', name: 'Sri Lanka' },
				{ code: 'SH', prefix: '', name: 'St. Helena' },
				{ code: 'PM', prefix: '', name: 'St. Pierre and Miquelon' },
				{ code: 'SD', prefix: '+249', name: 'Sudan' },
				{ code: 'SR', prefix: '+597', name: 'Suriname' },
				{
					code: 'SJ',
					prefix: '+47',
					name: 'Svalbarn and Jan Mayen Islands',
				},
				{ code: 'SZ', prefix: '+268', name: 'Swaziland' },
				{ code: 'SE', prefix: '+46', name: 'Sweden' },
				{ code: 'CH', prefix: '+41', name: 'Switzerland' },
				{ code: 'SY', prefix: '+963', name: 'Syrian Arab Republic' },
				{ code: 'TW', prefix: '+886', name: 'Taiwan' },
				{ code: 'TJ', prefix: '+992', name: 'Tajikistan' },
				{
					code: 'TZ',
					prefix: '+255',
					name: 'Tanzania, United Republic of',
				},
				{ code: 'TH', prefix: '+66', name: 'Thailand' },
				{ code: 'TG', prefix: '+228', name: 'Togo' },
				{ code: 'TK', prefix: '+690', name: 'Tokelau' },
				{ code: 'TO', prefix: '+676', name: 'Tonga' },
				{ code: 'TT', prefix: '+1-868', name: 'Trinidad and Tobago' },
				{ code: 'TN', prefix: '+216', name: 'Tunisia' },
				{ code: 'TR', prefix: '+90', name: 'Turkey' },
				{ code: 'TM', prefix: '+993', name: 'Turkmenistan' },
				{
					code: 'TC',
					prefix: '+1-649',
					name: 'Turks and Caicos Islands',
				},
				{ code: 'TV', prefix: '+688', name: 'Tuvalu' },
				{ code: 'UG', prefix: '+256', name: 'Uganda' },
				{ code: 'UA', prefix: '+380', name: 'Ukraine' },
				{ code: 'AE', prefix: '+971', name: 'United Arab Emirates' },
				{ code: 'GB', prefix: '+44', name: 'United Kingdom' },
				{ code: 'US', prefix: '+1', name: 'United States' },
				{
					code: 'UM',
					prefix: '+1',
					name: 'United States minor outlying islands',
				},
				{ code: 'UY', prefix: '+598', name: 'Uruguay' },
				{ code: 'UZ', prefix: '+998', name: 'Uzbekistan' },
				{ code: 'VU', prefix: '+678', name: 'Vanuatu' },
				{ code: 'VA', prefix: '+379', name: 'Vatican City State' },
				{ code: 'VE', prefix: '+58', name: 'Venezuela' },
				{ code: 'VN', prefix: '+84', name: 'Vietnam' },
				{ code: 'VG', prefix: '+1', name: 'Virgin Islands (British)' },
				{ code: 'VI', prefix: '+340', name: 'Virgin Islands (U.S.)' },
				{
					code: 'WF',
					prefix: '+681',
					name: 'Wallis and Futuna Islands',
				},
				{ code: 'EH', prefix: '+212', name: 'Western Sahara' },
				{ code: 'YE', prefix: '+967', name: 'Yemen' },
				{ code: 'YU', prefix: '+38', name: 'Yugoslavia' },
				{ code: 'ZR', prefix: '+243', name: 'Zaire' },
				{ code: 'ZM', prefix: '+260', name: 'Zambia' },
				{ code: 'ZW', prefix: '+263', name: 'Zimbabwe' },
			])
			.execute();
	}
}
