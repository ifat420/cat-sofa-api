"use strict";

const sgMail = require('@sendgrid/mail');

const fs = require("fs");
const path = require("path");
const mkdir = require("mkdirp").sync;
const mime = require("mime-types");


const uploadDir = path.join(__dirname, "../__uploads");
mkdir(uploadDir);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */


module.exports = {
	name: "mails",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Mail
		 *
		 * @param {String} name - User name
		 */
		contact: {
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						name: { type: "string" },
						surname: { type: "string" },
						city: { type: "string" },
						country: { type: "string" },
						phone: { type: "string" },
						email: { type: "string" },
						comment: { type: "string" },
						accept_policy: { type: "boolean" }
					}
				}
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				let mailData = ctx.params.body;

				const msg = {
					to: `${process.env.SENDER_EMAIL_ADDRESS}`,
					from: `${mailData.name}<noreply@catfriendlysofa.com>`, // Use the email address or domain you verified above
					subject: 'Cat Friendly Sofa Contact Mail',
					text: 'Cat Friendly Sofa Contact Mail',
					html: `	<h1 style="margin-bottom: 15px;"> Can Friendly Contact </h1>
							<table style="max-width: 400px;border: 1px solid black;border-collapse: collapse;">
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Name</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;"> ${mailData.name} </td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Surname</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;"> ${mailData.surname} </td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">City </td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.city}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Country</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.country}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Phone/State</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.phone}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Email/State</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;"><a href="mailto:${mailData.email}">${mailData.email}</a></td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Comment</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.comment}</td>
							</tr>
							</table>
							`
				};

				try {
					await sgMail.send(msg);
					return { message: "Mail Successfully send", status: 'Ok' }
				} catch (error) {
					console.error(error);
					return { message: "Failed to send mail", status: 'Failed' }
				}
			}
		},

		order: {
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						firstname: { type: "string" },
						surname: { type: "string" },
						address: { type: "string" },
						city: { type: "string", optional: true },
						province: { type: "string", optional: true },
						zip: { type: "string", optional: true},
						country: { type: "string", optional: true },
						orderFirstname: { type: "string", optional: true },
						orderSurname: { type: "string", optional: true },
						orderAddress: { type: "string", optional: true },
						orderCity: { type: "string", optional: true },
						orderProvince: { type: "string", optional: true },
						orderZip: { type: "string", optional: true },
						orderCountry: { type: "string", optional: true },
						passport: { type: "string", optional: true },
						phone: { type: "string" },
						email: { type: "string" },
						color: { type: "array" },
						interest: { type: "array" },
						message: { type: "string", optional: true },
						news: { type: "boolean", optional: true },
						salesitem: { type: "boolean", optional: true },
						images: {
							type: "array",
							optional: true
						}
					}
				}
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				let mailData = ctx.params.body;

				let attachmentsArray = [];
				if (mailData.images && mailData.images.length > 0) {
					mailData.images.forEach(function (item) {
						let a = {};
						let imagePath = path.join(uploadDir, item.meta.filename);
						a.content = fs.readFileSync(imagePath).toString("base64");
						a.filename = item.meta.filename;
						a.type = item.meta.mimetype;
						a.disposition = "attachment";

						attachmentsArray.push(a);
					})
				}

				const msg = {
					"personalizations": [
						{
							"to": [
								{
									"email": `${process.env.SENDER_EMAIL_ADDRESS}`
								}
							]
						},
						{
							"to": [
								{
									"email": `${mailData.email}`
								}
							]
						}
					],
					from: `${mailData.firstname}<noreply@catfriendlysofa.com>`, // Use the email address or domain you verified above
					subject: 'CatSofa Order',
					text: 'Can Friendly Sofa Order',
					html: `<h1 style="margin-bottom: 15px;"> Can Friendly Sofa Order </h1>
							<table style="max-width: 400px;border: 1px solid black;border-collapse: collapse;">
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Name</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;"> ${mailData.firstname ? mailData.firstname : ''} </td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Surname</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;"> ${mailData.surname ? mailData.surname  : ''} </td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Address</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.address ? mailData.address : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">City</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.city ? mailData.city : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Province/State</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.province ? mailData.province : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Zip</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.zip ? mailData.zip : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Country</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.country ? mailData.country : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Passport Number</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.passport ? mailData.passport : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery Name</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderFirstname ? mailData.orderFirstname : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery Surname</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderSurname ? mailData.orderSurname : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery Address</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderAddress ? mailData.orderAddress : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery City</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderCity ? mailData.orderCity : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery Province/State</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderProvince ? mailData.orderProvince : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery Zip Code</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderZip ? mailData.orderZip : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Delivery Country</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.orderCountry ? mailData.orderCountry : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Phone Number</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.phone ? mailData.phone : ''}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Email</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;"><a href="mailto:${mailData.email}">${mailData.email}</a></td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Cat Friendly Sofa colour</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${this.colorString(mailData.color)}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Interested in Cat Friendly Sofa for</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${this.colorString(mailData.interest)}</td>
							</tr>
							<tr>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">Message</td>
								<td style="border: 1px solid black;border-collapse: collapse;padding: 15px;">${mailData.message ? mailData.message : ''}</td>
							</tr>
						</table>`,
					attachments: attachmentsArray
				};

				try {
					await sgMail.send(msg);
					if (mailData.images && mailData.images.length > 0) {
						mailData.images.forEach(function (item) {
							let imagePath = path.join(uploadDir, item.meta.filename);
							fs.unlinkSync(imagePath)
						});
					}
					return { status: "Mail Successfully send" }
				} catch (error) {
					console.error(error);
					return { status: "Failed to send mail" }
				}
			}
		},

		fileUpload: {
			/** @param {Context} ctx  */
			async handler(ctx) {
				let imageFiles = await new this.Promise((resolve, reject) => {
					//reject(new Error("Disk out of space"));
					let time = Date.now();
					const filePath = path.join(uploadDir, (time + '_' + ctx.meta.filename) || this.randomName());
					ctx.meta.filename = time + '_' + ctx.meta.filename;

					const f = fs.createWriteStream(filePath);
					f.on("close", () => {
						// File written successfully
						resolve({ filePath, meta: ctx.meta });
					});

					ctx.params.on("error", err => {
						reject(err);
						// Destroy the local file
						f.destroy(err);
					});

					f.on("error", () => {
						// Remove the errored file.
						fs.unlinkSync(filePath);
					});

					ctx.params.pipe(f);
				});

				return imageFiles;
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		colorString(arr) {
			let s = '';
			arr.forEach(item => {
				s = s + item + ' ,';
			})
			return s;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
