import React, { useContext, useEffect, useState } from "react";
import SideBar from "../../Component/Sidebar";
// import Calendar from "../../Component/CalendarCustom";
import { Avatar, Button, Card, Grid, Typography, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckinTime from "./CheckIn";
import Attendance from "./Attandence";
import Calendar from "../../Component/CalendarCustom";
import { useNavigate } from "react-router-dom";
import client from "../../global/client";
import moment from "moment/moment";
import PopupTask from "./PopupTask";
import { AlertContext } from "../../context";
import ViewTask from "./ViewTask";
import ViewOvertime from "../Overtime/detailEditOvertime";
import CheckOut from "./CheckOut";
import CreateOvertime from "../Overtime/createOvertime";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TaskConfiguration from "./PopupSetting/TaskConfiguration";
import ColumnConfiguration from "./PopupSetting/CoumnConfiguration";
import ApprovalConfiguration from "./PopupSetting/ApprovalConfiguration";
import DownloadConfiguration from "../../Component/DownloadConfig";
import { getWorkingReportExcelUrl, getWorkingReportPdfUrl } from "../../global/donwloadConfig";

export default function WorkingReport() {
  const [isCheckin, setIsCheckin] = useState(false);
  const [isViewTask, setIsViewTask] = useState(false);
  const [isViewOvertime, setIsViewOvertime] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [openOvertime, setOpenOvertime] = useState(false);
  const [selectedWorkingReportId, setSelectedWorkingReportId] = useState()
  const [WrIdDetail, setWrIdDetail] = useState()
  const [dropMenu, setDropMenu] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [value, setValue] = useState("one");
  const open = dropMenu
  const handleClick = (event) => {
    setDropMenu(event.currentTarget)
  }
  
  const handleClose = () => {
    setDropMenu(null);
  };

  const handleSetting = () => {
    setOpenDialog(true)
  };

  const handleCloseSetting = () => {
    setOpenDialog(false)
  }

  const handleTab = (event, newValue) => {
    setValue(newValue);
  };

  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const [filter, setFilter] = useState({
    startDate: new Date(y, m, 1),
    endDate: new Date(y, m + 1, 0),
  });
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataAttandance, setAttandance] = useState({
    isAttandance: false,
    dataPeriod: null,
  });
  const { setDataAlert } = useContext(AlertContext);
  const [downloadConfiguration, setDownloadConf] = useState({
    open: false
  })

  useEffect(() => {
    console.log("WrIdDetail: ", WrIdDetail);
    localStorage.removeItem("companyId");    
    getData();
  }, [filter], WrIdDetail);

  const getData = async () => {
    const res = await client.requestAPI({
      method: "GET",
      endpoint: `/workingReport/${moment(filter.startDate).format(
        "yyyy-MM-DD"
      )}/${moment(filter.endDate).format("yyyy-MM-DD")}/2`,
    });
    if (!res.isError) {
      rebuildData(res);
    } else {
      setDataAlert({
        severity: "error",
        message: res.error.detail,
        open: true,
      });
    }
  };

  // func for get download file excel or pdf
  const downloadFormatFile = (employeeId = 1, isExcell, url = '') => {
    // employeeId = this.state.role !== 'talent' ? this.state.selectedEmployee.employeeId : localStorage.getItem('employeeId');
    // const start = this.state.startDate;
    // const end = this.state.endDate;
    const start = "2023-07-01";
    const end = "2023-07-31";
    const link = document.createElement('a');
    link.href = isExcell ? getWorkingReportExcelUrl(employeeId, start, end, url) : getWorkingReportPdfUrl(employeeId, start, end, url);
    link.download = '';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(link.href);
  }

  const rebuildData = (resData) => {
    console.log("data: ", resData);
    let temp = [];
    temp = resData.data.map((value, index) => {
      return value.attributes.listDate.holiday
        ? {
            title: "Libur",
            date: moment(value.attributes.listDate.date).format("yyyy-MM-DD"),
            tanggal: moment(value.attributes.listDate.date).format(
              "yyyy-MM-DD"
            ),
            period: value.attributes.period,
            workingReportId: value.attributes.listDate.workingReportId,
          }
        : {
            period: value.attributes.period,
            tanggal: moment(value.attributes.listDate.date).format(
              "yyyy-MM-DD"
            ),
            workingReportId: value.attributes.listDate.workingReportId,
            absenceId: value.attributes.listDate.presenceId,
          };
    });
    console.log(temp);
    setData([...temp]);
  };

  const onAttendence = (value) => {    
    console.log("attendance", value);
    if (value[0].workingReportId !== null) {
      setIsCheckin(true);
    }
    setAttandance({
      dataPeriod: value[0],
      isAttandance: true,
    });
    console.log(value[0]);
  };

  const renderCheckin = () => {
    let dom = null;
    if (isCheckin) {
      dom = (
        <CheckinTime
          setIsCheckin={(param) => {
            setIsCheckin(() => false);
          }}
        />
      );
    } else if (dataAttandance.isAttandance) {
      dom = (
        <Attendance
          dataPeriod={dataAttandance.dataPeriod}
          setIsCheckin={(param) => {            
            setIsCheckin(true);
          }}
        />
      );
    } else if (isCheckOut) {
      dom = <CheckOut />;
    } else if (isViewTask) {
      dom = (
        <ViewTask
          setIsCheckOut={() => {
            setIsViewTask(false);
            setIsCheckOut(true);
          }}          
          WrIdDetail={WrIdDetail}
        />
      );
    } else if (isViewOvertime) {
      dom = (
        <ViewOvertime
        WrIdDetail = {WrIdDetail}
        />
      )
    }
      else {
      dom = (
        <Calendar
          setOnClick={(param) => {
            const _data = data.filter(
              (val) => val.tanggal == moment(param.date).format("yyyy-MM-DD")
            );
            onAttendence(_data);
          }}
          setIsViewTask={setIsViewTask}
          setIsViewOvertime={setIsViewOvertime}
          events={data}
          setWrIdDetail={setWrIdDetail}
        />
      );
    }
    return dom;
  };

  const openDownload = (open) => {
    setDownloadConf({
      open
    })
  }

  const handleDownloadPdf = () => {
    downloadFormatFile(1, false, "/workingReport/download/pdf?userId=")
  }

  const handleDownloadExcel = () => {
    downloadFormatFile(1, true, "/workingReport/download/excel?userId=")
  }

  return (
    <SideBar>
      <Grid container rowSpacing={2}>
        <Grid time xs={12}>
          <Card className="cardHeader">
            <Grid container p={2} alignContent="space-between" spacing={1}>
              <Grid item xs={0.1}>
                <div className="dividerHeader" />
              </Grid>
              <Grid item xs={8.4}>
                <Typography variant="headerCardMenu">{`Working Report`}</Typography>
              </Grid>
              <Grid item xs={2} alignItems="right">
                <Button
                  id="basic-button"
                  variant="contained"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  startIcon={<DownloadIcon style={{ fontSize: 16 }} />}
                  endIcon={<ArrowForwardIosIcon style={{ fontSize: 14 }} />}
                  sx={{marginTop: 1.5, marginRight: -1}}
                >
                  Download
                </Button>
                <Menu
                  id="basic-menu"
                  sx={{marginTop: 0.5}}
                  anchorEl={open}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleDownloadPdf}>Download as Pdf</MenuItem>
                  <MenuItem onClick={handleDownloadExcel}>Download as Excel</MenuItem>
                </Menu>
              </Grid>
              <Grid display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={handleSetting}
                  // onClick={() => openDownload(true)}
                  startIcon={<SettingsIcon />}
                  sx={{paddingY: 1}}
                >
                  Settings
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Avatar variant="square" className="full-avatar" />
              </Grid>
              <Grid item xs={11}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="body2">Employee Details</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Name</Typography>
                    <Typography variant="drawerNameUser">
                      ikiwprikitiw
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Role</Typography>
                    <Typography variant="drawerNameUser">Dev Ops</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Email</Typography>
                    <Typography variant="drawerNameUser">
                      ikiwprikitiw@gmail.com
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => setOpenTask(true)}>Open task</Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => setOpenOvertime(true)}>Open Overtime</Button>
        </Grid>
        <Grid item xs={12}>
          {renderCheckin()}
        </Grid>
      </Grid>

