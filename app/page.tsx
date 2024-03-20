'use client';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
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
// import Mapa from '@/app/ui/Mapa';
import * as Yup from 'yup';
import 'leaflet/dist/leaflet.css';
import showAlert from './ui/MyAlert';
import { Menu, MenuItem } from '@mui/material';
import dynamic from 'next/dynamic';
const Mapa2 = dynamic(() => import('@/app/ui/Mapa'), {
  ssr: false,
});

interface IColumn {
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export default function Page() {
  const inputRef: any = useRef(null);
  const [vehicles, setvehicles] = useState([]);
  const [loading, setloading] = useState(false);
  const [currentLocationVehicle, setcurrentLocationVehicle] = useState<any>([]);
  console.log(currentLocationVehicle?.currentLocation?.coordinates);
  const [selecteVehicle, setselecteVehicle] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [registerMode, setregisterMode] = useState<any>(null);
  const [recorridoState, setrecorridoState] = useState<any>([
    [25.56111, -103.51854],
    [25.56155, -103.51795],
    [25.55871, -103.51491],
    [25.56034, -103.51361],
    [25.5574, -103.51052],
    [25.55694, -103.50977],
    [25.5565, -103.50951],
    [25.55599, -103.51008],
    [25.5561, -103.51019],
    [25.5558, -103.51055],
  ]);
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
    { id: 'actions', label: 'actions', width: 130 },
  ];

  useEffect(() => {
    consultarAutos();
  }, []);

  const [filtrosAutos, setfiltrosAutos] = useState({});

  async function actualizarFiltros(nuevosFiltros: any) {
    setfiltrosAutos(nuevosFiltros);
   await consultarAutos();
  }

