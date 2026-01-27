import { useMemo, useState, Fragment, useCallback } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

// third-party
import { LabelKeyObject } from 'react-csv/lib/core';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState
} from '@tanstack/react-table';

// project-imports
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';

import {
    CSVExport,
    DebouncedInput,
    HeaderSort,
    IndeterminateCheckbox,
    RowSelection,
    TablePagination
} from 'components/third-party/react-table';

import EmptyReactTable from 'pages/tables/react-table/empty';
import AlertCustomerDelete from 'sections/apps/customer/AlertCustomerDelete';
import CustomerModal from 'sections/apps/customer/CustomerModal';
import CustomerView from 'sections/apps/customer/CustomerView';

import { useGetCustomer, deleteCustomer } from 'api/customer';
import useFirebase from 'hooks/useFirebase';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { withAlpha } from 'utils/colorUtils';

// types
import { CustomerList } from 'types/customer';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-reactjs';

interface Props {
    columns: ColumnDef<CustomerList>[];
    data: CustomerList[];
    modalToggler: () => void;
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ data, columns, modalToggler }: Props) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: { columnFilters, sorting, rowSelection, globalFilter },
        enableRowSelection: true,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getRowCanExpand: (row) => !!row.original,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const headers: LabelKeyObject[] = useMemo(() => {
        const cols: LabelKeyObject[] = [];
        table.getAllColumns().forEach((column) => {
            const accessorKey = (column.columnDef as { accessorKey?: string }).accessorKey;
            if (accessorKey) {
                cols.push({
                    label: typeof column.columnDef.header === 'string' ? column.columnDef.header : accessorKey,
                    key: accessorKey
                });
            }
        });
        return cols;
    }, [table]);

    return (
        <MainCard content={false}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, justifyContent: 'space-between', p: 3 }}>
                <DebouncedInput
                    value={globalFilter}
                    onFilterChange={(value) => setGlobalFilter(String(value))}
                    placeholder={`Search ${data.length} records...`}
                />

                <Stack direction="row" sx={{ gap: 2 }}>
                    <Button variant="contained" startIcon={<Add />} onClick={modalToggler}>
                        Add Customer
                    </Button>
                    <CSVExport data={data} headers={headers} filename="customer-list.csv" />
                </Stack>
            </Stack>

            <RowSelection selected={Object.keys(rowSelection).length} />

            <TableContainer>
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableCell key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <Stack direction="row" gap={1}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                            </Stack>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <Fragment key={row.id}>
                                <TableRow>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {row.getIsExpanded() && (
                                    <TableRow sx={{ bgcolor: withAlpha('#1976d2', 0.05) }}>
                                        <TableCell colSpan={row.getVisibleCells().length}>
                                            <CustomerView data={row.original} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider />
            <Box sx={{ p: 2 }}>
                <TablePagination
                    setPageSize={table.setPageSize}
                    setPageIndex={table.setPageIndex}
                    getState={table.getState}
                    getPageCount={table.getPageCount}
                />
            </Box>
        </MainCard>
    );
}

// ==============================|| CUSTOMER LIST ||============================== //

export default function Customers() {
    const { db } = useFirebase();
    const { customersLoading: loading, customers } = useGetCustomer();

    const [open, setOpen] = useState(false);
    const [customerModal, setCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | null>(null);
    const [customerDeleteId, setCustomerDeleteId] = useState<string | null>(null);

    const handleDeleteConfirm = useCallback(async () => {
        if (!customerDeleteId) return;

        try {
            await deleteCustomer(db, customerDeleteId);
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setOpen(false);
            setCustomerDeleteId(null);
        }
    }, [customerDeleteId, db]);

    const columns = useMemo<ColumnDef<CustomerList>[]>(() => [
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

        // ✅ FIRESTORE DOCUMENT ID
        {
            header: 'Customer ID',
            accessorKey: 'id'
        },

        {
            header: 'Customer Name',
            accessorKey: 'customerName'
        },

        {
            header: 'Father Name',
            accessorKey: 'customerFather'
        },

        {
            header: 'Contact',
            accessorKey: 'customerContact'
        },

        {
            header: 'Address',
            accessorKey: 'customerAddress'
        },

        {
            header: 'Actions',
            cell: ({ row }) => (
                <Stack direction="row">
                    <IconButton
                        color="primary"
                        onClick={() => {
                            setSelectedCustomer(row.original);
                            setCustomerModal(true);
                        }}
                    >
                        <Edit />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() => {
                            setCustomerDeleteId(row.original.docId);
                            setOpen(true);
                        }}
                    >
                        <Trash />
                    </IconButton>
                </Stack>
            )
        }
    ], [setSelectedCustomer, setCustomerModal, setCustomerDeleteId, setOpen]);

    if (loading) return <EmptyReactTable />;

    return (
        <>
            <ReactTable data={customers} columns={columns} modalToggler={() => setCustomerModal(true)} />

            <AlertCustomerDelete
                title="Delete Customer"
                open={open}
                handleClose={() => setOpen(false)}
                handleConfirm={handleDeleteConfirm}
            />



            <CustomerModal
                open={customerModal}
                modalToggler={setCustomerModal}
                customer={selectedCustomer}
            />
        </>
    );
}