<>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-configuration"
      >
        <DialogTitle id="alert-dialog-title" className='dialog-delete-header'>
          {"Setting Download Configuration"}
        </DialogTitle>
        <DialogContent className="dialog-delete-content">
          <DialogContentText className='dialog-delete-text-content' id="alert-dialog-description">
            Edit setting documents
          </DialogContentText>
        </DialogContent>

        <Grid>
            <Box className="tab-config">
              <Tabs value={value} onChange={handleTab} >
                <Tab value="one" label="TASK CONFIGURATION"></Tab>
                <Tab value="two" label="COLUMN CONFIGURATION" />
                <Tab value="three" label="APPROVAL CONFIGURATION" />
              </Tabs>
            </Box>
            {value === "one" && (<TaskConfiguration/>)}
            {value === "two" && (<ColumnConfiguration />)}
            {value === "three" && (<ApprovalConfiguration/>)}
          </Grid>

        <DialogActions className="dialog-delete-actions">
          <Button onClick={handleCloseSetting} variant='outlined' className="button-text">Cancel</Button>
          <Button onClick={handleCloseSetting} variant='contained' className='button-text'>Update Configuration</Button>
        </DialogActions>
    </Dialog>

    </>

      <PopupTask selectedWrIdanAbsenceId={104} open={openTask} closeTask={() => setOpenTask(false)} />
      <CreateOvertime open={openOvertime} closeTask={() => setOpenOvertime(false)} />
      <DownloadConfiguration {...downloadConfiguration} onClose={() => openDownload(false)} />
    </SideBar>
  );
}
