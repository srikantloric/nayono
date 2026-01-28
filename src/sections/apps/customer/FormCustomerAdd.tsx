import { useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// third-party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project-imports
import { insertCustomer, updateCustomer } from 'api/customer';
import { openSnackbar } from 'api/snackbar';
import useFirebase from 'hooks/useFirebase';

// types
import { SnackbarProps } from 'types/snackbar';
import { CustomerList } from 'types/customer';

// ==============================|| FORM VALIDATION ||============================== //

const CustomerSchema = Yup.object().shape({
  customerName: Yup.string().required('Customer name is required'),
  customerFather: Yup.string().required('Father name is required'),
  customerContact: Yup.string()
    .required('Contact number is required')
    .min(10, 'Must be at least 10 digits'),
  customerAddress: Yup.string().required('Address is required')
});

// ==============================|| INITIAL VALUES ||============================== //

const getInitialValues = (customer: CustomerList | null) => ({
  customerName: customer?.customerName || '',
  customerFather: customer?.customerFather || '',
  customerContact: customer?.customerContact || '',
  customerAddress: customer?.customerAddress || ''
});

// ==============================|| CUSTOMER ADD / EDIT FORM ||============================== //

export default function FormCustomerAdd({
  customer,
  closeModal
}: {
  customer: CustomerList | null;
  closeModal: () => void;
}) {
  const { db, user } = useFirebase();

  const formik = useFormik({
    initialValues: getInitialValues(customer),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (customer) {
          // ✅ UPDATE
          await updateCustomer(db, customer.docId, values);

          openSnackbar({
            open: true,
            message: 'Customer updated successfully',
            variant: 'alert',
            severity: 'success'
          } as SnackbarProps);
        } else {
          // ✅ ADD
          await insertCustomer(db, {
            ...values,
            id: Math.floor(Math.random() * 10000),
            userId: user?.id || ''
          });          

          openSnackbar({
            open: true,
            message: 'Customer added successfully',
            variant: 'alert',
            severity: 'success'
          } as SnackbarProps);
        }

        closeModal();
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Customer Name</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Enter customer name"
                  {...getFieldProps('customerName')}
                  error={Boolean(touched.customerName && errors.customerName)}
                  helperText={touched.customerName && errors.customerName}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Father Name</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Enter father name"
                  {...getFieldProps('customerFather')}
                  error={Boolean(touched.customerFather && errors.customerFather)}
                  helperText={touched.customerFather && errors.customerFather}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Contact Number</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Enter contact number"
                  {...getFieldProps('customerContact')}
                  error={Boolean(touched.customerContact && errors.customerContact)}
                  helperText={touched.customerContact && errors.customerContact}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Address</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter address"
                  {...getFieldProps('customerAddress')}
                  error={Boolean(touched.customerAddress && errors.customerAddress)}
                  helperText={touched.customerAddress && errors.customerAddress}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2}>
            <Button color="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {customer ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
