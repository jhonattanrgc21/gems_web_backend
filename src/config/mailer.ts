import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: 'jhonattanrgc21@gmail.com', // generated ethereal user
		pass: 'supcvrtmzrxzmuck', // generated ethereal password
	},
});

transporter.verify().then(() => {
	console.log('Listo para enviar correos.');
})
