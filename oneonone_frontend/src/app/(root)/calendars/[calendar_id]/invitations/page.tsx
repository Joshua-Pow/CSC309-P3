import React from "react";

type Props = {
  params: {
    calendar_id: string;
  };
};

const CalendarInvitations = ({ params }: Props) => {
  const { calendar_id } = params;
  return <div>invitations for {calendar_id}</div>;
};

export default CalendarInvitations;
