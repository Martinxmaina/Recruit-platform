import { Badge } from "@/components/ui/badge";

interface InterviewStatusBadgeProps {
	status: string;
}

export function InterviewStatusBadge({ status }: InterviewStatusBadgeProps) {
	const getVariant = (status: string) => {
		switch (status) {
			case "scheduled":
				return "default";
			case "completed":
				return "secondary";
			case "cancelled":
				return "outline";
			case "rescheduled":
				return "default";
			default:
				return "outline";
		}
	};

	return <Badge variant={getVariant(status)}>{status}</Badge>;
}
