import type { RequestHandler } from './$types';
import clientPromise from '$lib/mongodb';
import ImageKit from "imagekit";
import { ObjectId } from 'mongodb';

const imagekit = new ImageKit({
    publicKey: "public_+D6ca1yfDFZ7zP2FONap1SfPihE=",
    urlEndpoint: "https://ik.imagekit.io/wy49ay1bjy4c",
    privateKey: "private_s1WB0ijaT5ez9JdT2IViRcs1K/A="
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const form = await request.formData();

		const eventId = form.get('eventId') as string;
		const title = form.get('title') as string;
		const date = form.get('date') as string;
		const description = form.get('description') as string;
		const location = form.get('location') as string;
		const rsvp = form.get('rsvp') === 'true';
		const file = form.get('file') as File | null;

		if (!eventId) {
			throw new Error('Event ID is required');
		}

		const db = await clientPromise;
		const eventsCollection = db.db('website').collection('events');

		const updateData: any = {
			title,
			description,
			location,
			rsvp,
			eventDate: new Date(date)
		};

		// If a new file is uploaded, upload it and update the image
		if (file && file.size > 0) {
			const buffer = await file.arrayBuffer();
			const uploadResult = await imagekit.upload({
				file: Buffer.from(buffer),
				fileName: file.name,
				tags: ["event"]
			});

			// Delete old image if exists
			const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
			if (existingEvent && existingEvent.fileId) {
				try {
					await imagekit.deleteFile(existingEvent.fileId);
				} catch (error) {
					console.error('Error deleting old image:', error);
				}
			}

			updateData.fileId = uploadResult.fileId;
			updateData.image = uploadResult.url;
			updateData.fileName = file.name;
			updateData.fileType = file.type;
		}

		const result = await eventsCollection.updateOne(
			{ _id: new ObjectId(eventId) },
			{ $set: updateData }
		);

		if (result.matchedCount === 0) {
			throw new Error('Event not found');
		}

		const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

		const headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'POST');
		headers.set('Access-Control-Allow-Headers', 'Content-Type');

		return new Response(JSON.stringify(updatedEvent), { status: 200, headers });
	} catch (error) {
		console.error('Error updating event:', error);

		const headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'POST');
		headers.set('Access-Control-Allow-Headers', 'Content-Type');

		return new Response(JSON.stringify({ error: 'Error updating event' }), {
			status: 500,
			headers
		});
	}
};




