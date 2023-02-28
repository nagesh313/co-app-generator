import * as React from "react";
import {
  TimelineDot,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export const RealTimeProgressBar = () => {
  const [serverEvents, setServerEvents] = React.useState([]);
  const serverEventsRef = React.useRef(serverEvents);
  let progress;
  const eventProgress = () => {
    const uuid = uuidv4();
    progress = new EventSource(
      "http://localhost:3001/api/v1/event/progress?uuid=" + uuid
    );
    progress.onmessage = (messageEvent: MessageEvent) => {
      console.log("onmessage", messageEvent.data);
      const newEvents: any = [
        ...serverEventsRef.current,
        { name: messageEvent.data },
      ];
      serverEventsRef.current = newEvents;
      setServerEvents(newEvents);
    };
    progress.onerror = (error: any) => {
      console.log(error);
    };
    const sleep = (time: number) => {
      return new Promise((resolve: any) => {
        setTimeout(resolve, time);
      });
    };
    progress.onopen = async (ev: Event) => {
      const eventCount = 10;
      axios
        .get(`/api/v1/event/start-simulation/${uuid}/${eventCount}`)
        .then((response: any) => {
          console.log("Started");
        })
        .catch((error: any) => {
          console.log(error);
        });
    };
  };
  React.useEffect(() => {
    eventProgress();
  }, []);
  return (
    <Timeline position="right">
      {serverEvents.map((event: any, index: any) => {
        return (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>{event.name}</TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};
