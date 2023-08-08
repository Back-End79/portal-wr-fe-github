import React, { useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
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
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AlertContext } from "../../../context";
import client from "../../../global/client";
import schemaholiday from "../shema";
import "../../../App.css";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const EditHoliday = ({ openEdit, setOpenEdit, onEditSuccess, idHoliday, setIdHoliday }) => {
  let methods = useForm({
    defaultValues: {
      date: null,
      notes: "",
    },
    resolver: yupResolver(schemaholiday),
  });

  const { control, handleSubmit, formState, setValue } = methods;
  

  const { setDataAlert } = useContext(AlertContext);

  useEffect(() => {
    getDetailHoliday();
  }, [idHoliday]);

  const getDetailHoliday = async () => {
    const res = await client.requestAPI({
      method: "GET",
      endpoint: `/holiday/${idHoliday}`,
    });
    if (res.data.attributes) {
      const temp = res.data.attributes;
      setValue("notes", temp.notes);
      setValue("date", dayjs(temp.date));
    }
  };

  const onSave = async (data) => {
    const res = await client.requestAPI({
      method: "PUT",
      endpoint: `/holiday/update/${idHoliday}`,
      data,
    });

    if (!res.isError) {
      setDataAlert({
        severity: "success",
        open: true,
        message: res.data.meta.message,
      });
      onEditSuccess();
      setOpenEdit(false);
    } else {
      setDataAlert({
        severity: "error",
        message: res.error.detail,
        open: true,
      });
    }
  };

  const handleClose = () => {
    setIdHoliday(null);
    setOpenEdit(false);
  };

  return (
    <div>
      <Dialog
        open={openEdit}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-delete dialog-task"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" className="dialog-delete-header">
          Select Holiday
        </DialogTitle>
        <DialogContent className="dialog-task-content">
          <DialogContentText className="dialog-delete-text-content" id="alert-dialog-description">
            Grant administrators the authority to manually select holidays for employees.
          </DialogContentText>

          <Grid item xs={12}>
            <Accordion sx={{ boxShadow: "none", width: "100%", marginTop: 2 }}>
              <AccordionDetails>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSave)}>
                    <Grid container rowSpacing={2}>
                      <Grid item xs={12}>
                        <Controller
                          name="date"
                          control={control}
                          defaultValue={null}
                          render={({ field, fieldState }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                {...field}
                                name="date"
                                label="Holiday Date"
                                placeholder="Select Date"
                                className="input-field-crud"
                                sx={{
                                  width: "100%",
                                }}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        {formState.errors.date && (
                          <Typography color="#d32f2f" textAlign={"left"} marginLeft={1} marginTop={1} fontSize={12}>
                            {formState.errors.date.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="notes"
                          control={control}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              focused
                              name="notes"
                              className="input-field-crud"
                              placeholder="e.g New Year's Day"
                              label="Notes"
                              multiline
                              maxRows={4}
                              error={!!formState.errors.notes}
                              helperText={formState.errors.notes ? formState.errors.notes.message : ""}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <DialogActions>
                      <Grid container justifyContent="center" spacing={2} marginTop={2}>
                        <Grid item>
                          <Button variant="outlined" className="button-text" onClick={handleClose}>
                            Back
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            type="submit"
                            variant="contained"
                            className="button-text"
                            disabled={formState.isSubmitting}
                          >
                            Edit Data
                          </Button>
                        </Grid>
                      </Grid>
                    </DialogActions>
                  </form>
                </FormProvider>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditHoliday;
