import {
  Avatar,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Webcam from "react-webcam";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ReplayIcon from "@mui/icons-material/Replay";
import uploadFile from "./../../../global/uploadFile";
import client from "../../../global/client";
import { AlertContext } from "../../../context";

export default function CheckinTime({ setIsCheckin }) {
  const videoConstraints = {
    width: 622,
    height: 417,
    facingMode: "user",
  };
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [isTakePicture, setIsTakePicture] = useState(false);
  const webcamRef = React.useRef(null);
  const [picture, setPicture] = useState("");
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const { setDataAlert } = useContext(AlertContext);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPicture(imageSrc);
  }, [webcamRef]);
  const checkIn = async () => {
    const blob = await fetch(picture).then((res) => res.blob());
    const file = new File([blob], "test_picture.jpg");
    // URL.createObjectURL(blob)
    const result = await uploadFile(file);
    console.log("hasilUpload", result);
    const body = {
      workingReportId: localStorage.getItem("workingReportId"),
      latitude: lat,
      longitude: lon,
      startTime: startTime.format("HH:mm:ss"),
      endTime: endTime.format("HH:mm:ss"),
      file: result,
    };
    const res = await client.requestAPI({
      endpoint: "/workingReport/attendance/checkIn",
      method: "POST",
      data: body,
    });
    console.log("res: ", res);
    if (!res.isError) {
      setIsCheckin(false);
      setDataAlert({
        severity: "success",
        open: true,
        message: res.data.meta.message,
      });
    } else {
      setDataAlert({
        severity: "error",
        message: res.error.detail,
        open: true,
      });
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          {isTakePicture ? (
            <Grid container p={4} spacing={2}>
              <Grid item xs={6}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Typography variant="title">Take a Picture</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Typography>Snap a photo to record attendance</Typography>
                </Grid>
                {picture !== "" ? (
                  <Avatar
                    src={picture}
                    variant="square"
                    className="full-avatar"
                  />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Typography variant="title">Take a Picture</Typography>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Button
                      onClick={() => {
                        if (picture === "") capture();
                      }}
                      variant="contained"
                      startIcon={<PhotoCameraIcon />}
                    >
                      Snap a photo
                    </Button>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setPicture("");
                      }}
                      startIcon={<ReplayIcon />}
                    >
                      Retake a Photo
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="center">
                      <Grid item xs={2} display="flex" alignItems="center">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setIsTakePicture(false);
                            setPicture("");
                          }}
                        >
                          Back
                        </Button>
                      </Grid>
                      <Grid item xs={2} display="flex" alignItems="center">
                        <Button variant="contained" onClick={() => checkIn()}>
                          Check In
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container p={4}>
              <Grid item xs={6}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Typography variant="title">Geolocation</Typography>
                </Grid>
                <Typography>Latitude : {lat}</Typography>
                <Typography>Longitude : {lon}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Typography variant="title">Tuesday, 2 May 2023</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Presence
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                        value={10}
                        readOnly
                      >
                        <MenuItem value={10}>Check In Present</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Check In Location
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                        value={10}
                        readOnly
                      >
                        <MenuItem value={10}>Work From Office</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          onChange={(value) => {
                            setStartTime(value);
                            console.log(value.format("HH:mm:ss"));
                          }}
                          value={startTime}
                          label="Basic time picker"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          onChange={(value) => setEndTime(value)}
                          value={endTime}
                          label="Basic time picker"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="center">
                      <Grid item xs={2} display="flex" alignItems="center">
                        <Button
                          variant="outlined"
                          onClick={() => setIsCheckin(false)}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item xs={2} display="flex" alignItems="center">
                        <Button
                          variant="contained"
                          onClick={() => setIsTakePicture(true)}
                        >
                          Continue
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}
