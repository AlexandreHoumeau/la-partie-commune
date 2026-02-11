import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props<T extends string> = {
	label: string;
	values: T[];
	selectedValues: T[];
	setSelectedValues: (values: T[]) => void; // Changed from React.Dispatch
	renderItem: (value: T) => React.ReactNode;
};

export function MultiSelectFilterDropdown<T extends string>({
	label,
	values,
	selectedValues,
	setSelectedValues,
	renderItem,
}: Props<T>) {
	const handleToggle = (value: T) => {
		if (selectedValues.includes(value)) {
			setSelectedValues(selectedValues.filter((v) => v !== value));
		} else {
			setSelectedValues([...selectedValues, value]);
		}
	};

	const handleOnly = (value: T) => {
		setSelectedValues([value]);
	};

	const handleAll = () => {
		setSelectedValues(values);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{label} ({selectedValues.length})
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				{values.map((value) => {
					const checked = selectedValues.includes(value);

					return (
						<div
							key={value}
							className="group flex items-center justify-between rounded-sm px-2 py-1.5 hover:bg-accent"
						>
							<DropdownMenuCheckboxItem
								checked={checked}
								onCheckedChange={() => handleToggle(value)}
								className="flex-1 focus:bg-transparent"
							>
								{renderItem(value)}
							</DropdownMenuCheckboxItem>

							<button
								className="ml-2 hidden text-xs text-muted-foreground hover:text-foreground group-hover:block"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();

									if (checked) {
										handleOnly(value);
									} else {
										handleAll();
									}
								}}
							>
								{checked ? "Only" : "All"}
							</button>
						</div>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}