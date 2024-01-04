import { Card, message, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "../../common/constants";
import { useAuth } from "@/contexts/AuthContext";

interface Event {
  description: string;
  location: string;
}

function EventDescription() {
  const router = useRouter();
  const { event_id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const { authState } = useAuth();

  // fetch the event data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${event_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState?.token}`,
          },
        });
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error(error);
        message.error("Unknown error occurred");
      }
    };
    fetchData();
  }, [authState?.token, event_id]);

  // return a page that displays the event details if the event exists and if it doesn't display event doesn't exist and allow user to
  // click a link that brings them back to the events page
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#eaf7f0",
      }}
    >
      <Card
        style={{
          width: "30%",
          height: "30%",
          boxShadow: " rgba(0,0,0, 0.15) 0px 2px 8px",
        }}
        bodyStyle={{
          fontSize: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          verticalAlign: "middle",
        }}
      >
        {event ? (
          <div>
            <Typography>{event.location}</Typography>
            <Typography>{event.description}</Typography>
          </div>
        ) : (
          <div>
            <Typography>{"Event doesn't exist."}</Typography>
            <Link href="/events">Back to Events Page</Link>
          </div>
        )}
      </Card>
    </div>
  );
}

export default EventDescription;
