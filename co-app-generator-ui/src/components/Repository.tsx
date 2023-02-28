import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from "@mui/lab";
import { FormControl } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { ProjectRepoDropdown } from "./Dropdown";

export const Repository = () => {
  const [projects, setProjects] = React.useState<any | null>(null);
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );
  const [repositories, setRepositories] = React.useState<any | null>(null);

  const [selectedRepository, setSelectedRepository] = React.useState<
    any | null
  >(null);
  const getProject = () => {
    axios
      .get("/api/v1/bitbucket/projects")
      .then((response: any) => {
        setProjects(response.data);
        selectedRepository(null);
        setRepositories(null);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const getRepositories = (projectName: string) => {
    axios
      .get(`/api/v1/bitbucket/projects/${projectName}/repositories`)
      .then((response: any) => {
        const repositories = response.data.map((data: any) => {
          return { key: data.name, name: data.name };
        });
        setRepositories(repositories);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (selectedProject !== null && selectedProject.key != null) {
      getRepositories(selectedProject.key);
    }
  }, [selectedProject]);

  React.useEffect(() => {
    getProject();
  }, []);
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.2,
        },
      }}
    >
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          Select the Project
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <FormControl style={{ width: "200px" }} size="small">
            <ProjectRepoDropdown
              list={projects}
              setSelected={setSelectedProject}
              label="Select Project"
            ></ProjectRepoDropdown>
          </FormControl>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary">
          Select the Repository
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>
          <FormControl style={{ width: "200px" }} size="small">
            <ProjectRepoDropdown
              list={repositories}
              setSelected={setSelectedRepository}
              label="Select Repository"
            ></ProjectRepoDropdown>
          </FormControl>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};