 async function consultarAutos() {
    setloading(true);
    // Construye los parámetros de consulta a partir de los filtrosAutos
    const queryParams = new URLSearchParams(filtrosAutos).toString();
    const url = `http://localhost:9000/api/vehicles?${queryParams}`;

    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        setvehicles(response.data);
        setloading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setloading(false);
      });
  }

  function fetchMapData(vehicle: any) {
    axios
      .get('http://localhost:9000/api/locations/' + vehicle._id)
      .then((response) => {
        console.log(response.data);
        setcurrentLocationVehicle(response.data);
        setrecorridoState(response.data.currentLocation.coordinates);
        console.log(response.data.currentLocation.coordinates);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  }
  function SearchDataVehicle(vehicle: any) {
    setregisterMode(false);
    fetchMapData(vehicle);
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
    console.log(name, value);
    if (name === 'status') {
      setselecteVehicle({
        ...selecteVehicle,
        [name]: value === 'true' ? true : false,
      });
    } else if (name === 'type') {
      console.log(value);
      setselecteVehicle({
        ...selecteVehicle,
        [name]: value === 'Car' ? 'Car' : 'Truck',
      });
    } else {
      setselecteVehicle({
        ...selecteVehicle,
        [name]: value,
      });
    }
  }

  const validationSchema = Yup.object({
    plate: Yup.string().required('Plate is required'),
    numero_economico: Yup.string().required('Economic Number is required'),
    // telefonoNotaria: Yup.number().required('El telefono es obligatorio'),
  });

  async function updateVehicle() {
    setloading(true);
    axios
      .put(
        'http://localhost:9000/api/vehicles/' + selecteVehicle?._id,
        selecteVehicle,
      )
      .then((response) => {
        console.log(response.data);
        setloading(false);
        consultarAutos();
        showAlert({
          title: 'Sucess!',
          text: 'Operation Successfull!',
          icon: 'success',
        });
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        setloading(false);
        showAlert({
          title: 'Error',
          text: 'There was an error, please try again!',
          icon: 'error',
        });
      });
  }
  async function RegisterVehicle() {
    setloading(true);
    axios
      .post('http://localhost:9000/api/vehicles', selecteVehicle)
      .then((response) => {
        console.log(response.data);
        setloading(false);
        consultarAutos();
        showAlert({
          title: 'Sucess!',
          text: 'Operation Successfull!',
          icon: 'success',
        });
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        setloading(false);
        showAlert({
          title: 'Error',
          text: 'There was an error, please try again!',
          icon: 'error',
        });
      });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log(selecteVehicle);
    try {
      await validationSchema.validate(selecteVehicle, { abortEarly: false });
      if (registerMode) {
        await RegisterVehicle();
      } else {
        await updateVehicle();
      }
    } catch (error: any) {
      const newErrors: any = {};
      console.log(error.inner);
      error.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  }

  function registerModeOn() {
    setselecteVehicle({
      plate: '',
      numero_economico: '',
      vim: '',
      type: '',
      status: true,
      seats: '',
      insurance: '',
      insurance_number: '',
      brand: '',
      model: '',
      year: '',
      color: '',
    });
    setregisterMode(true);
  }
  function deletefunction(vehicleID: any) {
    console.log(vehicleID);
    axios
      .delete('http://localhost:9000/api/vehicles/' + vehicleID._id)
      .then((response) => {
        console.log(response.data);
        consultarAutos();
        showAlert({
          title: 'Sucess!',
          text: 'Operation Successfull!',
          icon: 'success',
        });
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
        showAlert({
          title: 'Error',
          text: 'There was an error, please try again!',
          icon: 'error',
        });
      });
  }
  let array = [[-99.1332, 19.4326]];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="bg-blue-400">
      <div className="mx-4 my-8  flex items-center justify-center 2xl:mx-36 ">
        <div className=" h-[460px]  basis-6/12 outline  ">
          {/* {currentLocationVehicle?.currentLocation?.coordinates ? (<div><Mapa recorrido={array} initialPosition={currentLocationVehicle?.currentLocation?.coordinates[0]} /></div>) : null} */}
          <Mapa2
            recorrido={recorridoState}
            initialPosition={recorridoState[0]}
          />
        </div>
        <div className="flex  basis-4/12 items-center justify-center">
          <div className="" id="3">
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                {registerMode ? (
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Information of the vehicle
                  </Typography>
                ) : null}

                {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Placa
                </Typography> */}
                {selecteVehicle ? (
                  <div>
                    <Typography variant="h6" component="div" className="mb-10">
                      {selecteVehicle?.brand}-{selecteVehicle?.year}-
                      {selecteVehicle?.color}
                    </Typography>
                    <form className="mx-auto max-w-md" onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="group relative z-0 mb-5 w-full">
                          <input
                            type="text"
                            name="plate"
                            id="floating_placa"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                            placeholder=""
                            onChange={onchangeForm}
                            value={selecteVehicle?.plate}
                            ref={inputRef}
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
                            id="numero_economico"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                            placeholder=""
                            onChange={onchangeForm}
                            value={selecteVehicle?.numero_economico}
                            required
                          />
                          <label
                            htmlFor="floating_last_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            Economic Number
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
                            value={selecteVehicle?.vim}
                            minLength={10}
                            maxLength={20}
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
                          <select
                            name="type"
                            id="type"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                            onChange={onchangeForm}
                            value={selecteVehicle?.type}
                          >
                            <option value={undefined}>Select an option</option>
                            <option value={'Car'}>Car</option>
                            <option value={'Truck'}>Truck</option>
                          </select>
                          <label
                            htmlFor="floating_last_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            Type
                          </label>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="group relative z-0 mb-5 w-full">
                          <select
                            name="status"
                            id="status"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                            onChange={onchangeForm}
                            value={selecteVehicle?.status ? 'true' : 'false'}
                          >
                            <option value={'true'}>Activo</option>
                            <option value={'false'}>Inactivo</option>
                          </select>
                          <label
                            htmlFor="floating_first_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            status
                          </label>
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                          <input
                            type="number"
                            name="seats"
                            id="seats"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                            placeholder=""
                            onChange={onchangeForm}
                            value={selecteVehicle?.seats}
                            min="1"
                            max="8"
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
                            value={selecteVehicle?.insurance}
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
                            value={selecteVehicle?.insurance_number}
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
                            name="brand"
                            id="brand"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                            placeholder=""
                            onChange={onchangeForm}
                            value={selecteVehicle?.brand}
                            required
                          />
                          <label
                            htmlFor="floating_first_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            brand
                          </label>
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                          <input
                            type="text"
                            name="model"
                            id="model"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                            placeholder=""
                            onChange={onchangeForm}
                            value={selecteVehicle?.model}
                            required
                          />
                          <label
                            htmlFor="floating_last_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            model
                          </label>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="group relative z-0 mb-5 w-full">
                          <input
                            type="number"
                            name="year"
                            id="year"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                            onChange={onchangeForm}
                            value={selecteVehicle?.year}
                            min="1900"
                            max="2099"
                            required
                          />
                          <label
                            htmlFor="floating_first_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            year
                          </label>
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                          <input
                            type="text"
                            name="color"
                            id="color"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                            placeholder=""
                            onChange={onchangeForm}
                            value={selecteVehicle?.color}
                            required
                          />
                          <label
                            htmlFor="floating_last_name"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                          >
                            color
                          </label>
                        </div>
                      </div>
                      {registerMode === false ? (
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                        >
                          Edit
                        </button>
                      ) : registerMode === true ? (
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                        >
                          save
                        </button>
                      ) : null}
                    </form>
                  </div>
                ) : (
                  <div className="h-96">Seleccione un vehiculo</div>
                )}
              </CardContent>
              <CardActions className="flex flex-row-reverse"></CardActions>
            </Card>
          </div>
        </div>
        {/* <div className="basis-2/12 bg-blue-400">Past trips</div> */}
      </div>

      <div className="my-8 flex items-center justify-center bg-red-400">
        <div
          className="w-full basis-7/12"
          style={{ height: 500, width: '100%' }}
        >
          <div className="flex justify-end p-4">
            
            <div>
      <button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 mx-5'
      >
        Filtros
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => actualizarFiltros({ status: 'false' })}>Inactivos</MenuItem>
        <MenuItem onClick={() => actualizarFiltros({})}>Quitar Filtros</MenuItem>
      </Menu>
    </div>
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={registerModeOn}
            >
              Register New Vehicle
            </button>
          </div>

          <div className="00" id="tabla">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns?.map((column: any, index: any) => (
                        <TableCell
                          key={index}
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
                      .map((row: any, index: any) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column: any) => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  onClick={() => SearchDataVehicle(row)}
                                  key={column.id}
                                  align={column.align}
                                >
                                  {column.id === 'actions' ? (
                                    // Si la columna es 'actions', renderiza un botón
                                    <Button
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        deletefunction(row);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  ) : // De lo contrario, muestra el valor de la celda (posiblemente formateado)
                                  column.format ? (
                                    column.format(value)
                                  ) : (
                                    value
                                  )}
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
        </div>
      </div>
    </div>
  );
}
