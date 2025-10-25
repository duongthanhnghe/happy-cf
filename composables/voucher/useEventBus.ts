import mitt, { type Emitter } from 'mitt';

type VoucherResetData = {
  resetFreeship: boolean;
  resetVoucher: boolean;
};

type Events = {
  'voucher:reset': VoucherResetData;
  'voucher:removed': string;
};

const emitter: Emitter<Events> = mitt<Events>();

export const useEventBus = () => {
  return {
    emit: emitter.emit,
    on: emitter.on,
    off: emitter.off,
  };
};