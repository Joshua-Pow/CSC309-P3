import React from "react";

type Props = {
  params: {
    calendar_id: string;
  };
};

function CalendarDetails({ params }: Props) {
  const { calendar_id } = params;
  return <div>CalendarDetails for {calendar_id}</div>;
}

export default CalendarDetails;
