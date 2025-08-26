import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';

export default function OutlinedTimeline() {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          Fall 2025 - Present
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <SchoolIcon fontSize="small" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <b>Teaching Assistant</b>
          <div>Admin, Content Team</div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          Summer 2025
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="secondary">
            <LaptopChromebookIcon fontSize="small" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <b>Teaching Assistant (CS 61BL)</b>
          <div>Content Team</div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          Spring 2025
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color='inherit'>
            <CodeIcon fontSize="small" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <b>Tutor</b>
          {/* <div>TODO</div> */}
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          Fall 2024
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot variant="outlined">
            <EmojiEventsIcon fontSize="small" />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <b>Academic Intern</b>
          <div>OH</div>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
