import React, { useContext, useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import SideBar from '../../../Component/Sidebar';
import Breadcrumbs from "../../../Component/BreadCumb";
import Header from '../../../Component/Header'
import { Dialog, Button, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Avatar } from '@mui/material';
import '../../../App.css'
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from "react-hook-form";
import FormInputText from '../../../Component/FormInputText';
import schemacompany from '../shema';
import client from '../../../global/client';
import uploadFile from '../../../global/uploadFile';
import TableNative from '../../../Component/DataTable/Native';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { AlertContext } from '../../../context';

const DetailCompany = () => {
  const [dataProject, setDataProject] = useState([]) 
  const columnsProject = [
    {
      field: "projectName",
      headerName: "Project Name",
      flex: 1,
    },
    {
      field: "projectType",
      headerName: "Project Type",
      flex: 1,
    },
  ]

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [sendData, setData] = useState({})
  const [isSave, setIsSave] = useState(false)
  const { setDataAlert } = useContext(AlertContext)
  const [file, setFile] = useState('')
  const [companyId, setCompanyId] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [dataDetail, setDataDetail] = useState({
    companyName: '',
    companyEmail: '',
    npwp: '',
    address: '',
  })
  const [filePath, setFilePath] = useState('')
  const dataBread = [
    {
      href: "/dashboard",
      title: "Dashboard",
      current: false,
    },
    {
      href: "/master-company",
      title: "Company",
      current: false,
    },
    {
      href: "/master-company/create",
      title: "Create New Company",
      current: true,
    },
  ];

  const cancelData = () => {
    setIsSave(false)
    setOpen(true)
  }

  const confirmSave = async (data) => {
    setIsSave(true)
    setOpen(true)
    setData(data)
  }


  let methods = useForm({
    resolver: yupResolver(schemacompany),
    defaultValues: {
      companyName: '',
      companyEmail: '',
      npwp: '',
      address: '',
    }
  })

  useEffect(() => {
    getDataDetail()
  }, [])

  const getDataDetail = async () => {
    const id = localStorage.getItem('companyId')
    setCompanyId(id)
    const res = await client.requestAPI({
      method: 'GET',
      endpoint: `/company/${id}`
    })
    if (res.data.attributes) {
      setDataProject(res.data.attributes.projects)
      const temp = res.data.attributes
      delete temp.createdBy
      delete temp.createdOn
      delete temp.isActive
      delete temp.lastModifiedBy
      delete temp.lastModifiedOn
      for (const property in temp) {
        if (property === 'companyProfile') {
          const urlMinio = temp[property] ? `${process.env.REACT_APP_BASE_API}/${temp[property]}` : ''
          setFilePath(temp[property])
          setFile(urlMinio)
        } else {
          methods.setValue(`${property}`, `${temp[property]}`)
          setDataDetail(temp)
        }
      }
    }
  }

  const handleClose = () => {
    if (!isSave) {
      setIsEdit(false)
      getDataDetail()
    }
    setOpen(false)
  }
  const onSave = async () => {
    const data = {
      ...sendData,
      companyProfile: filePath
    }
    const res = await client.requestAPI({
      method: 'PUT',
      endpoint: `/company/${companyId}`,
      data
    })
    if (!res.isError) {
      setDataAlert({
        severity: 'success',
        open: true,
        message: res.data.meta.message
      })
      navigate('/master-company')
    } else {
      setDataAlert({
        severity: 'error',
        message: res.error.detail,
        open: true
      })
    }
    setOpen(false)
  }

  const handleChange = async (e) => {
    if (e.target.files) {
      const tempFilePath = await uploadFile(e.target.files[0])
      setFilePath(tempFilePath)
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  }

  const handleProject = () => {
    navigate('/masterProject')
  }

  return (
    <SideBar>
      <Breadcrumbs breadcrumbs={dataBread} />
        <Grid container>
          <Grid item xs={8} pb={2}>
            <Header judul={isEdit ? 'Edit Company' : 'Detail Company'} />
          </Grid>
          {!isEdit && 
            <Grid item xs={4} alignSelf='center' textAlign='end'>
              <Button
                variant='outlined'
                className="button-text"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setIsEdit(true)}
              >
                Edit Data Company
              </Button>
            </Grid>
          }
          <Grid item xs={12}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(confirmSave)}>
                <div className='card-container-detail'>
                    <Grid 
                      item 
                      container 
                      columnSpacing={3.79}
                      rowSpacing={3.79}
                      xs={12}
                    >
                      <Grid item xs={12}>
                        <Typography>
                          Company Picture
                        </Typography>
                      </Grid>
                      <Grid item container xs={12}>
                        <Grid item mr={2}>
                          <Avatar src={file} className="image-upload" />
                        </Grid>
                        {isEdit &&
                          <Grid item xs={2} className='custom-file-upload'>
                            <label className='class-label-upload'>Upload Image</label>
                            <input
                              type="file"
                              accept=".png, .jpg"
                              className="custom-file-input"
                              onChange={handleChange}
                            />
                          </Grid>
                        }
                        {isEdit && 
                          <Grid item xs={12} mt={1}>
                            <Typography variant='titleTextWarningUpload'>
                              Single upload file should not be more 3MB. Only the .png/jpg file types are allowed
                            </Typography>
                          </Grid>
                        }
                      </Grid>
                      <Grid item xs={6}>
                        {isEdit ? (
                          <FormInputText
                            focused
                            name='companyName'
                            className='input-field-crud'
                            placeholder='e.g PT. ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                            label='Company Name'
                          />
                        ) : (
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography variant='labelHeaderDetail'>Company Name</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='inputDetail'>{dataDetail.companyName}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        {isEdit ? (
                          <FormInputText
                            focused
                            name='companyEmail'
                            className='input-field-crud'
                            placeholder='e.g PT. company@mail.com'
                            label='Company Email'
                          />
                        ) : (
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography variant='labelHeaderDetail'>Company Email</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='inputDetail'>{dataDetail.companyEmail}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        {isEdit ? (
                          <FormInputText
                            focused
                            name='npwp'
                            className='input-field-crud'
                            placeholder='e.g PT. XX.XXX.XXX.X-XXX.XXX'
                            label='Company NPWP'
                          />
                        ) : (
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography variant='labelHeaderDetail'>Company NPWP</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='inputDetail'>{dataDetail.npwp}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        {isEdit ? (
                          <FormInputText
                            focused
                            name='address'
                            className='input-field-crud'
                            placeholder='e.g PT. Jalan Gatot Subroto no 122'
                            label='Company Address'
                          />
                        ) : (
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography variant='labelHeaderDetail'>Company Address</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='inputDetail'>{dataDetail.address}</Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                      {/* <Grid item xs={6}>
                        <FormInputText
                          focused
                          name='picName'
                          className='input-field-crud'
                          placeholder='e.g Steven White'
                          label='PIC Name'
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormInputText
                          focused
                          name='picPhone'
                          className='input-field-crud'
                          placeholder='e.g 08*********'
                          label='PIC Phone'
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormInputText
                          focused
                          name='picEmail'
                          className='input-field-crud'
                          placeholder='e.g pic@mail.com'
                          label='PIC Email'
                        />
                      </Grid> */}
                    </Grid>
                  {isEdit && (
                    <Grid
                      item 
                      container 
                      xs={12}
                      justifyContent='end'
                      mt={3.5}
                    >
                      <Grid item xs={9} />
                      <Grid item xs textAlign='right'>
                        <Button
                          style={{ marginRight: '16px' }} 
                          variant='cancelButton'
                          onClick={() => cancelData()}
                        >
                          Cancel Data
                        </Button>
                        <Button
                          variant='saveButton'
                          type='submit'
                        >
                          Save Data
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </div>
              </form>
            </FormProvider>
          </Grid>
          <Grid item container mt={2} xs={12}>
            <div className='card-container-detail'>
              <Grid item xs={12} mb={3} textAlign='end'>
                <Button
                  variant='outlined'
                  className="button-text"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => handleProject()}
                >
                  New Project
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TableNative data={dataProject} columns={columnsProject} />
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="dialog-delete"
        >
          <DialogTitle id="alert-dialog-title" className='dialog-delete-header'>
            {isSave ? "Save Data" : 'Cancel Data'}
          </DialogTitle>
          <DialogContent className="dialog-delete-content">
            <DialogContentText className='dialog-delete-text-content' id="alert-dialog-description">
              {isSave ? 'Save your progress: Don\'t forget to save your data before leaving' : 'Warning: Canceling will result in data loss without saving!'}
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialog-delete-actions">
            <Button onClick={handleClose} variant='outlined' className="button-text">{isSave ? 'Back' : 'Cancel without saving'}</Button>
            <Button onClick={onSave} variant='saveButton'>{isSave ? 'Save Data' : 'Back'}</Button>
          </DialogActions>
        </Dialog>
    </SideBar>
  )

}

export default DetailCompany