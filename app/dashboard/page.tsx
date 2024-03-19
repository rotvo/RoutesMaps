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
import Mapa from '../ui/Mapa';
import 'leaflet/dist/leaflet.css';



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
  const [selecteVehicle, setselecteVehicle] = useState({} as any);
  const columns = [
    { id: 'plate', label: 'Plate', width: 130 },
    { id: 'numero_economico', label: 'Economic Number', width: 150 },
    { id: 'type', label: 'Type', width: 130 },
    {
      id: 'status',
      label: 'Status',
      width: 130,
      format: (value: any) => (value ? 'Activo' : 'Inactivo'),
    },
    { id: 'brand', label: 'Brand', width: 130 },
    { id: 'model', label: 'Model', width: 130 },
    { id: 'year', label: 'year', width: 130 },
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
        setselecteVehicle(response.data);
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

  function onchangeForm(e: any) {
    const { name, value } = e.target;
    setselecteVehicle({
      ...selecteVehicle,
      [name]: value,
    });
    console.log(value);
  }

  const recorrido = [
[25.561110, -103.518540],
[25.561550, -103.517950],
[25.558710, -103.514910],
[25.560340, -103.513610],
[25.557400, -103.510520],
[25.556940, -103.509770],
[25.556500, -103.509510],
[25.555990, -103.510080],
[25.556100, -103.510190],
[25.555800, -103.510550]
];

  return (
    <div>
      <div className="my-8 flex">
        <div className=" h-96  basis-2/4 outline  ">
         <Mapa recorrido={recorrido} initialPosition={recorrido[0]} />
        </div>
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
                <Typography variant="h5" component="div" className="mb-4">
                  {selecteVehicle.BRAND}-{selecteVehicle.MODEL}-
                  {selecteVehicle.YEAR}
                </Typography>
                {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Placa
                </Typography> */}

                <form className="mx-auto max-w-md">
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="plate"
                        id="floating_placa"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.plate}
                        required
                      />
                      <label
                        htmlFor="floating_placa"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        placa
                      </label>
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="numero_economico"
                        id="floating_placa"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.numero_economico}
                        required
                      />
                      <label
                        htmlFor="floating_last_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        numero_economico
                      </label>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="vim"
                        id="vim"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.vim}
                        required
                      />
                      <label
                        htmlFor="floating_first_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        vim
                      </label>
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="tipo"
                        id="tipo"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.tipo}
                        required
                      />
                      <label
                        htmlFor="floating_last_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        tipo
                      </label>
                    </div>
                    
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="status"
                        id="status"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.status === true ? 'Activo' : selecteVehicle.status === false ? 'Inactivo' : ''}
                        required
                      />
                      <label
                        htmlFor="floating_first_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        status
                      </label>
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="seats"
                        id="seats"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.seats}
                        required
                      />
                      <label
                        htmlFor="floating_last_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        asientos
                      </label>
                    </div>
                    
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="insurance"
                        id="insurance"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.insurance}
                        required
                      />
                      <label
                        htmlFor="floating_first_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        seguro
                      </label>
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="insurance_number"
                        id="insurance_number"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.insurance_number}
                        required
                      />
                      <label
                        htmlFor="floating_last_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        insurance_number
                      </label>
                    </div>
                    
                  </div>

                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="vim"
                        id="vim"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.vim}
                        required
                      />
                      <label
                        htmlFor="floating_first_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        vim
                      </label>
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                      <input
                        type="text"
                        name="type"
                        id="type"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                        placeholder=""
                        onChange={onchangeForm}
                        value={selecteVehicle.type}
                        required
                      />
                      <label
                        htmlFor="floating_last_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                      >
                        type
                      </label>
                    </div>
                    
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                  >
                    Edit
                  </button>
                </form>

                
              </CardContent>
              <CardActions className='flex flex-row-reverse'>
                <Button className=' end'>Register new car</Button>
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
