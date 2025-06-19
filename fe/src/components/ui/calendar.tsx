"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar(props: CalendarProps) {
    return (
        // Bạn có thể vẫn truyền showOutsideDays, mode, selected, onSelect, etc.
        <DayPicker
            {...props}
            // Ví dụ mặc định showOutsideDays = true (hiện số ngày của tháng trước/sau)
            showOutsideDays={props.showOutsideDays ?? true}
            // mode mặc định = "single" nhưng bạn có thể override bằng props.mode
            mode={props.mode ?? "single"}
            // className để áp dụng border hoặc rounding nếu muốn
            className="rounded-lg border hover:shadow-md"
        />
    );
}

Calendar.displayName = "Calendar";

export { Calendar };