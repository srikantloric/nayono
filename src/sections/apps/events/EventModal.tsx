import Modal from '@mui/material/Modal';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import EventForm from './EventForm';

export default function EventModal({ open, onClose }: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <MainCard
        modal
        sx={{ minWidth: 600, maxWidth: 900, maxHeight: '90vh' }}
        content={false}
      >
        <SimpleBar>
          <EventForm closeModal={onClose} />
        </SimpleBar>
      </MainCard>
    </Modal>
  );
}
