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
						from: { type: "string" },
						subject: { type: "string" },
						text: { type: "string" },
						name: { type: "string" }
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
					text: 'Testing can friendly sofa mail',
					html: '<strong>Testing can friendly sofa mail</strong>',
				};

				try {
					await sgMail.send(msg);
					return { status: "Mail Successfully send" }
				} catch (error) {
					console.error(error);
					return { status: "Failed to send mail" }
				}
			}
		},

		order: {
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						from: { type: "string" },
						subject: { type: "string" },
						text: { type: "string" },
						name: { type: "string" },
						images: {
							type: "array"
						}
					}
				}
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				let mailData = ctx.params.body;

				let attachmentsArray = [];

				mailData.images.forEach(function (item) {
					let a = {};
					let imagePath = path.join(uploadDir, item.meta.filename);
					a.content = fs.readFileSync(imagePath).toString("base64");
					a.filename = item.meta.filename;
					a.type = item.meta.mimetype;
					a.disposition = "attachment";

					attachmentsArray.push(a);
				})

				const msg = {
					to: `${process.env.SENDER_EMAIL_ADDRESS}`,
					from: `${mailData.name}<noreply@catfriendlysofa.com>`, // Use the email address or domain you verified above
					subject: 'CatSofa Order',
					text: 'Testing can friendly sofa mail',
					html: '<strong>Testing can friendly sofa mail</strong>',
					attachments: attachmentsArray
				};

				try {
					await sgMail.send(msg);
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
