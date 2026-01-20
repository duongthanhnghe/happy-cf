import Swal from 'sweetalert2'
import type { SweetAlertIcon } from "sweetalert2"; 

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 2000,
  // timer: undefined,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const showAddToCartToast = (payload: {
  image: string
  name: string
  variant?: string
  price: string
  onViewCart?: () => void
}) => {
  Toast.fire({
    icon: undefined,
    html: `
       <div class="text-size-base">
        <div class="text-color-black weight-medium mb-sm">Đã thêm giỏ hàng</div>
        <div class="flex bg-white pd-xs border-default rd-xl flex-1">
          <div class="width-70">
            <img src="${payload.image}" class="width-70 rd-lg" alt="${payload.name}"/>
          </div>
          <div class="flex-1 pd-xs pl-sm">
            <div class="mb-xs weight-medium">
            ${payload.name}
            </div>
            <div class="text-color-gray5 text-size-xs" v-if="item.variantCombination">
              ${
                payload.variant
                  ? `<div class="text-color-gray5">${payload.variant}</div>`
                  : ''
              }
            </div>
            <div class="mt-xs text-color-gray5">${payload.price}</div>
          </div>
        </div>
        <a class="cart-toast__btn button button-gray button-border-none button-size-md mt-sm width-full">Xem giỏ hàng</a>
      </div>
    `,
    didOpen: (toast) => {
      toast
        .querySelector('.cart-toast__btn')
        ?.addEventListener('click', () => {
          payload.onViewCart?.()
          Swal.close()
        })
    },
  })
}


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