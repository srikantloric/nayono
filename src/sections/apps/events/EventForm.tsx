import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { SnackbarProps } from 'types/snackbar';

// MUI
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from '@mui/material';

// project
import useFirebase from 'hooks/useFirebase';
import { insertEvent } from 'api/event';
import { useGetCustomer } from 'api/customer';
import { openSnackbar } from 'api/snackbar';

type EventStatus = 'CREATED' | 'ACTIVE' | 'LOCKED';

const EventSchema = Yup.object().shape({
    name: Yup.string().required(),
    date: Yup.string().required(),
    status: Yup.string().required(),
    clientPin: Yup.string().required(),
    pinExpiry: Yup.string().required()
});

export default function EventForm({ closeModal }: { closeModal: () => void }) {
    const { db, user } = useFirebase();
    const { customers } = useGetCustomer();

    interface EventFormValues {
        name: string;
        date: string;
        status: EventStatus;
        clientPin: string;
        pinExpiry: string;
        cameras: number;
        totalPhotos: number;
        selectedCount: number;
        createdBy: string;
    }


    const formik = useFormik<EventFormValues>({
        initialValues: {
            name: '',
            date: '',
            status: 'CREATED',
            clientPin: '',
            pinExpiry: '',
            cameras: 0,
            totalPhotos: 0,
            selectedCount: 0,
            createdBy: ''
        },
        validationSchema: EventSchema,
        onSubmit: async (values) => {
            const selectedCustomer = customers.find(
                (c) => c.docId === values.createdBy
            );

            await insertEvent(db, {
                name: values.name,
                date: values.date,
                status: values.status,
                clientPin: values.clientPin,
                pinExpiry: values.pinExpiry,
                cameras: values.cameras,
                totalPhotos: values.totalPhotos,
                selectedCount: values.selectedCount,
                createdBy: {
                    customerId: selectedCustomer!.docId,
                    customerName: selectedCustomer!.customerName
                },
                userId: user?.id || ''
            });

            openSnackbar({
                open: true,
                message: 'Event created successfully',
                variant: 'alert',
                severity: 'success'
            } as SnackbarProps);


            closeModal();
        }
    });

    const { getFieldProps, handleSubmit } = formik;
    const CAMERA_OPTIONS = [1, 2, 3, 4, 5];

    return (
        <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
                <DialogTitle>Create Event</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField label="Event Name" fullWidth {...getFieldProps('name')} />
                        </Grid>


                        <Grid size={{ xs: 6 }}>
                            <TextField type="date" fullWidth {...getFieldProps('date')} />
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                            <Select fullWidth {...getFieldProps('status')}>
                                <MenuItem value="CREATED">CREATED</MenuItem>
                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                <MenuItem value="LOCKED">LOCKED</MenuItem>
                            </Select>
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                            <TextField label="Client PIN" {...getFieldProps('clientPin')} />
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                            <TextField
                                type="date"
                                label="PIN Expiry"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                {...getFieldProps('pinExpiry')}
                            />
                        </Grid>

                        <Grid size={{ xs: 4 }}>
                            <InputLabel id="cameras-label">Cameras</InputLabel>
                            <Select
                                labelId="cameras-label"
                                fullWidth
                                value={formik.values.cameras}
                                onChange={(e) => formik.setFieldValue('cameras', Number(e.target.value))}
                            >
                                {CAMERA_OPTIONS.map((count) => (
                                    <MenuItem key={count} value={count}>
                                        {count} Camera{count > 1 ? 's' : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>


                        <Grid size={{ xs: 8 }}>
                            <InputLabel>Created By (Customer)</InputLabel>
                            <Select fullWidth {...getFieldProps('createdBy')}>
                                {customers.map((c) => (
                                    <MenuItem key={c.docId} value={c.docId}>
                                        {c.customerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Form>
        </FormikProvider>
    );
}
