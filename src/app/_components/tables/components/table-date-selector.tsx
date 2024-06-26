import { type Column } from "@tanstack/react-table";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}
export function DataTableFilter<TData, TValue>({
  column,
  title,
  date,
  setDate,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const format = (date: Date) =>
    date.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  React.useEffect(() => {
    if (date) {
      column?.setFilterValue([date.from, date.to]);
    }
  }, [column, date]);
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={`w-[300px] justify-start text-left font-normal ${
              !date ? "text-muted-foreground" : ""
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from)} - {format(date.to)}
                </>
              ) : (
                format(date.from)
              )
            ) : (
              <span>{`${title} filtesi için tarih seçin `}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
