import React, { useState } from 'react';
// import Index from '../../Component/Header';
// import BreadCumbComp from '../../Component/BreadCumb';
import Grid from '@mui/material/Grid';
import { Button, Typography } from '@mui/material';
// import TabsMenu from '../../Component/menu/tabs';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';

const placement = [
  {
    value: 'wfo',
    label: 'WFO',
  },
  {
    value: 'wfh',
    label: 'WFH',
  },
]

const position = [
  {
    value: 'ceo',
    label: 'Chief Executive Officer',
  },
  {
    value: 'coo',
    label: 'Chief Operation Officer',
  },
  {
    value: 'cco',
    label: 'Chief Customer Officer',
  },
]

const contractStatus = [
  {
    value: 'fulltime',
    label: 'Fulltime',
  },
  {
    value: 'parttime',
    label: 'PartTime',
  },
]

const CBiodataEmployee = ({
  onCancel,
  onSave
}) => {

  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }



  return (
    <>
      <Grid container rowSpacing={3}>
        <Grid item xs container direction="column" spacing={2}>
          <Grid container className="containerHeader">

            <Grid>
              <Typography style={{ marginTop: 20, marginLeft: 30 }}>Profile Picture</Typography>
              <input type="file" accept=".png, .jpg" onChange={handleChange} />
              {/* <img src={file} /> */}
              {/* <Button variant="outlined" onClick={handleChange} style={{marginTop:10, marginLeft:30}}>Upload Image</Button> */}
              <Typography className="text" style={{ marginLeft: 30 }}>Single upload file should not be more 3MB. Only the .png/jpg file types are allowed</Typography>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-number"
                  style={{ width: "100%", paddingRight: "10px" }}
                  label="NIP"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="outlined-required"
                  style={{ width: "100%" }}
                  label="Generation"
                />
              </Grid>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="outlined-required"
                  style={{ width: "100%", paddingRight: "10px" }}
                  label="Employee First Name"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="outlined-required"
                  style={{ width: "100%" }}
                  label="Employee Last Name"
                />
              </Grid>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-number"
                  style={{ width: "100%", paddingRight: "10px" }}
                  label="NPWP"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="outlined-required"
                  style={{ width: "100%" }}
                  label="Email"
                />
              </Grid>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Join Date"
                    sx={{
                      width: "100%", paddingRight: "10px"
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  required
                  id="outlined-placement-type"
                  style={{ width: "100%" }}
                  options={placement}
                  renderInput={(params) => <TextField {...params} label="Placement Type" required />}
                />
              </Grid>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <Autocomplete
                  required
                  id="outlined-contract-status"
                  style={{ width: "100%", paddingRight: "10px" }}
                  options={contractStatus}
                  renderInput={(params) => <TextField {...params} label="Contract Status" required />}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  required
                  id="outlined-onsite-status"
                  style={{ width: "100%" }}
                  options={placement}
                  renderInput={(params) => <TextField {...params} label="Onsite Status" required />}
                />
              </Grid>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}
                  style={{ width: "100%", paddingRight: "10px" }}>
                  <DatePicker
                    label="Contract Start Date"
                    sx={{
                      width: "100%", paddingRight: "10px"
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Contract End Date"
                    sx={{
                      width: "100%",
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container direction="row" style={{ padding: "20px" }}>
              <Grid item xs={6}>
                <Autocomplete
                  required
                  id="outlined-division-group"
                  style={{ width: "100%", paddingRight: "10px" }}
                  options={placement}
                  renderInput={(params) => <TextField {...params} label="Division Group" required />}
                />
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Select Division Group First">
                  <Autocomplete
                    required
                    id="outlined-position"
                    style={{ width: "100%" }}
                    options={position}
                    renderInput={(params) => <TextField {...params} label="Position" required />}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={11.5} alignSelf="center" textAlign="right">
        <Button variant="outlined" color="warning" style={{ marginRight: 3 }} onClick={() => onCancel()}>
          Cancel Data
        </Button>
        <Button variant="contained" onClick={() => onSave()}>
          Save Data
        </Button>
      </Grid>
    </>
  )
}

export default CBiodataEmployee
