import { useMemo, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table';

// project imports
import MainCard from 'components/MainCard';
import {
    HeaderSort,
    IndeterminateCheckbox,
    TablePagination
} from 'components/third-party/react-table';

// icons
import { Eye, Add } from 'iconsax-reactjs';

// api
import { useGetEvents } from 'api/event';

// types
import { EventList } from 'types/event';

// modal
import EventModal from 'sections/apps/events/EventModal';

// ==============================|| EVENTS PAGE ||============================== //

export default function Events() {
    const [open, setOpen] = useState(false);

    // 🔥 Firestore data
    const { events, eventsLoading, eventsEmpty } = useGetEvents();

    // ==============================|| TABLE COLUMNS ||============================== //
    const columns = useMemo<ColumnDef<EventList>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            )
        },
        {
            header: 'Event',
            accessorKey: 'name'
        },
        {
            header: 'Date',
            accessorKey: 'date'
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = getValue() as EventList['status'];

                const color =
                    status === 'ACTIVE'
                        ? 'error'
                        : status === 'CREATED'
                            ? 'primary'
                            : 'success';

                return <Chip label={status} color={color as any} size="small" />;
            }
        },
        {
            header: 'Cameras',
            accessorKey: 'cameras'
        },
        {
            header: 'Photos',
            accessorKey: 'totalPhotos'
        },
        {
            header: 'Selected',
            accessorKey: 'selectedCount'
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <Button size="small" variant="outlined" startIcon={<Eye />}>
                    View
                </Button>
            )
        }
    ], []);

    // ==============================|| TABLE INSTANCE ||============================== //
    const table = useReactTable({
        data: events,
        columns,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    // ==============================|| LOADING STATE ||============================== //
    if (eventsLoading) {
        return (
            <MainCard title="All Events">
                <Typography sx={{ p: 3 }}>Loading events...</Typography>
            </MainCard>
        );
    }

    // ==============================|| EMPTY STATE ||============================== //
    if (eventsEmpty) {
        return (
            <>
                <MainCard title="All Events">
                    <Stack sx={{ p: 3 }} spacing={2}>
                        <Typography>No events found.</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpen(true)}
                            sx={{ width: 'fit-content' }}
                        >
                            Create Event
                        </Button>
                    </Stack>
                </MainCard>

                <EventModal open={open} onClose={() => setOpen(false)} />
            </>
        );
    }

    // ==============================|| MAIN RENDER ||============================== //
    return (
        <>
            <MainCard content={false} title="">
                {/* Header */}
                <Stack direction="row" sx={{ justifyContent: 'space-between', p: 3 }}>
                    <Typography variant="h4">All Events</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpen(true)}
                    >
                        Create Event
                    </Button>
                </Stack>

                {/* Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((group) => (
                                <TableRow key={group.id}>
                                    {group.headers.map((header) => (
                                        <TableCell key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanSort() && (
                                                <HeaderSort column={header.column} />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>

                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider />

                {/* Pagination */}
                <Box sx={{ p: 2 }}>
                    <TablePagination
                        setPageSize={table.setPageSize}
                        setPageIndex={table.setPageIndex}
                        getState={table.getState}
                        getPageCount={table.getPageCount}
                    />
                </Box>
            </MainCard>

            {/* Create Event Modal */}
            <EventModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
