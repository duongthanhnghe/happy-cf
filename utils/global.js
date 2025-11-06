import { showSuccess, showWarning } from "./toast";
export const Loading = (value) => {
  if (value == true) {
    document.getElementById("loader").classList.add("active");
  }
  else {
    document.getElementById("loader").classList.remove("active");
  }
}

export const formatCurrency = (number) => {
  const value = typeof number === 'string' ? parseFloat(number) : number;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
}

export function formatDateTime(
  iso,
  locale = 'vi-VN',
  showTime = true
) {
  if (!iso) return ''

  const date = typeof iso === 'string' ? new Date(iso) : iso
  const hasTime = typeof iso === 'string' && /T|\d{2}:\d{2}/.test(iso)

  const options = hasTime && showTime === true
    ? {
        day:    '2-digit',
        month:  '2-digit',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh',
      }
    : {
        day:   '2-digit',
        month: '2-digit',
        year:  'numeric',
        timeZone: 'Asia/Ho_Chi_Minh',
      }

  return new Intl.DateTimeFormat(locale, options).format(date)
}

export const scrollIntoView = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

export const setCookie = (name, value, days = 7) => {
  if (!process.client) return null;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
}

export const getCookie = (name) => {
  if (!process.client) return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(c.substring(nameEQ.length, c.length));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export const getCurrentDateTime = (type) => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  if (type === 'date') {
    return `${year}-${month}-${day}`;
  } else if (type === 'time') {
    return `${hours}:${minutes}`;
  } else if (type === 'datetime') {
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } else {
    return null;
  }
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export const copyText = (text) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess("Đã copy thành công!");
    }).catch(err => {
      console.error("Không thể copy: ", err);
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showSuccess("Đã copy thành công!");
    } catch (err) {
      console.error("Không thể copy bằng fallback: ", err);
    }
    document.body.removeChild(textarea);
  }
};

export const downloadImage = async (filename) => {
  try {
    const response = await fetch(filename)
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename || 'image.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(objectUrl)
  } catch (error) {
    console.error('Download failed:', error)
    showWarning('Không thể tải ảnh. Vui lòng thử lại.')
  }
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e') 
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
