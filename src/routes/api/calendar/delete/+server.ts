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
		const { eventId } = await request.json();

		if (!eventId) {
			throw new Error('Event ID is required');
		}

		const db = await clientPromise;
		const eventsCollection = db.db('website').collection('events');

		// Get the event to delete the associated image
		const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

		if (!event) {
			throw new Error('Event not found');
		}

		// Delete the image from ImageKit if it exists
		if (event.fileId) {
			try {
				await imagekit.deleteFile(event.fileId);
			} catch (error) {
				console.error('Error deleting image from ImageKit:', error);
			}
		}

		// Delete the event from the database
		const result = await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });

		if (result.deletedCount === 0) {
			throw new Error('Failed to delete event');
		}

		const headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'POST');
		headers.set('Access-Control-Allow-Headers', 'Content-Type');

		return new Response(JSON.stringify({ success: true }), { status: 200, headers });
	} catch (error) {
		console.error('Error deleting event:', error);

		const headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'POST');
		headers.set('Access-Control-Allow-Headers', 'Content-Type');

		return new Response(JSON.stringify({ error: 'Error deleting event' }), {
			status: 500,
			headers
		});
	}
};




