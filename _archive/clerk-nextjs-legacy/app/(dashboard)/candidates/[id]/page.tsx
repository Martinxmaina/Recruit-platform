import { notFound } from "next/navigation";
import { getCandidate } from "@/app/(dashboard)/candidates/actions";
import { getJobs } from "@/app/(dashboard)/jobs/actions";
import { getCandidateApplications } from "@/app/(dashboard)/applications/actions";
import { CandidateSidebar } from "@/components/candidates/candidate-sidebar";
import { CandidateEnrichmentSection } from "@/components/candidates/candidate-enrichment-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateExperienceTab } from "@/components/candidates/candidate-experience-tab";
import { CandidateInterviewsTab } from "@/components/candidates/candidate-interviews-tab";
import { CandidateNotesTab } from "@/components/candidates/candidate-notes-tab";
import { CandidateActivityTab } from "@/components/candidates/candidate-activity-tab";
import { isCandidateTracked } from "@/app/(dashboard)/tracking/actions";

export default async function CandidateDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [candidate, jobs, applications, tracked] = await Promise.all([
		getCandidate(id),
		getJobs(),
		getCandidateApplications(id),
		isCandidateTracked(id),
	]);

	if (!candidate) {
		notFound();
	}

	return (
		<div className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
			{/* Left Sidebar */}
			<div className="lg:col-span-4">
				<CandidateSidebar
					candidate={candidate}
					jobs={jobs}
					applications={applications as any}
					isTracked={tracked}
				/>
			</div>

			{/* Main Content */}
			<div className="lg:col-span-8 space-y-6">
				<CandidateEnrichmentSection />

				<Tabs defaultValue="experience" className="space-y-4">
					<div className="bg-card rounded-xl border border-border overflow-hidden">
						<div className="border-b border-border px-6 flex gap-8">
							<TabsList className="bg-transparent border-none p-0 h-auto">
								<TabsTrigger
									value="experience"
									className="py-4 text-sm font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
								>
									Experience
								</TabsTrigger>
								<TabsTrigger
									value="interviews"
									className="py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
								>
									Interview History
								</TabsTrigger>
								<TabsTrigger
									value="notes"
									className="py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
								>
									Notes
								</TabsTrigger>
								<TabsTrigger
									value="activity"
									className="py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
								>
									Activity
								</TabsTrigger>
							</TabsList>
						</div>
						<div className="p-6">
							<TabsContent value="experience" className="mt-0">
								<CandidateExperienceTab candidateId={candidate.id} />
							</TabsContent>

							<TabsContent value="interviews" className="mt-0">
								<CandidateInterviewsTab candidateId={candidate.id} />
							</TabsContent>

							<TabsContent value="notes" className="mt-0">
								<CandidateNotesTab candidateId={candidate.id} />
							</TabsContent>

							<TabsContent value="activity" className="mt-0">
								<CandidateActivityTab candidateId={candidate.id} />
							</TabsContent>
						</div>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
