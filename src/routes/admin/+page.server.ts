import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import clientPromise from '$lib/mongodb';

export async function load({ locals, url }: RequestEvent) {
	const { isAuthenticated, user, token } = locals;

	// Check if the user is authenticated
	if (!isAuthenticated) {
		throw redirect(302, '/api/auth/register'); // Redirect to register page if not authenticated
	}

	const db = await clientPromise;
	const usersCollection = db.db('website').collection('users');
	const interestsCollection = db.db('website').collection('interests');
	const dbUser = await usersCollection.findOne({ email: user.email });

	// Check if the user is an admin
	if (!dbUser || dbUser.privileges !== 'Admin') {
		throw redirect(302, '/'); // Redirect to home page if not an admin
	}

	const allUsers = await usersCollection.find({}).project({ _id: 0 }).toArray();
	const allInterests = await interestsCollection.find({}).toArray();

	// Create a map of user emails who have submitted interest forms
	const interestFormMap = new Set(allInterests.map(interest => interest.email.split('@')[0]));

	// Add interestForm flag to each user object
	const usersWithInterestForm = allUsers.map(user => ({
		...user,
		interestForm: interestFormMap.has(user.email.split('@')[0]) ? true : false
	}));

	// Fetch all events
	const eventsCollection = db.db('website').collection('events');
	const events = await eventsCollection.find({}).toArray();

	return {
		isAuthenticated,
		user,
		token,
		isAdmin: true,
		allUsers: usersWithInterestForm,
		events
	};
}