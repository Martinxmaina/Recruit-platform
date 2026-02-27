/** DB allows org:admin / org:member (check constraint). UI uses admin / member. */
const UI_ROLE_TO_DB_ROLE: Record<string, string> = {
	admin: "org:admin",
	member: "org:member",
};
const DB_ROLE_TO_UI_ROLE: Record<string, string> = {
	"org:admin": "admin",
	"org:member": "member",
	admin: "admin",
	member: "member",
};

export function toDbRole(uiRole: string): string {
	return UI_ROLE_TO_DB_ROLE[uiRole] ?? uiRole;
}
export function toUiRole(dbRole: string | null): string {
	return (dbRole && DB_ROLE_TO_UI_ROLE[dbRole]) ?? "member";
}
export function isAdminDbRole(role: string | null): boolean {
	return role === "org:admin" || role === "admin";
}

export const DB_ROLE_ADMIN = "org:admin";
