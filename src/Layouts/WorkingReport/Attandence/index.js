import {
  Grid,
  Typography,
  Button,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import "../../../App.css";
import React, { useContext, useEffect, useState } from "react";
import UploaderFile from "../../../Component/UploaderFile";
import client from "../../../global/client";
import { AlertContext } from "../../../context";
import moment from "moment";
const Attendance = ({ dataPeriod, setIsCheckin }) => {
  const listLocation = [
    {
      label: "Work From Home",
      value: "Work From Home",
    },
    {
      label: "Work From Office",
      value: "Work From Office",
    },
  ];
  const [presence, setPresence] = useState({
    value: undefined,
    label: "",
  });
  const [location, setLocation] = useState("");
  const [listPresence, setListPresence] = useState([]);
  const [filePath, setFilePath] = useState("");
  const { setDataAlert } = useContext(AlertContext);
  const handleChange = (value) => {
    setPresence(value);
  };

  const handleChangeLocation = (event) => {
    setLocation(event.target.value);
  };

  const getDatalist = async () => {
    const res = await client.requestAPI({
      method: "GET",
      endpoint: `/ol/presence?search=`,
    });
    console.log("res: ", res.data);
    const temp = res.data.map((value) => {
      return {
        value: value.id,
        label: value.attributes.name,
      };
    });
    localStorage.setItem("listPresence", JSON.stringify(temp));
    setListPresence(temp);
  };

  useEffect(() => {
    getDatalist();
  }, []);

  const onContinue = async () => {
    let body = {};
    let workingReportId = null;
    if (presence.value === "42") {
      body = {
        periodId: "7",
        presenceId: parseInt(presence.value),
        userId: 2,
        date: dataPeriod.tanggal,
        workLocation: location,
      };
      localStorage.setItem("presence", presence.value);
      const res = await client.requestAPI({
        endpoint: "/workingReport/attendance",
        method: "POST",
        data: body,
      });
      console.log("res: ", res);
      if (!res.isError) {
        console.log("apakah");
        localStorage.setItem(
          "workingReportId",
          res.data.attributes.workingReportId
        );
        console.log("harusnya");
        setIsCheckin(true);
      } else {
        setDataAlert({
          severity: "error",
          message: res.error.detail,
          open: true,
        });
      }
    } else {
      body = {
        periodId: dataPeriod.period,
        presenceId: parseInt(presence.value),
        userId: 2,
        date: dataPeriod.tanggal,
        file: filePath,
      };
      const res = await client.requestAPI({
        endpoint: "/workingReport/notAttendance",
        method: "POST",
        data: body,
      });
      console.log("res: ", res);
      if (!res.isError) {
        workingReportId = res.data.attributes.workingReportId;
      }
      {
        setDataAlert({
          severity: "error",
          message: res.error.detail,
          open: true,
        });
      }
    }
  };

  const renderBottom = () => {
    let dom = null;
    if (presence.value === "42") {
      dom = (
        <TextField
          value={location}
          select
          className="input-field-crud"
          label="Check In Location"
          placeholder="Select Location"
          fullWidth
          onChange={handleChangeLocation}
        >
          {listLocation.map((res, index) => (
            <MenuItem value={res.value} key={`${index + 1}-menu-item`}>
              {res.label}
            </MenuItem>
          ))}
        </TextField>
      );
    } else if (presence.value !== "42" && presence.value !== undefined) {
      dom = (
        <UploaderFile onCompleteUpload={(urlFile) => setFilePath(urlFile)} />
      );
    }
    return dom;
  };

  return (
    <div className="card-attendance">
      <Grid container rowSpacing={2}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="attendanceHeader">
            Employee Attendance
          </Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="attendanceTrack">
            Track and start your workday
          </Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="attendanceHeader">
            {moment(dataPeriod.tanggal).format('dddd, DD MMMM YYYY')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            className="autocomplete-input"
            options={listPresence}
            sx={{ width: "100%", marginTop: "20px" }}
            onChange={(_event, newValue) => handleChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                className="input-field-crud"
                label="Presence"
                placeholder="Select status"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          {renderBottom()}
        </Grid>
        <Grid
          item
          xs={12}
          textAlign="center"
          mt={presence.value === "42" ? 21 : 15}
        >
          <Button style={{ marginRight: "16px" }} variant="outlined">
            Cancel
          </Button>
          <Button
            disabled={
              (presence.value === undefined || location === "") &&
              filePath === ""
            }
            variant="saveButton"
            onClick={() => onContinue()}
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Attendance;
