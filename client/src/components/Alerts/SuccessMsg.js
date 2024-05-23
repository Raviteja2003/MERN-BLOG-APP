import React from 'react'
import Swal from "sweetalert2";
import { resetSuccesAction } from '../../redux/slices/globalSlice/globalSlice';
import { useDispatch } from 'react-redux';

const SuccessMsg = ({message}) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon:"success",
    title:"Good JOB",
    text:message,
  })
  dispatch(resetSuccesAction());
}

export default SuccessMsg