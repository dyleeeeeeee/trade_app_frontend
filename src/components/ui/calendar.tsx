import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-body-sm font-medium text-text-primary",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 text-text-secondary hover:text-text-primary hover:bg-surface-raised",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-text-tertiary rounded-md w-9 font-normal text-caption",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-body-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-surface-raised/50 [&:has([aria-selected])]:bg-surface-raised first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 rounded-md p-0 font-normal text-text-primary hover:bg-surface-raised aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-interactive text-interactive-foreground hover:bg-interactive hover:text-interactive-foreground focus:bg-interactive focus:text-interactive-foreground",
        day_today: "border border-interactive text-text-primary",
        day_outside:
          "day-outside text-text-tertiary aria-selected:bg-surface-raised/50 aria-selected:text-text-tertiary",
        day_disabled: "text-text-tertiary opacity-40",
        day_range_middle: "aria-selected:bg-surface-raised aria-selected:text-text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
