import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';

const CustomDatePicker = ({
  selectedDate,
  onChange,
  placeholder = 'Select a date',
}) => {
  // Eğer selectedDate varsa onu kullan, yoksa takvimi bugünün tarihinden başlat reis
  const parsedDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
  const validDate = selectedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : new Date();

  return (
    <div className="custom-datepicker-wrapper">
      <DatePicker
        selected={validDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy" /* Tam Figma'daki gibi 12/05/2023 formatı */
        minDate={new Date()} /* Geçmiş tarihlerin seçilmesini engelliyoruz */
        placeholderText={placeholder}
        className="modal-date-picker" /* Stil kodlarımız için */
      />
    </div>
  );
};

export default CustomDatePicker;
