import Link from "next/link";
import { ExternalLink, Trash2, Eye } from "lucide-react";
import { getTrackedCandidates, removeFromTracking } from "./actions";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function handleRemove(formData: FormData) {
	"use server";
	const trackedId = String(formData.get("tracked_id") || "");
	if (!trackedId) {
		return;
	}
	await removeFromTracking(trackedId);
}

export default async function TrackingPage() {
	const tracked = await getTrackedCandidates();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Tracking</h1>
				<p className="text-sm text-muted-foreground">
					Tracked candidates and their LinkedIn profiles.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Tracked Candidates ({tracked.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{tracked.length === 0 ? (
						<div className="py-10 text-center text-sm text-muted-foreground">
							No tracked candidates yet.
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Current Role</TableHead>
										<TableHead>LinkedIn URL</TableHead>
										<TableHead>Added</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tracked.map((item: any) => (
										<TableRow key={item.id}>
											<TableCell>
												<div className="flex items-center gap-2">
													<Link
														href={`/candidates/${item.candidate_id}`}
														className="font-medium hover:underline"
													>
														{item.candidates?.full_name ?? "Unknown"}
													</Link>
													<Button
														variant="ghost"
														size="sm"
														asChild
														className="h-7"
													>
														<Link
															href={`/candidates/${item.candidate_id}?tab=activity`}
															title="View Overview"
														>
															<Eye className="size-3.5" />
														</Link>
													</Button>
												</div>
											</TableCell>
											<TableCell>{item.candidates?.email ?? "—"}</TableCell>
											<TableCell>{item.candidates?.current_title ?? "—"}</TableCell>
											<TableCell>
												{item.linkedin_url ? (
													<a
														href={item.linkedin_url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 text-primary hover:underline"
													>
														<ExternalLink className="size-3.5" />
														<span className="truncate max-w-[260px]">
															{item.linkedin_url}
														</span>
													</a>
												) : (
													<span className="text-muted-foreground">—</span>
												)}
											</TableCell>
											<TableCell>
												{new Date(item.created_at).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<form action={handleRemove} className="inline">
													<input type="hidden" name="tracked_id" value={item.id} />
													<Button type="submit" variant="ghost" size="icon" aria-label="Remove from tracking">
														<Trash2 className="size-4 text-destructive" />
													</Button>
												</form>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
