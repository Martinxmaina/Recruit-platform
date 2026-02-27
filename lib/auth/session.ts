import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Session, User } from '@supabase/supabase-js'

export type CurrentOrg = { id: string; name: string }

export async function getSession(): Promise<Session | null> {
	try {
		const supabase = await createClient()
		// Use getUser() to verify the session with the Supabase Auth server
		// then fetch the session so callers get the full Session object.
		const { data: userData } = await supabase.auth.getUser()
		if (!userData.user) return null
		const {
			data: { session },
		} = await supabase.auth.getSession()
		return session
	} catch {
		return null
	}
}

export async function getCurrentUser(): Promise<User | null> {
	try {
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()
		return user
	} catch {
		return null
	}
}

export async function getCurrentOrg(): Promise<CurrentOrg | null> {
	const user = await getCurrentUser()
	if (!user) return null
	try {
		const supabase = await createAdminClient(user.id)
		const { data: member } = await supabase
			.from('org_members')
			.select('organization_id, organizations(id, name)')
			.eq('user_id', user.id)
			.limit(1)
			.maybeSingle()

		if (!member || !member.organizations) return null
		const org = member.organizations as { id: string; name: string }
		return { id: org.id, name: org.name }
	} catch {
		return null
	}
}
