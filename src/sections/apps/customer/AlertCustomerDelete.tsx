// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import { openSnackbar } from 'api/snackbar';
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { Trash } from 'iconsax-reactjs';

// types
import { SnackbarProps } from 'types/snackbar';

interface Props {
  title: string;
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => Promise<void>;
}

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertCustomerDelete({
  title,
  open,
  handleClose,
  handleConfirm
}: Props) {
  const onDelete = async () => {
    await handleConfirm();
    openSnackbar({
      open: true,
      message: 'Customer deleted successfully',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      variant: 'alert',
      severity: 'success'
    } as SnackbarProps);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      slots={{ transition: PopupTransition }}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack sx={{ gap: 3.5, alignItems: 'center' }}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>

          <Stack sx={{ gap: 2 }}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              user, all task assigned to that user will also be deleted.
            </Typography>
          </Stack>

          <Stack direction="row" sx={{ gap: 2, width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={onDelete}
              autoFocus
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
