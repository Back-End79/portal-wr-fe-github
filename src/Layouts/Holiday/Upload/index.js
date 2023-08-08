import React, { useCallback, useContext, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import "../../../App.css";
import client from "../../../global/client";
import { UploadFileOutlined } from "@mui/icons-material";
import { AlertContext } from "../../../context";

const UploadHoliday = ({ openUpload, setOpenUpload, onSaveSuccess }) => {
  const downloadUrl = `${process.env.REACT_APP_BASE_API}/holiday/download?bucketName=workingreport-dev&objectName=template_import_holiday.xlsx`;
  const { setDataAlert } = useContext(AlertContext);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onSave = async (event) => {
    event.preventDefault()

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const res = await client.requestAPI({
      method: "POST",
      endpoint: "/holiday/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);

    if (!res.isError) {
      setDataAlert({
        severity: "success",
        open: true,
        message: res.meta.message,
      });
      onSaveSuccess();
      setUploadedFile(null); 
      setOpenUpload(false);
    } else {
      setDataAlert({
        severity: "error",
        message: res.error.meta.message,
        open: true,
      });
    }
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    console.log(file.name);
    setUploadedFile(file);
  }, []);

  // const handleDragOver = useCallback((event) => {
  //   event.preventDefault();
  //   // alert("DRAG FILE")
  // }, []);

  // const handleDrop = useCallback((event) => {
  //   event.preventDefault();
  //   alert("DROP FILE");
  //   // Handle the dropped file here
  // }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files[0];
    console.log(file);
    setUploadedFile(file);
  }, []);
  
  const handleClose = () => {
    setUploadedFile(null); 
    setOpenUpload(false);
  };

  return (
    <div>
      <Dialog
        open={openUpload}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-delete dialog-task"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" className="dialog-delete-header">
          Upload Holiday
        </DialogTitle>

        <form onSubmit={onSave} encType="multipart/formData">
          <DialogContent className="dialog-task-content">
            <DialogContentText
              className="dialog-delete-text-content"
              id="alert-dialog-description"
              sx={{ marginBottom: 2 }}
            >
              Grant administrators the authority to manually Upload holidays for employees.
            </DialogContentText>

            <a
              href={downloadUrl}
              download="template_import_holiday.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              <Typography component="span" alignItems={"center"} color={"#0078D7"}>
                DOWNLOAD TEMPLATE
              </Typography>
            </a>

            <Grid item xs={12}>
              <Accordion sx={{ boxShadow: "none", width: "100%", marginTop: 2 }}>
                <AccordionDetails>
                  <Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                      <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}>
                        <div
                           style={{
                            border: isDraggingOver ? "2px dashed #0078D7" : "2px dashed #ddd",
                            borderRadius: "4px",
                            padding: "20px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          
                        >
                          <TextField type="file" name="file" style={{ display: "none" }} onChange={handleFileChange} />
                          <UploadFileOutlined fontSize="large" style={{ color: "#0078D7" }} />

                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="subtitle1" sx={{ color: "#0078D7", marginRight: "3px" }}>
                              {uploadedFile != null ? uploadedFile.name : "Click to Upload"}
                            </Typography>
                            <Typography variant="subtitle1">
                              {uploadedFile != null ? " - Selected" : "or Drag and Drop"}
                            </Typography>
                          </Box>

                          {uploadedFile == null && (
                            <Typography color="textSecondary">XLS or XSLX (max. 1MB)</Typography>
                          )}
                        </div>
                      </label>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Button variant="outlined" className="button-text" onClick={handleClose}>
                  Back
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" className="button-text" type="submit">
                  Upload File
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UploadHoliday;