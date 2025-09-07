import Swal from 'sweetalert2'
import type { SweetAlertIcon } from "sweetalert2"; 

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const showSuccess = (message: string) => {
  Toast.fire({
    icon: 'success',
    title: message
  })
}

export const showToastError = (message: string) => {
  Toast.fire({
    icon: 'error',
    title: message
  })
}

export const showWarning = (message: string) => {
  Toast.fire({
    icon: 'warning',
    title: message
  })
}

export const showConfirm = async (
  title: string,
  text = '',
  icon: SweetAlertIcon = 'question',
  confirmLabel = 'Có',
  cancelLabel = 'Không',
  onConfirm: () => void = () => {},
  onCancel: () => void = () => {}
): Promise<boolean> => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmLabel,
    cancelButtonText: cancelLabel,
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      confirmButton: 'flex-1 mg-0 button button-shadow button-primary',
      cancelButton: 'flex-1 mg-0 button button-shadow button-gray'
    }
  }).then(result => {
    if (result.isConfirmed) {
      onConfirm()
      return true
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      onCancel()
      return false 
    }
    return false 
  })
}