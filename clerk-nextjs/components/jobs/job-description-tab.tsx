import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";
import type { Job } from "@/app/(dashboard)/jobs/actions";

interface JobDescriptionTabProps {
	job: Job & { clients?: { name: string } | null };
}

export function JobDescriptionTab({ job }: JobDescriptionTabProps) {
	const aiKeywords = getStringArray(job.ai_keywords);
	const aiTaxonomies = getStringArray(job.ai_taxonomies_a);
	const aiKeySkills = getStringArray(job.ai_key_skills);
	const employmentTypes = getStringArray(job.employment_type);
	const locationsDerived = getStringArray(job.locations_derived);
	const citiesDerived = getStringArray(job.cities_derived);
	const regionsDerived = getStringArray(job.regions_derived);
	const countriesDerived = getStringArray(job.countries_derived);
	const orgSpecialties = getStringArray(job.linkedin_org_specialties);
	const orgLocations = getStringArray(job.linkedin_org_locations);

	const hasSource =
		job.source ||
		job.source_type ||
		job.url ||
		job.external_apply_url ||
		job.linkedin_id != null ||
		job.external_id != null;
	const hasEmployment =
		employmentTypes.length > 0 || job.seniority || job.ai_salary_currency;
	const hasLocation =
		locationsDerived.length > 0 ||
		citiesDerived.length > 0 ||
		regionsDerived.length > 0 ||
		countriesDerived.length > 0 ||
		job.remote_derived != null;
	const hasAiData =
		Boolean(job.ai_requirements_summary) ||
		job.ai_working_hours !== null ||
		Boolean(job.ai_job_language) ||
		job.ai_visa_sponsorship !== null ||
		aiKeywords.length > 0 ||
		aiTaxonomies.length > 0 ||
		Boolean(job.ai_education_requirements) ||
		aiKeySkills.length > 0 ||
		Boolean(job.ai_core_responsibilities) ||
		Boolean(job.ai_experience_level) ||
		Boolean(job.ai_work_arrangement) ||
		Boolean(job.ai_hiring_manager_name);
	const hasOrg =
		job.organization_name ||
		job.organization_logo ||
		job.organization_url ||
		job.linkedin_org_industry ||
		job.linkedin_org_size ||
		job.linkedin_org_description;
	const hasRecruiter =
		job.recruiter_name || job.recruiter_title || job.recruiter_url;
	const fullDescription = job.description_text || job.description;

	const salaryLabel =
		job.ai_salary_minvalue != null || job.ai_salary_maxvalue != null
			? [job.ai_salary_currency, job.ai_salary_minvalue, job.ai_salary_maxvalue]
					.filter((x) => x != null)
					.join(" ")
			: job.ai_salary_value != null
				? `${job.ai_salary_currency ?? ""} ${job.ai_salary_value} ${job.ai_salary_unittext ?? ""}`.trim()
				: null;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Full Description</CardTitle>
				</CardHeader>
				<CardContent>
					{fullDescription ? (
						<div className="prose prose-sm max-w-none">
							<p className="whitespace-pre-wrap">{fullDescription}</p>
						</div>
					) : (
						<p className="text-muted-foreground">No description provided.</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Job Details</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2">
					<div>
						<label className="text-sm font-medium text-muted-foreground">
							Status
						</label>
						<p className="mt-1 capitalize">{job.status}</p>
					</div>
					{job.work_type && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Work Type
							</label>
							<p className="mt-1 capitalize">{job.work_type}</p>
						</div>
					)}
					{job.location && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Location
							</label>
							<p className="mt-1">{job.location}</p>
						</div>
					)}
					{job.country && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Country
							</label>
							<p className="mt-1">{job.country}</p>
						</div>
					)}
					{job.posted_at && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Posted Date
							</label>
							<p className="mt-1">
								{formatDate(job.posted_at)}
							</p>
						</div>
					)}
					{job.date_posted && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Date Posted
							</label>
							<p className="mt-1">
								{formatDate(job.date_posted)}
							</p>
						</div>
					)}
					{job.date_validthrough && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Valid Through
							</label>
							<p className="mt-1">
								{formatDate(job.date_validthrough)}
							</p>
						</div>
					)}
					{job.created_at && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Created
							</label>
							<p className="mt-1">
								{formatDate(job.created_at)}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{hasSource && (
				<Card>
					<CardHeader>
						<CardTitle>Source Info</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2">
						{job.source && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Source
								</label>
								<p className="mt-1 capitalize">{job.source}</p>
							</div>
						)}
						{job.source_type && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Source Type
								</label>
								<p className="mt-1">{job.source_type}</p>
							</div>
						)}
						{job.source_domain && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Source Domain
								</label>
								<p className="mt-1">{job.source_domain}</p>
							</div>
						)}
						{job.url && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Listing URL
								</label>
								<p className="mt-1">
									<a
										href={job.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline break-all"
									>
										{job.url}
									</a>
								</p>
							</div>
						)}
						{job.external_apply_url && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Apply URL
								</label>
								<p className="mt-1">
									<a
										href={job.external_apply_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline break-all"
									>
										{job.external_apply_url}
									</a>
								</p>
							</div>
						)}
						{job.linkedin_id != null && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									LinkedIn ID
								</label>
								<p className="mt-1">{job.linkedin_id}</p>
							</div>
						)}
						{job.external_id != null && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									External ID
								</label>
								<p className="mt-1">{job.external_id}</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{hasEmployment && (
				<Card>
					<CardHeader>
						<CardTitle>Employment</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{employmentTypes.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{employmentTypes.map((t) => (
									<Badge key={t} variant="secondary">
										{formatEmploymentType(t)}
									</Badge>
								))}
							</div>
						)}
						{job.seniority && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Seniority
								</label>
								<p className="mt-1">{job.seniority}</p>
							</div>
						)}
						{salaryLabel && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Salary
								</label>
								<p className="mt-1">{salaryLabel}</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{hasLocation && (
				<Card>
					<CardHeader>
						<CardTitle>Location</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{job.remote_derived != null && (
							<p className="text-sm">
								Remote: {job.remote_derived ? "Yes" : "No"}
							</p>
						)}
						{locationsDerived.length > 0 && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Locations
								</label>
								<ul className="mt-1 list-disc pl-4 text-sm">
									{locationsDerived.map((loc) => (
										<li key={loc}>{loc}</li>
									))}
								</ul>
							</div>
						)}
						{citiesDerived.length > 0 && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Cities
								</label>
								<p className="mt-1 text-sm">
									{citiesDerived.join(", ")}
								</p>
							</div>
						)}
						{regionsDerived.length > 0 && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Regions
								</label>
								<p className="mt-1 text-sm">
									{regionsDerived.join(", ")}
								</p>
							</div>
						)}
						{countriesDerived.length > 0 && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Countries
								</label>
								<p className="mt-1 text-sm">
									{countriesDerived.join(", ")}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>AI Enrichment</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{!hasAiData && (
						<p className="text-sm text-muted-foreground">
							No AI enrichment data available for this job yet.
						</p>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">
							Requirements Summary
						</label>
						<p className="text-sm whitespace-pre-wrap">
							{job.ai_requirements_summary || "Not available."}
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Working Hours
							</label>
							<p className="mt-1 text-sm">
								{job.ai_working_hours !== null
									? `${job.ai_working_hours} hours/week`
									: "Not specified"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Job Language
							</label>
							<p className="mt-1 text-sm">
								{job.ai_job_language || "Not specified"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Experience Level
							</label>
							<p className="mt-1 text-sm">
								{job.ai_experience_level || "Not specified"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Work Arrangement
							</label>
							<p className="mt-1 text-sm">
								{job.ai_work_arrangement || "Not specified"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Visa Sponsorship
							</label>
							<p className="mt-1 text-sm">
								{job.ai_visa_sponsorship === null
									? "Not specified"
									: job.ai_visa_sponsorship
										? "Yes"
										: "No"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Education Requirements
							</label>
							<p className="mt-1 text-sm">
								{job.ai_education_requirements || "Not specified"}
							</p>
						</div>
					</div>

					{job.ai_core_responsibilities && (
						<div className="space-y-2">
							<label className="text-sm font-medium text-muted-foreground">
								Core Responsibilities
							</label>
							<p className="text-sm whitespace-pre-wrap">
								{job.ai_core_responsibilities}
							</p>
						</div>
					)}

					{(job.ai_hiring_manager_name || job.ai_hiring_manager_email_address) && (
						<div className="grid gap-4 md:grid-cols-2">
							{job.ai_hiring_manager_name && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Hiring Manager
									</label>
									<p className="mt-1 text-sm">{job.ai_hiring_manager_name}</p>
								</div>
							)}
							{job.ai_hiring_manager_email_address && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Hiring Manager Email
									</label>
									<p className="mt-1 text-sm">
										<a
											href={`mailto:${job.ai_hiring_manager_email_address}`}
											className="text-primary hover:underline"
										>
											{job.ai_hiring_manager_email_address}
										</a>
									</p>
								</div>
							)}
						</div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">
							Keywords
						</label>
						{aiKeywords.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{aiKeywords.map((keyword) => (
									<Badge key={keyword} variant="secondary">
										{keyword}
									</Badge>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">No keywords available.</p>
						)}
					</div>

					{aiKeySkills.length > 0 && (
						<div className="space-y-2">
							<label className="text-sm font-medium text-muted-foreground">
								Key Skills
							</label>
							<div className="flex flex-wrap gap-2">
								{aiKeySkills.map((skill) => (
									<Badge key={skill} variant="outline">
										{skill}
									</Badge>
								))}
							</div>
						</div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">
							Taxonomies
						</label>
						{aiTaxonomies.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{aiTaxonomies.map((taxonomy) => (
									<Badge key={taxonomy} variant="outline">
										{taxonomy}
									</Badge>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No taxonomies available.
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{hasOrg && (
				<Card>
					<CardHeader>
						<CardTitle>Organization</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-start gap-4">
							{job.organization_logo && (
								<img
									src={job.organization_logo}
									alt=""
									className="size-16 rounded object-contain border"
								/>
							)}
							<div className="space-y-1">
								{job.organization_name && (
									<p className="font-medium">{job.organization_name}</p>
								)}
								{job.organization_url && (
									<a
										href={job.organization_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-primary hover:underline break-all"
									>
										{job.organization_url}
									</a>
								)}
							</div>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							{job.linkedin_org_industry && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Industry
									</label>
									<p className="mt-1 text-sm">{job.linkedin_org_industry}</p>
								</div>
							)}
							{job.linkedin_org_size && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Company Size
									</label>
									<p className="mt-1 text-sm">{job.linkedin_org_size}</p>
								</div>
							)}
							{job.linkedin_org_headquarters && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Headquarters
									</label>
									<p className="mt-1 text-sm">{job.linkedin_org_headquarters}</p>
								</div>
							)}
						</div>
						{job.linkedin_org_description && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Description
								</label>
								<p className="mt-1 text-sm whitespace-pre-wrap">
									{job.linkedin_org_description}
								</p>
							</div>
						)}
						{orgSpecialties.length > 0 && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Specialties
								</label>
								<div className="mt-1 flex flex-wrap gap-2">
									{orgSpecialties.map((s) => (
										<Badge key={s} variant="secondary">
											{s}
										</Badge>
									))}
								</div>
							</div>
						)}
						{orgLocations.length > 0 && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Locations
								</label>
								<p className="mt-1 text-sm">{orgLocations.join(", ")}</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{hasRecruiter && (
				<Card>
					<CardHeader>
						<CardTitle>Recruiter</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4 md:grid-cols-2">
						{job.recruiter_name && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Name
								</label>
								<p className="mt-1">{job.recruiter_name}</p>
							</div>
						)}
						{job.recruiter_title && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Title
								</label>
								<p className="mt-1">{job.recruiter_title}</p>
							</div>
						)}
						{job.recruiter_url && (
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Profile
								</label>
								<p className="mt-1">
									<a
										href={job.recruiter_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline break-all"
									>
										{job.recruiter_url}
									</a>
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function getStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.filter((item): item is string => typeof item === "string");
}

function formatEmploymentType(value: string): string {
	if (value === "FULL_TIME") return "Full-time";
	if (value === "PART_TIME") return "Part-time";
	if (value === "CONTRACT") return "Contract";
	if (value === "TEMPORARY") return "Temporary";
	if (value === "INTERNSHIP") return "Internship";
	return value.replace(/_/g, " ");
}
