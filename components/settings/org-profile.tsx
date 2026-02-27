import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";

interface OrgProfileProps {
	name: string;
	imageUrl: string | null;
	slug: string;
	createdAt: number;
}

export function OrgProfile({ name, imageUrl, slug, createdAt }: OrgProfileProps) {
	const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Building2 className="size-5" />
					Organization Profile
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-6">
					<Avatar className="size-16 rounded-lg">
						<AvatarImage src={imageUrl ?? undefined} alt={name} />
						<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-lg">
							{initials || <Building2 className="size-8" />}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h3 className="text-lg font-semibold">{name}</h3>
						{slug && (
							<p className="text-sm text-muted-foreground">
								Slug: <span className="font-mono">{slug}</span>
							</p>
						)}
						<p className="text-sm text-muted-foreground">
							Created {formattedDate}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
