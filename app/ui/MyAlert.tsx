// helpers/showAlert.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const showAlert = ({ title, text, icon }:any) => {
  if (typeof window !== 'undefined') {
    MySwal.fire({
      title,
      text,
      icon,
    });
  }
};

export default showAlert;
