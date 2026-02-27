"use client";

import { useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface ResumeViewerProps {
	resumeUrl: string;
	candidateName?: string;
}

export function ResumeViewer({ resumeUrl, candidateName }: ResumeViewerProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (!resumeUrl) {
		return (
			<Button variant="outline" disabled>
				<Download className="mr-2 size-4" />
				No Resume Available
			</Button>
		);
	}

	// Check if URL is a PDF
	const isPdf = resumeUrl.toLowerCase().endsWith(".pdf") || resumeUrl.includes(".pdf");

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="default">
					<Download className="mr-2 size-4" />
					View Resume
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] p-0">
				<DialogHeader className="px-6 pt-6 pb-4 border-b">
					<div className="flex items-center justify-between">
						<DialogTitle>
							{candidateName ? `${candidateName}'s Resume` : "Resume"}
						</DialogTitle>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								asChild
								onClick={(e) => e.stopPropagation()}
							>
								<a
									href={resumeUrl}
									target="_blank"
									rel="noopener noreferrer"
									download
								>
									<Download className="mr-2 size-4" />
									Download
								</a>
							</Button>
							<Button
								variant="outline"
								size="sm"
								asChild
								onClick={(e) => e.stopPropagation()}
							>
								<a
									href={resumeUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="mr-2 size-4" />
									Open in New Tab
								</a>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOpen(false)}
							>
								<X className="size-4" />
							</Button>
						</div>
					</div>
				</DialogHeader>
				<div className="flex-1 overflow-auto p-6">
					{isPdf ? (
						<iframe
							src={resumeUrl}
							className="w-full h-[70vh] border rounded"
							title="Resume PDF Viewer"
						/>
					) : (
						<div className="space-y-4">
							<div className="text-center py-8">
								<p className="text-muted-foreground mb-4">
									Preview not available for this file type.
								</p>
								<Button asChild>
									<a
										href={resumeUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="mr-2 size-4" />
										Open Resume
									</a>
								</Button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
