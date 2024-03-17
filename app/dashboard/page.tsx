'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface IColumn {
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export default function Page() {
  const [vehicles, setvehicles] = useState([]);
  const [loading, setloading] = useState(false);
  const columns = [
    { id: 'placa', label: 'Plate', width: 130 },
    { id: 'numero_economico', label: 'Economic Number', width: 130 },
    { id: 'tipo', label: 'Type', width: 130 },
    {
      id: 'status',
      label: 'Status',
      width: 130,
      format: (value: any) => (value ? 'Activo' : 'Inactivo'),
    },
    { id: 'BRAND', label: 'BRAND', width: 130 },
    { id: 'MODEL', label: 'MODEL', width: 130 },
  ];

  //   function formatStatus (value: boolean) {
  //     if(value == true){
  //       return 'Activo';
  //     } else if (value == false){
  //       return 'Inactivo';
  //     }
  //   }
  useEffect(() => {
    consultarAutos();
  }, [console.log(loading)]);

  function consultarAutos() {
    setloading(true);
    axios
      .get('http://localhost:9000/api/vehicles')
      .then((response) => {
        console.log(response.data);
        setvehicles(response.data);
        setloading(false);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        setloading(false);
      });
  }
  function SearchDataVehicle(vehicle: any) {
    axios
      .get('http://localhost:9000/api/vehicles/' + vehicle._id)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <div className="my-8 flex">
        <div className=" h-96 basis-3/4 bg-red-200">mapa</div>
        <div className="basis-1/4 ">
          <div>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Information of the vehicle
                </Typography>
                <Typography variant="h5" component="div">
                 AA
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  adjective
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className=" basis-1/4" style={{ height: 400, width: '100%' }}>
          {loading == true ? (
            <div className=" ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
                <path
                  fill="none"
                  stroke="#1B9898"
                  stroke-width="15"
                  stroke-linecap="round"
                  stroke-dasharray="300 385"
                  stroke-dashoffset="0"
                  d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    calcMode="spline"
                    dur="2"
                    values="685;-685"
                    keySplines="0 0 1 1"
                    repeatCount="indefinite"
                  ></animate>
                </path>
              </svg>
            </div>
          ) : (
            <div>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column: any) => (
                          <TableCell
                            key={column._id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vehicles
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((row: any) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                            >
                              {columns.map((column: any) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    onClick={() => SearchDataVehicle(row)}
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {column.format
                                      ? column.format(value)
                                      : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={vehicles.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
