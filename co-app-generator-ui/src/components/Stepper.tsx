import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";

const steps = ["Select A Template", "Replace Variables", "Action"];
const Step0 = (props: any) => {
  const [templateList, setTemplateList] = React.useState([]);
  const fetchTemplateList = () => {
    axios
      .get("/api/v1/generator/template/list")
      .then((response: any) => {
        setTemplateList(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.setSelectedTemplate(event.target.elements.selectTemplate.value);
    props.handleNext();
  };
  React.useEffect(() => {
    fetchTemplateList();
  }, []);
  return (
    <Container>
      <Paper sx={{ p: 2, m: 1 }}>
        <form onSubmit={handleSubmit} name="template-form">
          <FormControl fullWidth size="small">
            <InputLabel id="select-template-label">
              Select A Template
            </InputLabel>
            <Select
              labelId="select-template-label"
              id="select-template"
              name="selectTemplate"
              label="Select A Template"
              required
              size="small"
              defaultValue={""}
            >
              {templateList?.map((listItem: string, index: number) => {
                return (
                  <MenuItem value={listItem} key={index}>
                    {listItem}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              size="small"
              color="inherit"
              disabled={true}
              onClick={props.handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button size="small" type="submit" variant="contained">
              Next
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
const Step1 = (props: any) => {
  const [templateVariableList, setTemplateVariableList] = React.useState([]);
  const fetchTemplateVariableList = (templateName: string) => {
    axios
      .get(
        "/api/v1/generator/template/variables/list?templateName=" + templateName
      )
      .then((response: any) => {
        setTemplateVariableList(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const request: any = {};
    templateVariableList.forEach((variable: any) => {
      request[variable] = formData.get(variable);
    });
    props.setTemplateVariableList(request);
    props.handleNext();
  };
  React.useEffect(() => {
    fetchTemplateVariableList(props.selectedTemplate);
  }, []);
  return (
    <Container>
      <Paper sx={{ p: 2, m: 1 }}>
        <form onSubmit={handleSubmit} name="template-form">
          <Typography>{props.selectedTemplate}</Typography>
          <FormControl fullWidth size="small">
            {templateVariableList?.map((variable: string, index: number) => {
              return (
                <TextField
                  key={index}
                  name={variable}
                  label={variable}
                  variant="standard"
                  required
                />
              );
            })}
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              size="small"
              color="inherit"
              onClick={props.handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button size="small" type="submit" variant="contained">
              Next
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
const Step2 = (props: any) => {
  const downloadTemplate = () => {
    axios
      .post(
        "/api/v1/generator/template/download",
        {
          templateName: props.selectedTemplate,
          templateVariableList: props.templateVariableList,
        },
        { responseType: "blob" }
      )
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", props.selectedTemplate + ".zip");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  const commitToRepo = () => {};
  return (
    <Container>
      <Typography sx={{ mt: 2, mb: 1 }}>{props.selectedTemplate}</Typography>
      <Typography sx={{ mt: 2, mb: 1 }}>
        {JSON.stringify(props.templateVariableList)}
      </Typography>
      <Button onClick={downloadTemplate}>Download Template</Button>
      <Button onClick={commitToRepo}>Commit to Repo</Button>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button color="inherit" onClick={props.handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          disabled={true}
          // onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};
export function HorizontalLinearStepper() {
  const [selectedTemplate, setSelectedTemplate] = React.useState("");
  const [templateVariableList, setTemplateVariableList] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container sx={{ s: 3, p: 3 }}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep == 0 && (
          <Step0
            handleNext={handleNext}
            handleBack={handleBack}
            setSelectedTemplate={setSelectedTemplate}
          />
        )}
        {activeStep == 1 && (
          <Step1
            handleNext={handleNext}
            handleBack={handleBack}
            selectedTemplate={selectedTemplate}
            setTemplateVariableList={setTemplateVariableList}
          />
        )}
        {activeStep == 2 && (
          <Step2
            handleNext={handleNext}
            handleBack={handleBack}
            selectedTemplate={selectedTemplate}
            templateVariableList={templateVariableList}
          />
        )}
      </Box>
    </Container>
  );
}
