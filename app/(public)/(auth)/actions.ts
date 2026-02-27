'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function getField(formData: FormData, key: string) {
	return (formData.get(key) as string | null)?.trim() ?? ''
}

export async function signIn(formData: FormData) {
	const email = getField(formData, 'email')
	const password = getField(formData, 'password')

	if (!email || !password) {
		redirect('/sign-in?error=' + encodeURIComponent('Email and password are required'))
	}

	let supabase
	try {
		supabase = await createClient()
	} catch {
		redirect('/sign-in?error=' + encodeURIComponent('Server configuration error. Contact support.'))
	}

	const { data, error } = await supabase.auth.signInWithPassword({ email, password })
	if (error) {
		redirect('/sign-in?error=' + encodeURIComponent(error.message))
	}
	if (!data.session) {
		redirect('/sign-in?error=' + encodeURIComponent('Unable to create a session. Please try again.'))
	}
	redirect('/dashboard')
}

export async function signUp(formData: FormData) {
	const email = getField(formData, 'email')
	const password = getField(formData, 'password')

	if (!email || !password) {
		redirect('/sign-up?error=' + encodeURIComponent('Email and password are required'))
	}

	let supabase
	try {
		supabase = await createClient()
	} catch {
		redirect('/sign-up?error=' + encodeURIComponent('Server configuration error. Contact support.'))
	}

	const { data, error } = await supabase.auth.signUp({ email, password })
	if (error) {
		redirect('/sign-up?error=' + encodeURIComponent(error.message))
	}
	if (!data.session) {
		redirect(
			'/sign-in?message=' +
				encodeURIComponent('Account created. Check your email to confirm, then sign in.'),
		)
	}
	redirect('/dashboard')
}

export async function signOut() {
	try {
		const supabase = await createClient()
		await supabase.auth.signOut()
	} finally {
		redirect('/sign-in')
	}
}
