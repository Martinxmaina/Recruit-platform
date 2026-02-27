import { TrendingUp, Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CandidateEnrichmentSection() {
	// Mock enrichment data
	const enrichmentData = [
		{
			type: "career_milestone",
			icon: TrendingUp,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
			title: "Career Milestone",
			content:
				"Alex was recently promoted to **Engineering Lead** at his current role. He has seen a 40% increase in team output over the last quarter.",
			source: "LinkedIn API",
			timestamp: "4 hours ago",
		},
		{
			type: "open_source",
			icon: Terminal,
			color: "text-green-500",
			bgColor: "bg-green-500/10",
			title: "Open Source Activity",
			content:
				"Published a technical deep-dive on **AI-driven workflow automation** using n8n and OpenAI on their personal blog.",
			source: "GitHub/RSS",
			timestamp: "2 days ago",
		},
	];

	return (
		<Card className="relative overflow-hidden border-primary/20 shadow-md shadow-primary/5">
			<div className="absolute top-0 right-0 p-4">
				<Badge className="flex items-center gap-2 bg-primary/10 border-primary/20 text-primary">
					<span className="text-sm">⚡</span>
					<span className="text-[10px] font-bold uppercase">n8n Enriched</span>
				</Badge>
			</div>
			<CardContent className="p-6 pt-12">
				<h2 className="text-lg font-bold mb-4 flex items-center gap-2">
					Recent Intelligence
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{enrichmentData.map((item) => {
						const Icon = item.icon;
						return (
							<div
								key={item.type}
								className="p-4 bg-muted/50 rounded-lg border border-border"
							>
								<div className="flex items-center gap-2 mb-2">
									<Icon className={`${item.color} size-5`} />
									<span className="text-xs font-semibold text-muted-foreground">
										{item.title}
									</span>
								</div>
								<p className="text-sm leading-relaxed">
									{item.content.split("**").map((part, i) =>
										i % 2 === 1 ? (
											<strong key={i} className="font-semibold">
												{part}
											</strong>
										) : (
											part
										)
									)}
								</p>
								<p className="mt-2 text-[10px] text-muted-foreground">
									Source: {item.source} • {item.timestamp}
								</p>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
