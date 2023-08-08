import { EditOutlined, UploadFileOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";
import "../../App.css";
import blanktable from "../../assets/blanktable.png";

const DataTable = ({
  title,
  data,
  columns,
  handleChangeMonthFilter,
  handleChangeYearFilter,
  onAdd,
  onEdit,
  onUpload,
  onDelete,
  onFilter,
  totalData,
  loading = false,
}) => {
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [sorting, setSort] = useState([]);
  const [dataColumns, setDataColumns] = useState([]);

  /**
   * return fungsi model dari pagination.
   *
   * @param {model} object Page & page size saat ini.
   */
  const changePagination = (model) => {
    setPagination({ ...model });
  };

  /**
   * return fungsi model dari sorting.
   *
   * @param {model} object field & sort size saat ini dalam bentuk array.
   */
  const changeSort = (model) => {
    if (model.length > 0) {
      setSort([{ ...model }]);
    } else {
      setSort([
        {
          field: "",
          sort: "",
        },
      ]);
    }
  };

  const handleBuildList = (filter) => {
    onFilter(filter);
  };

  useEffect(() => {
    const filter = {
      sorting: sorting.length > 0 ? { ...sorting[0] } : { field: "", sort: "" },
      ...pagination,
    };
    handleBuildList(filter);
  }, [sorting, pagination]);

  useEffect(() => {
    const temp = [...columns];
    temp.push({
      field: "actions",
      headerName: "Action",
      width: 200,
      renderCell: (data) => {
        return (
          <div>
            <IconButton onClick={() => onEdit(data.id)}>
              <EditOutlined />
            </IconButton>
            <IconButton onClick={() => onDelete(data.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    });

    setDataColumns(temp);
  }, [columns]);

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Grid container className="containerHeader">
          <Grid item>
            <div className="dividerHeader" />
          </Grid>
          <Grid item xs={11}>
            <Typography variant="headerCardMenu">{`Master ${title}`}</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item justifyContent="space-between" container xs={12} paddingTop={3}>
        <Grid container direction="row" item xs={4} alignItems="center" justifyContent="flex-start" spacing={2}>
          {/* Input Filter Bulan */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["month"]}
                openTo="month"
                name="month"
                label="Select Month"
                inputFormat="MM"
                onChange={handleChangeMonthFilter}
                renderInput={(params) => <TextField {...params} name="month" variant="outlined" />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Input Filter Tahun */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                openTo="year"
                name="year"
                label="Select Year"
                inputFormat="YYYY"
                onChange={handleChangeYearFilter}
                renderInput={(params) => <TextField {...params} name="year" variant="outlined" />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container direction="row" item xs={4} gap={1} alignItems="center" justifyContent="flex-end">
          <Button variant="contained" onClick={() => onAdd()} startIcon={<AddIcon />}>
            {`NEW ${title}`}
          </Button>
          <Button variant="outlined" onClick={() => onUpload()} startIcon={<UploadFileOutlined />} sx={{ paddingY: 1 }}>
            Upload Holiday
          </Button>
        </Grid>
      </Grid>
      {data.length > 0 ? (
        <Grid item xs={12}>
          <DataGrid
            rows={data}
            columns={dataColumns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            paginationMode="server"
            paginationModel={{ ...pagination }}
            onPaginationModelChange={(model) => changePagination(model)}
            onSortModelChange={(model) => changeSort(model)}
            disableColumnFilter
            loading={loading}
            disableColumnMenu
            rowCount={totalData}
            getRowId={(row) => row.id}
          />
        </Grid>
      ) : (
        <Grid
          container
          item
          xs={12}
          minHeight="600px"
          alignContent="center"
          alignItems="center"
          display="flex"
          justifyContent="center"
          textAlign="center"
        >
          <Grid item xs={12} pb={3.75}>
            <img src={blanktable} alt="blank-table" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="noDataTable">Sorry, the data you are looking for could not be found.</Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default DataTable;
