import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const eventId = params.eventId;
    throw redirect(302, `https://lu.ma/${eventId}`);
}) satisfies PageServerLoad;