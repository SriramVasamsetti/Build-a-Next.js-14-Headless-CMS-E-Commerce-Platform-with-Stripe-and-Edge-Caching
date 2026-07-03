import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req) {
  const secret = req.headers.get('x-revalidate-secret');
  const tag = req.headers.get('x-revalidate-tag');

  if (secret !== process.env.CMS_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag' }, { status: 400 });
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Error revalidating tag:', error);
    return NextResponse.json({ message: 'Error revalidating', error: error.message }, { status: 500 });
  }
}
