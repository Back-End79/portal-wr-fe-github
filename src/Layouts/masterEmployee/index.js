import React, { useState, useEffect } from "react";
import content from "../fileJson/api/db.json";
import client from "../../global/client";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import CustomAlert from "../../Component/Alert";
import DataTable from "../../Component/DataTable";
import SideBar from "../../Component/Sidebar";
import { useNavigate } from "react-router";

const Employee = () => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [synchronise, setSynchronise] = useState(true)
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState()
  const [filter, setFilter] = useState({
    page: 0,
    size: 10,
    sortName: 'name',
    sortType: 'desc',
    search: ''
  })

  const columns = [
    {
      field: "no",
      headerName: "No",
    },
    {
      field: "nip",
      headerName: "NIP",
      flex: 0.5,
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={params.row.image}
              className="img-master-employee"
              alt="Profile Image"
            />
            <div style={{ marginLeft: "0.5rem" }}>
              <span className="text-name">{params.row.fullName}</span>
              <span className="text-position">{params.row.position}</span>
            </div>
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Work Email",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "division",
      headerName: "Division Group",
      flex: 1,
    },
  ];

  useEffect(() => {
    // fetchData()
    getData()
  }, [filter])

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/content");
  //     const jsonData = await response.json();
  //     const updatedData = jsonData.map((item, index) => ({
  //       ...item,
  //       no: index + 1,
  //     }));
  //     setData(updatedData);
  //   } catch (error) {
  //   }
  // };

  const getData = async () => {
    const res = await client.requestAPI({
      method: 'GET',
      endpoint: `/users?page=${filter.page}&size=${filter.size}&sort=${filter.sortName},${filter.sortType}`
    })
    rebuildData(res)
  }

  const rebuildData = (resData) => {
    let temp = []
    let number = filter.page * filter.size
    temp = resData.data.map((value, index) => {
      return {
        no: number + (index + 1),
        id: value.id,
        nip: value.attributes.nip,
        fullName: value.attributes.fullName,
        email: value.attributes.email,
        department: value.attributes.department,
        division: value.attributes.divisionGroup
      }
    })
    setData([...temp])
    setTotalData(resData.meta.page.totalElements)
  }


  const handleDelete = async (id) => {
    handleClose();
  };
       
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleDetail = (id) => {
    navigate("/masteremployee/detail");
  };

  
  const handleChangeSearch = (event) => {
  };

  const onAdd = () => {
    navigate("/masteremployee/create");
  };


  const onFilter = (dataFilter) => {
    setFilter({
      page: dataFilter.page,
      size: dataFilter.pageSize,
      sortName: dataFilter.sorting.field !== '' ? dataFilter.sorting[0].field : 'name',
      sortType: dataFilter.sorting.sort !== '' ? dataFilter.sorting[0].sort : 'desc',
    })
  }

  return (
    <div>
      <SideBar>
        <CustomAlert
          severity="warning"
          message="Deletion completed: The item has been successfully remove from the database"
          open={openAlert}
          onClose={handleCloseAlert}
        />

        <DataTable
          title="Employee"
          data={data}
          columns={columns}
          placeSearch="Name, NIP, etc"
          searchTitle="Search By"
          onAdd={() => onAdd()}
          onEmployee={synchronise}
          onFilter={(dataFilter => onFilter(dataFilter))}
          handleChangeSearch={handleChangeSearch}
          onDetail={(id) => handleDetail(id)}
          onDelete={(id) => handleDelete(id)}
        />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-delete"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Data"}</DialogTitle>
          <DialogContent className="dialog-delete-content">
            <DialogContentText
              className="dialog-delete-text-content"
              id="alert-dialog-description"
            >
              Warning: Deleting this data is irreversible. Are you sure you want
              to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialog-delete-actions">
            <Button
              onClick={handleClose}
              variant="outlined"
              className="button-text"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="delete-button button-text"
            >
              Delete Data
            </Button>
          </DialogActions>
        </Dialog>
      </SideBar>
    </div>
  );
};

export default Employee;
